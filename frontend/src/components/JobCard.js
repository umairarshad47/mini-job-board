import { DeleteForever, EditNote } from "@mui/icons-material";
import { Button, Card, CardContent, Chip, Grid, Typography } from "@mui/material";

const JobCard = (props) => {
    const { applyable, applied, index, setApplyModal, applyModal, setSelectedJobId,
        title, description, company, skills, _id, userPost, handleEditJob, handleDeleteJob
    } = props;
    
    return (
        <Card key={index} style={{ margin: "20px", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
            <CardContent>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
                >
                    <Typography style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{title}</Typography>
                    {userPost ? "" :
                        applied ? <Chip label="Applied" color="success" variant="outlined" />
                            :
                            applyable &&
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginTop: "10px" }}
                                onClick={() => {
                                    setApplyModal(!applyModal)
                                    setSelectedJobId(_id)
                                }}
                            >
                                Apply
                            </Button>}
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography style={{ fontSize: "1.2rem", color: "#555", marginBottom: "8px" }}>{company}</Typography>
                    {userPost && applyable &&
                        <>
                            <div
                                style={{ cursor: "pointer", marginLeft: "5px" }}
                                onClick={() => handleEditJob(title, company, description, skills, _id)}
                            >
                                <EditNote fontSize="medium" color="info" />
                            </div>
                            <div
                                onClick={() => handleDeleteJob(_id)}
                                style={{ cursor: "pointer", marginLeft: "5px" }}
                            >
                                <DeleteForever fontSize="medium" color="error" />
                            </div>
                        </>
                    }
                </div>
                <Typography variant="body2" color="textSecondary">
                    {description.substring(0, 200) + "..."}
                </Typography>
                <Grid container spacing={1} style={{ marginTop: "10px" }}>
                    {skills.map((skill, index) => (
                        <Grid item key={index}>
                            <Chip label={skill} color="primary" variant="outlined" />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default JobCard;