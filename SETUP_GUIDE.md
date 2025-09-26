# 🚀 Mobile Accessories Business Management System - Setup Guide

## Complete Full-Stack Application Setup

This guide will help you set up both the React Native frontend and NestJS backend with sample data.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Database will be created automatically at: `mongodb://localhost:27017/mobile-accessories-db`

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in `backend/.env`

## 🔧 Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # The .env file is already created with default values
   # Update MONGODB_URI if using MongoDB Atlas
   ```

4. **Seed the database with sample data**
   ```bash
   npm run seed
   ```

5. **Start the backend server**
   ```bash
   npm run start:dev
   ```

   The API will be available at: `http://localhost:3000/api`

## 📱 Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd MobileAccessoriesApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API URL (if needed)**
   ```typescript
   // In src/services/api.ts
   private baseURL: string = 'http://localhost:3000/api';
   ```

4. **Start the Expo development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - **Android**: `npm run android`
   - **iOS**: `npm run ios` (requires macOS)
   - **Web**: `npm run web`

## 🔑 Login Credentials

After seeding the database, you can login with these accounts:

### Admin Account
- **Email**: `admin@mobileaccessories.com`
- **Password**: `password123`
- **Access**: Full system access

### Inventory Manager Account
- **Email**: `inventory@mobileaccessories.com`
- **Password**: `password123`
- **Access**: Product and inventory management

### Driver Accounts
- **Email**: `driver1@mobileaccessories.com`
- **Password**: `password123`
- **Access**: Daily sales/expenses input

- **Email**: `driver2@mobileaccessories.com`
- **Password**: `password123`

- **Email**: `driver3@mobileaccessories.com`
- **Password**: `password123`

## 📊 Sample Data Included

### Users (5 accounts)
- 1 Admin
- 1 Inventory Manager
- 3 Drivers

### Products (15 items)
- **Smartphones**: iPhone 15 Pro Max, Samsung Galaxy S24 Ultra
- **Audio**: AirPods Pro, Sony WH-1000XM5, Bluetooth Speaker
- **Laptops**: MacBook Pro 14", Dell XPS 13
- **Tablets**: iPad Pro 12.9", Samsung Galaxy Tab S9
- **Wearables**: Apple Watch Series 9, Samsung Galaxy Watch 6
- **Accessories**: Charging cables, cases, screen protectors, wireless chargers

### Cars (4 vehicles)
- Toyota Camry (ABC-1234) - Assigned to Mike Driver
- Honda Civic (XYZ-5678) - Assigned to Lisa Driver
- Nissan Altima (DEF-9012) - Assigned to Tom Driver
- Hyundai Elantra (GHI-3456) - Unassigned

### Expenses (13 records)
- **Fuel expenses**: Gas station fill-ups
- **Maintenance**: Oil changes, brake pads, tire replacements
- **Salaries**: Monthly driver and manager salaries
- **Other**: Office supplies, marketing, insurance

## 🎯 Testing the Application

### 1. Login as Admin
- Access all features
- Manage users, products, cars
- View comprehensive reports
- Access dashboard with full analytics

### 2. Login as Inventory Manager
- Manage products and inventory
- Update stock levels
- View low stock alerts
- Access inventory dashboard

### 3. Login as Driver
- View assigned car details
- Input daily sales and expenses
- Access driver-specific dashboard

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/profile` - Get profile

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/low-stock` - Low stock alerts

### Cars
- `GET /api/cars` - List cars
- `POST /api/cars` - Create car
- `POST /api/cars/:id/products` - Assign products

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/report` - Expense reports

### Dashboard
- `GET /api/dashboard/summary` - Dashboard summary
- `GET /api/dashboard/inventory` - Inventory overview

### Reports
- `GET /api/reports/sales` - Sales reports
- `GET /api/reports/expenses` - Expense reports
- `GET /api/reports/profit` - Profit analysis

## 🛠️ Development Commands

### Backend
```bash
# Start development server
npm run start:dev

# Seed database
npm run seed

# Build for production
npm run build

# Run tests
npm run test
```

### Frontend
```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **CORS Errors**
   - Check CORS_ORIGIN in backend `.env`
   - Ensure frontend URL matches

3. **Authentication Issues**
   - Verify JWT_SECRET in `.env`
   - Check token expiration settings

4. **Frontend Build Errors**
   - Clear Expo cache: `npx expo start --clear`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

## 📱 Mobile App Features

### Role-Based Access
- **Admin**: Full system access
- **Inventory Manager**: Product management
- **Driver**: Daily operations

### Key Features
- JWT Authentication
- Product inventory management
- Car and driver assignments
- Expense tracking
- Financial reports
- QR/Barcode scanning
- Charts and analytics
- Real-time dashboard

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure production MongoDB
4. Set up reverse proxy (Nginx)
5. Use PM2 for process management

### Frontend
1. Build for production
2. Deploy to app stores
3. Configure production API URLs
4. Set up push notifications

## 📞 Support

For issues or questions:
1. Check the console logs
2. Verify database connection
3. Check API endpoints with Postman
4. Review error messages

## 🎉 Success!

Once everything is running, you'll have:
- ✅ Complete backend API with sample data
- ✅ React Native app with all features
- ✅ Role-based authentication
- ✅ Real-time dashboard
- ✅ Comprehensive reports
- ✅ Mobile-optimized interface

The application is now ready for development and testing! 🚀
