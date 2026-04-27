import { onResults } from "./visualizer.js";

let pose;

export function initPose(videoElement) {
  pose = new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false
  });

  pose.onResults(onResults);

  return pose;
}

export async function processFrame(pose, video) {
  await pose.send({ image: video });
}