// src/scripts/pages/home/home-page.js
// Hapus semua import API dan template creator langsung
// import { getAllStories, getToken, removeToken, getUserName, isLoggedIn } from "../../data/api.js"; // Hapus ini
// import MapInitiator from "../../utils/map-initiator.js"; // Hapus ini
// import { createStoryItemTemplate, createLoaderTemplate, createErrorTemplate } from "../../utils/template-creator.js"; // Hapus ini

import HomeView from "../../views/HomeView.js"; // Import View
import HomeModel from "../../models/HomeModel.js"; // Import Model
import HomePresenter from "../../presenters/HomePresenter.js"; // Import Presenter

export default class HomePage {
  #homeView = null;
  #homeModel = null;
  #homePresenter = null;
  #hashChangeListener = null;

  async render() {
    // Render hanya menyediakan container untuk View
    return `
      <div id="home-page-container"></div>
    `;
  }

  async afterRender() {
    console.log("HomePage afterRender executed");

    // Buat instance View, Model, dan Presenter
    this.#homeView = new HomeView("#home-page-container");
    this.#homeModel = new HomeModel();
    this.#homePresenter = new HomePresenter({
      view: this.#homeView,
      model: this.#homeModel,
    });

    // Panggil method inisialisasi di Presenter
    // Presenter yang akan memutuskan apakah perlu memuat data atau menampilkan pesan login
    await this.#homePresenter.initialize();

    // Tambahkan event listener hashchange untuk cleanup
    this.#hashChangeListener = this._handleHashChange.bind(this);
    window.addEventListener("hashchange", this.#hashChangeListener);

    console.log("HomePage MVP components initialized.");
  }

  // --- Cleanup ---

  _handleHashChange() {
    // Cek jika navigasi menjauh dari halaman home
    // Asumsikan halaman home adalah hash "#/"
    if (window.location.hash !== "#/") {
      console.log("Navigating away from #/, initiating cleanup.");
      this.cleanup();
    } else {
      console.log("Navigated back to #/, hashchange listener persists.");
      // Jika navigasi kembali ke home (meskipun ini mungkin tidak terjadi dengan router yang sama),
      // pastikan halaman dimuat ulang atau presenter dipanggil ulang jika state berubah.
      // Router biasanya menangani inisialisasi setelah hash change.
    }
  }

  cleanup() {
    console.log("HomePage cleanup executed.");

    // Panggil cleanup di Presenter, yang akan memanggil cleanup di View
    if (this.#homePresenter) {
      this.#homePresenter.cleanup(); // Presenter membersihkan View dan dirinya (listener)
      this.#homePresenter = null;
    }

    // Dereference View dan Model
    this.#homeView = null;
    this.#homeModel = null;

    // Hapus event listener global hashchange
    if (this.#hashChangeListener) {
      window.removeEventListener("hashchange", this.#hashChangeListener);
      this.#hashChangeListener = null;
    }

    // Bersihkan container elemen jika perlu
    const container = document.querySelector("#home-page-container");
    if (container) {
      container.innerHTML = "";
    }
  }
}
