import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";

import Card from "./Card";
import ConjunctionSwitch from "./ConjunctionSwitch";
import ModelSelector from "./ModelSelector";
import SearchBar from "./SearchBar";

const getTheme = (mode) => createTheme({ palette: { mode } });

const App = () => {
    const [input, setInput] = useState("");
    const [debouncedInput, setDebouncedInput] = useState("");
    const [model, setModel] = useState("okapi");
    const [isConjunction, setIsConjunction] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState("");

    const searchQuery = async (query) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URI}/search/query?page=${
                    page + 1
                }&resultsPerPage=${rowsPerPage}`,
                {
                    query,
                    model,
                    operator: isConjunction ? "and" : "or",
                }
            );
            setResults(data.results);
            setTotalCount(data.total);
            setLoading(false);
            if (data.results.length === 0) setResultText("No results found!");
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const searchFuzzy = async (query) => {
        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URI}/search/fuzzy`,
                {
                    query,
                    model,
                    operator: isConjunction ? "and" : "or",
                }
            );
            setSuggestions(data.results.map((res) => res.title));
        } catch (error) {
            console.log(error);
        }
    };

    const handleModelChange = (e) => {
        setModel(e.target.value);
    };

    const handleConjunctionChange = (e) => {
        setIsConjunction(e.target.checked);
    };

    const handlePageChange = (e, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleValueChange = (e, newValue) => {
        try {
            if (e.target.value) {
                searchQuery(newValue);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e, newInput) => {
        setInput(newInput);
    };

    const handleOnSubmit = (e) => {
        if (e.key === "Enter" && e.target.value) {
            try {
                searchQuery(e.target.value);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleMouseClick = (e) => {
        if (input !== "") {
            searchQuery(e.target.innerHTML);
        }
    };

    useEffect(() => {
        if (debouncedInput !== "") {
            searchQuery(debouncedInput);
        }
    }, [model, isConjunction, page, rowsPerPage]);

    useEffect(() => {
        let timer = setTimeout(() => {
            setDebouncedInput(input);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [input]);

    useEffect(() => {
        if (debouncedInput !== "") {
            searchFuzzy(debouncedInput);
        }
    }, [debouncedInput]);

    return (
        <ThemeProvider theme={getTheme("dark")}>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                    width: "95%",
                    height: "auto",
                    mx: "auto",
                    my: "1%",
                }}
            >
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    sx={{
                        width: "90%",
                        height: "auto",
                        marginBottom: "2em",
                        marginTop: "1em",
                        p: 0.5,
                        borderRadius: "4px",
                        backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? "#262B32" : "#fff",
                    }}
                >
                    <Grid item sx={{ width: "60%" }}>
                        <SearchBar
                            input={input}
                            suggestions={suggestions}
                            handleValueChange={handleValueChange}
                            handleInputChange={handleInputChange}
                            handleOnSubmit={handleOnSubmit}
                            handleMouseClick={handleMouseClick}
                        />
                    </Grid>
                    <Grid item sx={{ width: "20%" }}>
                        <ModelSelector
                            val={model}
                            handleChange={handleModelChange}
                        />
                    </Grid>
                    <Grid item sx={{ width: "20%" }}>
                        <ConjunctionSwitch
                            checked={isConjunction}
                            switchHandler={handleConjunctionChange}
                        />
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mx: "auto", my: "auto" }}
                    rowSpacing={1}
                >
                    {loading && <CircularProgress color="inherit" />}
                    {!loading && results.length === 0 && (
                        <Typography variant="h5">{resultText}</Typography>
                    )}
                    {!loading &&
                        results.length > 0 &&
                        results.map((result) => (
                            <Grid item container key={result.id}>
                                <Card {...result} />
                            </Grid>
                        ))}
                </Grid>
                <Grid
                    item
                    sx={{
                        width: "40%",
                        marginTop: "1em",
                        borderRadius: "4px",
                        backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? "#262B32" : "#fff",
                    }}
                >
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        sx={{ display: "flex", justifyContent: "center" }}
                        variant="outlined"
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default App;
