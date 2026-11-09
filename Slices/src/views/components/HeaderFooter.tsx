interface HeaderFooterProps {
  author: string;
  topic: string;
  slideNumber: number;
  date: Date;
}

export function HeaderFooter({ author, topic, slideNumber, date }: HeaderFooterProps) {
  return (
    <footer className="slide-footer">
      <span>{author || 'Sin autor'}</span>
      <span>{topic || 'Sin tema'} · {new Intl.DateTimeFormat('es-BO', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)}</span>
      <span>{String(slideNumber).padStart(2, '0')}</span>
    </footer>
  );
}
