import React from "react";

function RegionsSkeleton({ count = 3 }) {
  return (
    <>
      {/* Animation style */}
      <style>
        {`
          @keyframes skeletonPulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            style={{
              background: "linear-gradient(145deg, #1e2535, #1a2030)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px",
              overflow: "hidden",
              animation: "skeletonPulse 1.5s ease-in-out infinite",
            }}
          >
            {/* Image */}
            <div
              style={{
                height: "160px",
                background: "rgba(255,255,255,0.06)",
              }}
            />

            <div style={{ padding: "16px" }}>
              {/* Title */}
              <div
                style={{
                  height: "16px",
                  width: "60%",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "6px",
                  marginBottom: "8px",
                }}
              />

              {/* Country */}
              <div
                style={{
                  height: "12px",
                  width: "40%",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "6px",
                  marginBottom: "14px",
                }}
              />

              {/* Description lines */}
              <div
                style={{
                  height: "10px",
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "6px",
                  marginBottom: "6px",
                }}
              />
              <div
                style={{
                  height: "10px",
                  width: "80%",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "6px",
                  marginBottom: "16px",
                }}
              />

              {/* Margin boxes */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <div
                  style={{
                    flex: 1,
                    height: "40px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: "40px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "8px" }}>
                <div
                  style={{
                    flex: 1,
                    height: "34px",
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    height: "34px",
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default RegionsSkeleton;