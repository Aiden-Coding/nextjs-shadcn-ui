// app/api/hello/route.ts
import { NextRequest, NextResponse } from "next/server";
import { air_quality_hebei } from "@/lib/air/air_hebei";
export async function GET(request: NextRequest) {
  const data = await air_quality_hebei("定州市");
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { name }: { name: string } = await request.json();
  return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
}
