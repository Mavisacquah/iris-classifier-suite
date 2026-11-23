import { NextResponse } from "next/server";
import { predictIris, ModelName, MODEL_NAMES } from "@/lib/irisMetrics";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sepal_length, sepal_width, petal_length, petal_width, model_name = "Random Forest" } = body;

    if (
      typeof sepal_length !== "number" ||
      typeof sepal_width !== "number" ||
      typeof petal_length !== "number" ||
      typeof petal_width !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid measurements: sepal_length, sepal_width, petal_length, petal_width must be numbers." },
        { status: 400 }
      );
    }

    const selectedModel = MODEL_NAMES.includes(model_name as ModelName)
      ? (model_name as ModelName)
      : "Random Forest";

    const result = predictIris(
      [sepal_length, sepal_width, petal_length, petal_width],
      selectedModel
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process prediction." },
      { status: 500 }
    );
  }
}