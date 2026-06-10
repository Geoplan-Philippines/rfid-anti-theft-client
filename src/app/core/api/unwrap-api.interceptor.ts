import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

interface ApiEnvelope {
  statusCode?: number;
  message?: string;
  data: unknown;
}

function isEnvelope(body: unknown): body is ApiEnvelope {
  return (
    !!body &&
    typeof body === 'object' &&
    'data' in body &&
    ('statusCode' in body || 'message' in body)
  );
}

/**
 * The API wraps every success payload as `{ statusCode, message, data }`.
 * Unwrap it once so services receive the real payload (the list/record itself).
 * Error responses are not wrapped, so they pass through untouched.
 */
export const unwrapApiInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && isEnvelope(event.body)) {
        return event.clone({ body: event.body.data });
      }
      return event;
    }),
  );
