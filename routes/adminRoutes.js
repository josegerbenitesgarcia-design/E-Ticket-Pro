const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const eventController = require('../controllers/eventController');

router.get('/users', adminController.getAllUsers);
router.get('/users/:id/details', adminController.getUserDetails);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/create', adminController.createUser);

router.get('/events', adminController.getAllEventsAdmin);
router.delete('/events/:id', eventController.deleteEvent);

router.get('/sales', adminController.getAllSales);

module.exports = router;