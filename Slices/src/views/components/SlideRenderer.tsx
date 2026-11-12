import type { Project } from '../../models/Project';
import type { Slide } from '../../models/Slide';
import { HeaderFooter } from './HeaderFooter';
import { LayoutImageOnly } from './LayoutImageOnly';
import { LayoutTextAndImage } from './LayoutTextAndImage';
import { LayoutTextOnly } from './LayoutTextOnly';

export function SlideRenderer({ slide, project, slideNumber }: { slide: Slide; project: Project; slideNumber: number }) {
  const isTitle = slide.type === 'title';
  return (
    <article className={`slide-canvas ${isTitle ? 'slide-cover' : ''}`} aria-label={`Diapositiva ${slideNumber}: ${slide.content.title || 'Sin título'}`}>
      {isTitle ? (
        <div className="cover-content">
          <span className="cover-kicker">PRESENTACIÓN · {project.topic || 'NUEVO TEMA'}</span>
          <h2>{slide.content.title || project.name}</h2>
          <p>{slide.content.text || 'Una nueva historia empieza aquí.'}</p>
          <div className="cover-author">{project.author || 'Sin autor'}</div>
        </div>
      ) : (
        <>
          {slide.layout === 'ImageOnly' ? <LayoutImageOnly slide={slide} /> : slide.layout === 'TextAndImage' ? <LayoutTextAndImage slide={slide} /> : <LayoutTextOnly slide={slide} />}
          <HeaderFooter author={project.author} topic={project.topic} slideNumber={slideNumber} date={new Date(project.createdAt)} />
        </>
      )}
    </article>
  );
}
