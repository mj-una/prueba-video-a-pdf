// baile del laberinto. por hache temele
// leer junto a "el rey debe morir"

//______
const memoria = {};
const bailarines = [];
const ajustes = {
	cantidadBailarines: 1000,
	escalaSaltos: 0.01,
	anguloSaltos: 503,
	velocidadSaltos: 2.5,
	velocidadColor: 0.6,
}

//______
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
		bailarines[i] = new Bailarin();
	}
}

//______
q.draw = () => {
	const tiempoLocal = q.frameCount * ajustes.velocidadColor;
  const tonoColor =  tiempoLocal % 360;
	
	// terremoto
	if (q.mouseIsPressed) {
		ajustes.escalaSaltos = 0.004;
		q.push();
		q.fill(tonoColor + 220, 0, 40, 0.08);
		q.rect(0, 0, q.width, q.height);
		q.pop();
	}
  else {
		q.push();
		q.strokeWeight(4);
		q.fill(tonoColor + 220, 0, 40, 0.001);
		q.rect(0, 0, q.width, q.height);
		q.pop();
	}
  
	// media luna
	for (const bailarin of bailarines){
		bailarin.bailar(q, tiempoLocal, tonoColor);
	}
}

//______
class Bailarin {
  constructor(){
    this.posicionX = q.random(0, q.width);
    this.posicionY = q.random(0, q.height);
    this.velocidadX = q.random(-2,2);
    this.velocidadY = q.random(-2,2);
    this.visibilidad = 0;
  }
  
  bailar(q, tiempoLocal, tonoColor){
		
		// efecto externo
		const saltoX = tiempoLocal * 0.5;
		const saltoY = tiempoLocal * 0.013;
		const salto = q.noise(saltoX, saltoY, tiempoLocal) - 0.5;
		const factorExponencial = Math.sign(salto) * salto * salto * 0.01;
		ajustes.anguloSaltos += factorExponencial;
		ajustes.escalaSaltos -= 0.00000001;

		// efecto interno
		const caidaX = ajustes.escalaSaltos * this.posicionX;
		const caidaY = ajustes.escalaSaltos * this.posicionY;
    const caida = q.noise(caidaX, caidaY, salto) * ajustes.anguloSaltos;
		this.velocidadX = ajustes.velocidadSaltos * q.cos(caida);
    this.velocidadY = ajustes.velocidadSaltos * q.sin(caida);
		this.posicionX += this.velocidadX;
		this.posicionY += this.velocidadY;
    this.visibilidad += 0.01;
    
		// choque bordes
    if (
			this.posicionX < 0 ||
			this.posicionX > q.width ||
			this.posicionY < 0 ||
			this.posicionY > q.height
		){
      const newX = q.random(0, q.width);
      const newY = q.random(0, q.height);
      this.posicionX = newX;
      this.posicionY = newY;
      this.visibilidad = 0;
    }

		// dibujo
		q.stroke(tonoColor, 100, 100, this.visibilidad);
    q.point(this.posicionX,this.posicionY);
  }
}
