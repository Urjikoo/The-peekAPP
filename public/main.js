var constraints = { video: { facingMode: "user" }, audio: false };
const cameraView = document.querySelector("#cameraView"),
  cameraOutput = document.querySelector("#camera--output"),
  cameraSensor = document.querySelector("#cameraSensor"),
  cameraTrigger = document.querySelector("#camera--trigger");

function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      track = stream.getTracks()[0];
      cameraView.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Oops. Something is broken.", error);
    });
}
cameraTrigger.onclick = function () {

  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
  let imageURL=cameraSensor.toDataURL("image/webp").replace("image/png", "image/octet-stream")


  fetch("/result", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageURL: imageURL,
      }),
    })
    .then(function (response) {
       // const { nameOfObject, objectURL } = response;

       window.location.href = response.url
          // apiCall()

          console.log(response)
        })

};
window.addEventListener("load", cameraStart, false);
let result1= document.querySelector("#outcome")


// fetch("/result", {
//   method: "post",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     imageURL: imageURL,
//   }),
// })
// .then(function (response) {
//    const { nameOfObject, objectURL } = response;
//    const url = `result?nameOfObject=${encodeURIComponent(nameOfObject)}&objectURL=${encodeURIComponent(objectURL)}`;
//    window.location.href = url
//
// })
