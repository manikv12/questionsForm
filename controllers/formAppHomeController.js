const config = require("../config");
const QuestionsDao = require('../models/questionsDao');

// Functions for the routes

// ----------------Hompage----------------
// Homepage
const formAppController_home = (req, res) => {
    res.render('index');
}
// Hompage Post request
const formAppController_homePost = (req, res) => {
    console.log(req.body);
    res.render('index');
}




module.exports = {
    formAppController_home,
    formAppController_homePost
}