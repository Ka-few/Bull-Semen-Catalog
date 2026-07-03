# Bull Semen Catalog & AI Logistics Platform

A comprehensive digital platform connecting dairy farmers with top-tier genetics, certified veterinary professionals, and agricultural semen suppliers.

## Live Links
- **Live Demo (Frontend):** [https://digital-bull-catalog-amber.vercel.app/](https://digital-bull-catalog-amber.vercel.app/)
- **Backend API:** [https://digital-bull-cataloge.onrender.com](https://digital-bull-cataloge.onrender.com)
- **GitHub Repository:** [https://github.com/Ka-few/Bull-Semen-Catalog](https://github.com/Ka-few/Bull-Semen-Catalog)

## Description
This application allows farmers to browse a catalog of high-quality bull semen, place orders, and coordinate artificial insemination (AI) services. It handles the entire logistics pipeline:
1. **Farmers** can browse semen based on traits, yield data, and lineage, then place orders which require selecting a nearby certified vet and a local semen supplier.
2. **Vets** have a dedicated dashboard to manage their profiles, set their service radius and fees, and track the status of AI orders assigned to them (from allocation, to fetching the semen, to completing the insemination).
3. **Agri-Suppliers** manage their own localized inventory of semen, allowing them to stock specific bulls and manage quantities.
4. **Admins** maintain the global catalog of bulls.

## Key Features
- **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for Farmers, Vets, Agri-Suppliers, and Admins.
- **Geospatial Logistics:** Integrates Leaflet maps to allow farmers to visually pinpoint delivery locations, and matches them with nearby vets and suppliers based on coordinates and distance algorithms.
- **Inventory Management:** Suppliers maintain their own localized stock, which updates dynamically.
- **Order Tracking:** Full end-to-end status tracking (`pending`, `allocated`, `fetched_by_vet`, `completed`).

## Technologies Used
- **Frontend:** React, TypeScript, Vite, TailwindCSS, Lucide React, Leaflet (React-Leaflet)
- **Backend:** Node.js, Express.js
- **Database:** SQLite3

## Instructions for Local Development

### Prerequisites
- Node.js installed on your machine.

### Setup and Running
You will need to run both the frontend and backend servers simultaneously.

**1. Backend Setup:**
```bash
cd backend
npm install
npm run dev
```
The backend server will start on `http://localhost:5000`. The SQLite database will automatically initialize.

**2. Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server will start on `http://localhost:5173`.

### Login Credentials
For testing purposes, the following default credentials can be used:
- **Admin:** Username: `admin` | Password: `admin123`

You can register new accounts for Farmers, Vets, and Agri-Suppliers directly through the `/register` page.

## License
MIT License
