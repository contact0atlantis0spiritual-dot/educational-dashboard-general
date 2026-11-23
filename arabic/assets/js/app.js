// arabic/assets/js/app.js — app entry helpers.
// Storage goes only through shared/store.js. Never touch localStorage directly.
import { appData } from '/shared/store.js';
const APP = 'arabic';
/** Increment and return the per-device visit counter for this app. */
export async function trackVisit() {
  const n = ((await appData.get(APP, 'visits', 0)) || 0) + 1;
  await appData.set(APP, 'visits', n);
  return n;
}
/** Read progress object for a module (e.g. 'year7/module1'). */
export async function getProgress(moduleId) {
  return (await appData.get(APP, `progress:${moduleId}`, {})) || {};
}
/** Merge a patch into the module's progress object and persist. */
export async function setProgress(moduleId, patch) {
  const cur  = await getProgress(moduleId);
  const next = { ...cur, ...patch };
  await appData.set(APP, `progress:${moduleId}`, next);
  return next;
}
/** Mark a lesson complete for a module. */
export async function markLesson(moduleId, lessonId, done = true) {
  const cur = await getProgress(moduleId);
  const lessons = { ...(cur.lessons || {}), [lessonId]: !!done };
  return setProgress(moduleId, { lessons });
}