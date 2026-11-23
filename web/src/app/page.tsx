"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Flower2,
  FlaskConical,
  Leaf,
  RefreshCw,
  Sprout,
  Download,
  Smartphone,
  Monitor,
  Check,
  ChevronRight,
  X,
  ExternalLink,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  FALLBACK_DATASET_SUMMARY,
  FALLBACK_METRICS,
  MODEL_NAMES,
  SPECIES,
  SPECIMEN_DETAILS,
  predictIris,
  type ModelName,
  type PredictionResult,
  type SpecimenInfo,
} from "@/lib/irisMetrics";

type Metrics = typeof FALLBACK_METRICS;
const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

const presets: Record<string, number[]> = {
  Setosa: [5.1, 3.5, 1.4, 0.2],
  Versicolor: [6.0, 2.9, 4.5, 1.5],
  Virginica: [6.5, 3.0, 5.5, 2.0],
};

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}
function number(n: number) {
  return n.toFixed(3);
}

export default function Home() {
  const [metrics, setMetrics] = useState<Metrics>(FALLBACK_METRICS);
  const [dataset, setDataset] = useState(FALLBACK_DATASET_SUMMARY);
  const [model, setModel] = useState<ModelName>("Random Forest");
  const [live, setLive] = useState(false);
  const [values, setValues] = useState<number[]>([5.1, 3.5, 1.4, 0.2]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predicting, setPredicting] = useState(false);

  // PWA install state & platform detection
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "windows" | "other">("other");
  const [isInstalled, setIsInstalled] = useState(false);

  // Register Service Worker & handle PWA events
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect standalone mode (already installed)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Detect user platform
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform("ios");
    } else if (/android/.test(ua)) {
      setPlatform("android");
    } else if (/windows|win32|win64/.test(ua)) {
      setPlatform("windows");
    } else {
      setPlatform("other");
    }

    // PWA beforeinstallprompt handler
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Register Service Worker for offline capabilities
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered successfully"))
        .catch((err) => console.log("SW registration error:", err));
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Fetch metrics if available
  useEffect(() => {
    let active = true;
    const endpoint = API ? `${API}/models/metrics` : `/api/models/metrics`;

    fetch(endpoint, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("API unavailable");
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        if (data.models) setMetrics(data.models as Metrics);
        if (data.dataset) setDataset(data.dataset);
        setLive(true);
      })
      .catch(() => {
        if (active) setLive(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selected = metrics[model] ?? FALLBACK_METRICS[model];
  const topModel = useMemo(
    () =>
      MODEL_NAMES.reduce(
        (best, name) =>
          metrics[name].accuracy > metrics[best].accuracy ? name : best,
        MODEL_NAMES[0]
      ),
    [metrics]
  );

  // Trigger prediction with three-tier resiliency
  async function predict() {
    setPredicting(true);
    try {
      const endpoint = API ? `${API}/predict` : `/api/predict`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sepal_length: values[0],
          sepal_width: values[1],
          petal_length: values[2],
          petal_width: values[3],
          model_name: model,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.specimen && data.predicted_species) {
          data.specimen = SPECIMEN_DETAILS[data.predicted_species.toLowerCase()];
        }
        setPrediction(data);
        return;
      }
      throw new Error("API call unsuccessful");
    } catch {
      // Offline fallback: compute immediately using exact scikit-learn parameters
      const fallbackResult = predictIris(values, model);
      setPrediction(fallbackResult);
    } finally {
      setPredicting(false);
    }
  }

  // Handle native install click
  async function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      setShowInstallModal(true);
    }
  }

  const featureLabels = ["Sepal length", "Sepal width", "Petal length", "Petal width"];
  const featureUnits = ["cm", "cm", "cm", "cm"];
  const ranges = [
    [4.0, 8.0, 0.1],
    [2.0, 4.5, 0.1],
    [1.0, 7.0, 0.1],
    [0.1, 2.5, 0.1],
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
      {/* Header */}
      <header className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-violet-900">
            <Flower2 size={16} /> Field notes / Machine learning & Botany
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            Iris <span className="text-violet-900">Lab.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            An interactive botanical classification studio identifying Iris species with four morphological measurements and four deterministic ML classifiers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* PWA Install Button */}
          {!isInstalled && (
            <button
              onClick={() => {
                if (deferredPrompt) {
                  handleInstallClick();
                } else {
                  setShowInstallModal(true);
                }
              }}
              className="flex items-center gap-2 rounded-full bg-violet-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-900 active:scale-95"
            >
              <Download size={14} />
              Install App (iOS, Android, Windows)
            </button>
          )}

          {isInstalled && (
            <div className="flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-900">
              <Check size={14} className="text-emerald-600" /> App Installed
            </div>
          )}

          {/* Connection Status Pill */}
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {live ? "Live API connected" : "Integrated API ready"}
            <RefreshCw size={12} className="ml-0.5 text-slate-400" />
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPI
          icon={<Sprout size={17} />}
          label="Top model"
          value={topModel}
          note={`${pct(metrics[topModel].accuracy)} holdout accuracy`}
        />
        <KPI
          icon={<Activity size={17} />}
          label={`${model} · accuracy`}
          value={pct(selected.accuracy)}
          note={`5-fold CV ${pct(selected.cv_accuracy_mean)} ± ${pct(
            selected.cv_accuracy_std
          )}`}
        />
        <KPI
          icon={<FlaskConical size={17} />}
          label="ROC-AUC · log loss"
          value={number(selected.roc_auc_ovr_macro)}
          note={`Macro OVR AUC · ${number(selected.log_loss)} log loss`}
        />
        <KPI
          icon={<Leaf size={17} />}
          label="Dataset shape"
          value={`${dataset.samples} × ${dataset.features}`}
          note={`${dataset.classes.length} species · ${dataset.train_samples}/${dataset.test_samples} train/test`}
        />
      </section>

      {/* Interactive Instrument & Specimen Display */}
      <section className="panel mb-8 overflow-hidden border border-slate-200">
        <div className="grid lg:grid-cols-[.9fr_1.1fr]">
          {/* Controls Column */}
          <div className="bg-violet-950 p-6 text-white md:p-8">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-200">
                01 / Interactive instrument
              </p>
              <span className="rounded-full bg-violet-900/80 px-2.5 py-0.5 text-[10px] font-semibold text-violet-200">
                FastAPI / Ready
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Identify a specimen.</h2>
            <p className="mt-2 text-sm leading-6 text-violet-200">
              Adjust the botanical sliders in centimetres or click a quick preset, then press Predict to identify the specimen flower.
            </p>

            {/* Presets */}
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(presets).map(([label, preset]) => (
                <button
                  key={label}
                  onClick={() => {
                    setValues(preset);
                  }}
                  className="rounded-full border border-violet-400/40 bg-violet-900/40 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-800 active:scale-95"
                >
                  {label} preset
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div className="mt-7 space-y-5">
              {featureLabels.map((label, i) => (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <label htmlFor={`feature-${i}`} className="text-violet-100 font-medium">
                      {label}
                    </label>
                    <span className="font-semibold tabular-nums text-white">
                      {values[i].toFixed(1)} {featureUnits[i]}
                    </span>
                  </div>
                  <input
                    id={`feature-${i}`}
                    className="range cursor-pointer"
                    type="range"
                    min={ranges[i][0]}
                    max={ranges[i][1]}
                    step={ranges[i][2]}
                    value={values[i]}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setValues((old) => old.map((val, j) => (j === i ? v : val)));
                    }}
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-violet-300">
                    <span>{ranges[i][0].toFixed(1)} cm</span>
                    <span>{ranges[i][1].toFixed(1)} cm</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Classifier Selection Pills */}
            <div className="mt-6 border-t border-violet-900/80 pt-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                Active Classifier
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-2">
                {MODEL_NAMES.map((name) => (
                  <button
                    key={name}
                    onClick={() => setModel(name)}
                    className={`rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition ${
                      model === name
                        ? "bg-white text-violet-950 shadow-sm"
                        : "bg-violet-900/50 text-violet-200 hover:bg-violet-800/60"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Predict Button */}
            <button
              onClick={predict}
              disabled={predicting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-violet-950 shadow-md transition hover:bg-violet-50 active:scale-[0.98] disabled:opacity-60"
            >
              {predicting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Analyzing measurements…
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-violet-700" />
                  Predict specimen with {model}
                </>
              )}
            </button>
          </div>

          {/* Specimen Output Column */}
          <div className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">
                    Botanical Classification & Specimen
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">
                    {prediction ? "Specimen Identified" : "Awaiting Measurements"}
                  </h3>
                </div>
                <Flower2 className="text-violet-400" size={32} />
              </div>

              {prediction ? (
                <div className="mt-5 space-y-6">
                  {/* Specimen Exhibition Card */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-5 shadow-sm">
                    <div className="grid gap-5 md:grid-cols-[140px_1fr]">
                      {/* Specimen Botanical Illustration */}
                      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-inner">
                        <img
                          src={prediction.specimen?.specimen_svg || `/specimens/${prediction.predicted_species.toLowerCase()}.svg`}
                          alt={prediction.specimen?.scientific_name || prediction.predicted_species}
                          className="h-full w-full object-contain p-1 transition-transform duration-300 hover:scale-105"
                        />
                        <span className="absolute bottom-1 right-1 rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                          Specimen
                        </span>
                      </div>

                      {/* Specimen Details */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-900">
                            {pct(prediction.confidence)} Match
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                            {prediction.specimen?.family || "Iridaceae"}
                          </span>
                        </div>

                        <h4 className="mt-2 text-2xl font-bold italic text-slate-950">
                          {prediction.specimen?.scientific_name || `Iris ${prediction.predicted_species}`}
                        </h4>
                        <p className="text-xs font-semibold text-slate-600">
                          Common: {prediction.specimen?.common_name || prediction.predicted_species}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-slate-600">
                          {prediction.specimen?.description}
                        </p>
                      </div>
                    </div>

                    {/* Distinguishing traits */}
                    {prediction.specimen?.distinguishing_traits && (
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Key Diagnostic Traits:
                        </p>
                        <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
                          {prediction.specimen.distinguishing_traits.map((trait, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                              <Check size={13} className="mt-0.5 shrink-0 text-emerald-600" />
                              <span>{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Morphological Comparison with Specimen Benchmark */}
                    {prediction.specimen?.morphology_averages && (
                      <div className="mt-4 rounded-xl bg-slate-100/70 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Measurement Comparison (Input vs Species Mean)
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                          <div>
                            <div className="text-[10px] text-slate-400">Sepal L</div>
                            <div className="font-semibold text-slate-800 tabular-nums">
                              {values[0].toFixed(1)} cm{" "}
                              <span className="text-[10px] font-normal text-slate-500">
                                (avg {prediction.specimen.morphology_averages.sepal_length}cm)
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Sepal W</div>
                            <div className="font-semibold text-slate-800 tabular-nums">
                              {values[1].toFixed(1)} cm{" "}
                              <span className="text-[10px] font-normal text-slate-500">
                                (avg {prediction.specimen.morphology_averages.sepal_width}cm)
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Petal L</div>
                            <div className="font-semibold text-slate-800 tabular-nums">
                              {values[2].toFixed(1)} cm{" "}
                              <span className="text-[10px] font-normal text-slate-500">
                                (avg {prediction.specimen.morphology_averages.petal_length}cm)
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Petal W</div>
                            <div className="font-semibold text-slate-800 tabular-nums">
                              {values[3].toFixed(1)} cm{" "}
                              <span className="text-[10px] font-normal text-slate-500">
                                (avg {prediction.specimen.morphology_averages.petal_width}cm)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Species Probabilities */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Species Probability Distribution
                    </p>
                    {SPECIES.map((s) => {
                      const prob = prediction.probabilities[s] ?? 0;
                      const isWinner = s.toLowerCase() === prediction.predicted_species.toLowerCase();
                      return (
                        <div key={s}>
                          <div className="mb-1.5 flex justify-between text-xs">
                            <span className={`font-semibold capitalize ${isWinner ? "text-violet-950" : "text-slate-600"}`}>
                              Iris {s} {isWinner && "★"}
                            </span>
                            <span className="tabular-nums font-semibold text-slate-700">{pct(prob)}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isWinner ? "bg-violet-900" : "bg-slate-300"
                              }`}
                              style={{ width: `${Math.max(prob * 100, 2)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Ready State */
                <div className="mt-8 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
                  <div className="rounded-full bg-violet-100 p-4 text-violet-700">
                    <Flower2 size={38} />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-slate-800">
                    Specimen analysis ready
                  </h4>
                  <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                    Select a preset or fine-tune the four morphological sliders on the left, then click <strong>Predict specimen</strong> to display the botanical illustration and classification.
                  </p>
                  <button
                    onClick={predict}
                    className="mt-5 rounded-full bg-violet-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-violet-800"
                  >
                    Quick Test: Identify Setosa
                  </button>
                </div>
              )}
            </div>

            {/* Footer metrics info */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <div className="rounded-xl bg-slate-50 p-2.5">
                <span className="text-slate-400">Classifier</span>
                <div className="font-semibold text-slate-800">{model}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5">
                <span className="text-slate-400">Inference Engine</span>
                <div className="font-semibold text-slate-800">
                  {live ? "Live FastAPI" : "Built-in Engine / Offline"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Herbarium Gallery (All 3 Specimens) */}
      <section className="panel mb-8 p-5 md:p-7">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">
              02 / Reference Herbarium
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              The Three Iris Specimens
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Click any specimen to inspect botanical traits or load its standard measurements.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {Object.values(SPECIMEN_DETAILS).map((specimen) => (
            <div
              key={specimen.species}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-50 p-2">
                  <img
                    src={specimen.specimen_svg}
                    alt={specimen.scientific_name}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    {specimen.family}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {specimen.origin.split(",")[0]}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-bold italic text-slate-950">
                  {specimen.scientific_name}
                </h3>
                <p className="text-xs font-medium text-slate-600">{specimen.common_name}</p>
                <p className="mt-2 text-xs leading-5 text-slate-500 line-clamp-3">
                  {specimen.description}
                </p>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3">
                <button
                  onClick={() => {
                    const presetName =
                      specimen.species.charAt(0).toUpperCase() + specimen.species.slice(1);
                    if (presets[presetName]) {
                      setValues(presets[presetName]);
                      predict();
                    }
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-violet-950 transition hover:bg-violet-100"
                >
                  <Flower2 size={13} />
                  Load & Predict {specimen.scientific_name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Model Performance Comparison */}
      <section className="panel mb-8 p-5 md:p-7">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">
              03 / Model evaluation
            </p>
            <h2 className="mt-1 text-xl font-semibold">Compare classifiers</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {MODEL_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => setModel(name)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  model === name
                    ? "bg-violet-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm tabular-nums">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                {[
                  "Model",
                  "Accuracy",
                  "Macro F1",
                  "Weighted F1",
                  "Macro ROC-AUC",
                  "Log loss",
                  "5-fold CV",
                ].map((x) => (
                  <th key={x} className="px-3 py-3 font-semibold">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODEL_NAMES.map((name) => (
                <tr
                  key={name}
                  onClick={() => setModel(name)}
                  className={`cursor-pointer border-b border-slate-100 last:border-0 ${
                    name === model ? "bg-violet-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="px-3 py-4 font-semibold text-slate-800">{name}</td>
                  <td className="px-3 py-4">{pct(metrics[name].accuracy)}</td>
                  <td className="px-3 py-4">{pct(metrics[name].macro_f1)}</td>
                  <td className="px-3 py-4">{pct(metrics[name].weighted_f1)}</td>
                  <td className="px-3 py-4">{number(metrics[name].roc_auc_ovr_macro)}</td>
                  <td className="px-3 py-4">{number(metrics[name].log_loss)}</td>
                  <td className="px-3 py-4">{pct(metrics[name].cv_accuracy_mean)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Holdout metrics use the same stratified 20% test partition. CV values show mean accuracy across five stratified folds.
        </p>
      </section>

      {/* Confusion Matrix & Class Metrics */}
      <div className="mb-8 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <section className="panel p-5 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">
            04 / Error profile
          </p>
          <h2 className="mb-5 mt-1 text-xl font-semibold">Confusion matrix</h2>
          <div className="grid grid-cols-[74px_repeat(3,minmax(0,1fr))] gap-2 text-center text-xs tabular-nums">
            <div />
            <div className="pb-1 font-semibold text-slate-500">Setosa</div>
            <div className="font-semibold text-slate-500">Versicolor</div>
            <div className="font-semibold text-slate-500">Virginica</div>
            {selected.confusion_matrix.map((row, i) => (
              <div key={`row-${i}`} className="contents">
                <div className="flex items-center text-left font-semibold text-slate-500">
                  {SPECIES[i]}
                </div>
                {row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`flex aspect-square items-center justify-center rounded-xl text-lg font-semibold ${
                      i === j
                        ? "bg-teal-100 text-teal-900"
                        : cell > 0
                        ? "bg-rose-50 text-rose-700"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Rows = actual species · columns = predicted species
          </p>
        </section>

        <section className="panel p-5 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">
            05 / Class-level detail
          </p>
          <h2 className="mb-5 mt-1 text-xl font-semibold">Per-species performance</h2>
          <div className="space-y-4">
            {SPECIES.map((species) => {
              const item = selected.per_class[species];
              return (
                <div key={species} className="rounded-xl border border-slate-100 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-semibold capitalize text-slate-900">
                      Iris {species}
                    </span>
                    <span className="text-xs text-slate-400">{item.support} test samples</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["Precision", item.precision],
                      ["Recall", item.recall],
                      ["F1-score", item.f1_score],
                    ].map(([label, val]) => (
                      <div key={label as string}>
                        <div className="mb-1 text-[11px] text-slate-400">{label}</div>
                        <div className="font-semibold tabular-nums text-slate-800">
                          {pct(val as number)}
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-700"
                            style={{ width: `${(val as number) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* PWA Install Modal for iOS, Android, and Windows */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-950 text-white shadow-md">
                <Flower2 size={26} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Install Iris Lab</h3>
                <p className="text-xs text-slate-500">
                  Run as a standalone native app on iOS, Android & Windows
                </p>
              </div>
            </div>

            {/* Platform instructions */}
            <div className="mt-6 space-y-4">
              {/* iOS Guide */}
              <div
                className={`rounded-xl border p-4 transition ${
                  platform === "ios"
                    ? "border-violet-400 bg-violet-50/60 ring-2 ring-violet-200"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Smartphone size={18} className="text-violet-800" />
                  <span>Apple iOS (iPhone & iPad)</span>
                  {platform === "ios" && (
                    <span className="ml-auto rounded-full bg-violet-200 px-2 py-0.5 text-[10px] text-violet-900">
                      Detected
                    </span>
                  )}
                </div>
                <ol className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-900 text-[10px] font-bold text-white">
                      1
                    </span>
                    <span>
                      Open this URL in <strong>Safari</strong> on your iPhone or iPad.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-900 text-[10px] font-bold text-white">
                      2
                    </span>
                    <span>
                      Tap the <strong>Share</strong> button at the bottom of the screen (the square with an arrow pointing up).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-900 text-[10px] font-bold text-white">
                      3
                    </span>
                    <span>
                      Scroll down and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
                    </span>
                  </li>
                </ol>
              </div>

              {/* Android Guide */}
              <div
                className={`rounded-xl border p-4 transition ${
                  platform === "android"
                    ? "border-violet-400 bg-violet-50/60 ring-2 ring-violet-200"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Smartphone size={18} className="text-teal-700" />
                  <span>Android (Chrome & Edge)</span>
                  {platform === "android" && (
                    <span className="ml-auto rounded-full bg-teal-200 px-2 py-0.5 text-[10px] text-teal-900">
                      Detected
                    </span>
                  )}
                </div>
                <ol className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-800 text-[10px] font-bold text-white">
                      1
                    </span>
                    <span>
                      Tap the three dots menu (⋮) in the top-right corner of Chrome.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-800 text-[10px] font-bold text-white">
                      2
                    </span>
                    <span>
                      Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-800 text-[10px] font-bold text-white">
                      3
                    </span>
                    <span>Confirm by tapping <strong>Install</strong>.</span>
                  </li>
                </ol>
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="mt-3 w-full rounded-lg bg-teal-700 py-2 text-xs font-bold text-white hover:bg-teal-800"
                  >
                    Click to Install on Android Now
                  </button>
                )}
              </div>

              {/* Windows Guide */}
              <div
                className={`rounded-xl border p-4 transition ${
                  platform === "windows"
                    ? "border-violet-400 bg-violet-50/60 ring-2 ring-violet-200"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Monitor size={18} className="text-sky-700" />
                  <span>Windows PC (Edge & Chrome)</span>
                  {platform === "windows" && (
                    <span className="ml-auto rounded-full bg-sky-200 px-2 py-0.5 text-[10px] text-sky-900">
                      Detected
                    </span>
                  )}
                </div>
                <ol className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-800 text-[10px] font-bold text-white">
                      1
                    </span>
                    <span>
                      Look in the browser address bar for the <strong>Install app</strong> icon (a computer monitor with downward arrow).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-800 text-[10px] font-bold text-white">
                      2
                    </span>
                    <span>
                      Click it and choose <strong>Install</strong> to add Iris Lab to your Windows Start menu and Taskbar.
                    </span>
                  </li>
                </ol>
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="mt-3 w-full rounded-lg bg-sky-700 py-2 text-xs font-bold text-white hover:bg-sky-800"
                  >
                    Click to Install on Windows Now
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowInstallModal(false)}
              className="mt-6 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Flower2 size={15} className="text-violet-800" />
          <span className="font-semibold text-slate-700">IRIS LAB SUITE</span>
          <span>·</span>
          <span>Scikit-learn 150 observations (random_state=42)</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-slate-400">
          <button
            onClick={() => setShowInstallModal(true)}
            className="flex items-center gap-1 text-slate-600 hover:text-violet-900"
          >
            <Download size={13} />
            Install on device
          </button>
          <span>·</span>
          <span>80/20 Stratified Split</span>
          <span>·</span>
          <span>PWA Ready</span>
        </div>
      </footer>
    </main>
  );
}

function KPI({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        <span className="text-violet-900">{icon}</span>
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 tabular-nums">
        {value}
      </div>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  );
}