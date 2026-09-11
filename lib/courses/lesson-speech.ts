import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Speech from "expo-speech";

import { lessonSpeechText } from "./lesson-speech-text";

export type LessonSpeechState = "idle" | "playing" | "paused";

export { lessonSpeechText };

const FRENCH_LANGUAGE = "fr-FR";
const READING_RATE = 0.95;
const MAX_CHUNK_LENGTH = 3500;

function chunkSpeechText(text: string, maxLength = MAX_CHUNK_LENGTH): string[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    if (paragraph.length > maxLength) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      const sentences = paragraph.match(/[^.!?]+[.!?]?\s*/g) ?? [paragraph];
      let sentenceChunk = "";
      for (const sentence of sentences) {
        const candidate = `${sentenceChunk} ${sentence}`.trim();
        if (candidate.length > maxLength) {
          if (sentenceChunk.trim()) chunks.push(sentenceChunk.trim());
          sentenceChunk = sentence;
        } else {
          sentenceChunk = candidate;
        }
      }
      if (sentenceChunk.trim()) chunks.push(sentenceChunk.trim());
    } else if (current.length + paragraph.length + 2 <= maxLength) {
      current = current ? `${current} ${paragraph}` : paragraph;
    } else {
      if (current) chunks.push(current);
      current = paragraph;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

/**
 * Native text-to-speech playback for a lesson. Keeps a single active reading,
 * exposes play/pause/resume/stop and cleans up automatically on unmount.
 *
 * Pause/resume preserves the reading position on iOS and web. On Android,
 * `expo-speech` cannot pause natively, so "Pause" stops the engine and
 * "Reprendre" restarts from the beginning of the interrupted part.
 */
export function useLessonSpeech() {
  const [state, setState] = useState<LessonSpeechState>("idle");
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const pausedIndexRef = useRef(0);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speakNext = useCallback(() => {
    if (indexRef.current >= chunksRef.current.length) {
      setState("idle");
      return;
    }
    const chunk = chunksRef.current[indexRef.current];
    indexRef.current += 1;
    Speech.speak(chunk, {
      language: FRENCH_LANGUAGE,
      rate: READING_RATE,
      onDone: () => speakNext(),
      onError: () => setState("idle"),
    });
  }, []);

  const play = useCallback(
    (text: string) => {
      Speech.stop();
      const normalized = text.trim();
      chunksRef.current = normalized ? chunkSpeechText(normalized) : [];
      indexRef.current = 0;
      pausedIndexRef.current = 0;
      if (!chunksRef.current.length) {
        setState("idle");
        return;
      }
      setState("playing");
      speakNext();
    },
    [speakNext],
  );

  const pause = useCallback(() => {
    if (state !== "playing") return;
    if (Platform.OS === "android") {
      pausedIndexRef.current = Math.max(0, indexRef.current - 1);
      Speech.stop();
    } else {
      Speech.pause();
    }
    setState("paused");
  }, [state]);

  const resume = useCallback(() => {
    if (state !== "paused") return;
    if (Platform.OS === "android") {
      indexRef.current = pausedIndexRef.current;
      setState("playing");
      speakNext();
    } else {
      Speech.resume();
      setState("playing");
    }
  }, [speakNext, state]);

  const stop = useCallback(() => {
    chunksRef.current = [];
    indexRef.current = 0;
    pausedIndexRef.current = 0;
    Speech.stop();
    setState("idle");
  }, []);

  return { state, play, pause, resume, stop };
}
