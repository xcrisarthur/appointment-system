````markdown
# Appointment System

Sistem manajemen janji temu berbasis **Express.js (Backend)** dan **React.js (Frontend)**.  
Proyek ini menggunakan **MySQL** sebagai database serta mendukung migrasi dan seeder menggunakan **Sequelize**.

---

## 🚀 Fitur
- Autentikasi user dengan JWT
- Manajemen janji temu
- Migrasi & seeder database dengan Sequelize
- Frontend React terintegrasi dengan backend

---

## 📦 Persiapan

### 1. Buat Database MySQL
Pastikan MySQL sudah terinstall dan berjalan.  
Buat database baru dengan nama:
```sql
CREATE DATABASE `appointment-system`;
````

---

## 🔧 Backend (appointment-system-be)

### 1. Clone Repository

```bash
git clone https://github.com/xcrisarthur/appointment-system.git
cd appointment-system/appointment-system-be
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi `.env`

Buat file `.env` di folder `appointment-system-be` dan isi seperti berikut:

```env
DB_NAME=appointment-system
DB_USERNAME=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306

JWT_SECRET=supersecret
JWT_EXPIRES_IN=1h
PORT=8080
```

### 4. Jalankan Migration & Seeder

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 5. Jalankan Backend

```bash
node app.js
```

Jika berhasil, kamu akan melihat log:

```
✅ Database connected
🚀 Server running on port 8080
```

---

## 🎨 Frontend (appointment-system-fe)

### 1. Pindah ke folder FE

```bash
cd ../appointment-system-fe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Frontend

```bash
npm run dev
```

Secara default, frontend akan jalan di `http://localhost:5173`.

---

## ⚡ Testing

* Backend API bisa diuji dengan **Postman** di `http://localhost:8080/api/...`
* Frontend bisa diakses melalui browser di `http://localhost:5173`

---

## 🛠 Teknologi

* **Backend:** Node.js, Express.js, Sequelize, MySQL
* **Frontend:** React.js, Vite
* **Auth:** JWT

---

## 👨‍💻 Developer

Created by [xcrisarthur](https://github.com/xcrisarthur)

```
