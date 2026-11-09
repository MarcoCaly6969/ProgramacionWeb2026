import type { Slide } from '../../models/Slide';

export function LayoutTextOnly({ slide }: { slide: Slide }) {
  return (
    <div className="slide-body slide-text-only">
      <div className="slide-eyebrow">IDEA PRINCIPAL</div>
      <h2>{slide.content.title || 'Título de la diapositiva'}</h2>
      <p>{slide.content.text || 'Añade aquí el contenido de tu presentación.'}</p>
    </div>
  );
}
