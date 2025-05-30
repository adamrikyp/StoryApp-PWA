// src/scripts/presenters/favorite-button-presenter.js
// File ini bertanggung jawab untuk logika tombol favorit di halaman detail cerita.

import FavoriteIdb from "../data/favorite-idb.js";
import {
  createFavoriteButton,
  createFavoritedButton,
} from "../utils/template-creator.js";

export default class FavoriteButtonPresenter {
  /**
   * @param {object} options
   * @param {object} options.story - Objek cerita lengkap yang akan difavoritkan/dihapus.
   * @param {HTMLElement} options.buttonContainer - Elemen DOM tempat tombol favorit akan dirender.
   */
  constructor({ story, buttonContainer }) {
    this._story = story;
    // Pastikan story.id ada sebelum mengaksesnya
    this._id = story ? story.id : null;
    this._container = buttonContainer;
  }

  /**
   * Menginisialisasi presenter, memeriksa status favorit, dan merender tombol.
   */
  async initialize() {
    // Hanya lanjutkan jika ID cerita valid
    if (this._id) {
      const isFavorited = await FavoriteIdb.isFavorited(this._id);
      this._renderButton(isFavorited);
    } else {
      console.warn(
        "FavoriteButtonPresenter: Story ID is not available. Cannot initialize button."
      );
      // Opsional: Sembunyikan tombol atau tampilkan pesan error
      this._container.innerHTML =
        '<p class="text-red-500">Tombol favorit tidak tersedia.</p>';
    }
  }

  /**
   * Merender tombol favorit atau sudah difavoritkan berdasarkan status.
   * @param {boolean} isFavorited - Status favorit cerita.
   */
  _renderButton(isFavorited) {
    // Mengisi container dengan template tombol yang sesuai
    this._container.innerHTML = isFavorited
      ? createFavoritedButton()
      : createFavoriteButton();

    // Menambahkan event listener ke tombol yang baru dirender
    const button = this._container.querySelector("button");
    if (button) {
      // Pastikan tombol ditemukan
      button.addEventListener("click", async () => {
        // Pastikan story dan id tersedia sebelum melakukan operasi IndexedDB
        if (this._story && this._id) {
          const currentlyFavorited = await FavoriteIdb.isFavorited(this._id);
          if (currentlyFavorited) {
            // Jika sudah difavoritkan, hapus dari favorit
            await FavoriteIdb.delete(this._id);
            console.log(`Story ID ${this._id} dihapus dari favorit.`);
          } else {
            // Jika belum difavoritkan, tambahkan ke favorit (simpan seluruh objek cerita)
            await FavoriteIdb.put(this._story);
            console.log(`Story ID ${this._id} ditambahkan ke favorit.`);
          }
          // Render ulang tombol untuk memperbarui tampilan
          this._renderButton(!currentlyFavorited);
        } else {
          console.error(
            "FavoriteButtonPresenter: Story data or ID is missing for click event."
          );
        }
      });
    } else {
      console.error(
        "FavoriteButtonPresenter: Button element not found after rendering."
      );
    }
  }
}
