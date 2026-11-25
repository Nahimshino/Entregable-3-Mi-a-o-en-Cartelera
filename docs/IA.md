# Uso de IA — Entregable 3

Herramientas: **Claude Code** (Claude Opus 5.5) como programador, dentro de VS Code y la app de escritorio, y
**Codex** como segunda opinión al revisar cambios. La autora dirige: cada paso parte de un documento
(auditoría, PRD, spec, `DESIGN.md`) y cada cambio se revisa antes del commit.

## Cinco momentos clave

### 1. «Cada cambio es una prueba y un commit»

- **Qué se pidió:** hacer el Hito 2 en adelante.
- **Qué hizo el agente:** empezó a escribir varios documentos seguidos para commitearlos al final.
- **Qué se corrigió:** la autora lo detuvo: cada cambio se prueba, se commitea y se sube solo si funciona. Desde
  ahí cada documento tiene su prueba (por ejemplo, un script que cuenta que D1 a D13 están en el PRD y que
  cada decisión tiene criterio) y su commit con push.
- **Qué parte del harness lo habría evitado:** la skill `/commit` ya exigía verificar; faltaba escribir en
  `AGENTS.md` que un commit lleva un solo cambio probado. Queda como regla de trabajo.

### 2. Tests de desempate que no distinguían la regla (D8)

- **Qué se pidió:** tests de `resumenAnual` antes de implementar (T-01).
- **Qué hizo el agente:** escribió los empates de D8 con géneros en los que el orden alfabético daba el mismo
  ganador que el promedio de calificación.
- **Qué se corrigió:** al romper a propósito el desempate por promedio, ningún test de D8 falló. Se cambiaron
  los nombres para que el alfabeto apuntara al perdedor (commit `test:` antes del `feat:`); ahora la misma
  mutación rompe 3 tests.
- **Qué parte del harness lo habría evitado:** un sensor de mutaciones (o la costumbre, ya aplicada en cada
  test nuevo, de romper la regla y ver el test en rojo).

### 3. Vitest exigía una versión de Node que el README no pedía

- **Qué se pidió:** instalar Vitest y el primer test (Hito 1, paso 5).
- **Qué hizo el agente:** instaló Vitest 5 y todo pasó en la PC, que tiene Node 24.
- **Qué se corrigió:** la revisión de Codex notó que Vitest 5 pide Node 22.12 o más y que el README decía
  «Node 20+». Se corrigió el README (`docs:`) y se declaró `engines` (`chore:`).
- **Qué parte del harness lo habría evitado:** un CI con la versión mínima de Node, o un campo `engines`
  desde el inicio con `engine-strict`.

### 4. El brand board se veía vacío fuera del navegador

- **Qué se pidió:** el brand board a partir del brief.
- **Qué hizo el agente:** generó las tablas de paleta, contrastes y barras con JavaScript dentro de la página.
- **Qué se corrigió:** al abrirlo en la vista previa (sin scripts) las tablas salieron vacías, y GitHub tampoco
  ejecuta scripts. Se generaron una vez y quedaron escritas en el HTML; los contrastes se comprobaron con un
  script (mínimo 4,58:1).
- **Qué parte del harness lo habría evitado:** un sensor que compare los tokens del brand board, `DESIGN.md` y
  `src/tema/` (se hizo a mano con `diff` y coincidieron).

### 5. Un reemplazo automático que rompió los tipos

- **Qué se pidió:** pasar las pantallas del Proyecto 3 a tokens (T-09).
- **Qué hizo el agente:** reemplazó `size={48}` por `size={icono.grande}` en todos los archivos; en `Vacio` la
  prop `icono` tapaba al token y el código quedó mal tipado. Antes, en el Hito 3, un reemplazo con `sed` falló
  en silencio por los finales de línea CRLF de Windows.
- **Qué se corrigió:** `tsc` lo detectó antes del commit; se usó una constante con otro nombre. Para CRLF se
  agregó `.gitattributes` con `eol=lf`.
- **Qué parte del harness lo habría evitado:** `npx tsc --noEmit` como puerta obligatoria (ya en `AGENTS.md`
  y en `/commit`) y el hook de Prettier, que deja los archivos con LF.

## Lo que la IA no decidió

Las decisiones de negocio son del cliente (D1 a D13). Los puntos abiertos (PA-1 a PA-8) quedaron como decisiones
provisionales para consultar. Las decisiones visuales de `DESIGN.md` son de la autora: el agente propuso el
brand board a partir del brief y la autora lo revisa antes de la demo.
