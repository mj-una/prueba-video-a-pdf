import crearControladorInstancia from "./crearControladorInstancia.js";
import crearControladorPantalla from "./crearControladorPantalla.js";

export default (memoria = {}) => {
	for (const archivo of Object.values(memoria)) {
		archivo.style.objectFit = "cover";
		archivo.redimensionar = (w, h = w) => {
			archivo.width = `${w}px`;
			archivo.height = `${h}px`;
		};
	}

	//______
	const contenedor = document.querySelector("#contenedor-ajustes-pdf");
	const q = new window.Q5("local", contenedor);
	crearControladorPantalla(q, [250, 50, 50])(540);

	const { michi } = memoria;
	michi.redimensionar(20);

	const cyan = [10, 200, 220];
	q.fill(...cyan);
	q.stroke(...cyan);
	q.shadow(...cyan);
	q.shadowBox(0, 0, 20);
	q.textSize(28);
	q.textAlign(q.CENTER, q.CENTER);

	//______
	q.draw = () => {
		q.cursor("move");
		q.background(155);

		const vel = 0.012;
		const cosFr = q.cos(q.frameCount * vel) + 1;
		const mw = cosFr * 50 + 130;
		const mh = 340 - mw;
		q.push();
		q.rect(10, 10, mw, mh);
		if (q.inFill(q.mouseX, q.mouseY)) q.cursor("pointer");
		q.noFill();
		q.image(michi, 12, 12, mw - 4, mh - 4);
		q.rect(10, 10, mw, mh);
		q.pop();
		q.push();
		q.shadow(120, 250, 255);
		q.text("𝕍𝕆𝕃𝕍𝔼ℝ", 10 + mw * 0.5, 44);
		q.pop();
	}

	//______
	return crearControladorInstancia(q);
}
