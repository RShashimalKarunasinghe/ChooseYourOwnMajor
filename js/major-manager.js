const majorForm = document.getElementById('majorForm');
const majorList = document.getElementById('majorList');
const formMessage = document.getElementById('formMessage');

majorForm.querySelector('[data-rc-add]').addEventListener('click', () => addRelatedRow(majorForm, '', '', true));

async function loadMajors() {
  majorList.innerHTML = '<p>Loading majors...</p>';
  try {
    await loadMajorInfoFromServer();
    majorList.innerHTML = majorKeys.map((code) => {
      const major = majorInfo[code];
      return `<div class="question-admin-card d-flex justify-content-between align-items-start gap-3 mb-3">
        <div><p class="section-label">${escapeHtml(major.code)}</p><h3>${escapeHtml(major.title)}</h3><p class="mb-0 text-secondary-emphasis">${escapeHtml(major.personalityTag)}</p></div>
        <button class="btn btn--secondary btn-sm" data-remove-major="${escapeHtml(code)}" ${majorKeys.length <= 2 ? 'disabled' : ''}>Remove</button>
      </div>`;
    }).join('');
    document.querySelectorAll('[data-remove-major]').forEach((button) => button.addEventListener('click', () => removeMajor(button.dataset.removeMajor)));
  } catch (error) {
    majorList.innerHTML = `<p class="text-danger">${escapeHtml(error.message)}</p>`;
  }
}

majorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formMessage.textContent = 'Saving...';
  try {
    const newMajor = {
      code: document.getElementById('majorCode').value.trim().toLowerCase(),
      title: document.getElementById('majorTitle').value.trim(),
      personalityTag: document.getElementById('personalityTag').value.trim(),
      careers: document.getElementById('careers').value.trim(),
      resultReason: document.getElementById('resultReason').value.trim(),
      exploreText: document.getElementById('exploreText').value.trim(),
      qrLink: normaliseQrLink(document.getElementById('qrLink').value)
    };
    if (newMajor.qrLink === null) {
      formMessage.textContent = 'Please enter a valid web link for the QR code, or leave it empty.';
      return;
    }
    const related = readRelatedRows(majorForm);
    if (related.error) {
      formMessage.textContent = related.error;
      return;
    }
    newMajor.relatedCourses = related.courses;
    await createMajor(newMajor);
    majorForm.reset();
    majorForm.querySelector('[data-rc-list]').innerHTML = '';
    formMessage.textContent = 'Major added successfully.';
    loadMajors();
    autoTranslateTexts(collectMajorTexts(newMajor));
  } catch (error) {
    formMessage.textContent = `Save failed: ${error.message}`;
  }
});

async function removeMajor(code) {
  if (!confirm(`Remove ${majorInfo[code].title}? Existing question scores for it will no longer be used.`)) return;
  try {
    await deleteMajor(code);
    await loadMajors();
  } catch (error) {
    alert(`Remove failed: ${error.message}`);
  }
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

loadMajors();
