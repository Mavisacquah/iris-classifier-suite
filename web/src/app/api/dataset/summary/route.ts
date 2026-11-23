import { NextResponse } from "next/server";
import { FALLBACK_DATASET_SUMMARY } from "@/lib/irisMetrics";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(FALLBACK_DATASET_SUMMARY);
}