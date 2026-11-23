import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import {
  FALLBACK_DATASET_SUMMARY, FALLBACK_METRICS, MODEL_NAMES, SPECIES,
  SPECIMEN_DETAILS, predictIris, type ModelName, type PredictionResult,
} from "./src/irisMetrics";

type Metrics = typeof FALLBACK_METRICS;
type Tab = "Metrics" | "Confusion" | "Predict" | "Specimens";
const API = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");

const PRESETS: Record<string, number[]> = {
  Setosa: [5.1, 3.5, 1.4, 0.2],
  Versicolor: [6.0, 2.9, 4.5, 1.5],
  Virginica: [6.5, 3.0, 5.5, 2.0],
};

const COLORS = {
  ink: "#172033",
  muted: "#718096",
  purple: "#4c1d95",
  teal: "#0f766e",
  line: "#e5eaf0",
  bg: "#f5f7fa",
  white: "#ffffff",
  green: "#059669",
};

const percent = (v: number) => `${(v * 100).toFixed(1)}%`;

export default function App() {
  const [tab, setTab] = useState<Tab>("Predict");
  const [model, setModel] = useState<ModelName>("Random Forest");
  const [metrics, setMetrics] = useState<Metrics>(FALLBACK_METRICS);
  const [live, setLive] = useState(false);
  const [values, setValues] = useState<number[]>([5.1, 3.5, 1.4, 0.2]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!API) return;
    fetch(`${API}/models/metrics`)
      .then((r) => {
        if (!r.ok) throw new Error("API unavailable");
        return r.json();
      })
      .then((data) => {
        if (data.models) {
          setMetrics(data.models);
          setLive(true);
        }
      })
      .catch(() => setLive(false));
  }, []);

  const selected = (metrics as Metrics)[model] ?? FALLBACK_METRICS[model];
  const topModel = useMemo(
    () =>
      MODEL_NAMES.reduce(
        (best, n) =>
          (metrics as Metrics)[n].accuracy > (metrics as Metrics)[best].accuracy ? n : best,
        MODEL_NAMES[0]
      ),
    [metrics]
  );

  async function runPrediction() {
    setLoading(true);
    try {
      if (API) {
        const response = await fetch(`${API}/predict`, {
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
      }
      // Instant fallback prediction
      const localResult = predictIris(values, model);
      setPrediction(localResult);
    } catch {
      const localResult = predictIris(values, model);
      setPrediction(localResult);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>BOTANICAL CLASSIFIER / ML</Text>
          <Text style={styles.title}>
            Iris <Text style={{ color: COLORS.purple }}>Lab.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Field classification studio for three Iris flower species.
          </Text>
          <View style={styles.status}>
            <View
              style={[
                styles.dot,
                { backgroundColor: live ? "#10b981" : "#10b981" },
              ]}
            />
            <Text style={styles.statusText}>
              {live ? "Live FastAPI connected" : "Integrated ML ready"}
            </Text>
          </View>
        </View>

        <View style={styles.modelBlock}>
          <Text style={styles.sectionLabel}>SELECT CLASSIFIER</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingVertical: 10 }}
          >
            {MODEL_NAMES.map((name) => (
              <TouchableOpacity
                key={name}
                onPress={() => {
                  setModel(name);
                }}
                style={[styles.pill, model === name && styles.pillActive]}
              >
                <Text
                  style={[
                    styles.pillText,
                    model === name && styles.pillTextActive,
                  ]}
                >
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.tabs}>
          {(["Predict", "Specimens", "Metrics", "Confusion"] as Tab[]).map(
            (item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setTab(item)}
                style={[styles.tab, tab === item && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === item && styles.tabTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Tab 1: Predict & Specimen Display */}
        {tab === "Predict" && (
          <View>
            <Text style={styles.sectionTitle}>Identify a flower</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quick specimen presets</Text>
              <View style={styles.presetRow}>
                {Object.entries(PRESETS).map(([name, preset]) => (
                  <TouchableOpacity
                    key={name}
                    onPress={() => {
                      setValues(preset);
                    }}
                    style={styles.preset}
                  >
                    <Text style={styles.presetText}>{name} preset</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {["Sepal length", "Sepal width", "Petal length", "Petal width"].map(
                (label, i) => (
                  <View key={label} style={styles.measureRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{label}</Text>
                      <Text style={styles.rowSub}>Centimetres (cm)</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.stepper}
                      onPress={() => {
                        setValues((old) =>
                          old.map((v, j) =>
                            j === i
                              ? Math.max([4, 2, 1, 0.1][i], Number((v - 0.1).toFixed(1)))
                              : v
                          )
                        );
                      }}
                    >
                      <Text style={styles.stepText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.measureValue}>{values[i].toFixed(1)}</Text>
                    <TouchableOpacity
                      style={styles.stepper}
                      onPress={() => {
                        setValues((old) =>
                          old.map((v, j) =>
                            j === i
                              ? Math.min([8, 4.5, 7, 2.5][i], Number((v + 0.1).toFixed(1)))
                              : v
                          )
                        );
                      }}
                    >
                      <Text style={styles.stepText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}

              <TouchableOpacity
                style={styles.predictButton}
                onPress={runPrediction}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.predictButtonText}>
                    Predict specimen · {model}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Specimen Output Card */}
            {prediction ? (
              <View style={[styles.card, { borderColor: COLORS.purple, borderWidth: 1.5 }]}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={styles.sectionLabel}>SPECIMEN IDENTIFIED</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{percent(prediction.confidence)} Match</Text>
                  </View>
                </View>

                <Text style={styles.specimenScientific}>
                  {prediction.specimen?.scientific_name || `Iris ${prediction.predicted_species}`}
                </Text>
                <Text style={styles.specimenCommon}>
                  Common: {prediction.specimen?.common_name || prediction.predicted_species}
                </Text>

                <Text style={styles.specimenDesc}>
                  {prediction.specimen?.description}
                </Text>

                {prediction.specimen?.distinguishing_traits && (
                  <View style={styles.traitsBlock}>
                    <Text style={styles.traitsTitle}>Diagnostic Traits:</Text>
                    {prediction.specimen.distinguishing_traits.map((trait, idx) => (
                      <Text key={idx} style={styles.traitItem}>• {trait}</Text>
                    ))}
                  </View>
                )}

                {/* Measurements vs Benchmark */}
                {prediction.specimen?.morphology_averages && (
                  <View style={styles.comparisonBox}>
                    <Text style={styles.traitsTitle}>Measured vs Species Mean:</Text>
                    <View style={styles.compGrid}>
                      <View style={styles.compCell}>
                        <Text style={styles.compLabel}>Sepal L</Text>
                        <Text style={styles.compVal}>{values[0].toFixed(1)} cm</Text>
                        <Text style={styles.compAvg}>avg {prediction.specimen.morphology_averages.sepal_length}</Text>
                      </View>
                      <View style={styles.compCell}>
                        <Text style={styles.compLabel}>Sepal W</Text>
                        <Text style={styles.compVal}>{values[1].toFixed(1)} cm</Text>
                        <Text style={styles.compAvg}>avg {prediction.specimen.morphology_averages.sepal_width}</Text>
                      </View>
                      <View style={styles.compCell}>
                        <Text style={styles.compLabel}>Petal L</Text>
                        <Text style={styles.compVal}>{values[2].toFixed(1)} cm</Text>
                        <Text style={styles.compAvg}>avg {prediction.specimen.morphology_averages.petal_length}</Text>
                      </View>
                      <View style={styles.compCell}>
                        <Text style={styles.compLabel}>Petal W</Text>
                        <Text style={styles.compVal}>{values[3].toFixed(1)} cm</Text>
                        <Text style={styles.compAvg}>avg {prediction.specimen.morphology_averages.petal_width}</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Species probability distribution */}
                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>PROBABILITY DISTRIBUTION</Text>
                {SPECIES.map((s) => (
                  <View key={s} style={styles.probRow}>
                    <View style={styles.probHead}>
                      <Text style={[styles.rowTitle, s.toLowerCase() === prediction.predicted_species.toLowerCase() && { color: COLORS.purple }]}>
                        Iris {s}
                      </Text>
                      <Text style={styles.rowTitle}>
                        {percent(prediction.probabilities[s] || 0)}
                      </Text>
                    </View>
                    <View style={styles.track}>
                      <View
                        style={[
                          styles.fill,
                          {
                            width: `${(prediction.probabilities[s] || 0) * 100}%`,
                            backgroundColor:
                              s.toLowerCase() === prediction.predicted_species.toLowerCase()
                                ? COLORS.purple
                                : COLORS.teal,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={[styles.card, { alignItems: "center", paddingVertical: 28 }]}>
                <Text style={{ fontSize: 32 }}>🌸</Text>
                <Text style={[styles.cardTitle, { marginTop: 8 }]}>Ready for specimen</Text>
                <Text style={[styles.footnote, { textAlign: "center" }]}>
                  Select a preset or adjust measurements, then tap "Predict specimen".
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Tab 2: Specimens Reference */}
        {tab === "Specimens" && (
          <View>
            <Text style={styles.sectionTitle}>Reference Herbarium</Text>
            {Object.values(SPECIMEN_DETAILS).map((specimen) => (
              <View key={specimen.species} style={styles.card}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.sectionLabel}>{specimen.family}</Text>
                  <Text style={styles.rowSub}>{specimen.origin.split(",")[0]}</Text>
                </View>
                <Text style={styles.specimenScientific}>{specimen.scientific_name}</Text>
                <Text style={styles.specimenCommon}>{specimen.common_name}</Text>
                <Text style={styles.specimenDesc}>{specimen.description}</Text>

                <TouchableOpacity
                  style={[styles.preset, { marginTop: 12, alignItems: "center" }]}
                  onPress={() => {
                    const presetName =
                      specimen.species.charAt(0).toUpperCase() + specimen.species.slice(1);
                    if (PRESETS[presetName]) {
                      setValues(PRESETS[presetName]);
                      setTab("Predict");
                      runPrediction();
                    }
                  }}
                >
                  <Text style={styles.presetText}>Load & Classify {specimen.scientific_name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Tab 3: Metrics */}
        {tab === "Metrics" && (
          <View>
            <Text style={styles.sectionTitle}>Model performance</Text>
            <View style={styles.kpiGrid}>
              <MetricCard
                label="TOP MODEL"
                value={topModel}
                note={percent(metrics[topModel].accuracy) + " accuracy"}
              />
              <MetricCard
                label="ACCURACY"
                value={percent(selected.accuracy)}
                note="Holdout test set"
              />
              <MetricCard
                label="5-FOLD CV"
                value={percent(selected.cv_accuracy_mean)}
                note={`± ${percent(selected.cv_accuracy_std)} std. dev.`}
              />
              <MetricCard
                label="ROC-AUC"
                value={selected.roc_auc_ovr_macro.toFixed(3)}
                note={`Log loss ${selected.log_loss.toFixed(3)}`}
              />
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>All model scores</Text>
              {MODEL_NAMES.map((name) => (
                <TouchableOpacity
                  key={name}
                  onPress={() => setModel(name)}
                  style={styles.scoreRow}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>{name}</Text>
                    <Text style={styles.rowSub}>
                      Macro F1 · {percent(metrics[name].macro_f1)}
                    </Text>
                  </View>
                  <Text style={styles.score}>
                    {percent(metrics[name].accuracy)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.footnote}>
              {FALLBACK_DATASET_SUMMARY.samples} samples · {FALLBACK_DATASET_SUMMARY.features} features · 3 classes · stratified 80/20 split
            </Text>
          </View>
        )}

        {/* Tab 4: Confusion Matrix */}
        {tab === "Confusion" && (
          <View>
            <Text style={styles.sectionTitle}>Confusion matrix</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{model}</Text>
              <View style={styles.matrix}>
                <View style={styles.matrixRow}>
                  <View style={styles.matrixHead} />
                  {SPECIES.map((s) => (
                    <View key={s} style={styles.matrixHead}>
                      <Text style={styles.matrixHeadText}>{s.slice(0, 4)}</Text>
                    </View>
                  ))}
                </View>
                {selected.confusion_matrix.map((row, i) => (
                  <View key={SPECIES[i]} style={styles.matrixRow}>
                    <View style={styles.matrixHead}>
                      <Text style={styles.matrixHeadText}>
                        {SPECIES[i].slice(0, 4)}
                      </Text>
                    </View>
                    {row.map((v, j) => (
                      <View
                        key={`${i}-${j}`}
                        style={[
                          styles.matrixCell,
                          i === j
                            ? styles.matrixCorrect
                            : v > 0
                            ? styles.matrixError
                            : styles.matrixEmpty,
                        ]}
                      >
                        <Text
                          style={[
                            styles.matrixValue,
                            i === j ? { color: COLORS.teal } : {},
                          ]}
                        >
                          {v}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
              <Text style={styles.footnote}>
                Rows are actual classes; columns are predicted classes.
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          IRIS LAB · SCI-KIT LEARN · REPRODUCIBLE PIPELINE
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>
        {value}
      </Text>
      <Text style={styles.metricNote}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 18, paddingBottom: 40 },
  header: {
    paddingTop: 8,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 2, color: COLORS.teal },
  title: {
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1.2,
    color: COLORS.ink,
    marginTop: 6,
  },
  subtitle: { fontSize: 13, lineHeight: 19, color: COLORS.muted, marginTop: 4 },
  status: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 5 },
  statusText: { fontSize: 11, color: COLORS.muted, fontWeight: "600" },
  modelBlock: { marginTop: 18 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.teal,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: "#e9edf3",
  },
  pillActive: { backgroundColor: COLORS.purple },
  pillText: { fontSize: 12, color: "#566174", fontWeight: "600" },
  pillTextActive: { color: "#fff" },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#e9edf3",
    borderRadius: 12,
    padding: 3,
    marginTop: 6,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 9 },
  tabActive: { backgroundColor: COLORS.white },
  tabText: { fontSize: 11, color: COLORS.muted, fontWeight: "600" },
  tabTextActive: { color: COLORS.purple, fontWeight: "800" },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.ink,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  metricCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 13,
    minHeight: 105,
  },
  metricLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 1, color: COLORS.muted },
  metricValue: { fontSize: 21, fontWeight: "800", color: COLORS.ink, marginTop: 10 },
  metricNote: { fontSize: 10, color: COLORS.muted, marginTop: 4 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
    marginTop: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "800", color: COLORS.ink, marginBottom: 12 },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: "#f0f2f5",
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.ink,
    textTransform: "capitalize",
  },
  rowSub: { fontSize: 11, color: COLORS.muted, marginTop: 3 },
  score: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.teal,
    fontVariant: ["tabular-nums"],
  },
  footnote: { fontSize: 10, lineHeight: 15, color: "#94a0b1", marginTop: 10 },
  matrix: { gap: 6 },
  matrixRow: { flexDirection: "row", gap: 6 },
  matrixHead: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  matrixHeadText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "capitalize",
  },
  matrixCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  matrixCorrect: { backgroundColor: "#d8f1e9" },
  matrixError: { backgroundColor: "#fff0ef" },
  matrixEmpty: { backgroundColor: "#f1f4f7" },
  matrixValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.ink,
    fontVariant: ["tabular-nums"],
  },
  presetRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  preset: {
    borderRadius: 16,
    backgroundColor: "#f0ebfa",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  presetText: { fontSize: 11, fontWeight: "700", color: COLORS.purple },
  measureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f2f5",
    gap: 8,
  },
  stepper: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "#f0ebfa",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { fontSize: 18, color: COLORS.purple, fontWeight: "600" },
  measureValue: {
    width: 38,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.ink,
    fontVariant: ["tabular-nums"],
  },
  predictButton: {
    backgroundColor: COLORS.purple,
    borderRadius: 12,
    alignItems: "center",
    padding: 14,
    marginTop: 14,
  },
  predictButtonText: { fontSize: 13, fontWeight: "800", color: "#fff" },
  specimenScientific: {
    fontSize: 24,
    fontWeight: "800",
    fontStyle: "italic",
    color: COLORS.purple,
    marginTop: 8,
  },
  specimenCommon: { fontSize: 13, fontWeight: "600", color: COLORS.muted, marginTop: 2 },
  specimenDesc: { fontSize: 12, lineHeight: 18, color: "#475569", marginTop: 8 },
  traitsBlock: { marginTop: 12, borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 10 },
  traitsTitle: { fontSize: 11, fontWeight: "800", color: COLORS.muted, textTransform: "uppercase" },
  traitItem: { fontSize: 12, color: "#334155", marginTop: 3 },
  badge: { backgroundColor: "#d1fae5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: "800", color: "#065f46" },
  comparisonBox: { backgroundColor: "#f8fafc", borderRadius: 10, padding: 10, marginTop: 12 },
  compGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  compCell: { alignItems: "center" },
  compLabel: { fontSize: 10, color: COLORS.muted },
  compVal: { fontSize: 12, fontWeight: "800", color: COLORS.ink, marginTop: 2 },
  compAvg: { fontSize: 9, color: "#94a3b8", marginTop: 1 },
  probRow: { marginTop: 12 },
  probHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  track: { height: 8, backgroundColor: "#edf0f4", borderRadius: 6, overflow: "hidden" },
  fill: { height: 8, borderRadius: 6 },
  footer: { textAlign: "center", fontSize: 9, letterSpacing: 1, color: "#9aa4b2", marginTop: 24 },
});