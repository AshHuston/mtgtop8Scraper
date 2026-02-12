import fs from "fs";
import path from "path";
import { formatDate } from "./helpers.js";

/**
 * Recursively find all .md files containing a given date in their filename
 * @param {string} folderPath - starting directory
 * @param {string} targetDate - date string like "2007-02-21"
 * @returns {string[]} - array of full paths to matching files
 */
function findFilesByDateRecursive(folderPath, targetDate) {
  let matches = [];

  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      // Recurse into subdirectory
      matches = matches.concat(findFilesByDateRecursive(fullPath, targetDate));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const match = entry.name.match(/\d{4}-\d{2}-\d{2}/);
      if (match && match[0] === targetDate) {
        matches.push(fullPath);
      }
    }
  }

  return matches;
}

function getWaybackLinks(targetDate, folderPath = "./archive") {
  const files = findFilesByDateRecursive(folderPath, targetDate);
  const urls = [];

  const linkRegex = /\[Link to Wayback Machine\]\((.*?)\)/;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const match = content.match(linkRegex);
    if (match) {
      urls.push(match[1]);
    }
  }

  return urls;
}

function getModernLinks(targetDate) {
    return []
}

export function findArticlesOnDate(targetDate) {
    targetDate = formatDate(targetDate)
    const articleUrls = getModernLinks(targetDate).concat(getWaybackLinks(targetDate));
    const filteredUrls = removeStringsContainingAny(articleUrls, [
        '/event-coverage/',
        '/making-magic/',
        '/mtgo-standings/',
        '/magic-online/',
    ]);

    const markdownLinks = filteredUrls.map(url => urlToMarkdown(url));

    return markdownLinks.length ? `### Articles:\n${markdownLinks.join('\n')}` : ''
}

function removeStringsContainingAny(arr, substrings) {
  return arr.filter(str => 
    !substrings.some(sub => str.includes(sub))
  );
}

function urlToMarkdown(url) {
  try {
    // Get the last segment of the path
    const parts = new URL(url).pathname.split("/");
    let slug = parts[parts.length - 1]; // "running-pro-tour-gauntlet-2016-02-10"

    // Remove trailing date if present (YYYY-MM-DD)
    slug = slug.replace(/-\d{4}-\d{2}-\d{2}$/, "");

    // Replace dashes with spaces and capitalize words
    const title = slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Return Markdown
    return `[${title}](${url})`;
  } catch (err) {
    console.error("Invalid URL:", url);
    return url;
  }
}
