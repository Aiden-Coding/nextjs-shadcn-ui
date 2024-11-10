import axios from "axios";
import { load } from "cheerio";
import { parse } from "date-fns";

export async function sunrise_city_list(): Promise<string[]> {
  /**
   * 查询日出与日落数据的城市列表
   * @url https://www.timeanddate.com/astronomy/china
   * @returns 所有可以获取的数据的城市列表
   */
  const url = "https://www.timeanddate.com/astronomy/china";

  try {
    const response = await axios.get(url);
    const $ = load(response.data);
    let cityList: string[] = [];

    // 解析第一个表格
    const table1 = $("table").eq(1);
    const columns1 = table1.find("tr").eq(1).find("td").length / 3;
    for (let i = 0; i < columns1; i++) {
      cityList = cityList.concat(
        table1
          .find(`tr td:nth-child(${i * 3 + 1})`)
          .map((_, el) => $(el).text().toLowerCase())
          .get()
      );
    }
    console.log(cityList);

    // 解析第二个表格
    const table2 = $("table").eq(2);
    const columns2 = table2.find("tr").eq(1).find("td").length;
    for (let i = 0; i < columns2; i++) {
      cityList = cityList.concat(
        table2
          .find(`tr td:nth-child(${i + 1})`)
          .map((_, el) => {
            const text = $(el).text().toLowerCase();
            return text.trim() !== "" ? text : null;
          })
          .get()
          .filter(Boolean) as string[]
      );
    }
    return cityList;
  } catch (error) {
    console.error("Failed to fetch or parse the city list:", error);
    throw error;
  }
}

export async function sunrise_daily(
  date: string = "20240428",
  city: string = "beijing"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  /**
   * 获取每日日出日落数据
   * @param date - 需要查询的日期, e.g., “20240428”
   * @param city - 需要查询的城市; 注意输入的格式, e.g., "beijing"
   * @returns 返回指定日期指定地区的日出日落数据
   */
  const cityList = await sunrise_city_list();
  if (!cityList.includes(city.toLowerCase())) {
    throw new Error("请输入正确的城市名称");
  }

  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6);
  const url = `https://www.timeanddate.com/sun/china/${city}?month=${month}&year=${year}`;

  try {
    const response = await axios.get(url);
    const $ = load(response.data);
    const table = $("table").eq(1);
    const rows = table.find("tr").slice(2, -1); // 跳过表头和最后一行

    const data = rows
      .map((_, row) => {
        const columns = $(row).find("td");
        const rowDate = columns.eq(0).text().trim().padStart(2, "0");
        if (rowDate === day) {
          return {
            date: parse(date, "yyyyMMdd", new Date()).toISOString().split("T")[0],
            sunrise: columns.eq(1).text().trim(),
            sunset: columns.eq(2).text().trim(),
          };
        }
      })
      .get()
      .filter(Boolean)[0];

    return data;
  } catch (error) {
    console.error("Failed to fetch or parse daily sunrise data:", error);
    throw error;
  }
}

export async function sunrise_monthly(
  date: string = "20240428",
  city: string = "beijing"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  /**
   * 获取指定日期所在月份的每日日出日落数据
   * @param date - 需要查询的日期, 这里用来指定 date 所在的月份; e.g., “20240428”
   * @param city - 需要查询的城市; 注意输入的格式, e.g., "beijing"
   * @returns 返回指定日期所在月份的每日日出日落数据
   */
  const cityList = await sunrise_city_list();
  if (!cityList.includes(city.toLowerCase())) {
    throw new Error("请输入正确的城市名称");
  }

  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const url = `https://www.timeanddate.com/sun/china/${city}?month=${month}&year=${year}`;

  try {
    const response = await axios.get(url);
    const $ = load(response.data);
    const table = $("table").eq(1);
    const rows = table.find("tr").slice(2, -1); // 跳过表头和最后一行

    return rows
      .map((_, row) => {
        const columns = $(row).find("td");
        const day = columns.eq(0).text().trim().padStart(2, "0");
        const fullDate = `${year}-${month.padStart(2, "0")}-${day}`;
        return {
          date: fullDate,
          sunrise: columns.eq(1).text().trim(),
          sunset: columns.eq(2).text().trim(),
        };
      })
      .get();
  } catch (error) {
    console.error("Failed to fetch or parse monthly sunrise data:", error);
    throw error;
  }
}
