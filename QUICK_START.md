# 🚀 Mobile Accessories Business Management System - Quick Setup

## 🎯 **Complete Full-Stack Application with Sample Data**

You now have a complete full-stack mobile accessories business management system! Here's how to get it running:

## 📋 **Prerequisites**

1. **MongoDB** - You need MongoDB running locally or use MongoDB Atlas
2. **Node.js** (v16 or higher)
3. **Expo CLI** (`npm install -g @expo/cli`)

## 🗄️ **Database Setup**

### Option 1: Local MongoDB
1. **Install MongoDB** locally on your system
2. **Start MongoDB service**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb/brew/mongodb-community
   ```

### Option 2: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `backend/.env` with your MongoDB Atlas URI:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mobile-accessories-db
   ```

## 🔧 **Backend Setup**

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start MongoDB** (if using local MongoDB)

4. **Seed the database**:
   ```bash
   npm run seed
   ```

5. **Start the backend server**:
   ```bash
   npm run start:dev
   ```

   The API will be available at: `http://localhost:3000/api`

## 📱 **Frontend Setup**

1. **Navigate to frontend directory**:
   ```bash
   cd MobileAccessoriesApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Expo development server**:
   ```bash
   npm start
   ```

4. **Run on device/simulator**:
   - **Android**: `npm run android`
   - **iOS**: `npm run ios` (requires macOS)
   - **Web**: `npm run web`

## 🔑 **Login Credentials**

After seeding the database, you can login with:

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

## 📊 **Sample Data Included**

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

## 🎯 **Testing the Application**

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

## 🚀 **Quick Start Commands**

### Backend
```bash
cd backend
npm install
npm run seed    # Seed database with sample data
npm run start:dev
```

### Frontend
```bash
cd MobileAccessoriesApp
npm install
npm start
```

## 🎉 **Success!**

Once everything is running, you'll have:
- ✅ Complete backend API with sample data
- ✅ React Native app with all features
- ✅ Role-based authentication
- ✅ Real-time dashboard
- ✅ Comprehensive reports
- ✅ Mobile-optimized interface

## 🐛 **Troubleshooting**

### MongoDB Connection Issues
- Ensure MongoDB is running locally
- Check connection string in `.env`
- For MongoDB Atlas, verify network access settings

### Frontend Issues
- Clear Expo cache: `npx expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Backend Issues
- Check if MongoDB is running
- Verify `.env` file configuration
- Check console logs for errors

## 📞 **Support**

The application is now **100% complete** and ready for development and testing! 🚀

All features are implemented:
- ✅ JWT Authentication with role-based access
- ✅ Complete CRUD operations for all entities
- ✅ Real-time dashboard with analytics
- ✅ Comprehensive reporting system
- ✅ Mobile-optimized React Native interface
- ✅ Professional UI/UX with Material Design
- ✅ QR/Barcode scanning capabilities
- ✅ Charts and data visualization
- ✅ Error handling and loading states
- ✅ Production-ready architecture
