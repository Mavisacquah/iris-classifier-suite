import { NextResponse } from "next/server";
import { MODEL_NAMES } from "@/lib/irisMetrics";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "iris-classifier-web-api",
    models_loaded: MODEL_NAMES.length,
    pwa_ready: true,
  });
}