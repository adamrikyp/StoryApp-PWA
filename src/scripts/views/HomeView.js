import MapInitiator from "../utils/map-initiator.js";
import {
  createLoaderTemplate,
  createErrorTemplate,
  createStoryItemTemplate,
} from "../utils/template-creator";

class HomeView {
  constructor(containerSelector) {
    this._container = document.querySelector(containerSelector);
    if (!this._container)
      throw new Error(`Container "${containerSelector}" not found`);
    this._mapInstance = null;
  }

  // Render utama dengan kondisi login
  renderInitialState(isLoggedIn, userName = "") {
    this._container.innerHTML = this._createBaseTemplate(isLoggedIn, userName);
    if (isLoggedIn) {
      this._storiesContainer = this._container.querySelector("#stories");
      this._mapContainer = this._container.querySelector("#map-display");
    }
  }

  // Update UI berdasarkan state
  updateUI({ loading = false, stories = null, error = null, mapData = null }) {
    if (loading) this._showLoading();
    if (error) this._showError(error);
    if (stories) this._showStories(stories);
    if (mapData) this._initMap(mapData);
  }

  // Bersihkan resources
  cleanup() {
    if (this._mapInstance) {
      MapInitiator.removeMap("map-display");
      this._mapInstance = null;
    }
    this._container.innerHTML = "";
  }

  // ---- Metode privat ----
  _createBaseTemplate(isLoggedIn, userName) {
    return `
      <section class="container">
        <h1 class="page-title">Daftar Cerita</h1>
        ${
          userName
            ? `<p class="welcome-message">Selamat datang, <strong>${userName}</strong>!</p>`
            : ""
        }
        <div id="stories" class="story-list">
          ${
            isLoggedIn
              ? createLoaderTemplate()
              : createErrorTemplate(
                  'Silakan <a href="#/login">login</a> untuk melihat cerita.'
                )
          }
        </div>
        <h2 class="section-title">Peta Lokasi Cerita</h2>
        <div id="map-display" class="map-container ${
          isLoggedIn ? "map-loading" : ""
        }">
          ${
            isLoggedIn
              ? createLoaderTemplate()
              : createErrorTemplate("Peta membutuhkan login")
          }
        </div>
      </section>
    `;
  }

  _showLoading() {
    if (this._storiesContainer)
      this._storiesContainer.innerHTML = createLoaderTemplate();
    if (this._mapContainer) {
      this._mapContainer.innerHTML = createLoaderTemplate();
      this._mapContainer.classList.add("map-loading");
    }
  }

  _showError(message) {
    if (this._storiesContainer)
      this._storiesContainer.innerHTML = createErrorTemplate(message);
    if (this._mapContainer) {
      this._mapContainer.innerHTML = createErrorTemplate(message);
      this._mapContainer.classList.remove("map-loading");
    }
  }

  _showStories(stories) {
    if (!this._storiesContainer) return;

    this._storiesContainer.innerHTML =
      stories.length > 0
        ? stories.map((story) => createStoryItemTemplate(story)).join("")
        : createErrorTemplate("Belum ada cerita");

    this._initLazyLoad();
  }

  _initMap(storiesWithLocation) {
    if (!this._mapContainer || storiesWithLocation.length === 0) {
      this._showError("Tidak ada data lokasi");
      return;
    }

    this._mapContainer.innerHTML = "";
    this._mapContainer.classList.remove("map-loading");
    this._mapInstance = MapInitiator.initDisplayMap(
      "map-display",
      storiesWithLocation
    );
  }

  _initLazyLoad() {
    const lazyImages = [...this._container.querySelectorAll("img.lazyload")];
    lazyImages.forEach((img) => {
      if (img.intersectionObserver) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        });
      });

      observer.observe(img);
      img.intersectionObserver = observer;
    });
  }
}

export default HomeView;
