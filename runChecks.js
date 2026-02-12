import * as sf from './scryfall.js'
import { getFullEventReport } from './mtgtop8scaper.js'
import { findArticlesOnDate } from './articles.js'

async function getDateReport(date){ 
  let dateReport = ''
  dateReport += await sf.createSetReleaseReport(date) + '\n'
  dateReport += await getFullEventReport(date) + '\n'
  dateReport += findArticlesOnDate(date) + '\n'
  return dateReport
}

async function runLastXYears(numOfYears, increment=5, baseDate = new Date()) {
  const day = String(baseDate.getDate()).padStart(2, "0");
  const month = String(baseDate.getMonth()+1).padStart(2, "0");
  const currentYear = baseDate.getFullYear();
  let finalReport = ''
  for (let i = increment; i < numOfYears; i+=increment) {
    const year = currentYear - i;
    if (year < 1993) {break;} //Magic was released in 1993, so we can stop there
    const formatted = `${day}/${month}/${year}`;
    const report = await getDateReport(formatted)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (report && report.trim() !== '') {
        finalReport += `## ${i} years ago today - ` + `${months[month-1]} ${day} ${year}` + ':\n' + report.trim() + '\n\n';
    }
  }
  return finalReport
}

export function run() {
  runLastXYears(100).then(report => {
    console.log(report)
  })
}
