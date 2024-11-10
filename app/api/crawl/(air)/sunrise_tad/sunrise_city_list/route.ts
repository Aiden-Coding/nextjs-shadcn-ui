// app/api/hello/route.ts
import { getSunriseCityList } from "@/lib/crawl/air/sunrise_tad";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const data = await getSunriseCityList();
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { name }: { name: string } = await request.json();
  return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
}
