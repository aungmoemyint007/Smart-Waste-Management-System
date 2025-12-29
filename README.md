Smart Waste Management System

Software Requirement Specifications
Group – 8, Section (A), Semester (V), 3rd Year CS
University of Information Technology

Members

Kyaw Zin Hein TNT - 1935

April Oo TNT - 1943

Min Kyi Sin Thant TNT - 1945

Thwin Khant Oo TNT - 1947

Aung Moe Myint TNT - 1958

Table of Contents

Introduction

1.1 Purpose
1.2 Scope of the Project
1.3 Overview of the Document

Overall Description

2.1 System Environment
2.2 Product Functions
2.3 Functional Requirements Specification
2.4 Functional Requirements
2.5 User Characteristics
2.6 Non-functional Requirements

Requirement Specification

3.1 External Interface Requirement
3.2 Class Diagram
3.3 Detailed Non-functional Requirements

Diagrams

4.1 ER Diagram
4.2 Sequence Diagram

1. Introduction
1.1 Purpose

The purpose of this project is to develop an AI-powered waste management platform that encourages responsible waste disposal and recycling. It is a step toward a cleaner environment by integrating technology and community-driven initiatives.

1.2 Scope of the Project

The Smart Waste Management System is designed to promote efficient waste disposal and recycling. Users can submit waste photos, which AI analyzes to determine the type, weight, and reusability of waste. The system facilitates waste collection and ensures authenticity via AI validation. A reward system encourages active participation.

1.3 Overview of the Document

This document describes the overall functionality, system environment, user interactions, and specific system requirements to make waste management more efficient and rewarding for users.

2. Overall Description
2.1 System Environment

There are two primary actors in the system: User and System. Users can create accounts, report waste, collect waste, earn points, and exchange those points for rewards. The system involves validating waste reports and providing feedback based on AI analysis.

2.2 Product Functions

Uploading and managing waste posts: AI analyzes the type, weight, and potential recyclability of waste.

Searching waste posts: Users can search for waste reports by location and date.

AI-powered waste validation: Ensures that collected waste matches the reported waste via photo submissions.

AI chatbot: Assists users with waste management queries.

Tracking user contributions: Users can view their progress and rank on a leaderboard.

Reward system: Allows users to earn points and exchange them for rewards.

2.3 Functional Requirements Specification

User and Admin use cases: Includes registering, logging in, reporting waste, collecting waste, and interacting with AI.

2.4 Functional Requirements

Some key use cases:

Register: Users register by providing their details and create an account.

Log In: Users log in to access the system.

Report Waste: Users upload photos of waste for analysis by the AI system.

Collect Waste: Users can collect reported waste and upload proof to earn points.

Exchange Points for Rewards: Users can exchange collected points for rewards.

View Leaderboard: Users can view rankings based on points earned.

2.5 User Characteristics

The system is designed for registered users, who will have access to various functionalities like reporting waste, collecting waste, and interacting with the system's AI.

2.6 Non-functional Requirements

Performance: Waste analysis should take no more than 10 seconds.

Scalability: Real-time updates for leaderboard and user performance.

Reliability: The system should be available 24/7.

Security: Encryption to protect sensitive data and prevent attacks.

Usability: The interface is user-friendly, guiding users in waste management tasks.

3. Requirement Specification
3.1 External Interface Requirement

User Interfaces: Includes registration, login/logout, waste report/upload, collection, leaderboard, and AI chatbot interfaces.

Software Interfaces: The system uses MYSQL for the database and PHP for backend development.

Communication Interfaces: Communication between clients and the server uses HTTP/HTTPS protocols.

3.2 Class Diagram

The Class Diagram (Page 25) shows the relationships between the system's components such as User, Waste, Report, Collection, AI, and Transaction.

3.3 Detailed Non-functional Requirements

Details for various data entries, such as the User Table, Report Table, Transaction Table, Collection Table, Rewards Table, and Waste Table, are specified. These tables store essential information like user data, reported waste data, rewards, and transactions.

4. Diagrams
4.1 ER Diagram

The ER Diagram (Page 29) illustrates the relationship between the main entities in the system like User, Waste, Report, and Collection.

4.2 Sequence Diagram

The Sequence Diagram (Page 30) shows the flow of interactions between users, the system, and other components during processes such as reporting waste, collecting waste, and verifying it.
Overview

The Smart Waste Management System is an AI-powered platform designed to encourage responsible waste disposal and promote recycling. It allows users to report waste, collect waste, earn points, and exchange points for rewards. The system uses AI to analyze reported waste, validate its authenticity, and engage users in interactive conversations about waste management.

Features

AI Waste Analysis: Automatically analyzes the type, weight, and reusability of the reported waste through images.

Waste Collection: Users can collect waste that has been reported by others.

Leaderboard: Users can view their rankings based on points earned through reporting and collecting waste.

Reward System: Users earn points for reporting and collecting waste, which can be redeemed for rewards.

AI Chatbot: Users can interact with an AI chatbot to get waste management advice and information.

Search and Filter: Users can search for waste reports by location and date.

Technologies Used

Backend: PHP, MySQL (for database), Laravel framework (for backend structure)

Frontend: HTML, CSS, JavaScript

AI: Image Recognition, Machine Learning (for waste type analysis)

Other Tools: PHP, MySQL, AI-based Image Recognition

Getting Started
Prerequisites

PHP (>= 8.x)

MySQL or PostgreSQL

Composer (for PHP dependencies)

Node.js (for frontend development, if required)

Installation
Backend Setup

Clone the repository:

git clone <repository-url>
cd wasteBackend


Install PHP dependencies:

composer install


Copy the .env.example to .env and configure the environment variables:

cp .env.example .env


Generate the application key:

php artisan key:generate


Run migrations to set up the database:

php artisan migrate


Start the development server:

php artisan serve

Frontend Setup

Navigate to the frontend directory:

cd wasteFrontend


Install dependencies:

yarn install   # Or use 'npm install' if you're using npm


Start the frontend development server:

yarn dev   # Or use 'npm run dev' if you're using npm


Open your browser and navigate to http://localhost:3000 to view the frontend.

Folder Structure
Backend (wasteBackend)

app/: Core application logic (controllers, models)

config/: Configuration files for the application

database/: Database migrations and seeds

routes/: API routes and web routes

storage/: Logs, file storage

public/: Public-facing files (images, stylesheets)

tests/: Unit tests

Frontend (wasteFrontend)

src/: Source code for the frontend (components, utilities)

public/: Public assets (favicon, index.html)

tailwind.config.js: Configuration file for Tailwind CSS

vite.config.ts: Vite configuration file for the build tool

Usage

Register an Account: Users must register to access the system.

Report Waste: Upload a photo of waste for analysis by AI.

Collect Waste: Collect waste reported by others and earn points.

Earn Points: Points are awarded based on reported waste and collection activities.

Exchange Points for Rewards: Redeem collected points for rewards.

View Leaderboard: Check rankings based on points.

Contributing

Feel free to fork the repository and create pull requests for any improvements or bug fixes.
