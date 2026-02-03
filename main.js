
export function getEventForThisDate()
const url = 'https://mtgtop8.com/search'

const params = new URLSearchParams();

// competitiveness checkboxes
params.append("compet_check[P]", "1");

// date filters
params.append("date_start", "16/5/2014");
params.append("date_end", "18/5/2014");


const response = await fetch("https://mtgtop8.com/search", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0",
    "Referer": "https://mtgtop8.com/search",
    "Origin": "https://mtgtop8.com"
  },
  body: params.toString()
});

const html = await response.text();

console.log(html)