// js/related-editor.js  (admin pages only)
// Shared editor for a major's "related courses & minors" list. A form uses it by
// containing  <div data-rc-list></div>  and a  <button data-rc-add>.
// Needs normaliseQrLink() from js/qr.js.

/** Add one editable course row (name + optional link) to a major's form. */
function addRelatedRow(form, name = '', url = '', focus = false) {
  const row = document.createElement('div');
  row.className = 'rc-row';

  const nameInput = document.createElement('input');
  nameInput.className = 'form-control rc-name';
  nameInput.placeholder = 'Course or minor name';
  nameInput.maxLength = 100;
  nameInput.setAttribute('aria-label', 'Related course name');
  nameInput.value = name;

  const urlInput = document.createElement('input');
  urlInput.className = 'form-control rc-url';
  urlInput.placeholder = 'https://... (optional link)';
  urlInput.setAttribute('aria-label', 'Related course link');
  urlInput.value = url || '';

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'btn btn--secondary btn-sm';
  remove.textContent = 'Remove';
  remove.addEventListener('click', () => row.remove());

  row.append(nameInput, urlInput, remove);
  form.querySelector('[data-rc-list]').appendChild(row);
  if (focus) nameInput.focus();
}

/** Read the course rows from a major's form. Returns { courses } or { error }. */
function readRelatedRows(form) {
  const courses = [];
  for (const row of form.querySelectorAll('.rc-row')) {
    const name = row.querySelector('.rc-name').value.trim();
    const rawUrl = row.querySelector('.rc-url').value;
    if (!name && !rawUrl.trim()) continue;                 // blank row: ignore
    if (!name) return { error: 'Each related course needs a name.' };
    const url = normaliseQrLink(rawUrl);
    if (url === null) return { error: `The link for "${name}" is not a valid web address.` };
    row.querySelector('.rc-url').value = url;
    courses.push({ name, url });
  }
  if (courses.length > 12) return { error: 'Please list no more than 12 related courses.' };
  return { courses };
}
