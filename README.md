# Hospital Management System (HMS)

A comprehensive, cloud-ready Hospital Management System designed for Indian hospitals with support for multi-hospital operations, GST compliance, and Indian payment gateways.

## Features

### Patient Features
- **Mobile-based Registration** - OTP verification, no password required for patients
- **Family Member Management** - Multiple patients under one mobile number
- **Appointment Booking** - OPD, Teleconsultation, Follow-ups
- **Real-time Queue/Token System** - Track wait times
- **Digital Prescriptions** - Access and download prescriptions
- **Lab Reports** - View and download lab results
- **Online Payments** - UPI, Cards, Net Banking with GST invoices

### Doctor Features
- **Daily Appointment Dashboard** - View and manage patient queue
- **Patient Medical History** - Access complete patient records
- **Digital Prescription** - Create and sign prescriptions digitally
- **Lab Test Ordering** - Order tests with sample tracking
- **Teleconsultation Support** - Video consultation integration ready

### Hospital Administration
- **Multi-Hospital Support** - Manage multiple hospitals/branches
- **Department Management** - Configure departments and specializations
- **Doctor Onboarding** - Manage doctors, schedules, and fees
- **Staff Management** - Attendance, shifts, leave management
- **Bed Management** - Real-time bed availability tracking
- **Billing & Finance** - GST compliant invoicing, payment reconciliation

### Technical Features
- **Role-Based Access Control** - 15+ user roles with granular permissions
- **Audit Logging** - Track all critical actions for compliance
- **Multi-language Support** - English and Hindi
- **Mobile-First UI** - Responsive design for all devices
- **Real-time Updates** - WebSocket for queue updates
- **Indian Payment Gateways** - Razorpay, PayTM, PhonePe integration ready

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with MySQL/PostgreSQL
- **Redis** for caching (optional)
- **WebSocket** for real-time features

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Zustand** for state management
- **i18next** for internationalization

### Infrastructure
- **Docker** & **Docker Compose**
- **Nginx** reverse proxy
- **PostgreSQL** or **MySQL** database

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Docker & Docker Compose (for containerized deployment)
- MySQL 8 or PostgreSQL 15

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/your-org/hospital-management-system.git
cd hospital-management-system
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration

4. Start the application:
```bash
docker-compose up -d
```

5. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui.html

### Production Deployment

For production deployment, see the comprehensive [Deployment Guide](docs/DEPLOYMENT.md).

**Quick Production Deploy:**

```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows
.\deploy.ps1
```

**Using Docker Compose with production settings:**

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Automated CI/CD:**

The project includes GitHub Actions workflows for automated testing and deployment:
- CI pipeline runs on every push/PR
- Automated deployment to production on main branch
- See `.github/workflows/` for details

### Development Setup

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd web-client
npm install
npm run dev
```

## Project Structure

```
hospital-management-system/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/hospital/hms/
│   │   ├── common/            # Shared entities, DTOs, enums
│   │   ├── config/            # Configuration classes
│   │   ├── security/          # Authentication & authorization
│   │   ├── patient/           # Patient module
│   │   ├── doctor/            # Doctor module
│   │   ├── appointment/       # Appointment & queue
│   │   ├── pharmacy/          # Pharmacy & inventory
│   │   ├── lab/               # Lab tests & reports
│   │   ├── billing/           # Invoicing & payments
│   │   ├── hospital/          # Hospital & department
│   │   ├── staff/             # Staff management
│   │   ├── notification/      # Notifications
│   │   ├── audit/             # Audit logging
│   │   └── reports/           # Reports & analytics
│   └── src/main/resources/
│       └── application.yml    # Configuration
├── web-client/                 # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # State management
│   │   └── i18n/              # Translations
│   └── package.json
├── docker-compose.yml          # Docker configuration
├── .env.example               # Environment template
└── README.md
```

## User Roles

| Role | Description |
|------|-------------|
| PATIENT | Regular patient with access to personal records |
| FAMILY_MEMBER | Can book appointments for linked patients |
| DOCTOR | Licensed physician with consultation access |
| SPECIALIST | Specialist doctor with advanced access |
| NURSE | Nursing staff with patient care access |
| LAB_TECHNICIAN | Lab staff with test management |
| PHARMACIST | Pharmacy staff with medicine dispensing |
| RECEPTIONIST | Front desk for registration |
| BILLING_STAFF | Finance staff for billing |
| HOSPITAL_ADMIN | Full hospital management access |
| SUPER_ADMIN | Multi-hospital administrative access |

## API Documentation

API documentation is available at `/swagger-ui.html` when the backend is running.

### Key Endpoints

- `POST /api/v1/auth/otp/send` - Send OTP for login
- `POST /api/v1/auth/otp/verify` - Verify OTP and login
- `POST /api/v1/patients` - Register patient
- `GET /api/v1/appointments` - List appointments
- `POST /api/v1/appointments` - Book appointment

## Indian Compliance

- **GST Invoicing** - CGST, SGST, IGST support
- **Aadhaar Integration** - Optional, with encryption
- **Data Protection** - HIPAA-like security measures
- **Consent Management** - SMS, Email, WhatsApp preferences
- **Multi-language** - English and Hindi support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@hospital.com or open an issue in the repository.
