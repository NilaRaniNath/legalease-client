import AboutUs from "@/components/AboutUs";

export const metadata = {
  title: "About Us | Legal Ease",
  description: "Learn about LegalEase - democratizing access to premium legal aid.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B1524]">
      <AboutUs />
    </div>
  );
}