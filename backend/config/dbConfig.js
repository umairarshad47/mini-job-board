const mongoose = require("mongoose");
const Job = require("../models/Job");  

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Db connected successfully");
    } catch (error) {
        console.log("Db connectivity error: ", error.message);
    }
}

async function migrateJobs() {
    try {
        // Update all existing documents to include the applyIds field
        const result = await Job.updateMany(
            { applyIds: { $exists: false } },
            { $set: { applyIds: [] } }
        );

        console.log(`Migration complete! Updated ${result.nModified} documents.`);
        mongoose.connection.close();
    } catch (error) {
        console.error("Migration failed:", error);
        mongoose.connection.close();
    }
}

// migrateJobs();

module.exports = connectDb;