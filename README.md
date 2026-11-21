<div align="center">

# 🏡 RealEstate Platform

**A full-stack property marketplace where sellers list properties, buyers search, save and enquire, and admins keep everything in check.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-realtime-010101?logo=socketdotio&logoColor=white)

</div>

---

## ✨ Features

### 👤 Buyers
- Browse and view full details of every listed property
- Save favourites to a **wishlist**
- Send **inquiries** to sellers and track them
- **Real-time chat** with sellers (text and images)

### 🏠 Sellers
- Add, edit, delete and change the status of properties (up to 10 images each, uploaded to Cloudinary)
- Personal **dashboard** with listing stats
- Read inquiries and chat with interested buyers
- Account goes through admin approval

### 🛡️ Admins
- Dashboard with platform-wide statistics
- Manage users: block or delete accounts
- Approve pending sellers
- Review all properties, inquiries and contact messages

### 🔐 Platform
- JWT authentication with **role-based access** (`buyer`, `seller`, `admin`)
- Email verification and forgot / reset password flow (emails sent through Brevo)
- Public contact form and public seller profiles
- Responsive UI with smooth animations

## 🛠️ Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router 7, Zustand, Axios, React Hook Form, Framer Motion, React Hot Toast |
| Backend | Node.js, Express 5, Mongoose, JWT, bcryptjs, Multer |
| Real-time | Socket.IO |
| Database | MongoDB |
| Media | Cloudinary |
| Email | Brevo API |
| Hosting | Render (the Express server also serves the built frontend) |

## 📁 Project structure

```
RealEstate-Platform/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB and Cloudinary setup
│   │   ├── controlleres/    # Request handlers (auth, property, chat, admin...)
│   │   ├── middlewares/     # JWT auth, role check, file upload
│   │   ├── models/          # User, Property, Inquiry, Wishlist, Chat, Contact
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # ApiError, ApiResponse, email sender
│   │   └── server.js        # Express + Socket.IO entry point
│   └── test/
└── frontend/
    └── src/
        ├── components/      # Navbar, layouts, sidebars, property card
        ├── context/         # Auth and chat context
        └── pages/           # auth, buyer, Seller, admin and shared pages
```

## ⚡ Getting started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)
- Free accounts for [Cloudinary](https://cloudinary.com) and [Brevo](https://www.brevo.com)

### 1. Clone

```bash
git clone https://github.com/Raushan23raj/RealEstate-Platform.git
cd RealEstate-Platform
```

### 2. Install

```bash
cd backend
npm install
```

This also installs the frontend dependencies and builds the frontend (`postinstall` script).

### 3. Configure environment

Create `backend/.env`:

```env
# Database (defaults to mongodb://127.0.0.1:27017/realstate)
MONGODB_URI=mongodb://127.0.0.1:27017/realstate

# Auth
JWT_SECRET=your_long_random_secret

# Cloudinary (property and profile images)
CLOUD_NAME=your_cloud_name
CLOUD_KEY=your_api_key
CLOUD_SECRET=your_api_secret

# Brevo (verification and reset emails)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=you@example.com

# Optional
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Run

```bash
# Backend (serves the API and the built frontend on http://localhost:5000)
cd backend
npm start
```

For frontend development with hot reload, run it separately:

```bash
cd frontend
npm run dev        # http://localhost:5173
```

The frontend talks to `http://localhost:5000` by default. Set `VITE_API_URL` to point it at a different backend.

## 🔌 API overview

| Base route | Purpose | Access |
|---|---|---|
| `/api/auth` | Register, login, verify email, forgot / reset password, current user | Public / logged in |
| `/api/user` | View and update profile, public seller profile | Logged in |
| `/api/property` | List, view, add, edit, delete, update status, counts | Public to read, seller to write |
| `/api/inquiry` | Send inquiry, seller inbox, mark as read | Buyer / seller |
| `/api/wishlist` | Add, list, remove saved properties | Logged in |
| `/api/chat` | Create chat, send message, list and delete chats | Logged in |
| `/api/contact` | Submit contact form, list messages | Public / admin |
| `/api/admin` | Users, properties, inquiries, seller approval, stats | Admin only |

## 🚢 Deployment

The project is set up for a single [Render](https://render.com) web service:

- **Build command:** `cd backend && npm install` (also builds the frontend)
- **Start command:** `cd backend && npm start`
- Add the environment variables above in the Render dashboard.

If you host the frontend separately, set `VITE_API_URL` to your backend URL at build time.

## 🗺️ Ideas for next steps

- [ ] Property search filters and map view
- [ ] Payment or booking flow
- [ ] Automated tests for the API
- [ ] Email notifications for new inquiries and messages

## 👤 Author

**Raushan Raj**, B.Tech CSE at BIT Mesra
GitHub: [@Raushan23raj](https://github.com/Raushan23raj)

---

<div align="center">⭐ If you found this useful, consider starring the repo!</div>
