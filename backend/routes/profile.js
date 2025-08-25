const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../db/user");
const bcrypt = require('bcrypt');
const router = express.Router();

// Change password for logged-in user
router.put('/change-password', async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).send({ message: 'Old and new password required.' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send({ message: 'User not found.' });
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(400).send({ message: 'Old password is incorrect.' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.send({ message: 'Password changed successfully.' });
    } catch (err) {
        res.status(500).send({ message: 'Error changing password', error: err });
    }
});

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Update user profile (with image)
router.put('/', upload.single('profileImage'), async (req, res) => {
    const userId = req.user.id;
    const update = req.body;
    if (req.file) {
        update.profileImage = '/uploads/' + req.file.filename;
    }
    try {
        const user = await User.findByIdAndUpdate(userId, update, { new: true });
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: "Error updating profile", error: err });
    }
});

module.exports = router;
