import { Injectable, signal } from '@angular/core';

/** Sidebar state shared by the header toggles and the sidebar itself. */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  /** Off-canvas sidebar on small screens. */
  readonly sidebarOpen = signal(false);
  /** Icon-rail sidebar on desktop. */
  readonly sidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  toggleSidebarCollapsed(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
