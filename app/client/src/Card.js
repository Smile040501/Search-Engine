import ButtonBase from "@mui/material/ButtonBase";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
});

const Card = ({ pageUrl, imgUrl, title, description }) => {
    return (
        <Paper
            sx={{
                p: 1,
                mx: "-0.5%",
                my: "auto",
                maxWidth: "100%",
                flexGrow: 1,
                backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#1A2027" : "#fff",
            }}
        >
            <Grid
                container
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
            >
                <Grid item>
                    <ButtonBase
                        href={pageUrl}
                        target="_blank"
                        rel="noopener"
                        sx={{ width: 180, height: 150 }}
                    >
                        <Img alt={title} src={imgUrl} />
                    </ButtonBase>
                </Grid>
                <Grid item container sx={{ maxWidth: "85%" }}>
                    <Grid
                        item
                        container
                        direction="column"
                        spacing={2}
                        wrap="nowrap"
                    >
                        <Grid item zeroMinWidth>
                            <Link
                                href={pageUrl}
                                color="inherit"
                                underline="hover"
                                target="_blank"
                                rel="noopener"
                            >
                                <Typography
                                    gutterBottom
                                    variant="h4"
                                    component="div"
                                    noWrap
                                >
                                    {title}
                                </Typography>
                            </Link>
                            <Typography variant="body1" gutterBottom noWrap>
                                {description}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Card;
