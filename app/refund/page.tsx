import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | CreaCurve",
  description: "CreaCurve's 100% money-back guarantee and refund policy for logo design services.",
  alternates: { canonical: "https://creacurve.com/refund" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 5, 2025";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link href="/logo-design" className="text-sm text-violet-600 hover:underline mb-8 inline-block">
          ← Back to CreaCurve
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Refund Policy</h1>
        <p className="text-sm text-gray-400 mb-4">Last updated: {LAST_UPDATED}</p>

        {/* Guarantee badge */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-12 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-green-800 mb-1">100% Money-Back Guarantee</p>
            <p className="text-sm text-green-700">
              If you are not satisfied with our work, we will refund your payment in full — no questions asked.
            </p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Our Guarantee</h2>
            <p>
              CreaCurve stands behind the quality of its work. If you are not happy with the logo designs
              delivered, you are entitled to a full refund of the amount paid — no questions asked. We want
              every customer to be completely satisfied with their experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Eligibility for a Refund</h2>
            <p>You are eligible for a full refund if:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>You have reviewed the delivered concepts and are not satisfied with the results.</li>
              <li>You submit your refund request within <strong>30 days</strong> of the initial concept delivery.</li>
              <li>You have not yet approved a final logo design for delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Non-Refundable Circumstances</h2>
            <p>A refund will not be issued if:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>You have approved and downloaded the final logo files.</li>
              <li>More than 30 days have passed since the initial concept delivery.</li>
              <li>The dissatisfaction is due to a change of mind unrelated to the quality of the design work.</li>
              <li>You provided incorrect or insufficient project information that led to off-brief designs and refused further revision rounds.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How to Request a Refund</h2>
            <p>To request a refund, contact us through any of the following:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:hello@creacurve.com" className="text-violet-600 hover:underline">
                  hello@creacurve.com
                </a>
              </li>
              <li>
                <strong>WhatsApp:</strong>{" "}
                <a href="https://wa.me/12522198026" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                  +1 (252) 219-8026
                </a>
              </li>
            </ul>
            <p className="mt-4">Please include your order number or the email address used at checkout so we can locate your order quickly.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refund Processing</h2>
            <p>
              Once approved, refunds are processed within <strong>5–10 business days</strong> back to the
              original payment method. Processing time may vary depending on your bank or card issuer.
              Refunds are issued by <strong>Paddle</strong>, our payment processor and Merchant of Record.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Chargebacks</h2>
            <p>
              We ask that you contact us directly before initiating a chargeback with your bank. We are
              committed to resolving all issues promptly. Chargebacks that are raised without prior contact
              may affect your ability to use CreaCurve services in the future.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact</h2>
            <p>
              Any questions about this Refund Policy? Reach us at{" "}
              <a href="mailto:hello@creacurve.com" className="text-violet-600 hover:underline">
                hello@creacurve.com
              </a>{" "}
              or{" "}
              <a href="https://wa.me/12522198026" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                WhatsApp
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
