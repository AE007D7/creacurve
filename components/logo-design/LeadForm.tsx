"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

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

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  industry: string;
  budgetRange: string;
  projectDetails: string;
}

const EMPTY: FormData = {
  name: "",
  email: "",
  phone: "",
  service: "",
  industry: "",
  budgetRange: "",
  projectDetails: "",
};

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2";

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export default function LeadForm() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
    setError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setValidationError("");
    setError("");

    if (!form.name.trim()) return setValidationError("Name is required.");
    if (!form.email.trim()) return setValidationError("Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setValidationError("Please enter a valid email address.");
    if (!form.service) return setValidationError("Please select a service.");
    if (!form.industry) return setValidationError("Please select an industry.");
    if (!form.budgetRange) return setValidationError("Please select a budget range.");

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "form" }),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error("[LeadForm]", err);
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="lead-form" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-violet-600 uppercase mb-3">Free quote</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Tell us about your project.
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Free consultation. No commitment. Reply within 1 business day.
            </p>
            <ul className="space-y-4">
              {[
                "Industry-matched designers for your niche",
                "First concepts in 24–48 hours",
                "100% money-back guarantee",
              ].map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8l3.5 3.5L13 4.5"
                      stroke="#111827"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div>
            {success ? (
              <div className="border border-green-200 bg-green-50 rounded-xl p-8 text-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto mb-4"
                  aria-hidden="true"
                >
                  <circle cx="20" cy="20" r="20" fill="#dcfce7" />
                  <path
                    d="M12 20l5.5 5.5L28 14.5"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-base font-semibold text-green-800 mb-1">
                  Thanks! We&apos;ll be in touch within 1 business day.
                </p>
                <p className="text-sm text-green-700">
                  We&apos;ve received your details and will match you with the right designers shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="lead-name" className={labelClass}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="lead-email" className={labelClass}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="lead-phone" className={labelClass}>
                    Phone <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={inputClass}
                  />
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="lead-service" className={labelClass}>
                    Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="lead-service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="Logo Design">Logo Design</option>
                    <option value="Logo + Brand Kit">Logo + Brand Kit</option>
                    <option value="Logo + Stationery">Logo + Stationery</option>
                    <option value="Full Brand Identity">Full Brand Identity</option>
                  </select>
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="lead-industry" className={labelClass}>
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="lead-industry"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="lead-budget" className={labelClass}>
                    Budget range <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="lead-budget"
                    name="budgetRange"
                    value={form.budgetRange}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select a budget range</option>
                    <option value="Under $100">Under $100</option>
                    <option value="$100–$300">$100–$300</option>
                    <option value="$300–$1,000">$300–$1,000</option>
                    <option value="$1,000+">$1,000+</option>
                  </select>
                </div>

                {/* Project details */}
                <div>
                  <label htmlFor="lead-details" className={labelClass}>
                    Project details <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="lead-details"
                    name="projectDetails"
                    value={form.projectDetails}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your brand, target audience, style preferences..."
                    className={inputClass}
                  />
                </div>

                {/* Validation error */}
                {validationError && (
                  <p className="text-sm text-red-600">{validationError}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  {loading ? "Sending..." : "Get my free quote"}
                </button>

                {/* Server error */}
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
