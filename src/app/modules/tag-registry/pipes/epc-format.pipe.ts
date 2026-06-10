import { Pipe, PipeTransform } from '@angular/core';
import { groupEpc } from '../models/tag-registry.model';

/** Render an EPC in spaced 4-character blocks for readability. */
@Pipe({ name: 'epcFormat' })
export class EpcFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? groupEpc(value) : '';
  }
}
