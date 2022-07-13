const video = document.getElementById("vid");
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVid);

function startVid() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.log(err)
  );
}
video.addEventListener("play", () => {
    const canvas= faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize={ width: video.width,height:video.height}
    faceapi.matchDimensions(canvas,displaySize)
  setInterval(async () => {
    const detect = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
     // console.log(detect)
     const resized= faceapi.resizeResults(detect,displaySize)
     canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
     faceapi.draw.drawDetections(canvas,resized)
     faceapi.draw.drawFaceLandmarks(canvas,resized)
     faceapi.draw.drawFaceExpressions(canvas,resized)

     

  }, 100);
});
