import { ImageResponse } from "next/og";
import { crestDataUri, crestPixelHeight, crestPixelWidth } from "./crestImage";

export const ogCardSize = { width: 1200, height: 630 };

export const ogCardContentType = "image/png";

export const ogCardAlt = "The Lutterodt Renaissance — A Digital Legacy";

const CREST_DISPLAY_WIDTH = 250;
const CREST_DISPLAY_HEIGHT = Math.round(
  (CREST_DISPLAY_WIDTH * crestPixelHeight) / crestPixelWidth
);

export function buildOgCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F7F7F4",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <img
            src={crestDataUri}
            width={CREST_DISPLAY_WIDTH}
            height={CREST_DISPLAY_HEIGHT}
            alt=""
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 66,
                lineHeight: 1.05,
                color: "#0B0D12",
                letterSpacing: 1,
              }}
            >
              Lutterodt
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 22,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: "#996C16",
              }}
            >
              Let Us Have Ideals
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 900,
          }}
        >
          <div
            style={{
              width: 120,
              height: 4,
              backgroundColor: "#EEAD16",
              marginBottom: 30,
            }}
          />
          <div style={{ fontSize: 36, lineHeight: 1.3, color: "#0B0D12" }}>
            A Digital Legacy
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 23,
              lineHeight: 1.45,
              color: "#0B0D12",
              opacity: 0.66,
            }}
          >
            Six generations of the Lutterodt family, preserved for present and
            future generations.
          </div>
        </div>
      </div>
    ),
    { ...ogCardSize }
  );
}
