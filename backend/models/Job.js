const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String }],
    applyIds: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);