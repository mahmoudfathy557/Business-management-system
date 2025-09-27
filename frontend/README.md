# Mobile Accessories Business Management System

A comprehensive full-stack application for managing a mobile accessories business with role-based access control, featuring a React Native frontend and NestJS backend with MongoDB.

## Features

### 🔐 Authentication & User Roles
- JWT-based authentication (login/register)
- Role-based access control:
  - **Super Admin**: Complete system access to all endpoints
  - **Admin**: Full system access
  - **Inventory Manager**: Stock management only
  - **Driver**: Daily sales/expenses input only
- Secure token storage with AsyncStorage
- Password hashing with bcryptjs

### 📱 Screens & Features

#### Dashboard (Role-based)
- **Admin**: Summary overview (income, expenses, profit, stock alerts)
- **Inventory Manager**: Quick access to stock management
- **Driver**: Quick form for daily income & expenses

#### Inventory Management
- Product listing with search & filter
- Add/edit/delete products
- Stock in/out management
- Low-stock alerts

#### Cars & Drivers
- Car listing with driver assignments
- Stock assignment to cars
- Daily income & expense recording
- Performance comparison between cars

#### Finance
- Expense tracking (fuel, maintenance, salaries)
- Income tracking per car/product
- Net profit calculation
- Financial charts and analytics

#### Reports
- Daily/weekly/monthly reports
- Sales and expense charts
- Export functionality (PDF/Excel via backend)

#### User Management (Admin only)
- User CRUD operations
- Role assignment

#### Settings
- Backup & restore
- Notifications configuration
- App preferences

## Tech Stack

### Frontend
- **Framework**: React Native with Expo
- **UI Components**: React Native Paper
- **Navigation**: React Navigation v6
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Charts**: Victory Native / React Native Chart Kit
- **Scanner**: Expo Barcode Scanner

### Backend
- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator
- **Security**: bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests

## Project Structure

### Frontend (React Native)
```
src/
├── components/          # Reusable UI components
│   ├── FormInput.tsx
│   ├── ProductCard.tsx
│   ├── CarCard.tsx
│   └── ExpenseForm.tsx
├── screens/            # App screens
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── InventoryScreen.tsx
│   ├── CarsScreen.tsx
│   ├── FinanceScreen.tsx
│   ├── ReportsScreen.tsx
│   ├── UsersScreen.tsx
│   ├── SettingsScreen.tsx
│   └── [Detail/Form screens]
├── navigation/          # Navigation setup
│   └── AppNavigator.tsx
├── redux/              # State management
│   ├── store.ts
│   └── slices.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript types
│   └── index.ts
└── utils/              # Utility functions
```

### Backend (NestJS)
```
backend/src/
├── auth/               # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── roles.decorator.ts
├── users/              # User management
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── schemas/user.schema.ts
│   └── dto/user.dto.ts
├── products/           # Product management
├── cars/               # Car management
├── expenses/           # Expense tracking
├── dashboard/          # Dashboard data
├── reports/            # Reports generation
├── seed/               # Database seeding
└── main.ts             # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mobile-accessories
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   CORS_ORIGIN=http://localhost:19006
   ```

4. **Start the backend server**
   ```bash
   npm run start:dev
   ```

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Access Swagger documentation**
   - Open your browser and go to: `http://localhost:3000/api/docs`
   - This provides interactive API documentation and testing

### Frontend Setup

1. **Navigate to project root**
   ```bash
   cd ..  # (if you're in the backend directory)
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API base URL** in `src/services/api.ts`:
   ```typescript
   private baseURL: string = 'http://localhost:3000/api';
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - **Android**: `npm run android`
   - **iOS**: `npm run ios` (requires macOS)
   - **Web**: `npm run web`

## Usage

### First Time Setup

