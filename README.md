# Aluminum Management System

## 📌 Overview
The Aluminum Management System is a full-stack web application designed to help a super admin monitor sub-admin activities, manage aluminum item distributions, and track sales performance in real time.  
It ensures accurate sales reporting, inventory tracking, and automatic sold-out notifications.

## 🚀 Features
- **Super Admin**
  - Assign aluminum shapes to sub-admins.
  - View sub-admin details and revenue reports.
  - Get notified when an item is sold out.
- **Sub Admin**
  - Update sold quantities.
  - View assigned items and orders.
- **Customer**
  - Browse aluminum products.
  - Add items to cart and checkout.
  - Receive order confirmation emails.
- **Notifications**
  - Super admin receives sold-out alerts with customer delivery details.

## 🛠 Tech Stack
- **Frontend:** React, Tailwind CSS, Axios
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Other:** JWT Authentication, Nodemailer

## 📂 Folder Structure
frontend/
│── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
backend/
│── controllers/           # API endpoint logic
│── routes/                # Route definitions
│── models/                # Database queries
│── server.js              # App entry point

## ⚙️ Installation

# 1️⃣ Clone the repository
git clone https://github.com/yourusername/aluminum-management-system.git
cd aluminum-management-system

# 2️⃣ Install dependencies
# Backend
cd backend
yarn install

# Frontend
cd ../frontend
yarn install

# 3️⃣ Set up environment variables
# Create a .env file in backend folder with:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=aluminum_db
JWT_SECRET=your_jwt_secret
EMAIL_USER=youremail@example.com
EMAIL_PASS=your_email_password

# 4️⃣ Run the application
# Backend
cd backend
yarn start

# Frontend
cd ../frontend
yarn dev

## 📡 API Endpoints (Examples)
POST /auth/login                   → Login user
POST /super_admin/assign-item      → Assign aluminum to sub admin
POST /customer/place-order         → Place a customer order
POST /sub_admin/update-sales       → Update sold quantities
GET  /super_admin/revenue/:id      → Get sub admin revenue report

## 🧪 Usage Guide with Postman Requests

# 1️⃣ Login as Super Admin
POST {{base_url}}/auth/login
{
  "email": "superadmin@example.com",
  "password": "password123"
}

# 2️⃣ Assign Aluminum to Sub Admin
POST {{base_url}}/super_admin/assign-item
Authorization: Bearer {{token}}
{
  "subAdminId": 2,
  "shape": "Round Pipe",
  "given_quantity": 50,
  "price_per_item": 25.00
}

# 3️⃣ Place a Customer Order
POST {{base_url}}/customer/place-order
{
  "customer": {
    "name": "John Doe",
    "phone": "123456789",
    "address": "123 Main St"
  },
  "items": [
    { "id": 1, "quantity": 2 }
  ],
  "total": 50
}

# 4️⃣ Update Sold Quantities (Sub Admin)
POST {{base_url}}/sub_admin/update-sales
Authorization: Bearer {{token}}
{
  "itemId": 1,
  "quantitySold": 2
}

# 5️⃣ Get Revenue Report for Sub Admin
GET {{base_url}}/super_admin/revenue/2
Authorization: Bearer {{token}}

# For more detailed Postman data use the JSON file with in the Git-Repo
 - Aluminum Company API.postman_collection.json
