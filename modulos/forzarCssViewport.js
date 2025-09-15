const forzarCssViewport = () => {
	const vpw = window.visualViewport?.width ?? window.innerWidth;
	const vph = window.visualViewport?.height ?? window.innerHeight;
	const rootCss = document.documentElement.style;
	rootCss.setProperty("--vpw", `${vpw / 100}px`);
  rootCss.setProperty("--vph", `${vph / 100}px`);
	return { vpw, vph };
}

const viewport = window.visualViewport ?? window;
viewport.addEventListener("resize", forzarCssViewport);

export default forzarCssViewport;