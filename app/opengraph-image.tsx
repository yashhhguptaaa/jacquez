import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
            <polygon points="4,28 28,28 28,4" fill="black" />
          </svg>
          <div
            style={{
              fontSize: "96px",
              fontWeight: "bold",
              color: "black",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Jacquez
          </div>
        </div>
        <div
          style={{
            fontSize: "48px",
            color: "#666",
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          A friendly moderator for OSS repos.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
