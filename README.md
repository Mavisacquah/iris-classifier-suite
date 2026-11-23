# Iris Classifier Suite

A full-stack Iris species classification project with a reproducible FastAPI/scikit-learn backend, a Next.js web dashboard, and an Expo React Native mobile app. The web and mobile clients ship with **real precomputed evaluation metrics** generated from the same reproducible scikit-learn pipeline, so the dashboard works before the API is started and automatically prefers live API data when reachable.

## Project structure

```text
iris-classifier-suite/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   └── ml_service.py
│   └── requirements.txt
├── web/
│   ├── src/app/
│   ├── src/lib/irisMetrics.ts
│   └── ...
├── mobile/
│   ├── src/irisMetrics.ts
│   └── ...
├── vercel.json
└── .gitignore
```

## Requirements

- Python 3.10+
- Node.js 20+
- npm
- Expo Go for running the mobile app on a device (optional)

## 1. Run the backend

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API documentation: http://localhost:8000/docs

Endpoints:
- `GET /health`
- `GET /dataset/summary`
- `GET /models/metrics`
- `POST /predict`

The backend trains four deterministic classifiers on startup using an 80/20 stratified split (`random_state=42`). Five-fold stratified CV uses shuffled folds with `random_state=42`.

## 2. Run the web app

In a second terminal:

```bash
cd web
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local
npm run dev
```

Open http://localhost:3000. Without a reachable API, the app uses the included exact precomputed metrics. For a deployed backend, set `NEXT_PUBLIC_API_URL` to its public base URL (without a trailing slash).

Production build:

```bash
npm run build
npm run start
```

## 3. Run the mobile app

In another terminal:

```bash
cd mobile
npm install
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your backend URL.
# For a physical phone, use your computer's LAN IP, e.g. http://192.168.1.20:8000.
npx expo start
```

Scan the QR code with Expo Go. `localhost` on a physical phone refers to the phone itself, not your development computer. The app uses the embedded metrics if the API is unavailable.

## Prediction request example

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"sepal_length":5.1,"sepal_width":3.5,"petal_length":1.4,"petal_width":0.2,"model_name":"Random Forest"}'
```

## Evaluation protocol

- Dataset: `sklearn.datasets.load_iris()` (150 rows, four numeric features, three species)
- Holdout: stratified 80/20 train/test split, seed 42
- Models: scaled Logistic Regression, 150-tree Random Forest, scaled RBF SVM with probability estimates, scaled 5-neighbor KNN
- Cross-validation: 5-fold `StratifiedKFold(shuffle=True, random_state=42)`
- Metrics: accuracy; macro/weighted precision, recall, F1; per-class precision/recall/F1/support; sklearn classification report; confusion matrix; one-vs-rest macro/weighted multiclass ROC-AUC; log loss; CV mean and standard deviation

## Deploy the web app to Vercel

1. Push this repository to GitHub (or import the repository in Vercel).
2. In Vercel, choose **Add New → Project** and import the repository.
3. Set **Root Directory** to `web`.
4. Add `NEXT_PUBLIC_API_URL` as an environment variable pointing to your deployed FastAPI service. The dashboard still works in fallback mode if the variable is omitted or the API is unreachable.
5. Deploy. Vercel detects Next.js automatically.

The root `vercel.json` includes a clean Next.js framework configuration. If you deploy with `web` as the Vercel root directory, Vercel uses the Next.js project configuration in that directory.

## GitHub: initialize and push

Run these commands from the project root, replacing the URL with your own GitHub repository URL:

```bash
git init
git add .
git commit -m "Build Iris classifier full-stack suite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/iris-classifier-suite.git
git push -u origin main
```

## Notes

- The metrics shown are calculated from the held-out test partition, not training accuracy.
- Probability estimates are model probability outputs; they are not guaranteed to be perfectly calibrated.
- The backend enables configurable CORS via `CORS_ORIGINS`; the default allows local web development and Expo development origins. Set an explicit comma-separated allowlist in production.
- For production, deploy the FastAPI service separately (for example, on a Python ASGI host) and configure the frontend API URL. Vercel hosts the Next.js frontend; it does not run this FastAPI application from the root `vercel.json`.
