const loginPanel = document.getElementById('loginPanel');
const dashboardPanel = document.getElementById('dashboardPanel');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const majorForm = document.getElementById('majorForm');
const majorList = document.getElementById('majorList');
const formMessage = document.getElementById('formMessage');

function showManager() {
  loginPanel.classList.add('hidden');
  dashboardPanel.classList.remove('hidden');
  loadMajors();
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (document.getElementById('username').value.trim() === 'admin' && document.getElementById('password').value.trim() === 'admin123') {
    sessionStorage.setItem('majorAdminLoggedIn', 'true');
    showManager();
  } else {
    loginMessage.textContent = 'Incorrect username or password.';
  }
});

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
    await createMajor({
      code: document.getElementById('majorCode').value.trim().toLowerCase(),
      title: document.getElementById('majorTitle').value.trim(),
      personalityTag: document.getElementById('personalityTag').value.trim(),
      careers: document.getElementById('careers').value.trim(),
      resultReason: document.getElementById('resultReason').value.trim(),
      exploreText: document.getElementById('exploreText').value.trim()
    });
    majorForm.reset();
    formMessage.textContent = 'Major added successfully.';
    loadMajors();
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

if (sessionStorage.getItem('majorAdminLoggedIn') === 'true') showManager();
