/**
 * STEVE JOHNSON MARITIME - CLIENT APPLICATION LOGIC
 * Dynamic Fleet Gallery, Credentials Vault, Interactive Counter Tickers, Theme Manager & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set current copyright year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Theme Manager (Dark / Light Admiralty Mode)
  initThemeManager();

  // 3. Navigation Bar Scrollspy & Mobile Drawer
  initNavigation();

  // 4. Animated Number Counters
  initNumberCounters();

  // 5. Fleet Directory & Interactive Filter Gallery
  initFleetGallery();

  // 6. Credentials & Certifications Vault
  initCredentialsVault();

  // 7. Consultation Form Handler
  initConsultationForm();
});

/* ==========================================================================
   THEME MANAGER
   ========================================================================== */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('sjm_theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('sjm_theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'fa-solid fa-sun';
      } else {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
  }
}

/* ==========================================================================
   NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  // Mobile Menu Toggle
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      const icon = mobileBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        const icon = mobileBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Active Link Scrollspy
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initNumberCounters() {
  const counters = document.querySelectorAll('.metric-number[data-target]');
  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          if (target === 0) {
            counter.textContent = '0';
            return;
          }
          const duration = 2000;
          const start = 0;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * (target - start) + start);

            counter.textContent = currentVal.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toLocaleString();
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.2 });

  const metricsSection = document.querySelector('.hero-metrics-strip');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   FLEET DIRECTORY & INTERACTIVE FILTER
   ========================================================================== */
