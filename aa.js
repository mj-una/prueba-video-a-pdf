
const f3 = (CC, CF, SM, sizes) => {
  const { AW, AH, RW, RH } = sizes;
  
  // querido
  const QX = RW * CC;
  const QY = RH * CF;
  
  // disponible
  const DX = AW - SM * (CC - 1);
  const DY = AH - SM * (CF - 1);

  // ok case
  if (QX <= DX && QY <= DY) return { ...sizes, E: false };

	// ratio
	const RT = RW / RH;

  // error proportion
  const EX = QX / DX;
  const EY = QY / DY;

	let NRW, NRH;
	if (EX < EY) {
		NRH = DY / CF; // ajustar h al espacio disponible
		NRW = NRH * RT; // luego obtener w como consecuencia de h
	}
	else {
		NRW = DX / CC; // ajustar w al espacio disponible
		NRH = NRW / RT; // luego obtener h como consecuencia de w
	}

  return {
    ...sizes,
    RW: NRW,
    RH: NRH,
    E: true
  }
}


const f1 = (CC, CF, SM) => sizes => {
  const {AW, AH, RW, RH, E} = f3(CC, CF, SM, sizes);
  const HRW = RW * 0.5;
  
  // disponible
  const DX = AW - RW * CC;
  const DY = AH - RH * CF;

  // separación
  const SX = DX / (CC - 1);
  const SY = DY / (CF - 1);

  // offset
  const OX = RW + SX;
  const OY = RH + SY;
 
  // layout
  const LT = { E };

  let index = 0;
  for (let ix = 0; ix < CC; ix++) {
    for (let iy = 0; iy < CF; iy++) {
      const PX = ix * OX;
      const PY = iy * OY;
      const TX = PX + HRW;
      const TY = PY + RH;
      LT[index] = [PX, PY, RW, RH, TX, TY];
      index++;
    }
  }

  return LT;
}