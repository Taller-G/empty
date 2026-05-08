/**
 * Project model for the frontend application.
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  technologies: string[];
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'paused';
  technologies?: string[];
  startDate?: string;
  endDate?: string;
}