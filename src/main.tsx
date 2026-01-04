import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const basename = import.meta.env.BASE_URL;

// Defer speed insights to not block initial render
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    import("@vercel/speed-insights").then(({ injectSpeedInsights }) => {
      injectSpeedInsights();
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);
