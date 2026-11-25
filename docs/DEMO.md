# Guion de la demo (5 minutos) — 26 de noviembre de 2026

Antes de entrar: Expo Go abierto con la cuenta A (obras vistas en el año actual y en uno anterior), VS Code con
una terminal en la rama `epica-mi-anio`, el brand board abierto en el navegador y `npm test` corrido una vez.

| Min       | Paso                                       | Qué mostrar y decir                                                                                                                                                                                                                                                                        |
| :-------- | :----------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00–0:45 | **1. Brand board**                         | `docs/diseno/brand-board.html`, sección Color → Contraste. «Elegí `dato` (#ffd166) solo para las cifras del resumen: es el más brillante después del ámbar y da 11,1:1 sobre la tarjeta, así que los números se leen de un vistazo con poca luz».                                          |
| 0:45–1:30 | **2. `git log`**                           | `git log --oneline p3-final..epica-mi-anio`. Señalar: `docs: PRD` → `docs: backlog` → `docs: spec 01` → `test: tests del dominio en rojo` → `feat: dominio`. «La spec y los tests van antes que el código».                                                                                |
| 1:30–2:30 | **3. Marcar como vista**                   | En Mi lista, abrir una obra en por ver → Vista → 5 estrellas → Guardar. Ir a Mi año: sube el total, cambian las horas y la barra del mes, y la obra puede pasar a ser la destacada.                                                                                                        |
| 2:30–3:00 | **4. Año vacío**                           | En el selector elegir el año más antiguo y luego tocar Ir a Mi lista (o mostrar con la cuenta B: «No viste nada en…»).                                                                                                                                                                     |
| 3:00–4:00 | **5. Romper una regla**                    | En `src/screens/MiAnioScreen.tsx` cambiar `colores.fondo` por `'#000000'` y correr `npm test`: el sensor lista `src/screens/MiAnioScreen.tsx:línea #000000`. Deshacer. Opcional: en `resumenAnual.ts` cambiar `lastIndexOf` por `indexOf` y ver fallar «empate: gana el mes más reciente». |
| 4:00–5:00 | **6. Una decisión de punta a punta (D10)** | PRD §6 fila D10 → backlog CA-18 → `resumenAnual.test.ts` «mes más activo (D10)» → `resumenAnual.ts` `mesMasActivo` (`lastIndexOf` = el más reciente) → la barra ámbar en la pantalla.                                                                                                      |

Plan B si falla la red: mostrar el resumen en modo avión (D13) y explicar el aviso; los pasos 2, 5 y 6 no
necesitan internet.
