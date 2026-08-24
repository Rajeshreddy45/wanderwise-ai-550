import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  Compass,
  Loader2,
  MapPin,
  Sparkles,
  Wallet,
  Hotel,
  Utensils,
  Camera,
  ShieldAlert,
  Backpack,
  Sun,
  Clock,
  Route as RouteIcon,
  Download,
  Share2,
} from "lucide-react";

import { generateTripPlan, type TripInputType, type TripPlan } from "@/lib/trip.functions";
import { DayWeatherChip, WeatherSection } from "@/components/WeatherSection";

type Search = { destination?: string };

export const Route = createFileRoute("/plan")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    destination: typeof s.destination === "string" ? s.destination : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Plan your trip — Wanderly" },
      { name: "description", content: "Enter your trip details and get an AI-generated itinerary with budget, hotels and more." },
      { property: "og:title", content: "Plan your trip — Wanderly" },
      { property: "og:description", content: "Generate a personalized AI travel plan in seconds." },
    ],
  }),
  component: PlanPage,
});

const VEHICLES = ["Car", "Bike", "Bus", "Train", "Flight"] as const;
const OCCASIONS = ["Family Trip", "Honeymoon", "Friends Trip", "Solo Trip", "Adventure", "Pilgrimage", "Business", "Vacation"] as const;
const HOTELS = ["Budget", "Standard", "Luxury"] as const;
const FOODS = ["Veg", "Non-Veg", "Both"] as const;
const WEATHERS = ["Cold", "Pleasant", "Hot"] as const;
const INTERESTS = ["Nature", "Historical", "Temples", "Beaches", "Waterfalls", "Adventure", "Wildlife", "Shopping", "Museums", "Nightlife"] as const;
const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "AED"] as const;

