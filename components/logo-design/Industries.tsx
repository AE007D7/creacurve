const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Real Estate",
  "Food & Beverage",
  "Fashion",
  "Automotive",
  "Travel",
  "Sports",
  "Entertainment",
  "Construction",
  "Legal",
  "Beauty",
  "Fitness",
  "Gaming",
  "Retail",
  "Nonprofit",
  "Religion",
  "Music",
  "Art",
  "Architecture",
  "Insurance",
  "Logistics",
  "Photography",
  "Consulting",
  "Events",
  "E-commerce",
];

export default function Industries() {
  return (
    <section id="industries" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3">
            Industries
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Serving{" "}
            <span
              className="font-serif italic font-normal"
              style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
            >
              45+ industries.
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl">
            Our designers have deep expertise across a wide range of sectors, so your logo
            speaks the language of your market.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {INDUSTRIES.map((industry) => (
            <span
              key={industry}
              className="border border-gray-200 rounded-full py-2 px-4 text-sm text-gray-600 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all duration-200 cursor-default"
            >
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
