import axios from "axios";
import { load } from "cheerio";

export async function getSunriseCityList(): Promise<string[]> {
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
    const columns1 = table1.find("tr").eq(0).find("td").length / 3;
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
    const columns2 = table2.find("tr").eq(0).find("td").length;
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
