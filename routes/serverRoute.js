const express = require('express');
const modelController = require('./../controller/serverController');

const router = express.Router();

router.use(express.json());

router.route('/').post(modelController.postModel);

router.route('/db').get(modelController.getAllModels).delete(modelController.deleteAllModels);

router.route('/delete').delete(modelController.deleteAllUsers);

router.route('/bulk').post(modelController.postBulk);

module.exports = router;
