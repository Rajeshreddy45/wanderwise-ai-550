import { useCallback, useEffect, useState } from "react";
import { CloudRain, Droplets, LocateFixed, Loader2, MapPin, RefreshCw, Sun, Thermometer, Wind } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Current = {
  temp: number;
  feels: number;
  humidity: number;
  rain: number;
  wind: number;
  code: number;
};

type DayPoint = {
  label: string;
  high: number;
  low: number;
  rain: number;
};

const WEATHER_TEXT: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  color: "var(--card-foreground)",
  fontSize: 12,
};
const axisStyle = { fill: "var(--muted-foreground)", fontSize: 12 } as const;

function Tile({ icon: Icon, label, value }: { icon: typeof Sun; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

export function LiveWeather() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [place, setPlace] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [current, setCurrent] = useState<Current | null>(null);
  const [days, setDays] = useState<DayPoint[]>([]);

  const load = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("Location isn't available on this device.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }),
      );
      const { latitude, longitude } = pos.coords;

      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather service is unavailable right now.");
      const data = await res.json();

      setCurrent({
        temp: Math.round(data.current.temperature_2m),
        feels: Math.round(data.current.apparent_temperature),
        humidity: Math.round(data.current.relative_humidity_2m),
        rain: Math.round(data.daily.precipitation_probability_max?.[0] ?? 0),
        wind: Math.round(data.current.wind_speed_10m),
        code: data.current.weather_code,
      });
      setDays(
        (data.daily.time as string[]).map((t, i) => ({
          label: new Date(t).toLocaleDateString(undefined, { weekday: "short" }),
          high: Math.round(data.daily.temperature_2m_max[i]),
          low: Math.round(data.daily.temperature_2m_min[i]),
          rain: Math.round(data.daily.precipitation_probability_max?.[i] ?? 0),
        })),
      );
      setUpdatedAt(new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }));

      try {
        const geo = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        );
        const g = await geo.json();
        setPlace([g.city || g.locality, g.principalSubdivision, g.countryName].filter(Boolean).join(", "));
      } catch {
        setPlace(`${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`);
      }
      setStatus("done");
    } catch (err) {
      const msg =
        err && typeof err === "object" && "code" in err && (err as GeolocationPositionError).code === 1
          ? "Location permission was blocked. Allow it in your browser to see live weather."
          : err instanceof Error
            ? err.message
            : "Couldn't get your live weather.";
      setError(msg);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (status !== "done") return;
    const id = setInterval(() => void load(), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [status, load]);

  return (
    <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-white">
              <LocateFixed className="h-4 w-4" />
            </div>
            <h3 className="font-display text-2xl font-bold">Live weather near you</h3>
          </div>
          {status === "done" && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              {place} · {WEATHER_TEXT[current?.code ?? -1] ?? "Current conditions"} · updated {updatedAt}
            </p>
          )}
        </div>
        <button
          onClick={() => void load()}
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-xl gradient-hero px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-70"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Locating…
            </>
          ) : status === "done" ? (
            <>
              <RefreshCw className="h-4 w-4" /> Refresh
            </>
          ) : (
            <>
              <LocateFixed className="h-4 w-4" /> Use my location
            </>
          )}
        </button>
      </div>

      {status === "idle" && (
        <p className="mt-5 text-sm text-muted-foreground">
          Share your location to see the real-time forecast where you are right now.
        </p>
      )}
      {status === "error" && <p className="mt-5 text-sm text-destructive">{error}</p>}

      {status === "done" && current && (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Tile icon={Thermometer} label="Temperature" value={`${current.temp}°C`} />
            <Tile icon={Droplets} label="Humidity" value={`${current.humidity}%`} />
            <Tile icon={CloudRain} label="Rain chance" value={`${current.rain}%`} />
            <Tile icon={Wind} label="Wind" value={`${current.wind} km/h`} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Feels like {current.feels}°C</p>

          <div className="mt-6 h-64 w-full rounded-2xl border border-border bg-background p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={days} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="color-mix(in oklch, var(--border) 70%, transparent)" vertical={false} />
                <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="high"
                  name="High °C"
                  stroke="var(--primary)"
                  fill="color-mix(in oklch, var(--primary) 22%, transparent)"
                />
                <Line type="monotone" dataKey="low" name="Low °C" stroke="var(--accent)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rain" name="Rain %" stroke="var(--muted-foreground)" strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
