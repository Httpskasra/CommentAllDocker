import Hero from "@/components/landing/Hero";
import Steps from "@/components/landing/Steps";
import WhyUs from "@/components/landing/WhyUs";
import ShareCta from "@/components/landing/ShareCta";
import CommentsGrid from "@/components/landing/CommentsGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <Steps />
      <ShareCta />
      <CommentsGrid />
    </>
  );
}
