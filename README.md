# Vibe Commerce Mock Cart

Full-stack shopping cart prototype built for the Vibe Commerce screening assignment. The app showcases core e-commerce flows: browsing a curated product catalogue, managing a shopping cart, and completing a mock checkout that produces a receipt.

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB Atlas (connection string provided by user)

The repository is organised as:

```
Nexora/
├── backend/     # Express API + MongoDB persistence
└── frontend/    # React client (React Router multi-page UI)
```

## Features

- Responsive product grid with at-a-glance details (SKU, price, stock, imagery)
- Multi-page navigation (Shop, Cart, Checkout) driven by React Router
- Cart management with quantity adjustments, line totals, and removal
- Server-side persistence of the active cart using MongoDB
- Checkout form (name & email) that returns a timestamped mock receipt
- Graceful error handling and retry prompts across UI/API interactions
- Seeded catalogue (8 lifestyle items) automatically upserted on server start

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (connection string supplied by stakeholders)

## Backend Setup (`backend/`)

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file (not committed) with:
   ```bash
   MONGODB_URI=your-mongodb-atlas-connection-string
   PORT=5000
   ```
3. Start the API:
   ```bash
   npm run dev
   ```
4. API will be available at `http://localhost:5000`. Health check: `GET /api/health`.

### REST Endpoints

| Method | Path              | Description                           |
| ------ | ----------------- | ------------------------------------- |
| GET    | `/api/products`   | List seeded product catalogue         |
| GET    | `/api/cart`       | Retrieve current cart + totals        |
| POST   | `/api/cart`       | Upsert product quantity in the cart   |
| DELETE | `/api/cart/:id`   | Remove product (by Mongo id or SKU)   |
| POST   | `/api/checkout`   | Generate mock receipt & clear the cart|


## Frontend Setup (`frontend/`)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. (Optional) create `frontend/.env` to override the API base URL:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```
   Defaults to the value above if not provided.
3. Run the app:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:5173` to explore the storefront UI.

## Development Notes

- **Seeding:** The backend upserts default products on every boot, keeping catalogue data fresh without duplicates.
- **Cart Persistence:** A `guest` cart document tracks state across sessions. Quantities are set (not incremented) to simplify adjustments from both product cards and the cart panel.
- **Checkout Flow:** On success, the API responds with a receipt containing a randomised ID, purchased items, totals, and timestamp, then clears the cart.
- **Error Handling:** API helpers normalise error messages, while the UI surfaces problems via alert banners and inline form feedback.
- **Navigation:** The React Router setup keeps cart state shared across Shop, Cart, and Checkout routes.
- **Builds:** `npm run build` is configured for both frontend (Vite build) and backend (direct Node execution).

## Screenshots & Demo
### 📸 Application Screenshots

| Screenshot | Description |
|------------|--------------|
| <img width="1896" alt="Landing View" src="https://github.com/user-attachments/assets/231ace48-3995-4a42-a8a5-873a4c1d07d0" /> | **Landing view** showing the featured products grid. |
| <img width="1913" alt="Cart Page" src="https://github.com/user-attachments/assets/3630b91e-27e0-4986-95bf-7768e0914787" /> | **Cart page** highlighting quantity controls and running total. |
| <img width="1916" alt="Checkout Form" src="https://github.com/user-attachments/assets/7d20f7f7-66d3-4bcd-a4a5-a3d281886549" /> | **Checkout form** with user details prior to submission. |
| <img width="1902" alt="Receipt Modal" src="https://github.com/user-attachments/assets/678d427c-a986-404b-824e-5a5b6c9e74ae" /> | **Receipt confirmation modal** after a successful checkout. |


## Testing Checklist

- [ ] Backend: Verify API routes locally with a REST client (Insomnia/Postman)
- [ ] Frontend: Run through add/update/remove cart flows
- [ ] Checkout: Submit form to confirm receipt modal & cart reset

## Future Enhancements

- Hook up authentication to create per-user carts
- Integrate an external catalogue such as FakeStore API
- Add unit/integration tests (Jest, React Testing Library, Supertest)
- Deploy to a shared GitHub repo with CI (lint/build) workflows

---

Crafted as part of the Vibe Commerce screening exercise. Feel free to reach out for clarifications or improvements.

