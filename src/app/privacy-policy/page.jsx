export const metadata = {
  title: "Privacy Policy | Legal Ease",
  description: "How LegalEase collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly, such as your name, email address, profile photo, and payment details. We also collect usage data including pages visited and features used to improve our service.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to operate and improve LegalEase, process payments through Stripe, match you with legal professionals, send service notifications, and respond to support requests.",
  },
  {
    title: "3. Sharing of Information",
    body: "We share your data with lawyers when you initiate a hiring request, with payment processors to complete transactions, and with service providers who help run the platform. We do not sell your personal data.",
  },
  {
    title: "4. Data Security",
    body: "We use industry-standard encryption and security practices to protect your data. Authentication is handled securely via Better-Auth and credentials are stored using secure hashing.",
  },
  {
    title: "5. Your Rights",
    body: "You may access, correct, or delete your personal information at any time through your account dashboard or by contacting support@legalease.com.",
  },
  {
    title: "6. Data Retention",
    body: "We retain your information as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements.",
  },
  {
    title: "7. Cookies",
    body: "We use cookies and similar technologies to keep you signed in and remember your preferences. See our Cookie Policy for full details.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0B1524] text-slate-100">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mt-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300">
          Privacy Policy
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