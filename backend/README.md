# Mobile Accessories Business Management System - Backend

A comprehensive NestJS backend API for managing a mobile accessories business with MongoDB database.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Inventory Manager, Driver)
- Password hashing with bcrypt
- Protected routes with guards

### 📊 Core Modules
- **Users Management**: CRUD operations for user accounts
- **Products Management**: Inventory tracking with stock management
- **Cars Management**: Vehicle tracking with driver assignments
- **Expenses Tracking**: Financial expense management
- **Dashboard**: Summary statistics and analytics
- **Reports**: Sales, expense, and profit reports

### 🛠️ Technical Features
- MongoDB with Mongoose ODM
- TypeScript for type safety
- Data validation with class-validator
- CORS enabled for frontend integration
- Global error handling
- Environment configuration

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get products (with pagination and search)
- `POST /api/products` - Create product (Admin/Inventory Manager)
- `GET /api/products/:id` - Get product by ID
- `PATCH /api/products/:id` - Update product (Admin/Inventory Manager)
- `POST /api/products/:id/stock` - Update stock (Admin/Inventory Manager)
- `GET /api/products/low-stock` - Get low stock products
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cars
- `GET /api/cars` - Get all cars
- `POST /api/cars` - Create car (Admin only)
- `GET /api/cars/:id` - Get car by ID
- `PATCH /api/cars/:id` - Update car (Admin only)
- `POST /api/cars/:id/products` - Assign product to car
- `DELETE /api/cars/:id/products/:productId` - Remove product from car
- `POST /api/cars/daily-record` - Create daily record (Admin/Driver)

### Expenses
- `GET /api/expenses` - Get expenses (with pagination)
- `POST /api/expenses` - Create expense (Admin/Driver)
- `GET /api/expenses/:id` - Get expense by ID
- `PATCH /api/expenses/:id` - Update expense (Admin only)
- `DELETE /api/expenses/:id` - Delete expense (Admin only)
- `GET /api/expenses/report` - Get expense report
- `GET /api/expenses/report/by-type` - Get expenses by type
- `GET /api/expenses/report/by-car` - Get expenses by car

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/inventory` - Get inventory summary
- `GET /api/dashboard/car-performance` - Get car performance data
- `GET /api/dashboard/financial-summary` - Get financial summary

### Reports
- `GET /api/reports/sales` - Get sales report
- `GET /api/reports/expenses` - Get expense report
- `GET /api/reports/profit` - Get profit report

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mobile-accessories-db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:19006
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud instance
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

The API will be available at `http://localhost:3000/api`

## Database Schema

### User Schema
```typescript
{
  email: string (unique)
  password: string (hashed)
  name: string
  role: 'admin' | 'inventory_manager' | 'driver'
  isActive: boolean
  lastLogin?: Date
}
```

### Product Schema
```typescript
{
  name: string
  description: string
  category: string
  price: number
  cost: number
  stockQuantity: number
  minStockLevel: number
  barcode?: string
  imageUrl?: string
  isActive: boolean
}
```

### Car Schema
```typescript
{
  plateNumber: string (unique)
  model: string
  year: number
  driverId?: ObjectId (ref: User)
  assignedProducts: [{
    productId: ObjectId (ref: Product)
    quantity: number
    assignedAt: Date
  }]
  isActive: boolean
}
```

### Expense Schema
```typescript
{
  type: 'fuel' | 'maintenance' | 'salary' | 'other'
  amount: number
  description: string
  carId?: ObjectId (ref: Car)
  date: Date
  createdBy: ObjectId (ref: User)
}
```

## Authentication

### Login Request
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Response
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### Using the Token
Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Role-Based Access

- **Admin**: Full access to all endpoints
- **Inventory Manager**: Access to products and inventory management
- **Driver**: Access to cars, daily records, and limited expense creation

## Error Handling

The API returns consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Development

### Project Structure
```
src/
├── auth/           # Authentication module
├── users/          # User management
├── products/       # Product management
├── cars/           # Car management
├── expenses/       # Expense tracking
├── dashboard/      # Dashboard analytics
├── reports/        # Reports module
├── database/       # Database configuration
└── main.ts         # Application entry point
```

### Adding New Features

1. Create a new module: `nest g module feature-name`
2. Create service: `nest g service feature-name`
3. Create controller: `nest g controller feature-name`
4. Add to app.module.ts imports
5. Update routes and guards as needed

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Production Deployment

1. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use strong JWT secret
   - Configure MongoDB Atlas or production MongoDB
   - Set up proper CORS origins

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Deploy**
   - Use PM2 for process management
   - Set up reverse proxy (Nginx)
   - Configure SSL certificates
   - Set up monitoring and logging

## API Documentation

Once running, you can access:
- **Swagger UI**: `http://localhost:3000/api/docs` (if configured)
- **Health Check**: `http://localhost:3000/api/health`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code comments

---

**Note**: This backend is designed to work with the React Native frontend application. Make sure to configure CORS properly for your frontend URL.