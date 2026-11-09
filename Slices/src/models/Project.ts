import type { Slide } from './Slide';

export interface Project {
  id: string;
  name: string;
  description: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}