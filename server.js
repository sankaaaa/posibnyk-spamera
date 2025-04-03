const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
const Email = require('./models/Email');
require('dotenv').config();

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/emailDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('views')); // Статичні файли (HTML/JS)
app.use(methodOverride('_method'));

// Віддаємо index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ✅ Додаємо маршрут для отримання email-ів
app.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find(); // Отримуємо всі email-и з БД
        res.json(emails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка отримання email-ів' });
    }
});

// Редагування email для показу форми
app.get('/:id', async (req, res) => {
    console.log('Request received for ID:', req.params.id);
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ error: 'Email не знайдено' });
        }
        // Віддаємо HTML сторінку з можливістю редагувати email
        res.sendFile(path.join(__dirname, 'views', 'edit.html'));
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні email' });
    }
});

// Додатково: окремий маршрут для отримання даних email у форматі JSON
app.get('/api/email/:id', async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ error: 'Email не знайдено' });
        }
        res.json(email);  // Відправляємо JSON з даними email
    } catch (err) {
        res.status(500).json({ error: 'Помилка при отриманні email' });
    }
});





// Оновлення email
app.put('/:id', async (req, res) => {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'Всі поля обов\'язкові' });
    }

    try {
        const updatedEmail = await Email.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email },
            { new: true }
        );

        if (!updatedEmail) return res.status(404).json({ error: 'Email не знайдено' });

        res.json(updatedEmail);
    } catch (err) {
        res.status(500).json({ error: 'Помилка при оновленні email' });
    }
});

// Додаємо новий email
app.post('/emails', async (req, res) => {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ error: 'Всі поля обов\'язкові' });
    }

    try {
        const newEmail = new Email({ firstName, lastName, email });
        await newEmail.save();
        res.status(201).json(newEmail); // Відправляємо створений email назад
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка при додаванні email' });
    }
});

// Додаємо маршрут для видалення email
app.delete('/emails/:id', async (req, res) => {
    try {
        const email = await Email.findByIdAndDelete(req.params.id); // Видаляємо email з БД
        if (!email) {
            return res.status(404).json({ error: 'Email не знайдено' });
        }
        res.status(200).json({ message: 'Email успішно видалено' });
    } catch (err) {
        res.status(500).json({ error: 'Помилка при видаленні email' });
    }
});

app.listen(8888, () => console.log('Server running on port 8888'));