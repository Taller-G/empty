import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../../core/services/user.service';
import type { User } from '../../../../core/models/user.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);

  readonly users = signal<User[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this.error.set(err.message ?? 'Failed to load users.');
        this.isLoading.set(false);
      },
    });
  }

  deleteUser(id: string): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.delete(id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== id));
        this.successMessage.set('User deleted successfully.');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: { message?: string }) => {
        this.error.set(err.message ?? 'Failed to delete user.');
      },
    });
  }

  trackById(_index: number, user: User): string {
    return user.id;
  }
}
