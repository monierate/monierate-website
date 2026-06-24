import { browser } from '$app/environment';

const imageCache = new Map<string, string>();
const imageBoolCache = new Map<string, boolean>();

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
export async function useImageOrDefault(src: string, fallback: string): Promise<string>;
/**
 * Checks whether an image can load, returning a boolean result.
 *
 * - On the server: returns false immediately.
 * - In the browser: tries to load the real image once, caches the result.
 *
 * @param src - The image path or URL to check.
 * @param options - Pass `{ returnBoolean: true }` to get a boolean instead of a path.
 * @returns A promise resolving to `true` if the image loaded, `false` otherwise.
 */
export async function useImageOrDefault(src: string, options: { returnBoolean: true }): Promise<boolean>;
export async function useImageOrDefault(
  src: string,
  fallbackOrOptions: string | { returnBoolean: true }
): Promise<string | boolean> {
  const returnBoolean = typeof fallbackOrOptions === 'object' && fallbackOrOptions.returnBoolean === true;
  const fallback = returnBoolean ? '' : (fallbackOrOptions as string);

  if (returnBoolean) {
    // Boolean mode: just check if the image can load
    if (!browser) return false;

    if (imageBoolCache.has(src)) return imageBoolCache.get(src)!;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { imageBoolCache.set(src, true); resolve(true); };
      img.onerror = () => { imageBoolCache.set(src, false); resolve(false); };
      img.src = src;
    });
  }

  // String mode (original behavior): return src or fallback path
  if (!browser) return fallback;

  if (imageCache.has(src)) return imageCache.get(src)!;

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
