import type { IProjectRepository } from '../models/ports/IProjectRepository';
import type { Project } from '../models/Project';
import type { Slide } from '../models/Slide';

export class HttpMicroserviceRepository implements IProjectRepository {
  async getProjects(): Promise<Project[]> {
    throw new Error('Stub: No implementado');
  }
  async getProjectById(_id: string): Promise<Project | null> {
    throw new Error('Stub: No implementado');
  }
  async saveProject(_project: Project): Promise<void> {
    throw new Error('Stub: No implementado');
  }
  async deleteProject(_id: string): Promise<void> {
    throw new Error('Stub: No implementado');
  }
  async saveSlide(_slide: Slide): Promise<void> {
    throw new Error('Stub: No implementado');
  }
  async deleteSlide(_slideId: string): Promise<void> {
    throw new Error('Stub: No implementado');
  }
}