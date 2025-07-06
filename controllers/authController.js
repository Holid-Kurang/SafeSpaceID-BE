const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user storage (for demo purposes)
const users = [];

exports.register = async (req, res) => {
    const { email, password } = req.body;
    console.log("isi body", req.body);
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    console.log(users);
    return res.json({ success: true, message: 'Registrasi berhasil.' });
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Email tidak ditemukan.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Password salah.' });
    }
    const token = jwt.sign({ email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token });
}