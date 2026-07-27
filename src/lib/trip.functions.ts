import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const TripInput = z.object({
  source: z.string().min(1).max(120),
  destination: z.string().min(1).max(120),
  budget: z.number().min(0).max(10_000_000),
  currency: z.string().min(1).max(6),
  members: z.number().min(1).max(50),
  vehicle: z.string().min(1).max(20),
  days: z.number().min(1).max(30),
  occasion: z.string().min(1).max(40),
  hotel: z.string().max(20).optional().nullable(),
  food: z.string().max(20).optional().nullable(),
  weather: z.string().max(20).optional().nullable(),
  interests: z.array(z.string()).max(20).optional().nullable(),
  startDate: z.string().max(40).optional().nullable(),
  endDate: z.string().max(40).optional().nullable(),
});

export type TripInputType = z.infer<typeof TripInput>;

export type DayPlan = {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
};

export type BudgetItem = { category: string; amount: number };

export type TripPlan = {
  destination: string;
  route: string;
  distance: string;
  travelTime: string;
  bestSeason: string;
  weather: string;
  difficulty: string;
  overview: string;
  days: DayPlan[];
  budget: BudgetItem[];
  totalCost: number;
  hotels: { name: string; area: string; price: string; rating: number; notes: string }[];
  restaurants: { name: string; cuisine: string; avgCost: string; notes: string }[];
  attractions: { name: string; description: string; bestTime: string; entryFee: string }[];
  packing: string[];
  safetyTips: string[];
  emergency: { label: string; value: string }[];
};

const SYSTEM = `You are Wanderly, an expert AI travel planner. Given trip details, produce a rich, realistic, personalized plan.
Return ONLY valid JSON matching the requested schema — no prose, no markdown fences. Estimate numbers reasonably based on the destination and budget. Currency stays as provided.`;

function buildPrompt(input: TripInputType) {
  return `Plan a trip with these details:
- From: ${input.source}
- To: ${input.destination}
- Days: ${input.days}
- Members: ${input.members}
- Budget: ${input.budget} ${input.currency}
- Vehicle: ${input.vehicle}
- Occasion: ${input.occasion}
- Hotel preference: ${input.hotel ?? "any"}
- Food preference: ${input.food ?? "any"}
- Weather preference: ${input.weather ?? "any"}
- Interests: ${(input.interests ?? []).join(", ") || "general sightseeing"}
- Dates: ${input.startDate ?? "flexible"} to ${input.endDate ?? "flexible"}

Return JSON with EXACTLY this shape:
{
  "destination": string,
  "route": string (e.g. "Delhi → Manali via NH44"),
  "distance": string (e.g. "540 km"),
  "travelTime": string (e.g. "12h by car"),
  "bestSeason": string,
  "weather": string (short summary),
  "difficulty": "Easy" | "Moderate" | "Challenging",
  "overview": string (2-3 sentences),
  "days": [
    { "day": number, "title": string, "morning": string, "afternoon": string, "evening": string, "night": string }
  ] (exactly ${input.days} entries),
  "budget": [
    { "category": "Transport"|"Hotel"|"Food"|"Activities"|"Shopping"|"Emergency"|"Misc", "amount": number }
  ],
  "totalCost": number (sum of budget in ${input.currency}),
  "hotels": [ { "name": string, "area": string, "price": string, "rating": number (1-5), "notes": string } ] (3-4 items),
  "restaurants": [ { "name": string, "cuisine": string, "avgCost": string, "notes": string } ] (3-4 items),
  "attractions": [ { "name": string, "description": string, "bestTime": string, "entryFee": string } ] (4-6 items),
  "packing": string[] (8-12 items),
  "safetyTips": string[] (4-6 items),
  "emergency": [ { "label": string, "value": string } ] (3-4 items like police, ambulance, tourist helpline)
}`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(trimmed.slice(first, last + 1));
    }
    throw new Error("AI returned invalid JSON");
  }
}

export const generateTripPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TripInput.parse(input))
  .handler(async ({ data }): Promise<TripPlan> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3.6-flash");

    const { text } = await generateText({
      model,
      system: SYSTEM,
      prompt: buildPrompt(data),
    });

    return extractJson(text) as TripPlan;
  });