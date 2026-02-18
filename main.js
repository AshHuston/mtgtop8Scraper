import { startChronJobs } from "./chronjobs.js";
import { run as runChecksAndSend } from './runChecks.js'
import { sendMessage } from './discordBot.js'

// Currently not using my own chron jobs. Because I don't want to pay to host this somwhere. So I am very hack-ily just calling from OnTheStack. https://github.com/AshHuston/OnTheStack/blob/master/onthestack/server/chronjobs.js
//startChronJobs()

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.post("/run-checks", async (req, res) => {
    try {
        runChecksAndSend().then(result => {
            sendMessage(result)
            return res.status(200).json({
                success: true,
                data: result
            });
        } )
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message || "Internal Server Error"
        });
  }
});

app.listen(PORT, () => {
    console.log("Server running at https://mtgtop8scraper.onrender.com/");
});
