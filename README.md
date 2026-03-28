# AD Admin Panel
Active Directory Web Management System

Modern web application for managing Active Directory users, departments, roles, and locations.

## Features

- **User Management**: Create, read, update, delete users with full filtering and search capabilities
- **Department Management**: Organize users by departments
- **Role-Based Access**: Assign roles and permissions to users
- **Location Management**: Manage multiple office locations
- **Authentication**: JWT-based authentication system
- **Audit Logging**: Track all changes in the system
- **Responsive UI**: Modern, user-friendly interface with React

## Project Structure

```
ad_admin/
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── models/      # Sequelize models
│   │   ├── routes/      # API routes
│   │   └── index.js     # Entry point
│   ├── seeders/         # Database seeders
│   ├── package.json
│   └── ...
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── contexts/    # React context (Auth)
│   │   └── ...
│   ├── package.json
│   └── ...
├── docker-compose.yml   # Docker Compose configuration
└── README.md
```

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development without Docker)
- npm or yarn

## Quick Start with Docker

### Build and Run with Docker Compose

```bash
cd /path/to/ad_admin

# Build and start all services
docker-compose up --build

# In production
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

### Stopping Services

```bash
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Local Development Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Seed database (optional)
npm run seed

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App runs on http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/bulk` - Bulk update users

### References
- `GET /api/references/departments` - Get all departments
- `GET /api/references/locations` - Get all locations
- `GET /api/references/roles` - Get all roles

### Metrics
- `GET /api/metrics/health` - Health check

## Database Models

- **User**: Contains user information and associations
- **Department**: Organization departments
- **Location**: Office locations
- **Role**: User roles with permissions
- **AuditLog**: System audit trail

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key-change-here
DB_PATH=./data/database.sqlite
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Default Credentials

For MVP/demo purposes, the login accepts any username/password combination.

In production, implement proper authentication against your AD/LDAP directory.

## Building Docker Images

### Backend Only
```bash
docker build -t ad_admin_backend .
docker run -p 5000:5000 ad_admin_backend
```

### Frontend Only
```bash
docker build -t ad_admin_frontend ./frontend
docker run -p 3000:3000 ad_admin_frontend
```

## Technologies Used

### Backend
- Node.js
- Express.js
- Sequelize ORM
- SQLite (default, can be changed)
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- React Router v6
- Axios for HTTP requests
- Tailwind CSS for styling
- Lucide React for icons

## Development

### Code Structure
- Backend: MVC pattern with routes, models, controllers
- Frontend: Component-based architecture with Context API for state management

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Individual Docker Containers
```bash
# Build backend
docker build -t ad_admin_backend .

# Build frontend
docker build -t ad_admin_frontend ./frontend

# Run both with Docker Compose or separately
docker run -d -p 5000:5000 --name backend ad_admin_backend
docker run -d -p 3000:3000 --name frontend ad_admin_frontend
```

## Troubleshooting

### Backend not starting
- Check if port 5000 is available
- Verify JWT_SECRET is set in environment
- Check database permissions

### Frontend can't connect to backend
- Ensure REACT_APP_API_URL is correctly set
- Backend must be running on the specified URL
- Check CORS configuration in backend

### Docker issues
- Clear containers and images: `docker-compose down && docker system prune`
- Check logs: `docker-compose logs -f service_name`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
