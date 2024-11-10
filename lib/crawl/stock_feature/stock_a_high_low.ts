import moment from "moment";

interface HighLowData {
  date: Date;
  close: number;
  high20: number;
  low20: number;
  high60: number;
  low60: number;
  high120: number;
  low120: number;
  indexCode?: string;
}

export async function stock_a_high_low_statistics(symbol: string = "all"): Promise<HighLowData[]> {
  /**
   * 乐咕乐股-创新高、新低的股票数量
   * @param symbol - choice of {"all", "sz50", "hs300", "zz500"}
   * @returns Promise<HighLowData[]> - 创新高、新低的股票数量
   */
  const url = `https://www.legulegu.com/stockdata/member-ship/get-high-low-statistics/${symbol}`;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko);Chrome/114.0.0.0 Safari/537.36",
  };

  try {
    const response = await fetch(url, { headers });
    const dataJson: HighLowData[] = await response.json();

    // Convert and sort data
    const result = dataJson
      .map((item) => ({
        date: moment(item.date).toDate(),
        close: Number(item.close),
        high20: Number(item.high20),
        low20: Number(item.low20),
        high60: Number(item.high60),
        low60: Number(item.low60),
        high120: Number(item.high120),
        low120: Number(item.low120),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return result;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}
