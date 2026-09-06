# 🎓 Apex Engineering Academy — Production Platform

A modern, production-grade engineering learning and promotional platform designed for **engineering students** and the **Pune Offline Learning Center**.

---

## 🏛️ Architecture Overview

The system is structured as a scalable, clean monorepo:

* **Public Frontend (`user-frontend/`)**: Next.js (App Router) + TypeScript + Tailwind CSS + Lucide Icons + TanStack Query + Zustand (UI state). Running on **Port 3000**.
* **Admin Control Center (`admin-frontend/`)**: Next.js + TypeScript + Tailwind CSS + TanStack Table + React Hook Form + Zod + Lucide Icons. Running on **Port 3001**.
* **Backend API (`backend/`)**: Express.js + TypeScript + REST `/api/v1` + MongoDB Atlas + Mongoose ODM + Argon2id session authentication + Cloudinary Media SDK + Immutable Audit Trail. Running on **Port 5000**.

---

## 🚀 Quick Start Guide

### 1. Backend Service
```bash
cd backend
npm install
npm run dev      # Starts on http://localhost:5000/api/v1
npm run seed     # Seeds realistic curriculum & sample data
```

### 2. Public Student Frontend
```bash
cd user-frontend
npm install
npm run dev      # Starts on http://localhost:3000
```

### 3. Admin Control Center
```bash
cd admin-frontend
npm install
npm run dev      # Starts on http://localhost:3001
```

---

## 🔐 Default Admin Credentials
* **Email**: `admin@engineering.edu`
* **Password**: `Admin@12345`

---

## 🌟 Key Features
* **Academic Hierarchy**: FE / SE / TE / BE $\to$ Branches (CSE, IT, AI&DS, E&TC, MECH, CIVIL) $\to$ Semesters 1–8 $\to$ Subjects with Unit breakdowns and Subject Hub.
* **Engineering Resources**: Previous Year Question Papers (PYQs), Handwritten & Master Notes, YouTube Crash Courses, Capstone Projects, Verified Job Board.
* **Offline Learning Center Promotion**: Classroom batch schedules, seat capacity tracker, Ex-IITian faculty directory, center visit & demo class booking CRM pipeline.
* **Cloudinary Direct Uploads**: Drag-and-drop file uploader supporting local system PDF documents, lecture slides, and image assets.
* **Search & Bookmarks**: Universal multi-collection search engine (CMD+K) and local storage offline resource saver.
