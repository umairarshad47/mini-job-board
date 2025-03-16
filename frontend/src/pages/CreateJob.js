import React, { useEffect } from "react"
import { useState } from "react"
import { Box, Paper, Typography, TextField, Button, Chip, Divider, Container } from "@mui/material"
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material"
import { toast } from "react-toastify"
import { createJobApi, editJobApi } from "../apis/api"
import { useNavigate } from "react-router-dom"
import DocumentTitle from '../components/DocumentTitle';
import { useJobContext } from "../context/JobContext"

export default function CreateJob() {
    const navigate = useNavigate();
    const { handleSelectedJob, selectedJob } = useJobContext()
    const [isEditMode, setIsEditMode] = useState(Boolean(selectedJob))

    const [formData, setFormData] = useState({
        title: selectedJob?.title || "",
        company: selectedJob?.company || "",
        description: selectedJob?.description || "",
        skills: selectedJob?.skills || [],
    })

    const [skillInput, setSkillInput] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedJob) {
            setIsEditMode(true)
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.toLowerCase().trim())) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()],
            }))
            setSkillInput("")
        } else {
            toast.info("Skill already added!")
            setSkillInput("")
        }
    }

    const handleRemoveSkill = (skillToRemove) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove),
        }))
    }

    const handleJobPost = async () => {
        setLoading(true);
        try {
            const { title, company, description, skills } = formData;

            const resp = await createJobApi(title, company, description, skills);

            if (resp.status == 200) {
                toast.success("Job Successfully Posted!")
                navigate("/jobs-listing");
            }
        } catch (error) {
            toast.error("Something went wrong!. Please try again")
        } finally {
            setLoading(false)
        }
    }

    const handleEditJob = async () => {
        setLoading(true);
        try {
            const { title, company, description, skills } = formData;
            const jobId = selectedJob.jobId;

            console.log("Editing job with ID:", jobId);
            console.log("Form data:", formData);

            const resp = await editJobApi(title, company, description, skills, jobId);

            if (resp.status == 200) {
                toast.success("Job Successfully Edited!")
                navigate("/jobs-listing");

                setTimeout(() => handleSelectedJob(null), 100);
            }
        } catch (error) {
            console.error("Edit job error:", error);
            toast.error("Something went wrong!. Please try again")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            style={{
                backgroundColor: "#f5f7fa",
                minHeight: "100vh",
                padding: "24px",
            }}
        >
            <DocumentTitle title={isEditMode ? "Edit Job" : "Create Job"} />
            <Container maxWidth="sm">
                <Paper
                    style={{
                        padding: "32px",
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        style={{
                            fontWeight: 700,
                            marginBottom: "24px",
                            color: "#0f172a",
                            textAlign: "center",
                        }}
                    >
                        {isEditMode ? "Edit Job Posting" : "Create Job Posting"}
                    </Typography>

                    <Divider style={{ margin: "0 0 32px" }} />

                    <Box style={{ marginBottom: "24px" }}>
                        <Typography
                            variant="subtitle1"
                            style={{
                                fontWeight: 600,
                                marginBottom: "8px",
                                color: "#334155",
                            }}
                        >
                            Job Title*
                        </Typography>
                        <TextField
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Frontend Developer"
                            fullWidth
                            variant="outlined"
                        />
                    </Box>

                    <Box style={{ marginBottom: "24px" }}>
                        <Typography
                            variant="subtitle1"
                            style={{
                                fontWeight: 600,
                                marginBottom: "8px",
                                color: "#334155",
                            }}
                        >
                            Company*
                        </Typography>
                        <TextField
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="e.g. Tech Solutions Inc."
                            fullWidth
                            variant="outlined"
                        />
                    </Box>

                    <Box style={{ marginBottom: "24px" }}>
                        <Typography
                            variant="subtitle1"
                            style={{
                                fontWeight: 600,
                                marginBottom: "8px",
                                color: "#334155",
                            }}
                        >
                            Job Description*
                        </Typography>
                        <TextField
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the job responsibilities, requirements, and other details..."
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={6}
                        />
                    </Box>

                    <Box style={{ marginBottom: "32px" }}>
                        <Typography
                            variant="subtitle1"
                            style={{
                                fontWeight: 600,
                                marginBottom: "8px",
                                color: "#334155",
                            }}
                        >
                            Skills Required*
                        </Typography>

                        <Box
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "16px",
                            }}
                        >
                            <TextField
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="e.g. React"
                                fullWidth
                                variant="outlined"
                                style={{ marginRight: "8px" }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddSkill}
                                disabled={!skillInput.trim()}
                                style={{
                                    backgroundColor: "#0284c7",
                                    minWidth: "40px",
                                    height: "56px",
                                }}
                            >
                                <AddIcon />
                            </Button>
                        </Box>

                        <Box
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                            }}
                        >
                            {formData.skills.map((skill, index) => (
                                <Chip
                                    key={index}
                                    label={skill}
                                    onDelete={() => handleRemoveSkill(skill)}
                                    deleteIcon={<CloseIcon style={{ fontSize: "16px" }} />}
                                    style={{
                                        backgroundColor: "#e0f2fe",
                                        color: "#0284c7",
                                        fontWeight: 500,
                                        padding: "4px 0",
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        style={{
                            backgroundColor: "#0284c7",
                            padding: "12px",
                            fontWeight: 500,
                            textTransform: "none",
                            fontSize: "16px",
                        }}
                        onClick={isEditMode ? handleEditJob : handleJobPost}
                        disabled={loading}
                    >
                        {isEditMode ? "Edit Job Posting" : "Create Job Posting"}
                    </Button>
                </Paper>
            </Container>
        </Box>
    )
}