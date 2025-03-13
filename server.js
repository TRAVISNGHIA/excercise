const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const keywordRoutes = require("./routes/keyword");
const locationRoutes = require("./routes/location");
const resultLogRoute = require("./routes/resultLog");
const resultRoutes = require("./routes/result");
const urlMatchRoutes = require("./routes/url");

dotenv.config();

const app = express();
const port = 2000;


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(" Connected to MongoDB"))
    .catch(err => console.error(" MongoDB connection error:", err));


app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/keywords", keywordRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/resultLogs", resultLogRoute);
app.use("/api/results", resultRoutes);
app.use("/api/urls", urlMatchRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
