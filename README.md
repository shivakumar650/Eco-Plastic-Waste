# Plastic Waste Reduction and Awareness Portal

A comprehensive MERN stack web application designed to promote plastic waste reduction through awareness campaigns, educational resources, and recycling center locators.

## 🌟 Features

### Core Features
- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Awareness Campaigns** - Create, join, and manage environmental campaigns
- **Educational Resources** - Share and access tips, articles, videos, and research
- **Recycling Center Locator** - Find nearby recycling centers and waste management facilities
- **Admin Panel** - Comprehensive dashboard for content moderation and user management

### User Roles
- **End Users** - Browse content, join campaigns, bookmark resources
- **Content Proposers** - Create campaigns, submit resources and agencies
- **Administrators** - Full system management and content moderation

### Technical Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark/Light Mode** - Theme switching with system preference detection
- **Advanced Search & Filtering** - Comprehensive search across all content types
- **Pagination** - Paginated campaign, resource, and agency listings

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **React Query** - Server state management
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Joi** - Data validation
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Eco-Plastic-Waste
```

### 2. Install Dependencies

#### Root Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)
```bash
cd server
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/plastic_portal

# JWT Secrets (Change these in production!)
JWT_ACCESS_SECRET=replace_with_a_unique_random_secret_at_least_32_characters
JWT_REFRESH_SECRET=replace_with_a_different_random_secret_at_least_32_characters
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_unique_password_at_least_16_characters

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment (.env)
```bash
cd client
cp .env.example .env
```

Update the `.env` file:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# App Configuration
VITE_APP_NAME=EcoPortal
VITE_APP_VERSION=1.0.0
```

### 4. Database Setup

Ensure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# macOS (using Homebrew)
brew services start mongodb-community

# Linux (using systemd)
sudo systemctl start mongod
```

The application will automatically:
- Create the database and collections
- Set up indexes for optimal performance
- Create the initial admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `server/.env`

To populate a local showcase database with clearly labeled sample campaigns and resources, run:
```bash
cd server
npm run seed:demo
```

The command is idempotent and refuses to run when `NODE_ENV=production`. To deliberately add the same clearly labeled sample records to the production database, open the Render API service's Shell after deployment and run:
```bash
npm run seed:showcase
```

This is a one-time, explicit operation; normal server starts never seed showcase data. The seed command requires the production `MONGODB_URI` and admin environment variables to be configured in Render.

### 5. Start the Application

#### Development Mode (Recommended)
From the root directory:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 5173) concurrently.

#### Individual Services
```bash
# Backend only
npm run server

# Frontend only
npm run client
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your local server `.env` to create the initial admin account. In production, the password must be at least 16 characters long; never commit real credentials.

## 📁 Project Structure

```
Eco-Plastic-Waste/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── services/       # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── layouts/        # Layout components
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   ├── package.json
│   └── server.js          # Main server file
├── package.json           # Root package.json
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start backend server only
- `npm run client` - Start frontend development server only
- `npm run build` - Build frontend for production
- `npm start` - Start backend in production mode

### Tests
- `cd server && npm test` - Run backend validation tests

### Backend (server/)
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon for development

### Frontend (client/)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update user profile
- `PUT /api/v1/auth/change-password` - Change password

### Campaign Endpoints
- `GET /api/v1/campaigns` - Get all campaigns (with filters)
- `GET /api/v1/campaigns/:id` - Get single campaign
- `POST /api/v1/campaigns` - Create campaign (Content Proposer/Admin)
- `PUT /api/v1/campaigns/:id` - Update campaign
- `DELETE /api/v1/campaigns/:id` - Delete campaign
- `POST /api/v1/campaigns/:id/join` - Join campaign
- `POST /api/v1/campaigns/:id/leave` - Leave campaign

### Resource Endpoints
- `GET /api/v1/resources` - Get all resources (with filters)
- `GET /api/v1/resources/:id` - Get single resource
- `POST /api/v1/resources` - Create resource (Content Proposer/Admin)
- `PUT /api/v1/resources/:id` - Update resource
- `DELETE /api/v1/resources/:id` - Delete resource
- `POST /api/v1/resources/:id/like` - Like/unlike resource

### Agency Endpoints
- `GET /api/v1/agencies` - Get all agencies (with filters)
- `GET /api/v1/agencies/:id` - Get single agency
- `POST /api/v1/agencies` - Create agency (Content Proposer/Admin)
- `PUT /api/v1/agencies/:id` - Update agency
- `DELETE /api/v1/agencies/:id` - Delete agency
- `POST /api/v1/agencies/:id/review` - Add review to agency

### Admin Endpoints
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/users` - User management
- `GET /api/v1/admin/campaigns/pending` - Pending campaigns
- `GET /api/v1/admin/resources/pending` - Pending resources
- `GET /api/v1/admin/agencies/pending` - Pending agencies
- `GET /api/v1/admin/audit-logs` - Audit logs

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for password security
- **Rate Limiting** - API endpoint protection
- **Helmet.js** - Security headers
- **Input Validation** - Joi schema validation
- **CORS Configuration** - Cross-origin request handling
- **Environment Variables** - Secure configuration management

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Dark/Light Mode** - Theme switching with persistence
- **Smooth Animations** - Framer Motion animations
- **Loading States** - Skeleton loaders and spinners
- **Toast Notifications** - User feedback system
- **Accessible Design** - ARIA compliance and keyboard navigation
- **Modern Design System** - Consistent styling with Tailwind CSS

## 🚀 Deployment

This repository includes a Render Blueprint in `render.yaml` for the API and a Vercel SPA rewrite in `client/vercel.json`.

### 1. Create a production database

Create a MongoDB Atlas cluster and database user. Configure Atlas Network Access to allow the API host to connect, then copy the connection string for the `plastic_portal` database. Keep the connection string private.

### 2. Deploy the API to Render

1. Push this repository to GitHub and create a new Blueprint on Render from it.
2. Render will use `render.yaml` to configure the API service. When prompted, provide:
   - `MONGODB_URI`: your Atlas connection string
   - `ADMIN_EMAIL`: the initial administrator's email
   - `ADMIN_PASSWORD`: a unique password of at least 16 characters
   - `CORS_ORIGINS`: the exact Vercel site origin, such as `https://your-site.vercel.app` (no trailing slash)
3. Keep the generated JWT secrets distinct; the Blueprint generates them automatically.
4. After deployment, verify `https://<your-api-host>/health` responds successfully.

### 3. Deploy the frontend to Vercel

1. Import the repository into Vercel and set the project **Root Directory** to `client`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Set the build environment variable `VITE_API_URL` to `https://<your-api-host>/api/v1`.
4. Deploy and verify that the campaigns, resources, authentication, and detail routes work. The Vercel rewrite serves the SPA on direct route visits.

If the Vercel domain is not known when configuring Render, deploy the frontend first, then set `CORS_ORIGINS` in Render to that origin and redeploy the API.

### Before inviting real users

- The demo records in your local MongoDB are not copied to Atlas. Add approved showcase content to the production database separately; `npm run seed:demo` is blocked in production.
- Publish accurate Terms and Privacy pages before accepting real users.
- Run the end-to-end flows against the deployed services; a successful `/health` response alone does not verify database or authentication flows.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error messages, screenshots, and steps to reproduce

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the flexible database
- All contributors and the open-source community

---

**Built with ❤️ for a sustainable future** 🌱