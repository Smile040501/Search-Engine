const client = require("./client");
const indices = require("./indices");

const generateApiKeys = async (opts) => {
    const body = await client.security.createApiKey({
        body: {
            name: "wikipedia_app",
            role_descriptors: {
                wikipedia_writer: {
                    cluster: ["monitor"],
                    index: [
                        {
                            names: indices.map((index) => index.name),
                            privileges: [
                                "create_index",
                                "write",
                                "read",
                                "manage",
                            ],
                        },
                    ],
                },
            },
        },
    });

    console.log(body);
    return body.encoded;
};

(async () => {
    try {
        const key = await generateApiKeys();
        console.log(key);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
