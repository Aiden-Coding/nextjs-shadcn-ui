import moment from "moment";

interface StockData {
  date: Date; //交易日
  belowNetAsset: number; //破净股家数
  totalCompany: number; //总公司数
  marketId?: string;
  quantileInAllHistory?: number;
  quantileInRecent10Years?: number;
  belowNetAssetRatio?: number; //破净率
}
export async function stockABelowNetAssetStatistics(
  symbol: string = "全部A股"
): Promise<StockData[]> {
  /**
   * 破净股统计历史走势
   * @param symbol - choice of {"全部A股", "沪深300", "上证50", "中证500"}
   * @returns Promise<StockData[]> - 破净股统计历史走势
   */
  /**
   * 破净股统计历史走势
   * @param symbol - choice of {"全部A股", "沪深300", "上证50", "中证500"}
   * @returns Promise<DataFrame> - 破净股统计历史走势
   */
  const symbolMap: { [key: string]: string } = {
    全部A股: "1",
    沪深300: "000300.XSHG",
    上证50: "000016.SH",
    中证500: "000905.SH",
  };

  const url = "https://legulegu.com/stockdata/below-net-asset-statistics-data";
  const params = {
    marketId: symbolMap[symbol],
    token: "325843825a2745a2a8f9b9e3355cb864",
  };

  // Construct the URL with parameters
  const queryParams = new URLSearchParams(params);
  const fullUrl = `${url}?${queryParams.toString()}`;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko);Chrome/114.0.0.0 Safari/537.36",
  };
  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const dataJson: StockData[] = await response.json();

    // Convert data to the desired format
    const result = dataJson.map((item) => ({
      date: moment(item.date).toDate(),
      marketId: item.marketId,
      belowNetAsset: item.belowNetAsset,
      totalCompany: item.totalCompany,
      belowNetAssetRatio: Number((item.belowNetAsset / item.totalCompany).toFixed(4)),
    }));

    // Sort by date
    result.sort((a, b) => a.date.getTime() - b.date.getTime());

    return result;
  } catch (error) {
    console.error("Failed to fetch or process stock data:", error);
    throw error; // Re-throw the error for the caller to handle it
  }
}
