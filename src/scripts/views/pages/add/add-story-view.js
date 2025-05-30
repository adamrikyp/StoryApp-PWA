// src/scripts/views/pages/add/add-story-view.js
import MapInitiator from "../../../utils/map-initiator.js";

export default class AddStoryView {
  #rootElement; // Reference to the root element of the rendered page
  #form;
  #descriptionInput;
  #startCameraBtn;
  #captureBtn;
  #videoPreview;
  #photoCanvas;
  #photoResult;
  #selectedCoords;
  #loadingIndicator;
  #errorMessageElement;
  #cameraErrorElement;
  #submitButton;
  #fileInput; // This is the hidden file input
  #uploadFileBtn; // This is the button the user clicks
  #mapPickerId = "map-picker"; // Keep the ID here

  constructor() {
    // Elements will be obtained later in _getElements, called by init()
  }

  getTemplate() {
    // Added a clear ID to the root section for easy finding in afterRender
    return `
      <section id="add-story-page-root" class="container">
        <h2>Tambah Cerita Baru</h2>
        <form id="addStoryForm" class="add-story-form">
          <div class="form-group">
            <label for="storyDescription">Deskripsi:</label>
            <textarea id="storyDescription" name="description" required></textarea>
            <span class="validation-message" aria-live="polite"></span>
          </div>

          <div class="form-group">
            <label>Foto:</label>
            <div class="camera-controls">
              <button type="button" id="startCameraBtn" aria-label="Buka Kamera">Buka Kamera</button>
              <button type="button" id="captureBtn" style="display: none;" aria-label="Ambil Foto">Ambil Foto</button>
              <span class="or-divider">atau</span>
              <input type="file" id="fileInput" accept="image/*" style="display: none;">
              <button type="button" id="uploadFileBtn" aria-label="Upload dari file">Upload File</button>
            </div>
            <video id="video-preview" autoplay playsinline style="display: none; max-width: 100%; margin-top: 10px;" aria-hidden="true"></video>
            <canvas id="photoCanvas" style="display: none;" aria-hidden="true"></canvas>
            <img id="photo-result" alt="Hasil foto pratinjau" style="display: none; max-width: 100%; margin-top: 10px;">
            <span id="camera-error" class="error-message" aria-live="assertive" style="display: none;"></span>
          </div>

          <div class="form-group">
            <label>Lokasi (Opsional):</label>
            <p id="map-instruction">Klik pada peta untuk memilih lokasi cerita.</p>
            <div id="${this.#mapPickerId}" style="height: 300px;"></div>
            <p id="selected-coords" style="margin-top: 5px;">Koordinat: Belum dipilih</p>
          </div>

          <div class="form-submit">
            <button type="submit">Bagikan Cerita</button>
            <div id="loading-indicator" style="display: none;" aria-label="Sedang mengirim cerita">Mengirim...</div>
            <div id="error-message" class="error-message" aria-live="assertive" style="color: var(--danger); margin-top: 10px;"></div>
          </div>
        </form>
      </section>
    `;
  }

  /**
   * Initializes the view after its template has been rendered into the DOM.
   * Gets references to DOM elements.
   * @param {HTMLElement} rootElement - The root element of the rendered page template.
   */
  init(rootElement) {
    this.#rootElement = rootElement;
    if (!this.#rootElement) {
      console.error("AddStoryView: Root element not provided.");
      return;
    }
    this._getElements(); // Now safe to get elements as rootElement is in DOM
  }

  /**
   * Gets references to all necessary DOM elements relative to the root element.
   */
  _getElements() {
    if (!this.#rootElement) {
      console.error("AddStoryView: Cannot get elements, root element is null.");
      return;
    }
    this.#form = this.#rootElement.querySelector("#addStoryForm");
    this.#descriptionInput =
      this.#rootElement.querySelector("#storyDescription");
    this.#startCameraBtn = this.#rootElement.querySelector("#startCameraBtn");
    this.#captureBtn = this.#rootElement.querySelector("#captureBtn");
    this.#videoPreview = this.#rootElement.querySelector("#video-preview");
    this.#photoCanvas = this.#rootElement.querySelector("#photoCanvas");
    this.#photoResult = this.#rootElement.querySelector("#photo-result");
    this.#selectedCoords = this.#rootElement.querySelector("#selected-coords");
    this.#loadingIndicator =
      this.#rootElement.querySelector("#loading-indicator");
    this.#errorMessageElement =
      this.#rootElement.querySelector("#error-message");
    this.#cameraErrorElement = this.#rootElement.querySelector("#camera-error");
    this.#submitButton = this.#rootElement.querySelector(
      'button[type="submit"]'
    );
    this.#fileInput = this.#rootElement.querySelector("#fileInput");
    this.#uploadFileBtn = this.#rootElement.querySelector("#uploadFileBtn"); // Get the button element

