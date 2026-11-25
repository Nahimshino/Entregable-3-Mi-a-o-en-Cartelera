---
name: commit
description: Crea un commit en español con prefijo (docs, feat, fix, test, chore) después de verificar. Úsala cada vez que haya que commitear en este repositorio.
---

# /commit

1. Revisa qué cambió: `git status` y `git diff --staged` (o `git diff` si no hay nada preparado).
   Nunca agregues `.env` ni archivos con claves; si aparecen, detente y avisa.
2. Si el cambio toca código (`src/`, `App.tsx`, `firestore.rules`, configuración), ejecuta
   `npm test` y `npx tsc --noEmit`. Si alguno falla, no commitees: muestra el error.
   Excepción: un commit `test:` con tests nuevos en rojo a propósito (tests primero); dilo en el mensaje.
3. Respeta el orden del proceso: el documento (`docs:`) de un cambio va en un commit anterior al código.
4. Agrega solo los archivos del cambio (`git add <rutas>`, nunca `git add -A` a ciegas).
5. Escribe el mensaje en español, en minúsculas tras el prefijo, en modo imperativo o descriptivo y de
   menos de 72 caracteres en la primera línea:

   | Prefijo | Cuándo |
   | :--- | :--- |
   | `docs:` | Auditoría, PRD, backlog, specs, diseño, README, AGENTS.md |
   | `test:` | Tests nuevos o cambiados |
   | `feat:` | Funcionalidad nueva |
   | `fix:` | Corrección de un fallo |
   | `chore:` | Herramientas, dependencias, configuración, harness |

   Si hace falta, una línea en blanco y un cuerpo breve con el porqué. Referencia el ticket o la decisión
   (por ejemplo `T-03`, `D8`) cuando aplique.
6. Muestra `git log --oneline -1` al terminar.
