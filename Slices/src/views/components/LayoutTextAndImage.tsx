import type { Slide } from '../../models/Slide';

export function LayoutTextAndImage({ slide }: { slide: Slide }) {
  return (
    <div className="slide-body slide-text-image">
      <div className="slide-copy">
        <div className="slide-eyebrow">EN PERSPECTIVA</div>
        <h2>{slide.content.title || 'Título de la diapositiva'}</h2>
        <p>{slide.content.text || 'Escribe tu mensaje aquí.'}</p>
      </div>
      {slide.content.imageUrl ? <img src={slide.content.imageUrl} alt={slide.content.title || 'Imagen de la diapositiva'} /> : <div className="image-placeholder">Agrega una imagen</div>}
    </div>
  );
}
