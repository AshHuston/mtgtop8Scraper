import { startChronJobs } from "./chronjobs.js";
import { run } from './runChecks.js'
import { sendMessage } from './discordBot.js'

//sendMessage(await run())
// Gotta figuire out how to mak ethe bot take a promisew and wait for it
startChronJobs()
