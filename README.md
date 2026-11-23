# Iris Classifier Suite & Botanical Studio

A full-stack, cross-platform Iris species classification project and botanical herbarium suite featuring:
- **Interactive Botanical Specimen Visualizer**: Pressing *Predict* displays scientific classification (*Iris setosa*, *Iris versicolor*, *Iris virginica*), anatomical illustration SVGs, diagnostic traits, and measurement comparisons against species benchmarks.
- **FastAPI / Scikit-Learn Backend & Serverless API Routes**: Provides reproducible machine learning endpoints (`POST /predict`, `GET /models/metrics`, `GET /dataset/summary`, `GET /specimens`, `GET /health`) with deterministic holdout (random_state=42) and five-fold stratified cross-validation.
- **Installable on iOS, Android & Windows (PWA)**: Compliant Progressive Web App with standalone display, service worker offline caching, web app manifest, and platform-specific installation guides.
- **Expo React Native Mobile App**: Standalone mobile application for iOS and Android with built-in specimen viewer and offline prediction engine.

Live Deployment: [https://iris-classifier-suite-chi.vercel.app/](https://iris-classifier-suite-chi.vercel.app/)

## Project structure

```text
iris-classifier-suite/
├── backend/                  # FastAPI & scikit-learn machine learning service
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI endpoints with CORS and specimen metadata
│   │   └── ml_service.py     # 4 classifiers, evaluation, and specimen taxonomy
│   └── requirements.txt
├── web/                      # Next.js 14 PWA web dashboard
│   ├── public/
│   │   ├── manifest.json     # PWA manifest for iOS, Android, and Windows
│   │   ├── sw.js             # Offline service worker cache
│   │   ├── icons/            # App icons (192px, 512px, apple-touch-icon)
│   │   └── specimens/        # Botanical vector illustrations (setosa, versicolor, virginica)
│   ├── src/app/
│   │   ├── api/              # Serverless API routes (predict, metrics, specimens, health)
│   │   ├── layout.tsx        # Viewport, PWA metadata, apple mobile web app tags
│   │   └── page.tsx          # Interactive dashboard, specimen showcase & install modal
│   └── src/lib/irisMetrics.ts
├── mobile/                   # Expo React Native mobile application
│   ├── app.json              # Expo iOS, Android, and Web configuration
│   ├── App.tsx               # Mobile specimen visualizer & offline predictor
│   └── src/irisMetrics.ts
├── vercel.json               # Vercel deployment configuration
└── .gitignore
```

## How to Install the App on Devices

The web application deployed at [https://iris-classifier-suite-chi.vercel.app/](https://iris-classifier-suite-chi.vercel.app/) is a fully compliant Progressive Web App (PWA) that installs natively across devices:

### 1. Apple iOS (iPhone & iPad)
1. Open [https://iris-classifier-suite-chi.vercel.app/](https://iris-classifier-suite-chi.vercel.app/) in **Safari**.
2. Tap the **Share** button in the Safari toolbar (square with upward arrow).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top right. Iris Lab will appear as an app icon on your home screen and run fullscreen.

### 2. Android (Google Chrome, Samsung Internet, Edge)
1. Open the app link in Chrome.
2. Tap the in-app **Install App** button (or tap Chrome's three dots menu `⋮` → **Install app** / **Add to Home screen**).
3. Tap **Install** to add the app directly to your home screen and Android app drawer.

### 3. Windows PC (Microsoft Edge or Google Chrome)
1. Open the app link in Edge or Chrome.
2. Click the **Install App** button in the app header or click the **App available / Install** icon in the browser address bar.
3. Click **Install**. The app will launch in its own standalone window and can be pinned to the Windows Taskbar and Start Menu.

---

## 1. Run the FastAPI Backend (Optional / Local)

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API documentation: http://localhost:8000/docs

Endpoints:
- `GET /health`: Service health and model status
- `GET /dataset/summary`: Iris dataset shape, class counts, and split info
- `GET /specimens`: Botanical descriptions, diagnostic traits, and morphology averages
- `GET /models/metrics`: Accuracy, F1, ROC-AUC, Log loss, and CV scores
- `POST /predict`: Predict species with probabilities and full specimen card data

Prediction request example:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"sepal_length":5.1,"sepal_width":3.5,"petal_length":1.4,"petal_width":0.2,"model_name":"Random Forest"}'
```

---

## 2. Run the Web Dashboard & PWA

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000. Predictions and specimen visualizations work immediately out of the box with the integrated Next.js API routes and offline fallback engine. To connect to an external Python host, set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`.

Production build:
```bash
npm run build
npm run start
```

---

## 3. Run the Mobile App (Expo)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** on iOS or Android. Predictions work offline or can connect to your backend via `EXPO_PUBLIC_API_URL`.

---

## Deployment on Vercel

When pushed to GitHub, Vercel automatically deploys the updated app:
- Next.js 14 Route Handlers handle `/api/predict` serverless on Vercel.
- Specimen vector illustrations and PWA manifests are served with instant caching.
- If you host the FastAPI backend separately (e.g. Render, Railway, or Fly.io), you can optionally add `NEXT_PUBLIC_API_URL` to your Vercel Project Environment Variables.
