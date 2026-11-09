/** @jest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, jest } from '@jest/globals';
import type { Project } from '../models/Project';
import type { Slide } from '../models/Slide';
import { SlideRenderer } from '../views/components/SlideRenderer';
import { EditorView } from '../views/containers/EditorView';
import { PresentationView } from '../views/containers/PresentationView';

const cover: Slide = { id: 'cover', projectId: 'project', type: 'title', layout: 'Title', content: { title: 'Portada', text: 'Subtítulo' }, order: 1 };
const content: Slide = { id: 'content', projectId: 'project', type: 'content', layout: 'TextOnly', content: { title: 'Idea', text: 'Mensaje' }, order: 2 };
const project: Project = { id: 'project', name: 'Proyecto', author: 'Ana', topic: 'Diseño', createdAt: new Date('2026-11-09'), slides: [cover, content] };

describe('Fase 3: layouts y modos', () => {
  it('muestra portada sin pie y diapositiva de desarrollo con pie', () => {
    const view = render(<SlideRenderer slide={cover} project={project} slideNumber={1} />);
    expect(screen.getByText('Portada')).toBeTruthy();
    expect(view.container.querySelector('.slide-footer')).toBeNull();
    view.rerender(<SlideRenderer slide={content} project={project} slideNumber={2} />);
    expect(screen.getByText('Mensaje')).toBeTruthy();
    expect(view.container.querySelector('.slide-footer')?.textContent).toContain('Ana');
    expect(view.container.querySelector('.slide-footer')?.textContent).toContain('02');
  });

  it('permite cambiar el layout y editar el título desde el panel', () => {
    const onChangeSlide = jest.fn();
    render(<EditorView project={project} projects={[project]} slide={content} onSelectSlide={jest.fn()} onChangeSlide={onChangeSlide} onAddSlide={jest.fn()} onDeleteSlide={jest.fn()} onTransfer={jest.fn()} onPresent={jest.fn()} status="Todo guardado" />);
    fireEvent.click(screen.getByRole('button', { name: 'Texto + imagen' }));
    expect(onChangeSlide).toHaveBeenCalledWith(expect.objectContaining({ layout: 'TextAndImage' }));
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Otra idea' } });
    expect(onChangeSlide).toHaveBeenCalledWith(expect.objectContaining({ content: expect.objectContaining({ title: 'Otra idea' }) }));
  });

  it('navega con flechas sin salir de los límites', () => {
    render(<PresentationView project={project} initialSlideId="cover" onExit={jest.fn()} />);
    expect(screen.getByText('1 / 2')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('2 / 2')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('2 / 2')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('1 / 2')).toBeTruthy();
  });
});
