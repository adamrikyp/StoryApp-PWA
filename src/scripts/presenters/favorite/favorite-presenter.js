// src/scripts/presenters/favorite/favorite-presenter.js
// File ini bertanggung jawab untuk logika halaman daftar cerita favorit.

import FavoriteModel from "../../models/favorite-model"; // Import Model

export default class FavoritePresenter {
  #view = null;
  #model = null;

  /**
   * @param {object} options
   * @param {object} options.view - Instance of FavoriteView.
   * @param {object} options.model - Instance of FavoriteModel.
   */
  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  /**
   * Menginisialisasi presenter dan memuat daftar cerita favorit.
   */
  async initialize() {
    this.#view.renderInitialState(); // Render tampilan awal dengan loader
    await this.loadFavorites();
  }

  /**
   * Memuat daftar cerita favorit dari model dan memperbarui tampilan.
   */
  async loadFavorites() {
    try {
      this.#view.updateUI({ loading: true }); // Tampilkan loading state
      const favorites = await this.#model.getAllFavorites(); // Ambil data favorit
      this.#view.updateUI({ loading: false, favorites }); // Perbarui UI dengan data favorit
    } catch (error) {
      console.error("FavoritePresenter: Error loading favorites:", error);
      this.#view.updateUI({
        loading: false,
        error: error.message || "Gagal memuat cerita favorit.",
      }); // Tampilkan error
    }
  }

  /**
   * Membersihkan presenter dan view terkait.
   */
  cleanup() {
    if (this.#view) {
      this.#view.cleanup();
      this.#view = null;
    }
    this.#model = null;
  }
}
