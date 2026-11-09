import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { IndexedDbProjectRepository } from '../infrastructure/IndexedDbProjectRepository';
import { useSlideController } from '../controllers/useSlideController';
import type { Project } from '../models/Project';
import type { Slide } from '../models/Slide';

describe('useSlideController (HU-01 y HU-04)', () => {
  let repo: IndexedDbProjectRepository;

  beforeEach(() => {
    // Reinicia el entorno de IndexedDB antes de cada prueba
    indexedDB = new IDBFactory();
    repo = new IndexedDbProjectRepository();
  });

  it('debe agregar un nuevo slide a un proyecto', async () => {
    const project: Project = {
      id: 'proj-1',
      name: 'Proyecto de Prueba',
      author: 'Tester',
      topic: 'Testing',
      createdAt: new Date(),
      slides: [],
    };
    await repo.saveProject(project);

    const controller = useSlideController(repo);
    const newSlide = await controller.addSlide('proj-1', 1);

    const updatedProject = await repo.getProjectById('proj-1');
    expect(updatedProject?.slides.length).toBe(1);
    expect(updatedProject?.slides[0].id).toBe(newSlide.id);
    expect(updatedProject?.slides[0].layout).toBe('TextOnly');
  });

  it('debe copiar un slide hacia otro proyecto (HU-04)', async () => {
    const slideOriginal: Slide = {
      id: 'slide-10',
      projectId: 'proj-A',
      type: 'content',
      layout: 'TextOnly',
      content: { title: 'Slide Original', text: 'Contenido A' },
      order: 1,
    };

    const projectA: Project = {
      id: 'proj-A',
      name: 'Proyecto A',
      author: 'Autor',
      topic: 'Tema A',
      createdAt: new Date(),
      slides: [slideOriginal],
    };

    const projectB: Project = {
      id: 'proj-B',
      name: 'Proyecto B',
      author: 'Autor',
      topic: 'Tema B',
      createdAt: new Date(),
      slides: [],
    };

    await repo.saveProject(projectA);
    await repo.saveProject(projectB);

    const controller = useSlideController(repo);
    await controller.copySlideToProject(slideOriginal, 'proj-B');

    const updatedA = await repo.getProjectById('proj-A');
    const updatedB = await repo.getProjectById('proj-B');

    // Debe seguir existiendo en el proyecto origen
    expect(updatedA?.slides.length).toBe(1);
    // Debe haber ingresado al proyecto destino con un nuevo ID
    expect(updatedB?.slides.length).toBe(1);
    expect(updatedB?.slides[0].content.title).toBe('Slide Original');
    expect(updatedB?.slides[0].id).not.toBe(slideOriginal.id);
  });

  it('debe trasladar (mover) un slide de un proyecto a otro (HU-04)', async () => {
    const slideAMover: Slide = {
      id: 'slide-20',
      projectId: 'proj-A',
      type: 'content',
      layout: 'ImageOnly',
      content: { imageUrl: 'https://example.com/img.png' },
      order: 1,
    };

    const projectA: Project = {
      id: 'proj-A',
      name: 'Proyecto A',
      author: 'Autor',
      topic: 'Tema A',
      createdAt: new Date(),
      slides: [slideAMover],
    };

    const projectB: Project = {
      id: 'proj-B',
      name: 'Proyecto B',
      author: 'Autor',
      topic: 'Tema B',
      createdAt: new Date(),
      slides: [],
    };

    await repo.saveProject(projectA);
    await repo.saveProject(projectB);

    const controller = useSlideController(repo);
    await controller.moveSlideToProject(slideAMover, 'proj-B');

    const updatedA = await repo.getProjectById('proj-A');
    const updatedB = await repo.getProjectById('proj-B');

    // Debe eliminarse del origen
    expect(updatedA?.slides.length).toBe(0);
    // Debe existir en el destino
    expect(updatedB?.slides.length).toBe(1);
    expect(updatedB?.slides[0].content.imageUrl).toBe('https://example.com/img.png');
  });
});
