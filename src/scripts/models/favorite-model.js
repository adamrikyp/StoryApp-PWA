import FavoriteDB from '../local-db/favorite-db';

const FavoriteModel = {
  async isFavorite(id) {
    const story = await FavoriteDB.get(id);
    return !!story;
  },

  async addFavorite(story) {
    return FavoriteDB.put(story);
  },

  async removeFavorite(id) {
    return FavoriteDB.delete(id);
  },

  async getAllFavorites() {
    return FavoriteDB.getAll();
  },
};

export default FavoriteModel;