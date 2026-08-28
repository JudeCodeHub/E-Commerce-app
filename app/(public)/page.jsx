'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import Pricing from "@/components/Pricing";

export default function Home() {
    return (
        <div>
            <Hero />
            <LatestProducts />
            <BestSelling />
            <Pricing />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
