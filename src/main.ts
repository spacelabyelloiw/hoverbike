import "./style.css";
import { mountApp } from "./game/app";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("App root not found.");
}

mountApp(root);
