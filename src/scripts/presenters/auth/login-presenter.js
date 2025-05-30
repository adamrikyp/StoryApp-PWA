// src/scripts/presenters/auth/login-presenter.js
import { login } from "../../data/api.js";

class LoginPresenter {
  constructor({ view }) {
    this._view = view;
  }

  async loginUser({ email, password }) {
    this._view.clearError();

    if (!email || !password) {
      this._view.showError("Email dan password harus diisi.");
      return;
    }

    try {
      this._view.showLoading();

      const result = await login({ email, password });

      this._view.onLoginSuccess(result);
    } catch (error) {
      console.error("LoginPresenter error:", error);
      this._view.showError(error.message || "Login gagal.");
    } finally {
      this._view.hideLoading();
    }
  }
}

export default LoginPresenter;
