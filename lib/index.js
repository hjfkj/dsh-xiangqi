/** dsh-xiangqi — host side.
 *
 * The game is a self-contained HTML document rendered by the client half
 * (`./client`), so the host has nothing to serve or configure. This entry only
 * exists because every DSH plugin package is imported by the host loader; it
 * registers no services and touches no state.
 */
export const name = 'dsh-xiangqi';

/** Cordis plugin entry. Intentionally inert. */
export function apply() {
  /* no host-side behaviour */
}
