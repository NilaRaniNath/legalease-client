export const metadata = {
  title: "Cookie Policy | Legal Ease",
  description: "How LegalEase uses cookies and similar technologies.",
};

const sections = [
  {
    title: "1. What Are Cookies",
    body: "Cookies are small text files stored on your device when you visit a website. They help websites function properly and remember information about your visit.",
  },
  {
    title: "2. Cookies We Use",
    body: "We use essential cookies to keep you signed in with Better-Auth sessions, preference cookies to remember your settings, and analytics cookies to understand how the platform is used.",
  },
  {
    title: "3. Authentication Cookies",
    body: "When you sign in, we set secure, http-only session cookies that keep you authenticated across requests. These are required for account features such as dashboards and hiring requests.",
  },
  {
    title: "4. Managing Cookies",
    body: "You can control or delete cookies through your browser settings. Please note that disabling essential cookies may prevent you from signing in or using core platform features.",
  },
  {
    title: "5. Changes to This Policy",
    body: "We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.",
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#0B1524] text-slate-100">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider">
          Legal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mt-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300">
          Cookie Policy
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