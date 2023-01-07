const client = require("./client");
const indices = require("./indices");
const finalData = require("../../../scraped_data/final_data.json");

const indexData = async (opts) => {
    console.log("Indexing Data...");

    for (let data of finalData) {
        for (let ind of indices) {
            const body = await client.index({
                index: ind.name,
                body: data,
            });
            console.log(body);
        }
    }
};

(async () => {
    try {
        await indexData();
        console.log("Successfully indexed all the data!");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
