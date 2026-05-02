import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JyotishGPT Tools",
    short_name: "JyotishTools",
    start_url: "/tools",
    display: "standalone",
    theme_color: "#0b1021",
    background_color: "#0b1021",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
