import { StaticImageData } from 'next/image';

// Types
export type ValidImageSource = string | StaticImageData | null | undefined;

// Constants
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PRODUCT_BUCKET = 'product_images';
const PLACEHOLDER_IMAGE = '/placeholder.png';

// Utility Functions
export const getProductImageUrl = (imageUrl: ValidImageSource): string => {
  if (!imageUrl) return PLACEHOLDER_IMAGE;
  
  if (typeof imageUrl !== 'string') {
    return PLACEHOLDER_IMAGE;
  }

  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${PRODUCT_BUCKET}/${imageUrl}`;
};

export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getImageDimensions = (
  width: number, 
  height: number, 
  maxWidth = 800
): { width: number; height: number } => {
  if (width <= maxWidth) {
    return { width, height };
  }
  
  const ratio = maxWidth / width;
  return {
    width: maxWidth,
    height: Math.round(height * ratio)
  };
};

export const getStorageUrl = (bucket: string, path: string): string => {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};

export const getImagePlaceholder = (type: 'product' | 'avatar' | 'brand' = 'product'): string => {
  const placeholders = {
    product: PLACEHOLDER_IMAGE,
    avatar: '/avatar-placeholder.png',
    brand: '/brand-placeholder.png'
  };
  
  return placeholders[type];
};