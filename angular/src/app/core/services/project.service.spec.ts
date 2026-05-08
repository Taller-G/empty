import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all projects', (done) => {
    service.getAll().subscribe(projects => {
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0]).toHaveProperty('id');
      expect(projects[0]).toHaveProperty('name');
      expect(projects[0]).toHaveProperty('description');
      done();
    });
  });

  it('should return project count by status', (done) => {
    service.getProjectCountByStatus().subscribe(counts => {
      expect(counts).toHaveProperty('active');
      expect(counts).toHaveProperty('completed');
      expect(counts).toHaveProperty('paused');
      expect(typeof counts.active).toBe('number');
      expect(typeof counts.completed).toBe('number');
      expect(typeof counts.paused).toBe('number');
      done();
    });
  });

  it('should return total project count', (done) => {
    service.getProjectCount().subscribe(count => {
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
      done();
    });
  });

  it('should find project by id', (done) => {
    service.getById('1').subscribe(project => {
      expect(project.id).toBe('1');
      expect(project.name).toBeTruthy();
      done();
    });
  });
});