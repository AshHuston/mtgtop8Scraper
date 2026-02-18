import cron from 'node-cron'
import { run as runChecksAndSend } from './runChecks.js'
import { sendMessage } from './discordBot.js'

export function startChronJobs(){
    // Every day at 10:30am New York time
    cron.schedule(
        '30 10 * * *', 
        () => {
            console.log('Attempting nostalgia collection.')
            runChecksAndSend().then(result => { sendMessage(`${new Date()}:\n${result}`) } )
        },
        {
            timezone: 'America/New_York'
        }
    )

    // Every minute
    cron.schedule('* * * * *', async () => {
        console.log('Server healthy', new Date())
    })
}
