let files = [];

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const convertBtn = document.getElementById("convert-btn");
const preview = document.getElementById("preview");

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.background = "#eef5ff";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.background = "white";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.background = "white";
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
});

function handleFiles(selectedFiles) {
    files = [...files, ...selectedFiles];
    if (files.length > 0) {
        convertBtn.disabled = false;
    }
    preview.innerHTML = "";
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

convertBtn.addEventListener("click", async () => {
    for (const file of files) {
        if (file.type === "image/heic" || file.name.endsWith(".heic")) {
            const converted = await heic2any({ blob: file, toType: "image/jpeg" });
            downloadFile(converted, file.name.replace(/\.heic$/i, ".jpg"));
        }
    }
    files = [];
    convertBtn.disabled = true;
    preview.innerHTML = "";
});

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
