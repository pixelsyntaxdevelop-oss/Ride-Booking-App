# Pixel Ride — Premium Taxi Booking Showcase

Developed by **Pixel Syntax** for prospective software development clients.

Pixel Ride is an interactive, mobile-first Progressive Web Application (PWA) demonstrating the complete end-to-end user journey of a modern on-demand ride-hailing and chauffeur dispatching service in Dubai and the United Arab Emirates.

---

## 🌟 Key Highlights & Capabilities

- **15 Fully Connected Screens**: Complete passenger flow from animated Splash, Onboarding, Guest Entry, Interactive Map Dashboard, Pickup/Dropoff selection, Vehicle Tiering, Transparent Fare Breakdown, Driver Radar Search, Assignment, Arrival, Live In-Trip Telemetry, Itemized Digital Receipt, Ride History, and Guest Profile & Settings.
- **Simulated Vector Map Engine**: Built with pure vector SVG/CSS rendering the Dubai coastal metro area (Persian Gulf coastline, Palm Jumeirah, Dubai Canal, Sheikh Zayed Road E11, Al Khail Road E44, and key districts). Features interactive pickup & destination pins, animated polyline routes, smooth Bezier vehicle interpolation with tangent heading angles, and ambient city taxis—**100% free of paid Google Maps APIs or external map tiles**.
- **Transparent AED Fare Engine**: Dynamic distance and duration calculation calibrated to realistic UAE road distances. Itemized breakdown featuring Base Fare, per-kilometer rates, Dubai Salik automated toll gate fees, technology fees, and promo code discounts.
- **Interactive Driver Dispatching & Chat**: Dynamic chauffeur assignment (Rashid, Tariq, or Jean-Luc depending on vehicle tier), live trip telemetry (speed, remaining km, ETA), simulated hazard lights upon arrival, and a real-time interactive driver message drawer.
- **PWA & Offline Support**: Configured via `vite-plugin-pwa` with Web App Manifest, 192x192 & 512x512 icons, maskable icons, apple-touch-icon, service worker precaching, in-app install buttons, iOS installation guide modal, and online/offline status detection.
- **Local Persistence & Zero External Backend**: State, user profile, active trip progress, and completed ride receipts persist across page refreshes via `localStorage`.

---

## 📱 The 15 Connected Screens

1. **Splash Screen**: Brand emblem with glowing pulse, Pixel Syntax developer credits, quick demo access, and PWA installation badge.
2. **Onboarding**: 3 interactive slides highlighting luxury fleet, dynamic simulated routing, and transparent AED pricing.
3. **Guest Demo Entry**: Instant persona presets (Business Executive Alex, Tourist Sophia, Resident Omar) or custom name/phone.
4. **Home Dashboard & Map**: Ambient Dubai vector map, current pickup chip, "Where to?" quick search, saved places (Home/Work), and active ride resume card.
5. **Pickup Location**: Dubai landmark selection with category filters (Landmarks, Airports, Business, Leisure) and current GPS pin simulation.
6. **Destination Selection**: Rich UAE destinations with real-time distance and ETA previews relative to pickup. Prevents identical pickup and destination selections with validation.
7. **Vehicle Selection**: Standard (Tesla Model 3 / Lexus ES), Comfort (BMW 5-Series / Audi A6), and XL (Mercedes-Benz V-Class / Escalade) with passenger/luggage capacities, perks, and dynamic AED fares.
8. **Fare Estimate & Confirmation**: Itemized fare calculation, promo code verification (`PIXELSYNTAX`, `WELCOME20`, `DXBVIP`), payment method selection (Demo Card, Cash, Pixel Wallet), and Add Demo Card modal.
9. **Searching for Driver**: Radar sweep ring animation, live timer, ride summary, and "Advance Demo" button.
10. **Driver Assigned**: Chauffeur profile, verified badge, 4.97★ rating, license plate (`DXB - R 48291`), and direct chat/call actions.
11. **Driver Arriving**: Moving car approach on vector map, countdown timer, hazard light pulse, and quick message shortcuts ("I'm at the lobby").
12. **Trip in Progress**: Live car traversal along Sheikh Zayed Road, speed telemetry (78 km/h), remaining distance, progress bar (0-100%), and safety share trip link.
13. **Trip Completed & Receipt**: Destination celebration, official digital invoice with unique Ride ID (`PX-XXXXX`), 5-star rating, compliment tags, and driver tip selector.
14. **Ride History & Details**: Chronological trip log stored in `localStorage`, filtered by All / Completed / Cancelled, with full itemized receipt viewer.
15. **Profile, Settings & Help**: Passenger profile editor, Demo Wallet with `+AED 100` top-up, Web Audio sound effects toggle, FAQ accordion, 24/7 support desk simulation, and confirmed Reset Demo Data action.

---

## 🚀 Setup & Build Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Development
```bash
npm install
npm run dev
```
The development server will launch at `http://localhost:3000`.

### Production Build (Cloudflare Pages / Vercel / Netlify compatible)
```bash
npm run build
```
The production bundle will be generated in `/dist`. To preview the production build locally:
```bash
npm run preview
```

---

## 🧪 Testing & Showcase Guidance

### Fast Step Advancement
- When any ride is active (Searching, Assigned, Arriving, In Progress, Completed), tap the floating **"Advance Demo"** button in the top right or bottom dock to instantly progress to the next trip stage.
- Toggle the **Play / Pause** button next to it to enable or pause automated realistic progression timers.
- Click **"Demo Screens"** in the control bar to open a quick-jump drawer and navigate directly to any of the 15 screens.

### Sample Promo Codes
- `PIXELSYNTAX`: 20% off courtesy of the Pixel Syntax showcase.
- `WELCOME20`: 15% welcome discount.
- `DXBVIP`: 25% VIP credit for premium testing.

### Demo Limitations
- **No Real Payments**: All cards, wallets, and cash settlements are local sandbox simulations.
- **No Paid APIs**: Map routing is rendered with custom SVG coordinate curves without external Google Maps or tile billing.
- **Local Storage**: All history and settings reside in the browser's `localStorage` and can be reset at any time via **Profile → Reset Demo**.

---

## 🏢 Credits

Crafted by **Pixel Syntax**  
Demonstration Progressive Web Application for Taxi & Transportation Systems.
