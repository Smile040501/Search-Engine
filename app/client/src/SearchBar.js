import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const SearchBar = ({
    input,
    suggestions,
    handleValueChange,
    handleInputChange,
    handleOnSubmit,
    handleMouseClick,
}) => {
    return (
        <Autocomplete
            freeSolo
            id="search-query"
            sx={{ width: "90%", mx: "auto", my: "auto" }}
            options={suggestions}
            filterOptions={(x) => x}
            onChange={handleValueChange}
            inputValue={input}
            onInputChange={handleInputChange}
            autoComplete
            disableClearable
            includeInputInList
            ListboxProps={{
                onClick: handleMouseClick,
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search"
                    margin="normal"
                    type="search"
                    onKeyDown={handleOnSubmit}
                    InputProps={{
                        ...params.InputProps,
                        type: "search",
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default SearchBar;
