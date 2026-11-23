// philo/term1/writing.js — text autosave helper, scoped to the module.
// Different shape from arabic's draw.js on purpose: it shows the pattern
// generalizes — module-specific JS can be anything the module needs.
/**
 * Autosave textarea content after a short idle period.
 * @param {HTMLTextAreaElement} textarea
 * @param {{
 *   delay?: number,
 *   onSave: (value: string) => Promise<void>,
 *   onState?: (state: 'idle'|'saving'|'saved') => void
 * }} opts
 * @returns {() => void}  teardown
 */
export function attachAutosave(textarea, { delay = 600, onSave, onState } = {}) {
  if (!textarea || typeof onSave !== 'function') return () => {};
  let timer = null;
  let lastSaved = textarea.value;
  let saving = false;
  let pending = false;
  function setState(s) { if (onState) onState(s); }
  async function flush() {
    if (saving) { pending = true; return; }
    const value = textarea.value;
    if (value === lastSaved) { setState('idle'); return; }
    saving = true;
    setState('saving');
    try {
      await onSave(value);
      lastSaved = value;
      setState('saved');
    } catch (err) {
      console.error('[autosave]', err);
      setState('idle');
    } finally {
      saving = false;
      if (pending) { pending = false; await flush(); }
    }
  }
  function scheduleSave() {
    clearTimeout(timer);
    timer = setTimeout(flush, delay);
  }
  textarea.addEventListener('input', scheduleSave);
  // Save on navigate away (visibility change catches mobile tab switch too)
  function flushOnHide() {
    if (document.visibilityState === 'hidden') flush();
  }
  document.addEventListener('visibilitychange', flushOnHide);
  return function destroy() {
    clearTimeout(timer);
    textarea.removeEventListener('input', scheduleSave);
    document.removeEventListener('visibilitychange', flushOnHide);
  };
}