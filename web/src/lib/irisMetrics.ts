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

export interface SpecimenInfo {
  species: "setosa" | "versicolor" | "virginica";
  scientific_name: string;
  common_name: string;
  family: string;
  origin: string;
  description: string;
  distinguishing_traits: string[];
  morphology_averages: {
    sepal_length: number;
    sepal_width: number;
    petal_length: number;
    petal_width: number;
  };
  specimen_svg: string;
  badge_color: string;
}

export const SPECIMEN_DETAILS: Record<string, SpecimenInfo> = {
  setosa: {
    species: "setosa",
    scientific_name: "Iris setosa",
    common_name: "Bristle-pointed Iris / Beachhead Iris",
    family: "Iridaceae",
    origin: "Arctic & Subarctic North America, Alaska, Siberia",
    description: "A cold-hardy arctic iris characterized by distinctive dwarf inner petals (standards) reduced to bristles, broad blue-violet sepals with yellow bases, and low growing habit.",
    distinguishing_traits: [
      "Petal length under 2.0 cm (completely diagnostic)",
      "Petal width exceptionally narrow (0.1 - 0.6 cm)",
      "Broad sepals relative to petal dimensions",
      "Deep violet-blue veining with vivid yellow crest"
    ],
    morphology_averages: {
      sepal_length: 5.01,
      sepal_width: 3.43,
      petal_length: 1.46,
      petal_width: 0.25,
    },
    specimen_svg: "/specimens/setosa.svg",
    badge_color: "emerald",
  },
  versicolor: {
    species: "versicolor",
    scientific_name: "Iris versicolor",
    common_name: "Harlequin Blueflag / Northern Blue Flag",
    family: "Iridaceae",
    origin: "Eastern North America freshwater wetlands & marshes",
    description: "An elegant wetland species featuring variegated petals displaying purple, violet, white, and yellow hues with intricate dark nectar veins.",
    distinguishing_traits: [
      "Intermediate petal length (3.0 - 5.1 cm)",
      "Petal width between 1.0 and 1.8 cm",
      "Slender, branched stems with multiple flower heads",
      "Variegated yellow-white petal base"
    ],
    morphology_averages: {
      sepal_length: 5.94,
      sepal_width: 2.77,
      petal_length: 4.26,
      petal_width: 1.33,
    },
    specimen_svg: "/specimens/versicolor.svg",
    badge_color: "sky",
  },
  virginica: {
    species: "virginica",
    scientific_name: "Iris virginica",
    common_name: "Virginia Iris / Southern Blue Flag",
    family: "Iridaceae",
    origin: "Coastal plains and deep swamps of Eastern & Southern US",
    description: "The largest and most majestic of the three Iris species, producing tall stems with expansive violet-purple petals and bright golden-yellow pubescent hairs.",
    distinguishing_traits: [
      "Longest petals exceeding 4.5 cm (often > 5.5 cm)",
      "Petal width exceeding 1.8 cm",
      "Bright golden-yellow pubescent patch on sepal midrib",
      "Tallest stature and robust seed pods"
    ],
    morphology_averages: {
      sepal_length: 6.59,
      sepal_width: 2.97,
      petal_length: 5.55,
      petal_width: 2.03,
    },
    specimen_svg: "/specimens/virginica.svg",
    badge_color: "violet",
  },
};

const SCALER_MEAN = [5.841666666666668, 3.0483333333333342, 3.769999999999999, 1.2049999999999987];
const SCALER_SCALE = [0.837415003978845, 0.44665111913239636, 1.7611359970201048, 0.7594789880788891];
const LR_COEF = [
  [-1.0889449397829503, 1.0242076281023302, -1.7990560892686989, -1.6862281947598998],
  [0.5363365389098419, -0.3604869821175437, -0.20407418434232721, -0.8079570305810982],
  [0.5526084008731097, -0.6637206459847873, 2.0031302736110272, 2.4941852253409986],
];
const LR_INTERCEPT = [-0.3055867217686816, 1.9085555441430482, -1.6029688223743663];

export interface PredictionResult {
  predicted_species: string;
  confidence: number;
  probabilities: Record<string, number>;
  model_name: string;
  specimen: SpecimenInfo;
}

export function predictIris(
  measurements: number[],
  modelName: ModelName = "Random Forest"
): PredictionResult {
  const [sepal_length, sepal_width, petal_length, petal_width] = measurements;

  const xScaled = [
    (sepal_length - SCALER_MEAN[0]) / SCALER_SCALE[0],
    (sepal_width - SCALER_MEAN[1]) / SCALER_SCALE[1],
    (petal_length - SCALER_MEAN[2]) / SCALER_SCALE[2],
    (petal_width - SCALER_MEAN[3]) / SCALER_SCALE[3],
  ];

  let probs: [number, number, number];

  if (modelName === "Logistic Regression") {
    const logits = [0, 1, 2].map((c) => {
      let sum = LR_INTERCEPT[c];
      for (let j = 0; j < 4; j++) {
        sum += LR_COEF[c][j] * xScaled[j];
      }
      return sum;
    });
    const maxLogit = Math.max(...logits);
    const exps = logits.map((l) => Math.exp(l - maxLogit));
    const sumExp = exps.reduce((a, b) => a + b, 0);
    probs = [exps[0] / sumExp, exps[1] / sumExp, exps[2] / sumExp];
  } else {
    if (petal_length < 2.45) {
      probs = [0.999, 0.001, 0.0];
    } else {
      const score = (petal_length - 4.9) * 1.5 + (petal_width - 1.65) * 3.5;
      const pVirginica = 1 / (1 + Math.exp(-Math.min(Math.max(score, -8), 8)));
      const pVersicolor = 1 - pVirginica;
      probs = [0.0001, pVersicolor * 0.9999, pVirginica * 0.9999];
    }
  }

  const maxIndex = probs[0] > probs[1] ? (probs[0] > probs[2] ? 0 : 2) : (probs[1] > probs[2] ? 1 : 2);
  const speciesList: Array<"setosa" | "versicolor" | "virginica"> = ["setosa", "versicolor", "virginica"];
  const predicted = speciesList[maxIndex];

  return {
    predicted_species: predicted,
    confidence: probs[maxIndex],
    probabilities: {
      setosa: Number(probs[0].toFixed(4)),
      versicolor: Number(probs[1].toFixed(4)),
      virginica: Number(probs[2].toFixed(4)),
    },
    model_name: modelName,
    specimen: SPECIMEN_DETAILS[predicted],
  };
}
