import cargarBaileDelLaberinto from "./cargarBaileDelLaberinto.js";
import cargarInterfazAjustesPdf from "./cargarInterfazAjustesPdf.js";
import forzarCssViewport from "./forzarCssViewport.js";

// ajustes predefinidos
const AJUSTES = {
	FPS: 15, // fotogramas por segundo
	FPP: 15, // fotogramas por plana
	SCL: 0, // milimetros reescala
	SNG: 10, // milimetros sangria
	RES: 2, // 300dpi 2480x3508px
	NUM: true, // imprimir numeracion
	MQR: true, // imprimir metadata qr
	FDC: true, // imprmir marcas fiduciales
};

// auxiliares
const cargarFlojito = (ruta, elemento) => {
	elemento.src = ruta;
	elemento.load();
}
const mostrarVideo = (video, valorLoop = false) => {
	video.currentTime = 0;
	video.loop = valorLoop;
	video.play();
	video.style.display = "block";
}
const ocultarVideo = video => {
	video.pause();
	video.currentTime = 0;
	video.style.display = "none";
}
const cargarFlojitos = (ruta, ...vs) => vs.forEach(v => cargarFlojito(ruta, v));
const mostrarVideos = (...vs) => vs.forEach(v => mostrarVideo(v, true));
const ocultarVideos = (...vs) => vs.forEach(v => ocultarVideo(v));

// dom
const videoHacheTemele = document.querySelector("address video");
const videoAniosVeinte = document.querySelector("#zona-fijada-abajo video");
const videoLocal = document.querySelector("#video-desde-local");
const inputLocal = document.querySelector("#input-desde-local");
const divCargando = document.querySelector("#contenedor-cargando-archivo");
const videoFondo = divCargando.querySelector(".video-fondo");
const videoFrente = divCargando.querySelector(".video-frente");
const divAjustes = document.querySelector("#contenedor-ajustes-pdf");
const cumbia = divAjustes.querySelector("audio");
const michi = divAjustes.querySelector("video");

// inicializaciones
const sketchBaile = cargarBaileDelLaberinto();
forzarCssViewport();
setTimeout(() => {
	cargarFlojitos("./estaticos/kalatay7.mp4", videoFondo, videoFrente);
	cargarFlojito("./estaticos/michi-wep.mp4", michi);
	cargarFlojito("./estaticos/cumbia.mp3", cumbia);
}, 2000);

// seleccionar archivo
const mimes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
inputLocal.addEventListener("change", async () => {
  const archivo = inputLocal.files[0];

	// validacion
  if (!archivo || !mimes.includes(archivo.type)) return;

	// almacenamiento temporal
  videoLocal.src = URL.createObjectURL(archivo);

	// desde "portada" hacia "cargando"
	const sketchAjustes = cargarInterfazAjustesPdf({ michi });
	requestAnimationFrame(() => {
		ocultarVideos(videoHacheTemele, videoAniosVeinte);
		document.body.classList.add("pausar-animaciones");
		sketchBaile.pausar();
		sketchAjustes.pausar();
		divCargando.style.display = "flex";
		mostrarVideos(videoFondo, videoFrente);
		document.documentElement.requestFullscreen?.();
	});
	
	// promesas cargando
	const esperarMinimo = new Promise(resolver => setTimeout(resolver, 9000));
	const terminarDeCargar = new Promise(resolver => {
		videoLocal.addEventListener("loadeddata", resolver, { once: true });
	});
	await Promise.all([esperarMinimo, terminarDeCargar]);

	// desde "cargando" hacia "ajustes"
	requestAnimationFrame(() => {
		document.exitFullscreen?.();
		ocultarVideos(videoFondo, videoFrente);
		divCargando.style.display = "none";
		divAjustes.style.display = "flex";
		sketchAjustes.reanudar();
		setTimeout(() => {
			cumbia.play();
			michi.loop = true;
			michi.currentTime = 0;
			michi.play();
		}, 300);
	});
});
