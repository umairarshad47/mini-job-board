import { useEffect, useState } from "react"
import { fetchUserJobsApi } from "../apis/api"
import { toast } from "react-toastify"
import { CircularProgress } from "@mui/material"
import JobCard from "../components/JobCard"

const Profile = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            setLoading(true)

            const resp = await fetchUserJobsApi()
            setJobs(resp.jobs)
            setLoading(false)
        } catch (error) {
            toast.error("Something went wrong! Please try again.")
        }
    }

    return (
        loading ?
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "30px" }}>
                <CircularProgress />
            </div>
            :
            <div>
                {jobs.length > 0 &&
                    <>
                        <h1 style={{ textAlign: "center", marginTop: "30px" }}>Your Job Listings</h1>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <div style={{
                                maxWidth: "650px",
                            }}>
                                {jobs.map(({ title, description, company, skills, _id, userPost, applied }, index) => (
                                    <JobCard
                                        applyable={false}
                                        applied={applied}
                                        index={index}
                                        title={title}
                                        description={description}
                                        company={company}
                                        skills={skills}
                                        _id={_id}
                                        userPost={userPost}
                                    />
                                ))
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
    )
}

export default Profile;