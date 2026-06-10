import { PaginationQuery } from '../../../core/api/pagination.model';

/**
 * A single alarm: a fixed reader scanned a watched EPC at a gate.
 * Mirrors the backend `/alarms` row.
 */
export interface AlarmEvent {
  id: string;
  epc: string;
  readerName: string;
  /** When the reader physically scanned the tag. */
  scannedAt: string;
  /** When the server persisted the alarm. */
  createdAt: string;
}

export type ListAlarmsQuery = PaginationQuery;
