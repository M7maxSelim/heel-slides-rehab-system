import { initPose, processFrame } from "./mediaPipeSetup.js";
import { handleVideoUpload, getCurrentFrameVideo } from "./videoProcessor.js";

const video = document.getElementById("video");
const startBtn = document.getElementById("startCam");
const stopBtn = document.getElementById("stopCam");
const uploadVideo = document.getElementById("uploadVideo");

let stream = null;
let pose = null;
let running = false;
let lastAngle = 0;

// دالة قراءة الزاوية صوتياً
function speakAngle(angle) {
  if (Math.abs(angle - lastAngle) > 5) { // تحديث فقط عند تغيير 5 درجات
    lastAngle = angle;
    const text = `زاوية الركبة ${Math.round(angle)} درجة`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  }
}

// تصدير الدالة للاستخدام في visualizer
window.speakAngle = speakAngle;

startBtn.onclick = async () => {
  stopEverything(); // مهم

  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  await new Promise(resolve => {
    video.onloadedmetadata = () => {
      video.play();
      resolve();
    };
  });

  pose = initPose(video);

  running = true;
  runLoop();
};

document.body.onclick = () => {
  speechSynthesis.resume();
};

uploadVideo.onchange = async (e) => {
  stopEverything(); // مهم

  const file = e.target.files[0];
  if (!file) return;

  handleVideoUpload(file);

  await new Promise(resolve => {
    video.onloadedmetadata = () => {
      video.play();
      resolve();
    };
  });

  if (!pose) {
    pose = initPose(video);
  }

  running = true;
  runLoop();
};

stopBtn.onclick = () => {
  stopEverything();
};

function stopEverything() {
  running = false;

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
}

async function runLoop() {
  if (!running) return;

  const frameSource = video.srcObject ? video : getCurrentFrameVideo();

  if (frameSource) {
    await processFrame(pose, frameSource);
  }

  requestAnimationFrame(runLoop);
}