import { Work } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { logoutApi } from "../apis/api";
import { useJobContext } from "../context/JobContext";

const Navbar = () => {
    const { isAuthenticated } = useJobContext();

    const handleLogout = async () => {
        try {
            const resp = await logoutApi();

            if (resp.status == 200) {
                window.location.href = "/";
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again.")
        }
    }

    const handleProfile = () => {
        window.location.href = "/profile";
    }

    return (
        <AppBar
            position="sticky"
            style={{
                backgroundColor: "white",
                color: "#333",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                padding: "15px"
            }}
        >
            <Box
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{
                    display: "flex",
                    alignItems: "center",
                }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="job board icon"
                        style={{
                            color: "#1976d2",
                        }}
                    >
                        <Work />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        style={{
                            fontWeight: 700,
                            color: "#1976d2",
                        }}
                        onClick={() => window.location.href = "/jobs-listing"}
                    >
                        Job Board
                    </Typography>
                </div>

                {isAuthenticated ? (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <Button size="small" variant="contained" onClick={handleLogout}>
                            Logout
                        </Button>
                        <Button size="small" variant="contained" onClick={handleProfile} style={{ margin: "0px 10px" }}>
                            Profile
                        </Button>
                    </div>
                ) : (
                    <Button variant="contained" href="/">
                        Login
                    </Button>
                )}
            </Box>
        </AppBar >
    )
}

export default Navbar;