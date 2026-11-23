"""Reproducible Iris model training, evaluation, and inference service."""
from __future__ import annotations

from typing import Any
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix, f1_score,
    log_loss, precision_score, recall_score, roc_auc_score,
)
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC


SPECIMEN_DETAILS: dict[str, dict[str, Any]] = {
    "setosa": {
        "species": "setosa",
        "scientific_name": "Iris setosa",
        "common_name": "Bristle-pointed Iris / Beachhead Iris",
        "family": "Iridaceae",
        "origin": "Arctic North America, Alaska, Siberia",
        "description": "A hardy arctic iris characterized by distinctive dwarf petals reduced to bristles, broad blue-violet sepals with yellow bases, and low growing habit.",
        "distinguishing_traits": [
            "Petal length under 2.0 cm (diagnostic)",
            "Petal width exceptionally narrow (0.1 - 0.6 cm)",
            "Broad sepals relative to petal dimensions",
            "Deep violet-blue veining with yellow crest"
        ],
        "morphology_averages": {
            "sepal_length": 5.01,
            "sepal_width": 3.43,
            "petal_length": 1.46,
            "petal_width": 0.25
        },
        "specimen_svg": "/specimens/setosa.svg",
        "badge_color": "emerald"
    },
    "versicolor": {
        "species": "versicolor",
        "scientific_name": "Iris versicolor",
        "common_name": "Harlequin Blueflag / Northern Blue Flag",
        "family": "Iridaceae",
        "origin": "Eastern North America freshwater wetlands & marshes",
        "description": "An elegant wetland species featuring variegated petals displaying purple, violet, white, and yellow hues with intricate dark nectar veins.",
        "distinguishing_traits": [
            "Intermediate petal length (3.0 - 5.1 cm)",
            "Petal width between 1.0 and 1.8 cm",
            "Slender, branched stems with multiple flower heads",
            "Variegated yellow-white petal base"
        ],
        "morphology_averages": {
            "sepal_length": 5.94,
            "sepal_width": 2.77,
            "petal_length": 4.26,
            "petal_width": 1.33
        },
        "specimen_svg": "/specimens/versicolor.svg",
        "badge_color": "sky"
    },
    "virginica": {
        "species": "virginica",
        "scientific_name": "Iris virginica",
        "common_name": "Virginia Iris / Southern Blue Flag",
        "family": "Iridaceae",
        "origin": "Coastal plains and deep swamps of Eastern & Southern US",
        "description": "The largest and most majestic of the three Iris species, producing tall stems with expansive violet-purple petals and bright golden-yellow pubescent hairs.",
        "distinguishing_traits": [
            "Longest petals exceeding 4.5 cm (often > 5.5 cm)",
            "Petal width exceeding 1.8 cm",
            "Bright golden-yellow pubescent patch on sepal midrib",
            "Tallest stature and robust seed pods"
        ],
        "morphology_averages": {
            "sepal_length": 6.59,
            "sepal_width": 2.97,
            "petal_length": 5.55,
            "petal_width": 2.03
        },
        "specimen_svg": "/specimens/virginica.svg",
        "badge_color": "violet"
    }
}


