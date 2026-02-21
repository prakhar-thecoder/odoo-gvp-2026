# 🚚 FleetMaster

<div align="center">

A centralized, rule-based digital hub that optimizes the lifecycle of a delivery fleet, monitors driver safety, and tracks financial performance.

[🌐 Live Demo](https://www.google.com/search?q=%23) • [📧 Contact](mailto:shah.leena.287@gmail.com)

</div>

---

## 📸 Preview

<div align="center">
</div>

---

## ✨ Features

* 📊 **Command Center** - High-level "at-a-glance" fleet oversight.


* 🚛 **Vehicle Registry** - Manage fleet inventory, capacities, and current statuses.


* 🗺️ **Trip Dispatcher** - Workflow for moving goods from Point A to Point B with automated validation.


* 🔧 **Maintenance Logs** - Track vehicle repairs and update their fleet status dynamically.


* 🔐 **Secure Access** - Secure access for different user roles.


* 🎨 **Modern SaaS UI** - Clean, responsive design with soft shadows and premium data visualization.

---

## 🎯 Target Users

* **Fleet Managers:** Oversee vehicle health, asset lifecycle, and scheduling.


* **Dispatchers:** Create trips, assign drivers, and validate cargo loads.


* **Safety Officers:** Monitor driver compliance, license expirations, and safety scores.


* **Financial Analysts:** Audit fuel spend, maintenance ROI, and operational costs.



---

## 🚀 Tech Stack

### Frontend

* **React.js (Vite)** - Fast, component-based UI library
* **Tailwind CSS** - Utility-first styling for modern SaaS design
* **React Router** - Client-side routing with Protected Routes
* **Inline SVGs** - Lightweight, pure code icons

### Backend & Database

* **Node.js & Express.js** - RESTful API architecture
* 
**MongoDB & Mongoose** - Relational data structure linking trips and expenses to specific vehicles.


* **JWT Authentication** - Secure login and token management

---

## 📂 Project Structure

```text
fleet-master/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── auth/           # Login & Registration
│   │   ├── dashboard/      # Command Center & KPIs
│   │   ├── maintenance/    # Service Logs & Status updates
│   │   ├── trips/          # Dispatcher & Routing
│   │   ├── vehicles/       # Asset Registry
│   │   ├── Layout.jsx      # Sidebar & Navigation
│   │   └── App.jsx         # Routing & Protected State
│   └── .env                # VITE_API_URL
│
└── server/                 # Express Backend
    ├── src/
    │   ├── config/         # Database Connection
    │   └── modules/        # Isolated Feature Modules
    │       ├── auth/
    │       ├── dashboard/
    │       ├── maintenance/
    │       ├── trips/
    │       └── vehicles/
    ├── index.js            # Server Entry Point
    └── .env                # PORT, MONGO_URI, JWT_SECRET

```

---

## 🛠️ Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/prakhar-thecoder/odoo-gvp-2026.git
cd fleet-master

```


2. **Setup the Backend**
```bash
cd server
npm install
# Create a .env file with PORT=5000, MONGO_URI, and JWT_SECRET
npm run dev

```


3. **Setup the Frontend** (Open a new terminal)
```bash
cd client
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000
npm run dev

```



---

<div align="center">

**⭐ If you like this project, consider giving it a star!**

Made with ❤️ by [The Team](https://github.com/prakhar-thecoder/odoo-gvp-2026.git) for the 8-Hour Hackathon.

</div>

---
