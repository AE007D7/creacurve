"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

const STATS: Stat[] = [
  { value: 2000,  suffix: "+", label: "Brands served"     },
  { value: 4.9,   suffix: "",  label: "Average rating", prefix: "★ " },
  { value: 45,    suffix: "+", label: "Industries covered" },
  { value: 24,    suffix: "h", label: "First concepts"    },
];

function useCountUp(target: number, duration = 1400, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const isFloat = !Number.isInteger(target);
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setCount(isFloat ? Math.round(current * 10) / 10 : Math.round(current));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

function StatItem({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(stat.value, 1400, visible);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <span className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 tabular-nums">
        {stat.prefix}{count}{stat.suffix}
      </span>
      <span className="text-sm text-gray-400 font-medium">{stat.label}</span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
