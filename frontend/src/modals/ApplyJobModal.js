import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { applyToJobApi } from "../apis/api";

const ApplyJobModal = ({ open, onClose, jobId, callApiAfterApply }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        resumeLink: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {

        try {
            const resp = await applyToJobApi(jobId, formData.name, formData.email, formData.resumeLink);

            if (resp.status == 200) {
                toast.success("Applied for job successfully!")
                callApiAfterApply()
                onClose();
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again.")
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "400px",
                    backgroundColor: "#fff",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    outline: "none",
                }}
            >
                <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" style={{ fontWeight: 600 }}>Apply for Job</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                        style: { borderRadius: "8px" },
                    }}
                />
                <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                        style: { borderRadius: "8px" },
                    }}
                />
                <TextField
                    label="Resume Link"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleChange}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                        style: { borderRadius: "8px" },
                    }}
                />

                <Box style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                        style={{
                            borderRadius: "8px",
                            padding: "10px 16px",
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        style={{
                            borderRadius: "8px",
                            padding: "10px 16px",
                            fontWeight: 600,
                            backgroundColor: "#007bff",
                            color: "#fff",
                        }}
                    >
                        Apply Now
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ApplyJobModal;