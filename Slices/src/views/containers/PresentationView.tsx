import { useEffect, useRef, useState } from 'react';
import type { Project } from '../../models/Project';
import { SlideRenderer } from '../components/SlideRenderer';

export function PresentationView({ project, initialSlideId, onExit }: { project: Project; initialSlideId: string; onExit: () => void }) {
  const slides = [...project.slides].sort((a, b) => a.order - b.order);
  const [index, setIndex] = useState(Math.max(0, slides.findIndex((slide) => slide.id === initialSlideId)));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    root?.requestFullscreen?.().catch(() => undefined);
    const onFullscreenChange = () => { if (!document.fullscreenElement && root) onExit(); };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => { document.removeEventListener('fullscreenchange', onFullscreenChange); if (document.fullscreenElement === root) document.exitFullscreen().catch(() => undefined); };
  }, [onExit]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') { event.preventDefault(); setIndex((value) => Math.min(slides.length - 1, value + 1)); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); setIndex((value) => Math.max(0, value - 1)); }
      if (event.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [slides.length, onExit]);

  return <div className="presentation" ref={rootRef} role="dialog" aria-modal="true" aria-label={`Presentación: ${project.name}`}>
    <div className="presentation-top"><span>◈ {project.name}</span><button type="button" onClick={onExit} aria-label="Salir de la presentación">Salir ✕</button></div>
    <div className="presentation-stage">{slides[index] && <SlideRenderer slide={slides[index]} project={project} slideNumber={index + 1} />}</div>
    <div className="presentation-controls"><button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)} aria-label="Diapositiva anterior">←</button><span>{index + 1} / {slides.length}</span><button type="button" disabled={index === slides.length - 1} onClick={() => setIndex(index + 1)} aria-label="Diapositiva siguiente">→</button></div>
  </div>;
}
