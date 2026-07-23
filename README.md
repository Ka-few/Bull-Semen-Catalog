# Bull Semen Catalog & AI Logistics Platform

A full-stack digital marketplace for dairy farmers to discover premium bull semen, connect with certified veterinarians, and order logistics services from agricultural suppliers.

## Live Links
- **Live Demo (Frontend):** https://digital-bull-catalog-amber.vercel.app/
- **Backend API:** https://bull-catalog.onrender.com/
- **GitHub Repository:** https://github.com/Ka-few/Bull-Semen-Catalog

## Project Overview
This platform supports the full AI (artificial insemination) logistics workflow for dairy operations:
- Farmers can browse bulls, review traits and pedigree, and place semen orders.
- Vets can manage availability, service radius, and order assignments for AI work.
- Agri-suppliers can maintain localized inventory and stock levels for semen products.
- Admins can manage the bull catalog, user roles, and application data.
- Default Admin credetials
    username: admin
    password: securepassword

## Key Features
- Role-based dashboards for Farmers, Vets, Agri-Suppliers, and Admins.
- Geospatial mapping and location-based matching for vet and supplier selection.
- Inventory tracking and order status management.
- Secure authentication and protected API routes.

## Technologies Used
- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, React Router, React Leaflet
- Backend: Node.js, Express.js, Supabase client integration
- Database: SQLite (local development)

## Local Development
### Prerequisites
- Node.js installed.

### Run the Backend
```bash
cd backend
npm install
npm run dev
```
The backend runs on `http://localhost:5000`.

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:5173`.

## Notes
- Set `CLIENT_URL` in your backend environment to your deployed frontend origin for production.
- The live demo front end is hosted on Vercel and connects to the Render backend.

## License
MIT License
