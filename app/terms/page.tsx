import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | CreaCurve",
  description: "Terms of Service for CreaCurve logo design services.",
  alternates: { canonical: "https://creacurve.com/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 5, 2025";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <Link href="/logo-design" className="text-sm text-violet-600 hover:underline mb-8 inline-block">
          ← Back to CreaCurve
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using CreaCurve (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) at{" "}
              <strong>creacurve.com</strong>, placing an order, or communicating with our team, you agree
              to be bound by these Terms of Service and all applicable laws and regulations. If you do not
              agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Services</h2>
            <p>
              CreaCurve provides professional logo design and brand identity services. Upon placing an order
              you will receive logo concepts from our designers within the timeframe stated on your chosen
              plan (typically 24–48 hours). The number of concepts, revisions, and deliverable file formats
              depend on the plan purchased.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Orders and Payment</h2>
            <p>
              All prices are listed in US Dollars (USD). Payments are processed securely by{" "}
              <strong>Paddle</strong>, our authorised reseller and Merchant of Record. By completing a
              purchase you agree to Paddle&apos;s terms at{" "}
              <a href="https://www.paddle.com/legal/terms" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                paddle.com/legal/terms
              </a>. CreaCurve does not store your payment card details.
            </p>
            <p className="mt-3">
              Orders are confirmed once payment is successfully processed. You will receive a confirmation
              email from both Paddle and CreaCurve.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Delivery</h2>
            <p>
              First logo concepts are delivered digitally to the email address provided at checkout within
              24–48 hours of order confirmation. Final approved files are delivered within 1–3 business days
              of final approval, depending on revision cycles. CreaCurve is not liable for delays caused by
              failure to provide required project information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Revisions</h2>
            <p>
              The number of revisions included depends on the plan purchased (Starter: 4 revisions;
              Professional and Platinum: unlimited revisions). Revisions must relate to the original
              project brief. Requests for entirely new concepts beyond the included number may be subject
              to additional fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p>
              Upon receipt of full payment and final approval of your logo, CreaCurve transfers full
              ownership and copyright of the final delivered logo design to you. You may use the logo for
              any commercial or personal purpose without restriction.
            </p>
            <p className="mt-3">
              Until full payment is received, all design concepts remain the intellectual property of
              CreaCurve. Concepts not selected for the final design remain the property of CreaCurve and
              may not be used without additional licensing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Refund Policy</h2>
            <p>
              CreaCurve offers a 100% money-back guarantee. Please see our full{" "}
              <Link href="/refund" className="text-violet-600 hover:underline">Refund Policy</Link>{" "}
              for complete details and eligibility conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. User Obligations</h2>
            <p>You agree to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Provide accurate and complete information when placing an order.</li>
              <li>Not request designs that infringe third-party intellectual property rights.</li>
              <li>Not use our services for any unlawful or fraudulent purpose.</li>
              <li>Not reproduce, resell, or sublicense any concept designs that are not the final approved logo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, CreaCurve shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including loss of profits, data, or
              goodwill, arising from your use of our services. Our total liability for any claim arising
              from a purchase shall not exceed the amount paid for that specific order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Disclaimer of Warranties</h2>
            <p>
              Our services are provided &quot;as is&quot;. CreaCurve makes no warranties, express or implied,
              regarding the fitness for a particular purpose or that the service will meet your specific
              requirements. We cannot guarantee that any logo design will be registrable as a trademark in
              any jurisdiction — trademark searches and registrations are the customer&apos;s responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the United States.
              Any disputes shall be resolved through binding arbitration or in a court of competent
              jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Changes will be posted on this page
              with an updated date. Continued use of our services after changes constitutes acceptance of
              the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:hello@creacurve.com" className="text-violet-600 hover:underline">
                hello@creacurve.com
              </a>{" "}
              or via{" "}
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
