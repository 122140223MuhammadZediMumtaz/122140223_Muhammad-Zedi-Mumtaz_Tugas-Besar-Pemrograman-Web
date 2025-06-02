from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from pyramid.view import view_config
from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.httpexceptions import HTTPUnauthorized
from functools import wraps

from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

from .models import Base, Barang, User, Request
from .cors import cors_tween_factory

SECRET_KEY = 'secretstocksphere'  # Ganti dengan secret key aman di production

def main(global_config, **settings):
    config = Configurator(settings=settings)

    engine = engine_from_config(settings, 'sqlalchemy.')
    Base.metadata.bind = engine
    DBSession = sessionmaker(bind=engine)
    config.registry['dbsession_factory'] = DBSession

    config.add_tween('stocksphere.cors.cors_tween_factory')

    # Routes Barang
    config.add_route('barang_list', '/api/barang')
    config.add_route('barang_detail', '/api/barang/{id}')
    config.add_view(barang_list, route_name='barang_list', renderer='json', request_method='GET')
    config.add_view(barang_create, route_name='barang_list', renderer='json', request_method='POST')
    config.add_view(barang_detail, route_name='barang_detail', renderer='json', request_method='GET')
    config.add_view(barang_update, route_name='barang_detail', renderer='json', request_method='PUT')
    config.add_view(barang_delete, route_name='barang_detail', renderer='json', request_method='DELETE')

    # Routes Auth
    config.add_route('register', '/api/register')
    config.add_route('login', '/api/login')
    config.add_view(register_view, route_name='register', renderer='json', request_method='POST', permission=NO_PERMISSION_REQUIRED)
    config.add_view(login_view, route_name='login', renderer='json', request_method='POST', permission=NO_PERMISSION_REQUIRED)

    # Routes Request
    config.add_route('request', '/api/request')
    config.add_route('request_detail', '/api/request/{id}')
    config.add_view(request_list, route_name='request', renderer='json', request_method='GET')
    config.add_view(request_create, route_name='request', renderer='json', request_method='POST')
    config.add_view(request_update, route_name='request_detail', renderer='json', request_method='PUT')
    config.add_view(request_delete, route_name='request_detail', renderer='json', request_method='DELETE')

    config.add_route('change_password', '/api/change-password')
    config.add_view(change_password_view, route_name='change_password', renderer='json', request_method='POST')

    return config.make_wsgi_app()


