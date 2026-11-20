import { PaginationQuery } from '../../../core/api/pagination.model';

export type { PaginatedResponse, PaginationMeta } from '../../../core/api/pagination.model';

/** One till sale, as returned by the list. Dates are ISO strings. */
export interface TransactionSummary {
  id: string;
  /** The store code exactly as the till sent it. */
  storeCode: string;
  /** Name of the registered store whose code matches (any case), or null. Worked out by the server on each read. */
  storeName: string | null;
  /** Whether a registered store matches `storeCode`. */
  registered: boolean;
  /** The till's device id, shown as the POS number. */
  deviceId: string;
  cashierName: string | null;
  startedAt: string;
  endedAt: string;
  itemCount: number;
}

/** A tag the till scanned during the sale. */
export interface TransactionTag {
  epc: string;
  scannedAt: string;
}

/** The list row plus the till's client id and the scanned tags. */
export interface TransactionDetail extends TransactionSummary {
  clientTransactionId: string;
  tags: TransactionTag[];
}

export interface TransactionListQuery extends PaginationQuery {
  search?: string;
  storeCode?: string;
  /** Manila calendar day, YYYY-MM-DD. Omitted when unset. */
  from?: string;
  /** Manila calendar day, YYYY-MM-DD. Omitted when unset. */
  to?: string;
}
