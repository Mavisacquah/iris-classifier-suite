"""FastAPI endpoints for Iris classification and model evaluation."""
from __future__ import annotations

import os
from typing import Literal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .ml_service import service, SPECIMEN_DETAILS

app = FastAPI(
    title="Iris Classifier API",
    description="Four scikit-learn models, reproducible evaluation metrics, and Iris predictions with specimen details.",
    version="1.0.0",
)

origins = os.getenv(
    "CORS_ORIGINS",
    "*",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if origins == "*" else [origin.strip() for origin in origins.split(",") if origin.strip()],
    allow_credentials=False if origins == "*" else True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    sepal_length: float = Field(ge=0, le=10, description="Sepal length in cm")
    sepal_width: float = Field(ge=0, le=10, description="Sepal width in cm")
    petal_length: float = Field(ge=0, le=10, description="Petal length in cm")
    petal_width: float = Field(ge=0, le=10, description="Petal width in cm")
    model_name: Literal[
        "Logistic Regression", "Random Forest",
        "Support Vector Machine", "K-Nearest Neighbors"
    ] = "Random Forest"


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "iris-classifier-api", "models_loaded": len(service.models)}


@app.get("/dataset/summary")
def dataset_summary() -> dict:
    return service.dataset_summary()


@app.get("/specimens")
def specimens() -> dict:
    return SPECIMEN_DETAILS


@app.get("/models/metrics")
def model_metrics() -> dict:
    return {
        "dataset": service.dataset_summary(),
        "models": service.metrics,
        "model_names": list(service.models.keys()),
    }


@app.post("/predict")
def predict(request: PredictionRequest) -> dict:
    try:
        return service.predict(
            [
                request.sepal_length, request.sepal_width,
                request.petal_length, request.petal_width,
            ],
            request.model_name,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
