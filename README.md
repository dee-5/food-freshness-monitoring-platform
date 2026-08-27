# 🥗 Food Freshness Monitoring Platform

An AI-powered platform that uses image analysis, environmental conditions, and storage
information to estimate food freshness, predict remaining shelf life, detect spoilage
indicators, and generate storage recommendations — helping consumers, retailers,
restaurants, and warehouses reduce food waste.

> **Internship:** Infosys Springboard AI Internship
> **Author:** Deepanshi Khanna
> **Status:** 🚧 In Progress — Milestone 1 Complete

---

## 📌 Project Objective

Build an AI-powered Food Freshness Monitoring Platform that helps users track food
inventory, assess freshness from images, predict shelf life, and receive storage /
consumption recommendations to minimize food waste.

---

## ✅ Milestone 1 — Project Initialization, Design Process & Core Setup

**Completed in this milestone:**
- Project architecture and database schema designed
- Backend environment set up with **FastAPI**
- Frontend environment set up with **React (Vite)**
- User authentication implemented (JWT-based register/login)
- Role field added to user model (`consumer`, `retail_manager`, `warehouse_operator`, etc.)
- Food inventory management — full CRUD (Create, Read, Update, Delete) for food items
- Food freshness image dataset identified and organized for upcoming milestones

---

## 🏗️ Tech Stack

| Layer            | Technology                        |
|-------------------|-----------------------------------|
| Backend           | Python, FastAPI, SQLAlchemy       |
| Frontend          | React.js (Vite)                   |
| Database          | PostgreSQL                        |
| Auth              | JWT (python-jose), Passlib (bcrypt) |
| AI/ML (upcoming)  | TensorFlow / PyTorch, OpenCV, Scikit-learn |
| Deployment        | Docker, AWS/Azure (planned)       |

---

## 📁 Project Structure

```
food-freshness-monitoring-platform/
├── backend/
│   ├── main.py            # FastAPI app & routes
│   ├── models.py          # SQLAlchemy models (User, FoodItem)
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # Password hashing & JWT auth
│   ├── database.py        # DB session/engine setup
│   ├── create_tables.py   # DB table initialization script
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React app (auth + inventory UI)
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── datasets/
│   └── kaggle-food-freshness/   # primary dataset (fresh vs. spoiled)
└── README.md
```

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose pydantic
python create_tables.py
uvicorn main:app --reload
```
API will be live at: `http://127.0.0.1:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App will be live at: `http://localhost:5173`

---

## 🔑 API Endpoints (Milestone 1)

| Method | Endpoint         | Description                  | Auth Required |
|--------|-------------------|-------------------------------|:---:|
| POST   | `/register`       | Register a new user           | ❌ |
| POST   | `/login`           | Login & receive JWT token     | ❌ |
| GET    | `/food`            | List current user's food items| ✅ |
| POST   | `/food`            | Add a new food item           | ✅ |
| PUT    | `/food/{food_id}`  | Update a food item            | ✅ |
| DELETE | `/food/{food_id}`  | Delete a food item            | ✅ |

---

## 🗺️ Roadmap

- [x] **Milestone 1:** Project setup, auth, inventory CRUD, dataset organization
- [ ] **Milestone 2:** Image analysis engine & freshness assessment
- [ ] **Milestone 3:** Shelf-life prediction & recommendation engine
- [ ] **Milestone 4:** Analytics dashboards, testing & deployment

---

## 📊 Dataset

**Primary dataset (selected for this project): Kaggle Food Freshness Dataset**
Used for fresh vs. spoiled classification, which directly powers the upcoming
Freshness Assessment Engine (Milestone 2). Organized under `datasets/kaggle-food-freshness/`.

**Other datasets considered (not used, for reference):**
- Fruits Freshness Dataset — fruit-specific freshness classification & spoilage detection
- Vegetable Freshness Dataset — vegetable-specific quality monitoring & shelf-life prediction
- Food-101 Dataset — general food category identification (different problem: identifies *what* the food is, not its freshness)

---

## 👩‍💻 Author

**Deepanshi Khanna**
Infosys Springboard AI Internship
