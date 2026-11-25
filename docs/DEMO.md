# Guion de la demo (5 minutos) — 26 de noviembre de 2026

Antes de entrar: Expo Go abierto con la cuenta A (obras vistas en el año actual y en uno anterior), VS Code con
una terminal en la rama `epica-mi-anio`, el brand board abierto en el navegador y `npm test` corrido una vez.

| Min       | Paso                                       | Qué mostrar y decir                                                                                                                                                                                                                                                                                                  |
| :-------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00–0:45 | **1. Brand board**                         | `docs/diseno/brand-board.html`, sección Color → Contraste. «Partí de mi referencia de estilo de afiche de concierto: todo en negro, blanco y grises, y el único color lo ponen los pósters. Por eso los estados se distinguen con ícono y tono de gris, y descarté `piedra` para texto: da 3,95:1 y no llega a 4,5». |
| 0:45–1:30 | **2. `git log`**                           | `git log --oneline --reverse p3-final..epica-mi-anio \| head -20` (son más de 50 commits; así cabe en pantalla). Señalar: `docs: PRD` → `docs: backlog` → `docs: spec 01` → `test: tests del dominio en rojo` → `feat: dominio`. «La spec y los tests van antes que el código».                                             |
| 1:30–2:30 | **3. Marcar como vista**                   | En Mi lista, abrir una obra en por ver → Vista → 5 estrellas → Guardar. Ir a Mi año: sube el total, cambian las horas y la barra del mes, y la obra puede pasar a ser la destacada.                                                                                                                                  |
| 2:30–3:00 | **4. Año vacío**                           | Elegir 2025 en el selector: solo hay una serie, así que el director dice «Sin datos» (D9). Un año vacío no aparece en el selector (D4), así que para D12 mostrar `docs/capturas/14-mi-anio-vacio.png` o entrar con la cuenta B: «No viste nada en 2026.» → Ir a Mi lista.                                            |
| 3:00–4:00 | **5. Romper una regla**                    | En `src/screens/MiAnioScreen.tsx` cambiar `colores.fondo` por `'#000000'` y correr `npm test`: el sensor lista `src/screens/MiAnioScreen.tsx:línea #000000`. Deshacer. Opcional: en `resumenAnual.ts` cambiar `lastIndexOf` por `indexOf` y ver fallar «empate: gana el mes más reciente».                           |
| 4:00–5:00 | **6. Una decisión de punta a punta (D10)** | PRD §6 fila D10 → backlog CA-18 → `resumenAnual.test.ts` «mes más activo (D10)» → `resumenAnual.ts` `mesMasActivo` (`lastIndexOf` = el más reciente) → la barra negra (las demás en carbón) en la pantalla.                                                                                                          |

Plan B si falla la red: mostrar el resumen en modo avión (D13) y explicar el aviso; los pasos 2, 5 y 6 no
necesitan internet.

## Ensayo técnico (2026-11-25, emulador Android)

El agente recorrió el guion en el emulador y la terminal para comprobar que cada paso funciona. El tiempo hablado lo
tiene que ensayar la autora.

| Paso | Resultado                                                                                                                                                                                                                       |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | ✅ La tabla «Contraste de texto» del brand board trae `piedra` con 3,95:1                                                                                                                                                       |
| 2    | ✅ En orden aparecen `docs: PRD` → `docs: backlog` → `docs: spec 01` → `test: tests del dominio … en rojo (T-01)` → `feat: dominio …`. Con más de 50 commits hace falta `--reverse \| head -20`                                        |
| 3    | ✅ La Llegada (por ver) → Vista 5 ★: Mi año pasa de 4 a 5 obras y de 8,4 a 10,3 h, Villeneuve a 3 películas, y la destacada cambia a La Llegada (empate de 5 ★, gana la más reciente: D11). Después se dejó otra vez en por ver |
| 4    | ⚠️ El año más antiguo (2025) no está vacío: tiene una serie. El guion se corrigió arriba                                                                                                                                        |
| 5    | ✅ Con `'#000000'` en la línea 146, `npm test` falla en 1 s y lista `src\screens\MiAnioScreen.tsx:146 #000000` (en Windows sale con `\`). Con `indexOf` falla «empate: gana el mes más reciente». Deshecho: 68 en verde         |
| 6    | ✅ Existen las cuatro paradas: PRD §6 fila D10, backlog CA-18, test «empate: gana el mes más reciente» y `resumenAnual.ts:95` (`lastIndexOf`)                                                                                   |

Datos de la cuenta A para la demo: 7 obras (La Llegada en por ver para el paso 3, Severance viendo, 5 vistas;
The Last of Us vista en 2025).
