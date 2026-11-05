import type { Slide } from '../models/Slide';
import type { IProjectRepository } from '../models/ports/IProjectRepository';

export function useSlideController(
  repository: IProjectRepository,
  onUpdate?: () => Promise<void>
) {
  const addSlide = async (projectId: string, order: number) => {
    const newSlide: Slide = {
      id: crypto.randomUUID(),
      projectId,
      type: 'content',
      layout: 'TextOnly',
      content: { title: 'Nuevo Slide de Desarrollo', text: 'Escribe el contenido aquí...' },
      order,
    };
    await repository.saveSlide(newSlide);
    if (onUpdate) await onUpdate();
    return newSlide;
  };

  const updateSlide = async (slide: Slide) => {
    await repository.saveSlide(slide);
    if (onUpdate) await onUpdate();
  };

  const deleteSlide = async (slideId: string) => {
    await repository.deleteSlide(slideId);
    if (onUpdate) await onUpdate();
  };

  const copySlideToProject = async (slide: Slide, targetProjectId: string): Promise<void> => {
    const targetProject = await repository.getProjectById(targetProjectId);
    if (!targetProject) throw new Error('Proyecto destino no encontrado');

    const copiedSlide: Slide = {
      ...slide,
      id: crypto.randomUUID(),
      projectId: targetProjectId,
      order: targetProject.slides.length + 1,
    };

    await repository.saveSlide(copiedSlide);
    if (onUpdate) await onUpdate();
  };

  const moveSlideToProject = async (slide: Slide, targetProjectId: string): Promise<void> => {
    await copySlideToProject(slide, targetProjectId);
    await repository.deleteSlide(slide.id);
    if (onUpdate) await onUpdate();
  };

  return {
    addSlide,
    updateSlide,
    deleteSlide,
    copySlideToProject,
    moveSlideToProject,
  };
}