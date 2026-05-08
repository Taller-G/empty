import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly title = 'dasdasdd';
  readonly currentYear = new Date().getFullYear();

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  /** Close the mobile menu whenever the viewport widens past the breakpoint. */
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const win = event.target as Window;
    if (win.innerWidth > 640) {
      this.menuOpen = false;
    }
  }
}
