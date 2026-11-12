import { useCallback, useMemo, useRef, useState } from 'react';
import { useProjectController } from '../controllers/useProjectController';
import { useSlideController } from '../controllers/useSlideController';
import { IndexedDbProjectRepository } from '../infrastructure/IndexedDbProjectRepository';
import type { Slide } from '../models/Slide';
import { EditorView } from './containers/EditorView';
import { PresentationView } from './containers/PresentationView';

function App() {
  const repository = useMemo(() => new IndexedDbProjectRepository(), []);
  const slideController = useMemo(() => useSlideController(repository), [repository]);
  const { projects, currentProject, setCurrentProject, isPresentation, setIsPresentation, createProject, deleteProject, loadProjects, error } = useProjectController(repository);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState('Todo guardado');
  const [actionError, setActionError] = useState<string | null>(null);
  const pendingSave = useRef<Promise<void>>(Promise.resolve());
  const sortedSlides = currentProject ? [...currentProject.slides].sort((a, b) => a.order - b.order) : [];
  const selectedSlide = sortedSlides.find((slide) => slide.id === selectedSlideId) || sortedSlides[0];

  const run = async (action: () => Promise<void>) => {
    try { setActionError(null); await pendingSave.current; await action(); }
    catch (cause) { setActionError(cause instanceof Error ? cause.message : 'No se pudo completar la acción.'); }
  };

  const changeSlide = (slide: Slide) => {
    if (!currentProject) return;
    setCurrentProject({ ...currentProject, slides: currentProject.slides.map((item) => item.id === slide.id ? slide : item) });
    setStatus('Guardando…');
    pendingSave.current = pendingSave.current.catch(() => undefined).then(() => slideController.updateSlide(slide));
    pendingSave.current.then(() => setStatus('Todo guardado'), () => { setStatus('Error al guardar'); setActionError('No se pudo guardar la diapositiva.'); });
  };

  const selectProject = (id: string) => run(async () => {
    const project = await repository.getProjectById(id);
    setCurrentProject(project);
    setSelectedSlideId(null);
  });

  const addSlide = () => run(async () => {
    if (!currentProject) return;
    const newSlide = await slideController.addSlide(currentProject.id, currentProject.slides.length + 1);
    await loadProjects();
    setSelectedSlideId(newSlide.id);
  });

  const removeSlide = () => run(async () => {
    if (!selectedSlide || selectedSlide.type === 'title') return;
    await slideController.deleteSlide(selectedSlide.id);
    setSelectedSlideId(null);
    await loadProjects();
  });

  const transferSlide = (targetId: string, mode: 'copy' | 'move') => run(async () => {
    if (!selectedSlide || !currentProject || targetId === currentProject.id) return;
    if (mode === 'copy') await slideController.copySlideToProject(selectedSlide, targetId);
    else { await slideController.moveSlideToProject(selectedSlide, targetId); setSelectedSlideId(null); }
    await loadProjects();
    setStatus(mode === 'copy' ? 'Diapositiva copiada' : 'Diapositiva movida');
  });

  const create = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    void run(async () => {
      await createProject(name.trim(), author.trim(), topic.trim());
      setSelectedSlideId(null);
      setName(''); setAuthor(''); setTopic(''); setShowNewProject(false);
    });
  };

  const exitPresentation = useCallback(() => setIsPresentation(false), [setIsPresentation]);

  return <div className="app-shell">
    <header className="app-header"><div className="brand"><span className="brand-mark">◈</span><span>lúmina<span className="brand-dot">.</span></span></div><nav aria-label="Navegación principal"><span className="nav-active">Espacio de trabajo</span><span className="nav-secondary">Mis presentaciones</span></nav><div className="header-badge">EDITOR DE PRESENTACIONES</div></header>
    <main className="app-main">
      <div className="page-heading"><div><span className="eyebrow">TU ESPACIO CREATIVO</span><h1>Presentaciones que <em>inspiran.</em></h1><p>Crea, edita y presenta tus ideas desde un solo lugar.</p></div><button type="button" className="new-project-button" onClick={() => setShowNewProject(true)}>＋ Nuevo proyecto</button></div>
      {(error || actionError) && <div className="app-error" role="alert">{error || actionError}<button type="button" onClick={() => setActionError(null)}>✕</button></div>}
      <section className="project-strip" aria-label="Proyectos"><div className="project-strip-heading"><span className="eyebrow">BIBLIOTECA</span><h2>Mis proyectos <span>{projects.length}</span></h2></div><div className="project-tabs">{projects.map((project) => <button key={project.id} type="button" className={`project-tab ${currentProject?.id === project.id ? 'active' : ''}`} onClick={() => selectProject(project.id)}><span className="project-tab-icon">◈</span><span><strong>{project.name}</strong><small>{project.slides.length} diapositivas</small></span></button>)}{projects.length === 0 && <span className="no-projects">Todavía no hay proyectos. Crea el primero para comenzar.</span>}</div>{currentProject && <button type="button" className="project-delete" onClick={() => { if (window.confirm(`¿Eliminar “${currentProject.name}” y todas sus diapositivas?`)) void run(async () => { await deleteProject(currentProject.id); setSelectedSlideId(null); }); }}>Eliminar proyecto</button>}</section>
      {currentProject && selectedSlide ? <EditorView project={currentProject} projects={projects} slide={selectedSlide} onSelectSlide={setSelectedSlideId} onChangeSlide={changeSlide} onAddSlide={addSlide} onDeleteSlide={removeSlide} onTransfer={transferSlide} onPresent={() => setIsPresentation(true)} status={status} /> : <section className="empty-state"><span>✧</span><h2>Tu próxima gran idea empieza aquí</h2><p>Crea un proyecto para diseñar tu primera presentación.</p><button type="button" className="primary-button" onClick={() => setShowNewProject(true)}>Crear proyecto</button></section>}
    </main>
    {showNewProject && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowNewProject(false); }}><form className="new-project-modal" onSubmit={create}><span className="eyebrow">EMPIEZA A CREAR</span><h2>Nuevo proyecto</h2><p>Tu primera diapositiva será una portada lista para editar.</p><label htmlFor="project-name">Nombre del proyecto</label><input id="project-name" required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Mi gran presentación" /><label htmlFor="project-author">Autor</label><input id="project-author" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Tu nombre" /><label htmlFor="project-topic">Tema</label><input id="project-topic" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Ej. Diseño e innovación" /><div className="modal-actions"><button type="button" onClick={() => setShowNewProject(false)}>Cancelar</button><button type="submit" className="primary-button">Crear proyecto</button></div></form></div>}
    {isPresentation && currentProject && selectedSlide && <PresentationView project={currentProject} initialSlideId={selectedSlide.id} onExit={exitPresentation} />}
  </div>;
}

export default App;
