const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user storage (untuk demo)
// Catatan: Password untuk pengguna awal tidak di-hash untuk tujuan demonstrasi.
// Pengguna baru yang mendaftar akan memiliki password yang di-hash.
const users = [
    {
        "email": "kangaroo@mail.com",
        "password": "123456",
        "username": "Kangaroo12",
        "createdAt": "2025-07-01T10:00:00Z"
    },
    {
        "email": "koala@mail.com",
        "password": "abcdef",
        "username": "KoalaGirl",
        "createdAt": "2025-07-02T11:30:00Z"
    }
];

// Fungsi untuk registrasi pengguna baru
exports.register = async (req, res) => {
    // Mengambil data dari body request yang dikirim oleh RegisterModal.jsx
    const { email, password, confirmPass } = req.body;

    // Validasi input dasar
    if (!email || !password || !confirmPass) {
        return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
    }
    if (password !== confirmPass) {
        return res.status(400).json({ success: false, message: 'Password dan konfirmasi password tidak cocok.' });
    }

    // Cek jika email sudah ada
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Buat username dari email (sebelum tanda @)
    const username = email.split('@')[0];

    // Simpan pengguna baru ke dalam array (simulasi database)
    users.push({ 
        email, 
        password: hashedPassword, 
        username, // Menambahkan username
        createdAt: new Date().toISOString() 
    });
    
    console.log("Pengguna baru ditambahkan:", users.at(-1));
    return res.status(201).json({ success: true, message: 'Registrasi berhasil. Silakan login.' });
};

// Fungsi untuk login pengguna
exports.login = async (req, res) => {
    try {
        // Mengambil email dan password dari body request yang dikirim oleh LoginModal.jsx
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
        }

        const user = users.find((u) => u.email === email);
        if (!user) {
            return res.status(401).json({ success: false, message: "Email atau password salah." });
        }

        // Cek password: coba bcrypt.compare, jika gagal, coba perbandingan plain text (untuk user demo)
        const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
        if (!isMatch && user.password !== password) {
             return res.status(401).json({ success: false, message: "Email atau password salah." });
        }
        
        // Buat token sederhana yang berisi email
        const token = `token-${user.email}-${Date.now()}`;

        // Set token sebagai httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Gunakan secure cookie di produksi
            sameSite: "lax",
            path: "/",
        });

        return res.json({
            success: true,
            message: "Login berhasil.",
            user: { 
                email: user.email,
                username: user.username // Mengirim username ke frontend
            },
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
};

// Fungsi untuk memeriksa status login pengguna (dipanggil oleh useAuth)
exports.me = (req, res) => {
    try {
        const token = req.cookies && req.cookies.token;
        console.log("ME ENDPOINT CALLED, TOKEN:", token);
        if (!token) {
            return res.status(401).json({ isLoggedIn: false, user: null });
        }

        const tokenParts = token.split("-");
        const email = tokenParts[1];

        const user = users.find((u) => u.email === email);

        if (!user) {
            return res.status(401).json({ isLoggedIn: false, user: null });
        }

        return res.json({
            isLoggedIn: true,
            user: {
                email: user.email,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("ME ENDPOINT ERROR:", error);
        return res.status(500).json({ isLoggedIn: false, user: null });
    }
};