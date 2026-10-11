import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KG Business – Strom & Gas Energieberatung",
    short_name: "KG Business",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#081a40",
    lang: "de-DE",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
