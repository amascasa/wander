import { createApp } from "./phi.js";
import { initPhiUpdater } from "./update.js";

const phi = createApp();

document.addEventListener("DOMContentLoaded", () => {

    initPhiUpdater();

    phi.init();

    window.phi = phi;

});