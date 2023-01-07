const { Client } = require("@elastic/elasticsearch");

const client = new Client({
    cloud: { id: process.env.CLOUDID },
    auth: {
        // username: process.env.USERNAME,
        // password: process.env.PASSWORD,
        apiKey: process.env.API_KEY,
    },
});

(async () => {
    try {
        await client.ping();
        console.log("Connected to Elasticsearch!");
    } catch (error) {
        console.error("Elasticsearch is not connected.");
    }
})();

module.exports = client;
