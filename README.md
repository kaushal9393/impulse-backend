# Impulse Pathology Lab — Backend (Next.js + TypeScript)

This is a starter backend scaffold using **Next.js API routes** + **TypeScript** + **Mongoose (MongoDB)** for the Impulse Pathology Lab website.

Features included:
- User authentication (register / login) with JWT
- Service catalog (tests offered)
- Booking system (patients book tests / choose sample date)
- Report upload & retrieval (admin uploads PDF/report URL)
- Basic payments flow (mock endpoint for payment creation + webhook simulation)
- Admin-protected routes for managing services, bookings, reports

## Quick start

1. Copy `.env.example` to `.env.local` and fill values.
2. Install dependencies:
```bash
npm install
```
3. Run dev server:
```bash
npm run dev
```
Server runs on port 3001 by default.

## Notes
- This is a scaffold — you should review & harden validation, error handling, and production settings before deploying.
- Payment integration is mocked. Replace with Stripe/Paytm/Razorpay SDK as needed.
