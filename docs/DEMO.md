# Guion de la demo (5 minutos) — 26 de noviembre de 2026

Antes de entrar: Expo Go abierto con la cuenta A (obras vistas en el año actual y en uno anterior), VS Code con
una terminal en la rama `epica-mi-anio`, el brand board abierto en el navegador y `npm test` corrido una vez.

| Min       | Paso                                       | Qué mostrar y decir                                                                                                                                                                                                                                                                                                  |
| :-------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00–0:45 | **1. Brand board**                         | `docs/diseno/brand-board.html`, sección Color → Contraste. «Partí de mi referencia de estilo de afiche de concierto: todo en negro, blanco y grises, y el único color lo ponen los pósters. Por eso los estados se distinguen con ícono y tono de gris, y descarté `piedra` para texto: da 3,95:1 y no llega a 4,5». |
| 0:45–1:30 | **2. `git log`**                           | `git log --oneline --reverse p3-final..epica-mi-anio \| head -20` (son más de 50 commits; así cabe en pantalla). Señalar: `docs: PRD` → `docs: backlog` → `docs: spec 01` → `test: tests del dominio en rojo` → `feat: dominio`. «La spec y los tests van antes que el código».                                      |
| 1:30–2:30 | **3. Marcar como vista**                   | En Mi lista, abrir una obra en por ver → Vista → 5 estrellas → Guardar. Ir a Mi año: sube el total, cambian las horas y la barra del mes, y la obra puede pasar a ser la destacada.                                                                                                                                  |
| 2:30–3:00 | **4. Año vacío**                           | Elegir 2025 en el selector: solo hay una serie, así que el director dice «Sin datos» (D9). Un año vacío no aparece en el selector (D4), así que para D12 mostrar `docs/capturas/14-mi-anio-vacio.png` o entrar con la cuenta B: «No viste nada en 2026.» → Ir a Mi lista.                                            |
| 3:00–4:00 | **5. Romper una regla**                    | En `src/screens/MiAnioScreen.tsx` cambiar `colores.fondo` por `'#000000'` y correr `npm test`: el sensor lista `src/screens/MiAnioScreen.tsx:línea #000000`. Deshacer. Opcional: en `resumenAnual.ts` cambiar `lastIndexOf` por `indexOf` y ver fallar «empate: gana el mes más reciente».                           |
| 4:00–5:00 | **6. Una decisión de punta a punta (D10)** | PRD §6 fila D10 → backlog CA-18 → `resumenAnual.test.ts` «mes más activo (D10)» → `resumenAnual.ts` `mesMasActivo` (`lastIndexOf` = el más reciente) → la barra negra (las demás en carbón) en la pantalla.                                                                                                          |

Plan B si falla la red: mostrar el resumen en modo avión (D13) y explicar el aviso; los pasos 2, 5 y 6 no
necesitan internet.

## Ensayo cronometrado (2026-11-25, emulador Android)

Se recorrió el guion completo en el emulador y en la terminal, midiendo con el reloj de la PC el tiempo real de cada
acción (desde la primera orden hasta que la pantalla o la terminal muestra el resultado). Lo que queda de cada tramo
es el tiempo para hablar.

| Paso                    | Tramo | Acción medida                                                                                            | Tiempo de la acción | Queda para hablar | Resultado                                                                                                                    |
| :---------------------- | :---- | :------------------------------------------------------------------------------------------------------- | ------------------: | ----------------: | :--------------------------------------------------------------------------------------------------------------------------- |
| 1. Brand board          | 45 s  | Abrir `brand-board.html` y llegar a «Contraste de texto»                                                 |               0,1 s |            ~ 44 s | Correcto: la fila de `piedra` dice 3,95:1                                                                                    |
| 2. `git log`            | 45 s  | `git log --oneline --reverse p3-final..epica-mi-anio \| head -20`                                        |               0,1 s |            ~ 44 s | Correcto: `docs: PRD` → `docs: backlog` → `docs: spec 01` → `test: … en rojo (T-01)` → `feat: dominio …`                     |
| 3. Marcar como vista    | 60 s  | Mi lista → La Llegada → Vista → 5 ★ → Guardar → Mi año                                                   |              23,5 s |            ~ 36 s | Correcto: de 4 a 5 obras, de 8,4 a 10,3 h, Villeneuve 3 películas y la destacada pasa a La Llegada (D11)                     |
| 4. Otro año             | 30 s  | Tocar 2025 hasta ver «Sin datos» en director                                                             |               4,7 s |            ~ 25 s | Correcto. Un año vacío no sale en el selector (D4): para D12 se muestra la captura 14                                        |
| 5. Romper una regla     | 60 s  | Poner `'#000000'` en `MiAnioScreen.tsx:146`, `npm test`, deshacer                                        |               1,5 s |            ~ 58 s | Correcto: el sensor lista `src\screens\MiAnioScreen.tsx:146 #000000`. Opcional `indexOf` en el desempate: otros 1,5 s, falla |
| 6. D10 de punta a punta | 60 s  | Abrir PRD §6 (D10), backlog CA-18, el test del desempate y `resumenAnual.ts:95`; volver a 2026 en Mi año |               4,9 s |            ~ 55 s | Correcto: las cuatro paradas existen y la barra de noviembre sale en negro                                                   |
| **Total**               | 5 min |                                                                                                          |          **≈ 35 s** |  **≈ 4 min 25 s** |                                                                                                                              |

Notas:

- Los tiempos de la app incluyen la espera hasta que cada pantalla aparece; a mano, tocando, el paso 3 puede tardar
  unos segundos más. Editar la línea 146 a mano en VS Code también suma unos 10 s al paso 5.
- Después del ensayo La Llegada se dejó otra vez en «por ver», para repetir el paso 3 en clase.
- Datos de la cuenta A: 7 obras (La Llegada por ver, Severance viendo, 5 vistas; The Last of Us vista en 2025).
