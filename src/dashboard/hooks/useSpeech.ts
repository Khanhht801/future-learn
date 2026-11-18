import { useCallback, useEffect, useState } from "react";
export function useSpeech(notice: (text: string) => void) {
  const [speaking, setSpeaking] = useState(false);
  const stop = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);
  useEffect(() => {
    const hide = () => stop();
    window.addEventListener("pagehide", hide);
    return () => {
      window.removeEventListener("pagehide", hide);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [stop]);
  const speak = (text: string) => {
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      notice(
        "Trình duyệt chưa hỗ trợ phát âm. Hãy thử Chrome, Edge hoặc Safari.",
      );
      return;
    }
    stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    const voice = speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.replace("_", "-").toLowerCase() === "en-us");
    if (voice) utterance.voice = voice;
    utterance.onstart = () => {
      setSpeaking(true);
      notice(`Đang phát âm: ${text}`);
    };
    utterance.onend = () => {
      setSpeaking(false);
      notice("Bấm loa để nghe lại.");
    };
    utterance.onerror = (event) => {
      setSpeaking(false);
      if (!["canceled", "interrupted"].includes(event.error))
        notice(
          "Chưa phát được âm thanh. Kiểm tra âm lượng, kết nối mạng và thử lại.",
        );
    };
    speechSynthesis.speak(utterance);
  };
  return { speaking, speak, stop };
}
