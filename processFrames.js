import getMetadataQR from "./getMetadataQR.js";

/*
  drawCurrentPage
  drawMetadataQR
  jumpToTimestamp
  processFrames (default)
*/

//_______
const drawCurrentPage = async (doc, buffer, config) => {
  const { fiducialMarkers, pageWidth, pageHeight } = config;
  buffer.image(fiducialMarkers, 0, 0);

  const pngBlob = await buffer.canvas.convertToBlob({ type: "image/png" });
  const pngUrl = URL.createObjectURL(pngBlob);
  
  await new Promise(resolve => {
    const img = new Image();
    img.src = pngUrl;
    img.onload = () => {
      try {
        doc.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
        resolve();
      } finally {
        URL.revokeObjectURL(pngUrl);
        buffer.background(255);
      }
    };
  });
};

//_______
const drawMetadataQR = async (buffer, config) => {
  const qr = await getMetadataQR(config);
  const layoutQR = config.layoutSize[0];
  const x = layoutQR[0];
  const y = layoutQR[1];
  const m = Math.min(layoutQR[2], layoutQR[3]);
  buffer.image(qr, x, y, m, m);
}

//_______
const jumpToTimestamp = async (video, timestamp) => {
  return new Promise(resolve => {
    const handler = () => {
      video.removeEventListener("seeked", handler);
      resolve();
    };
    video.addEventListener("seeked", handler);
    video.currentTime = timestamp;
  });
}

//_______
const processFrames = async (doc, buffer, config, video) => {
	const { framesPerSecond, framesPerPage, layoutSize } = config;
	const interval = 1 / framesPerSecond;
	const totalFrames = Math.floor(video.duration * framesPerSecond);
	const maxIndex = framesPerPage - 1;
  const isOneFramePerPage = framesPerPage === 1;
	const totalPages = Math.ceil(totalFrames / framesPerPage);

	// metadata on first index/page
	await drawMetadataQR(buffer, config);
  if (isOneFramePerPage) await drawCurrentPage(doc, buffer, config);

	// main loop
	let currentPage = isOneFramePerPage ? -1 : 0;
	for (let currentFrame = 0; currentFrame < totalFrames; currentFrame++) {
		
		// video seeking
		const timestamp = currentFrame * interval;
		await jumpToTimestamp(video, timestamp);
		
		// q5 hidden canvas
		const frameIndex = (currentFrame + 1) % framesPerPage;
		const args = layoutSize[frameIndex]; // { index: [x, y, w, h, tx, ty] }
    buffer.image(video, args[0], args[1], args[2], args[3]);
    buffer.text(currentFrame, args[4], args[5]);
		
		// last index
		if (frameIndex !== maxIndex || currentPage === totalPages) continue;
		await drawCurrentPage(doc, buffer, config);
		doc.addPage();
		currentPage++;
  }

	// last page
	await drawCurrentPage(doc, buffer, config);

  // download pdf
  doc.save("pruebaVideo.pdf");
}

//_______
export default processFrames;
