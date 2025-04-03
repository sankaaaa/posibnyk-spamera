const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
const Email = require('./models/Email');
require('dotenv').config();

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/emailDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('views'));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find();
        res.json(emails);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Помилка отримання email-ів'});
    }
});

app.get('/:id', async (req, res) => {
    console.log('Request received for ID:', req.params.id);
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({error: 'Email не знайдено'});
        }
        res.sendFile(path.join(__dirname, 'views', 'edit.html'));
    } catch (err) {
        res.status(500).json({error: 'Помилка при отриманні email'});
    }
});

app.get('/api/email/:id', async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({error: 'Email не знайдено'});
        }
        res.json(email);
    } catch (err) {
        res.status(500).json({error: 'Помилка при отриманні email'});
    }
});

app.put('/:id', async (req, res) => {
    const {firstName, lastName, email} = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({error: 'Всі поля обов\'язкові'});
    }

    try {
        const updatedEmail = await Email.findByIdAndUpdate(
            req.params.id,
            {firstName, lastName, email},
            {new: true}
        );

        if (!updatedEmail) return res.status(404).json({error: 'Email не знайдено'});

        res.json(updatedEmail);
    } catch (err) {
        res.status(500).json({error: 'Помилка при оновленні email'});
    }
});

app.post('/emails', async (req, res) => {
    const {firstName, lastName, email} = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({error: 'Всі поля обов\'язкові'});
    }

    try {
        const newEmail = new Email({firstName, lastName, email});
        await newEmail.save();
        res.status(201).json(newEmail); // Відправляємо створений email назад
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Помилка при додаванні email'});
    }
});

app.delete('/emails/:id', async (req, res) => {
    try {
        const email = await Email.findByIdAndDelete(req.params.id);
        if (!email) {
            return res.status(404).json({error: 'Email не знайдено'});
        }
        res.status(200).json({message: 'Email успішно видалено'});
    } catch (err) {
        res.status(500).json({error: 'Помилка при видаленні email'});
    }
});

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', async (req, res) => {
    const {to, message} = req.body;

    if (!to || !message) {
        return res.status(400).json({error: 'Всі поля обов\'язкові'});
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        text: message
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({message: 'Email успішно надіслано', info});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Помилка при відправці email'});
    }
});

app.listen(8888, () => console.log('Server running on port 8888'));