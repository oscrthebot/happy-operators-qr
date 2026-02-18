# Happy Operators QR Code Manager

QR Code generator with analytics tracking for Happy Operators.

## Features

- 📱 Generate QR codes with custom names
- 💾 Save and organize QR codes
- 📊 Track clicks with daily analytics
- 📈 Beautiful graphs (day/week/month views)
- 🔗 Short URLs for tracking (qr.happyoperators.com/xyz)
- 🎨 Clean, branded interface

## Tech Stack

- **Framework:** Next.js 15
- **Database:** Vercel Postgres
- **QR Generation:** node-qrcode
- **Charts:** Recharts
- **Styling:** TailwindCSS
- **Deploy:** Vercel

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up database (Vercel Postgres):
```bash
vercel link
vercel env pull .env.local
```

3. Run locally:
```bash
npm run dev
```

4. Deploy:
```bash
vercel --prod
```

## Database Schema

### `qr_codes` table:
- id (serial)
- short_id (text, unique) - for URL shortening
- name (text) - user-provided name
- target_url (text) - destination URL
- qr_image_url (text) - stored QR code image
- created_at (timestamp)

### `qr_clicks` table:
- id (serial)
- qr_id (int, foreign key)
- clicked_at (timestamp)
- user_agent (text)
- ip_address (text, hashed for privacy)

## Analytics

- Click counts per QR code
- Daily/weekly/monthly graphs
- Export data as CSV

## License

MIT - Built for Happy Operators
