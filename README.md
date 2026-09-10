# 🌍 Wanderly — AI Tourist Planner

**Wanderly** is an AI-powered travel planning application that creates personalized trip itineraries based on your destination, budget, travel duration, group size, interests, travel preferences, and more.

Instead of manually searching for destinations, hotels, restaurants, activities, weather information, and safety tips, Wanderly brings everything together into one personalized travel plan.

## ✨ Features

* 🤖 **AI-Powered Trip Planning** — Generate personalized travel itineraries using AI.
* 🗓️ **Day-by-Day Itinerary** — Get structured morning, afternoon, evening, and night plans.
* 💰 **Smart Budget Breakdown** — Estimate expenses for transportation, hotels, food, activities, shopping, and more.
* 🏨 **Hotel Recommendations** — Get accommodation suggestions based on your preferred budget.
* 🍴 **Restaurant Recommendations** — Discover food options based on your preferences.
* 📍 **Attractions & Activities** — Explore recommended places and activities at your destination.
* 🌦️ **Weather Information** — View weather summaries and daily weather information.
* 🎒 **Packing Suggestions** — Get a destination-oriented packing checklist.
* 🛡️ **Safety Information** — Includes safety tips and emergency information.
* 🎯 **Personalized Interests** — Choose interests such as nature, historical places, temples, beaches, adventure, wildlife, shopping, museums, and nightlife.

## 🛠️ Tech Stack

* **Frontend:** React + TypeScript
* **Routing:** TanStack Router
* **Styling:** Tailwind CSS
* **UI Components:** Radix UI
* **Icons:** Lucide React
* **Charts:** Recharts
* **AI:** Google Gemini through the Lovable AI Gateway
* **AI SDK:** Vercel AI SDK
* **Validation:** Zod
* **Build Tool:** Vite

## ⚙️ How It Works

```text
User enters trip details
        ↓
React frontend collects the information
        ↓
Server function validates the input
        ↓
AI gateway sends the request to Gemini
        ↓
AI generates a structured travel plan
        ↓
Wanderly displays the personalized itinerary
```

## 📋 Trip Inputs

Wanderly allows users to specify:

* Starting location
* Destination
* Number of days
* Number of travelers
* Budget
* Currency
* Vehicle
* Trip occasion
* Hotel preference
* Food preference
* Weather preference
* Travel interests
* Start and end dates

## 📦 Generated Results

The AI-generated plan can include:

* Destination overview
* Travel route
* Distance
* Travel time
* Best season
* Weather summary
* Daily itinerary
* Budget breakdown
* Hotels
* Restaurants
* Attractions
* Packing checklist
* Safety tips
* Emergency information
* Daily weather
* Monthly climate information

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/wanderly-ai-travel-planner.git
cd wanderly-ai-travel-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
LOVABLE_API_KEY=your_api_key_here
```

**Never commit your actual API key to GitHub.**

### 4. Start the development server

```bash
npm run dev
```

The application will be available on the local development server shown by Vite.

## 🏗️ Project Structure

```text
src/
├── components/
├── lib/
│   ├── ai-gateway.server.ts
│   └── trip.functions.ts
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   └── plan.tsx
├── assets/
└── styles.css

public/
```

## 🔑 AI Integration

Wanderly uses a server-side AI gateway to generate travel plans. The application validates trip information before sending it to the AI model and requests a structured JSON response containing the itinerary, budget, hotels, restaurants, attractions, weather, packing suggestions, and safety information.

## 🎯 Project Goal

The goal of Wanderly is to simplify travel planning by combining **AI-powered personalization, itinerary generation, budget planning, recommendations, weather information, and travel essentials** into a single application.

## 👨‍💻 Author

**Rajesh Kumar Reddy**

Built as an AI-powered travel planning project to explore modern web development and AI integration.

---

⭐ If you find this project useful, consider giving the repository a star!
