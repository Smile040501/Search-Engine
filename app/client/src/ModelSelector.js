import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const ModelSelector = ({ val, handleChange }) => {
    return (
        <FormControl
            sx={{
                width: "60%",
                mx: "20%",
                mt: "4%",
            }}
        >
            <InputLabel id="scoringModel">Scoring Model</InputLabel>
            <Select
                labelId="scoringModel"
                id="model"
                value={val}
                autoWidth
                label="Scoring Model"
                onChange={handleChange}
            >
                <MenuItem value="okapi">Okapi BM25</MenuItem>
                <MenuItem value="dirichlet">LM Dirichlet</MenuItem>
            </Select>
        </FormControl>
    );
};

export default ModelSelector;
