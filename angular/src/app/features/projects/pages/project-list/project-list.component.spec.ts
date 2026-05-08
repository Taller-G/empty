import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../../../../core/services/project.service';
import { of } from 'rxjs';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProjectService', ['getAll', 'getProjectCountByStatus']);

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        { provide: ProjectService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    const mockProjects = [
      {
        id: '1',
        name: 'Test Project',
        description: 'Test Description',
        status: 'active' as const,
        technologies: ['Angular'],
        startDate: '2024-01-01',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    const mockCounts = { active: 1, completed: 0, paused: 0 };

    projectService.getAll.and.returnValue(of(mockProjects));
    projectService.getProjectCountByStatus.and.returnValue(of(mockCounts));

    component.ngOnInit();

    expect(component.projects()).toEqual(mockProjects);
    expect(component.projectCounts()).toEqual(mockCounts);
    expect(component.totalProjects()).toBe(1);
  });

  it('should calculate total projects correctly', () => {
    component.projectCounts.set({ active: 2, completed: 3, paused: 1 });
    expect(component.totalProjects()).toBe(6);
  });

  it('should return correct badge class for status', () => {
    expect(component.getStatusBadgeClass('active')).toBe('badge badge-success');
    expect(component.getStatusBadgeClass('completed')).toBe('badge badge-info');
    expect(component.getStatusBadgeClass('paused')).toBe('badge badge-warning');
    expect(component.getStatusBadgeClass('unknown')).toBe('badge');
  });

  it('should return correct display text for status', () => {
    expect(component.getStatusDisplayText('active')).toBe('Active');
    expect(component.getStatusDisplayText('completed')).toBe('Completed');
    expect(component.getStatusDisplayText('paused')).toBe('Paused');
    expect(component.getStatusDisplayText('unknown')).toBe('unknown');
  });
});