function PlanPage() {
  const search = Route.useSearch();
  const runGenerate = useServerFn(generateTripPlan);

  const [form, setForm] = useState<TripInputType>({
    source: "",
    destination: search.destination ?? "",
    budget: 1500,
    currency: "USD",
    members: 2,
    vehicle: "Flight",
    days: 5,
    occasion: "Vacation",
    hotel: "Standard",
    food: "Both",
    weather: "Pleasant",
    interests: ["Nature", "Historical"],
    startDate: "",
    endDate: "",
  });
  const [interests, setInterests] = useState<string[]>(["Nature", "Historical"]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof TripInputType>(k: K, v: TripInputType[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleInterest = (i: string) => {
    setInterests((prev) => {
      const next = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
      set("interests", next);
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setPlan(null);
    try {
      const result = await runGenerate({ data: { ...form, interests } });
      setPlan(result);
      setStatus("done");
      setTimeout(() => document.getElementById("plan-result")?.scrollIntoView({ behavior: "smooth" }), 60);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-hero text-white">
              <Compass className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold">Wanderly</span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
          <form onSubmit={onSubmit} className="glass sticky top-6 h-fit rounded-3xl p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Trip details</p>
            <h1 className="mt-1 font-display text-3xl font-bold">Where to next?</h1>

            <div className="mt-6 space-y-4">
              <Field label="From" icon={<MapPin className="h-4 w-4" />}>
                <input required value={form.source} onChange={(e) => set("source", e.target.value)} placeholder="e.g. Mumbai" className={inputCls} />
              </Field>
              <Field label="Destination" icon={<MapPin className="h-4 w-4 text-accent" />}>
                <input required value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Bali, Indonesia" className={inputCls} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Days">
                  <input type="number" min={1} max={30} required value={form.days} onChange={(e) => set("days", Number(e.target.value))} className={inputCls} />
                </Field>
                <Field label="Members">
                  <input type="number" min={1} max={50} required value={form.members} onChange={(e) => set("members", Number(e.target.value))} className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-[1fr_100px] gap-3">
                <Field label="Budget">
                  <input type="number" min={0} required value={form.budget} onChange={(e) => set("budget", Number(e.target.value))} className={inputCls} />
                </Field>
                <Field label="Currency">
                  <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className={inputCls}>
                    {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Vehicle">
                <select value={form.vehicle} onChange={(e) => set("vehicle", e.target.value)} className={inputCls}>
                  {VEHICLES.map((v) => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Occasion">
                <select value={form.occasion} onChange={(e) => set("occasion", e.target.value)} className={inputCls}>
                  {OCCASIONS.map((v) => <option key={v}>{v}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Hotel">
                  <select value={form.hotel ?? ""} onChange={(e) => set("hotel", e.target.value)} className={inputCls}>
                    {HOTELS.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Food">
                  <select value={form.food ?? ""} onChange={(e) => set("food", e.target.value)} className={inputCls}>
                    {FOODS.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Weather">
                  <select value={form.weather ?? ""} onChange={(e) => set("weather", e.target.value)} className={inputCls}>
                    {WEATHERS.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date">
                  <input type="date" value={form.startDate ?? ""} onChange={(e) => set("startDate", e.target.value)} className={inputCls} />
                </Field>
                <Field label="End date">
                  <input type="date" value={form.endDate ?? ""} onChange={(e) => set("endDate", e.target.value)} className={inputCls} />
                </Field>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interests</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INTERESTS.map((i) => {
                    const active = interests.includes(i);
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => toggleInterest(i)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          active
                            ? "border-transparent gradient-hero text-white shadow-glow"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-hero px-6 py-3.5 text-base font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Crafting your trip…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" /> Generate trip
                </>
              )}
            </button>
            {error && (
              <p className="mt-3 text-sm text-destructive">{error}</p>
            )}
          </form>

          <div id="plan-result">
            {status === "idle" && <EmptyState />}
            {status === "loading" && <LoadingState />}
            {status === "done" && plan && <PlanView plan={plan} currency={form.currency} />}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "mt-1 w-full rounded-xl border border-border bg-background/70 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </span>
      {children}
    </label>
  );
}

function EmptyState() {
  return (
    <div className="glass grid h-full min-h-[500px] place-items-center rounded-3xl p-10 text-center shadow-card">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-hero text-white shadow-glow">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-bold">Your AI itinerary appears here</h2>
        <p className="mt-3 max-w-md text-muted-foreground">
          Fill in your trip details and hit <span className="font-semibold text-foreground">Generate trip</span>. Wanderly designs the days, budget, hotels, food picks and safety essentials for you.
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="glass grid h-full min-h-[500px] place-items-center rounded-3xl p-10 text-center shadow-card">
      <div>
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
        <h2 className="mt-6 font-display text-3xl font-bold">Charting your route…</h2>
        <p className="mt-3 text-muted-foreground">Picking hotels, plotting the days, running the numbers.</p>
        <div className="mt-8 space-y-3">
          {[70, 55, 82, 40].map((w, i) => (
            <div key={i} className="mx-auto h-3 max-w-md animate-pulse rounded-full bg-muted" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanView({ plan, currency }: { plan: TripPlan; currency: string }) {
  const total = plan.totalCost ?? plan.budget.reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const max = useMemo(() => Math.max(...plan.budget.map((b) => Number(b.amount) || 0), 1), [plan.budget]);

  const copyItinerary = async () => {
    const text = plan.days
      .map((d) => `Day ${d.day} — ${d.title}\n  AM: ${d.morning}\n  PM: ${d.afternoon}\n  Evening: ${d.evening}\n  Night: ${d.night}`)
      .join("\n\n");
    await navigator.clipboard.writeText(`${plan.destination}\n\n${text}`);
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <section className="rounded-3xl gradient-hero p-1 shadow-glow">
        <div className="rounded-[calc(1.5rem-4px)] bg-background p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Your trip</p>
              <h2 className="mt-1 font-display text-4xl font-bold">{plan.destination}</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{plan.overview}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={copyItinerary} className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium hover:bg-card">
                <Share2 className="h-4 w-4" /> Copy
              </button>
              <button onClick={() => window.print()} className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium hover:bg-card">
                <Download className="h-4 w-4" /> Print
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={RouteIcon} label="Route" value={plan.route} />
            <Stat icon={MapPin} label="Distance" value={plan.distance} />
            <Stat icon={Clock} label="Travel time" value={plan.travelTime} />
            <Stat icon={Sun} label="Best season" value={plan.bestSeason} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat icon={Sun} label="Weather" value={plan.weather} />
            <Stat icon={ShieldAlert} label="Difficulty" value={plan.difficulty} />
            <Stat icon={Wallet} label="Total" value={`${currency} ${total.toLocaleString()}`} highlight />
          </div>
        </div>
      </section>

      {/* Days */}
      <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
        <h3 className="font-display text-2xl font-bold">Day-by-day itinerary</h3>
        <div className="mt-6 space-y-4">
          {plan.days.map((d) => (
            <div key={d.day} className="rounded-2xl border border-border bg-background p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-display text-xl font-bold">
                  <span className="text-primary">Day {d.day}</span> · {d.title}
                </h4>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Slot label="Morning" text={d.morning} />
                <Slot label="Afternoon" text={d.afternoon} />
                <Slot label="Evening" text={d.evening} />
                <Slot label="Night" text={d.night} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Budget */}
      <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-2xl font-bold">Budget breakdown</h3>
          <span className="font-semibold text-primary">{currency} {total.toLocaleString()}</span>
        </div>
        <div className="mt-6 space-y-3">
          {plan.budget.map((b) => (
            <div key={b.category}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{b.category}</span>
                <span className="text-muted-foreground">{currency} {Number(b.amount).toLocaleString()}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full gradient-hero" style={{ width: `${(Number(b.amount) / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hotels & Restaurants */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Where to stay" icon={Hotel}>
          <ul className="space-y-3">
            {plan.hotels.map((h) => (
              <li key={h.name} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h5 className="font-semibold">{h.name}</h5>
                  <span className="text-sm text-primary">{h.price}</span>
                </div>
                <p className="text-xs text-muted-foreground">{h.area} · ★ {h.rating}</p>
                <p className="mt-2 text-sm text-muted-foreground">{h.notes}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Where to eat" icon={Utensils}>
          <ul className="space-y-3">
            {plan.restaurants.map((r) => (
              <li key={r.name} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h5 className="font-semibold">{r.name}</h5>
                  <span className="text-sm text-primary">{r.avgCost}</span>
                </div>
                <p className="text-xs text-muted-foreground">{r.cuisine}</p>
                <p className="mt-2 text-sm text-muted-foreground">{r.notes}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Attractions */}
      <Panel title="Must-see attractions" icon={Camera}>
        <div className="grid gap-3 sm:grid-cols-2">
          {plan.attractions.map((a) => (
            <div key={a.name} className="rounded-2xl border border-border bg-background p-4">
              <h5 className="font-semibold">{a.name}</h5>
              <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-secondary px-2.5 py-1">Best: {a.bestTime}</span>
                <span className="rounded-full bg-secondary px-2.5 py-1">Entry: {a.entryFee}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Packing & Safety */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Packing checklist" icon={Backpack}>
          <div className="flex flex-wrap gap-2">
            {plan.packing.map((p) => (
              <span key={p} className="rounded-full border border-border bg-background px-3 py-1.5 text-sm">
                {p}
              </span>
            ))}
          </div>
        </Panel>
        <Panel title="Safety & essentials" icon={ShieldAlert}>
          <ul className="mb-4 space-y-2 text-sm">
            {plan.safetyTips.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-2 sm:grid-cols-2">
            {plan.emergency.map((e) => (
              <div key={e.label} className="rounded-xl bg-secondary/60 p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{e.label}</p>
                <p className="font-semibold">{e.value}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, highlight }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border p-4 ${highlight ? "gradient-hero text-white" : "bg-card"}`}>
      <div className="flex items-center gap-1.5 text-xs opacity-80">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className={`mt-1 font-semibold ${highlight ? "text-lg" : "text-sm"}`}>{value}</p>
    </div>
  );
}

function Slot({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl bg-secondary/50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">{label}</p>
      <p className="mt-1 text-sm text-foreground">{text}</p>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-white">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-display text-2xl font-bold">{title}</h3>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}