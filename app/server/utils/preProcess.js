const path = require("path");
const { execSync } = require("child_process");

const HttpError = require("../models/httpError");

const PYTHON_PATH =
    process.env.NODE_ENV === "production"
        ? "python"
        : process.env.LOCAL_ENV_PYTHON_INTERPRETER_PATH || "python";

const preProcessQuery = (query) => {
    try {
        const pythonProcess = execSync(
            `${PYTHON_PATH} ${path.resolve(
                process.env.PYTHON_SCRIPT_PATH
            )} "${query}"`
        );

        return pythonProcess.toString("utf8");
    } catch (error) {
        console.log(error);
        throw new HttpError("Something went wrong! Please try again!", 500);
    }
};

module.exports = preProcessQuery;
