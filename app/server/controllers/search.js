const HttpError = require("../models/httpError");
const preProcessQuery = require("../utils/preProcess");
const client = require("../elasticsearch/client");

const searchQuery = async (req, res, next) => {
    try {
        const { query, model, operator } = req.body;
        const { page, resultsPerPage } = req.query;
        const processedQuery = preProcessQuery(query);
        const results = await client.search({
            index: `wikipedia_${model}`,
            body: {
                query: {
                    multi_match: {
                        query: processedQuery,
                        fields: ["page_title^2", "page_content"],
                        operator,
                    },
                },
                track_total_hits: true,
                from: (page - 1) * resultsPerPage,
                size: resultsPerPage,
                stored_fields: [
                    "page_url",
                    "page_title",
                    "page_description",
                    "img_url",
                ],
            },
        });

        res.json({
            total: results.hits.total.value,
            results: results.hits.hits.map((hit) => ({
                id: hit._id,
                pageUrl: hit.fields.page_url[0],
                imgUrl: hit.fields.img_url[0],
                title: hit.fields.page_title[0],
                description: hit.fields.page_description[0],
            })),
        });
    } catch (err) {
        const error = new HttpError(err.message, 500);
        next(error);
    }
};

const searchFuzzy = async (req, res, next) => {
    try {
        const { query, model, operator } = req.body;
        const results = await client.search({
            index: `wikipedia_${model}`,
            body: {
                query: {
                    multi_match: {
                        query,
                        fields: ["page_title", "page_content"],
                        operator,
                        fuzziness: "AUTO",
                    },
                },
                track_total_hits: true,
                size: 50,
                stored_fields: ["page_title"],
            },
        });

        res.json({
            results: results.hits.hits
                .map((hit) => ({
                    id: hit._id,
                    title: hit.fields.page_title[0],
                }))
                .filter(
                    (val, idx, self) =>
                        self.findIndex((res) => res.title == val.title) === idx
                ),
        });
    } catch (err) {
        const error = new HttpError(err.message, 500);
        next(error);
    }
};

module.exports = {
    searchQuery,
    searchFuzzy,
};
