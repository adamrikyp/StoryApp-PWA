// src/scripts/index.js

// Import CSS utama
import "../styles/styles.css";

// Import kelas App (pastikan ini adalah class, bukan instance)
import App from "./presenters/app";

// Tunggu hingga DOM selesai dimuat
document.addEventListener("DOMContentLoaded", async () => {
  // Buat instance dari kelas App
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  // Render halaman pertama berdasarkan hash URL
  await app.renderPage();

  // Dengarkan perubahan pada hash URL (navigasi SPA)
  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
