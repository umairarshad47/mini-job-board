import { useEffect, useState } from "react";
import { useJobContext } from "../context/JobContext";
import { Card, CardContent, Chip, Divider, Grid } from "@mui/material";
import { Work } from "@mui/icons-material";
import { CircularProgress } from "@mui/material"

const Notifications = () => {
    const [loading, setLoading] = useState(false);
    const { callNotificationsApi, notifications } = useJobContext();

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            await callNotificationsApi();
            setLoading(false);
        };

        fetchNotifications();
    }, [])

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
                <h1 style={{ textAlign: "center" }}>Notifications</h1>
                {loading ? (
                    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30px" }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <Card style={{ maxWidth: "950px", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                        {notifications?.length ? (
                            notifications.map((not, index) => (
                                <div key={index}>
                                    <Divider />
                                    <CardContent style={{ margin: "0px", padding: "0px" }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Work />
                                            <h2 style={{ marginLeft: "5px" }}>
                                                You Applied as {not.job.title} at {not.job.company}
                                            </h2>
                                        </div>
                                        <Grid container spacing={1} style={{ marginBottom: "10px" }}>
                                            {not.job.skills.map((skill, index) => (
                                                <Grid item key={index}>
                                                    <Chip label={skill} color="success" variant="outlined" />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </div>
                            ))
                        ) : (
                            <p>No notifications available</p>
                        )}
                    </Card>
                )
                }
            </div >
        </div >
    )
}

export default Notifications;