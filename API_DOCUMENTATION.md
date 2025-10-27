# MediCare AI - API Documentation

## Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://ai-powered-medical-diagonises-web.onrender.com`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 🔐 Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🧠 Diagnosis

#### Heart Disease Prediction
```http
POST /api/diagnosis/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "diseaseType": "heart",
  "formData": {
    "age": "45",
    "sex": "Male",
    "chestPain": "Typical Angina",
    "restingBP": "140-159 mmHg",
    "cholesterol": "200-239 mg/dL",
    "fastingBS": "Below 120 mg/dL",
    "maxHR": "120-150 bpm",
    "exerciseAngina": "No"
  }
}
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "risk": "Moderate",
    "confidence": 87,
    "recommendations": [
      "Consult with a healthcare provider within 2 weeks",
      "Consider lifestyle modifications including diet and exercise",
      "Schedule regular monitoring of blood pressure and cholesterol"
    ],
    "doctorRecommendations": [
      {
        "name": "Dr. Sarah Johnson",
        "specialty": "Cardiologist",
        "rating": 4.9,
        "experience": "15 years",
        "location": "City Medical Center",
        "phone": "+91-98765-43210"
      }
    ]
  },
  "recordId": "record_456"
}
```

#### Liver Disease Prediction
```http
POST /api/diagnosis/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "diseaseType": "liver",
  "formData": {
    "age": "35",
    "gender": "Female",
    "totalBilirubin": "1.2 mg/dL",
    "directBilirubin": "0.4 mg/dL",
    "alkalinePhosphatase": "120 U/L",
    "alanineAminotransferase": "45 U/L",
    "aspartateAminotransferase": "38 U/L",
    "totalProteins": "7.2 g/dL",
    "albumin": "4.1 g/dL",
    "albuminGlobulinRatio": "1.3"
  }
}
```

#### Kidney Disease Prediction
```http
POST /api/diagnosis/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "diseaseType": "kidney",
  "formData": {
    "age": "50",
    "bloodPressure": "140/90 mmHg",
    "specificGravity": "1.020",
    "albumin": "2+",
    "sugar": "Normal",
    "redBloodCells": "Normal",
    "pusCell": "Normal",
    "pusCellClumps": "Not Present",
    "bacteria": "Not Present",
    "bloodGlucoseRandom": "120 mg/dL",
    "bloodUrea": "45 mg/dL",
    "serumCreatinine": "1.2 mg/dL",
    "sodium": "140 mEq/L",
    "potassium": "4.2 mEq/L",
    "hemoglobin": "14.5 g/dL",
    "packedCellVolume": "42%",
    "whiteBloodCellCount": "7500 cells/cumm",
    "redBloodCellCount": "4.5 million cells/cumm",
    "hypertension": "Yes",
    "diabetesMellitus": "No",
    "coronaryArteryDisease": "No",
    "appetite": "Good",
    "pedalEdema": "No",
    "anemia": "No"
  }
}
```

#### Diabetes Prediction
```http
POST /api/diagnosis/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "diseaseType": "diabetes",
  "formData": {
    "pregnancies": "2",
    "glucose": "120 mg/dL",
    "bloodPressure": "80 mmHg",
    "skinThickness": "25 mm",
    "insulin": "100 μU/mL",
    "bmi": "28.5",
    "diabetesPedigreeFunction": "0.45",
    "age": "35"
  }
}
```

### 📋 Medical Records

#### Get All Records
```http
GET /api/records
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "records": [
    {
      "id": "record_123",
      "date": "2024-01-15T10:30:00Z",
      "type": "consultation",
      "title": "Heart Disease Assessment",
      "description": "AI-powered diagnosis assessment for Heart Disease...",
      "doctor": "AI Diagnostic System",
      "status": "completed",
      "symptoms": ["chest pain", "shortness of breath"],
      "medications": [],
      "followUp": "Consult with a healthcare provider within 2 weeks",
      "diagnosedDisease": "heart",
      "diseaseRisk": "Moderate",
      "confidence": 87
    }
  ]
}
```

