const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const session = require("express-session");
const cors = require('cors'); // Import CORS
const routes = require("./routes/index");
const helmet = require('helmet');
require('dotenv').config();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN })); // Mengizinkan ke origin frontend kamu.
app.use(bodyParser.json()); // Menguraikan permintaan JSON dari body request
app.use(bodyParser.urlencoded({ extended: true })); // Menguraikan permintaan URL-encoded
app.use(helmet());
// app.use(rateLimit({
    // windowMs: process.env.RATE_LIMIT_WINDOW_MS, // 15 menit
//     max: 100, // Batasi setiap IP hingga 100 permintaan per 15 menit
//     standardHeaders: true,
//     legacyHeaders: false,
// }));
// app.use(session({
    //     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { 
    //         secure: process.env.NODE_ENV === 'production',
    //         maxAge: 5 * 60 * 1000,  // Session expires in 5 minutes
    //         httpOnly: true, // 4. Mencegah akses cookie dari JavaScript sisi klien
    //         sameSite: 'lax' // 5. Melindungi dari serangan CSRF
    //     }, 
// }));

// --- Routes API ---
app.use("/", routes); // Gunakan routes yang sudah dibuat

// Mulai server
const PORT = process.env.PORT || 5000; // Port untuk backend
app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});