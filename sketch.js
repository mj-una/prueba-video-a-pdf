
	import processFrames from "./processFrames.js";
	import getLayoutArgsFactory from "./getLayoutArgs.js";
	import getFiducialMarkers from "./getFiducialMarkers.js";
	const { jsPDF } = window.jspdf;

	// dom
	const inputFile = document.querySelector("#inputFile");
	const inputBtn = document.querySelector("#inputBtn");
	const video = document.querySelector("#hiddenVideo");
	const inputFpp = document.querySelector("#fpp");
	const inputFps = document.querySelector("#fps");

	const RESOLU = 400;

  window.setup = () => {
    createCanvas(10, 10);
		pixelDensity(1);
		handleResize();
		displayMode(MAXED);
		mouseX = Infinity;
		background(255);

		const { fiducialMarkers, ...freeArea } = getFiducialMarkers(1.8);
		const outputBuffer = createGraphics(1240, 1754);
		outputBuffer.background(255);
		
		inputBtn.addEventListener("click", e => {
			e.preventDefault();

			const file = inputFile.files[0];
			if (!file) return;

			const framesPerSecond = Number(inputFps.value) || 12;
			const framesPerPage = Number(inputFpp.value) || 6;

			

			const getLayoutArgs = getLayoutArgsFactory();
			const layoutArgs = getLayoutArgs(freeArea, framesPerPage);

			const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
			const url = URL.createObjectURL(file);
			video.src = url;

			const config = {
				framesPerSecond,
				framesPerPage,
				layoutArgs,
				fiducialMarkers,
				pageWidth: doc.internal.pageSize.getWidth(),
				pageHeight: doc.internal.pageSize.getHeight(),
			}

			video.addEventListener("loadedmetadata", async () => {
				await processFrames(doc, outputBuffer, config, video);
				URL.revokeObjectURL(file);
			}, { once: true });
		});
  }

  window.draw = () => {
		const mod255 = frameCount % 255;
		background(mod255, 100, 400 - mod255, 10);
		fill(255, 5);
		circle(0, 0, mod255);
		circle(0, height, mod255);
		circle(width, height, mod255);
		circle(width, 0, mod255);
		fill(255, 15);
		circle(mouseX, mouseY, 255 - mod255);
	}

	function handleResize() {
		requestAnimationFrame(() => {
			const vpw = window.visualViewport?.width ?? window.innerWidth;
			const vph = window.visualViewport?.height ?? window.innerHeight;
			const prp = vpw / vph;
			const isVert = prp < 1;
			const maxSize = isVert
				? RESOLU * vph / vpw
				: RESOLU * prp;

			// cambiar body

			isVert
				? resizeCanvas(RESOLU, maxSize)
				: resizeCanvas(maxSize, RESOLU);
				
			background(255);
		});
	}

	(window.visualViewport ?? window).addEventListener("resize", handleResize);
