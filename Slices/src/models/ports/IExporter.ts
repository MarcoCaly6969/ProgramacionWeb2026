import type { Project } from '../Project';

export type ExportFormat = 'pdf' | 'json' | 'html';

export interface IExporter {
  export(
    project: Project,
    format: ExportFormat,
  ): Promise<Blob>;
}