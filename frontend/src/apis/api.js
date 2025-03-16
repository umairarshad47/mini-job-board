import { Try } from "@mui/icons-material";
import axios from "axios";

const axiosInstance = axios.create({ baseURL: "http://localhost:5001/api", withCredentials: true });

export const registerApi = async (name, email, password) => {
    try {
        const { data } = await axiosInstance.post("/auth/register", { name, email, password });
        return data;
    } catch (error) {
        return error.response;
    }
}

export const loginApi = async (email, password) => {
    try {
        const { data } = await axiosInstance.post("/auth/login", { email, password });
        return data;
    } catch (error) {
        return error.response;
    }
}

export const logoutApi = async () => {
    try {
        const { data } = await axiosInstance.post("/auth/logout");
        return data;
    } catch (error) {
        return error.response;
    }
}

export const verifyTokenApi = async () => {
    try {
        const { data } = await axiosInstance.get("/auth/verify-token", { withCredentials: true });
        return data;
    } catch (error) {
        return error.response;
    }
}

export const createJobApi = async (title, company, description, skills) => {
    try {
        const { data } = await axiosInstance.post("/jobs/create-job", {
            title,
            company,
            description,
            skills,
        });

        return data;
    } catch (error) {
        return error.response;
    }
}

export const fetchJobsApi = async (page, searchQuery) => {
    try {
        const url = searchQuery.trim() ? `/jobs/fetch-jobs?page=${page}&searchQuery=${searchQuery}` : `/jobs/fetch-jobs?page=${page}`;
        const { data } = await axiosInstance.get(url);
        return data;
    } catch (error) {
        return error.response;
    }
}

export const editJobApi = async (title, company, description, skills, jobId) => {
    try {
        console.log({ title, company, description, skills, jobId });
        const { data } = await axiosInstance.post("/jobs/edit-job", {
            title,
            company,
            description,
            skills,
            jobId,
        });

        return data;
    } catch (error) {
        console.log("error: ", error);
        return error.response;
    }
}

export const deleteJobApi = async (jobId) => {
    try {
        const { data } = await axiosInstance.post("/jobs/delete-job", { jobId });
        return data;
    } catch (error) {
        return error.response;
    }
}

export const applyToJobApi = async (jobId, name, email, resumeLink) => {
    try {
        const { data } = await axiosInstance.post("/jobs/apply-job", { jobId, name, email, resumeLink });
        return data;
    } catch (error) {
        return error.response;
    }
}

export const fetchUserJobsApi = async () => {
    try {
        const { data } = await axiosInstance.get("/jobs/user-jobs");
        return data;
    } catch (error) {
        return error.response;
    }
}

export const fetchUserNotifications = async () => {
    try {
        const { data } = await axiosInstance.get("/jobs/user-notifications");
        return data;
    } catch (error) {
        return error.response;
    }
}