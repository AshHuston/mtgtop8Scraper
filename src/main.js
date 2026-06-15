import { startChronJobs } from "./chronjobs.js";
import { run as runChecksAndSend } from './runChecks.js'
import { sendMessage } from './discordBot.js'

startChronJobs()

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const start = Date.now();

  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`
  );

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `→ ${res.statusCode} ${req.method} ${req.originalUrl} (${duration}ms)`
    );
  });

  next();
});

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

// This is to make manual testing/posting easier
app.get("/run-checks", async (req, res) => {
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
    console.log(`Server running at localhost:${PORT}`);
});
