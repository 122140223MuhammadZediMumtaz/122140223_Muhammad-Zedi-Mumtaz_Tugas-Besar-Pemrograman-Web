# StockSphere

## Deskripsi Aplikasi Web

StockSphere adalah sebuah aplikasi web yang dikembangkan untuk membantu pengguna dalam mengelola stok barang dan proses pemesanan secara digital dan terorganisir. Aplikasi ini dirancang agar bisnis, khususnya usaha kecil dan menengah, dapat memonitor dan mengatur persediaan barang mereka dengan mudah, menghindari kesalahan pencatatan stok, serta mempercepat proses transaksi pemesanan.

Dengan StockSphere, pengguna dapat melihat daftar barang yang tersedia, menambah stok barang baru, memperbarui informasi barang, dan melakukan pemesanan langsung melalui antarmuka web yang intuitif. Selain itu, aplikasi ini menyediakan sistem autentikasi yang aman untuk melindungi data pengguna dan menjamin hanya pengguna yang berwenang yang dapat mengakses fitur tertentu.

StockSphere dibangun dengan pendekatan arsitektur client-server, di mana frontend (bagian tampilan dan interaksi pengguna) dibuat menggunakan React — sebuah library JavaScript populer untuk membuat antarmuka yang responsif dan interaktif. Sedangkan backend (logika bisnis dan manajemen data) menggunakan Python dengan framework Pyramid yang ringan dan fleksibel. Data disimpan di database PostgreSQL, sebuah sistem manajemen basis data relasional yang handal dan banyak digunakan.

Dengan arsitektur ini, aplikasi mampu bekerja secara efisien, aman, dan mudah dikembangkan di masa depan. Selain itu, pengguna dapat mengakses aplikasi baik melalui desktop maupun perangkat mobile dengan tampilan yang menyesuaikan ukuran layar (responsif).

---

## Dependensi Paket (Library) dan Perangkat Lunak yang Dibutuhkan

Agar aplikasi StockSphere dapat berjalan dengan baik, beberapa perangkat lunak dan pustaka (library) harus diinstal dan dikonfigurasi terlebih dahulu. Berikut adalah rincian lengkapnya:

### Backend (Python - Pyramid Framework)  
- **Python 3.x**  
- **Pyramid**  
- **SQLAlchemy**  
- **Psycopg2-binary**  
- **Alembic**  
- **PyJWT**  
- **Waitress**  

### Frontend (React.js)  
- **Node.js dan npm**  
- **React**  
- **Axios**  
- **React Router**  

### Database  
- **PostgreSQL**  

---

## Fitur Utama Aplikasi

1. Autentikasi Pengguna yang Aman  
2. Manajemen Data Barang dan Stok  
3. Proses Pemesanan Barang Online  
4. Migrasi Database Otomatis dan Terstruktur  
5. Antarmuka Pengguna (UI) yang Responsif dan Intuitif  
6. Dukungan Multi-Platform  

---

## Cara Menjalankan Aplikasi StockSphere

### Persiapan Awal  
Pastikan komputer sudah terpasang Python versi 3.x, Node.js versi terbaru, dan PostgreSQL sudah terinstall dengan database yang dibuat.

### Langkah Menjalankan Backend  

1. Masuk ke direktori backend `stocksphere-backend`.
2. Buat virtual environment Python (opsional tapi direkomendasikan):  
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/MacOS  
    venv\Scripts\activate     # Windows  
    ```
3. Install dependencies Python:  
    ```bash
    pip install -r requirements.txt
    ```
4. Jalankan migrasi database:  
    ```bash
    alembic upgrade head
    ```
5. Mulai server backend:  
    ```bash
    pserve development.ini
    ```
6. Backend berjalan pada `http://localhost:6543`.

---

### Langkah Menjalankan Frontend  

1. Masuk ke direktori frontend `stocksphere-frontend`.
2. Install dependencies frontend:  
    ```bash
    npm install
    ```
3. Jalankan aplikasi frontend:  
    ```bash
    npm start
    ```
4. Aplikasi frontend terbuka otomatis di browser pada `http://localhost:3000`.

---

## Referensi dan Dokumentasi  

- Dokumentasi Pyramid : https://pyramid.readthedocs.io/en/latest/  
- Tutorial React.js : https://reactjs.org/docs/getting-started.html dan https://www.petanikode.com/react-js/  
- Panduan PostgreSQL : https://www.postgresqltutorial.com/id/  
- Dokumentasi Alembic : https://alembic.sqlalchemy.org/en/latest/ 
- Penjelasan JWT : https://medium.com/@nabilalshahriyer/pengenalan-json-web-token-jwt-8704c5930f7e  

---

## Penutup

StockSphere diharapkan dapat menjadi solusi sederhana dan efektif bagi usaha kecil menengah untuk melakukan manajemen stok dan pemesanan dengan teknologi web modern. Dengan memanfaatkan teknologi open source dan arsitektur yang modular, aplikasi ini dapat dikembangkan dan disesuaikan lebih lanjut sesuai kebutuhan pengguna.
