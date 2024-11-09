import { load } from "cheerio";
import { encode_param, Base64, encode_secret, decode_result, hex_md5 } from "./crypto";

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
  const result: AirQualityData[] = [];

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

  const city_param = encode_param(city);
  const payload = {
    appId,
    method: encode_param(method),
    city: city_param,
    startTime: encode_param(start_date),
    endTime: encode_param(end_date),
    secret: encode_secret(method, city_param, start_date, end_date),
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
    const decodedData = JSON.parse(decode_result(data)) as { rows: AirQualityWatchPointData[] };

    return decodedData.rows;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    throw error;
  }
}
import * as path from "path";

import * as fs from "fs";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadAndExecuteJS(functionName: string, ...args: any[]) {
  const jsContent = fs.readFileSync(
    path.resolve(process.cwd(), "lib/crawl/air/outcrypto.js"),
    "utf-8"
  );

  // 将 JavaScript 代码包裹在一个函数中，以便我们可以调用它
  const jsFunction = new Function(
    `return function ${functionName}(param) { ${jsContent}; return ${functionName}(param); }`
  )();

  // 调用函数并传递参数
  if (typeof jsFunction === "function") {
    const result = jsFunction(...args);
    return result;
  } else {
    console.error(`Function '${functionName}' not found in the script.`);
  }
}

export function air_quality_hist(
  city: string = "杭州",
  period: string = "day",
  start_date: string = "20190327",
  end_date: string = "20200427"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      // 格式化日期
      start_date = `${start_date.slice(0, 4)}-${start_date.slice(4, 6)}-${start_date.slice(6)}`;
      end_date = `${end_date.slice(0, 4)}-${end_date.slice(4, 6)}-${end_date.slice(6)}`;

      const url = "https://www.zq12369.com/api/newzhenqiapi.php";
      const app_id = "4f0e3a273d547ce6b7147bfa7ceb4b6e";
      const method = "CETCITYPERIOD";
      const timestamp = new Date().getTime();

      // 创建请求体
      const p_text = JSON.stringify(
        {
          city: city,
          endTime: `${end_date} 23:45:39`,
          startTime: `${start_date} 00:00:00`,
          type: period.toUpperCase(),
        },
        null,
        0
      ).replace(/\\"/g, '"');

      const secret = loadAndExecuteJS("hex_md5", app_id + method + timestamp + "WEB" + p_text);
      const payload = {
        appId: app_id,
        method: method,
        timestamp: timestamp,
        clienttype: "WEB",
        object: {
          city: city,
          type: period.toUpperCase(),
          startTime: `${start_date} 00:00:00`,
          endTime: `${end_date} 23:45:39`,
        },
        secret: secret,
      };
      const need = JSON.stringify(payload, null, 0)
        .replace(/\\"/g, '"')
        .replace(/\\p": /g, 'p":')
        .replace(/\\t": /g, 't":');

      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded",
      };

      const params = { param: loadAndExecuteJS("encode_param", need) };

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: new URLSearchParams(params).toString(),
      });

      const data1 = await response.text();
      const temp_text = loadAndExecuteJS("decryptData", data1);
      const dataJson = JSON.parse(new Base64().decode(temp_text));

      // 转换为类似 pandas DataFrame 的结构
      const tempDf = dataJson.result.data.rows.map((row: any) => ({
        ...row,
        time: row.time,
      }));

      resolve(tempDf);
    } catch (error) {
      reject(error);
    }
  });
}
