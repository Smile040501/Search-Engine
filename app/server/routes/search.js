const express = require("express");

const searchController = require("../controllers/search");

const router = express.Router();

router.post("/query", searchController.searchQuery);

router.post("/fuzzy", searchController.searchFuzzy);

module.exports = router;
