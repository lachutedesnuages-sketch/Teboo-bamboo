// Loads the JSON content file for this language and fills every
// [data-bind] text field and [data-bind-img] image on the page.
// This is what lets the CMS dashboard change the site without touching code.

function tebouGet(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!window.CONTENT_URL) return;

  fetch(window.CONTENT_URL + '?v=' + Date.now())
    .then((r) => r.json())
    .then((data) => {
      document.querySelectorAll('[data-bind]').forEach((el) => {
        const val = tebouGet(data, el.getAttribute('data-bind'));
        if (val !== undefined && val !== '') el.textContent = val;
      });

      document.querySelectorAll('[data-bind-img]').forEach((img) => {
        const path = tebouGet(data, img.getAttribute('data-bind-img'));
        if (!path) return; // keep the placeholder as-is until a real photo is set
        img.src = path;
        const slot = img.closest('.photo-slot');
        if (slot) slot.classList.add('has-photo');
      });
    })
    .catch((err) => console.warn('Tebou: could not load content.json', err));
});
