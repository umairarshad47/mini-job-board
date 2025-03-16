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
import DocumentTitle from "../components/DocumentTitle"
import { registerApi } from "../apis/api"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

export default function RegisterScreen() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleRegister = async () => {
        setLoading(true)

        try {
            const resp = await registerApi(formData.name, formData.email, formData.password);

            if (resp.status === 200) {
                toast.success("Successfully registered!");
                navigate("/jobs-listing");
            } else if (resp.data.message == "User already exists") {
                toast.info("User already exists.")
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
            <DocumentTitle title="Register" />
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
                        Don't have an account? Create now.
                    </Typography>

                    <TextField
                        label="Name"
                        name="name"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        style={{ marginTop: "16px", marginBottom: "16px" }}
                        required
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        value={formData.password}
                        onChange={handleChange}
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
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        Create Account
                    </Button>

                    <Typography
                        variant="body2"
                        style={{
                            textAlign: "center",
                            color: "#666",
                        }}
                    >
                        Already have an account?{" "}
                        <Link href="/" underline="hover" style={{ fontWeight: 600 }}>
                            Sign In
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}