    // Map element needs a global ID or can be queried relative to root
    if (!this.#rootElement.querySelector(`#${this.#mapPickerId}`)) {
      console.error(
        `AddStoryView: Map container element with ID "${
          this.#mapPickerId
        }" not found within root element.`
      );
      // Handle this error appropriately
    }
  }

  /**
   * Binds event listeners... (remains the same)
   */
  bindEventListeners({
    onSubmit,
    onStartCameraClick,
    onCaptureClick,
    onUploadFileClick, // The handler for the upload *button* click
    onFileInputChange, // The handler for the file *input* change
    onMapClick,
  }) {
    if (!this.#form || !this.#startCameraBtn /* ... */) {
      console.error(
        "AddStoryView: DOM elements not found. Ensure init() was called."
      );
      return;
    }

    if (this.#form) this.#form.addEventListener("submit", onSubmit);
    if (this.#startCameraBtn)
      this.#startCameraBtn.addEventListener("click", onStartCameraClick);
    if (this.#captureBtn)
      this.#captureBtn.addEventListener("click", onCaptureClick);

    // Bind handler to the upload *button*
    if (this.#uploadFileBtn)
      this.#uploadFileBtn.addEventListener("click", onUploadFileClick);

    // Bind handler to the hidden file *input* change event
    if (this.#fileInput)
      this.#fileInput.addEventListener("change", onFileInputChange);

    // Initialize map picker and bind its click event
    const mapElement = this.#rootElement.querySelector(`#${this.#mapPickerId}`);
    if (mapElement) {
      MapInitiator.initPickerMap(this.#mapPickerId, onMapClick);
    } else {
      console.error(
        `AddStoryView: Map container element with ID "${
          this.#mapPickerId
        }" not found during event binding.`
      );
    }
  }

  // --- Methods for getting input from the View (remain the same) ---
  getDescription() {
    return this.#descriptionInput ? this.#descriptionInput.value : "";
  }
  getFileInput() {
    return this.#fileInput ? this.#fileInput.files[0] : null;
  } // Gets the selected file
  getVideoElement() {
    return this.#videoPreview;
  }
  getCanvasElement() {
    return this.#photoCanvas;
  }

  // --- New method to trigger the hidden file input click ---
  triggerFileInputClick() {
    if (this.#fileInput) {
      this.#fileInput.click();
    } else {
      console.error(
        "AddStoryView: File input element not available to trigger click."
      );
    }
  }

  // --- Methods for updating the View (remain the same) ---
  showLoadingIndicator() {
    /* ... */
  }
  hideLoadingIndicator() {
    /* ... */
  }
  showErrorMessage(message) {
    /* ... */
  }
  hideErrorMessage() {
    /* ... */
  }
  showCameraErrorMessage(message) {
    /* ... */
  }
  hideCameraErrorMessage() {
    /* ... */
  }
  setSubmitButtonState(disabled) {
    /* ... */
  }
  showVideoPreview(stream) {
    /* ... */
  }
  hideVideoPreview() {
    /* ... */
  }
  showPhotoPreview(url) {
    /* ... */
  }
  hidePhotoPreview() {
    /* ... */
  }
  showCaptureButton() {
    /* ... */
  }
  hideCaptureButton() {
    /* ... */
  }
  showStartCameraButton() {
    /* ... */
  }
  hideStartCameraButton() {
    /* ... */
  }
  showCoordinates(lat, lng) {
    /* ... */
  }
  alertSuccess(message) {
    /* ... */
  }
  navigateTo(path) {
    /* ... */
  }

  /**
   * Cleans up resources like map and camera stream.
   */
  cleanup() {
    console.log("AddStoryView cleanup executed.");
    this.hideVideoPreview(); // Stops the stream if active
    this.hidePhotoPreview(); // Revokes blob URL if active

    // Ensure MapInitiator cleanup is called correctly
    MapInitiator.removeMap(this.#mapPickerId);

    // No need to remove event listeners here if the rootElement is removed from DOM
    // Assuming the router removes the page's root element when navigating away.
  }
}
