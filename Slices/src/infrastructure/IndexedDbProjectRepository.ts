import type { IProjectRepository } from '../models/ports/IProjectRepository';
import type { Project } from '../models/Project';
import type { Slide } from '../models/Slide';

export class IndexedDbProjectRepository implements IProjectRepository {
  private dbName = 'PresentationsDB';
  private dbVersion = 1;
  private slideWrites: Promise<void> = Promise.resolve();

  private queueSlideWrite(action: () => Promise<void>): Promise<void> {
    const result = this.slideWrites.then(action);
    this.slideWrites = result.catch(() => undefined);
    return result;
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getProjects(): Promise<Project[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readonly');
      const store = tx.objectStore('projects');
      const request = store.getAll();
      request.onsuccess = () => { db.close(); resolve(request.result || []); };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  }

  async getProjectById(id: string): Promise<Project | null> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readonly');
      const store = tx.objectStore('projects');
      const request = store.get(id);
      request.onsuccess = () => { db.close(); resolve(request.result || null); };
      request.onerror = () => { db.close(); reject(request.error); };
    });
  }

  async saveProject(project: Project): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite');
      const store = tx.objectStore('projects');
      store.put(project);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  async deleteProject(id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite');
      const store = tx.objectStore('projects');
      store.delete(id);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  async saveSlide(slide: Slide): Promise<void> {
    return this.queueSlideWrite(async () => {
      const project = await this.getProjectById(slide.projectId);
      if (!project) throw new Error('Proyecto no encontrado');
      const index = project.slides.findIndex((s) => s.id === slide.id);
      if (index >= 0) project.slides[index] = slide;
      else project.slides.push(slide);
      await this.saveProject(project);
    });
  }

  async deleteSlide(slideId: string): Promise<void> {
    return this.queueSlideWrite(async () => {
      const projects = await this.getProjects();
      for (const project of projects) {
        const remaining = project.slides.filter((s) => s.id !== slideId);
        if (remaining.length !== project.slides.length) {
          project.slides = remaining.sort((a, b) => a.order - b.order).map((slide, index) => ({ ...slide, order: index + 1 }));
          await this.saveProject(project);
          break;
        }
      }
    });
  }
}
