// The Lutterodt Renaissance — shared front-end interactions (prototype)
document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links){
    toggle.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.cssText += open ? '' : 'position:absolute; top:100%; left:0; right:0; background:var(--ivory); flex-direction:column; padding:24px 32px; border-bottom:1px solid var(--line); gap:20px;';
    });
  }

  // Reveal-on-scroll (subtle, orchestrated once per element)
  const revealables = document.querySelectorAll('.card, .tl-item, .gitem, .value-item, .stat-cell');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.style.transition = 'opacity .6s ease, transform .6s ease';
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealables.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    io.observe(el);
  });

  // Timeline category filters
  const chips = document.querySelectorAll('.filter-chip');
  const tlItems = document.querySelectorAll('.tl-item');
  if (chips.length && tlItems.length){
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.filter;
        tlItems.forEach(item => {
          const match = cat === 'all' || item.dataset.category === cat;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // Timeline search
  const searchInput = document.querySelector('.search-mini input');
  if (searchInput && tlItems.length){
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      tlItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // Gallery filters
  const gchips = document.querySelectorAll('.gfilter-chip');
  const gitems = document.querySelectorAll('.gitem');
  if (gchips.length && gitems.length){
    gchips.forEach(chip => {
      chip.addEventListener('click', () => {
        gchips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.filter;
        gitems.forEach(item => {
          const match = cat === 'all' || item.dataset.category === cat;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // Contact form tabs
  const ftabs = document.querySelectorAll('.form-tab');
  const fpanels = document.querySelectorAll('.form-panel');
  if (ftabs.length){
    ftabs.forEach(tab => {
      tab.addEventListener('click', () => {
        ftabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        fpanels.forEach(p => p.style.display = p.dataset.panel === tab.dataset.tab ? '' : 'none');
      });
    });
  }

  // Prevent actual submission in this prototype; show a confirmation state
  document.querySelectorAll('form[data-prototype]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn){
        const original = btn.textContent;
        btn.textContent = 'Received — Thank You';
        setTimeout(() => { btn.textContent = original; form.reset(); }, 2600);
      }
    });
  });
});
