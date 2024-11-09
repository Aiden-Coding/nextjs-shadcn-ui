import * as fs from "fs";
import * as path from "path";
import { load } from "cheerio";

/**
 * 获取 JS 文件的路径(从模块所在目录查找)
 * @param name - 文件名
 * @param moduleFile - 模块路径
 * @returns 路径
 */
function _get_js_path(name: string | null = null, moduleFile: string | null = null): string {
  if (!name || !moduleFile) {
    throw new Error("Both name and moduleFile must be provided");
  }

  // 获取模块所在的目录的绝对路径
  const moduleFolder = path.resolve(path.dirname(path.dirname(moduleFile)));

  // 构建到 air 文件夹的路径
  const moduleJsonPath = path.join(moduleFolder, "air", name);

  return moduleJsonPath;
}

/**
 * 获取 JS 文件的内容
 * @param fileName - JS 文件名
 * @returns 文件内容
 */
function _get_file_content(fileName: string = "crypto.js"): string {
  // 确保文件名不为空
  if (!fileName) {
    throw new Error("File name must be provided");
  }

  // 使用 Node.js 的 __filename 来获取当前文件的路径
  const filePath = path.join(path.dirname(path.dirname(__filename)), "air", fileName);

  try {
    // 读取文件内容
    const fileData = fs.readFileSync(filePath, "utf8");
    return fileData;
  } catch (error) {
    // 如果读取文件失败，抛出错误
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

/**
 * 处理 href 节点，检查是否包含特定字符串
 * @param href - 链接字符串
 * @returns 如果 href 包含 'monthdata.php' 则返回该字符串，否则返回 null
 */
function has_month_data(href: string | undefined | null): string | null {
  // 确保 href 参数存在且不为 null 或 undefined
  if (!href) {
    return null;
  }

  // 使用正则表达式来匹配 'monthdata.php'
  const pattern = /monthdata\.php/;
  if (pattern.test(href)) {
    return href;
  }

  return null;
}
// 定义数据结构
interface AirQualityData {
  序号: number;
  省份: string;
  城市: string;
  AQI: number;
  空气质量: string;
  PM2_5浓度: string;
  首要污染物: string;
}
/**
 * 真气网-空气质量历史数据查询-全部城市列表
 * @returns Promise 解析为包含城市空气质量数据的对象数组
 */
export async function air_city_table(): Promise<AirQualityData[]> {
  const url = "https://www.zq12369.com/environment.php";
  const date = "2020-05-01";
  let result: AirQualityData[] = [];

  if (date.split("-").length === 3) {
    const params = new URLSearchParams({
      date: date,
      tab: "rank",
      order: "DESC",
      type: "DAY",
    });

    try {
      const response = await fetch(`${url}?${params}`);
      const html = await response.text();

      // 使用 Cheerio 来解析 HTML
      const $ = load(html);
      const table = $("table").eq(1); // 假设我们需要的是第二个表格

      table.find("tr:not(:first-child)").each((index, row) => {
        const cells = $(row).find("td");
        if (cells.length >= 6) {
          // 确保有足够的列
          result.push({
            序号: index + 1,
            省份: cells.eq(0).text().trim(),
            城市: cells.eq(1).text().trim(),
            AQI: parseInt(cells.eq(2).text().trim(), 10),
            空气质量: cells.eq(3).text().trim(),
            PM2_5浓度: cells.eq(4).text().trim(),
            首要污染物: cells.eq(5).text().trim(),
          });
        }
      });
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
    }
  }

  return result;
}
