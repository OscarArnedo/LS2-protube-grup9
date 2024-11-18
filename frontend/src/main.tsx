import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import './tailwind.css';
import { UserProvider } from "./contexts/UserContext";

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.appendChild(modalRoot);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  </StrictMode>
);
