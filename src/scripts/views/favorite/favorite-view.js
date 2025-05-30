// src/scripts/views/favorite/favorite-view.js
import {
  createStoryItemTemplate,
  createErrorTemplate,
  createLoaderTemplate,
} from "../../utils/template-creator"; // Import template creator

class FavoriteView {
  constructor(containerSelector) {
    this._container = document.querySelector(containerSelector);
    if (!this._container) {
      throw new Error(`Container "${containerSelector}" not found`);
    }
  }

  renderInitialState() {
    this._container.innerHTML = `
            <section class="container">
                <h1 class="page-title">Daftar Cerita Favorit</h1>
                <div id="favorite-stories" class="story-list">
                    ${createLoaderTemplate()}
                </div>
            </section>
        `;
    this._storiesContainer = this._container.querySelector("#favorite-stories");
  }

  updateUI({ loading = false, favorites = null, error = null }) {
    if (loading) {
      this._showLoading();
    }
    if (error) {
      this._showError(error);
    }
    if (favorites) {
      this._showFavorites(favorites);
    }
  }

  _showLoading() {
    if (this._storiesContainer) {
      this._storiesContainer.innerHTML = createLoaderTemplate();
    }
  }

  _showError(message) {
    if (this._storiesContainer) {
      this._storiesContainer.innerHTML = createErrorTemplate(message);
    }
  }

  _showFavorites(favorites) {
    if (!this._storiesContainer) return;

    this._storiesContainer.innerHTML =
      favorites.length > 0
        ? favorites.map((story) => createStoryItemTemplate(story)).join("")
        : createErrorTemplate("Belum ada cerita favorit.");

    this._initLazyLoad();
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

  cleanup() {
    this._container.innerHTML = "";
  }
}

export default FavoriteView;
