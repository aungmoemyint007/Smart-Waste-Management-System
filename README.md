# ♻️ Smart Waste Management System

## 📘 Software Requirement Specifications (SRS)

**Group – 8 | Section (A) | Semester (V) | 3rd Year CS**
**University of Information Technology**

---

## 👥 Team Members

* 👨‍💻 **Kyaw Zin Hein** — TNT-1935
* 👩‍💻 **April Oo** — TNT-1943
* 👨‍💻 **Min Kyi Sin Thant** — TNT-1945
* 👨‍💻 **Thwin Khant Oo** — TNT-1947
* 👨‍💻 **Aung Moe Myint** — TNT-1958

---

## 📑 Table of Contents

1. 🌱 Introduction
2. 🧩 Overall Description
3. 📋 Requirement Specification
4. 📊 Diagrams
5. ⚙️ System Overview & Features
6. 🛠 Technologies Used
7. 🚀 Getting Started

---

## 1️⃣ Introduction

### 🎯 1.1 Purpose

To develop an **AI-powered Smart Waste Management System** that promotes responsible waste disposal and recycling through technology, automation, and community participation.

### 🌍 1.2 Scope of the Project

* Users upload waste photos 📸
* AI analyzes **type, weight, recyclability** 🤖
* Waste collection is verified via AI
* Users earn points & rewards 🎁

### 📄 1.3 Document Overview

This document explains system functionality, environment, user interaction, and detailed system requirements.

---

## 2️⃣ Overall Description

### 🖥️ 2.1 System Environment

**Actors:**

* 👤 User
* ⚙️ System (AI-powered backend)

Users can report waste, collect waste, earn points, and redeem rewards.

### 🧠 2.2 Product Functions

* 📤 Upload waste (AI analysis)
* 🔍 Search waste by location/date
* ✅ AI waste validation
* 💬 AI Chatbot support
* 🏆 Leaderboard & progress tracking
* 🎁 Reward system

### 🧾 2.3 Functional Requirement Specification

Includes **User & Admin use cases** such as registration, reporting, collecting, and AI interaction.

### ✅ 2.4 Functional Requirements

* 📝 Register / Login
* 📸 Report waste
* 🚮 Collect waste
* 🎯 Earn & redeem points
* 📊 View leaderboard

### 👥 2.5 User Characteristics

* Registered users
* Basic smartphone & internet knowledge

### 🔒 2.6 Non‑Functional Requirements

* ⚡ Performance: AI response ≤ 10 sec
* 📈 Scalability: Real‑time leaderboard
* 🔁 Reliability: 24/7 availability
* 🔐 Security: Encrypted data
* 🧑‍💻 Usability: User‑friendly UI

---

## 3️⃣ Requirement Specification

### 🖼️ 3.1 External Interface Requirements

* **UI:** Login, Report Waste, Collection, Leaderboard, Chatbot
* **Software:** PHP, MySQL
* **Communication:** HTTP / HTTPS

### 🧩 3.2 Class Diagram

Includes classes such as:
`User`, `Waste`, `Report`, `Collection`, `AI`, `Transaction`

### 📌 3.3 Detailed Non‑Functional Requirements

* User Table
* Waste Table
* Report Table
* Collection Table
* Rewards Table
* Transaction Table

---

## 4️⃣ Diagrams

### 🗂️ 4.1 ER Diagram

Shows relationships between **User, Waste, Report, Collection**

### 🔄 4.2 Sequence Diagram

Shows step‑by‑step interaction for:

* Reporting waste
* Collecting waste
* AI verification

---

## 🌟 System Overview

An **AI-driven platform** that:

* Encourages clean environment 🌱
* Rewards community participation 🏅
* Automates waste validation 🤖

---

## ✨ Key Features

* 🤖 AI Waste Analysis
* 🚮 Waste Collection System
* 🏆 Leaderboard
* 🎁 Reward Redemption
* 💬 AI Chatbot Assistance
* 🔍 Search & Filter

---

## 🛠 Technologies Used

### Backend

* PHP (Laravel)
* MySQL

### Frontend

* HTML, CSS, JavaScript

### AI

* Image Recognition
* Machine Learning

---

## 🚀 Getting Started

### ✅ Prerequisites

* PHP ≥ 8.x
* MySQL / PostgreSQL
* Composer
* Node.js

### 🔧 Backend Setup

```bash
git clone <repo-url>
cd wasteBackend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### 🎨 Frontend Setup

```bash
cd wasteFrontend
yarn install   # or npm install
yarn dev       # or npm run dev
```

🌐 Open: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Folder Structure

### Backend

* app/
* config/
* database/
* routes/
* storage/
* public/
* tests/

### Frontend

* src/
* public/
* tailwind.config.js
* vite.config.ts

---

## 🤝 Contributing

Fork the repo 🍴
Create a new branch 🌿
Submit a Pull Request 🔁

---

## 🙏 Thank You

**Smart Waste Management System** ♻️
*Clean City, Smart Future* 🌏