class IrisModelService:
    """Trains four classifiers once and exposes JSON-safe metrics/predictions."""

    def __init__(self) -> None:
        self.dataset = load_iris()
        self.X = self.dataset.data
        self.y = self.dataset.target
        self.species = [str(name) for name in self.dataset.target_names]
        self.feature_names = [str(name) for name in self.dataset.feature_names]
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y, test_size=0.2, random_state=42, stratify=self.y
        )
        self.cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        self.factories = {
            "Logistic Regression": lambda: make_pipeline(
                StandardScaler(), LogisticRegression(max_iter=1000, random_state=42)
            ),
            "Random Forest": lambda: RandomForestClassifier(
                n_estimators=150, random_state=42
            ),
            "Support Vector Machine": lambda: make_pipeline(
                StandardScaler(), SVC(kernel="rbf", probability=True, random_state=42)
            ),
            "K-Nearest Neighbors": lambda: make_pipeline(
                StandardScaler(), KNeighborsClassifier(n_neighbors=5)
            ),
        }
        self.models: dict[str, Any] = {}
        self.metrics: dict[str, dict[str, Any]] = {}
        self._train_and_evaluate()

    @staticmethod
    def _float(value: Any) -> float:
        return float(value)

    def _train_and_evaluate(self) -> None:
        for name, factory in self.factories.items():
            model = factory()
            model.fit(self.X_train, self.y_train)
            predicted = model.predict(self.X_test)
            probabilities = model.predict_proba(self.X_test)
            report = classification_report(
                self.y_test, predicted, labels=[0, 1, 2],
                target_names=self.species, output_dict=True, zero_division=0,
            )
            cv_scores = cross_val_score(
                factory(), self.X, self.y, cv=self.cv, scoring="accuracy"
            )
            per_class = {
                species: {
                    "precision": self._float(report[species]["precision"]),
                    "recall": self._float(report[species]["recall"]),
                    "f1_score": self._float(report[species]["f1-score"]),
                    "support": int(report[species]["support"]),
                }
                for species in self.species
            }
            self.models[name] = model
            self.metrics[name] = {
                "accuracy": self._float(accuracy_score(self.y_test, predicted)),
                "macro_precision": self._float(precision_score(
                    self.y_test, predicted, average="macro", zero_division=0
                )),
                "weighted_precision": self._float(precision_score(
                    self.y_test, predicted, average="weighted", zero_division=0
                )),
                "macro_recall": self._float(recall_score(
                    self.y_test, predicted, average="macro", zero_division=0
                )),
                "weighted_recall": self._float(recall_score(
                    self.y_test, predicted, average="weighted", zero_division=0
                )),
                "macro_f1": self._float(f1_score(
                    self.y_test, predicted, average="macro", zero_division=0
                )),
                "weighted_f1": self._float(f1_score(
                    self.y_test, predicted, average="weighted", zero_division=0
                )),
                "per_class": per_class,
                "classification_report": report,
                "confusion_matrix": confusion_matrix(
                    self.y_test, predicted, labels=[0, 1, 2]
                ).astype(int).tolist(),
                "roc_auc_ovr_macro": self._float(roc_auc_score(
                    self.y_test, probabilities, multi_class="ovr", average="macro"
                )),
                "roc_auc_ovr_weighted": self._float(roc_auc_score(
                    self.y_test, probabilities, multi_class="ovr", average="weighted"
                )),
                "log_loss": self._float(log_loss(
                    self.y_test, probabilities, labels=[0, 1, 2]
                )),
                "cv_accuracy_mean": self._float(np.mean(cv_scores)),
                "cv_accuracy_std": self._float(np.std(cv_scores)),
                "cv_accuracy_scores": [self._float(score) for score in cv_scores],
            }

    def dataset_summary(self) -> dict[str, Any]:
        counts = pd.Series(self.y).value_counts().sort_index()
        return {
            "samples": int(len(self.X)),
            "features": int(self.X.shape[1]),
            "classes": self.species,
            "feature_names": self.feature_names,
            "target_names": self.species,
            "class_counts": {
                self.species[index]: int(counts.loc[index]) for index in range(3)
            },
            "train_samples": int(len(self.X_train)),
            "test_samples": int(len(self.X_test)),
            "split": "80/20 stratified",
            "random_state": 42,
        }

    def predict(
        self, measurements: list[float], model_name: str
    ) -> dict[str, Any]:
        if model_name not in self.models:
            raise ValueError(
                f"Unknown model_name. Choose one of: {', '.join(self.models)}"
            )
        row = np.asarray(measurements, dtype=float).reshape(1, -1)
        model = self.models[model_name]
        probabilities = model.predict_proba(row)[0]
        prediction = int(model.predict(row)[0])
        predicted_name = self.species[prediction]
        return {
            "predicted_species": predicted_name,
            "confidence": float(probabilities[prediction]),
            "probabilities": {
                self.species[index]: float(probabilities[index])
                for index in range(3)
            },
            "model_name": model_name,
            "specimen": SPECIMEN_DETAILS.get(predicted_name.lower(), {}),
        }


service = IrisModelService()
