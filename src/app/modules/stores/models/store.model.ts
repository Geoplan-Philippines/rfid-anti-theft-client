export type { PaginatedResponse, PaginationQuery } from '../../../core/api/pagination.model';

/** A registered store. Sales link to it when their store code matches `code` (trimmed, any case). */
export interface Store {
  id: string;
  code: string;
  name: string;
  address: string | null;
  /** Path on the API origin, e.g. /uploads/stores/<file>.jpg. Use apiAssetUrl() to load it. */
  photoUrl: string | null;
  createdAt: string;
}

/** What the store dialog sends. An empty address clears it. */
export interface SaveStoreInput {
  code: string;
  name: string;
  address: string;
  /** A newly picked photo to upload. It replaces the current one. */
  photo: File | null;
  /** Clear the current photo. Ignored when `photo` is set. */
  removePhoto: boolean;
}

export const STORE_CODE_MAX_LENGTH = 120;
export const STORE_NAME_MAX_LENGTH = 120;
export const STORE_ADDRESS_MAX_LENGTH = 300;

/** Same rules the server enforces: JPG, PNG or WebP, up to 5 MB. */
export const STORE_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const STORE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

/** Why a picked file cannot be used as a store photo, or null when it can. */
export function storePhotoProblem(file: File): string | null {
  if (!STORE_PHOTO_TYPES.includes(file.type)) {
    return 'Choose a JPG, PNG or WebP image.';
  }
  if (file.size > STORE_PHOTO_MAX_BYTES) {
    return 'This photo is larger than 5 MB. Choose a smaller one.';
  }
  return null;
}
