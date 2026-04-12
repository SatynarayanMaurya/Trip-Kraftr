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

      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <tr key={rowIndex} style={{ borderBottom: "1px solid #f5f6fa" }}>
          {Array.from({ length: 7 }).map((_, colIndex) => (
            <td key={colIndex} style={{ padding: "15px 20px" }}>
              <div
                style={{
                  height: "12px",
                  width:
                    colIndex === 0
                      ? "120px"
                      : colIndex === 1
                      ? "180px"
                      : colIndex === 2
                      ? "60px"
                      : colIndex === 6
                      ? "60px"
                      : "100px",
                  borderRadius: "6px",
                  background:
                    "linear-gradient(90deg, #f0f2f5 25%, #e6e9ef 37%, #f0f2f5 63%)",
                  backgroundSize: "400% 100%",
                  animation: "shimmer 1.4s ease infinite",
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default ActivitySkeleton;