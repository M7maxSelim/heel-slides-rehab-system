export function calculateAngle(A, B, C) {
  const BA = {
    x: A.x - B.x,
    y: A.y - B.y
  };

  const BC = {
    x: C.x - B.x,
    y: C.y - B.y
  };

  const dot = BA.x * BC.x + BA.y * BC.y;

  const magBA = Math.sqrt(BA.x ** 2 + BA.y ** 2);
  const magBC = Math.sqrt(BC.x ** 2 + BC.y ** 2);

  const angle = Math.acos(dot / (magBA * magBC));

  return (angle * 180) / Math.PI;
}