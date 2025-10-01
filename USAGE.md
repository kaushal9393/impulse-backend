## API Overview (endpoints)

- POST /api/auth/register  { name, email, password } -> { token }
- POST /api/auth/login     { email, password } -> { token }
- GET  /api/services       -> list services
- POST /api/services       -> create service (admin)
- POST /api/bookings       { services: [serviceId], sampleDate } -> create booking
- GET  /api/bookings       -> list bookings (user: own; admin: all)
- POST /api/payments/create { bookingId } -> create mock payment session
- POST /api/payments/webhook -> webhook from payment provider (secret header)
- POST /api/reports        -> upload report (admin)
- GET  /api/reports        -> list reports

Authentication:
- Add header `Authorization: Bearer <token>` for protected routes.

Notes:
- Replace mock payment endpoints with real provider SDK (Stripe/Razorpay).
- Reports are stored as URLs (S3, Cloud Storage) — implement file upload separately.
