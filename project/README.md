# AI-Powered Medical Diagnosis Web App

A comprehensive medical diagnosis platform built with React, Node.js, and AI integration for healthcare professionals and patients.

## Features

- **AI-Powered Diagnosis**: Advanced machine learning algorithms for medical diagnosis
- **Image Analysis**: Upload and analyze medical images (X-rays, CT scans, MRI)
- **Patient Management**: Complete electronic health records system
- **Doctor Consultation**: Video consultation and appointment scheduling
- **Prescription Management**: Digital prescription system
- **Payment Integration**: Secure payment processing with Stripe
- **Real-time Notifications**: SMS and email notifications

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express
- JSON database for development
- JWT authentication
- RESTful API design

### Testing
- Jest for unit testing
- React Testing Library for component testing
- Supertest for API testing

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ai-powered-medical-diagnosis-web-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Start the backend server
```bash
cd server
npm install
npm start
```

## Project Structure

```
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   └── stores/            # State management
├── server/                # Backend server
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── lib/               # Utility functions
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Diagnosis
- `POST /api/diagnosis/submit` - Submit diagnosis
- `GET /api/diagnosis/history` - Get diagnosis history
- `POST /api/diagnosis/upload-image` - Upload medical images

### Medical Records
- `GET /api/records` - Get medical records
- `POST /api/records` - Create medical record
- `PUT /api/records/:id` - Update medical record

## Testing

Run the test suite:
```bash
npm test
```

Run specific test categories:
```bash
npm run test:unit
npm run test:integration
```

## Deployment

The application is configured for deployment on Vercel (frontend) and Render (backend).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.