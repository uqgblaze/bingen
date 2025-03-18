// imagePicker.js

// --- Local Image Grid & Modal Setup ---

// Render the local image grid based on the imageLibrary array
function renderLocalImageGrid() {
  const container = document.getElementById('localImageGrid');
  container.innerHTML = "";
  const categories = [...new Set(imageLibrary.map(img => img.category))];
  categories.forEach(category => {
    const subheading = document.createElement('div');
    subheading.classList.add('grid-subheading');
    subheading.textContent = category;
    container.appendChild(subheading);
    const imagesInCategory = imageLibrary.filter(img => img.category === category);
    imagesInCategory.forEach(img => {
      const item = document.createElement('div');
      item.classList.add('image-grid-item');
      const thumbnail = document.createElement('img');
      thumbnail.src = img.url;
      thumbnail.alt = img.alt;
      const caption = document.createElement('p');
      caption.textContent = img.alt;
      // Open cropping tool when image is clicked
      item.addEventListener('click', () => {
        openCroppingTool(img.url, 'local');
      });
      item.appendChild(thumbnail);
      item.appendChild(caption);
      container.appendChild(item);
    });
  });
}

// Cache commonly used modal elements
const overlay = document.getElementById('imagePickerOverlay');
const modalContent = document.getElementById('modalContent');
const openLocalPickerBtn = document.getElementById('openLocalPickerBtn');
const openUnsplashPickerBtn = document.getElementById('openUnsplashPickerBtn');

// Modal open/close functions
function openModal() {
  overlay.classList.add('active');
}
function closeModal() {
  overlay.classList.remove('active');
}

// Custom URL selection
const customImageUrlInput = document.getElementById('customImageUrl');
const selectCustomImageBtn = document.getElementById('selectCustomImageBtn');
function selectCustomImage() {
  const url = customImageUrlInput.value.trim();
  if(url){
    openCroppingTool(url, 'custom');
  }
}

// Event listeners for opening the modal
openLocalPickerBtn.addEventListener('click', () => {
  openModal();
  showLocalPicker();
});
openUnsplashPickerBtn.addEventListener('click', () => {
  openModal();
  showUnsplashPicker();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && overlay.classList.contains('active')) {
    closeModal();
  }
});

// Display the local image picker in the modal
function showLocalPicker() {
  modalContent.innerHTML = `
      <button class="close-modal-button" id="closeImagePickerBtn" aria-label="Close modal">X</button>
      <h2 id="imagePickerTitle">Choose an Image</h2>
      <div class="custom-url-section">
        <label for="customImageUrl">Custom URL:</label>
        <input type="text" id="customImageUrl" placeholder="Paste or enter your own URL">
        <button type="button" id="selectCustomImageBtn">Select</button>
      </div>
      <div class="image-grid" id="localImageGrid"></div>
  `;
  document.getElementById('closeImagePickerBtn').addEventListener('click', closeModal);
  document.getElementById('selectCustomImageBtn').addEventListener('click', selectCustomImage);
  renderLocalImageGrid();
}

// --- Unsplash Integration ---

const UNSPLASH_ACCESS_KEY = "c5O1Qwh_6wwO57xx5T1bVtOS12mTZCuOfsGLMoE4S6M";
let unsplashQuery = "";
let unsplashPage = 1;
let unsplashUser = null; // Used for cropping tool credit

function showUnsplashPicker() {
  modalContent.innerHTML = `
      <button class="close-modal-button" id="closeModalBtnUnsplash" aria-label="Close modal">X</button>
      <h2>Search Unsplash</h2>
      <div class="unsplash-search-section">
        <label for="unsplashSearchInput">Search:</label>
        <input type="text" id="unsplashSearchInput" placeholder="Enter keyword">
        <button type="button" id="unsplashSearchBtn">Search</button>
        <button type="button" id="unsplashBackBtn">Back</button>
      </div>
      <div class="image-grid" id="unsplashResultsContainer"></div>
      <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <button type="button" id="unsplashPrevBtn">Previous</button>
        <button type="button" id="unsplashNextBtn">Next</button>
      </div>
  `;
  document.getElementById('closeModalBtnUnsplash').addEventListener('click', closeModal);
  document.getElementById('unsplashBackBtn').addEventListener('click', showLocalPicker);
  document.getElementById('unsplashSearchBtn').addEventListener('click', () => {
      unsplashQuery = document.getElementById('unsplashSearchInput').value.trim();
      unsplashPage = 1;
      if(unsplashQuery) {
        searchUnsplash(unsplashQuery, unsplashPage);
      }
  });
  document.getElementById('unsplashPrevBtn').addEventListener('click', () => {
    if(unsplashPage > 1) {
      unsplashPage--;
      searchUnsplash(unsplashQuery, unsplashPage);
    }
  });
  document.getElementById('unsplashNextBtn').addEventListener('click', () => {
    unsplashPage++;
    searchUnsplash(unsplashQuery, unsplashPage);
  });
}

