import React from "react"
import { useState } from "react"
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Link,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { loginApi } from "../apis/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export default function LoginScreen() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleLogin = async () => {
        setLoading(true)

        try {
            const resp = await loginApi(email, password);
            
            if (resp.status === 200 || resp.message == "Login Successfully") {
                navigate("/jobs-listing");

            } else if (resp.data.message == "Invalid credentials") {
                toast.info("Invalid Credentials!");
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#f5f5f5",
            }}
        >
            <Card
                style={{
                    maxWidth: "550px",
                    width: "100%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
            >
                <CardContent style={{ padding: "32px" }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        style={{
                            textAlign: "center",
                            marginBottom: "24px",
                            fontWeight: 600,
                        }}
                    >
                        Welcome Back, Login to Your Account.
                    </Typography>


                    <TextField
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: "20px" }}
                        required
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: "16px" }}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        style={{
                            padding: "12px",
                            marginBottom: "24px",
                            backgroundColor: "#1976d2",
                        }}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        Login
                    </Button>


                    <Typography
                        variant="body2"
                        style={{
                            textAlign: "center",
                            color: "#666",
                        }}
                    >
                        Don't have an account?{" "}
                        <Link href="/register" underline="hover" style={{ fontWeight: 600 }}>
                            Sign Up
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}