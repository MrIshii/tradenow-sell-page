// LOCAL-ONLY entry point. Figma Make provides its own; do not copy this file into Make.
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
