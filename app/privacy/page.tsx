import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CreaCurve",
  description: "Privacy Policy for CreaCurve logo design services. Learn how we collect, use, and protect your data.",
  alternates: { canonical: "https://creacurve.com/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 5, 2025";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link href="/logo-design" className="text-sm text-violet-600 hover:underline mb-8 inline-block">
          ← Back to CreaCurve
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              CreaCurve (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your personal
              information. This Privacy Policy explains what data we collect, why we collect it, how we use
              it, and your rights regarding that data when you use{" "}
              <strong>creacurve.com</strong> or purchase our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <h3 className="text-base font-semibold text-gray-800 mb-2">Information you provide directly</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Name and email address (when submitting a quote form or placing an order)</li>
              <li>Phone number (optional, if provided)</li>
              <li>Business name and industry (for design briefing purposes)</li>
              <li>Project details and any files you share with us</li>
            </ul>
            <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">Information collected automatically</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>IP address and browser type</li>
              <li>Pages visited and time spent on the site</li>
              <li>Referral source (how you found us)</li>
            </ul>
            <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">Payment information</h3>
            <p>
              We do <strong>not</strong> collect or store payment card details. All payment processing is
              handled by <strong>Paddle</strong>, our Merchant of Record, under their own privacy policy
              at{" "}
              <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                paddle.com/legal/privacy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>To fulfil and manage your logo design order</li>
              <li>To communicate with you about your project (concepts, revisions, delivery)</li>
              <li>To send order confirmations and receipts</li>
              <li>To respond to enquiries submitted via our contact form or WhatsApp</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell, rent, or share your personal data with third parties for
              their marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services that may process your data:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Paddle</strong> — payment processing and transaction management</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Tidio</strong> — live chat support</li>
              <li><strong>Vercel</strong> — website hosting and infrastructure</li>
            </ul>
            <p className="mt-3">
              Each of these services has its own privacy policy and data practices. We select providers
              that maintain appropriate security standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
            <p>
              Our website uses essential cookies necessary for the site to function. We may also use
              analytics cookies to understand how visitors interact with our site. You can disable cookies
              in your browser settings, though this may affect some functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfil the purposes outlined in
              this policy, or as required by law. Order-related data is retained for a minimum of 7 years
              for tax and accounting purposes. You may request deletion of your data at any time (subject
              to legal retention requirements).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li>Object to or restrict how we process your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time (where processing is based on consent)</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:hello@creacurve.com" className="text-violet-600 hover:underline">
                hello@creacurve.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data
              against unauthorised access, loss, or disclosure. Our site is served over HTTPS. However, no
              method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect
              personal data from children. If you believe a child has provided us with personal data, please
              contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with
              an updated date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
            <p>
              For any privacy-related questions or requests, contact us at{" "}
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
