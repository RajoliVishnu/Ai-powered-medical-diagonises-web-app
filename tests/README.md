# Testing Structure for AI-Powered Medical Diagnosis Web App

## Test Directory Structure

```
project/
├── tests/                          # Frontend Tests
│   ├── unit/                       # Unit Tests
│   │   ├── components/            # Component Tests
│   │   ├── utils/                 # Utility Function Tests
│   │   └── hooks/                 # Custom Hook Tests
│   ├── integration/               # Integration Tests
│   └── e2e/                      # End-to-End Tests
├── server/
│   └── tests/                     # Backend Tests
│       ├── api/                  # API Endpoint Tests
│       ├── middleware/           # Middleware Tests
│       ├── routes/               # Route Tests
│       └── integration/          # Backend Integration Tests
```

## How to Run Tests

### Frontend Tests
```bash
cd project
npm test                    # Run all frontend tests
npm run test:unit          # Run unit tests only
npm run test:integration   # Run integration tests only
npm run test:coverage      # Run with coverage report
```

### Backend Tests
```bash
cd project/server
npm test                    # Run all backend tests
npm run test:api           # Run API tests only
npm run test:routes        # Run route tests only
npm run test:coverage      # Run with coverage report
```

### Full Application Tests
```bash
cd project
npm run test:all          # Run both frontend and backend tests
```
