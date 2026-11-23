import { NextResponse } from "next/server";
import { FALLBACK_METRICS, FALLBACK_DATASET_SUMMARY, MODEL_NAMES } from "@/lib/irisMetrics";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    dataset: FALLBACK_DATASET_SUMMARY,
    models: FALLBACK_METRICS,
    model_names: MODEL_NAMES,
  });
}