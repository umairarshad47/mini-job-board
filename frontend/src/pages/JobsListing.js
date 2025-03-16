import { Badge, Button, CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import React, { useCallback, useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { deleteJobApi, fetchJobsApi } from "../apis/api";
import { useJobContext } from "../context/JobContext";
import { toast } from "react-toastify";
import ApplyJobModal from "../modals/ApplyJobModal";
import JobCard from "../components/JobCard";
import debounce from "lodash.debounce";

const JobsListing = () => {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [applyModal, setApplyModal] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState(null)
    const [searchQuery, setSearchQuery] = useState("");
    const { handleSelectedJob, callNotificationsApi, notificationCount } = useJobContext()

    useEffect(() => {
        fetchJobs(page, searchQuery)
    }, [page])

    const callApiAfterApply = async () => {
        fetchJobs(page, searchQuery)
        await callNotificationsApi()
    }

    const fetchJobs = async (pageNumber, searchQuery = "") => {
        setLoading(true);
        try {
            const resp = await fetchJobsApi(pageNumber, searchQuery);
            const { jobs, totalPages } = resp
            setJobs(jobs)
            setTotalPages(totalPages)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value)
    };

    const handleEditJob = (title, company, description, skills, jobId) => {
        handleSelectedJob({ title, company, description, skills, jobId })
        navigate("/create-job")
    }

    const handleDeleteJob = async (jobId) => {
        setJobs(jobs.filter(job => job._id !== jobId))

        try {
            const resp = await deleteJobApi(jobId);

            if (resp.status === 200) {
                fetchJobs(page)

                toast.success("Job deleted successfully!")
            }
        } catch (error) {
            toast.error("Something went wrong! Please try again.")
        }
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        debouncedSearch(e.target.value);
    };

    const debouncedSearch = useCallback(
        debounce((query) => {
            const trimmedQuery = query.trim();
            if (trimmedQuery) {
                fetchJobs(1, trimmedQuery);
            }
        }, 500),
        []
    );

    return (
        loading ?
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30px" }}>
                <CircularProgress />
            </div>
            :
            <div>
                <div style={{ display: "flex", justifyContent: "center", maxWidth: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "610px", padding: "0 20px" }}>
                        <h1 style={{ marginTop: "20px" }}>
                            Job Listings
                        </h1>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => navigate("/notifications")}
                            style={{ marginLeft: "10px" }}
                        >
                            <Badge
                                badgeContent={notificationCount ?? 0}
                                color="secondary"
                            >
                                Notifications
                            </Badge>
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/create-job")}
                        >
                            Create Job
                        </Button>
                    </div>
                </div>
                <div style={{ textAlign: "center", marginBottom: "20px", padding: "0px 20px" }}>
                    <TextField
                        label="Search Jobs by Title, Company, Skill"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        fullWidth
                        style={{ maxWidth: "610px" }}
                    />
                </div>

                {jobs.length > 0 &&
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{
                            maxWidth: "650px",
                        }}>
                            {jobs.map(({ title, description, company, skills, _id, userPost, applied }, index) => (
                                <JobCard
                                    applyable={true}
                                    applied={applied}
                                    index={index}
                                    title={title}
                                    description={description}
                                    company={company}
                                    skills={skills}
                                    _id={_id}
                                    handleEditJob={handleEditJob}
                                    handleDeleteJob={handleDeleteJob}
                                    userPost={userPost}
                                    applyModal={applyModal}
                                    setApplyModal={setApplyModal}
                                    setSelectedJobId={setSelectedJobId}
                                />
                            ))
                            }
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}
                            />
                        </div>
                    </div>
                }

                {applyModal &&
                    <ApplyJobModal
                        open={applyModal}
                        onClose={() => setApplyModal(false)}
                        jobId={selectedJobId}
                        callApiAfterApply={callApiAfterApply}
                    />
                }
            </div>
    );
};

export default JobsListing;