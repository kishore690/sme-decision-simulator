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

### Clone Repository

```bash
git clone https://github.com/yourusername/sme-decision-simulator.git
```

---

### Backend

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

### Frontend

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

The application first attempts to generate recommendations using the Google Gemini API.

If Gemini is unavailable or the API quota is exceeded, a built-in rule-based recommendation engine automatically generates business recommendations, ensuring uninterrupted user experience.

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
