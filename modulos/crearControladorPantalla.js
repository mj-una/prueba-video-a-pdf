import forzarCssViewport from "./forzarCssViewport.js";

export default (q, color = [155]) => {
	let resolucionPrivada = 400;

	const adaptarPantalla = () => {
		requestAnimationFrame(() => {
			const { vpw, vph } = forzarCssViewport();
			vpw < vph
			? q.resizeCanvas(resolucionPrivada, resolucionPrivada * vph / vpw)
			: q.resizeCanvas(resolucionPrivada * vpw / vph, resolucionPrivada);
			q.background(...color);
		});
	}
	
	const viewport = window.visualViewport ?? window;
	viewport.removeEventListener("resize", forzarCssViewport);
	viewport.addEventListener("resize", adaptarPantalla);
	
	return (resolucionPublica = 400) => {
		resolucionPrivada = resolucionPublica;
		q.createCanvas(1, 1);
		q.displayMode(q.MAXED);
		adaptarPantalla();
	}
}