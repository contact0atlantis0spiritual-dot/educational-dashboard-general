// arabic/year7/module1/draw.js — canvas drawing helper, scoped to the module.
// Imported only by lesson1.html. Kept in module folder (not /assets) on purpose:
// it's specific to this module's UX and should ship with it.
/**
 * Attach pointer drawing to a canvas. Handles HiDPI + resize + pointer capture.
 * @param {HTMLCanvasElement} canvas
 * @param {{ color?: string, width?: number }} [opts]
 * @returns {() => void}  teardown function
 */
export function attachCanvas(canvas, opts = {}) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  const color = opts.color
    || getComputedStyle(document.documentElement)
         .getPropertyValue('--fg').trim()
    || '#1b1f24';
  const width = opts.width || 2.5;
  ctx.lineCap  = 'round';
  ctx.lineJoin = 'round';
  let drawing = false;
  let last = null;
  function resize() {
    const dpr  = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    // snapshot current drawing so resize doesn't erase it
    const prev = document.createElement('canvas');
    prev.width  = canvas.width;
    prev.height = canvas.height;
    if (prev.width && prev.height) {
      prev.getContext('2d').drawImage(canvas, 0, 0);
    }
    canvas.width  = Math.max(1, Math.round(rect.width  * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    if (prev.width && prev.height) {
      ctx.drawImage(prev, 0, 0, prev.width / dpr, prev.height / dpr);
    }
  }
  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function down(e) {
    drawing = true;
    const p = pos(e);
    last = p;
    ctx.strokeStyle = color;
    ctx.fillStyle   = color;
    ctx.lineWidth   = width;
    // dot at the tap point
    ctx.beginPath();
    ctx.arc(p.x, p.y, width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    try { canvas.setPointerCapture(e.pointerId); } catch {}
  }
  function move(e) {
    if (!drawing) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last ? last.x : p.x, last ? last.y : p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last = p;
  }
  function up(e) {
    if (!drawing) return;
    drawing = false;
    last = null;
    if (e && e.pointerId != null) {
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
    }
  }
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', up);
  // Initial size + follow layout changes
  resize();
  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);
  return function destroy() {
    ro.disconnect();
    canvas.removeEventListener('pointerdown', down);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointercancel', up);
    canvas.removeEventListener('pointerleave', up);
  };
}
/** Clear the canvas completely (resets transform too). */
export function clearCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}