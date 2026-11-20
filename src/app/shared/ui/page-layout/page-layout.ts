import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';

/**
 * Shared frame for list and detail pages: title, subtitle, primary action,
 * a toolbar (search, filters) and the content below.
 *
 * Slots (attribute selectors on projected elements):
 * - `pageBreadcrumb`  above the title
 * - `pageActions`     right of the title (primary action goes last)
 * - `pageSummary`     key facts above the list
 * - `pageToolbar`     start of the PrimeNG Toolbar (search, filters)
 * - `pageToolbarEnd`  end of the PrimeNG Toolbar (result count, secondary actions)
 * - default           the list or other content
 *
 * Empty slots collapse, so a page only declares what it has.
 */
@Component({
  selector: 'app-page',
  imports: [ToolbarModule],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-page' },
})
export class PageLayout {
  /** Page title, rendered as the page's only h1. */
  readonly heading = input.required<string>();
  readonly subtitle = input<string | null | undefined>();
}
