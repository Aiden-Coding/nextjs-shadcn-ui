// app/api/hello/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stockABelowNetAssetStatistics } from "@/lib/crawl/stock_feature/stock_a_below_net_asset_statistics";
export async function GET(request: NextRequest) {
  const data = await stockABelowNetAssetStatistics();
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { name }: { name: string } = await request.json();
  return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
}
