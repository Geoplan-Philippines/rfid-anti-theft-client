import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { LayoutService } from '../layout.service';

interface NavLink {
  label: string;
  route: string;
  icon: string;
}

interface NavSection {
  id: string;
  title: string;
  items: NavLink[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sidebar-collapsed]': 'layout.sidebarCollapsed()',
    '[class.sidebar-open]': 'layout.sidebarOpen()',
    '(document:keydown.escape)': 'layout.closeSidebar()',
  },
})
export class Sidebar {
  protected readonly layout = inject(LayoutService);

  protected readonly sections: NavSection[] = [
    {
      id: 'registry',
      title: 'Registry',
      items: [
        { label: 'Tag Registry', route: '/registry', icon: 'pi-tags' },
        { label: 'Stores', route: '/stores', icon: 'pi-shop' },
      ],
    },
    {
      id: 'activity',
      title: 'Activity',
      items: [
        { label: 'Transactions', route: '/transactions', icon: 'pi-receipt' },
        { label: 'Alarm Events', route: '/events', icon: 'pi-bell' },
      ],
    },
  ];
}
