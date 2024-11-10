// app/api/hello/route.ts
import { NextRequest, NextResponse } from "next/server";
import { air_city_table } from "@/lib/crawl/air/air_zhenqi";
export async function GET(request: NextRequest) {
  const data = await air_city_table();
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { name }: { name: string } = await request.json();
  return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
}
export const runtime = "edge";
