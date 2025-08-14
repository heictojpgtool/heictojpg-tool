// File selection & drag-drop
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const convertBtn = document.getElementById("convert-btn");
const downloadBtn = document.getElementById("download-btn");

let selectedFiles = [];
let convertedImages = [];

// Prevent defaults for drag events
["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropZone.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Highlight on drag over
["dragenter", "dragover"].forEach(eventName => {
  dropZone.addEventListener(eventName, () => dropZone.classList.add("highlight"));
});
["dragleave", "drop"].forEach(eventName => {
  dropZone.addEventListener(eventName, () => dropZone.classList.remove("highlight"));
});

// Handle dropped files
dropZone.addEventListener("drop", e => {
  handleFiles(e.dataTransfer.files);
});

// Handle input selection
fileInput.addEventListener("change", e => {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  let fileArray = Array.from(files);
  if (selectedFiles.length + fileArray.length > 5) {
    alert("You can only upload up to 5 images at a time.");
    return;
  }
  fileArray.forEach(file => {
    if (/\.(heic|jpg|jpeg)$/i.test(file.name)) {
      selectedFiles.push(file);
    } else {
      alert("Only HEIC and JPG images are allowed.");
    }
  });
  updateUI();
}

function updateUI() {
  if (selectedFiles.length > 0) {
    convertBtn.disabled = false;
  }
}

// Convert button
convertBtn.addEventListener("click", async () => {
  convertedImages = [];
  for (let file of selectedFiles) {
    if (file.name.toLowerCase().endsWith(".heic")) {
      const blob = await heicToJpg(file);
      convertedImages.push({ name: file.name.replace(/\.heic$/i, ".jpg"), blob });
    } else {
      convertedImages.push({ name: file.name, blob: file });
    }
  }
  downloadBtn.disabled = false;
  alert("Conversion complete!");
});

// Simple HEIC to JPG conversion in browser using heic2any
async function heicToJpg(file) {
  return new Promise(async (resolve, reject) => {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9
      });
      resolve(convertedBlob);
    } catch (err) {
      reject(err);
    }
  });
}

// Download button
downloadBtn.addEventListener("click", () => {
  convertedImages.forEach(img => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(img.blob);
    link.download = img.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