def get_token_auth(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise HTTPUnauthorized('Missing Authorization Header')

    parts = auth_header.split()
    if parts[0].lower() != 'bearer' or len(parts) != 2:
        raise HTTPUnauthorized('Invalid Authorization Header')

    token = parts[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPUnauthorized('Token expired')
    except jwt.InvalidTokenError:
        raise HTTPUnauthorized('Invalid token')


def requires_auth(role=None):
    def decorator(view):
        @wraps(view)
        def wrapped_view(request, *args, **kwargs):
            payload = get_token_auth(request)
            if role and payload.get('role') != role:
                raise HTTPUnauthorized('Insufficient permissions')
            request.user = payload
            return view(request, *args, **kwargs)
        return wrapped_view
    return decorator


# ===== CRUD Barang =====

@view_config(route_name='barang_list', request_method='GET', renderer='json')
@requires_auth()
def barang_list(request):
    session = request.registry['dbsession_factory']()
    barangs = session.query(Barang).all()
    data = [{'id': b.id, 'name': b.name, 'stock': b.stock} for b in barangs]
    session.close()
    return {'status': 'success', 'data': data}


@view_config(route_name='barang_list', request_method='POST', renderer='json')
@requires_auth(role='admin')
def barang_create(request):
    session = request.registry['dbsession_factory']()
    try:
        data = request.json_body
        name = data.get('name')
        stock = data.get('stock', 0)

        barang = Barang(name=name, stock=stock)
        session.add(barang)
        session.commit()

        return {'status': 'success', 'data': {'id': barang.id, 'name': barang.name, 'stock': barang.stock}}
    except Exception as e:
        session.rollback()
        return {'status': 'error', 'message': str(e)}
    finally:
        session.close()


@view_config(route_name='barang_detail', request_method='GET', renderer='json')
@requires_auth()
def barang_detail(request):
    session = request.registry['dbsession_factory']()
    id = request.matchdict.get('id')
    barang = session.query(Barang).get(id)
    session.close()
    if barang:
        return {'status': 'success', 'data': {'id': barang.id, 'name': barang.name, 'stock': barang.stock}}
    return {'status': 'error', 'message': 'Barang tidak ditemukan'}


@view_config(route_name='barang_detail', request_method='PUT', renderer='json')
@requires_auth(role='admin')
def barang_update(request):
    session = request.registry['dbsession_factory']()
    id = request.matchdict.get('id')
    barang = session.query(Barang).get(id)
    if not barang:
        session.close()
        return {'status': 'error', 'message': 'Barang tidak ditemukan'}

    try:
        data = request.json_body
        barang.name = data.get('name', barang.name)
        barang.stock = data.get('stock', barang.stock)
        session.commit()
        return {'status': 'success', 'data': {'id': barang.id, 'name': barang.name, 'stock': barang.stock}}
    except Exception as e:
        session.rollback()
        return {'status': 'error', 'message': str(e)}
    finally:
        session.close()


@view_config(route_name='barang_detail', request_method='DELETE', renderer='json')
@requires_auth(role='admin')
def barang_delete(request):
    session = request.registry['dbsession_factory']()
    id = request.matchdict.get('id')
    barang = session.query(Barang).get(id)
    if not barang:
        session.close()
        return {'status': 'error', 'message': 'Barang tidak ditemukan'}
    try:
        session.delete(barang)
        session.commit()
        return {'status': 'success', 'message': 'Barang berhasil dihapus'}
    except Exception as e:
        session.rollback()
        return {'status': 'error', 'message': str(e)}
    finally:
        session.close()


# ===== Auth: Register dan Login =====

@view_config(route_name='register', request_method='POST', renderer='json', permission=NO_PERMISSION_REQUIRED)
def register_view(request):
    session = request.registry['dbsession_factory']()
    try:
        data = request.json_body
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'user')

        if session.query(User).filter_by(email=email).first():
            return {'status': 'error', 'message': 'Email sudah terdaftar'}

        hashed_password = generate_password_hash(password)
        user = User(email=email, password=hashed_password, role=role)
        session.add(user)
        session.commit()

        return {'status': 'success', 'message': 'User berhasil registrasi'}
    except Exception as e:
        session.rollback()
        return {'status': 'error', 'message': str(e)}
    finally:
        session.close()


@view_config(route_name='login', request_method='POST', renderer='json', permission=NO_PERMISSION_REQUIRED)
def login_view(request):
    session = request.registry['dbsession_factory']()
    try:
        data = request.json_body
        email = data.get('email')
        password = data.get('password')

        user = session.query(User).filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return {'status': 'error', 'message': 'Email atau password salah'}

        payload = {
            'user_id': user.id,
            'email': user.email,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return {'status': 'success', 'token': token}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    finally:
        session.close()


# ===== Request API =====

@view_config(route_name='request', request_method='GET', renderer='json')
@requires_auth()
def request_list(request):
    session = request.registry['dbsession_factory']()
    user_role = request.user.get('role')
    user_email = request.user.get('email')

    if user_role == 'admin':
        requests = session.query(Request).all()
    else:
        requests = session.query(Request).filter_by(userEmail=user_email).all()

    data = [{
        'id': r.id,
        'barangId': r.barangId,
        'barangName': r.barangName,
        'quantity': r.quantity,
        'userEmail': r.userEmail,
        'status': r.status,
    } for r in requests]

    session.close()
    return {'status': 'success', 'data': data}


@view_config(route_name='request', request_method='POST', renderer='json')
@requires_auth()
def request_create(request):
    session = request.registry['dbsession_factory']()
    try:
        data = request.json_body
        userEmail = request.user.get('email')
        barangId = data.get('barangId')
        barangName = data.get('barangName')
        quantity = data.get('quantity')

        barang = session.query(Barang).get(barangId)
        if not barang:
            return {'status': 'error', 'message': 'Barang tidak ditemukan'}

        if quantity <= 0:
            return {'status': 'error', 'message': 'Jumlah harus lebih dari 0'}

        if barang.stock < quantity:
            return {'status': 'error', 'message': f'Stok tidak mencukupi. Stok tersedia: {barang.stock}'}

        new_request = Request(
            userEmail=userEmail,
            barangId=barangId,
            barangName=barangName,
            quantity=quantity,
            status='pending'
        )
        session.add(new_request)
        session.commit()

        return {'status': 'success', 'message': 'Request berhasil dibuat'}
    except Exception as e:
        session.rollback()
        return {'status': 'error', 'message': str(e)}
    finally:
        session.close()


@view_config(route_name='request_detail', request_method='PUT', renderer='json')
@requires_auth(role='admin')
def request_update(request):
    session = request.registry['dbsession_factory']()
    try:
        id = request.matchdict.get('id')
        new_status = request.json_body.get('status')

        req = session.query(Request).get(id)
        if not req:
            session.close()
            return {'status': 'error', 'message': 'Request tidak ditemukan'}

        # Update stok barang hanya saat status berubah ke 'shipped' dari status lain
        if new_status == 'shipped' and req.status != 'shipped':
            barang = session.query(Barang).get(req.barangId)
            if not barang:
                session.close()
                return {'status': 'error', 'message': 'Barang tidak ditemukan'}

            if barang.stock < req.quantity:
                session.close()
                return {'status': 'error', 'message': 'Stok barang tidak mencukupi untuk pengiriman'}

            barang.stock -= req.quantity

        req.status = new_status
        session.commit()

        return {'status': 'success', 'message': 'Status request diperbarui'}
    except Exception as e:
        session.rollback()
        return {'status': 'error', 'message': str(e)}
    finally:
        session.close()


@view_config(route_name='request_detail', request_method='DELETE', renderer='json')
@requires_auth()
def request_delete(request):
    session = request.registry['dbsession_factory']()
    try:
        id = request.matchdict.get('id')
        req = session.query(Request).get(id)
        if not req:
            session.close()
            return {'status': 'error', 'message': 'Request tidak ditemukan'}

        if request.user.get('role') != 'admin' and req.userEmail != request.user.get('email'):
            session.close()
            return {'status': 'error', 'message': 'Tidak punya akses menghapus request ini'}

        session.delete(req)
        session.commit()

        return {'status': 'success', 'message': 'Request berhasil dihapus'}
    except Exception as e:
        session.rollback()
        return {'status': 'error', 'message': str(e)}
    finally:
        session.close()

@view_config(route_name='change_password', request_method='POST', renderer='json')
@requires_auth()
def change_password_view(request):
    session = request.registry['dbsession_factory']()
    try:
        data = request.json_body
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')
        user_email = request.user.get('email')

        if not old_password or not new_password:
            return {'status': 'error', 'message': 'Old password dan new password wajib diisi'}

        user = session.query(User).filter_by(email=user_email).first()
        if not user:
            return {'status': 'error', 'message': 'User tidak ditemukan'}

        if not check_password_hash(user.password, old_password):
            return {'status': 'error', 'message': 'Password lama salah'}

        # Hash password baru
        hashed_new_password = generate_password_hash(new_password)
        user.password = hashed_new_password

        session.commit()
        return {'status': 'success', 'message': 'Password berhasil diubah'}
    except Exception as e:
        session.rollback()
        return {'status': 'error', 'message': str(e)}
    finally:
        session.close()