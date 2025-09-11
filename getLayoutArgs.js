// validateAndScale: ensures rectangles fit inside the area with minimum spacing.
// If they don't fit, resizes them while keeping the original aspect ratio.
const validateAndScale = (cols, rows, minSpacing, sizes) => {
  const { areaWidth, areaHeight, rectWidth, rectHeight } = sizes;

  if (!(areaWidth > 0 && areaHeight > 0 && rectWidth > 0 && rectHeight > 0)) {
    throw new Error("areaWidth, areaHeight, rectWidth and rectHeight must be positive numbers");
  }

  // "desired total size" of all rects (without spacing)
  const desiredWidth = rectWidth * cols;
  const desiredHeight = rectHeight * rows;

  // available space (accounting for minimum spacing)
  const availableWidth = areaWidth - minSpacing * (cols - 1);
  const availableHeight = areaHeight - minSpacing * (rows - 1);

  // ok case: fits without scaling
  if (desiredWidth <= availableWidth && desiredHeight <= availableHeight) {
    return { ...sizes, rescaled: false };
  }

	// not ok case: scaling to fit
  const aspectRatio = rectWidth / rectHeight;
  const overflowX = desiredWidth / Math.max(availableWidth, 1e-9);
  const overflowY = desiredHeight / Math.max(availableHeight, 1e-9);

  let newRectWidth, newRectHeight;
  if (overflowX < overflowY) { // bottleneck is height:
    newRectHeight = availableHeight / rows; // ...adjust height
    newRectWidth = newRectHeight * aspectRatio; // ...derive width
  }
	else { // bottleneck is width:
    newRectWidth = availableWidth / cols; // ...adjust width
    newRectHeight = newRectWidth / aspectRatio; // ...derive height
  }

  return {
    ...sizes,
    rectWidth: Math.max(1, newRectWidth),
    rectHeight: Math.max(1, newRectHeight),
    rescaled: true
  }
}


// getLayoutArgsFactory: factory that returns a function to compute the layout of rectangles
// positioned in a grid inside the area.
const getLayoutArgsFactory = (cols, rows) => {
	cols = Math.max(1, Math.floor(cols));
	rows = Math.max(1, Math.floor(rows));
	const minSpacing = 10;
	
	// factory
	return sizes => {

		const adjusted = validateAndScale(cols, rows, minSpacing, sizes);
		const { areaWidth, areaHeight, rectWidth, rectHeight } = adjusted;
		const rescaled = Boolean(adjusted.rescaled);

		const originalAspectRatio = sizes.rectWidth / sizes.rectHeight;

		// free space left over for separation
		let freeSpaceX = areaWidth - rectWidth * cols;
		let freeSpaceY = areaHeight - rectHeight * rows;

		// spacing between rects (distribute free space)
		let spacingX = cols > 1 ? freeSpaceX / (cols - 1) : 0;
		let spacingY = rows > 1 ? freeSpaceY / (rows - 1) : 0;

		// safeguard: if spacing < minSpacing, reduce rect size to guarantee spacing
		let resized = false;
		if (cols > 1 && spacingX < minSpacing) {
			rectWidth = (areaWidth - minSpacing * (cols - 1)) / cols;
			rectHeight = rectWidth / originalAspectRatio;
			resized = true;
		}
		if (rows > 1 && spacingY < minSpacing) {
			rectHeight = (areaHeight - minSpacing * (rows - 1)) / rows;
			rectWidth = rectHeight * originalAspectRatio;
			resized = true;
		}
		if (resized) {
			freeSpaceX = areaWidth - rectWidth * cols;
			freeSpaceY = areaHeight - rectHeight * rows;
			spacingX = cols > 1 ? freeSpaceX / (cols - 1) : 0;
			spacingY = rows > 1 ? freeSpaceY / (rows - 1) : 0;
			rescaled = true;
		}

		// final offsets
		const offsetX = rectWidth + spacingX;
		const offsetY = rectHeight + spacingY;

		// layout: object with index keys → [x, y, w, h, textX, textY]
		const layout = { rescaled };
		
		let index = 0;
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const posX = col * offsetX;
				const posY = row * offsetY;
				const textX = posX + rectWidth * 0.5;  // center of rect
				const textY = posY + rectHeight; // bottom of rect

				layout[index] = [posX, posY, rectWidth, rectHeight, textX, textY];
				index++;
			}
		}

		return layout;
	}
}

export default getLayoutArgsFactory;