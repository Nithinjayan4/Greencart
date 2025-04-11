# 🛒 Greencart – Online Grocery Delivery Platform

**Greencart** is a fully functional full-stack e-commerce grocery delivery application built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**. It enables customers to browse groceries, place online orders with integrated payment options, and allows admins to manage inventory via a seller panel.

The application is designed with modern UI components using **Tailwind CSS** and deployed for free on **Vercel**, making it globally accessible.

---

## 🔗 Live Demo

👉 [Frontend (Vercel)](https://your-frontend-url.vercel.app)  
👉 [Backend (Vercel)](https://greencart-backend-khaki.vercel.app)

---

## ✨ Features

- ✅ Browse grocery products with dynamic categories
- ✅ User registration and authentication
- ✅ Add to cart and place orders
- ✅ Stripe integration for secure online payments
- ✅ Admin panel to manage inventory
- ✅ Responsive UI built with Tailwind CSS
- ✅ Fully connected MERN stack architecture
- ✅ Deployed online for public access

---

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Atlas)  
- **Authentication**: JWT  
- **Payments**: Stripe API  
- **Deployment**: Vercel (Frontend & Backend)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Nithinjayan4/Greencart.git
cd Greencart
```

### 2. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Environment Variables

Create a `.env` file inside the `server` directory with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_secret_key
```

### 4. Run the Application Locally

```bash
# Backend
cd server
npm start

# Frontend (in a separate terminal)
cd client
npm start
```

---

## 📁 Project Structure

```
Greencart/
├── client/          # React frontend (User & Admin UI)
│   └── ...
├── server/          # Node.js backend (REST API + MongoDB)
│   └── ...
├── README.md
└── .gitignore
```

---

## 💳 Stripe Integration

We use **Stripe** to process online payments securely. You can test payments using Stripe test cards during development.

---

## 🎨 UI Components

We utilized components from [PrebuiltUI](https://prebuiltui.com/components) for building clean and responsive user interfaces with Tailwind CSS.

---

## 🚀 Deployment

- **Frontend & Backend**: Deployed on Vercel
- **Database**: MongoDB Atlas (cloud-hosted)
- The full application is accessible online and ready to accept real-time grocery orders.

---

## 🥪 Testing

Basic testing can be done manually by:
- Registering a user
- Adding products via the admin panel
- Placing an order with Stripe payment

(Consider adding automated tests with tools like Jest or Cypress in future development.)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Stripe API Docs](https://stripe.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Prebuilt UI Components](https://prebuiltui.com/components)
- [Vercel Hosting](https://vercel.com/)