#### Create Record
```http
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "consultation",
  "title": "Regular Check-up",
  "description": "Annual physical examination",
  "doctor": "Dr. Smith",
  "symptoms": ["fatigue"],
  "medications": ["vitamin D"],
  "followUp": "Follow up in 6 months"
}
```

#### Update Record
```http
PUT /api/records/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Check-up",
  "description": "Updated description"
}
```

#### Delete Record
```http
DELETE /api/records/:id
Authorization: Bearer <token>
```

### 💊 Prescriptions

#### Get All Prescriptions
```http
GET /api/prescriptions
Authorization: Bearer <token>
```

#### Create Prescription
```http
POST /api/prescriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "medicationName": "Metformin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "quantity": 60,
  "relatedDiseases": "diabetes"
}
```

### 👨‍⚕️ Doctors

#### Get All Doctors
```http
GET /api/doctors
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "id": "doc_123",
      "name": "Dr. Sarah Johnson",
      "specialty": "Cardiologist",
      "rating": 4.9,
      "experience": "15 years",
      "location": "City Medical Center",
      "phone": "+91-98765-43210",
      "email": "sarah.johnson@medical.com",
      "availability": "Mon-Fri 9AM-5PM",
      "consultationFee": 1500
    }
  ]
}
```

### 📅 Appointments

#### Get Appointments
```http
GET /api/appointments
Authorization: Bearer <token>
```

#### Book Appointment
```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "doctorId": "doc_123",
  "date": "2024-01-20",
  "time": "10:00",
  "reason": "Follow-up consultation",
  "notes": "Patient has been experiencing chest pain"
}
```

### 💳 Payments

#### Create Payment Intent
```http
POST /api/payments/create-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 2999,
  "currency": "inr",
  "description": "Premium Plan Subscription"
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_1234567890_secret_abcdef"
}
```

### 🔔 Notifications

#### Get Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

#### Mark Notification as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

### 🏥 System

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "ok": true,
  "service": "MediCare AI Backend",
  "version": "2.0.0",
  "theme": "Medical Professional",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "environment": "production",
  "database": "connected",
  "ai_models": {
    "heart": "loaded",
    "liver": "loaded", 
    "kidney": "loaded",
    "diabetes": "loaded"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request data",
  "details": "Missing required field: email"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required",
  "message": "Please provide a valid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "message": "Record with ID 123 not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

- **Authentication endpoints:** 5 requests per minute
- **Diagnosis endpoints:** 10 requests per minute
- **Other endpoints:** 100 requests per minute

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin: string;
}
```

### Medical Record
```typescript
interface MedicalRecord {
  id: string;
  date: string;
  type: 'consultation' | 'prescription' | 'lab_result' | 'vaccination' | 'surgery' | 'imaging' | 'emergency';
  title: string;
  description: string;
  doctor: string;
  status: 'completed' | 'pending' | 'cancelled';
  symptoms: string[];
  medications: string[];
  followUp: string;
  diagnosedDisease?: string;
  diseaseRisk?: string;
  confidence?: number;
}
```

### Prescription
```typescript
interface Prescription {
  id: string;
  prescribedDate: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  quantity: number;
  status: 'active' | 'completed' | 'cancelled';
  relatedDiseases?: string;
}
```

### Doctor
```typescript
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  phone: string;
  email: string;
  availability: string;
  consultationFee: number;
}
```

## Testing

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get medical records (replace TOKEN with actual JWT)
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/records
```

### Using Postman

1. Import the API collection
2. Set base URL to `http://localhost:5000`
3. Use the authentication flow to get JWT token
4. Set Authorization header: `Bearer <token>`

## Support

For API support:
- 📧 Email: api-support@medicare-ai.com
- 📖 Documentation: [docs.medicare-ai.com/api](https://docs.medicare-ai.com/api)
- 🐛 Issues: [GitHub Issues](https://github.com/RajoliVishnu/Ai-powered-medical-diagonises-web-app/issues)

