const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Tambahkan require untuk cookie-parser
const cookieParser = require('cookie-parser'); 
const routes = require("./routes/index");

// --- Middleware ---

// 1. Konfigurasi CORS yang Diperbaiki
// Mengizinkan origin frontend dan mengizinkan pengiriman kredensial (cookie)
app.use(cors({ 
    origin: process.env.CORS_ORIGIN, // Pastikan ini adalah URL frontend Anda, misal: 'http://localhost:3000'
    credentials: true 
}));

// 2. Gunakan cookieParser
// Middleware ini penting agar server bisa membaca `req.cookies`
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));

// 3. Hapus express-session
// Middleware ini tidak diperlukan karena authController.js Anda menggunakan token manual,
// bukan sesi berbasis server. Menggunakan keduanya akan menimbulkan konflik.
/*
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax'
    }, 
}));
*/


// --- Routes API ---
app.use("/", routes);

// Mulai server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});