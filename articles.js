import { formatDate } from "./helpers.js";
import waybackLinksByDate from "./archive.json" with { type: "json" };

function getModernLinks(targetDate) {
    return []
}

export function findArticlesOnDate(targetDate) {
    targetDate = formatDate(targetDate)
    const articleUrls = getModernLinks(targetDate).concat(waybackLinksByDate[targetDate] || []);
    const markdownLinks = articleUrls.map(url => urlToMarkdown(url));

    return markdownLinks.length ? `### Articles:\n${markdownLinks.join('\n')}` : ''
}

function urlToMarkdown(url) {
  try {
    const parts = new URL(url).pathname.split("/");
    let slug = parts[parts.length - 1];
    slug = slug.replace(/-\d{4}-\d{2}-\d{2}$/, "");
    const title = slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return `[${title}](<${url}>)`;
  } catch (err) {
    console.error("Invalid URL:", url);
    return url;
  }
}
