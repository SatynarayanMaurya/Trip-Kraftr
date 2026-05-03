

import React, { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";

// optional: better loader component
function Loader() {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      Loading...
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;







// import AppRoutes from "./routes/AppRoutes"

// function App() {
//   return <AppRoutes />
// }

// export default App