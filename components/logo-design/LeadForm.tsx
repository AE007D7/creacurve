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
              Free consultation. No commitment. We reply instantly.
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
                  Thanks! We&apos;ll be in touch instantly.
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

                {/* Instant reply channels */}
                <div className="pt-1 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center mb-3">Or reach us instantly on</p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <a
                      href="https://wa.me/12522198026"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-white transition-all duration-200 hover:opacity-90"
                      style={{ background: "#25D366" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                    <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-violet-100 text-violet-700">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      Live chat
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="m22 7-10 7L2 7"/>
                      </svg>
                      Form — instant reply
                    </span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
