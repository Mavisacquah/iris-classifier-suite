import { NextResponse } from "next/server";
import { SPECIMEN_DETAILS } from "@/lib/irisMetrics";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(SPECIMEN_DETAILS);
}