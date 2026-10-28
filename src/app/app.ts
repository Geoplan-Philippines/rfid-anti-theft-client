import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastModule, ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  protected readonly currentUser = this.auth.currentUser;

  constructor() {
    if (this.auth.token()) {
      this.auth
        .loadCurrentUser()
        .pipe(takeUntilDestroyed())
        .subscribe({
          error: (err: HttpErrorResponse) => {
            if (err.status === 401) {
              void this.router.navigateByUrl('/login');
            }
          },
        });
    }
  }

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: location.pathname },
  );

  protected readonly showChrome = computed(
    () => this.auth.token() !== null && !isLoginUrl(this.url()),
  );

  protected logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}

function isLoginUrl(url: string): boolean {
  return url.split(/[?#]/)[0] === '/login';
}
