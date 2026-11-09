import type { Slide } from '../../models/Slide';

export function LayoutImageOnly({ slide }: { slide: Slide }) {
  return (
    <div className="slide-body slide-image-only">
      <h2>{slide.content.title || 'Título de la diapositiva'}</h2>
      {slide.content.imageUrl ? <img src={slide.content.imageUrl} alt={slide.content.title || 'Imagen de la diapositiva'} /> : <div className="image-placeholder">Agrega una imagen para esta diapositiva</div>}
    </div>
  );
}
