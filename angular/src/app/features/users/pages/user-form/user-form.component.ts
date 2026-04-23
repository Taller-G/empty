import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
} from '@angular/forms';
import { switchMap, of } from 'rxjs';

import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isEditMode = signal(false);
  readonly userId = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.userId.set(id);
      this.loadUser(id);
    }
  }

  private loadUser(id: string): void {
    this.isLoading.set(true);
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.form.patchValue({ name: user.name, email: user.email });
        this.isLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this.error.set(err.message ?? 'Failed to load user.');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.error.set(null);

    const payload = {
      name: this.form.value.name ?? '',
      email: this.form.value.email ?? '',
    };

    const request$ = this.isEditMode()
      ? this.userService.update(this.userId()!, payload)
      : this.userService.create(payload);

    request$.subscribe({
      next: () => {
        void this.router.navigate(['/users']);
      },
      error: (err: { error?: { message?: string }; message?: string }) => {
        this.error.set(err.error?.message ?? err.message ?? 'An error occurred.');
        this.isSubmitting.set(false);
      },
    });
  }

  get nameControl(): AbstractControl {
    return this.form.controls['name'];
  }

  get emailControl(): AbstractControl {
    return this.form.controls['email'];
  }
}
