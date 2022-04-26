// @ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient
const debug = require('debug')('question:QuestionsDao');
const config = require('../config');


// For simplicity we'll set a constant partition key
const partitionKey = config.partitionKey;
class QuestionsDao {
    /**
    * Manages reading, adding, and updating Tasks in Cosmos DB
    * @param {CosmosClient} cosmosClient
    * @param {string} databaseId
    * @param {string} containerId
    */
    constructor(cosmosClient, databaseId, containerId) {
        this.client = cosmosClient
        this.databaseId = databaseId
        this.collectionId = containerId

        this.database = null
        this.container = null
    }

    async init() {
         debug('Setting up the database...')
        this.client.databases.createIfNotExists({
            id: this.databaseId
        })
        this.database = this.client.database(this.databaseId);
         debug('Setting up the database...done!')
         debug('Setting up the container...')
        this.database.containers.createIfNotExists({
            id: this.collectionId
        })
        this.container = this.database.container(this.collectionId)
         debug('Setting up the container...done!')
    }

    async find(querySpec) {
        debug('Querying for items from the database')
        if (!this.container) {
            throw new Error('Collection is not initialized.')
        }
        const { resources } = await this.container.items.query(querySpec).fetchAll()
        return resources
    }

    async addItem(item) {
        debug('Adding an item to the database')
        item.date = Date.now()
        item.completed = false
        const { resource: doc } = await this.container.items.create(item)
        return doc
    }

    async updateItem(itemId) {
        debug('Update an item in the database')
        const doc = await this.getItem(itemId)
        doc.completed = true

        const { resource: replaced } = await this.container
            .item(itemId, partitionKey)
            .replace(doc)
        return replaced
    }

    async getItem(itemId) {
        debug('Getting an item from the database')
        const { resource } = await this.container.item(itemId, partitionKey).read()
        return resource
    }
}

module.exports = QuestionsDao