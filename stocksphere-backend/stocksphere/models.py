from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # admin atau user

class Barang(Base):
    __tablename__ = 'barang'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    stock = Column(Integer, default=0)

class Request(Base):
    __tablename__ = 'requests'
    id = Column(Integer, primary_key=True)
    userEmail = Column(String, nullable=False)
    barangId = Column(Integer, ForeignKey('barang.id'), nullable=False)
    barangName = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(String, nullable=False, server_default='pending')