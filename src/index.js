import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// 🔹 Solo bloquear logs en el navegador (pero mantenerlos en la terminal)
/*if (typeof window !== "undefined") {
  console.log = (...args) => {
    if (typeof process !== "undefined" && process.stdout) {
      process.stdout.write(args.join(" ") + "\n");
    }
  };
  console.warn = () => {};
  console.error = () => {};
}*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