function searchUnsplash(query, page) {
  const url = `https://api.unsplash.com/search/photos?client_id=${UNSPLASH_ACCESS_KEY}&query=${encodeURIComponent(query)}&orientation=landscape&page=${page}`;
  fetch(url)
      .then(response => response.json())
      .then(data => {
          renderUnsplashResults(data.results);
      })
      .catch(err => {
          console.error("Unsplash API error:", err);
      });
}

function renderUnsplashResults(results) {
  const container = document.getElementById('unsplashResultsContainer');
  container.innerHTML = "";
  if(results.length === 0){
    container.innerHTML = "<p>No results found.</p>";
    return;
  }
  results.forEach(result => {
    const item = document.createElement('div');
    item.classList.add('image-grid-item');
    const img = document.createElement('img');
    img.src = result.urls.thumb;
    img.alt = result.alt_description || "Unsplash Image";
    const caption = document.createElement('p');
    caption.textContent = result.user.name;
    item.appendChild(img);
    item.appendChild(caption);
    // When clicked, open the cropping tool passing unsplash source and user info for credit
    item.addEventListener('click', () => {
      openCroppingTool(result.urls.regular, 'unsplash', result.user);
    });
    container.appendChild(item);
  });
}

// --- Cropping Tool ---

// Global variables for cropping context
let croppingSource = ''; // 'unsplash', 'local', or 'custom'
let topOverlay, bottomOverlay, leftOverlay, rightOverlay;

function openCroppingTool(imageUrl, source, userInfo = null) {
  croppingSource = source;
  unsplashUser = userInfo;
  modalContent.innerHTML = `
      <button class="close-modal-button" id="closeCropModalBtn" aria-label="Close modal">X</button>
      <h2>Crop Image</h2>
      <p>Drag the box to select the area you want to crop, then click "Crop".</p>
      <div id="cropContainer">
        <img id="croppingImage" src="${imageUrl}" crossorigin="anonymous">
        <div id="cropBox">
          <div class="resize-handle handle-tl"></div>
          <div class="resize-handle handle-tr"></div>
          <div class="resize-handle handle-bl"></div>
          <div class="resize-handle handle-br"></div>
        </div>
      </div>
      <div style="margin-top:10px;">
        <button type="button" id="cropBtn">Crop</button>
        <button type="button" id="cancelCropBtn">Cancel</button>
      </div>
  `;
  document.getElementById('closeCropModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelCropBtn').addEventListener('click', () => {
    if(croppingSource === 'unsplash'){
      showUnsplashPicker();
      document.getElementById('unsplashSearchInput').value = unsplashQuery;
      searchUnsplash(unsplashQuery, unsplashPage);
    } else {
      showLocalPicker();
    }
  });
  initCropTool();
}

