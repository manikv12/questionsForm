// route module.

var express = require('express');
var router = express.Router();

var QuestionsDao 
var formAppController = require('../controllers/formAppHomeController')

// Home page route.
router.get('/', formAppController.formAppController_home)
router.post('/', formAppController.formAppController_homePost)

module.exports = router;