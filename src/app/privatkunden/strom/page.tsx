import { PrivateEnergyTemplate } from "@/components/sections/PrivateEnergyTemplate";
import { privatStrom } from "@/content/private";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: privatStrom.metaTitle, description: privatStrom.description, path: privatStrom.path });

export default function PrivatStromPage() {
  return <PrivateEnergyTemplate page={privatStrom} />;
}
