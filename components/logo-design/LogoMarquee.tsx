"use client";

const ROW_1 = [
  "/logo-examples/logo-1.png",
  "/logo-examples/1.jpg",
  "/logo-examples/2.jpg",
  "/logo-examples/logo-2.png",
  "/logo-examples/3.jpg",
  "/logo-examples/4.jpg",
  "/logo-examples/logo-4.png",
  "/logo-examples/5.jpg",
  "/logo-examples/6.jpg",
  "/logo-examples/logo-6.png",
];

const ROW_2 = [
  "/logo-examples/7.jpg",
  "/logo-examples/logo-7.png",
  "/logo-examples/8.jpg",
  "/logo-examples/9.jpg",
  "/logo-examples/10.jpg",
  "/logo-examples/11.jpg",
  "/logo-examples/12.jpg",
  "/logo-examples/13.jpg",
  "/logo-examples/14.jpg",
  "/logo-examples/15.jpg",
];

function MarqueeTrack({
  images,
  reverse = false,
}: {
  images: string[];
  reverse?: boolean;
}) {
  const doubled = [...images, ...images];
  return (
    <div className="overflow-hidden relative">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, white, transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, white, transparent)" }} />

      <div
        className="flex gap-3"
        style={{
          animation: `marquee${reverse ? "-reverse" : ""} 35s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="w-28 h-28 shrink-0 rounded-2xl border border-gray-100 overflow-hidden bg-gray-50 hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              width={112}
              height={112}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LogoMarquee() {
  return (
    <section className="py-14 bg-white space-y-3 overflow-hidden">
      <MarqueeTrack images={ROW_1} />
      <MarqueeTrack images={ROW_2} reverse />
    </section>
  );
}
