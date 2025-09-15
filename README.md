# route-optimization-delivery
A web app implementing Dijkstra, Bellman-Ford, and TSP algorithms for route optimization in delivery services.

**Features**
- Interactive map interface using Leaflet
- Select and visualize multiple delivery locations
- Optimize delivery route using:
  - Dijkstra’s Algorithm
  - Nearest Neighbor (TSP)
- Display route information: total distance, estimated time, and fuel cost
- Start and end locations clearly marked
- Real-time route rendering with direction arrows

**Technology used**
Next.js – for building the frontend using React
TypeScript – for type-safe and maintainable code
Leaflet.js – for rendering interactive maps
OpenStreetMap – as the map tile provider for Leaflet
Tailwind CSS – for responsive and utility-first styling
Shadcn UI – for ready-to-use UI components
Google Maps API – to fetch real-world distances and routes using the Distance Matrix and Geocoding services

**Folder Structure**

├── app/              → Next.js pages and layout

├── components/       → Reusable UI components (e.g., Map)

├── lib/              → API logic (Google integration, utilities)

├── styles/           → Global CSS and Tailwind configurations

├── types/            → TypeScript interfaces and types

├── public/           → Static files (optional images or icons)

├── .env.local        → Environment variables (not committed)

├── package.json      → Project dependencies and metadata

