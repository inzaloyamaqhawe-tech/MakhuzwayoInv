const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}
menu.hidden = false;
nav.classList.add('menu-ready');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
matchMedia('(max-width: 1240px)').addEventListener('change', closeMenu);

for (const form of document.querySelectorAll('[data-preview-form]')) {
  form.addEventListener('submit', (event) => event.preventDefault());
  const steps = [...form.querySelectorAll('[data-step]')];
  const progress = [...form.querySelectorAll('[data-progress]')];
  const error = form.querySelector('[data-form-error]');
  const status = form.querySelector('[data-form-status]');
  const organisationType = form.querySelector('[data-org-select]');
  const organisation = form.querySelector('[data-organisational]');
  const password = form.elements.password;
  const confirmation = form.elements.confirmPassword;
  const roleInfo = form.querySelector('[data-role-info]');
  let index = 0;

  function syncOrganisation() {
    const visible = Boolean(organisationType.value && organisationType.value !== 'individual');
    organisation.hidden = !visible;
    form.elements.organisation.disabled = !visible;
    form.elements.organisation.required = visible && organisationType.hasAttribute('data-org-required');
    const label = organisation.querySelector('label span');
    label.hidden = form.elements.organisation.required;
  }
  if (organisationType) syncOrganisation();

  const category = form.querySelector('[data-category-select]');
  if (category) {
    const preselected = new URLSearchParams(location.search).get('category');
    if ([...category.options].some(({ value }) => value && value === preselected)) category.value = preselected;
  }

  form.querySelector('[data-password]')?.addEventListener('click', (event) => {
    const shown = password.type === 'password';
    password.type = shown ? 'text' : 'password';
    event.currentTarget.textContent = shown ? 'Hide password' : 'Show password';
    event.currentTarget.setAttribute('aria-pressed', String(shown));
  });

  function syncRole() {
    const role = form.elements.intendedRole.value;
    roleInfo.textContent = {
      innovator: 'For managing your future idea submissions, review updates and project communications.',
      investor: 'For exploring approved project opportunities and managing future expressions of interest.',
    }[role] || 'Choose the account type you intend to use.';
  }
  if (roleInfo) syncRole();

  function clearFeedback() {
    error.hidden = true;
    status.textContent = '';
  }

  function validate(scope) {
    clearFeedback();
    if (confirmation) confirmation.setCustomValidity(confirmation.value === password.value ? '' : 'Enter the same sample password in both fields.');
    for (const control of scope.querySelectorAll('input, select, textarea')) {
      if (!control.willValidate) continue;
      if (control.required && ['text', 'tel', 'textarea'].includes(control.type) && control.value && !control.value.trim()) {
        control.setCustomValidity('Enter a value with more than spaces.');
      }
      if (control.type === 'tel' && control.value.trim() && !/^[+\d][\d() .-]{5,31}$/.test(control.value.trim())) {
        control.setCustomValidity('Enter a phone number using digits and standard phone punctuation.');
      }
      const invalid = !control.validity.valid;
      if (invalid) {
        const label = control.labels?.[0]?.textContent.trim() || 'This field';
        error.textContent = label.replace(/\s+/g, ' ') + '. ' + control.validationMessage;
        error.hidden = false;
        control.setAttribute('aria-invalid', 'true');
        control.setAttribute('aria-errormessage', error.id);
        control.focus();
        return false;
      }
    }
    return true;
  }

  function renderReview() {
    const summary = form.querySelector('[data-review]');
    const entries = new Map();
    for (const control of form.querySelectorAll('[data-step]:not(:last-of-type) input, [data-step]:not(:last-of-type) select, [data-step]:not(:last-of-type) textarea')) {
      if (control.disabled || !control.value.trim() || (control.type === 'checkbox' && !control.checked)) continue;
      const label = control.type === 'checkbox' ? 'Requested assistance' : control.labels[0].textContent.trim().replace(/\s+\(optional\)$/, '');
      const value = control.type === 'checkbox' ? control.labels[0].textContent.trim() : control.selectedOptions?.[0]?.text || control.value.trim();
      entries.set(label, [...(entries.get(label) || []), value]);
    }
    summary.replaceChildren(...[...entries].flatMap(([title, values]) => {
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = title;
      description.textContent = values.join(', ');
      return [term, description];
    }));
  }

  function showStep(next) {
    clearFeedback();
    index = next;
    const last = index === steps.length - 1;
    steps.forEach((panel, position) => { panel.hidden = position !== index; });
    progress.forEach((item, position) => {
      if (position === index) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    form.querySelector('[data-back]').hidden = index === 0;
    form.querySelector('[data-next]').hidden = last;
    form.querySelector('[data-validate]').hidden = !last;
    form.querySelector('[data-submit-preview]').hidden = !last;
    if (last) renderReview();
    const heading = steps[index].querySelector('h2');
    heading.focus();
    heading.scrollIntoView({ block: 'nearest' });
  }
  form.querySelector('[data-next]')?.addEventListener('click', () => {
    if (validate(steps[index])) showStep(index + 1);
  });
  form.querySelector('[data-back]')?.addEventListener('click', () => showStep(index - 1));
  form.querySelector('[data-validate]').addEventListener('click', () => {
    if (validate(steps[index] || form)) status.textContent = 'Sample details passed validation. Nothing was sent.';
  });
  error.id = 'sample-form-error';
  form.addEventListener('input', (event) => {
    form.querySelectorAll('[aria-invalid]').forEach((control) => {
      control.removeAttribute('aria-invalid');
      control.removeAttribute('aria-errormessage');
    });
    event.target.setCustomValidity?.('');
    clearFeedback();
    if (event.target === organisationType) syncOrganisation();
    if (event.target.name === 'intendedRole') syncRole();
  });
  form.hidden = false;
  // Discard sensitive sample values when leaving, including back/forward cache.
  window.addEventListener('pagehide', () => {
    form.reset();
    clearFeedback();
    if (organisationType) syncOrganisation();
    if (roleInfo) syncRole();
    if (password) {
      password.type = 'password';
      const toggle = form.querySelector('[data-password]');
      toggle.textContent = 'Show password';
      toggle.setAttribute('aria-pressed', 'false');
    }
    form.querySelector('[data-review]')?.replaceChildren();
  });
}