const fleetData = [
  {
    name: "YOHO FSO (Floating Storage & Offloading)",
    category: "fso",
    categoryLabel: "FSO / VLCC",
    imo: "7370181",
    dwt: "276,735 DWT",
    operator: "Mobil Producing Nigeria Unlimited (ExxonMobil)",
    rank: "Master & Offshore Installation Manager (OIM)",
    period: "Feb 2012 – Sep 2023 (Rotations)",
    description: "Commanded ExxonMobil's massive offshore crude terminal off the Nigerian coast. Managed entire production offloading, tandem mooring with international tankers, and maintained a flawless zero-LTI safety record over decades of continuous operation.",
    flag: "🇳🇬 / Global",
    details: "Key operational highlights include major life-extension studies, SPM maintenance, tandem mooring exercises with dynamic positioning shuttle tankers, e-MOC hazard verifications, and overseeing 100+ offshore crew members."
  },
  {
    name: "SS LNG LAGOS",
    category: "lng",
    categoryLabel: "LNG Carrier",
    imo: "7360124",
    dwt: "68,206 DWT",
    operator: "Bonny Gas Transport / Nigeria LNG UK Ltd",
    rank: "Second Officer",
    period: "Nov 2002 – Jun 2003",
    description: "Specialized liquefied natural gas carrier navigating transatlantic routes. Supervised cryogenic cargo handling, boil-off gas management, and bridge navigation in compliance with SIGTTO standards.",
    flag: "🇬🇧",
    details: "Conducted specialized gas tanker safety inspections, emergency shutdown system (ESD) testing, and advanced ARPA radar passage planning across North Atlantic waterways."
  },
  {
    name: "M.T. SIR MICHAEL",
    category: "tanker",
    categoryLabel: "Products Tanker",
    imo: "7414743",
    dwt: "8,900 DWT",
    operator: "Seaforce Shipping Co. (Zenon Petroleum & Gas)",
    rank: "Master & Operations Superintendent",
    period: "Apr 2002 – Mar 2004",
    description: "Commanded clean petroleum products tanker carrying diesel, gasoline, and kerosene along coastal and offshore distribution hubs. Supervised technical maintenance and cargo operations.",
    flag: "🇳🇬",
    details: "Oversaw ship-to-ship discharges, coastal navigation, terminal vetting, and port compliance in high-frequency trading conditions."
  },
  {
    name: "M.T. IRAN RAJAI",
    category: "tanker",
    categoryLabel: "Products / Chemical Tanker",
    imo: "8003369",
    dwt: "39,600 DWT",
    operator: "Islamic Republic of Iran Shipping Lines (IRISL)",
    rank: "Chief Officer",
    period: "May 1997 – Aug 2001",
    description: "Managed complex cargo loading schedules, tank cleaning protocols, stability calculations, and crew supervision across international voyages in the Persian Gulf and Indian Ocean.",
    flag: "🇮🇷",
    details: "Executed chemical wash procedures, inert gas generator (IGG) monitoring, and port state control inspections with top ratings."
  },
  {
    name: "M.V. IRAN MOTAHARI",
    category: "bulk",
    categoryLabel: "Bulk Carrier",
    imo: "7521649",
    dwt: "35,110 DWT",
    operator: "Islamic Republic of Iran Shipping Lines (IRISL)",
    rank: "Chief Officer",
    period: "1997 – 2001",
    description: "Supervised dry bulk cargo loading (grain, ore, minerals), hull stress calculations, and cargo hold integrity during transoceanic crossings.",
    flag: "🇮🇷",
    details: "Led safety drills, bilge sounding routines, hatch cover sealing maintenance, and emergency response teams."
  },
  {
    name: "M.V. IRAN SEPAH",
    category: "bulk",
    categoryLabel: "Bulk Carrier",
    imo: "7375363",
    dwt: "33,856 DWT",
    operator: "Islamic Republic of Iran Shipping Lines (IRISL)",
    rank: "Chief Officer",
    period: "1997 – 2001",
    description: "Chief officer aboard major bulk carrier navigating Mediterranean, Asian, and Middle Eastern shipping corridors.",
    flag: "🇮🇷",
    details: "Oversaw heavy weather ballast management, anchor watch, and high-standard SOLAS maintenance."
  },
  {
    name: "M.V. IRAN ASHRAFI",
    category: "bulk",
    categoryLabel: "Bulk Carrier",
    imo: "8309646",
    dwt: "43,499 DWT",
    operator: "Islamic Republic of Iran Shipping Lines (IRISL)",
    rank: "Chief Officer",
    period: "1997 – 2001",
    description: "Large Handymax bulk carrier. Commanded deck department, stability and trim planning, and international port clearance.",
    flag: "🇮🇷",
    details: "Directed major drydock repairs, hold washing, and crane maintenance."
  },
  {
    name: "M.V. IRAN MEELAD",
    category: "cargo",
    categoryLabel: "General Cargo",
    imo: "7052997",
    dwt: "16,630 DWT",
    operator: "Islamic Republic of Iran Shipping Lines (IRISL)",
    rank: "Chief Officer",
    period: "1997 – 2001",
    description: "Multi-purpose general cargo vessel carrying breakbulk, heavy equipment, and industrial freight.",
    flag: "🇮🇷",
    details: "Expert heavy-lift cargo stowage, derrick and crane rigging inspections, and lashings integrity verification."
  },
  {
    name: "M.V. KOTA RATNA",
    category: "cargo",
    categoryLabel: "Container / Cargo",
    imo: "7330478",
    dwt: "14,225 DWT",
    operator: "Pacific International Lines (PIL) Singapore",
    rank: "Chief Officer",
    period: "Jul 1992 – Feb 1996",
    description: "Cellular container and general cargo ship trading throughout Southeast Asia, East Asia, and the Indian subcontinent.",
    flag: "🇸🇬",
    details: "Coordinated container slot planning, twistlock checks, hazardous cargo separation, and fast port turnarounds."
  },
  {
    name: "M.V. KOTA JATI",
    category: "cargo",
    categoryLabel: "Multi-Purpose Cargo",
    imo: "7607924",
    dwt: "19,349 DWT",
    operator: "Pacific International Lines (PIL) Singapore",
    rank: "Chief Officer",
    period: "1992 – 1996",
    description: "High-capacity multi-purpose dry cargo vessel serving major Pacific and Indian ocean commercial routes.",
    flag: "🇸🇬",
    details: "Managed multinational deck crew, ECDIS navigation, and maritime law compliance across international ports."
  },
  {
    name: "M.V. KOTA BUANA",
    category: "cargo",
    categoryLabel: "Dry Cargo",
    imo: "8324309",
    dwt: "6,797 DWT",
    operator: "Pacific International Lines (PIL) Singapore",
    rank: "Chief Officer",
    period: "1992 – 1996",
    description: "Regional feeder vessel managing rapid cargo discharge and delicate maneuvering in congested straits and archipelago ports.",
    flag: "🇸🇬",
    details: "Supervised coastal navigation through Singapore Straits, Malacca Strait, and Sunda Strait."
  },
  {
    name: "M.V. PACIFIC EAGLE",
    category: "cargo",
    categoryLabel: "Dry Cargo",
    imo: "7706419",
    dwt: "11,067 DWT",
    operator: "Pacific International Lines (PIL) Singapore",
    rank: "Second Officer",
    period: "Apr 1991 – Jul 1992",
    description: "Ocean-going general cargo carrier. Navigational watch officer, passage planner, and bridge equipment supervisor.",
    flag: "🇸🇬",
    details: "Maintained nautical charts, notices to mariners, magnetic compass correction, and life-saving appliance inspections."
  },
  {
    name: "M.V. KOTA ALAM",
    category: "cargo",
    categoryLabel: "General Cargo",
    imo: "7329510",
    dwt: "16,635 DWT",
    operator: "Pacific International Lines (PIL) Singapore",
    rank: "Chief Officer",
    period: "1992 – 1996",
    description: "Handled heavy industrial cargo, breakbulk, and international freight with highest standards of seamanship.",
    flag: "🇸🇬",
    details: "Supervised cargo holds ventilation for moisture-sensitive freight and conducted weekly safety drills."
  },
  {
    name: "M.V. RIVER MAJE",
    category: "cargo",
    categoryLabel: "Multi-Purpose Cargo",
    imo: "7716749",
    dwt: "16,489 DWT",
    operator: "Nigerian National Shipping Lines Ltd (NNSL)",
    rank: "Second Officer",
    period: "Nov 1987 – Nov 1988",
    description: "Served on NNSL's renowned River-class merchant vessel connecting West Africa, Western Europe, and the UK.",
    flag: "🇳🇬",
    details: "Led navigational bridge watches, celestial navigation, radar plotting, and general ship maintenance."
  },
  {
    name: "M.V. RIVER GURARA",
    category: "cargo",
    categoryLabel: "Multi-Purpose Cargo",
    imo: "7716713",
    dwt: "16,329 DWT",
    operator: "Nigerian National Shipping Lines Ltd (NNSL)",
    rank: "Third Officer",
    period: "Sep 1985 – Mar 1987",
    description: "Historical Nigerian merchant vessel. Maintained bridge navigational watches and cargo supervisory logs.",
    flag: "🇳🇬",
    details: "Assisted in cargo loading operations in London, Hamburg, Rotterdam, and Lagos ports."
  },
  {
    name: "M.V. RIVER ASAB",
    category: "cargo",
    categoryLabel: "Multi-Purpose Cargo",
    imo: "7716323",
    dwt: "11,647 DWT",
    operator: "Nigerian National Shipping Lines Ltd (NNSL)",
    rank: "Third Officer",
    period: "1985 – 1987",
    description: "Managed deck safety, bridge watchkeeping, and radio communications during extended ocean passages.",
    flag: "🇳🇬",
    details: "Monitored deck maintenance schedules, mooring winches, and lifeboats readiness."
  },
  {
    name: "M.V. RIVER MAJIDUN",
    category: "cargo",
    categoryLabel: "Multi-Purpose Cargo",
    imo: "7716701",
    dwt: "16,334 DWT",
    operator: "Nigerian National Shipping Lines Ltd (NNSL)",
    rank: "Deck Cadet",
    period: "Jul 1981 – Feb 1985",
    description: "Cadetship training under master mariners, mastering seamanship, chartwork, celestial sightings, and ship operations.",
    flag: "🇳🇬",
    details: "Earned commendations for bridge logkeeping, stellar sightings, and safety leadership."
  },
  {
    name: "M.V. RIVER OJI",
    category: "cargo",
    categoryLabel: "Multi-Purpose Cargo",
    imo: "7716684",
    dwt: "16,487 DWT",
    operator: "Nigerian National Shipping Lines Ltd (NNSL)",
    rank: "Deck Cadet",
    period: "1981 – 1985",
    description: "Extensive cadet sea service on transatlantic and European cargo voyages.",
    flag: "🇳🇬",
    details: "Practical training in drydocking, hull sandblasting, bilge management, and cargo lashing."
  },
  {
    name: "M.V. RIVER ANDONI",
    category: "cargo",
    categoryLabel: "Multi-Purpose Cargo",
    imo: "7716348",
    dwt: "11,557 DWT",
    operator: "Nigerian National Shipping Lines Ltd (NNSL)",
    rank: "Deck Cadet",
    period: "1981 – 1985",
    description: "First official sea posting as a deck cadet laying the foundation for a 42-year master-level maritime career.",
    flag: "🇳🇬",
    details: "Initiated professional sea log under Master Mariner guidance."
  },
  {
    name: "M.V. RIVER ADADA",
    category: "cargo",
    categoryLabel: "Multi-Purpose Cargo",
    imo: "7716672",
    dwt: "16,337 DWT",
    operator: "Nigerian National Shipping Lines Ltd (NNSL)",
    rank: "Deck Cadet",
    period: "1981 – 1985",
    description: "River-class general cargo vessel servicing global containerized and breakbulk trade.",
    flag: "🇳🇬",
    details: "Completed cadet navigation qualification requirements."
  }
];

