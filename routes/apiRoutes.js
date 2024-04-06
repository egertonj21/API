const express = require('express');
const controller = require('./../contollers/apiControllers');
const router = express.Router();
const sqlQueries = require('./../queries/queries');


router.post('/login', controller.getUserHashedPassword);
router.post('/add/user', controller.postInsertUser);
router.post('/add/item', controller.postInsertItem);
router.post('/add/brand', controller.postInsertBrand);
router.post('/add/type', controller.postInsertType);
router.post('/add/award', controller.postInsertAward);
router.post('/purchase', controller.postPurchase);
router.post('/updateStatus', controller.postUpdateStatus);

module.exports = router;