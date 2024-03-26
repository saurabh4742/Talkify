import BanPolicy from "@/components/BanPolicy";
import { Copyright } from "@/components/Copyright";
import { HowTouse } from "@/components/HowTouse";
import Intro from "@/components/Intro";

export default function Home() {
  return (
    <div className="space-y-6">
      
      <Intro/>
      <HowTouse/>
      <BanPolicy/>
      <Copyright/>
      </div>
  );
}
