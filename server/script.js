const imageUpload = document.getElementById('imageUpload')
// const fs = require('fs');
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
  document.body.append('Loaded')
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
  })
}

// function loadLabeledImages() {
 
//   // const labels = ['nisha', 'parkhi','anupam', 'Jai', 'maroti', 'ayush']
//   // const labels = ['ayush']
// //   const labels = [];

// // for (let i = 1; i <= 60; i++) {
// //     // Pad the number with leading zeros if needed
// //     const paddedNumber = i.toString().padStart(2, '0');
// //     const label = `211260${paddedNumber}`;
// //     labels.push(label);
// // }
// const labels = ['21126030', '21126049', '21126043', '21126027', '21126006', '21126022', '21126011', '21126013', '21126005', '21126004', '21126033', '21126050', '21126051', '21126044', '21126003', '21126010']
// console.log(labels);
//   return Promise.all(
//     labels.map(async label => {
//       const descriptions = []
//       for (let i = 1; i <= 2; i++) {
//         const img = await faceapi.fetchImage(`labeled_images/${label}/${i}.jpg`)
//         // const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/Parkhi19/face-api/main/labeled_images/${label}/${i}.jpg`)
//         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
//         descriptions.push(detections.descriptor)
//       }

//       return new faceapi.LabeledFaceDescriptors(label, descriptions)
//     })
//   )
// }

function loadLabeledImages() {
  const labels = ['21126030', '21126049', '21126043', '21126027', '21126006', '21126022', '21126011', '21126013', '21126005', '21126004', '21126033', '21126050', '21126051', '21126044', '21126003', '21126010', '21126033', '21126012', '21126015'];

  return Promise.all(
    labels.map(async label => {
      const descriptions = [];

      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`labeled_images/${label}/${i}.jpg`);
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        // Check if a face is detected before accessing the descriptor
        if (detections) {
          descriptions.push(detections.descriptor);
        } else {
          console.log(`No face detected in ${label}/${i}.jpg`);
        }
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}


