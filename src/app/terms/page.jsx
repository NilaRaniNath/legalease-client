export const metadata = {
  title: "Terms of Service | Legal Ease",
  description: "Terms of Service for using the LegalEase platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using LegalEase, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use the platform.",
  },
  {
    title: "2. Platform Services",
    body: "LegalEase is a digital marketplace that connects clients with legal professionals. We facilitate hiring, scheduling, secure payments, and communication but do not provide legal advice ourselves unless explicitly stated.",
  },
  {
    title: "3. User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate and complete information when creating a profile.",
  },
  {
    title: "4. Lawyer Listings",
    body: "Lawyers must be verified and published to appear on the platform. LegalEase may remove listings that violate our policies or receive substantiated complaints.",
  },
  {
    title: "5. Payments & Refunds",
    body: "Payments are processed securely through Stripe. Booking and hiring fees are non-refundable once a service has been performed. Dispute resolution follows applicable consumer protection laws.",
  },
  {
    title: "6. Acceptable Use",
    body: "You agree not to misuse the platform, including impersonating others, submitting false reviews, attempting unauthorized access, or interfering with the operation of the service.",
  },
  {
    title: "7. Limitation of Liability",
    body: "LegalEase is provided on an 'as is' basis. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the platform.",
  },
  {
    title: "8. Changes to These Terms",
    body: "We may update these Terms of Service from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.",
  },
  {
    title: "9. Contact",
    body: "Questions about these Terms of Service can be directed to support@legalease.com.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0B1524] text-slate-100">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mt-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300">
          Terms of Service
        </h1>
        <p className="text-slate-400 mt-4 text-sm">
          Last updated: {new Date().getFullYear()}
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="mt-8">
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
              <p className="text-slate-400 mt-2 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}