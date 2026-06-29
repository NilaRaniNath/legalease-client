import AboutUs from "@/components/AboutUs";
import Banner from "@/components/Banner";
import FeaturedLawyersSection from "@/components/FeaturedLawyers";
import Image from "next/image";

export default function Home() {
  return (
  <>
  <Banner></Banner>
    <FeaturedLawyersSection></FeaturedLawyersSection>
  
  <AboutUs></AboutUs>
  
  </>
  );
}
