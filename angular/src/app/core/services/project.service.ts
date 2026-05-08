import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { Project, CreateProjectPayload, UpdateProjectPayload } from '../models/project.model';

/**
 * Project service - Currently uses mock data since there's no backend endpoint yet.
 * This service follows the same patterns as UserService for consistency.
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projects: Project[] = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform built with Angular and Node.js',
      status: 'active',
      technologies: ['Angular', 'Node.js', 'PostgreSQL', 'TypeScript'],
      startDate: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'A collaborative task management application with real-time updates',
      status: 'completed',
      technologies: ['React', 'Express', 'MongoDB', 'Socket.io'],
      startDate: '2023-08-20',
      endDate: '2023-12-10',
      createdAt: '2023-08-20T09:30:00Z',
      updatedAt: '2023-12-10T16:45:00Z',
    },
    {
      id: '3',
      name: 'Weather Dashboard',
      description: 'A responsive weather dashboard with interactive maps and forecasts',
      status: 'completed',
      technologies: ['Vue.js', 'D3.js', 'Weather API'],
      startDate: '2023-05-10',
      endDate: '2023-07-15',
      createdAt: '2023-05-10T14:20:00Z',
      updatedAt: '2023-07-15T11:30:00Z',
    },
    {
      id: '4',
      name: 'Mobile Banking App',
      description: 'A secure mobile banking application with biometric authentication',
      status: 'paused',
      technologies: ['Flutter', 'Firebase', 'Dart'],
      startDate: '2024-02-01',
      createdAt: '2024-02-01T08:15:00Z',
      updatedAt: '2024-02-01T08:15:00Z',
    },
    {
      id: '5',
      name: 'Analytics Dashboard',
      description: 'A comprehensive analytics dashboard for business intelligence',
      status: 'active',
      technologies: ['Angular', 'Chart.js', 'Python', 'FastAPI'],
      startDate: '2024-03-01',
      createdAt: '2024-03-01T12:00:00Z',
      updatedAt: '2024-03-01T12:00:00Z',
    },
  ];

  private nextId = 6;

  getAll(): Observable<Project[]> {
    // Simulate API delay
    return of([...this.projects]).pipe(delay(500));
  }

  getById(id: string): Observable<Project> {
    const project = this.projects.find(p => p.id === id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return of({ ...project }).pipe(delay(300));
  }

  create(payload: CreateProjectPayload): Observable<Project> {
    const newProject: Project = {
      id: String(this.nextId++),
      ...payload,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.projects.push(newProject);
    return of({ ...newProject }).pipe(delay(500));
  }

  update(id: string, payload: UpdateProjectPayload): Observable<Project> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Project with id ${id} not found`);
    }

    this.projects[index] = {
      ...this.projects[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return of({ ...this.projects[index] }).pipe(delay(500));
  }

  delete(id: string): Observable<void> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Project with id ${id} not found`);
    }

    this.projects.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }

  getProjectCount(): Observable<number> {
    return of(this.projects.length).pipe(delay(200));
  }

  getProjectCountByStatus(): Observable<{active: number, completed: number, paused: number}> {
    const counts = this.projects.reduce((acc, project) => {
      acc[project.status]++;
      return acc;
    }, { active: 0, completed: 0, paused: 0 });

    return of(counts).pipe(delay(200));
  }
}