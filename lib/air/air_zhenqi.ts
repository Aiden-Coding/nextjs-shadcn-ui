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

// 定义数据结构
interface AirQualityWatchPointData {
  // 假设这里会有多个字段，根据 API 返回的数据结构来定义
  [key: string]: any;
}

/**
 * 真气网-监测点空气质量-细化到具体城市的每个监测点
 * @param city - 调用 ak.air_city_table() 接口获取
 * @param start_date - e.g., "20190327"
 * @param end_date - e.g., "20200327"
 * @returns Promise 解析为包含指定城市指定日期区间的观测点空气质量数据的对象数组
 */
export async function air_quality_watch_point(
  city: string = "杭州",
  start_date: string = "20220408",
  end_date: string = "20220409"
): Promise<AirQualityWatchPointData[]> {
  // 日期格式转换
  const formatDate = (date: string): string => {
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`;
  };

  start_date = formatDate(start_date);
  end_date = formatDate(end_date);

  const url = "https://www.zq12369.com/api/zhenqiapi.php";
  const appId = "a01901d3caba1f362d69474674ce477f";
  const method = "GETCITYPOINTAVG";

  // 模拟加密函数
  const encodeParam = (param: string): string => {
    // 这里应该使用一个真正的加密方法
    // 由于没有具体的加密算法，我们这里只是简单地返回原字符串
    return param;
  };

  const encodeSecret = (method: string, city: string, start: string, end: string): string => {
    // 这里也应该使用一个真正的加密方法
    // 目前只是简单地将参数拼接
    return `${method}${city}${start}${end}`;
  };

  const payload = {
    appId,
    method: encodeParam(method),
    city: encodeParam(city),
    startTime: encodeParam(start_date),
    endTime: encodeParam(end_date),
    secret: encodeSecret(method, city, start_date, end_date),
  };

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: new URLSearchParams(payload).toString(),
    });
    const data = await response.text();

    // 模拟解密功能，这里只是简单地返回数据
    const decodedData = JSON.parse(data) as { rows: AirQualityWatchPointData[] };

    return decodedData.rows;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    throw error;
  }
}
