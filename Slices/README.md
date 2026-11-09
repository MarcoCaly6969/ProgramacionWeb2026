# Lúmina — editor de presentaciones

Aplicación React y TypeScript que guarda proyectos y diapositivas en IndexedDB. La fase 3 incorpora portada, tres diseños de desarrollo, edición con vista previa inmediata y modo de presentación con pantalla completa y navegación por teclado.

## Ejecutar

```bash
npm ci
npm run dev
```

Abre la dirección local que muestra Vite. No se requiere servidor de datos. `npm run build` crea la versión de producción y `npm test` ejecuta las pruebas.

## Uso

1. Crea un proyecto con nombre, autor y tema. Se crea una portada automáticamente.
2. Agrega diapositivas de desarrollo y elige entre Solo texto, Solo imagen o Texto + imagen.
3. Edita título, texto e imagen. Puedes introducir una URL o cargar una imagen local de hasta 5 MB. La imagen local queda almacenada en IndexedDB y permanece disponible sin conexión.
4. Usa **Presentar** para abrir la presentación. Navega con las flechas izquierda y derecha; `Esc` vuelve al editor.
5. Para reutilizar una diapositiva de desarrollo, elige otro proyecto y usa **Copiar** o **Mover**.

Los cambios se guardan automáticamente. Las imágenes cargadas desde URL requieren conexión para mostrarse si el navegador no las tiene en caché. Para una presentación totalmente local, carga archivos de imagen.

## Alcance

La exportación HTML/PDF corresponde a la fase 4 de la guía y no está incluida en esta fase.
