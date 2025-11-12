import { ImageResponse } from "next/og";

export const size = {
  width: 128,
  height: 128
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, #fce3ba 0%, #d2a660 60%, #9f7336 100%)",
          color: "#2f1607",
          fontSize: 60,
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          fontWeight: 700,
          letterSpacing: 4
        }}
      >
        JG
      </div>
    ),
    {
      ...size
    }
  );
}
