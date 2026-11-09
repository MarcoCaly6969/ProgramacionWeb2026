export type SlideLayout = 'Title' | 'TextOnly' | 'ImageOnly' | 'TextAndImage';

export interface Slide {
  id: string;
  projectId: string;
  type: 'title' | 'content';
  content: {
    title?: string;
    text?: string;
    imageUrl?: string;
  };
  layout: SlideLayout;
  order: number;
}
