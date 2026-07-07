import { FullSite } from "@/components/home/FullSite";
import { ComingSoonGate } from "@/components/home/ComingSoonGate";

export default function Home() {
  return (
    <ComingSoonGate>
      <FullSite />
    </ComingSoonGate>
  );
}
