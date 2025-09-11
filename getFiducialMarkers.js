const getFiducialMarkers = async (q, factorArg = 1) => {

	// scale factor
	const allowedFactors = [0, 1, 1.8, 2.8];
	const F = allowedFactors.reduce((prev, curr) => {
		const abs = Math.abs;
		const isCloser = abs(curr - factorArg) < abs(prev - factorArg);
		return isCloser ? curr : prev;
	});

	
	const W = 1754; // width a4
	const H = 1240; // height a4
	const N = 36; // non printable

	const buffer = q.createGraphics(W, H);
	buffer.clear();
	buffer.fill(0);
	
	if (F === 0) return {
		fiducialMarkers: buffer,
		x: N,
		y: N,
		w: W - 2 * N,
		h: H - 2 * N,
	}

	const Q = 31 / F; // quad size
	const B = 12 / F; // border weight
	const S = 30; // safe inner margin

	const fiduX = N * 2 + Q * 4 + B * 2;
	const freeX = W - fiduX - S * 2;
	console.log(`${F} freeX: ${Math.floor(freeX)}`);
	// 1.0 = 1474, 1.8 = 1539, 2.6 = 1565

	const fiduY = N * 2 + B * 2;
	const freeY = W - fiduY - S * 2;
	console.log(`${F} freeY: ${Math.floor(freeY)}`);
	// 1.0 = 1598, 1.8 = 1608, 2.6 = 1612

	const WSQ = W - N - Q;
	const WSQQ = WSQ - Q;
	const WSQQB = WSQQ - B;

	const HS = H - N;
	const HSS = HS - N;
	const HSQ = HS - Q;
	const HSB = HS - B;
	const HSQQ = HSQ - Q;
	const HAV = HSQQ - 1;
	const SQ = N + Q;
	const SQQ = SQ + Q;

	const WSQSQQ = WSQQ - SQQ;

	// main columns
	let isExternal = true;
	for (let y = N; y < HAV; y += Q) {
		if (isExternal) {
			buffer.rect(N, y, Q, Q);
			buffer.rect(WSQ, y, Q, Q);
		}
		else {
			buffer.rect(SQ, y, Q, Q);
			buffer.rect(WSQQ, y, Q, Q);
		}
		isExternal = !isExternal;
	}

	// last two quads
	buffer.rect(WSQ, HSQ, Q, Q);
	buffer.rect(WSQQ, HSQQ, Q, Q);
	buffer.rect(N, HSQ, Q, Q);
	buffer.rect(SQ, HSQQ, Q, Q);

	// border x
	buffer.rect(SQQ, N, WSQSQQ, B);
	buffer.rect(SQQ, HSB, WSQSQQ, B);

	// border y
	buffer.rect(SQQ, N, B, HSS);
	buffer.rect(WSQQB, N, B, HSS);

	return {
		fiducialMarkers: buffer,
		x: N + Q * 2 + B + S,
		y: N + B + S,
		w: freeX,
		h: freeY,
	}
}

export default getFiducialMarkers;