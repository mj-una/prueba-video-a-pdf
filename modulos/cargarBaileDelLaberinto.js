import crearControladorInstancia from "./crearControladorInstancia.js";

//______
const ajustes = {
	cantidadBailarines: 1000,
	escalaSaltos: 0.01,
	anguloSaltos: 503,
	velocidadSaltos: 2.5,
	velocidadColor: 0.6,
}

//______
class Bailarin {
	constructor(q) {
		this.q = q;
		this.posicionX = q.random(0, q.width);
		this.posicionY = q.random(0, q.height);
		this.velocidadX = q.random(-2, 2);
		this.velocidadY = q.random(-2, 2);
		this.visibilidad = 0;
	}

	bailar(tiempoLocal, tonoColor) {
		const q = this.q;
		
		// efecto externo
		const saltoX = tiempoLocal * 0.5;
		const saltoY = tiempoLocal * 0.013;
		const salto = q.noise(saltoX, saltoY, tiempoLocal) - 0.5;
		const destino = Math.sign(salto) * salto * salto * 0.01;
		ajustes.anguloSaltos += destino;
		ajustes.escalaSaltos -= 0.00000001;

		// efecto interno
		const { escalaSaltos, anguloSaltos, velocidadSaltos } = ajustes;
		const caidaX = escalaSaltos * this.posicionX;
		const caidaY = escalaSaltos * this.posicionY;
		const caida = q.noise(caidaX, caidaY, salto) * anguloSaltos;
		this.velocidadX = velocidadSaltos * q.cos(caida);
		this.velocidadY = velocidadSaltos * q.sin(caida);
		this.posicionX += this.velocidadX;
		this.posicionY += this.velocidadY;
		this.visibilidad += 0.01;

		// colision bordes
		if (
			this.posicionX < 0 ||
			this.posicionX > q.width ||
			this.posicionY < 0 ||
			this.posicionY > q.height
		) {
			const newX = q.random(0, q.width);
			const newY = q.random(0, q.height);
			this.posicionX = newX;
			this.posicionY = newY;
			this.visibilidad = 0;
		}

		// dibujo
		q.stroke(tonoColor, 100, 100, this.visibilidad);
		q.point(this.posicionX, this.posicionY);
	}
}

// baile del laberinto. por hache temele
// leer junto a "el rey debe morir"
export default () => {

	//______
	const bailarines = [];
	const contenedor = document.querySelector("main");
	const q = new window.Q5("local", contenedor);

	//______
	q.setup = () => {
		q.createCanvas(540, 540);
		q.pixelDensity(2);
		q.displayMode(q.MAXED);
		q.colorMode(q.HSB, 360);
		q.angleMode(q.DEGREES);
		q.cursor(q.CROSS);
		q.strokeWeight(2);
		q.background(220, 0, 30);
		for (let i = 0; i < ajustes.cantidadBailarines; i++) {
			bailarines.push(new Bailarin(q));
		}
	}

	//______
	q.draw = () => {
		const tiempoLocal = q.frameCount * ajustes.velocidadColor;
		const tonoColor = tiempoLocal % 360;

		// terremoto
		q.push();
		if (q.mouseIsPressed) {
			ajustes.escalaSaltos = 0.004;
			q.fill(tonoColor + 220, 0, 40, 0.08);
		}
		else {
			q.strokeWeight(4);
			q.noFill();
		}
		q.rect(0, 0, q.width, q.height);
		q.pop();

		// media luna
		for (const bailarin of bailarines) {
			bailarin.bailar(tiempoLocal, tonoColor);
		}
	}

	//______
	return crearControladorInstancia(q, () => {
		ajustes.escalaSaltos = 0.01;
		ajustes.anguloSaltos = 503;
	});
}
