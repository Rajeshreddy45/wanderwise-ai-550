# Weather Forecast Section

Add a dedicated weather panel to the generated trip plan, so travellers see day-by-day conditions and how the season compares.

## What the user sees

On the plan results page, a new "Weather & Season" section between the trip overview stats and the day-wise itinerary:

- Four summary tiles: average temperature, humidity, rain probability, wind speed.
- A best-season summary card: recommended months, what the weather is like then, and a short note on why the chosen dates are good/risky.
- Two charts (recharts, already installed):
  - Daily forecast line/area chart: high and low temperature per trip day, with rain probability as a secondary line.
  - Season comparison bar chart: average temperature across the 12 months, with the trip months highlighted.
- Each trip day also gets a compact weather chip (icon, temp range, rain %) in its itinerary card.

## Where the data comes from

The AI plan generation is extended to also return weather data — no new external API. The model estimates realistic climate values for the destination and dates.

## Technical notes

- `src/lib/trip.functions.ts`: extend the `TripPlan` type and the JSON schema in `buildPrompt` with:
  - `weatherSummary: { avgTempC, avgHumidity, rainChance, windKph, bestSeason, bestMonths, seasonNote, condition }`
  - `dailyWeather: [{ day, condition, highC, lowC, rainChance, humidity, windKph }]` (one per trip day)
  - `monthlyClimate: [{ month, avgTempC, rainMm }]` (12 entries)
  - Keep fields optional in the type so older/partial AI responses still render.
- New component `src/components/WeatherSection.tsx` rendering the tiles, best-season card, and both recharts charts using existing design tokens (no hardcoded colors).
- `src/routes/plan.tsx`: render `<WeatherSection />` in `PlanView` when weather data exists; add the per-day weather chip to the day cards.
- Charts wrapped in `ResponsiveContainer` and stacked on mobile.
