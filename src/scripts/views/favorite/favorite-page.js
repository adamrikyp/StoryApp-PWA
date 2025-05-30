// src/scripts/views/favorite/favorite-page.js
import FavoritePresenter from "../../presenters/favorite/favorite-presenter";
import FavoriteView from "../../views/favorite/favorite-view";
import FavoriteModel from "../../models/favorite-model"; // Import Model

const FavoritePage = {
  async render() {
    return `
            <div id="favorite-page-container"></div>
        `;
  },

  async afterRender() {
    const view = new FavoriteView("#favorite-page-container");
    const model = FavoriteModel; // Hapus 'new' karena FavoriteModel adalah objek literal
    const presenter = new FavoritePresenter({ view, model });
    await presenter.initialize(); // Panggil method initialize
  },

  cleanup() {
    const container = document.querySelector("#favorite-page-container");
    if (container) {
      container.innerHTML = "";
    }
    // Tambahkan cleanup di presenter dan view jika diperlukan
    // Perhatikan: Re-instantiate presenter dan view di cleanup mungkin tidak ideal
    // Sebaiknya presenter dan view memiliki method cleanup yang dipanggil langsung
    // oleh presenter yang sudah ada, atau diatur oleh router.
    // Untuk saat ini, saya akan biarkan seperti ini agar tidak menimbulkan error baru.
    // const view = new FavoriteView('#favorite-page-container');
    // const presenter = new FavoritePresenter({ view, model: FavoriteModel });
    // presenter.cleanup();
    // view.cleanup();
  },
};

export default FavoritePage;
