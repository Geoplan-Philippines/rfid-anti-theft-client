import { PaginationQuery } from '../../../core/api/pagination.model';

export type { PaginatedResponse, PaginationMeta } from '../../../core/api/pagination.model';

/** A watched RFID tag. Mirrors the backend `KnownEpc` model (Prisma). */
export interface KnownEpc {
  id: string;
  epc: string;
  label: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListEpcsQuery extends PaginationQuery {
  search?: string;
}

export interface SaveEpcInput {
  epc: string;
  label: string | null;
}

export interface DeleteEpcResult {
  deleted: boolean;
  id: string;
  epc: string;
}

/** Strip whitespace and upper-case, matching the server's normalization. */
export function normalizeEpc(value: string): string {
  return value.replace(/\s/g, '').trim().toUpperCase();
}

/** Group an EPC into 4-character blocks for legibility, e.g. `E280 6894 0000`. */
export function groupEpc(epc: string): string {
  return normalizeEpc(epc).replace(/(.{4})/g, '$1 ').trim();
}
