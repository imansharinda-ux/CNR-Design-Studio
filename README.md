
<div align="center">

# 🏛️ CNR DESIGN STUDIO

### An Architect's Digital Studio — Bringing Architectural Visions to Life

<p>
  A Full-Stack Architectural Portfolio & Management Platform
</p>

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-25-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

![React Router](https://img.shields.io/badge/React_Router-7CA5?style=flat&logo=reactrouter&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=flat&logo=springsecurity&logoColor=white)
![JWT](https://img.shields.io/badge/Authentication-Session_Based-orange?style=flat)
![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=flat&logo=githubactions&logoColor=white)

**Academic Project | EC4307 – Web Application Development**

Faculty of Engineering, University of Ruhuna

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Database Design](#-database-design)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Validation and Security](#-validation-and-security)
- [Testing](#-testing)
- [Continuous Integration](#-continuous-integration)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 📌 About the Project

**CNR Design Studio** is a full-stack web platform developed for an individual architect to visualise architectural concepts and bring designs to life.

The platform acts as the architect's digital studio, providing a professional online presence where potential clients can explore completed architectural projects, estimate construction costs, submit project enquiries and book appointments.

In addition to the public-facing website, the system provides a secure administration dashboard that allows the architect to manage projects, appointments, enquiries, photographs and other website content.

Unlike a static architectural portfolio, CNR Design Studio combines an interactive client experience with a complete backend management system.

### 🎯 Project Objectives

- Establish a professional digital presence for the architect.
- Showcase architectural projects through an interactive portfolio.
- Simplify client communication and project enquiries.
- Provide an online appointment booking system.
- Help clients estimate preliminary construction costs.
- Provide a centralized dashboard to manage studio activities.
- Ensure secure data management and reliable booking operations.

---

## ✨ Key Features

### 🏠 1. Client-Facing Website

| Feature | Description |
|---|---|
| Architectural Portfolio | Browse completed architectural projects. |
| Project Details | View individual projects and their descriptions. |
| Photo Gallery | Explore project photographs using a full-screen image viewer. |
| Appointment Booking | Select available dates and time slots. |
| Meeting Types | Choose studio visits, phone calls or online meetings. |
| Booking Management | Check booking status and cancel appointments. |
| Project Enquiries | Submit project requirements, budgets and details. |
| Cost Estimator | Calculate approximate construction costs in LKR. |
| Email Notifications | Receive booking confirmations and status updates. |
| Theme Support | Switch between light and dark modes. |
| Responsive Design | Access the platform from desktops, tablets and mobile devices. |

### 📅 2. Appointment Management

- View available appointment dates and time slots.
- Prevent bookings on Sundays and blocked days.
- Restrict bookings to the next 60 days.
- Support multiple meeting types.
- Generate unique booking references.
- Allow clients to check booking status.
- Allow clients to cancel their appointments.
- Enable the architect to confirm, reschedule or cancel bookings.
- Automatically release cancelled appointment slots.
- Link appointments with previous project enquiries.

### 💰 3. Construction Cost Estimator

Clients can obtain an approximate construction budget based on:

- Project type.
- Total floor area.
- Number of storeys.
- Selected finishing level.

The system calculates and displays an estimated construction cost in Sri Lankan Rupees (LKR).

### 🔐 4. Admin Dashboard

A secure administration dashboard enables the architect to manage the entire platform.

**Dashboard Overview**
- Total enquiries.
- New enquiries.
- Today's appointments.
- Upcoming appointments.
- Total architectural projects.

**Enquiry Management**
- View all submitted enquiries.
- Filter enquiries by status.
- Update enquiry statuses (New, Contacted, Closed).
- Add administrative follow-up notes.
- Maintain enquiry history.

**Appointment Management**
- View upcoming and previous appointments.
- Confirm appointments.
- Reschedule appointments.
- Cancel appointments.
- Manage unavailable days.
- Track appointment status.

**Project Management**
- Create new architectural projects.
- Update existing project information.
- Delete projects.
- Mark projects as featured.
- Set project cover photographs.
- Upload multiple project images.
- Reorder photographs.
- Delete unwanted images.

**Testimonial Management**
- Store client testimonials.
- Associate testimonials with projects.
- Control public visibility.

### 🛡️ 5. Security and Reliability

- Secure administrator authentication.
- BCrypt password hashing.
- Hashed session-token storage.
- Backend and frontend validation.
- Protection against duplicate appointment bookings.
- Public form spam protection.
- Honeypot field validation.
- IP-based rate limiting.
- Centralized API exception handling.

---

## 🛠️ Technology Stack

The project follows a modern full-stack architecture using React for the frontend, Spring Boot for the backend and MySQL for persistent data storage.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19 | User interface development |
| Build Tool | Vite | Frontend development and bundling |
| Routing | React Router | Client-side navigation |
| Animations | Lenis | Smooth scrolling |
| Styling | CSS | Responsive UI and themes |
| Backend | Java 25 | Server-side development |
| Framework | Spring Boot 4 | REST API development |
| ORM | Spring Data JPA | Database operations |
| Security | Spring Security | Authentication and authorization |
| Validation | Jakarta Bean Validation | Input validation |
| Email | Spring Mail | Email notifications |
| Database | MySQL 8 | Persistent data storage |
| Backend Testing | JUnit 5, Mockito, MockMvc | Backend testing |
| Test Database | H2 | In-memory testing |
| Frontend Testing | Vitest | Frontend testing |
| Build Management | Maven, npm | Dependency and build management |
| Version Control | Git, GitHub | Source code management |
| CI/CD | GitHub Actions | Automated build and testing |

---

## 🏗️ System Architecture

CNR Design Studio follows a client-server architecture with a RESTful API.

The frontend communicates with the backend through HTTP requests using JSON. The Spring Boot backend processes requests, validates incoming data, applies business rules and communicates with the MySQL database through Spring Data JPA.

### Architecture Overview

```text
                 CLIENT / USER
                       |
                       |
               React Frontend
                 (React 19)
                       |
                       |
                 REST API
                 (JSON/HTTP)
                       |
                       |
              Spring Boot Backend
                       |
          +------------+------------+
          |            |            |
          |            |            |
       Security     Services    Validation
          |            |            |
          +------------+------------+
                       |
                       |
                Spring Data JPA
                       |
                       |
                  MySQL 8
                       |
              +--------+--------+
              |                 |
           Database         File Storage
```

### Main System Components

| Component | Responsibility |
|---|---|
| React Frontend | Displays the public website and admin dashboard. |
| REST API | Handles communication between frontend and backend. |
| Spring Boot | Implements application logic and business rules. |
| Spring Security | Protects administrative endpoints. |
| Spring Data JPA | Handles database persistence. |
| MySQL | Stores projects, enquiries, bookings and admin data. |
| File Storage | Stores uploaded architectural photographs. |
| Spring Mail | Handles email notifications. |

### Request Flow

1. A client interacts with the React application.
2. The frontend sends an HTTP request to the backend.
3. Spring Boot receives and processes the request.
4. Validation and business rules are applied.
5. Spring Data JPA communicates with MySQL.
6. The backend returns a JSON response.
7. React updates the user interface.

In development mode, Vite proxies `/api` and `/uploads` requests to the backend.

---

## 🗄️ Database Design

The application uses **MySQL 8** with a relational database named `cnr_design_studio`.

The database contains nine tables with relationships enforced through foreign keys.

### Database Tables

| Table | Description |
|---|---|
| `projects` | Stores architectural project information. |
| `project_images` | Stores project photographs. |
| `testimonials` | Stores client reviews and testimonials. |
| `enquiries` | Stores project enquiries and their statuses. |
| `enquiry_notes` | Stores administrative follow-up notes. |
| `appointments` | Stores client appointment bookings. |
| `blocked_days` | Stores dates unavailable for appointments. |
| `admins` | Stores administrator account information. |
| `admin_sessions` | Stores hashed administrator session tokens. |

### Entity Relationships

| Relationship | Type | Delete Behaviour |
|---|---|---|
| Projects → Project Images | One-to-Many | CASCADE |
| Projects → Testimonials | One-to-Many (Optional) | SET NULL |
| Enquiries → Appointments | One-to-Many (Optional) | SET NULL |
| Enquiries → Enquiry Notes | One-to-Many | CASCADE |
| Admins → Enquiry Notes | One-to-Many | RESTRICT |
| Admins → Admin Sessions | One-to-Many | CASCADE |

### Entity Relationship Diagram (ERD)

The following diagram illustrates the database structure and relationships.

![Database ER Diagram](docs/erd.png)

---

## 📂 Project Structure

The project is organized into separate frontend, backend, database and documentation directories.

```text
CNR-Design-Studio/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/lk/cnrdesign/backend/
│   │   │   │   ├── admin/
│   │   │   │   ├── appointment/
│   │   │   │   ├── auth/
│   │   │   │   ├── config/
│   │   │   │   ├── enquiry/
│   │   │   │   ├── notification/
│   │   │   │   ├── project/
│   │   │   │   └── common/
│   │   │   │
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── data/
│   │   └── styles/
│   │
│   ├── public/
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── erd.png
│   ├── home.png
│   ├── projects.png
│   ├── booking.png
│   └── admin.png
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Install the following software before starting:

- Java Development Kit (JDK) 25
- Node.js 20 or newer
- MySQL 8
- MySQL Workbench (or another MySQL client)
- Git
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone <https://github.com/imansharinda-ux/CNR-Design-Studio.git>
```

Navigate into the project directory:

```bash
cd CNR-Design-Studio
```

### 2. Set Up the Database

1. Open MySQL Workbench.
2. Connect to your MySQL server.
3. Open the `database/schema.sql` file.
4. Execute the SQL script.
5. Open `database/seed.sql`.
6. Execute the sample data script.

The database and sample records will be created.

### 3. Configure the Backend

Navigate to:

```text
backend/src/main/resources/
```

Create a file named:

```text
application-local.properties
```

Add your database and application configuration.

Refer to the Configuration section below.

### 4. Run the Backend

Open a terminal inside the `backend` directory.

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

The backend API will start at:

```text
http://localhost:8080
```

### 5. Run the Frontend

Open another terminal inside the `frontend` directory.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:5173
```

### 6. Access the Admin Dashboard

Navigate to:

```text
http://localhost:5173/admin
```

Log in using the administrator credentials configured for the application.

---

## ⚙️ Configuration

The backend configuration is maintained in:

`backend/src/main/resources/application-local.properties`

### Application Properties

| Property | Description | Default |
|---|---|---|
| `app.admin.email` | Administrator login email | `rambukwella77@yahoo.com` |
| `app.admin.name` | Administrator display name | `Chanaka Rambukwella` |
| `app.admin.password` | Initial administrator password | Not set |
| `app.studio.email` | Email receiving studio notifications | Admin email |
| `app.site-url` | Public website URL | `http://localhost:5173` |
| `app.upload-dir` | Uploaded image storage directory | `uploads` |
| `spring.mail.*` | SMTP email configuration | Not configured |

**Note:** Email notifications are optional. If SMTP settings are not configured, the application skips email delivery and records a log message instead.

Never commit real passwords, email credentials or other secrets to GitHub.

---

## 🔌 API Documentation

The application exposes RESTful endpoints for public website operations and administrative management.

### Public API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Retrieve all projects |
| GET | `/api/projects?featured=true` | Retrieve featured projects |
| GET | `/api/projects/{slug}` | Retrieve project details |
| GET | `/api/appointments/slots?date=` | Retrieve available time slots |
| GET | `/api/appointments/blocked` | Retrieve blocked dates |
| GET | `/api/appointments/status?ref=&email=` | Check booking status |
| POST | `/api/appointments` | Create an appointment |
| POST | `/api/appointments/cancel` | Cancel an appointment |
| POST | `/api/enquiries` | Submit a project enquiry |
| POST | `/api/auth/login` | Administrator login |
| POST | `/api/auth/logout` | Administrator logout |

### Appointment Request Example

```json
{
  "date": "2026-11-04",
  "time": "10:30",
  "meetingType": "Studio visit",
  "name": "Kasun Silva",
  "phone": "0771234567",
  "email": "kasun@example.com",
  "note": "Would like to discuss a new house plan.",
  "enquiryId": 3
}
```

The `enquiryId` field is optional. When provided, the backend verifies that the enquiry exists and links the appointment to it.

### Admin API Endpoints

All administrative endpoints require a valid administrator bearer token.

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/summary` | Retrieve dashboard statistics |
| GET | `/api/admin/enquiries` | Retrieve all enquiries |
| PATCH | `/api/admin/enquiries/{id}` | Update enquiry status |
| GET | `/api/admin/appointments` | Retrieve appointments |
| PATCH | `/api/admin/appointments/{id}` | Confirm an appointment |
| PUT | `/api/admin/appointments/{id}/reschedule` | Reschedule an appointment |
| DELETE | `/api/admin/appointments/{id}` | Cancel an appointment |
| GET | `/api/admin/blocked-days` | Retrieve blocked dates |
| POST | `/api/admin/blocked-days` | Add a blocked date |
| DELETE | `/api/admin/blocked-days` | Remove a blocked date |
| GET | `/api/admin/projects` | Retrieve projects |
| POST | `/api/admin/projects` | Create a project |
| PUT | `/api/admin/projects/{id}` | Update a project |
| DELETE | `/api/admin/projects/{id}` | Delete a project |
| GET | `/api/admin/projects/{id}/images` | Retrieve project images |
| POST | `/api/admin/projects/{id}/images` | Upload project images |
| DELETE | `/api/admin/projects/{id}/images/{imageId}` | Delete an image |
| PUT | `/api/admin/projects/{id}/images/order` | Reorder project images |
| PUT | `/api/admin/projects/{id}/cover` | Set project cover image |

---

## 🔒 Validation and Security

Security and data integrity are important aspects of the application.

### Authentication and Authorization

- Administrator passwords are hashed using BCrypt.
- Session tokens expire.
- Only SHA-256 hashes of session tokens are stored in the database.
- Administrative API routes require valid authentication.
- Public users cannot directly access protected admin operations.

### Input Validation

- Frontend form validation.
- Backend validation using Jakarta Bean Validation.
- Centralized exception handling.
- Clear validation error messages.
- Field-level error responses.

### Spam Protection

- Hidden honeypot fields on public forms.
- Per-IP rate limiting.
- Maximum of 8 requests per 10 minutes for each IP address.

### Booking Integrity

A unique database constraint on appointment date and time prevents duplicate bookings.

The backend also validates availability before accepting appointment requests.

---

## 🧪 Testing

The application includes automated frontend and backend tests.

### Backend Testing

Technologies:

- JUnit 5
- Mockito
- MockMvc
- H2 In-Memory Database

Run backend tests:

**Windows PowerShell:**

```powershell
cd backend
.\mvnw.cmd test
```

**Linux / macOS:**

```bash
cd backend
./mvnw test
```

The backend tests use an in-memory H2 database, so a separate MySQL instance is not required for testing.

### Frontend Testing

Technology:

- Vitest

Run frontend tests:

```bash
cd frontend
npm test
```

---

## 🔄 Continuous Integration

The project uses **GitHub Actions** to automate the build and testing process.

The CI pipeline runs automatically whenever changes are pushed to the repository.

### CI Pipeline Activities

1. Check out the latest source code.
2. Set up the Java environment.
3. Build and verify the Spring Boot backend.
4. Execute backend automated tests.
5. Set up Node.js.
6. Install frontend dependencies.
7. Run frontend tests.
8. Build the React application.

This helps identify errors early and maintain application quality throughout development.

---

## 🔮 Future Improvements

The following features can be considered for future development:

- Implement public API endpoints and admin screens for enquiry notes.
- Complete the public testimonials section.
- Introduce cloud-based image storage.
- Deploy the application to a cloud hosting platform.
- Configure a custom domain.
- Improve analytics and reporting capabilities.
- Introduce additional appointment and client management features.

---

## 👩‍💻 Author

<div align="center">

### Sharinda W.G.I.

**Department of Electrical and Information Engineering**

Faculty of Engineering  
University of Ruhuna

[![GitHub](https://img.shields.io/badge/GitHub-imansharinda--ux-181717?style=for-the-badge&logo=github)](https://github.com/imansharinda-ux)

</div>

---

<div align="center">

**CNR Design Studio**

*Designing Spaces. Creating Experiences. Building Visions.*

Developed as an academic project for  
**EC4307 – Web Application Development**

Faculty of Engineering, University of Ruhuna

</div>
