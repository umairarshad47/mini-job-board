const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const validateRequest = require("../middleware/validateRequest");
const authenticateJWT = require("../middleware/auth");
const { createJobSchema, applyJobSchema } = require("../validators/jobValidators");
require("dotenv").config();

const router = express.Router();

// create job endpoint
router.post("/create-job", authenticateJWT, validateRequest(createJobSchema), async (req, res) => {
    try {
        const { title, company, description, skills } = req.body;
        const userId = req.user.id;

        const newJob = new Job({
            title,
            company,
            description,
            skills,
            applyIds: [userId.toString()],
            user: userId,
        });

        await newJob.save()

        res.json({ status: 200, message: "Job successfully created!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// fetch jobs endpoint
router.get("/fetch-jobs", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id
        const limit = 5
        const searchQuery = req.query.searchQuery;
        const page = parseInt(req.query.page) || 1
        const skip = (page - 1) * limit

        let filter = {};

        if (searchQuery) {
            filter = {
                $or: [
                    { title: { $regex: searchQuery, $options: "i" } },
                    { company: { $regex: searchQuery, $options: "i" } },
                    { skills: { $regex: searchQuery, $options: "i" } }
                ]
            };
        }

        const jobs = await Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalJobs = await Job.countDocuments()
        const totalPages = Math.ceil(totalJobs / limit)

        // parse jobs and add userPost key to each job object
        const jobsWithUserPost = jobs.map(job => ({
            ...job.toObject(),
            userPost: job.user.toString() === userId,
            applied: job.applyIds.includes(userId),
        }));

        res.json({ jobs: jobsWithUserPost, totalPages })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// edit job endpoint
router.post("/edit-job", authenticateJWT, async (req, res) => {
    try {
        const { title, company, description, skills, jobId } = req.body;
        const userId = req.user.id;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.user.toString() !== userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        job.title = title;
        job.company = company;
        job.description = description;
        job.skills = skills;

        await job.save();

        res.json({ status: 200, message: "Job successfully updated!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// delete job endpoint
router.post("/delete-job", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.user.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: You don't have permission to delete this job" });
        }

        await Job.deleteOne({ _id: jobId });

        res.status(200).json({ status: 200, message: "Job successfully deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// apply to job endpoint
router.post("/apply-job", authenticateJWT, validateRequest(applyJobSchema), async (req, res) => {
    try {
        const userId = req.user.id;
        const { jobId, name, email, resumeLink } = req.body

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const application = new Application({
            job: jobId,
            user: userId,
            name,
            email,
            resumeLink,
        })

        await application.save()

        await Job.findByIdAndUpdate(
            jobId,
            { $push: { applyIds: userId } },
            { new: true }
        );

        res.json({ status: 200, message: "Successfully applied to the job!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// fetch all jobs of specific user
router.get('/user-jobs', authenticateJWT, async (req, res) => {
    try {

        const userId = req.user.id;
        const jobs = await Job.find({ user: userId });

        if (!jobs) {
            return res.status(404).json({ message: "No jobs found for this user" });
        }

        res.json({ status: 200, jobs });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

// get user notifications
router.get('/user-notifications', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const applications = await Application.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("job")
            .exec();
        if (!applications) {
            return res.status(404).json({ message: "No applications found for this user" });
        }

        const applicationCount = await Application.countDocuments({ user: userId });

        res.json({ status: 200, notifications: applications, totalNotifications: applicationCount });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})

module.exports = router;