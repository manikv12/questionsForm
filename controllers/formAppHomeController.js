const config = require("../config");
const CosmosClient = require('@azure/cosmos').CosmosClient
const QuestionsDao = require('../models/questionsDao');


// Make a new instance of the Cosmos Client
const makeCosmosClient = async () => {
    //Todo App:
    const cosmosClient = new CosmosClient({
        endpoint: config.endpoint,
        key: config.key
    })
    const questionsDao = new QuestionsDao(cosmosClient, config.databaseId, config.containerId)
    questionsDao
        .init(err => {
            console.error(err)
        })
        .catch(err => {
            console.error(err)
            console.error(
                'Shutting down because there was an error settinig up the database.'
            )
            process.exit(1)
        })

    return questionsDao
}

// Functions for the routes

// ----------------Hompage----------------
// Homepage
const formAppController_home = (req, res) => {
    res.render('index');
}

// Hompage Post request
const formAppController_homePost = async (req, res) => {
    const questionsDao = await makeCosmosClient();
    const { Category, Difficulty, Question, Options, Answer } = req.body;
    const optionsArr = Options.split(";");
    const newQuestion = {
        category: Category,
        difficulty: Difficulty,
        question: Question,
        options: optionsArr,
        answer: Answer
    }
    questionsDao.addItem(newQuestion)
    res.render('index');
}

module.exports = {
    formAppController_home,
    formAppController_homePost
}