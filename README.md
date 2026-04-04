# 📄 Resume Analyzer & Scoring System

A full-stack application that analyzes resumes (PDF), detects skills, and generates a score based on predefined criteria.

---

## 🚀 Features

- 📤 Upload resume (PDF)
- 📑 Extract text from PDF
- 🧠 Detect skills using regex
- 📊 Calculate score (skill-based)
- 💾 Store results in MySQL database
- 🔗 REST API support

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- Multer (file upload)
- pdf-parse (text extraction)

### Database
- MySQL

---

## 📂 Project Structure
resume-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── searchController.js
│   │   └── uploadController.js
│   │
│   ├── middleware/
│   │   └── multerConfig.js
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │   ├── scoringService.js
│   │   ├── skillService.js
│   │   └── uploadService.js
│   │
│   ├── uploads/
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── admin.html
│   ├── admin.js
│   ├── student.html
│   └── student.js
│
├── .gitignore
└── README.md
