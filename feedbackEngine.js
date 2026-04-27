let lastSpoken = "";
let lastTime = 0;
const COOLDOWN = 3000; // 3 ثواني

export function speak(message) {
  const now = Date.now();

  if (message === lastSpoken && now - lastTime < COOLDOWN) return;

  // إلغاء أي كلام سابق
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);

  // اختيار صوت عربي
  const voices = speechSynthesis.getVoices();
  const arabicVoice = voices.find(v => v.lang.includes("ar"));

  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  utterance.rate = 1;
  utterance.lang = "ar-SA";
  speechSynthesis.speak(utterance);

  lastSpoken = message;
  lastTime = now;
}