function initFleetGallery() {
  const fleetGrid = document.getElementById('fleetGrid');
  const filterBtns = document.querySelectorAll('.fleet-filter-btn');
  const searchInput = document.getElementById('fleetSearchInput');
  const modal = document.getElementById('vesselModal');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  let activeCategory = 'all';
  let searchTerm = '';

  renderFleet();

  // Filter Button Clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      renderFleet();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      renderFleet();
    });
  }

  // Render Vessel Cards
  function renderFleet() {
    if (!fleetGrid) return;

    const filtered = fleetData.filter(vessel => {
      const matchCategory = (activeCategory === 'all') || (vessel.category === activeCategory);
      const matchSearch = !searchTerm || 
        vessel.name.toLowerCase().includes(searchTerm) ||
        vessel.imo.includes(searchTerm) ||
        vessel.dwt.toLowerCase().includes(searchTerm) ||
        vessel.rank.toLowerCase().includes(searchTerm) ||
        vessel.operator.toLowerCase().includes(searchTerm) ||
        vessel.categoryLabel.toLowerCase().includes(searchTerm);
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      fleetGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-ship" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.4;"></i>
          <h3>No vessels found</h3>
          <p>Try refining your search terms or filter selection.</p>
        </div>
      `;
      return;
    }

    fleetGrid.innerHTML = filtered.map((vessel, index) => `
      <div class="vessel-card">
        <div class="vessel-card-header">
          <span class="vessel-type-pill">${vessel.categoryLabel}</span>
          <span class="vessel-flag" title="Flag">${vessel.flag}</span>
        </div>

        <h3 class="vessel-name">${vessel.name}</h3>
        <div class="vessel-imo">IMO: ${vessel.imo}</div>

        <div class="vessel-meta-grid">
          <div class="vessel-meta-item">
            <span class="vessel-meta-label">Deadweight</span>
            <span class="vessel-meta-val">${vessel.dwt}</span>
          </div>
          <div class="vessel-meta-item">
            <span class="vessel-meta-label">Rank Held</span>
            <span class="vessel-meta-val">${vessel.rank.split('(')[0].trim()}</span>
          </div>
        </div>

        <p class="vessel-desc">${vessel.description}</p>

        <button class="vessel-btn" data-vessel-index="${index}">
          <i class="fa-solid fa-circle-info"></i>
          <span>View Vessel Record</span>
        </button>
      </div>
    `).join('');

    // Attach click events to cards for modal details
    const vesselBtns = fleetGrid.querySelectorAll('.vessel-btn');
    vesselBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-vessel-index');
        openVesselModal(filtered[idx]);
      });
    });
  }

  // Open Modal Details
  function openVesselModal(vessel) {
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span class="vessel-type-pill">${vessel.categoryLabel}</span>
        <span class="vessel-flag">${vessel.flag}</span>
      </div>

      <h2 style="font-size: 1.8rem; margin-bottom: 6px; color: var(--text-primary);">${vessel.name}</h2>
      <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent-gold); margin-bottom: 20px;">
        IMO: ${vessel.imo} • Summer Deadweight: ${vessel.dwt}
      </div>

      <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 18px; margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Operating Line / Owner</div>
            <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${vessel.operator}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Command Role & Period</div>
            <div style="font-weight: 700; color: var(--accent-cyan); font-size: 0.95rem;">${vessel.rank} (${vessel.period})</div>
          </div>
        </div>
      </div>

      <h4 style="font-size: 1.05rem; margin-bottom: 8px; color: var(--accent-cyan);">Operational Overview</h4>
      <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.65; margin-bottom: 18px;">
        ${vessel.description}
      </p>

      <h4 style="font-size: 1.05rem; margin-bottom: 8px; color: var(--accent-cyan);">Technical & Leadership Highlights</h4>
      <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.65; margin-bottom: 24px;">
        ${vessel.details}
      </p>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <a href="#contact" class="btn-primary" onclick="document.getElementById('vesselModal').classList.remove('active');">
          <i class="fa-solid fa-paper-plane"></i>
          <span>Inquire Concerning Similar Operations</span>
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close Modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

/* ==========================================================================
   CREDENTIALS & CERTIFICATIONS VAULT
   ========================================================================== */
const credentialsData = [
  {
    title: "Master STCW II/2 Unlimited & GMDSS",
    category: "license",
    institution: "AMSA Australia / UK MCA / Solent Univ. & South Shields",
    year: "1996 – Revalidated (2001, 2006, 2011, 2016, 2021)",
    icon: "fa-certificate",
    description: "Highest level international maritime qualification authorizing foreign-going command on vessels of unlimited tonnage worldwide with Global Maritime Distress and Safety System endorsement."
  },
  {
    title: "Diploma of Applied Science (Shipmaster)",
    category: "degree",
    institution: "University of Tasmania / Australian Maritime College (AMC)",
    year: "1995 – 1996",
    icon: "fa-graduation-cap",
    description: "Premier academic and nautical degree covering advanced nautical sciences, hydrodynamics, high-seas bridge management, and maritime safety legislation."
  },
  {
    title: "M.Sc. in Transport Management (Logistics)",
    category: "degree",
    institution: "Ladoke Akintola University of Technology (LAUTECH)",
    year: "April 2009 (WES Evaluated Equivalent to Canadian Master's)",
    icon: "fa-user-graduate",
    description: "Advanced post-graduate research focusing on marine logistics optimization, port systems, and petroleum supply chain integrations."
  },
  {
    title: "Transas NTPRO 5000 Dynamic Positioning & Mooring Simulator",
    category: "simulator",
    institution: "Hudson Trident Training Centre, Nigeria",
    year: "December 2024",
    icon: "fa-compass",
    description: "Advanced Mooring Master Simulator Course including complex Tandem Mooring exercise with Anchor Handling and Dynamic Positioning functionalities."
  },
  {
    title: "Major Emergency Management Initial Response (MEMIR)",
    category: "emergency",
    institution: "Aberdeen, United Kingdom & Nigeria",
    year: "2012 (Aberdeen), 2017, 2021 (Nigeria)",
    icon: "fa-triangle-exclamation",
    description: "High-intensity OPITO-aligned command training for incident commanders managing offshore explosions, blowouts, collisions, and life-threatening emergencies."
  },
  {
    title: "Nautical Inspector Commission",
    category: "license",
    institution: "Republic of the Marshall Islands Maritime Administrator",
    year: "November 2024 – Present",
    icon: "fa-shield-halved",
    description: "Certified flag state inspector empowered to conduct official pre-registration, annual safety, ISPS security audits, and maritime casualty investigations."
  },
  {
    title: "Executive Master's Certificate in Project Management",
    category: "degree",
    institution: "Project Management College, United Kingdom",
    year: "2008",
    icon: "fa-diagram-project",
    description: "Strategic frameworks for large-scale offshore capital project delivery, cost control, risk registers, and lifecycle asset execution."
  },
  {
    title: "Advanced Fire Prevention & Control Onboard Ship",
    category: "emergency",
    institution: "Australia (1995) / UK MCA (2004, 2021)",
    year: "1995 – 2021 Revalidated",
    icon: "fa-fire-extinguisher",
    description: "Advanced shipboard firefighting leadership, engine room gas flooding, breathing apparatus command, and boundary cooling tactics."
  },
  {
    title: "Specialized Tanker Training (Oil & Liquefied Gas)",
    category: "license",
    institution: "Australia (1995) & United Kingdom (2002, 2004)",
    year: "1995 – 2004",
    icon: "fa-oil-well",
    description: "Certificates of proficiency in Petroleum Tanker Safety, Crude Oil Washing (COW), Inert Gas Systems (IGS), and Specialized Liquefied Gas Handling."
  },
  {
    title: "ECDIS Navi-Sailor 4000 & Kongsberg Electronic Charting",
    category: "simulator",
    institution: "Australia (2016) & United Kingdom (2021)",
    year: "2016, 2021",
    icon: "fa-desktop",
    description: "Type-specific electronic chart display and information systems proficiency for paperless high-seas bridge navigation."
  },
  {
    title: "Port Facility Security Officer (PFSO)",
    category: "emergency",
    institution: "Nigeria & United Kingdom",
    year: "2005, 2014",
    icon: "fa-lock",
    description: "ISPS Code certified security officer for managing maritime port facility security plans, access control, and anti-piracy countermeasures."
  },
  {
    title: "Human Element Leadership and Management (HELM - Management)",
    category: "license",
    institution: "United Kingdom",
    year: "2021",
    icon: "fa-users-gear",
    description: "Bridge resource management, human element error mitigation, situational awareness, and executive crew leadership."
  }
];

function initCredentialsVault() {
  const credentialsGrid = document.getElementById('credentialsGrid');
  const credTabs = document.querySelectorAll('.cred-tab-btn');

  let activeCategory = 'all';

  renderCredentials();

  credTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      credTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-category');
      renderCredentials();
    });
  });

  function renderCredentials() {
    if (!credentialsGrid) return;

    const filtered = credentialsData.filter(item => {
      return (activeCategory === 'all') || (item.category === activeCategory);
    });

    credentialsGrid.innerHTML = filtered.map(item => `
      <div class="cred-card">
        <div class="cred-card-header">
          <div class="cred-icon">
            <i class="fa-solid ${item.icon}"></i>
          </div>
          <div>
            <h3 class="cred-title">${item.title}</h3>
            <div class="cred-inst">${item.institution}</div>
          </div>
        </div>

        <div style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-cyan); margin-bottom: 12px;">
          <i class="fa-solid fa-clock-rotate-left"></i> ${item.year}
        </div>

        <p class="cred-desc">${item.description}</p>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   CONSULTATION FORM HANDLER
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  const successMsg = document.getElementById('formSuccessMessage');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    const service = document.getElementById('serviceType').value;
    const urgency = document.getElementById('urgencyLevel').value;
    const message = document.getElementById('messageContent').value;

    const subject = encodeURIComponent(`Maritime Advisory Request: ${service} (${name})`);
    const body = encodeURIComponent(
      `Hello Capt. Steve Johnson,\n\n` +
      `I am requesting a consultation / maritime service:\n\n` +
      `Client Name: ${name}\n` +
      `Client Email: ${email}\n` +
      `Service Required: ${service}\n` +
      `Operational Urgency: ${urgency}\n\n` +
      `Scope Details & Vessel Information:\n${message}\n\n` +
      `Thank you!`
    );

    const mailtoUrl = `mailto:sandinajohnson97@gmail.com?subject=${subject}&body=${body}`;

    if (successMsg) {
      successMsg.style.display = 'block';
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 1000);
    }
  });
}
