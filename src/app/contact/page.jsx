import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us | Legal Ease",
  description: "Get in touch with the LegalEase team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0B1524] text-slate-100">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-wider">
          Contact
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300">
          We&apos;re Here to Help
        </h1>
        <p className="text-slate-400 mt-4 leading-relaxed max-w-2xl">
          Questions about hiring a lawyer, your account, or a booking? Reach out
          and our team will get back to you within 24 hours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex gap-5 items-start">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Email</h3>
              <p className="text-sm text-slate-400 mt-1">
                support@legalease.com
              </p>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex gap-5 items-start">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Phone</h3>
              <p className="text-sm text-slate-400 mt-1">+880 1234 567890</p>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex gap-5 items-start">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Office</h3>
              <p className="text-sm text-slate-400 mt-1">
                Dhaka, Bangladesh
              </p>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex gap-5 items-start">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hours</h3>
              <p className="text-sm text-slate-400 mt-1">
                Sun - Sat, 9:00 AM - 9:00 PM (GMT+6)
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}