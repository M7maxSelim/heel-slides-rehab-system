const video = document.getElementById("video");

let uploadedVideo = null;

export function handleVideoUpload(file) {
  const url = URL.createObjectURL(file);
  video.srcObject = null; // وقف الكاميرا
  video.src = url;
  video.controls = true;
  video.play();

  uploadedVideo = video;
}

export function getCurrentFrameVideo() {
  return uploadedVideo;
}