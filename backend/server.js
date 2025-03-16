require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/dbConfig");

connectDB();

const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000',  // Your React app URL
        credentials: true,  // Allow cookies to be sent
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));

app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}`));