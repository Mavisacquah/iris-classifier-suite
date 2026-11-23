"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Flower2, FlaskConical, Leaf, RefreshCw, Sprout } from "lucide-react";
import { FALLBACK_DATASET_SUMMARY, FALLBACK_METRICS, MODEL_NAMES, SPECIES, type ModelName } from "@/lib/irisMetrics";

type Metrics = typeof FALLBACK_METRICS;
type Prediction = { predicted_species: string; confidence: number; probabilities: Record<string, number>; model_name?: string };
const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const presets = {
  Setosa: [5.1, 3.5, 1.4, 0.2],
  Versicolor: [6.0, 2.9, 4.5, 1.5],
  Virginica: [6.5, 3.0, 5.5, 2.0],
};

function pct(n: number) { return `${(n * 100).toFixed(1)}%`; }
function number(n: number) { return n.toFixed(3); }

export default function Home() {
  const [metrics, setMetrics] = useState<Metrics>(FALLBACK_METRICS);
  const [dataset, setDataset] = useState(FALLBACK_DATASET_SUMMARY);
  const [model, setModel] = useState<ModelName>("Random Forest");
  const [live, setLive] = useState(false);
  const [values, setValues] = useState<number[]>([5.1, 3.5, 1.4, 0.2]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    if (!API) return;
    let active = true;
    fetch(`${API}/models/metrics`, { cache: "no-store" })
      .then(r => { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
      .then(data => {
        if (!active) return;
        if (data.models) setMetrics(data.models as Metrics);
        if (data.dataset) setDataset(data.dataset);
        setLive(true);
      })
      .catch(() => { if (active) setLive(false); });
    return () => { active = false; };
  }, []);

  const selected = metrics[model] ?? FALLBACK_METRICS[model];
  const topModel = useMemo(() => MODEL_NAMES.reduce((best, name) =>
    metrics[name].accuracy > metrics[best].accuracy ? name : best, MODEL_NAMES[0]), [metrics]);

  async function predict() {
    setPredicting(true);
    try {
      if (API) {
        const response = await fetch(`${API}/predict`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sepal_length: values[0], sepal_width: values[1],
            petal_length: values[2], petal_width: values[3], model_name: model,
          }),
        });
        if (!response.ok) throw new Error("Prediction API failed");
        setPrediction(await response.json());
      } else {
        setPrediction(null);
      }
    } catch {
      setPrediction(null);
    } finally { setPredicting(false); }
  }

  const featureLabels = ["Sepal length", "Sepal width", "Petal length", "Petal width"];
  const featureUnits = ["cm", "cm", "cm", "cm"];
  const ranges = [[4.0, 8.0, 0.1], [2.0, 4.5, 0.1], [1.0, 7.0, 0.1], [0.1, 2.5, 0.1]];

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <header className="mb-9 flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-violet-900"><Flower2 size={15}/> Field notes / Machine learning</div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Iris <span className="text-violet-900">Lab.</span></h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">A compact classification studio exploring how four botanical measurements distinguish three Iris species.</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 md:self-auto">
          <span className={`h-2 w-2 rounded-full ${live ? "bg-emerald-500" : "bg-amber-500"}`}/>
          {live ? "Live API connected" : "Precomputed evaluation"}
          <RefreshCw size={13} className="ml-1 text-slate-400"/>
        </div>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPI icon={<Sprout size={17}/>} label="Top model" value={topModel} note={`${pct(metrics[topModel].accuracy)} holdout accuracy`}/>
        <KPI icon={<Activity size={17}/>} label={`${model} · accuracy`} value={pct(selected.accuracy)} note={`5-fold CV ${pct(selected.cv_accuracy_mean)} ± ${pct(selected.cv_accuracy_std)}`}/>
        <KPI icon={<FlaskConical size={17}/>} label="ROC-AUC · log loss" value={number(selected.roc_auc_ovr_macro)} note={`Macro OVR AUC · ${number(selected.log_loss)} log loss`}/>
        <KPI icon={<Leaf size={17}/>} label="Dataset shape" value={`${dataset.samples} × ${dataset.features}`} note={`${dataset.classes.length} species · ${dataset.train_samples}/${dataset.test_samples} train/test`}/>
      </section>

      <section className="panel mb-8 p-5 md:p-7">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">01 / Model evaluation</p><h2 className="mt-1 text-xl font-semibold">Compare classifiers</h2></div>
          <div className="flex flex-wrap gap-2">{MODEL_NAMES.map(name => <button key={name} onClick={() => setModel(name)} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${model === name ? "bg-violet-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{name}</button>)}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm tabular-nums">
            <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">{["Model","Accuracy","Macro F1","Weighted F1","Macro ROC-AUC","Log loss","5-fold CV"].map(x=><th key={x} className="px-3 py-3 font-semibold">{x}</th>)}</tr></thead>
            <tbody>{MODEL_NAMES.map(name => <tr key={name} onClick={() => setModel(name)} className={`cursor-pointer border-b border-slate-100 last:border-0 ${name === model ? "bg-violet-50/70" : "hover:bg-slate-50"}`}><td className="px-3 py-4 font-semibold text-slate-800">{name}</td><td className="px-3 py-4">{pct(metrics[name].accuracy)}</td><td className="px-3 py-4">{pct(metrics[name].macro_f1)}</td><td className="px-3 py-4">{pct(metrics[name].weighted_f1)}</td><td className="px-3 py-4">{number(metrics[name].roc_auc_ovr_macro)}</td><td className="px-3 py-4">{number(metrics[name].log_loss)}</td><td className="px-3 py-4">{pct(metrics[name].cv_accuracy_mean)}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-400">Holdout metrics use the same stratified 20% test partition. CV values show mean accuracy across five stratified folds.</p>
      </section>

      <div className="mb-8 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <section className="panel p-5 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">02 / Error profile</p><h2 className="mb-5 mt-1 text-xl font-semibold">Confusion matrix</h2>
          <div className="grid grid-cols-[74px_repeat(3,minmax(0,1fr))] gap-2 text-center text-xs tabular-nums">
            <div/><div className="pb-1 font-semibold text-slate-500">Setosa</div><div className="font-semibold text-slate-500">Versicolor</div><div className="font-semibold text-slate-500">Virginica</div>
            {selected.confusion_matrix.map((row, i) => <><div key={`label-${i}`} className="flex items-center text-left font-semibold text-slate-500">{SPECIES[i]}</div>{row.map((cell, j) => <div key={`${i}-${j}`} className={`flex aspect-square items-center justify-center rounded-xl text-lg font-semibold ${i === j ? "bg-teal-100 text-teal-900" : cell > 0 ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-400"}`}>{cell}</div>)}</>)}
          </div>
          <p className="mt-4 text-xs text-slate-400">Rows = actual species · columns = predicted species</p>
        </section>
        <section className="panel p-5 md:p-7">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">03 / Class-level detail</p><h2 className="mb-5 mt-1 text-xl font-semibold">Per-species performance</h2>
          <div className="space-y-4">{SPECIES.map((species, i) => {
            const item = selected.per_class[species];
            return <div key={species} className="rounded-xl border border-slate-100 p-4">
              <div className="mb-3 flex items-center justify-between"><span className="font-semibold capitalize">{species}</span><span className="text-xs text-slate-400">{item.support} test samples</span></div>
              <div className="grid grid-cols-3 gap-3">{[["Precision",item.precision],["Recall",item.recall],["F1-score",item.f1_score]].map(([label,val])=><div key={label as string}><div className="mb-1 text-[11px] text-slate-400">{label}</div><div className="font-semibold tabular-nums">{pct(val as number)}</div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-700" style={{width:`${(val as number)*100}%`}}/></div></div>)}</div>
            </div>;
          })}</div>
        </section>
      </div>

      <section className="panel overflow-hidden">
        <div className="grid lg:grid-cols-[.85fr_1.15fr]">
          <div className="bg-violet-950 p-6 text-white md:p-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-200">04 / Interactive instrument</p>
            <h2 className="mt-2 text-2xl font-semibold">Identify a flower.</h2>
            <p className="mt-2 text-sm leading-6 text-violet-200">Adjust the four measurements in centimetres, then ask the selected model to estimate the species.</p>
            <div className="mt-6 flex flex-wrap gap-2">{Object.entries(presets).map(([label, preset])=><button key={label} onClick={()=>{setValues(preset);setPrediction(null);}} className="rounded-full border border-violet-300/40 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10">{label} preset</button>)}</div>
            <div className="mt-8 space-y-6">{featureLabels.map((label,i)=><div key={label}>
              <div className="mb-2 flex justify-between text-sm"><label htmlFor={`feature-${i}`} className="text-violet-100">{label}</label><span className="font-semibold tabular-nums">{values[i].toFixed(1)} {featureUnits[i]}</span></div>
              <input id={`feature-${i}`} className="range" type="range" min={ranges[i][0]} max={ranges[i][1]} step={ranges[i][2]} value={values[i]} onChange={e=>{setValues(old=>old.map((v,j)=>j===i?Number(e.target.value):v));setPrediction(null);}}/>
              <div className="mt-1 flex justify-between text-[10px] text-violet-300"><span>{ranges[i][0].toFixed(1)}</span><span>{ranges[i][1].toFixed(1)} cm</span></div>
            </div>)}</div>
            <button onClick={predict} disabled={predicting} className="mt-8 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-950 transition hover:bg-violet-100 disabled:opacity-60">{predicting ? "Predicting…" : `Predict with ${model}`}</button>
            {!API && <p className="mt-3 text-xs text-violet-300">Start the FastAPI backend and set NEXT_PUBLIC_API_URL to enable live predictions. Metrics are available offline.</p>}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-teal-700">Prediction output</p><h3 className="mt-1 text-xl font-semibold">Species probability</h3></div><Flower2 className="text-violet-300" size={28}/></div>
            {prediction ? <div className="mt-7">
              <div className="rounded-2xl bg-teal-50 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Predicted species</p><div className="mt-1 text-3xl font-semibold capitalize text-teal-950">{prediction.predicted_species}</div><p className="mt-2 text-sm text-teal-800">{pct(prediction.confidence)} model confidence</p></div>
              <div className="mt-7 space-y-5">{SPECIES.map(s=><div key={s}><div className="mb-2 flex justify-between text-sm"><span className="capitalize font-medium">{s}</span><span className="tabular-nums">{pct(prediction.probabilities[s] ?? 0)}</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-800 transition-all" style={{width:`${(prediction.probabilities[s] ?? 0)*100}%`}}/></div></div>)}</div>
            </div> : <div className="mt-8 flex min-h-[290px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center"><Flower2 size={36} className="text-violet-300"/><p className="mt-4 font-semibold text-slate-700">Ready for a specimen</p><p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">Choose a preset or adjust the measurements, then run a prediction with the selected classifier.</p></div>}
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-500"><div className="rounded-xl bg-slate-50 p-3"><div className="text-slate-400">Model</div><div className="mt-1 font-semibold text-slate-700">{model}</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-slate-400">API mode</div><div className="mt-1 font-semibold text-slate-700">{live ? "Live metrics" : "Offline metrics"}</div></div></div>
          </div>
        </div>
      </section>
      <footer className="mt-8 flex flex-col justify-between gap-2 text-xs text-slate-400 sm:flex-row"><span>IRIS LAB · Scikit-learn dataset · 150 observations</span><span>80/20 stratified holdout · 5-fold cross-validation</span></footer>
    </main>
  );
}

function KPI({icon,label,value,note}:{icon:React.ReactNode;label:string;value:string;note:string}) {
  return <div className="panel p-5"><div className="flex items-center justify-between text-slate-400"><span className="text-xs font-semibold uppercase tracking-wider">{label}</span><span className="text-violet-900">{icon}</span></div><div className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 tabular-nums">{value}</div><p className="mt-1 text-xs text-slate-500">{note}</p></div>;
}
