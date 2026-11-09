import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { IndexedDbProjectRepository } from '../infrastructure/IndexedDbProjectRepository';
import type { Project } from '../models/Project';

describe('IndexedDbProjectRepository (HU-01)', () => {
  let repo: IndexedDbProjectRepository;

  beforeEach(() => {
    // Reinicia el contexto de IndexedDB para cada prueba
    indexedDB = new IDBFactory();
    repo = new IndexedDbProjectRepository();
  });

  it('debe guardar, listar y eliminar un proyecto correctamente en IndexedDB', async () => {
    const project: Project = {
      id: 'proj-1',
      name: 'Presentación Arquitectura',
      author: 'Autor Test',
      topic: 'MVC e Inversión de Dependencias',
      createdAt: new Date(),
      slides: [],
    };

    // 1. Guardar
    await repo.saveProject(project);

    // 2. Obtener por ID
    const byId = await repo.getProjectById('proj-1');
    expect(byId).not.toBeNull();
    expect(byId?.name).toBe('Presentación Arquitectura');

    // 3. Listar todos
    const allProjects = await repo.getProjects();
    expect(allProjects.length).toBe(1);

    // 4. Eliminar
    await repo.deleteProject('proj-1');
    const afterDelete = await repo.getProjects();
    expect(afterDelete.length).toBe(0);
  });
});
