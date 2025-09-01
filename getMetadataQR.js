const getMetadataQR = async config => {
  const qr = createGraphics(200, 200);
  qr.background(0);
  qr.fill(255, 255, 0);
  qr.circle(100, 100, 60);
  return qr;
}

export default getMetadataQR;