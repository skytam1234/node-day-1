import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { reduxStore } from "./store/store";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <Provider store={reduxStore.store}>
        <App />
    </Provider>

    // </StrictMode>,
);
