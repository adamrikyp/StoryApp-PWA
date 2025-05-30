class NotificationHelper {
  static showNotification(message, isError = false) {
    // Cek jika sudah ada notifikasi, hapus dulu
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Buat elemen notifikasi
    const notification = document.createElement("div");
    notification.className = `notification ${isError ? "error" : ""}`;

    // Tambahkan icon (bisa diganti dengan icon library atau emoji)
    const icon = document.createElement("span");
    icon.className = "notification-icon";
    icon.innerHTML = isError ? "❌" : "✅";

    // Tambahkan teks
    const text = document.createElement("span");
    text.textContent = message;

    notification.appendChild(icon);
    notification.appendChild(text);
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Auto hide setelah 5 detik
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
}

export default NotificationHelper;
