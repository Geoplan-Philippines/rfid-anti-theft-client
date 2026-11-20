import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { AuthService } from '../../core/auth/auth.service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AvatarModule, ButtonModule, TooltipModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly layout = inject(LayoutService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentUser = this.auth.currentUser;
  protected readonly initial = computed(
    () => this.currentUser()?.email.charAt(0).toUpperCase() ?? '',
  );

  protected logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
