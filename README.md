# Search Engine

A search engine that takes keyword queries as input and retrieves a ranked list of relevant results as output. It scraps a few thousand pages from the seed Wiki page: [List of Marvel Cinematic Universe films](https://en.wikipedia.org/wiki/List_of_Marvel_Cinematic_Universe_films) and uses [**Elasticsearch**](https://www.elastic.co/elasticsearch/) for a full-text search engine. On top of the elasticsearch framework, it has a search portal built with [React.js](https://reactjs.org/) and [Node.js](https://nodejs.org/en/) that allows to give the input query and show the retrieved results.

## Features

-   Cleaning and pre-processing of the scrapped data
-   Proper visualization of the ranked list of pages that hold the relevant answers
-   Support for Okapi BM-25 and LM-Dirichlet scoring model
-   Query keyword suggestions based on Levenshtein edit distance
-   Support for both disjunctive and conjunctive keyword queries
-   A configuration window for users to choose any of the scoring models and the number of results to show on the result page

## License

[MIT](LICENSE)

## Author

<a href="https://github.com/Smile040501">
    <img
        src="https://avatars.githubusercontent.com/u/62458127?v=4&s=150"
        alt="Mayank Singla"
        width="150px"
        style="border-radius:7px"
    />
</a>

**Mayank Singla**

-   [**GitHub**][github]
-   [**LinkedIn**][linkedin]

[github]: https://github.com/Smile040501
[linkedin]: https://www.linkedin.com/in/mayank-singla-001pt
