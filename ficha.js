(() => {
  const specialties = [
    {
      name: 'Sistemas Informáticos',
      focus: 'Desarrollo web, mantenimiento de hardware y redes, bases de datos y programación.',
      years: '4to, 5to y 6to',
      credential: 'Técnico Medio',
    },
    {
      name: 'Contabilidad General',
      focus: 'Procesos contables, registros auxiliares, normativa tributaria y herramientas financieras.',
      years: '4to, 5to y 6to',
      credential: 'Técnico Medio',
    },
    {
      name: 'Electrónica & Robótica',
      focus: 'Circuitos analógicos y digitales, microcontroladores, sensores y automatización.',
      years: '4to, 5to y 6to',
      credential: 'Técnico Medio',
    },
    {
      name: 'Gastronomía & Alimentación',
      focus: 'Técnicas culinarias, inocuidad alimentaria, nutrición, panadería y repostería.',
      years: '4to, 5to y 6to',
      credential: 'Técnico Medio',
    },
  ];

  let modal;
  let searchInput;
  let gradeFilter;
  let tableBody;
  let resultCount;
  let previousFocus;

  function createCell(text, className) {
    const cell = document.createElement('td');
    cell.className = className;
    cell.textContent = text;
    return cell;
  }

  function renderSpecialties() {
    if (!tableBody || !searchInput || !gradeFilter || !resultCount) return;
    const query = searchInput.value.trim().toLocaleLowerCase('es');
    const grade = gradeFilter.value;
    const visible = specialties.filter(item => {
      const matchesQuery = `${item.name} ${item.focus} ${item.credential}`.toLocaleLowerCase('es').includes(query);
      const matchesGrade = grade === 'all' || item.years.includes(grade);
      return matchesQuery && matchesGrade;
    });

    tableBody.replaceChildren();
    visible.forEach(item => {
      const row = document.createElement('tr');
      row.className = 'border-t border-slate-200 dark:border-slate-700';
      row.append(
        createCell(item.name, 'px-4 py-3 font-bold text-slate-800 dark:text-slate-100'),
        createCell(item.focus, 'px-4 py-3 leading-relaxed text-slate-600 dark:text-slate-300'),
        createCell(item.years, 'whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300'),
        createCell(item.credential, 'whitespace-nowrap px-4 py-3 font-semibold text-emerald-700 dark:text-emerald-300'),
      );
      tableBody.append(row);
    });
    resultCount.textContent = `${visible.length} ${visible.length === 1 ? 'especialidad' : 'especialidades'}`;
    const emptyState = modal.querySelector('#technicalOfferEmpty');
    if (emptyState) emptyState.hidden = visible.length > 0;
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  }

  function ensureModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.id = 'technicalOfferModal';
    modal.className = 'fixed inset-0 z-[80] hidden items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'technicalOfferTitle');
    modal.innerHTML = `
      <section class="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <header class="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-navy-900 to-indigo-900 px-5 py-5 text-white sm:px-7">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[.2em] text-amber-300">Bachillerato Técnico Humanístico</p>
            <h2 class="mt-1 text-lg font-bold sm:text-xl" id="technicalOfferTitle">Oferta técnica · Gestión 2026</h2>
            <p class="mt-1 text-xs text-slate-300">Explora y filtra las especialidades disponibles en la plataforma.</p>
          </div>
          <button class="rounded-xl p-2 text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300" id="technicalOfferClose" type="button" aria-label="Cerrar oferta técnica">
            <i class="h-5 w-5" data-lucide="x"></i>
          </button>
        </header>
        <div class="space-y-4 p-4 sm:p-6">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-end">
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              Buscar especialidad
              <input class="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" id="technicalOfferSearch" type="search" placeholder="Ej. robótica, contabilidad..." autocomplete="off">
            </label>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              Curso
              <select class="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white" id="technicalOfferGrade">
                <option value="all">Todos los cursos</option>
                <option value="4to">4to de secundaria</option>
                <option value="5to">5to de secundaria</option>
                <option value="6to">6to de secundaria</option>
              </select>
            </label>
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 sm:pb-2" id="technicalOfferCount" aria-live="polite"></p>
          </div>
          <div class="max-h-[55vh] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table class="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead class="sticky top-0 bg-slate-100 text-[10px] uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr><th class="px-4 py-3">Especialidad</th><th class="px-4 py-3">Enfoque formativo</th><th class="px-4 py-3">Cursos</th><th class="px-4 py-3">Certificación</th></tr>
              </thead>
              <tbody id="technicalOfferRows"></tbody>
            </table>
            <p class="hidden px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400" id="technicalOfferEmpty">No hay especialidades que coincidan con esos filtros.</p>
          </div>
          <div class="flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:items-center">
            <p class="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">Confirma cupos, requisitos y horarios vigentes con la institución.</p>
            <a class="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-800 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:bg-amber-500 dark:text-navy-950 dark:hover:bg-amber-400" href="academico.html#academico">Ver sección académica <i class="h-4 w-4" data-lucide="arrow-up-right"></i></a>
          </div>
        </div>
      </section>`;
    document.body.append(modal);

    searchInput = modal.querySelector('#technicalOfferSearch');
    gradeFilter = modal.querySelector('#technicalOfferGrade');
    tableBody = modal.querySelector('#technicalOfferRows');
    resultCount = modal.querySelector('#technicalOfferCount');
    searchInput.addEventListener('input', renderSpecialties);
    gradeFilter.addEventListener('change', renderSpecialties);
    modal.querySelector('#technicalOfferClose').addEventListener('click', closeModal);
    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal();
    });
    if (window.lucide) window.lucide.createIcons();
    renderSpecialties();
  }

  window.openTechnicalOffer = function () {
    ensureModal();
    previousFocus = document.activeElement;
    modal.hidden = false;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    searchInput.value = '';
    gradeFilter.value = 'all';
    renderSpecialties();
    searchInput.focus({ preventScroll: true });
  };

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
      event.preventDefault();
      closeModal();
    }
  });
})();
