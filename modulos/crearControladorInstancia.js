export default (q, reiniciarAjustes) => ({
	eliminar: () => q.remove(),
	pausar: () => q.noLoop(),
	reanudar: () => q.loop(),
	reiniciar: () => {
		reiniciarAjustes?.();
		q.loop();
	}
});
