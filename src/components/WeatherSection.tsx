import { CloudRain, Droplets, Sun, Thermometer, Wind } from "lucide-react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailyWeather, MonthlyClimate, WeatherSummary } from "@/lib/trip.functions";

type Props = {
  summary?: WeatherSummary;
  daily?: DailyWeather[];
  monthly?: MonthlyClimate[];
  tripMonths?: string[];
};

const axisStyle = { fill: "var(--muted-foreground)", fontSize: 12 } as const;

function Tile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sun;
  label: string;
  value: string;
}) {
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

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  color: "var(--card-foreground)",
  fontSize: 12,
};

export function WeatherSection({ summary, daily, monthly, tripMonths = [] }: Props) {
  if (!summary && !daily?.length && !monthly?.length) return null;

  const highlighted = new Set(tripMonths.map((m) => m.slice(0, 3).toLowerCase()));

  return (
    <section className="rounded-3xl border border-border bg-card p-8 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-2xl font-bold">Weather &amp; season</h3>
        {summary?.condition ? (
          <span className="text-sm text-muted-foreground">{summary.condition}</span>
        ) : null}
      </div>

      {summary ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Tile icon={Thermometer} label="Avg temp" value={`${Math.round(summary.avgTempC)}°C`} />
            <Tile icon={Droplets} label="Humidity" value={`${Math.round(summary.avgHumidity)}%`} />
            <Tile icon={CloudRain} label="Rain chance" value={`${Math.round(summary.rainChance)}%`} />
            <Tile icon={Wind} label="Wind" value={`${Math.round(summary.windKph)} km/h`} />
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-accent" />
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Best season</p>
            </div>
            <p className="mt-2 font-display text-xl font-bold">
              {summary.bestSeason}
              {summary.bestMonths ? <span className="text-muted-foreground"> · {summary.bestMonths}</span> : null}
            </p>
            {summary.seasonNote ? (
              <p className="mt-2 text-sm text-muted-foreground">{summary.seasonNote}</p>
            ) : null}
          </div>
        </>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {daily?.length ? (
          <div className="rounded-2xl border border-border bg-background p-5">
            <h4 className="text-sm font-semibold">Daily forecast</h4>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={daily} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickFormatter={(d) => `D${d}`} tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="t" tick={axisStyle} axisLine={false} tickLine={false} unit="°" />
                  <YAxis yAxisId="r" orientation="right" domain={[0, 100]} tick={axisStyle} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area yAxisId="t" type="monotone" dataKey="highC" name="High °C" stroke="var(--primary)" fill="color-mix(in oklab, var(--primary) 25%, transparent)" />
                  <Area yAxisId="t" type="monotone" dataKey="lowC" name="Low °C" stroke="var(--accent)" fill="color-mix(in oklab, var(--accent) 20%, transparent)" />
                  <Line yAxisId="r" type="monotone" dataKey="rainChance" name="Rain %" stroke="var(--muted-foreground)" strokeDasharray="4 4" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}

        {monthly?.length ? (
          <div className="rounded-2xl border border-border bg-background p-5">
            <h4 className="text-sm font-semibold">Season comparison</h4>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} unit="°" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="avgTempC" name="Avg °C" radius={[6, 6, 0, 0]}>
                    {monthly.map((m) => (
                      <Cell
                        key={m.month}
                        fill={
                          highlighted.has(m.month.slice(0, 3).toLowerCase())
                            ? "var(--primary)"
                            : "var(--muted)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function DayWeatherChip({ w }: { w?: DailyWeather }) {
  if (!w) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
      <Sun className="h-3.5 w-3.5 text-accent" />
      {w.condition} · {Math.round(w.highC)}°/{Math.round(w.lowC)}°
      <CloudRain className="h-3.5 w-3.5" />
      {Math.round(w.rainChance)}%
    </span>
  );
}