function initCropTool() {
  const cropBox = document.getElementById('cropBox');
  const croppingImage = document.getElementById('croppingImage');
  const cropContainer = document.getElementById('cropContainer');

  // Create overlay divs for dimming areas outside the crop box
  topOverlay = document.createElement('div');
  bottomOverlay = document.createElement('div');
  leftOverlay = document.createElement('div');
  rightOverlay = document.createElement('div');
  [topOverlay, bottomOverlay, leftOverlay, rightOverlay].forEach(overlayEl => {
    overlayEl.classList.add('crop-overlay');
    cropContainer.appendChild(overlayEl);
  });

  // Once the image loads, set the crop box to cover the full image
  croppingImage.onload = () => {
    const rect = croppingImage.getBoundingClientRect();
    cropBox.style.left = "0px";
    cropBox.style.top = "0px";
    cropBox.style.width = rect.width + "px";
    cropBox.style.height = rect.height + "px";
    updateCropOverlays();
  };

  // Dragging the crop box
  let isDragging = false;
  let startX, startY, startLeft, startTop;
  cropBox.addEventListener('mousedown', (e) => {
    if(e.target.classList.contains('resize-handle')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseInt(window.getComputedStyle(cropBox).left);
    startTop = parseInt(window.getComputedStyle(cropBox).top);
    e.preventDefault();
  });
  document.addEventListener('mousemove', dragCropBox);
  document.addEventListener('mouseup', () => { isDragging = false; });

  function dragCropBox(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const croppingRect = croppingImage.getBoundingClientRect();
    const boxWidth = parseInt(cropBox.style.width);
    const boxHeight = parseInt(cropBox.style.height);
    let newLeft = startLeft + dx;
    let newTop = startTop + dy;
    newLeft = Math.max(0, Math.min(newLeft, croppingRect.width - boxWidth));
    newTop = Math.max(0, Math.min(newTop, croppingRect.height - boxHeight));
    cropBox.style.left = newLeft + "px";
    cropBox.style.top = newTop + "px";
    updateCropOverlays();
  }

  // Resizing the crop box with handles
  let isResizing = false, currentHandle, startWidth, startHeight;
  const handles = cropBox.querySelectorAll('.resize-handle');
  handles.forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      isResizing = true;
      currentHandle = handle;
      startX = e.clientX;
      startY = e.clientY;
      const style = window.getComputedStyle(cropBox);
      startWidth = parseInt(style.width);
      startHeight = parseInt(style.height);
      startLeft = parseInt(style.left);
      startTop = parseInt(style.top);
      document.addEventListener('mousemove', resizeCropBox);
      document.addEventListener('mouseup', stopResize);
    });
  });
  function resizeCropBox(e) {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const croppingRect = croppingImage.getBoundingClientRect();
    let newLeft = startLeft, newTop = startTop, newWidth = startWidth, newHeight = startHeight;
    if (currentHandle.classList.contains('handle-br')) {
      newWidth = startWidth + dx;
      newHeight = startHeight + dy;
    } else if (currentHandle.classList.contains('handle-tr')) {
      newWidth = startWidth + dx;
      newTop = startTop + dy;
      newHeight = startHeight - dy;
    } else if (currentHandle.classList.contains('handle-bl')) {
      newLeft = startLeft + dx;
      newWidth = startWidth - dx;
      newHeight = startHeight + dy;
    } else if (currentHandle.classList.contains('handle-tl')) {
      newLeft = startLeft + dx;
      newTop = startTop + dy;
      newWidth = startWidth - dx;
      newHeight = startHeight - dy;
    }
    newLeft = Math.max(0, newLeft);
    newTop = Math.max(0, newTop);
    if (newLeft + newWidth > croppingRect.width) {
      newWidth = croppingRect.width - newLeft;
    }
    if (newTop + newHeight > croppingRect.height) {
      newHeight = croppingRect.height - newTop;
    }
    newWidth = Math.max(20, newWidth);
    newHeight = Math.max(20, newHeight);
    cropBox.style.left = newLeft + "px";
    cropBox.style.top = newTop + "px";
    cropBox.style.width = newWidth + "px";
    cropBox.style.height = newHeight + "px";
    updateCropOverlays();
  }
  function stopResize(e) {
    isResizing = false;
    document.removeEventListener('mousemove', resizeCropBox);
    document.removeEventListener('mouseup', stopResize);
  }
  function updateCropOverlays() {
    const imgRect = croppingImage.getBoundingClientRect();
    const boxRect = cropBox.getBoundingClientRect();
    const containerRect = document.getElementById('cropContainer').getBoundingClientRect();
    const offsetX = boxRect.left - containerRect.left;
    const offsetY = boxRect.top - containerRect.top;
    topOverlay.style.left = "0px";
    topOverlay.style.top = "0px";
    topOverlay.style.width = imgRect.width + "px";
    topOverlay.style.height = offsetY + "px";
    bottomOverlay.style.left = "0px";
    bottomOverlay.style.top = (offsetY + boxRect.height) + "px";
    bottomOverlay.style.width = imgRect.width + "px";
    bottomOverlay.style.height = (imgRect.height - offsetY - boxRect.height) + "px";
    leftOverlay.style.left = "0px";
    leftOverlay.style.top = offsetY + "px";
    leftOverlay.style.width = offsetX + "px";
    leftOverlay.style.height = boxRect.height + "px";
    rightOverlay.style.left = (offsetX + boxRect.width) + "px";
    rightOverlay.style.top = offsetY + "px";
    rightOverlay.style.width = (imgRect.width - offsetX - boxRect.width) + "px";
    rightOverlay.style.height = boxRect.height + "px";
  }
  // When "Crop" is clicked, crop the image and pass the cropped image data to the preview
  document.getElementById('cropBtn').addEventListener('click', () => {
    const img = croppingImage;
    const imgRect = img.getBoundingClientRect();
    const boxRect = cropBox.getBoundingClientRect();
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
    const cropX = (boxRect.left - imgRect.left) * scaleX;
    const cropY = (boxRect.top - imgRect.top) * scaleY;
    const cropWidth = boxRect.width * scaleX;
    const cropHeight = boxRect.height * scaleY;
    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    const croppedDataUrl = canvas.toDataURL();
    let creditMarkup = "";
    if(croppingSource === 'unsplash' && unsplashUser) {
      creditMarkup = `Photo credit: <a href="${unsplashUser.links.html}" target="_blank">${unsplashUser.name}</a> on <a href="https://unsplash.com" target="_blank">Unsplash</a>`;
    }
    // Pass the cropped image to the preview insertion function (in preview.js)
    selectImageUrl(croppedDataUrl, creditMarkup);
  });
}
window.selectImageUrl = selectImageUrl;
