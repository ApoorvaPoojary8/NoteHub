# NoteHub 📝

NoteHub is a full-stack note-taking application that allows users to create, organize, search, edit, and delete their personal notes in one place.

## ✨ Features

- 🔐 User registration and login
- 🔒 Password hashing and JWT-based authentication
- 📝 Create, edit, and delete notes
- 📂 Organize notes by category: Personal, Study, and Work
- 🔎 Search notes by title and content
- 👤 User-specific notes
- 💾 Persistent storage using MongoDB
- 🎨 Modern dashboard with an orange-and-black theme

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- CSS

### Backend
- Python
- FastAPI
- Motor
- MongoDB
- JWT authentication

## 📁 Project Structure

```text
NoteHub/
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   └── dependencies.py
│   └── requirements.txt
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- Python
- MongoDB database

### 1. Clone the Repository

```bash
git clone https://github.com/ApoorvaPoojary8/NoteHub.git
cd NoteHub
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```cmd
.venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables for your MongoDB connection and application secrets.

Start the backend:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 3. Set Up the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL shown in your terminal, usually `http://localhost:5173`.

## 🔐 Security

- Passwords are hashed before storage.
- Protected API endpoints require authentication.
- Notes are associated with authenticated users.
- Environment variables and sensitive credentials should not be committed to Git.

## 🚀 Future Improvements

- Forgot password and password reset
- Note pinning and additional organization features
- Automated testing
- Further UI and accessibility improvements

## 👩‍💻 Author

**Apoorva Poojary**

GitHub: [@ApoorvaPoojary8](https://github.com/ApoorvaPoojary8)
