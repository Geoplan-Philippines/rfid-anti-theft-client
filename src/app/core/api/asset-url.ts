import { environment } from '../../../environments/environment';

/** The API's origin: the base URL without its /api/vN prefix. Static files (/uploads/*) are served from here. */
const API_ORIGIN = environment.apiBaseUrl.replace(/\/api\/v\d+\/?$/, '');

/** Full URL for a file path the API returns, such as /uploads/stores/<file>.jpg. Null when there is no file. */
export function apiAssetUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }
  return /^https?:\/\//i.test(path) ? path : `${API_ORIGIN}${path}`;
}
