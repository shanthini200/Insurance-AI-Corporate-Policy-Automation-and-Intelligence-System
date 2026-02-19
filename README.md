# InsurAI: Corporate Policy Automation and Intelligence System

[cite_start]InsurAI is a comprehensive, full-stack, AI-driven platform designed to modernize corporate insurance management[cite: 556, 558]. [cite_start]It bridges the gap between customers and agents by automating appointment scheduling, providing real-time policy comparisons, and integrating role-based dashboards for Customers, Agents, and Administrators[cite: 559, 563].

## 🚀 Features

* [cite_start]**Role-Based Access Control:** Secure JWT-based authentication managing distinct access for Customers, Agents, and Admins[cite: 565, 571].
* [cite_start]**Agent Availability Management:** Agents can set, view, and dynamically manage their working hours[cite: 584].
* [cite_start]**Smart Appointment Scheduling:** Real-time server-side conflict prevention algorithm to avoid overlapping agent bookings[cite: 565, 597].
* [cite_start]**Policy Management & Exploration:** Users can browse, compare, and apply for various insurance policies seamlessly[cite: 563, 576].
* [cite_start]**Automated Notifications:** SMTP-based email alerts for appointment confirmations, cancellations, and policy status updates[cite: 565, 580].
* [cite_start]**AI Chatbot Integration:** Intelligent chatbot to resolve customer queries in real-time, reducing manual support overhead[cite: 560, 576].
* [cite_start]**Admin Dashboard:** Centralized control center to manage system users, agents, pending policies, and overall platform health[cite: 563, 584].

## 💻 Tech Stack

**Frontend:**
* [cite_start]React 18 [cite: 567]
* [cite_start]JavaScript (ES6+) / JSX [cite: 564]
* [cite_start]Vite (Build Tool) [cite: 567]
* [cite_start]Tailwind CSS (UI/UX Styling) [cite: 569]
* [cite_start]Axios (HTTP Client) [cite: 578]

**Backend:**
* [cite_start]Java 17 [cite: 571]
* [cite_start]Spring Boot 3 [cite: 571]
* [cite_start]Spring Security (JWT Authentication) [cite: 571]
* Spring Data JPA 
* [cite_start]JavaMailSender (SMTP Services) [cite: 570]

**Databases & Infrastructure:**
* [cite_start]**MySQL:** Primary relational database for Users, Appointments, and Policies[cite: 574].
* **MongoDB:** NoSQL database for handling unstructured, high-speed Notification data.
* [cite_start]**Docker:** Containerization for consistent development and deployment environments[cite: 602].

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* [Java Development Kit (JDK) 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
* [Node.js (v18 or higher)](https://nodejs.org/)
* [Apache Maven](https://maven.apache.org/)
* [MySQL Server](https://dev.mysql.com/downloads/)
* [MongoDB](https://www.mongodb.com/try/download/community)

---

## ⚙️ Installation & Configuration

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or CLI) and create the primary database:
   sql
   CREATE DATABASE insurance_db;



2. Ensure MongoDB is running locally on the default port (`27017`).

### 2. Backend Setup (Spring Boot)

1. Navigate to the backend directory:
bash
cd insurance-backend




2. Open `src/main/resources/application.properties` and configure your database credentials, JWT secret, and SMTP settings:
properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/insurance_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/insurance_notifications

# JWT Secret (Must be a fixed 256-bit secure key to prevent logout on restart)
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

# Email SMTP Configuration (Update with your App Password)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true





### 3. Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
bash
cd insurance-frontend




2. Install the required NPM dependencies:
bash
npm install





---

## 🚀 Running the Application

You will need two separate terminal windows to run the frontend and backend simultaneously.

### Start the Backend Server

In the `insurance-backend` terminal, run the following commands to clean, build, and start the Spring Boot application:

bash
mvn clean install
mvn spring-boot:run



*The backend will start running on `http://localhost:8080`.*

### Start the Frontend Server

In the `insurance-frontend` terminal, start the Vite development server:

bash
npm run dev



*The frontend will start running on `http://localhost:5173` (or the port specified by Vite in the terminal).*

---

## 🐳 Docker Deployment (Optional)

To run the application using Docker, ensure Docker Desktop is installed and run the following command from the root directory:

bash
docker-compose up --build -d



This will containerize and spin up the frontend, backend, MySQL, and MongoDB services simultaneously.

---

## 🔑 Default Test Accounts

If the application uses a `DataInitializer`, the following test accounts are generated automatically on startup:

* **Agent Portal:** `agent@insurance.com` / `agent123`



```