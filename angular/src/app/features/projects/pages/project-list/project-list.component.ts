import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ProjectService } from '../../../../core/services/project.service';
import type { Project } from '../../../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css',
})
export class ProjectListComponent implements OnInit {
  private readonly projectService = inject(ProjectService);

  readonly projects = signal<Project[]>([]);
  readonly projectCounts = signal<{active: number, completed: number, paused: number}>({
    active: 0,
    completed: 0,
    paused: 0
  });
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  // Computed property for total project count
  readonly totalProjects = computed(() => {
    const counts = this.projectCounts();
    return counts.active + counts.completed + counts.paused;
  });

  ngOnInit(): void {
    this.loadProjectsData();
  }

  loadProjectsData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Load both projects list and counts in parallel
    forkJoin({
      projects: this.projectService.getAll(),
      counts: this.projectService.getProjectCountByStatus()
    }).subscribe({
      next: ({ projects, counts }) => {
        this.projects.set(projects);
        this.projectCounts.set(counts);
        this.isLoading.set(false);
      },
      error: (err: { message?: string }) => {
        this.error.set(err.message ?? 'Failed to load projects.');
        this.isLoading.set(false);
      },
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge badge-success';
      case 'completed':
        return 'badge badge-info';
      case 'paused':
        return 'badge badge-warning';
      default:
        return 'badge';
    }
  }

  getStatusDisplayText(status: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'paused':
        return 'Paused';
      default:
        return status;
    }
  }

  trackById(_index: number, project: Project): string {
    return project.id;
  }
}