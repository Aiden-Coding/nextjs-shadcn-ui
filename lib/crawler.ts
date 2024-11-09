// lib/crawler.ts
import axios from "axios";
import * as cheerio from "cheerio";

export async function crawlWebsite(url: string): Promise<string[]> {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // 抓取所有的标题
    const titles: string[] = [];
    $("h1, h2, h3, h4, h5, h6").each((_, el) => {
      titles.push($(el).text().trim());
    });

    return titles;
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return [];
  }
}
