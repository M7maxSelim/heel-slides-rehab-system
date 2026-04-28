import { calculateAngle } from "./angleCalculator.js";
import { speak } from "./feedbackEngine.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const angleText = document.getElementById("angle");

export function onResults(results) {
  canvas.width = results.image.width;
  canvas.height = results.image.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

  if (!results.poseLandmarks) return;

  const landmarks = results.poseLandmarks;

  // تحديد الرجل الأقرب للكاميرا
  const rightLeg = {
    hip: landmarks[24],
    knee: landmarks[26],
    ankle: landmarks[28]
  };

  const leftLeg = {
    hip: landmarks[23],
    knee: landmarks[25],
    ankle: landmarks[27]
  };

  // حساب المسافة (كلما كان الـ z أصغر = أقرب)
  const rightDepth = (rightLeg.hip.z + rightLeg.knee.z + rightLeg.ankle.z) / 3;
  const leftDepth = (leftLeg.hip.z + leftLeg.knee.z + leftLeg.ankle.z) / 3;

  const closestLeg = rightDepth < leftDepth ? rightLeg : leftLeg;
  const legName = rightDepth < leftDepth ? "يمين" : "يسار";

  // رسم الرجل الأقرب فقط
  drawLeg(closestLeg);

  // حساب الزاوية
  const angle = calculateAngle(closestLeg.hip, closestLeg.knee, closestLeg.ankle);
  angleText.textContent = angle.toFixed(1) + "°";
  
  // 🎯 Feedback Logic
  const TARGET = 100;
  if (angle > TARGET) {
    speak("حاول ثني ركبتك أكثر");
  } else if (angle <= TARGET && angle > TARGET - 10) {
    speak("ممتاز، استمر فى الثني");
  } else if (angle <= TARGET - 10) {
    speak("وصلت للهدف، برافو!");
  }

  // رسم نقطة الركبة
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(closestLeg.knee.x * canvas.width, closestLeg.knee.y * canvas.height, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function drawLeg(leg) {
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(leg.hip.x * canvas.width, leg.hip.y * canvas.height);
  ctx.lineTo(leg.knee.x * canvas.width, leg.knee.y * canvas.height);
  ctx.lineTo(leg.ankle.x * canvas.width, leg.ankle.y * canvas.height);
  ctx.stroke();

  // رسم نقاط المفاصل
  ctx.fillStyle = "yellow";
  [leg.hip, leg.knee, leg.ankle].forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x * canvas.width, point.y * canvas.height, 6, 0, 2 * Math.PI);
    ctx.fill();
  });
}