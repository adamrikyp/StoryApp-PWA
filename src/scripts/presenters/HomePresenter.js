// src/scripts/presenters/HomePresenter.js

import HomeModel from "../data/model/HomeModel.js"; // Import Model

export default class HomePresenter {
  #view = null;
  #model = null;
  #mapInstance = null;

  /**
   * @param {object} options
   * @param {object} options.view - Instance of HomeView.
   * @param {object} options.model - Instance of HomeModel.
   */
  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  // Method yang dipanggil oleh home-page.js setelah View dirender
  async initialize() {
    const isLoggedIn = this.#model.isUserLoggedIn();
    const userName = this.#model.getCurrentUserName();

    // Tampilkan tampilan awal (dengan loader jika login)
    this.#view.renderInitialState(isLoggedIn, userName);

    if (!isLoggedIn) return;

    await this.loadStoriesAndMap();
  }

  async loadStoriesAndMap() {
    try {
      // Tampilkan loading state
      this.#view.updateUI({ loading: true });

      // Ambil data cerita dari model
      const stories = await this.#model.fetchStories(1, 20, 1);
      const storiesWithLocation = stories.filter(
        (story) => story.lat && story.lon
      );

      // Perbarui UI dengan cerita dan data peta
      this.#view.updateUI({
        stories,
        mapData: storiesWithLocation,
      });
    } catch (error) {
      console.error("HomePresenter: Error loading stories and map:", error);

      this.#view.updateUI({
        error: error.message,
      });

      if (
        error.message.includes("token") ||
        error.message.includes("login") ||
        error.message.includes("Sesi Anda telah habis")
      ) {
        console.log(
          "HomePresenter: Authentication error, clearing token and navigating to login."
        );
        this.#model.clearUserData();
        window.location.hash = "#/login";
      }
    }
  }

  cleanup() {
    console.log("HomePresenter cleanup executed.");
    this.#view.cleanup();
    this.#mapInstance = null;
  }
}
