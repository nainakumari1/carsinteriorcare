# Cars Interior Care – Node.js website

No dependencies. Needs Node 18+.

## Run locally
    npm start        # http://localhost:3000

## Settings (edit `config.json`, or set environment variables on Render)
| config.json        | Env var              | Purpose |
|--------------------|----------------------|---------|
| `address`          | `BUSINESS_ADDRESS`   | Shown on the Contact page map as "Our base" |
| `phoneDisplay/Tel` | `PHONE_DISPLAY`, `PHONE_TEL` | Phone number shown + number the booking text message goes to |
| `googleMapsApiKey` | `GOOGLE_MAPS_API_KEY`| Optional. Without it, a keyless Google Maps embed is used |

## Booking
When the customer finishes the form, their messaging app opens with the full request pre-written, addressed to the number above. They press Send. (On desktop, a "Copy message" button is shown.)

## Deploy on Render
Push this folder to GitHub → Render: New → Web Service → pick repo.
Build command `npm install`, start command `npm start` (or use the included `render.yaml`).

## Logo
`public/images/logo.jpg` (your supplied logo, unmodified).
