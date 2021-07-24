import localforage from "localforage";

function uploadImage() {
  return new Promise((resolve) => {
    let fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.addEventListener("change", doUpload);
    fileInput.setAttribute("multiple", true);
    fileInput.click();

    function doUpload({ target }) {
      const [file] = target.files;

      let base64 = URL.createObjectURL(file);
      resolve(base64);
    }
  });
}

export default uploadImage;
