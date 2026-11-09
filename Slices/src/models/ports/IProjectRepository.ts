/*import type { Project } from '../Project';

export interface IProjectRepository {
  /**
   * Obtiene todos los proyectos disponibles.
   */
  /*getAll(): Promise<Project[]>;

  /**
   * Busca un proyecto por su identificador.
   * Devuelve null si no existe.
   */
  /*getById(id: string): Promise<Project | null>;

  /**
   * Crea o actualiza un proyecto.
   */
  /*save(project: Project): Promise<Project>;

  /**
   * Elimina un proyecto por su identificador.
   */
  /*delete(id: string): Promise<void>;
//}*/

import type { Project } from '../Project';
import type { Slide } from '../Slide';

export interface IProjectRepository {
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  saveProject(project: Project): Promise<void>;
  deleteProject(id: string): Promise<void>;
  saveSlide(slide: Slide): Promise<void>;
  deleteSlide(slideId: string): Promise<void>;
}