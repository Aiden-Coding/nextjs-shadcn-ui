// lib/airQualityHebei.ts
import axios from "axios";
import * as cheerio from "cheerio";
import { DateTime } from "luxon"; // 需要安装 luxon 用于日期处理

interface AirQualityData {
  city: string;
  date: Date;
  pollutant: string;
  minAQI: number;
  maxAQI: number;
  level: string;
}

export async function airQualityHebei(symbol: string = ""): Promise<AirQualityData[]> {
  const url = "http://110.249.223.67/server/api/CityPublishInfo/GetProvinceAndCityPublishData";
  const params = {
    publishDate: `${DateTime.now().toFormat("yyyy-MM-dd")} 16:00:00`,
  };

  try {
    const response = await axios.get(url, { params });
    const jsonData = response.data;
    const cityList = jsonData.cityPublishDatas.map((item: any) => item.CityName);
    const outerData: AirQualityData[] = [];

    for (let i = 1; i <= 6; i++) {
      const innerData: AirQualityData[] = jsonData.cityPublishDatas.map(
        (item: any, index: number) => ({
          city: cityList[index],
          date: new Date(item[`Date${i}`]),
          pollutant: item[`Date${i}`].pollutant,
          minAQI: parseFloat(item[`Date${i}`].minAQI),
          maxAQI: parseFloat(item[`Date${i}`].maxAQI),
          level: item[`Date${i}`].level,
        })
      );
      outerData.push(...innerData);
    }

    if (symbol === "") {
      return outerData;
    } else {
      return outerData.filter((data) => data.city === symbol);
    }
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return [];
  }
}
