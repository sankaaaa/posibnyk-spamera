// const express = require('express');
// const Email = require('../models/Email');
// const router = express.Router();
//
// router.get('/', async (req, res) => {
//     try {
//         const emails = await Email.find();
//         res.json(emails);
//     } catch (err) {
//         res.status(500).json({ error: 'Помилка завантаження email-ів' });
//     }
// });
//
// router.get('/:id', async (req, res) => {
//     try {
//         const emailEntry = await Email.findById(req.params.id);
//         if (!emailEntry) return res.status(404).json({ error: 'Email не знайдено' });
//         res.json(emailEntry);
//     } catch (err) {
//         res.status(500).json({ error: 'Помилка отримання email' });
//     }
// });
//
//
//
// router.put('/:id', async (req, res) => {
//     const { firstName, lastName, email } = req.body;
//
//     if (!firstName || !lastName || !email) {
//         return res.status(400).json({ error: 'Всі поля обов\'язкові' });
//     }
//
//     try {
//         const updatedEmail = await Email.findByIdAndUpdate(
//             req.params.id,
//             { firstName, lastName, email },
//             { new: true }
//         );
//
//         if (!updatedEmail) return res.status(404).json({ error: 'Email не знайдено' });
//
//         res.json(updatedEmail);
//     } catch (err) {
//         res.status(500).json({ error: 'Помилка при оновленні email' });
//     }
// });
//
// module.exports = router;
