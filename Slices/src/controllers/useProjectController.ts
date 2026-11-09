import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../models/Project';
import type { IProjectRepository } from '../models/ports/IProjectRepository';

export function useProjectController(repository: IProjectRepository) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isPresentation, setIsPresentation] = useState<boolean>(false);

  const loadProjects = useCallback(async () => {
    const data = await repository.getProjects();
    setProjects(data);
    setCurrentProject((prev) => {
      if (prev) {
        return data.find((p) => p.id === prev.id) || data[0] || null;
      }
      return data[0] || null;
    });
  }, [repository]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = async (name: string, author: string, topic: string) => {
    const projectId = crypto.randomUUID();
    const newProject: Project = {
      id: projectId,
      name,
      author,
      topic,
      createdAt: new Date(),
      slides: [
        {
          id: crypto.randomUUID(),
          projectId,
          type: 'title',
          layout: 'Title',
          content: { title: name, text: `${author} - ${topic}` },
          order: 1,
        },
      ],
    };
    await repository.saveProject(newProject);
    await loadProjects();
    setCurrentProject(newProject);
    return newProject;
  };

  const deleteProject = async (id: string) => {
    await repository.deleteProject(id);
    await loadProjects();
  };

  return {
    projects,
    currentProject,
    setCurrentProject,
    isPresentation,
    setIsPresentation,
    createProject,
    deleteProject,
    loadProjects,
  };
}