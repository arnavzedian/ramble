import localforage from "localforage";

function uploadImage() {
  return new Promise((resolve) => {
    let fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.addEventListener("change", doUpload);
    fileInput.setAttribute("multiple", true);
    fileInput.click();

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    function doUpload({ target }) {
      const [file] = target.files;
      toBase64(file).then(resolve);
    }
  });
}

export default uploadImage;
