const client = require("./client");
const indices = require("./indices");

const createIndices = async (opts) => {
    for (let ind of indices) {
        const body = await client.indices.create({
            index: ind.name,
            mappings: {
                properties: {
                    img_url: {
                        type: "text",
                        store: true,
                        index: false,
                    },
                    page_content: {
                        type: "text",
                    },
                    page_description: {
                        type: "text",
                        store: true,
                        index: false,
                    },
                    page_title: {
                        type: "text",
                        store: true,
                    },
                    page_url: {
                        type: "text",
                        store: true,
                        index: false,
                    },
                },
            },
            settings: {
                index: {
                    similarity: {
                        default: {
                            type: ind.scoringModel,
                        },
                    },
                },
            },
        });

        console.log(body);
    }
};

(async () => {
    try {
        await createIndices();
        console.log("Successfully created indices!");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
