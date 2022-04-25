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


// Routes

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


async function main(){


    // Create a new instance of the Cosmos Client
    const client = new CosmosClient({ endpoint, key });
    
    // Create a new instance of the Questions DAO class
    const questionsDao = new QuestionsDao(client, config.databaseId, config.containerId)
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

    var formApp = require('./routes/formApp.js');
    // Hompage
    app.use('/', formApp);


    // Start server
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })

}

main();