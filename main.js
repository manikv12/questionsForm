const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');

// Cosmos Db ImportConfiguration
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const dbContext = require("./data/databaseContext");

// Connect to cosmos db account
const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);

async function main(){

    // Make sure Tasks database is already setup. If not, create it.
    await dbContext.create(client, databaseId, containerId);

    console.log(`Querying container: Items`);

    // query to return all items
    const querySpec = {
        query: "SELECT * from c"
    };

    // read all items in the Items container
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();

    items.forEach(item => {
        console.log(`${item.id} - ${item.options}`);
    });



    var formApp = require('./routes/formApp.js');

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

    app.use(express.static(__dirname + "/public"));
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');



    const port = 3000

    app.use('/', formApp);

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })

}

main();