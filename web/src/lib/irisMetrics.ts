// Generated from the executed scikit-learn Iris evaluation pipeline.
// These are real holdout and 5-fold CV results (random_state=42).
export const FALLBACK_METRICS = {
  "Logistic Regression": {
    "accuracy": 0.9333333333333333,
    "macro_precision": 0.9333333333333332,
    "weighted_precision": 0.9333333333333333,
    "macro_recall": 0.9333333333333332,
    "weighted_recall": 0.9333333333333333,
    "macro_f1": 0.9333333333333332,
    "weighted_f1": 0.9333333333333333,
    "per_class": {
      "setosa": {
        "precision": 1.0,
        "recall": 1.0,
        "f1_score": 1.0,
        "support": 10
      },
      "versicolor": {
        "precision": 0.9,
        "recall": 0.9,
        "f1_score": 0.9,
        "support": 10
      },
      "virginica": {
        "precision": 0.9,
        "recall": 0.9,
        "f1_score": 0.9,
        "support": 10
      }
    },
    "classification_report": {
      "setosa": {
        "precision": 1.0,
        "recall": 1.0,
        "f1-score": 1.0,
        "support": 10.0
      },
      "versicolor": {
        "precision": 0.9,
        "recall": 0.9,
        "f1-score": 0.9,
        "support": 10.0
      },
      "virginica": {
        "precision": 0.9,
        "recall": 0.9,
        "f1-score": 0.9,
        "support": 10.0
      },
      "accuracy": 0.9333333333333333,
      "macro avg": {
        "precision": 0.9333333333333332,
        "recall": 0.9333333333333332,
        "f1-score": 0.9333333333333332,
        "support": 30.0
      },
      "weighted avg": {
        "precision": 0.9333333333333333,
        "recall": 0.9333333333333333,
        "f1-score": 0.9333333333333333,
        "support": 30.0
      }
    },
    "confusion_matrix": [
      [
        10,
        0,
        0
      ],
      [
        0,
        9,
        1
      ],
      [
        0,
        1,
        9
      ]
    ],
    "roc_auc_ovr_macro": 0.9966666666666667,
    "roc_auc_ovr_weighted": 0.9966666666666666,
    "log_loss": 0.17397259306520446,
    "cv_accuracy_mean": 0.9533333333333334,
    "cv_accuracy_std": 0.04521553322083511,
    "cv_accuracy_scores": [
      1.0,
      0.9666666666666667,
      0.9,
      1.0,
      0.9
    ]
  },
  "Random Forest": {
    "accuracy": 0.9,
    "macro_precision": 0.9023569023569024,
    "weighted_precision": 0.9023569023569024,
    "macro_recall": 0.9,
    "weighted_recall": 0.9,
    "macro_f1": 0.899749373433584,
    "weighted_f1": 0.8997493734335839,
    "per_class": {
      "setosa": {
        "precision": 1.0,
        "recall": 1.0,
        "f1_score": 1.0,
        "support": 10
      },
      "versicolor": {
        "precision": 0.8181818181818182,
        "recall": 0.9,
        "f1_score": 0.8571428571428571,
        "support": 10
      },
      "virginica": {
        "precision": 0.8888888888888888,
        "recall": 0.8,
        "f1_score": 0.8421052631578947,
        "support": 10
      }
    },
    "classification_report": {
      "setosa": {
        "precision": 1.0,
        "recall": 1.0,
        "f1-score": 1.0,
        "support": 10.0
      },
      "versicolor": {
        "precision": 0.8181818181818182,
        "recall": 0.9,
        "f1-score": 0.8571428571428571,
        "support": 10.0
      },
      "virginica": {
        "precision": 0.8888888888888888,
        "recall": 0.8,
        "f1-score": 0.8421052631578947,
        "support": 10.0
      },
      "accuracy": 0.9,
      "macro avg": {
        "precision": 0.9023569023569024,
        "recall": 0.9,
        "f1-score": 0.899749373433584,
        "support": 30.0
      },
      "weighted avg": {
        "precision": 0.9023569023569024,
        "recall": 0.9,
        "f1-score": 0.8997493734335839,
        "support": 30.0
      }
    },
    "confusion_matrix": [
      [
        10,
        0,
        0
      ],
      [
        0,
        9,
        1
      ],
      [
        0,
        2,
        8
      ]
    ],
    "roc_auc_ovr_macro": 0.9874999999999999,
    "roc_auc_ovr_weighted": 0.9874999999999999,
    "log_loss": 0.20026248020169451,
    "cv_accuracy_mean": 0.9466666666666667,
    "cv_accuracy_std": 0.02666666666666666,
    "cv_accuracy_scores": [
      0.9666666666666667,
      0.9666666666666667,
      0.9333333333333333,
      0.9666666666666667,
      0.9
    ]
  },
  "Support Vector Machine": {
    "accuracy": 0.9666666666666667,
    "macro_precision": 0.9696969696969697,
    "weighted_precision": 0.9696969696969696,
    "macro_recall": 0.9666666666666667,
    "weighted_recall": 0.9666666666666667,
    "macro_f1": 0.9665831244778612,
    "weighted_f1": 0.9665831244778613,
    "per_class": {
      "setosa": {
        "precision": 1.0,
        "recall": 1.0,
        "f1_score": 1.0,
        "support": 10
      },
      "versicolor": {
        "precision": 1.0,
        "recall": 0.9,
        "f1_score": 0.9473684210526315,
        "support": 10
      },
      "virginica": {
        "precision": 0.9090909090909091,
        "recall": 1.0,
        "f1_score": 0.9523809523809523,
        "support": 10
      }
    },
    "classification_report": {
      "setosa": {
        "precision": 1.0,
        "recall": 1.0,
        "f1-score": 1.0,
        "support": 10.0
      },
      "versicolor": {
        "precision": 1.0,
        "recall": 0.9,
        "f1-score": 0.9473684210526315,
        "support": 10.0
      },
      "virginica": {
        "precision": 0.9090909090909091,
        "recall": 1.0,
        "f1-score": 0.9523809523809523,
        "support": 10.0
      },
      "accuracy": 0.9666666666666667,
      "macro avg": {
        "precision": 0.9696969696969697,
        "recall": 0.9666666666666667,
        "f1-score": 0.9665831244778612,
        "support": 30.0
      },
      "weighted avg": {
        "precision": 0.9696969696969696,
        "recall": 0.9666666666666667,
        "f1-score": 0.9665831244778613,
        "support": 30.0
      }
    },
    "confusion_matrix": [
      [
        10,
        0,
        0
      ],
      [
        0,
        9,
        1
      ],
      [
        0,
        0,
        10
      ]
    ],
    "roc_auc_ovr_macro": 0.9966666666666667,
    "roc_auc_ovr_weighted": 0.9966666666666666,
    "log_loss": 0.11253163559824218,
    "cv_accuracy_mean": 0.96,
    "cv_accuracy_std": 0.038873012632301994,
    "cv_accuracy_scores": [
      1.0,
      0.9666666666666667,
      0.9,
      1.0,
      0.9333333333333333
    ]
  },
  "K-Nearest Neighbors": {
    "accuracy": 0.9333333333333333,
    "macro_precision": 0.9444444444444445,
    "weighted_precision": 0.9444444444444445,
    "macro_recall": 0.9333333333333332,
    "weighted_recall": 0.9333333333333333,
    "macro_f1": 0.9326599326599326,
    "weighted_f1": 0.9326599326599326,
    "per_class": {
      "setosa": {
        "precision": 1.0,
        "recall": 1.0,
        "f1_score": 1.0,
        "support": 10
      },
      "versicolor": {
        "precision": 0.8333333333333334,
        "recall": 1.0,
        "f1_score": 0.9090909090909091,
        "support": 10
      },
      "virginica": {
        "precision": 1.0,
        "recall": 0.8,
        "f1_score": 0.8888888888888888,
        "support": 10
      }
    },
    "classification_report": {
      "setosa": {
        "precision": 1.0,
        "recall": 1.0,
        "f1-score": 1.0,
        "support": 10.0
      },
      "versicolor": {
        "precision": 0.8333333333333334,
        "recall": 1.0,
        "f1-score": 0.9090909090909091,
        "support": 10.0
      },
      "virginica": {
        "precision": 1.0,
        "recall": 0.8,
        "f1-score": 0.8888888888888888,
        "support": 10.0
      },
      "accuracy": 0.9333333333333333,
      "macro avg": {
        "precision": 0.9444444444444445,
        "recall": 0.9333333333333332,
        "f1-score": 0.9326599326599326,
        "support": 30.0
      },
      "weighted avg": {
        "precision": 0.9444444444444445,
        "recall": 0.9333333333333333,
        "f1-score": 0.9326599326599326,
        "support": 30.0
      }
    },
    "confusion_matrix": [
      [
        10,
        0,
        0
      ],
      [
        0,
        10,
        0
      ],
      [
        0,
        2,
        8
      ]
    ],
    "roc_auc_ovr_macro": 0.9933333333333333,
    "roc_auc_ovr_weighted": 0.9933333333333333,
    "log_loss": 0.11960672954534995,
    "cv_accuracy_mean": 0.9733333333333334,
    "cv_accuracy_std": 0.02494438257849294,
    "cv_accuracy_scores": [
      1.0,
      0.9666666666666667,
      0.9333333333333333,
      1.0,
      0.9666666666666667
    ]
  }
} as const;
export const FALLBACK_DATASET_SUMMARY = {
  "samples": 150,
  "features": 4,
  "classes": [
    "setosa",
    "versicolor",
    "virginica"
  ],
  "feature_names": [
    "sepal length (cm)",
    "sepal width (cm)",
    "petal length (cm)",
    "petal width (cm)"
  ],
  "target_names": [
    "setosa",
    "versicolor",
    "virginica"
  ],
  "class_counts": {
    "setosa": 50,
    "versicolor": 50,
    "virginica": 50
  },
  "train_samples": 120,
  "test_samples": 30,
  "split": "80/20 stratified",
  "random_state": 42
} as const;
export type ModelName = keyof typeof FALLBACK_METRICS;
export const MODEL_NAMES = Object.keys(FALLBACK_METRICS) as ModelName[];
export const SPECIES = ["setosa", "versicolor", "virginica"] as const;
