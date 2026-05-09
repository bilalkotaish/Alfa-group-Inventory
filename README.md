# Alfa Group Inventory System

A simplified Mobile Store Web App built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Product Management**: Add, edit, and delete products. Includes stock tracking and manual adjustments via sales.
- **Reports & Analytics**: Track total stock, stock value, daily/monthly revenue, and daily/monthly profit. Dashboard charts powered by Recharts.
- **Sales Reporting**: View past transactions with date, sale price, and calculated profit. Easily exportable to CSV.
- **Authentication**: JWT-based secure login.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or update the `MONGO_URI` in `Backend/.env`.

## Setup Instructions

### 1. Backend
Open a terminal in the `Backend` directory:
```bash
cd Backend
npm install
# To create the initial admin user (admin / admin123)
node seed.js 
# To start the server
node server.js
```

### 2. Frontend
Open another terminal in the `Frontend` directory:
```bash
cd Frontend
npm install
# To start the Vite development server
npm run dev
```

## Default Login Credentials
- **Username**: admin
- **Password**: admin123

(Make sure you ran `node seed.js` in the Backend directory to create this user!)
