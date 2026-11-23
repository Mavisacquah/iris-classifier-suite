import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { FALLBACK_DATASET_SUMMARY, FALLBACK_METRICS, MODEL_NAMES, SPECIES } from "./src/irisMetrics";

type ModelName = keyof typeof FALLBACK_METRICS;
type Metrics = typeof FALLBACK_METRICS;
type Tab = "Metrics" | "Confusion" | "Predict";
type Prediction = { predicted_species: string; confidence: number; probabilities: Record<string, number> };
const API = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
const PRESETS: Record<string, number[]> = {
  Setosa: [5.1, 3.5, 1.4, 0.2],
  Versicolor: [6.0, 2.9, 4.5, 1.5],
  Virginica: [6.5, 3.0, 5.5, 2.0],
};
const COLORS = { ink: "#172033", muted: "#718096", purple: "#4c1d95", teal: "#0f766e", line: "#e5eaf0", bg: "#f5f7fa", white: "#ffffff" };
const percent = (v: number) => `${(v * 100).toFixed(1)}%`;

export default function App() {
  const [tab, setTab] = useState<Tab>("Metrics");
  const [model, setModel] = useState<ModelName>("Random Forest");
  const [metrics, setMetrics] = useState<Metrics>(FALLBACK_METRICS);
  const [live, setLive] = useState(false);
  const [values, setValues] = useState<number[]>([5.1, 3.5, 1.4, 0.2]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!API) return;
    fetch(`${API}/models/metrics`)
      .then(r => { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
      .then(data => { if (data.models) { setMetrics(data.models); setLive(true); } })
      .catch(() => setLive(false));
  }, []);

  const selected = metrics[model] ?? FALLBACK_METRICS[model];
  const topModel = useMemo(() => MODEL_NAMES.reduce((best, n) => metrics[n].accuracy > metrics[best].accuracy ? n : best, MODEL_NAMES[0]), [metrics]);

  async function runPrediction() {
    if (!API) { setPrediction(null); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API}/predict`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sepal_length: values[0], sepal_width: values[1],
          petal_length: values[2], petal_width: values[3], model_name: model,
        }),
      });
      if (!response.ok) throw new Error("Prediction failed");
      setPrediction(await response.json());
    } catch { setPrediction(null); }
    finally { setLoading(false); }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg}/>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FIELD NOTES / MACHINE LEARNING</Text>
          <Text style={styles.title}>Iris <Text style={{color:COLORS.purple}}>Lab.</Text></Text>
          <Text style={styles.subtitle}>A pocket classification studio for three Iris species.</Text>
          <View style={styles.status}><View style={[styles.dot,{backgroundColor:live? "#10b981":"#d97706"}]}/><Text style={styles.statusText}>{live ? "Live API connected" : "Precomputed metrics"}</Text></View>
        </View>

        <View style={styles.modelBlock}>
          <Text style={styles.sectionLabel}>SELECT CLASSIFIER</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,paddingVertical:12}}>
            {MODEL_NAMES.map(name=><TouchableOpacity key={name} onPress={()=>{setModel(name);setPrediction(null);}} style={[styles.pill,model===name&&styles.pillActive]}><Text style={[styles.pillText,model===name&&styles.pillTextActive]}>{name}</Text></TouchableOpacity>)}
          </ScrollView>
        </View>

        <View style={styles.tabs}>
          {(["Metrics","Confusion","Predict"] as Tab[]).map(item=><TouchableOpacity key={item} onPress={()=>setTab(item)} style={[styles.tab,tab===item&&styles.tabActive]}><Text style={[styles.tabText,tab===item&&styles.tabTextActive]}>{item}</Text></TouchableOpacity>)}
        </View>

        {tab === "Metrics" && <View>
          <Text style={styles.sectionTitle}>Model performance</Text>
          <View style={styles.kpiGrid}>
            <MetricCard label="TOP MODEL" value={topModel} note={percent(metrics[topModel].accuracy)+" accuracy"}/>
            <MetricCard label="ACCURACY" value={percent(selected.accuracy)} note="Holdout test set"/>
            <MetricCard label="5-FOLD CV" value={percent(selected.cv_accuracy_mean)} note={`± ${percent(selected.cv_accuracy_std)} std. dev.`}/>
            <MetricCard label="ROC-AUC" value={selected.roc_auc_ovr_macro.toFixed(3)} note={`Log loss ${selected.log_loss.toFixed(3)}`}/>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>All model scores</Text>
            {MODEL_NAMES.map(name=><TouchableOpacity key={name} onPress={()=>setModel(name)} style={styles.scoreRow}>
              <View style={{flex:1}}><Text style={styles.rowTitle}>{name}</Text><Text style={styles.rowSub}>Macro F1 · {percent(metrics[name].macro_f1)}</Text></View>
              <Text style={styles.score}>{percent(metrics[name].accuracy)}</Text>
            </TouchableOpacity>)}
          </View>
          <Text style={styles.footnote}>{FALLBACK_DATASET_SUMMARY.samples} samples · {FALLBACK_DATASET_SUMMARY.features} features · 3 classes · stratified 80/20 split</Text>
        </View>}

        {tab === "Confusion" && <View>
          <Text style={styles.sectionTitle}>Confusion matrix</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{model}</Text>
            <View style={styles.matrix}>
              <View style={styles.matrixRow}><View style={styles.matrixHead}/>{SPECIES.map(s=><View key={s} style={styles.matrixHead}><Text style={styles.matrixHeadText}>{s.slice(0,4)}</Text></View>)}</View>
              {selected.confusion_matrix.map((row,i)=><View key={SPECIES[i]} style={styles.matrixRow}>
                <View style={styles.matrixHead}><Text style={styles.matrixHeadText}>{SPECIES[i].slice(0,4)}</Text></View>
                {row.map((v,j)=><View key={`${i}-${j}`} style={[styles.matrixCell,i===j?styles.matrixCorrect:v>0?styles.matrixError:styles.matrixEmpty]}><Text style={[styles.matrixValue,i===j?{color:COLORS.teal}:{}]}>{v}</Text></View>)}
              </View>)}
            </View>
            <Text style={styles.footnote}>Rows are actual classes; columns are predicted classes.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Per-class metrics</Text>
            {SPECIES.map(s=><View key={s} style={styles.classRow}>
              <Text style={styles.rowTitle}>{s}</Text>
              <Text style={styles.rowSub}>P {percent(selected.per_class[s].precision)}  ·  R {percent(selected.per_class[s].recall)}  ·  F1 {percent(selected.per_class[s].f1_score)}</Text>
              <Text style={styles.rowSub}>Support: {selected.per_class[s].support}</Text>
            </View>)}
          </View>
        </View>}

        {tab === "Predict" && <View>
          <Text style={styles.sectionTitle}>Identify a flower</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quick specimen presets</Text>
            <View style={styles.presetRow}>{Object.entries(PRESETS).map(([name,preset])=><TouchableOpacity key={name} onPress={()=>{setValues(preset);setPrediction(null);}} style={styles.preset}><Text style={styles.presetText}>{name}</Text></TouchableOpacity>)}</View>
            {["Sepal length","Sepal width","Petal length","Petal width"].map((label,i)=><View key={label} style={styles.measureRow}>
              <View style={{flex:1}}><Text style={styles.rowTitle}>{label}</Text><Text style={styles.rowSub}>Centimetres</Text></View>
              <TouchableOpacity style={styles.stepper} onPress={()=>{setValues(old=>old.map((v,j)=>j===i?Math.max([4,2,1,.1][i],Number((v-.1).toFixed(1))):v));setPrediction(null);}}><Text style={styles.stepText}>−</Text></TouchableOpacity>
              <Text style={styles.measureValue}>{values[i].toFixed(1)}</Text>
              <TouchableOpacity style={styles.stepper} onPress={()=>{setValues(old=>old.map((v,j)=>j===i?Math.min([8,4.5,7,2.5][i],Number((v+.1).toFixed(1))):v));setPrediction(null);}}><Text style={styles.stepText}>+</Text></TouchableOpacity>
            </View>)}
            <TouchableOpacity style={styles.predictButton} onPress={runPrediction} disabled={loading}>{loading?<ActivityIndicator color="#fff"/>:<Text style={styles.predictButtonText}>Run prediction · {model}</Text>}</TouchableOpacity>
            {!API&&<Text style={styles.footnote}>Set EXPO_PUBLIC_API_URL and start the FastAPI server to enable live predictions. Metrics are available offline.</Text>}
          </View>
          {prediction && <View style={styles.card}>
            <Text style={styles.sectionLabel}>PREDICTED SPECIES</Text>
            <Text style={styles.predicted}>{prediction.predicted_species}</Text>
            <Text style={styles.rowSub}>{percent(prediction.confidence)} model confidence</Text>
            {SPECIES.map(s=><View key={s} style={styles.probRow}><View style={styles.probHead}><Text style={styles.rowTitle}>{s}</Text><Text style={styles.rowTitle}>{percent(prediction.probabilities[s]||0)}</Text></View><View style={styles.track}><View style={[styles.fill,{width:`${(prediction.probabilities[s]||0)*100}%`}]}/></View></View>)}
          </View>}
        </View>}
        <Text style={styles.footer}>IRIS LAB  ·  SCI-KIT LEARN  ·  RANDOM STATE 42</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({label,value,note}:{label:string;value:string;note:string}) {
  return <View style={styles.metricCard}><Text style={styles.metricLabel}>{label}</Text><Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>{value}</Text><Text style={styles.metricNote}>{note}</Text></View>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:COLORS.bg},
  container:{padding:20,paddingBottom:42},
  header:{paddingTop:12,paddingBottom:22,borderBottomWidth:1,borderBottomColor:COLORS.line},
  eyebrow:{fontSize:10,fontWeight:"800",letterSpacing:2,color:COLORS.teal},
  title:{fontSize:42,fontWeight:"800",letterSpacing:-1.5,color:COLORS.ink,marginTop:8},
  subtitle:{fontSize:14,lineHeight:21,color:COLORS.muted,marginTop:4},
  status:{flexDirection:"row",alignItems:"center",alignSelf:"flex-start",gap:7,marginTop:14,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,borderRadius:20,paddingHorizontal:11,paddingVertical:7},
  dot:{width:7,height:7,borderRadius:5},statusText:{fontSize:11,color:COLORS.muted,fontWeight:"600"},
  modelBlock:{marginTop:20},sectionLabel:{fontSize:10,fontWeight:"800",letterSpacing:1.5,color:COLORS.teal},
  pill:{paddingHorizontal:13,paddingVertical:10,borderRadius:24,backgroundColor:"#e9edf3"},
  pillActive:{backgroundColor:COLORS.purple},pillText:{fontSize:12,color:"#566174",fontWeight:"600"},pillTextActive:{color:"#fff"},
  tabs:{flexDirection:"row",backgroundColor:"#e9edf3",borderRadius:13,padding:4,marginTop:8,marginBottom:24},
  tab:{flex:1,paddingVertical:11,alignItems:"center",borderRadius:10},tabActive:{backgroundColor:COLORS.white},
  tabText:{fontSize:12,color:COLORS.muted,fontWeight:"600"},tabTextActive:{color:COLORS.purple,fontWeight:"800"},
  sectionTitle:{fontSize:23,fontWeight:"800",color:COLORS.ink,marginBottom:15,letterSpacing:-.5},
  kpiGrid:{flexDirection:"row",flexWrap:"wrap",gap:10,marginBottom:14},
  metricCard:{width:"48%",flexGrow:1,backgroundColor:COLORS.white,borderRadius:16,borderWidth:1,borderColor:COLORS.line,padding:14,minHeight:112},
  metricLabel:{fontSize:9,fontWeight:"800",letterSpacing:1,color:COLORS.muted},
  metricValue:{fontSize:22,fontWeight:"800",color:COLORS.ink,marginTop:12},
  metricNote:{fontSize:10,color:COLORS.muted,marginTop:4},
  card:{backgroundColor:COLORS.white,borderRadius:18,borderWidth:1,borderColor:COLORS.line,padding:17,marginTop:12},
  cardTitle:{fontSize:16,fontWeight:"800",color:COLORS.ink,marginBottom:14},
  scoreRow:{flexDirection:"row",alignItems:"center",paddingVertical:12,borderTopWidth:1,borderTopColor:"#f0f2f5"},
  rowTitle:{fontSize:13,fontWeight:"700",color:COLORS.ink,textTransform:"capitalize"},
  rowSub:{fontSize:11,color:COLORS.muted,marginTop:4},
  score:{fontSize:15,fontWeight:"800",color:COLORS.teal,fontVariant:["tabular-nums"]},
  footnote:{fontSize:10,lineHeight:16,color:"#94a0b1",marginTop:12},
  matrix:{gap:7},matrixRow:{flexDirection:"row",gap:7},matrixHead:{flex:1,minWidth:0,justifyContent:"center",alignItems:"center",paddingVertical:9},
  matrixHeadText:{fontSize:10,fontWeight:"700",color:COLORS.muted,textTransform:"capitalize"},
  matrixCell:{flex:1,aspectRatio:1,borderRadius:11,justifyContent:"center",alignItems:"center"},
  matrixCorrect:{backgroundColor:"#d8f1e9"},matrixError:{backgroundColor:"#fff0ef"},matrixEmpty:{backgroundColor:"#f1f4f7"},
  matrixValue:{fontSize:19,fontWeight:"800",color:COLORS.ink,fontVariant:["tabular-nums"]},
  classRow:{paddingVertical:12,borderTopWidth:1,borderTopColor:"#f0f2f5"},
  presetRow:{flexDirection:"row",flexWrap:"wrap",gap:7,marginBottom:15},
  preset:{borderRadius:18,backgroundColor:"#f0ebfa",paddingHorizontal:11,paddingVertical:9},presetText:{fontSize:11,fontWeight:"700",color:COLORS.purple},
  measureRow:{flexDirection:"row",alignItems:"center",paddingVertical:12,borderTopWidth:1,borderTopColor:"#f0f2f5",gap:8},
  stepper:{width:32,height:32,borderRadius:10,backgroundColor:"#f0ebfa",alignItems:"center",justifyContent:"center"},
  stepText:{fontSize:20,color:COLORS.purple,fontWeight:"600"},measureValue:{width:39,textAlign:"center",fontSize:15,fontWeight:"800",color:COLORS.ink,fontVariant:["tabular-nums"]},
  predictButton:{backgroundColor:COLORS.purple,borderRadius:12,alignItems:"center",padding:15,marginTop:15},
  predictButtonText:{fontSize:13,fontWeight:"800",color:"#fff"},
  predicted:{fontSize:30,fontWeight:"800",textTransform:"capitalize",color:COLORS.purple,marginTop:9},
  probRow:{marginTop:16},probHead:{flexDirection:"row",justifyContent:"space-between",marginBottom:7},
  track:{height:9,backgroundColor:"#edf0f4",borderRadius:8,overflow:"hidden"},fill:{height:9,backgroundColor:COLORS.teal,borderRadius:8},
  footer:{textAlign:"center",fontSize:9,letterSpacing:1,color:"#9aa4b2",marginTop:28},
});
