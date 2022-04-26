const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');

// Cosmos Db ImportConfiguration and model
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const QuestionsDao = require('./models/questionsDao');
// Connect to cosmos db account
const { endpoint, key, databaseId, containerId } = config;


// test


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// express setup
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



// Port number for the server
const port = 3000 || process.env.PORT;


async function main() {


    

    var formApp = require('./routes/formApp.js');

    // Hompage
    app.use('/form', formApp);


    // Start server
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}/form`)
    })

}

main();