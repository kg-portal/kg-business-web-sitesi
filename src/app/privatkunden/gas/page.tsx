import { PrivateEnergyTemplate } from "@/components/sections/PrivateEnergyTemplate";
import { privatGas } from "@/content/private";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: privatGas.metaTitle, description: privatGas.description, path: privatGas.path });

export default function PrivatGasPage() {
  return <PrivateEnergyTemplate page={privatGas} />;
}
