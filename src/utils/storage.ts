/**
 * Storage Utility with Quota Exceeded Protection
 * Handles localStorage operations safely, compressing base64 strings if storage is full.
 */

export function cleanOversizedStorage(): void {
  const keysToClean = [
    'ab_applications_v3',
    'ab_transactions_v3',
    'ab_students_v3',
    'ab_payments_v3',
    'ab_accounts',
    'ab_session_user',
    'ab_incomplete_registration_v3'
  ];

  keysToClean.forEach(k => {
    try {
      const raw = localStorage.getItem(k);
      if (raw && raw.length > 500000 && (raw.includes('data:image') || raw.includes('base64'))) {
        // Strip out oversized uncompressed base64 strings if storage is completely full
        const cleaned = raw.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '');
        localStorage.setItem(k, cleaned);
      }
    } catch (e) {
      console.warn(`[Storage] Failed to clean key ${k}:`, e);
    }
  });
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`[Storage] Quota exceeded while saving key "${key}". Attempting cleanup...`, error);
    try {
      cleanOversizedStorage();
      localStorage.setItem(key, value);
      return true;
    } catch (retryError) {
      console.error(`[Storage] Retry failed for key "${key}". Trimming base64 images from payload...`, retryError);
      try {
        if (value.length > 50000 && (value.startsWith('{') || value.startsWith('['))) {
          const sanitized = value.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '');
          localStorage.setItem(key, sanitized);
          return true;
        }
      } catch (finalError) {
        console.error(`[Storage] Final fallback failed for key "${key}":`, finalError);
      }
      return false;
    }
  }
}

/**
 * Utility to compress uploaded image files before storing as data URLs.
 * Downscales images to max width/height and JPEG quality 0.6 (~30KB vs 5MB).
 */
export function compressImageFile(file: File, maxWidth = 600, maxHeight = 600, quality = 0.6): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve('');
        return;
      }
      
      // If it's not an image or is already small (< 100KB), return as is
      if (!file.type.startsWith('image/') || file.size < 100000) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
          } else {
            resolve(src);
          }
        } catch (err) {
          console.warn('[ImageCompress] Canvas compression failed, returning original:', err);
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
