import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JyotishGPT Tools",
    short_name: "JyotishTools",
    start_url: "/tools",
    scope: "/",
    id: "/tools",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#0b1021",
    background_color: "#0b1021",
    icons: [
      { src: "/icons/jyotishgpt-icon-192-v2.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/jyotishgpt-icon-192-v2.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/jyotishgpt-icon-512-v2.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/jyotishgpt-icon-512-v2.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
