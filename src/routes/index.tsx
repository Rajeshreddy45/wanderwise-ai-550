import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  MapPin,
  Sparkles,
  Wallet,
  CalendarDays,
  ShieldCheck,
  Utensils,
  Hotel,
  Star,
  ArrowRight,
} from "lucide-react";

import heroImage from "@/assets/hero-travel.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wanderly — AI Tourist Planner for smarter trips" },
      {
        name: "description",
        content:
          "Tell Wanderly where you're going. Get a full AI itinerary with budget, hotels, food, attractions and safety tips in seconds.",
      },
      { property: "og:title", content: "Wanderly — AI Tourist Planner" },
      {
        property: "og:description",
        content: "AI-crafted travel plans for any destination in the world.",
      },
    ],
  }),
  component: Landing,
});

const destinations = [
  { name: "Bali", country: "Indonesia", tag: "Beach + Culture" },
  { name: "Kyoto", country: "Japan", tag: "Temples + Nature" },
  { name: "Manali", country: "India", tag: "Mountains + Snow" },
  { name: "Santorini", country: "Greece", tag: "Islands + Sunsets" },
  { name: "Dubai", country: "UAE", tag: "Luxury + Adventure" },
  { name: "Reykjavik", country: "Iceland", tag: "Aurora + Fjords" },
];

const features = [
  { icon: Sparkles, title: "AI-crafted itineraries", body: "Day-by-day plans tuned to your budget, pace and interests." },
  { icon: Wallet, title: "Smart budget breakdown", body: "See where every rupee, dollar or euro is going before you go." },
  { icon: Hotel, title: "Hotels & restaurants", body: "Curated stays and local eats that match your vibe and wallet." },
  { icon: ShieldCheck, title: "Safety & essentials", body: "Emergency numbers, packing lists and local tips baked in." },
];

const testimonials = [
  { name: "Priya S.", trip: "Family trip · Kerala", quote: "Planned a 7-day Kerala trip in 40 seconds. The budget was spot-on." },
  { name: "Marcus L.", trip: "Solo · Vietnam", quote: "Wanderly nailed the vibe I wanted — cafés, temples, night markets." },
  { name: "Aisha & Omar", trip: "Honeymoon · Bali", quote: "Every day felt handpicked. The dinner picks alone were worth it." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Destinations />
      <WhyUs />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-3 shadow-card">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-white shadow-glow">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold">Wanderly</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#destinations" className="hover:text-foreground">Destinations</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#reviews" className="hover:text-foreground">Reviews</a>
          </nav>
          <Link
            to="/plan"
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Plan a trip <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24">
      <img
        src={heroImage}
        alt="Aerial view of a turquoise coastline at golden hour"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        width={1920}
        height={1200}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/10 to-background" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI travel planning, reimagined
          </div>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-black sm:text-6xl lg:text-7xl">
            Your next great trip, <span className="gradient-text">planned in seconds.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Tell Wanderly where you're headed. We'll design a day-by-day itinerary,
            budget breakdown, hotels, food picks and safety tips — tuned to how you travel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 rounded-2xl gradient-hero px-6 py-3.5 text-base font-semibold text-white shadow-glow transition hover:brightness-110"
            >
              Start planning <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#destinations"
              className="glass inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-base font-semibold text-foreground transition hover:bg-card"
            >
              Explore destinations
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-accent text-accent" /> Loved by 12k+ travelers</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> 190+ countries</div>
          </div>
        </div>
        <div className="glass rounded-3xl p-6 shadow-card lg:justify-self-end">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Sample plan</p>
          <h3 className="mt-2 font-display text-2xl font-bold">7 days in Kyoto · ¥120,000</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { d: "Day 1", t: "Arashiyama bamboo grove + tempura dinner" },
              { d: "Day 2", t: "Fushimi Inari at sunrise, tea ceremony PM" },
              { d: "Day 3", t: "Gion walking tour + kaiseki tasting" },
              { d: "Day 4", t: "Day trip: Nara deer park + Todai-ji" },
            ].map((row) => (
              <li key={row.d} className="flex gap-3">
                <span className="w-14 shrink-0 font-semibold text-primary">{row.d}</span>
                <span className="text-muted-foreground">{row.t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary/60 p-3 text-sm">
            <span className="text-muted-foreground">Estimated cost</span>
            <span className="font-semibold">¥118,400 / person</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Destinations() {
  return (
    <section id="destinations" className="mx-auto max-w-6xl px-4 py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Trending now</p>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Popular destinations</h2>
        </div>
        <Link to="/plan" className="hidden text-sm font-medium text-primary hover:underline sm:block">
          Plan any city →
        </Link>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d, i) => (
          <Link
            key={d.name}
            to="/plan"
            search={{ destination: d.name } as never}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-glow"
          >
            <div
              className="aspect-[4/5] w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `linear-gradient(180deg, transparent 40%, oklch(0.15 0.03 230 / 0.85) 100%), url(https://images.unsplash.com/photo-${["1518548419970-58e3b4079ab2", "1493976040374-85c8e12f0c0e", "1580741569354-08feb26cffc3", "1613395877344-13d4a8e0d49e", "1512453979798-5ea266f8880c", "1508672019048-805c876b67e2"][i]}?w=800&q=80&auto=format&fit=crop)`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-xs font-medium opacity-80">{d.country}</p>
              <h3 className="font-display text-2xl font-bold">{d.name}</h3>
              <p className="mt-1 text-sm opacity-90">{d.tag}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Why Wanderly</p>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Trip planning that thinks like a local.</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            No more copy-pasted top-10 lists. Every plan is generated fresh for your
            group size, budget, dates and vibe — down to which morning to hit that
            sunrise viewpoint.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Personalized to your interests, not the algorithm",
              "Realistic budget estimates in your currency",
              "Weather, safety and packing all in one place",
              "Download, share or replan in one click",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full gradient-hero text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span className="text-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: CalendarDays, k: "7 days", v: "Avg plan length" },
            { icon: Wallet, k: "40s", v: "To generate" },
            { icon: Utensils, k: "6+", v: "Food picks / trip" },
            { icon: MapPin, k: "190+", v: "Countries covered" },
          ].map(({ icon: Icon, k, v }) => (
            <div key={k} className="glass rounded-2xl p-6 shadow-card">
              <Icon className="h-6 w-6 text-primary" />
              <p className="mt-4 font-display text-3xl font-bold">{k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Everything in one plan</p>
        <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">All the details, none of the busywork.</h2>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-glow">
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-hero text-white shadow-glow">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 pb-24">
      <div className="rounded-[2rem] gradient-hero p-1 shadow-glow">
        <div className="rounded-[calc(2rem-4px)] bg-background p-10 sm:p-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Loved by travelers</p>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Real trips, planned by Wanderly.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="glass rounded-2xl p-6 shadow-card">
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="mt-4 text-foreground">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{t.name}</span> · {t.trip}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg gradient-hero text-white">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold">Wanderly</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wanderly. Made for curious travelers.
        </p>
      </div>
    </footer>
  );
}
