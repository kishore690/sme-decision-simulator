# 📊 SME Decision Simulator

An AI-powered web application that helps Small and Medium Enterprises (SMEs) make informed business decisions before committing real resources.

Users can upload business data, analyze financial health, simulate different business strategies, receive AI recommendations, compare scenarios, and generate downloadable reports.

---

## 🚀 Features

- 📂 Upload business data using CSV
- 📈 Business Health Dashboard
- 🤖 AI Business Advisor
- 💼 Hiring Simulator
- 💰 Pricing Simulator
- 📣 Marketing Budget Simulator
- 🏦 Loan Impact Simulator
- 📦 Inventory Planning Simulator
- 🏢 Business Expansion Simulator
- ⚖ Compare Business Scenarios
- 📄 Export Reports (PDF & CSV)
- 📊 Interactive Charts & Analytics
- 🛡 AI Fallback Recommendation Engine

---

## 🖥 Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts
- Lucide React

### Backend
- FastAPI
- Pandas
- Pydantic

### AI
- Google Gemini API
- Rule-Based AI Fallback

---

## 📸 Screenshots

### Landing Page

(Add Screenshot)

### Dashboard

(Add Screenshot)

### Simulator

(Add Screenshot)

### AI Advisor

(Add Screenshot)

---

## 📂 Project Structure

```
SME-Decision-Simulator/

│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── services/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── ai.py
│   ├── business.py
│   ├── simulator.py
│   ├── requirements.txt
│   └── uploads/
│
└── README.md
```

---

## ⚙ Installation

## 🚢 Production deployment (Docker)

The included Compose setup serves the built frontend through Nginx and proxies `/api` to FastAPI. It exposes only the frontend port; the API is not published directly. Put TLS termination in front of port 8080 using your hosting provider or reverse proxy.

1. Install Docker Engine and the Docker Compose plugin.
2. For deployment, provide `GEMINI_API_KEY` through the host's environment/secret manager; the key is optional because a local recommendation fallback is available. `Backend/.env.example` lists the supported backend settings.
3. From the repository root, run `docker compose up --build -d`.
4. Open `http://localhost:8080`; check service status with `docker compose ps` and API health at `http://localhost:8080/api/health`.

Set `APP_PORT` to change the published port. `MAX_UPLOAD_BYTES` defaults to 50 MiB. `CORS_ORIGINS` is a comma-separated origin allowlist for direct API access; the bundled same-origin Nginx setup does not require cross-origin access. Do not put production secrets in committed files.

### Deployment scope

This deployment is a single-instance demonstration deployment. Uploaded sales data is stored in process memory and shared by all visitors to that backend process; it disappears on restart, and multiple backend replicas would not share it. There is no authentication or tenant isolation. Do not use it with confidential or real customer financial data until authentication, per-user authorization, isolated durable storage, retention/deletion controls, and operational monitoring are implemented. Configure HTTPS at the hosting edge before exposing the service publicly.

The backend accepts CSV, TSV, delimited TXT, JSON, XLS, XLSX, XLSM, DOCX, and text-based PDF sales tables up to 50 MiB and 1,000,000 rows. Sales data must include Date, Product, Quantity, and Revenue, or Unit Price so revenue can be calculated. Word and PDF uploads must contain a readable table; scanned PDFs and legacy `.doc` files are not supported. The browser build uses `/api` in the container; set `VITE_API_BASE_URL` to an absolute API URL when building the frontend for a separate frontend host.

### Local development

### Clone Repository

```bash
git clone https://github.com/yourusername/sme-decision-simulator.git
```

---

#### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate      # Windows

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

---

#### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## 📊 Workflow

1. Upload CSV business data
2. View Business Dashboard
3. Analyze Business Health
4. Run Business Simulations
5. Receive AI Recommendations
6. Compare Business Scenarios
7. Export Reports

---

## 🧠 AI Recommendation System

With `GEMINI_API_KEY` configured, the advisor uses Gemini to answer open-ended questions against compact summaries of the uploaded sales data, including product mix and monthly performance. It labels modeled expense/cash values as estimates and should identify missing business data instead of treating it as fact. Repeated questions for the same dataset are cached, and model requests have a configurable timeout.

Without a valid API key, the local fallback can answer basic questions about sales totals and product performance. It cannot perform general or complicated reasoning; add a valid key to enable those answers. Configure `GEMINI_MODEL` and `AI_TIMEOUT_MS` as needed. Sales files do not include verified expenses, balances, unit costs, customer counts, or inventory, so questions requiring those facts need the corresponding data before they can be answered reliably.

---

## 🎯 Future Improvements

- User Authentication
- Cloud Database Integration
- Multiple Business Profiles
- Historical Report Storage
- Predictive Analytics
- Real-time Financial Dashboards
- Role-Based Access Control

---

## 👨‍💻 Author

**Kishore V**

Information Science Engineering Student

---
