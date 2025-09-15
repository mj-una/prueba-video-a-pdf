
//_______
const viajarEnElTiempo = async (video, objetivoEnSegundos) => {
  return new Promise(resolve => {
    const manejador = () => {
      video.removeEventListener("seeked", manejador);
      resolve();
    };
    video.addEventListener("seeked", manejador);
    video.currentTime = objetivoEnSegundos;
  });
}

//_______
export default viajarEnElTiempo;