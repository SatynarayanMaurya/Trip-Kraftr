const SkeletonRow = () => (
    <tr style={{ borderBottom: "1px solid #f5f6fa" }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} style={{ padding: "15px 20px" }}>
          <div
            style={{
              height: "12px",
              width:
                i === 0
                  ? "120px"
                  : i === 1
                  ? "180px"
                  : i === 2
                  ? "60px"
                  : i === 6
                  ? "60px"
                  : "100px",
              borderRadius: "6px",
              background: "linear-gradient(90deg, #f0f2f5 25%, #e6e9ef 37%, #f0f2f5 63%)",
              backgroundSize: "400% 100%",
              animation: "shimmer 1.4s ease infinite",
            }}
          />
        </td>
      ))}
    </tr>
  );
  
  const ActivitySkeleton = () => {
    return (
      <>
        <style>
          {`
            @keyframes shimmer {
              0% { background-position: 100% 0; }
              100% { background-position: -100% 0; }
            }
          `}
        </style>
  
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #f0f2f5" }}>
              {["Place Name", "Notes", "Price", "Region", "Sub-Region", "Category", "Actions"].map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: i === 6 ? "right" : "left",
                    padding: "16px 20px",
                    color: "#c1c7d0",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </>
    );
  };
  
  export default ActivitySkeleton;