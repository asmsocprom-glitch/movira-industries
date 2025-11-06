import Hero from "@/components/landing/Hero";
import ReviewComponent from "@/components/landing/ReviewComponents";
import FeaturedProducts from "@/components/landing/FeaturedProduct";
import FAQ from "@/components/landing/FAQ";
// import ServicesArea from "@/components/landing/ServiceArea";
export default function Home() {
  return (
    <div className="h-auto">
      <Hero />
      <FeaturedProducts />
      {/* <ServicesArea/> */}
      <ReviewComponent/> 
      <FAQ/>
    </div>
  );
}
