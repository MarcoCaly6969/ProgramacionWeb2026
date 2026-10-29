export type SlideLayout =
  | 'text-only'
  | 'image-only'
  | 'text-and-image';

export interface Slide {
  id: string;
  projectId: string;
  title: string;
  content: string;
  imageUrl?: string;
  layout: SlideLayout;
  order: number;
  createdAt: string;
  updatedAt: string;
}