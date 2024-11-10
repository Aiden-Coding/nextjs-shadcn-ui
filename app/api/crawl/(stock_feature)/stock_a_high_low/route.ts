// app/api/hello/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stock_a_high_low_statistics } from "@/lib/crawl/stock_feature/stock_a_high_low";
export async function GET(request: NextRequest) {
  const data = await stock_a_high_low_statistics();
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { name }: { name: string } = await request.json();
  return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
}
