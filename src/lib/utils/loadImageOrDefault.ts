import { browser } from '$app/environment';

const imageCache = new Map<string, string>();

/**
 * Loads an image safely for direct use in <img src={...}>.
 * 
 * - On the server: returns the fallback immediately.
 * - In the browser: tries to load the real image once, caches the result.
 * 
 * @param src - The image path or URL to try.
 * @param fallback - The fallback image path.
 * @returns A promise resolving to the usable image path (real or fallback).
 */
export async function useImageOrDefault(src: string, fallback: string): Promise<string> {
  // 🚫 SSR — just return fallback immediately
  if (!browser) {
    return fallback;
  }

  // 🧠 Already cached? Use it instantly
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }

  // 🧩 Otherwise, test the image
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      imageCache.set(src, src);
      resolve(src);
    };

    img.onerror = () => {
      imageCache.set(src, fallback);
      resolve(fallback);
    };

    img.src = src;
  });
}
