// app/api/hello/route.ts
import { NextRequest, NextResponse } from "next/server";
import { air_quality_hist } from "@/lib/crawl/air/air_zhenqi";
export async function GET(request: NextRequest) {
  const data = await air_quality_hist("北京", "day", "20220801", "20240402");
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { name }: { name: string } = await request.json();
  return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
}
export const runtime = "edge";
