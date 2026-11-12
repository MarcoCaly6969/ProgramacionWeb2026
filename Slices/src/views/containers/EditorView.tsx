import { useState, type ChangeEvent } from 'react';
import type { Project } from '../../models/Project';
import type { Slide, SlideLayout } from '../../models/Slide';
import { SlideRenderer } from '../components/SlideRenderer';

interface EditorViewProps {
  project: Project;
  projects: Project[];
  slide: Slide;
  onSelectSlide: (id: string) => void;
  onChangeSlide: (slide: Slide) => void;
  onAddSlide: () => void;
  onDeleteSlide: () => void;
  onTransfer: (targetId: string, mode: 'copy' | 'move') => void;
  onPresent: () => void;
  status: string;
}

const layouts: { value: SlideLayout; label: string; icon: string }[] = [
  { value: 'TextOnly', label: 'Solo texto', icon: '≡' },
  { value: 'ImageOnly', label: 'Solo imagen', icon: '▧' },
  { value: 'TextAndImage', label: 'Texto + imagen', icon: '◫' },
];

export function EditorView({ project, projects, slide, onSelectSlide, onChangeSlide, onAddSlide, onDeleteSlide, onTransfer, onPresent, status }: EditorViewProps) {
  const [targetId, setTargetId] = useState('');
  const [imageError, setImageError] = useState('');
  const slides = [...project.slides].sort((a, b) => a.order - b.order);
  const slideNumber = slides.findIndex((item) => item.id === slide.id) + 1;
  const patchContent = (patch: Partial<Slide['content']>) => onChangeSlide({ ...slide, content: { ...slide.content, ...patch } });

  const loadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setImageError('Selecciona un archivo de imagen.'); return; }
    if (file.size > 5 * 1024 * 1024) { setImageError('La imagen debe ocupar menos de 5 MB.'); return; }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => patchContent({ imageUrl: String(reader.result) });
    reader.onerror = () => setImageError('No se pudo leer la imagen.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className="editor-grid">
      <aside className="slide-list panel" aria-label="Diapositivas">
        <div className="panel-heading"><div><span className="eyebrow">CONTENIDO</span><h2>Diapositivas <span>{slides.length}</span></h2></div></div>
        <div className="slide-list-items">
          {slides.map((item, index) => (
            <button key={item.id} type="button" className={`slide-list-item ${item.id === slide.id ? 'active' : ''}`} onClick={() => onSelectSlide(item.id)} aria-current={item.id === slide.id ? 'true' : undefined}>
              <span className="slide-mini"><span>{item.type === 'title' ? '◈' : item.layout === 'ImageOnly' ? '▧' : item.layout === 'TextAndImage' ? '◫' : '≡'}</span></span>
              <span className="slide-list-copy"><strong>{item.content.title || (item.type === 'title' ? project.name : 'Sin título')}</strong><small>{item.type === 'title' ? 'Portada' : layouts.find((layout) => layout.value === item.layout)?.label}</small></span>
              <span className="slide-index">{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
        <button type="button" className="add-slide" onClick={onAddSlide}>＋ Nueva diapositiva</button>
      </aside>

      <section className="workspace-panel" aria-label="Vista previa">
        <div className="workspace-toolbar"><div><span className="eyebrow">LIENZO DE EDICIÓN</span><h2>{slide.type === 'title' ? 'Portada' : `Diapositiva ${slideNumber}`}</h2></div><div className="toolbar-actions"><span className="save-status" role="status">{status}</span><button type="button" className="primary-button" onClick={onPresent}>▷ Presentar</button></div></div>
        <div className="canvas-stage"><SlideRenderer slide={slide} project={project} slideNumber={slideNumber} /></div>
        <div className="canvas-hint">Los cambios se muestran en tiempo real y se guardan automáticamente.</div>
      </section>

      <aside className="inspector panel" aria-label="Ajustes de diapositiva">
        <div className="panel-heading"><div><span className="eyebrow">PERSONALIZAR</span><h2>Propiedades</h2></div></div>
        <div className="inspector-content">
          <label className="field-label" htmlFor="slide-title">Título</label>
          <input id="slide-title" value={slide.content.title || ''} onChange={(event) => patchContent({ title: event.target.value })} placeholder="Título de la diapositiva" />
          {slide.type === 'content' && <><label className="field-label">Diseño</label><div className="layout-options" role="group" aria-label="Diseño de diapositiva">{layouts.map((layout) => <button key={layout.value} type="button" className={slide.layout === layout.value ? 'chosen' : ''} onClick={() => onChangeSlide({ ...slide, layout: layout.value })} title={layout.label} aria-label={layout.label} aria-pressed={slide.layout === layout.value}><span>{layout.icon}</span><small>{layout.label}</small></button>)}</div></>}
          {(slide.type === 'title' || slide.layout !== 'ImageOnly') && <><label className="field-label" htmlFor="slide-text">{slide.type === 'title' ? 'Subtítulo' : 'Contenido'}</label><textarea id="slide-text" rows={6} value={slide.content.text || ''} onChange={(event) => patchContent({ text: event.target.value })} placeholder="Escribe aquí tu mensaje..." /></>}
          {slide.type === 'content' && slide.layout !== 'TextOnly' && <><label className="field-label" htmlFor="image-url">URL de imagen</label><input id="image-url" type="url" value={slide.content.imageUrl?.startsWith('data:') ? '' : slide.content.imageUrl || ''} onChange={(event) => patchContent({ imageUrl: event.target.value })} placeholder="https://ejemplo.com/imagen.jpg" /><div className="upload-divider">o usa una imagen local</div><label className="upload-button" htmlFor="image-file">↑ Cargar imagen<input id="image-file" type="file" accept="image/*" onChange={loadImage} /></label>{slide.content.imageUrl && <button type="button" className="text-button" onClick={() => patchContent({ imageUrl: '' })}>Quitar imagen</button>}{imageError && <p className="field-error" role="alert">{imageError}</p>}</>}
          {slide.type === 'content' && <div className="inspector-section"><label className="field-label" htmlFor="target-project">Reutilizar en otro proyecto</label><select id="target-project" value={targetId} onChange={(event) => setTargetId(event.target.value)}><option value="">Elegir proyecto destino</option>{projects.filter((item) => item.id !== project.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><div className="transfer-actions"><button type="button" disabled={!targetId} onClick={() => onTransfer(targetId, 'copy')}>Copiar</button><button type="button" disabled={!targetId} onClick={() => onTransfer(targetId, 'move')}>Mover</button></div></div>}
          {slide.type === 'content' && <button type="button" className="danger-button" onClick={onDeleteSlide}>Eliminar diapositiva</button>}
        </div>
      </aside>
    </div>
  );
}