1. **Use seeded users** (if you ran the seed command):
   - **Super Admin**: `superadmin@mobileaccessories.com` / `password123`
   - **Admin**: `admin@mobileaccessories.com` / `password123`
   - **Inventory Manager**: `inventory@mobileaccessories.com` / `password123`
   - **Drivers**: `driver1@mobileaccessories.com` / `password123` (and driver2, driver3)

2. **Or register a new user**:
   - Open the app
   - Tap "Register"
   - Select appropriate role
   - Fill in your details

3. **Login** with your credentials

4. **Add initial data** (if not seeded):
   - Add products to inventory
   - Add cars and assign drivers
   - Set up expense categories

### Role-Based Access

- **Super Admin**: Complete access to all endpoints and features
- **Admin**: Full access to all features
- **Inventory Manager**: Can manage products and stock
- **Driver**: Can only input daily sales/expenses for assigned car

### API Documentation

The backend includes comprehensive Swagger documentation:
- **URL**: `http://localhost:3000/api/docs`
- **Features**: Interactive API testing, request/response examples, authentication testing
- **Authentication**: Use the "Authorize" button to test protected endpoints

### Key Features

#### Inventory Management
- Add products with barcode scanning
- Track stock levels and set minimum thresholds
- Receive low-stock alerts

#### Car Management
- Assign products to cars
- Track daily sales and expenses per car
- Compare performance between cars

#### Financial Tracking
- Record various expense types
- Track income by car/product
- View profit/loss reports

## Development

### Adding New Features

1. **Create new screen** in `src/screens/`
2. **Add to navigation** in `src/navigation/AppNavigator.tsx`
3. **Add Redux slice** if needed in `src/redux/slices.ts`
4. **Add API methods** in `src/services/api.ts`
5. **Update types** in `src/types/index.ts`

### Code Style

- Use TypeScript for type safety
- Follow React Native Paper design system
- Use Redux Toolkit for state management
- Implement proper error handling
- Add loading states for better UX

## Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Dependency conflicts**: Use `--legacy-peer-deps` flag
3. **API connection issues**: Check backend URL and network connectivity
4. **Build errors**: Ensure all dependencies are properly installed
5. **Database connection issues**: Verify MongoDB is running and MONGODB_URI is correct
6. **JWT authentication issues**: Check JWT_SECRET in .env file
7. **CORS issues**: Verify CORS_ORIGIN matches your frontend URL

### Backend Issues

1. **Port already in use**: Kill existing Node processes with `taskkill /F /IM node.exe` (Windows)
2. **Database seeding fails**: Ensure MongoDB is running and accessible
3. **Swagger not accessible**: Check if server is running on correct port (default: 3000)

### Debug Mode

Enable debug mode by adding to your device:
- Shake device → "Debug Remote JS"
- Or use `npx expo start --dev-client`

### API Testing

Use the Swagger documentation at `http://localhost:3000/api/docs` to:
- Test all endpoints interactively
- Verify authentication flow
- Check request/response formats
- Debug API issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Users (Admin/Super Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/stock` - Update stock

### Cars
- `GET /api/cars` - Get all cars
- `POST /api/cars` - Create new car
- `GET /api/cars/:id` - Get car by ID
- `PATCH /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense by ID
- `PATCH /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/inventory` - Get inventory overview
- `GET /api/dashboard/car-performance` - Get car performance data
- `GET /api/dashboard/financial-summary` - Get financial summary

### Reports
- `GET /api/reports/sales` - Get sales reports
- `GET /api/reports/expenses` - Get expense reports
- `GET /api/reports/profit` - Get profit reports

### Database Seeding (Super Admin only)
- `POST /api/seed` - Seed the database with initial data
- `POST /api/seed/assign-products` - Assign products to cars

---

**Note**: This is a full-stack application with both frontend (React Native) and backend (NestJS + MongoDB) components. Make sure to set up both parts for a fully functional system.
#   B u s i n e s s - m a n a g e m e n t - s y s t e m  
 #   B u s i n e s s - m a n a g e m e n t - s y s t e m  
 