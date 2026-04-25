
(function () {
  const STORAGE_KEY = 'dienstplanung_gehalt_static_v2';
  const APP_VERSION = '1.8';
  const WEEKDAYS = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
  const TEMPLATE_TYPES = ['fixed','frv','free'];
  const STATUSES = ['planned','open','assigned','final'];
  const ACTUAL_TYPES = ['fixed','frv_open','frv_assigned','free','vacation','sick','split_shift','holiday_work','betriebsversammlung'];
  const LINE_CATEGORIES = [
    'manual','correction','variable_special','tariff_special','christmas_bonus','vacation_money','vacation_bonus','lfz_bonus','reimbursement'
  ];
  const EXPENSE_CATEGORIES = ['work_equipment','training','travel','union','other'];

  const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

  const TAX_CLASS_PROFILES = {
    '1': { label: 'I', estimatedTaxPercent: 8.0 },
    '2': { label: 'II', estimatedTaxPercent: 6.0 },
    '3': { label: 'III', estimatedTaxPercent: 3.0 },
    '4': { label: 'IV', estimatedTaxPercent: 8.0 },
    '5': { label: 'V', estimatedTaxPercent: 15.0 },
    '6': { label: 'VI', estimatedTaxPercent: 20.0 }
  };

  const HEALTH_INSURANCE_PROFILES = [
    { key: 'custom', label: 'Manuell / andere Krankenkasse', additionalPercent: null },
    { key: 'aok_die_gesundheitskasse_fuer_niedersachsen', label: 'AOK - Die Gesundheitskasse für Niedersachsen', additionalPercent: 2.98 },
    { key: 'aok_die_gesundheitskasse_in_hessen', label: 'AOK - Die Gesundheitskasse in Hessen', additionalPercent: 2.98 },
    { key: 'aok_baden_wuerttemberg', label: 'AOK Baden-Württemberg', additionalPercent: 2.99 },
    { key: 'aok_bayern_die_gesundheitskasse', label: 'AOK Bayern - Die Gesundheitskasse', additionalPercent: 2.69 },
    { key: 'aok_bremen_bremerhaven', label: 'AOK Bremen / Bremerhaven', additionalPercent: 3.29 },
    { key: 'aok_nordost_die_gesundheitskasse', label: 'AOK Nordost - Die Gesundheitskasse', additionalPercent: 3.50 },
    { key: 'aok_nordwest_die_gesundheitskasse', label: 'AOK NordWest - Die Gesundheitskasse', additionalPercent: 2.99 },
    { key: 'aok_plus_die_gesundheitskasse_fuer_sachsen_und_thueringen', label: 'AOK PLUS - Die Gesundheitskasse für Sachsen und Thüringen', additionalPercent: 3.10 },
    { key: 'aok_rheinland_hamburg_die_gesundheitskasse', label: 'AOK Rheinland/Hamburg - Die Gesundheitskasse', additionalPercent: 3.29 },
    { key: 'aok_rheinland_pfalz_saarland_die_gesundheitskasse', label: 'AOK Rheinland-Pfalz/Saarland-Die Gesundheitskasse', additionalPercent: 2.47 },
    { key: 'aok_sachsen_anhalt_die_gesundheitskasse', label: 'AOK Sachsen-Anhalt - Die Gesundheitskasse', additionalPercent: 2.89 },
    { key: 'audi_bkk', label: 'Audi BKK', additionalPercent: 2.60 },
    { key: 'bahn_bkk', label: 'BAHN-BKK', additionalPercent: 3.65 },
    { key: 'barmer', label: 'BARMER', additionalPercent: 3.29 },
    { key: 'bergische_krankenkasse', label: 'BERGISCHE KRANKENKASSE', additionalPercent: 3.79 },
    { key: 'bertelsmann_bkk', label: 'Bertelsmann BKK', additionalPercent: 3.20 },
    { key: 'betriebskrankenkasse_der_g_m_pfaff_ag', label: 'Betriebskrankenkasse der G.M. Pfaff AG', additionalPercent: 2.78 },
    { key: 'betriebskrankenkasse_ewe', label: 'Betriebskrankenkasse EWE', additionalPercent: 3.19 },
    { key: 'betriebskrankenkasse_miele', label: 'Betriebskrankenkasse Miele', additionalPercent: 3.20 },
    { key: 'betriebskrankenkasse_mobil', label: 'Betriebskrankenkasse Mobil', additionalPercent: 3.89 },
    { key: 'betriebskrankenkasse_pricewaterhousecoopers', label: 'Betriebskrankenkasse PricewaterhouseCoopers', additionalPercent: 2.80 },
    { key: 'betriebskrankenkasse_technoform', label: 'Betriebskrankenkasse Technoform', additionalPercent: 3.49 },
    { key: 'big_direkt_gesund', label: 'BIG direkt gesund', additionalPercent: 3.69 },
    { key: 'bkk_akzo_nobel_bayern', label: 'BKK Akzo Nobel Bayern', additionalPercent: 3.39 },
    { key: 'bkk_b_braun_aesculap', label: 'BKK B. Braun Aesculap', additionalPercent: 3.65 },
    { key: 'bkk_deutsche_bank_ag', label: 'BKK Deutsche Bank AG', additionalPercent: 3.40 },
    { key: 'bkk_diakonie', label: 'BKK Diakonie', additionalPercent: 3.80 },
    { key: 'bkk_euregio', label: 'BKK EUREGIO', additionalPercent: 3.39 },
    { key: 'bkk_evm', label: 'BKK evm', additionalPercent: 2.50 },
    { key: 'bkk_exklusiv', label: 'BKK exklusiv', additionalPercent: 3.49 },
    { key: 'bkk_faber_castell_partner', label: 'BKK Faber-Castell & Partner', additionalPercent: 2.48 },
    { key: 'bkk_firmus', label: 'BKK firmus', additionalPercent: 2.18 },
    { key: 'bkk_freudenberg', label: 'BKK Freudenberg', additionalPercent: 2.99 },
    { key: 'bkk_gildemeister_seidensticker', label: 'BKK GILDEMEISTER SEIDENSTICKER', additionalPercent: 3.40 },
    { key: 'bkk_groz_beckert', label: 'BKK Groz-Beckert', additionalPercent: 3.40 },
    { key: 'bkk_herkules', label: 'BKK Herkules', additionalPercent: 4.38 },
    { key: 'bkk_linde', label: 'BKK Linde', additionalPercent: 2.99 },
    { key: 'bkk_mahle', label: 'BKK MAHLE', additionalPercent: 4.20 },
    { key: 'bkk_melitta_hmr', label: 'bkk melitta hmr', additionalPercent: 3.90 },
    { key: 'bkk_mkk_meine_krankenkasse', label: 'BKK mkk - meine krankenkasse', additionalPercent: 3.50 },
    { key: 'bkk_mtu', label: 'BKK MTU', additionalPercent: 2.80 },
    { key: 'bkk_pfalz', label: 'BKK Pfalz', additionalPercent: 3.90 },
    { key: 'bkk_provita', label: 'BKK ProVita', additionalPercent: 3.79 },
    { key: 'bkk_public', label: 'BKK Public', additionalPercent: 2.50 },
    { key: 'bkk_rieker_ricosta_weisser', label: 'BKK Rieker.RICOSTA.Weisser', additionalPercent: 4.20 },
    { key: 'bkk_salzgitter', label: 'BKK Salzgitter', additionalPercent: 3.50 },
    { key: 'bkk_scheufelen', label: 'BKK Scheufelen', additionalPercent: 3.99 },
    { key: 'bkk_schwarzwald_baar_heuberg', label: 'BKK Schwarzwald-Baar-Heuberg', additionalPercent: 2.79 },
    { key: 'bkk_vdn', label: 'BKK VDN', additionalPercent: 3.19 },
    { key: 'bkk_verbundplus', label: 'BKK VerbundPlus', additionalPercent: 3.89 },
    { key: 'bkk_werra_meissner', label: 'BKK WERRA-MEISSNER', additionalPercent: 4.35 },
    { key: 'bkk_wirtschaft_und_finanzen', label: 'BKK WIRTSCHAFT UND FINANZEN', additionalPercent: 3.99 },
    { key: 'bkk_duerkoppadler', label: 'BKK_DürkoppAdler', additionalPercent: 3.88 },
    { key: 'bkk24', label: 'BKK24', additionalPercent: 4.39 },
    { key: 'bkk_wuerth', label: 'BKK-Würth', additionalPercent: 3.40 },
    { key: 'bmw_bkk', label: 'BMW BKK', additionalPercent: 3.90 },
    { key: 'bosch_bkk', label: 'Bosch BKK', additionalPercent: 3.18 },
    { key: 'continentale_betriebskrankenkasse', label: 'Continentale Betriebskrankenkasse', additionalPercent: 3.33 },
    { key: 'dak_gesundheit', label: 'DAK-Gesundheit', additionalPercent: 3.20 },
    { key: 'debeka_bkk', label: 'Debeka BKK', additionalPercent: 3.25 },
    { key: 'energie_betriebskrankenkasse', label: 'energie-Betriebskrankenkasse', additionalPercent: 3.98 },
    { key: 'ey_betriebskrankenkasse', label: 'EY Betriebskrankenkasse', additionalPercent: 2.75 },
    { key: 'handelskrankenkasse_hkk', label: 'Handelskrankenkasse (hkk)', additionalPercent: 2.59 },
    { key: 'heimat_krankenkasse', label: 'Heimat Krankenkasse', additionalPercent: 3.90 },
    { key: 'hek_hanseatische_krankenkasse', label: 'HEK - Hanseatische Krankenkasse', additionalPercent: 2.89 },
    { key: 'ikk_die_innovationskasse', label: 'IKK - Die Innovationskasse', additionalPercent: 4.30 },
    { key: 'ikk_classic', label: 'IKK classic', additionalPercent: 3.40 },
    { key: 'ikk_gesund_plus', label: 'IKK gesund plus', additionalPercent: 3.39 },
    { key: 'ikk_suedwest', label: 'IKK Südwest', additionalPercent: 3.87 },
    { key: 'innungskrankenkasse_brandenburg_und_berlin', label: 'INNUNGSKRANKENKASSE BRANDENBURG UND BERLIN', additionalPercent: 4.35 },
    { key: 'karl_mayer_bkk', label: 'KARL MAYER BKK', additionalPercent: 2.99 },
    { key: 'kaufmaennische_krankenkasse_kkh', label: 'Kaufmännische Krankenkasse - KKH', additionalPercent: 3.78 },
    { key: 'knappschaft', label: 'KNAPPSCHAFT', additionalPercent: 4.30 },
    { key: 'koenig_bauer_bkk', label: 'Koenig & Bauer BKK', additionalPercent: 3.18 },
    { key: 'krones_betriebskrankenkasse', label: 'Krones Betriebskrankenkasse', additionalPercent: 2.20 },
    { key: 'mercedes_benz_bkk', label: 'Mercedes-Benz BKK', additionalPercent: 3.20 },
    { key: 'merck_bkk', label: 'Merck BKK', additionalPercent: 3.97 },
    { key: 'mhplus_betriebskrankenkasse', label: 'mhplus Betriebskrankenkasse', additionalPercent: 3.86 },
    { key: 'novitas_bkk', label: 'novitas bkk', additionalPercent: 3.60 },
    { key: 'pronova_bkk', label: 'Pronova BKK', additionalPercent: 3.70 },
    { key: 'r_v_betriebskrankenkasse', label: 'R+V Betriebskrankenkasse', additionalPercent: 3.49 },
    { key: 'salus_bkk', label: 'Salus BKK', additionalPercent: 3.29 },
    { key: 'securvita_bkk', label: 'SECURVITA BKK', additionalPercent: 3.90 },
    { key: 'siemens_betriebskrankenkasse_sbk', label: 'Siemens-Betriebskrankenkasse (SBK)', additionalPercent: 3.80 },
    { key: 'skd_bkk', label: 'SKD BKK', additionalPercent: 2.98 },
    { key: 'sozialversicherung_fuer_landwirtschaft_forsten_und_gartenbau', label: 'Sozialversicherung für Landwirtschaft, Forsten und Gartenbau (SVLFG)', additionalPercent: 0.00 },
    { key: 'suedzucker_bkk', label: 'Südzucker BKK', additionalPercent: 2.90 },
    { key: 'techniker_krankenkasse', label: 'Techniker Krankenkasse', additionalPercent: 2.69 },
    { key: 'tui_bkk', label: 'TUI BKK', additionalPercent: 2.50 },
    { key: 'viactiv_krankenkasse', label: 'VIACTIV Krankenkasse', additionalPercent: 4.19 },
    { key: 'vivida_bkk', label: 'vivida bkk', additionalPercent: 3.79 },
    { key: 'wmf_bkk', label: 'WMF BKK', additionalPercent: 2.85 },
    { key: 'zf_bkk', label: 'ZF BKK', additionalPercent: 3.40 },
  ];

  const TEMPLATE_LABELS = { fixed:'fest', frv:'FRV', free:'frei' };
  const STATUS_LABELS = { planned:'geplant', open:'offen', assigned:'zugeteilt', final:'final' };
  const ACTUAL_LABELS = {
    fixed:'fest', frv_open:'FRV offen', frv_assigned:'FRV zugeteilt', free:'frei',
    vacation:'Urlaub', sick:'krank', split_shift:'geteilter Dienst',
    holiday_work:'Feiertagsdienst', betriebsversammlung:'Betriebsversammlung'
  };
  const LINE_CATEGORY_LABELS = {
    manual:'manuell', correction:'Korrektur', variable_special:'variable Sonderzahlung',
    tariff_special:'tarifliche Sonderzahlung', christmas_bonus:'Weihnachtsgeld',
    vacation_money:'Urlaubsgeld', vacation_bonus:'Urlaubszuschlag',
    lfz_bonus:'LFZ-Zuschlag', reimbursement:'Erstattung'
  };
  const EXPENSE_CATEGORY_LABELS = {
    work_equipment:'Arbeitsmittel', training:'Fortbildung', travel:'Fahrten',
    union:'Gewerkschaft', other:'Sonstiges'
  };


  const payMatrix = {
    BASE_PAY: cfg(true, true, true, true),
    OVERTIME_30: cfg(true, true, true, true),
    SATURDAY: cfg(true, true, true, true),
    SUNDAY: cfg(true, false, false, false),
    NIGHT: cfg(true, false, false, false),
    HOLIDAY_100: cfg(true, true, true, false),
    HOLIDAY_35: cfg(true, false, false, false),
    VORFESTTAG: cfg(true, true, true, false),
    FAHRDIENST: cfg(true, true, true, true),
    ATTENDANCE: cfg(true, true, true, true),
    SPLIT_SHIFT: cfg(true, true, true, true),
    VACATION_BONUS: cfg(true, true, true, true),
    VACATION_MONEY: cfg(true, true, true, false),
    LFZ_BONUS: cfg(true, true, true, true),
    BETRIEBSVERSAMMLUNG_HOURS: cfg(true, true, true, true),
    BETRIEBSVERSAMMLUNG_TRAVEL: cfg(false, false, false, false, true),
    VARIABLE_SPECIAL: cfg(true, true, true, true),
    TARIFF_SPECIAL: cfg(true, true, true, true),
    CHRISTMAS_BONUS: cfg(true, true, true, true),
    CORRECTION: cfg(true, true, true, true),
    MANUAL: cfg(true, true, true, true)
  };

  function cfg(gesamt, steuer, sv, zv, reimbursement=false) {
    return { gesamt, steuer, sv, zv, reimbursement };
  }

  function defaultState() {
    return {
      settings: {
        tariffName: 'TV-N Brandenburg',
        entgeltgruppe: 'EG 5',
        stufe: 1,
        weeklyHoursContract: 39,
        weeklyHoursCycleAvg: '40:05',
        fixedMonthlyBasePay: 3022,
        baseHourRate: 17.82,
        bonusHourRate: 18.18,
        isFahrdienst: true,
        isShiftWork: false,
        frvPlaceholderMinutes: 468,
        kvbbgUmlagePercent: 0.55,
        kvbbgZusatzPercent: 2.40,
        taxClass: '1',
        estimatedTaxPercent: 8.0,
        healthInsurance: 'custom',
        healthAdditionalPercent: 1.70,
        estimatedHealthPercent: 8.15,
        estimatedPensionPercent: 9.30,
        estimatedUnemploymentPercent: 1.30,
        estimatedCarePercent: 2.40,
        estimatedChurchPercent: 0,
        estimatedSoliPercent: 0,
        preferActualDeductions: true,
        calendarName: 'Arbeit',
        reminderMinutes: 30,
        homeAddress: '',
        depotAddress: 'Graf-Arco-Straße 9, 14641 Nauen',
        currentRotationWeek: 1,
        currentRotationAnchorDate: currentDate()
      },
      rotationWeeks: Array.from({ length: 40 }, (_, i) => ({
        weekNumber: i + 1,
        days: WEEKDAYS.map((name, idx) => ({
          weekdayName: name,
          weekdayIndex: idx,
          templateType: idx < 5 ? 'fixed' : 'free',
          defaultStartTime: idx < 5 ? '05:00' : '',
          defaultEndTime: idx < 5 ? '13:18' : '',
          defaultBreakMinutes: idx < 5 ? 30 : 0,
          defaultPaidMinutes: idx < 5 ? 468 : 0,
          defaultPaidMode: 'auto',
          serviceNumber: '',
          notes: ''
        }))
      })),
      dayEntries: {},
      statements: {},
      statementLines: [],
      commuteMonths: {},
      expenses: []
    };
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return deepMerge(defaultState(), JSON.parse(raw));
    } catch (e) {
      console.error(e);
      return defaultState();
    }
  }

  
  function renderAppVersion() {
    const el = document.getElementById('appVersionBadge');
    if (el) el.textContent = APP_VERSION;
  }

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.getElementById('syncState').textContent = 'Lokal gespeichert · ' + new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'});
  }

  function deepMerge(base, patch) {
    if (Array.isArray(base)) return Array.isArray(patch) ? patch : base;
    if (typeof base !== 'object' || base === null) return patch ?? base;
    const out = { ...base };
    for (const key of Object.keys(patch || {})) {
      if (key in base) out[key] = deepMerge(base[key], patch[key]);
      else out[key] = patch[key];
    }
    return out;
  }

  function euro(amount) {
    return (Number(amount || 0)).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  }
  function fixed2(n) { return Number(n || 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function minToHours(minutes) {
    const m = Math.max(0, Math.round(Number(minutes || 0)));
    return fixed2(m / 60) + ' Std.';
  }
  function dateToMonth(date) { return date.slice(0,7); }
  function monthStart(month) { return new Date(month + '-01T00:00:00'); }
  function monthEnd(month) { const d = monthStart(month); return new Date(d.getFullYear(), d.getMonth()+1, 0); }
  function currentMonth() { return new Date().toISOString().slice(0,7); }
  function currentDate() { return new Date().toISOString().slice(0,10); }
  function prevMonth(month) {
    const d = monthStart(month); d.setMonth(d.getMonth()-1); return d.toISOString().slice(0,7);
  }
  function formatMonth(month) { const [y,m] = month.split('-').map(Number); return MONTH_NAMES[m-1] + ' ' + y; }
  function parseTime(s) { if (!s) return null; const [h,m]=s.split(':').map(Number); return Number.isFinite(h) && Number.isFinite(m) ? h*60+m : null; }
  function parseDurationMinutes(value) {
    if (value == null) return null;
    const raw = String(value).trim();
    if (!raw) return null;
    if (/^\d+$/.test(raw)) return Number(raw);
    const match = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
  }
  function formatMinutes(mins) { const mTotal = Math.max(0, Math.round(Number(mins||0))); const h = Math.floor(mTotal/60); const m = mTotal%60; return `${h}:${String(m).padStart(2,'0')}`; }
  function formatDateLong(dateStr) { const d = new Date(dateStr + 'T00:00:00'); return d.toLocaleDateString('de-DE', { weekday:'long', day:'2-digit', month:'2-digit', year:'numeric' }); }

  const holidayCache = {};
  function formatIsoDate(year, month, day) {
    return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
  function easterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }
  function addDateDays(dateObj, days) {
    const d = new Date(dateObj);
    d.setDate(d.getDate() + days);
    return d;
  }
  function getBrandenburgHolidayMap(year) {
    if (holidayCache[year]) return holidayCache[year];
    const easter = easterSunday(year);
    const map = {};
    const addHoliday = (dateObj, name) => {
      map[formatIsoDate(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate())] = name;
    };
    addHoliday(new Date(year, 0, 1), 'Neujahr');
    addHoliday(addDateDays(easter, -2), 'Karfreitag');
    addHoliday(addDateDays(easter, 0), 'Ostersonntag');
    addHoliday(addDateDays(easter, 1), 'Ostermontag');
    addHoliday(new Date(year, 4, 1), 'Tag der Arbeit');
    addHoliday(addDateDays(easter, 39), 'Christi Himmelfahrt');
    addHoliday(addDateDays(easter, 49), 'Pfingstsonntag');
    addHoliday(addDateDays(easter, 50), 'Pfingstmontag');
    addHoliday(new Date(year, 9, 3), 'Tag der Deutschen Einheit');
    addHoliday(new Date(year, 9, 31), 'Reformationstag');
    addHoliday(new Date(year, 11, 25), '1. Weihnachtstag');
    addHoliday(new Date(year, 11, 26), '2. Weihnachtstag');
    holidayCache[year] = map;
    return map;
  }
  function getHolidayName(dateStr) {
    if (!dateStr) return '';
    const year = Number(String(dateStr).slice(0, 4));
    return getBrandenburgHolidayMap(year)[dateStr] || '';
  }
  function isBrandenburgHoliday(dateStr) {
    return !!getHolidayName(dateStr);
  }

  function templateLabel(v) { return TEMPLATE_LABELS[v] || v || '—'; }
  function statusLabel(v) { return STATUS_LABELS[v] || v || '—'; }
  function actualLabel(v) { return ACTUAL_LABELS[v] || templateLabel(v) || v || '—'; }
  function lineCategoryLabel(v) { return LINE_CATEGORY_LABELS[v] || v || '—'; }
  function expenseCategoryLabel(v) { return EXPENSE_CATEGORY_LABELS[v] || v || '—'; }
  function describeEntry(entry) {
    const nr = entry.serviceNumber ? `Dienst ${entry.serviceNumber}` : actualLabel(entry.actualType || entry.plannedType);
    return entry.serviceNumber ? `${nr} · ${actualLabel(entry.actualType || entry.plannedType)}` : nr;
  }

  function overlap(startA, endA, startB, endB) {
    const s = Math.max(startA, startB); const e = Math.min(endA, endB); return Math.max(0, e - s);
  }

  function buildSegmentsForEntry(entry) {
    if (entry.actualType === 'frv_open') {
      return [{ start: 0, end: Number(entry.frvMinutes || state.settings.frvPlaceholderMinutes), weekday: new Date(entry.date + 'T00:00:00').getDay() }];
    }
    if (entry.isVacation || entry.actualType === 'vacation' || entry.isSick || entry.actualType === 'sick' || entry.actualType === 'free') return [];
    const weekday = new Date(entry.date + 'T00:00:00').getDay();
    if (entry.isSplitShift || entry.actualType === 'split_shift') {
      return (entry.parts || []).map(p => ({
        start: parseTime(p.startTime) || 0,
        end: normalizeEnd(parseTime(p.startTime), parseTime(p.endTime)),
        breakMinutes: Number(p.breakMinutes || 0),
        weekday
      }));
    }
    const s = parseTime(entry.startTime);
    const e = parseTime(entry.endTime);
    if (s == null || e == null) return [];
    return [{ start: s, end: normalizeEnd(s, e), breakMinutes: Number(entry.breakMinutes || 0), weekday }];
  }

  function normalizeEnd(start, end) { return end < start ? end + 1440 : end; }

  function calculatePaidMinutes(entry) {
    if (entry.actualType === 'frv_open') return Number(entry.frvMinutes || state.settings.frvPlaceholderMinutes);
    if (entry.isVacation || entry.actualType === 'vacation' || entry.isSick || entry.actualType === 'sick' || entry.actualType === 'free') return 0;
    if (entry.usesTemplatePaidMinutes && Number(entry.paidMinutes || 0) > 0) return Number(entry.paidMinutes || 0);
    const segs = buildSegmentsForEntry(entry);
    return segs.reduce((sum, seg) => sum + Math.max(0, seg.end - seg.start - Number(seg.breakMinutes || 0)), 0);
  }

  function calculateTemplatePaidMinutes(day) {
    if (!day) return 0;
    if (day.templateType === 'frv') return Number(state.settings.frvPlaceholderMinutes || 468);
    if (day.templateType === 'free' || day.templateType === 'vacation' || day.templateType === 'sick') return 0;
    const start = parseTime(day.defaultStartTime);
    const end = parseTime(day.defaultEndTime);
    if (start == null || end == null) return Number(day.defaultPaidMinutes || 0);
    return Math.max(0, normalizeEnd(start, end) - start - Number(day.defaultBreakMinutes || 0));
  }

  function syncDayPaidPreview() {
    const previewField = document.getElementById('dayPaidPreview');
    if (!previewField) return;
    const actualType = document.getElementById('actualType')?.value || 'fixed';
    const isVacation = !!document.getElementById('flagVacation')?.checked;
    const isSick = !!document.getElementById('flagSick')?.checked;
    const isSplit = !!document.getElementById('flagSplit')?.checked || actualType === 'split_shift';
    let minutes = 0;
    if (actualType === 'frv_open') {
      minutes = parseDurationMinutes(document.getElementById('frvMinutes')?.value) ?? Number(state.settings.frvPlaceholderMinutes || 468);
    } else if (isVacation || isSick || actualType === 'vacation' || actualType === 'sick' || actualType === 'free') {
      minutes = 0;
    } else if (isSplit) {
      minutes = [...document.querySelectorAll('#splitPartsContainer .split-part')].reduce((sum, row) => {
        const s = parseTime(row.querySelector('.split-start')?.value || '');
        const eRaw = parseTime(row.querySelector('.split-end')?.value || '');
        const b = Number(row.querySelector('.split-break')?.value || 0);
        if (s == null || eRaw == null) return sum;
        const e = normalizeEnd(s, eRaw);
        return sum + Math.max(0, e - s - b);
      }, 0);
    } else {
      const s = parseTime(document.getElementById('dayStart')?.value || '');
      const eRaw = parseTime(document.getElementById('dayEnd')?.value || '');
      const b = Number(document.getElementById('dayBreak')?.value || 0);
      if (s != null && eRaw != null) minutes = Math.max(0, normalizeEnd(s, eRaw) - s - b);
    }
    previewField.value = formatMinutes(minutes);
  }

  function eligibleHoursSaturday(entry) {
    const d = new Date(entry.date + 'T00:00:00');
    if (d.getDay() !== 6) return 0;
    return buildSegmentsForEntry(entry).reduce((sum, seg) => sum + overlap(seg.start, seg.end, 13*60, 24*60)/60, 0);
  }
  function eligibleHoursSunday(entry) {
    const d = new Date(entry.date + 'T00:00:00');
    if (d.getDay() !== 0) return 0;
    return calculatePaidMinutes(entry)/60;
  }
  function eligibleHoursNight(entry) {
    return buildSegmentsForEntry(entry).reduce((sum, seg) => {
      const first = overlap(seg.start, seg.end, 21*60, 24*60) / 60;
      let second = 0;
      if (seg.end > 1440) second = overlap(seg.start-1440, seg.end-1440, 0, 6*60) / 60;
      return sum + first + second;
    }, 0);
  }

  function buildEarnedItems(month) {
    const items = [];
    const rate = Number(state.settings.bonusHourRate || 18.18);
    const dates = monthDateRange(month);
    let attendanceDays = 0;
    for (const date of dates) {
      const entry = getPayrollSourceEntry(date);
      if (!entry) continue;
      const paidMinutes = calculatePaidMinutes(entry);
      const paidHours = paidMinutes / 60;
      const plannedWorkingDay = isPlannedWorkingDay(date);
      const isActualWork = paidMinutes > 0 && !entry.isVacation && !entry.isSick && entry.actualType !== 'free';
      if (isActualWork) attendanceDays += 1;

      const satHours = eligibleHoursSaturday(entry);
      if (satHours > 0) items.push(item('SATURDAY','Samstagszulage', satHours * rate * 0.20, satHours, 20, month, nextMonth(month)));
      const sunHours = eligibleHoursSunday(entry);
      if (sunHours > 0) items.push(item('SUNDAY','Sonntagszuschlag', sunHours * rate * 0.25, sunHours, 25, month, nextMonth(month)));
      const nightHours = eligibleHoursNight(entry);
      if (nightHours > 0) items.push(item('NIGHT','Nachtzuschlag', nightHours * rate * 0.25, nightHours, 25, month, nextMonth(month)));
      if (entry.isHoliday && paidHours > 0) {
        items.push(item('HOLIDAY_100','Feiertag 100%', paidHours * rate * 1.00, paidHours, 100, month, nextMonth(month)));
        items.push(item('HOLIDAY_35','Feiertag 35%', paidHours * rate * 0.35, paidHours, 35, month, nextMonth(month)));
      }
      if (entry.isVorfesttag && paidHours > 0) items.push(item('VORFESTTAG','Vorfesttag', paidHours * rate * 0.35, paidHours, 35, month, nextMonth(month)));
      const orderedOtHours = Number(entry.orderedOvertimeHours || 0);
      if (orderedOtHours > 0) items.push(item('OVERTIME_30','Überstd. 30%', orderedOtHours * rate * 0.30, orderedOtHours, 30, month, nextMonth(month)));
      if (entry.isFahrdienst && isActualWork) items.push(item('FAHRDIENST','Fahrdienstzulage', 5, null, null, month, nextMonth(month), null, 1));
      if (entry.isSplitShift || entry.actualType === 'split_shift') items.push(item('SPLIT_SHIFT','Geteilter Dienst', 7, null, null, month, nextMonth(month), null, 1));
      if (entry.isVacation && plannedWorkingDay) {
        const factor = Number(entry.factorValue || 0);
        const days = Number(entry.vacationDays || 1);
        if (factor > 0) items.push(item('VACATION_BONUS','Urlaubszuschlag', days * factor * 7.8, null, null, month, nextMonth(month), factor, days));
      }
      if (entry.isSick && plannedWorkingDay) {
        const factor = Number(entry.factorValue || 0);
        const days = Number(entry.sickDays || 1);
        if (factor > 0) items.push(item('LFZ_BONUS','LFZ-Zuschlag', days * factor * 7.8, null, null, month, nextMonth(month), factor, days));
      }
      if (entry.isBetriebsversammlung && paidHours > 0) items.push(item('BETRIEBSVERSAMMLUNG_HOURS','Std. Betriebsversammlung', paidHours * Number(state.settings.baseHourRate || 17.82), paidHours, null, month, nextMonth(month)));
      if (entry.isBetriebsversammlung && Number(entry.betriebsversammlungTravelAmount || 0) > 0) items.push(item('BETRIEBSVERSAMMLUNG_TRAVEL','FK Betriebsversammlung', Number(entry.betriebsversammlungTravelAmount), null, null, month, nextMonth(month), null, null, true));
    }
    if (attendanceDays > 0) items.push(item('ATTENDANCE','Anwesenheitsprämie', attendanceDays * 2, null, null, month, nextMonth(month), null, attendanceDays));
    return items;
  }

  function nextMonth(month) { const d = monthStart(month); d.setMonth(d.getMonth()+1); return d.toISOString().slice(0,7); }

  function item(code,label,amount,hours,percent,earnedMonth,paidMonth,factor=null,days=null,reimbursement=false) {
    const m = payMatrix[code] || cfg(true,true,true,true,reimbursement);
    return { code, label, amount: round2(amount), hours, percent, earnedMonth, paidMonth, factor, days, reimbursement: reimbursement || m.reimbursement, counts: m };
  }

  function groupPayItems(items) {
    const grouped = new Map();
    items.forEach((x) => {
      const key = [
        x.code || '',
        x.label || '',
        x.earnedMonth || '',
        x.paidMonth || '',
        x.percent == null ? '' : x.percent,
        x.factor == null ? '' : x.factor,
        !!x.reimbursement,
        !!x.counts?.gesamt,
        !!x.counts?.steuer,
        !!x.counts?.sv,
        !!x.counts?.zv
      ].join('|');

      if (!grouped.has(key)) {
        grouped.set(key, {
          ...x,
          amount: 0,
          hours: null,
          days: null
        });
      }

      const g = grouped.get(key);
      g.amount = round2(Number(g.amount || 0) + Number(x.amount || 0));

      if (x.hours != null && Number(x.hours) > 0) {
        g.hours = round2(Number(g.hours || 0) + Number(x.hours || 0));
      }

      if (x.days != null && Number(x.days) > 0) {
        g.days = round2(Number(g.days || 0) + Number(x.days || 0));
      }
    });

    return [...grouped.values()];
  }

  function round2(v) { return Math.round((Number(v)||0)*100)/100; }

  function manualLinesForPaidMonth(month) {
    return state.statementLines.filter(x => x.paidMonth === month).map(x => ({
      code: x.code || 'MANUAL', label: x.label, amount: Number(x.amount || 0), hours: null, percent: null,
      earnedMonth: x.earnedMonth || month, paidMonth: x.paidMonth || month, factor: null, days: null,
      reimbursement: !!x.isReimbursement,
      counts: { gesamt: !!x.countsGesamt, steuer: !!x.countsSteuer, sv: !!x.countsSv, zv: !!x.countsZv, reimbursement: !!x.isReimbursement }
    }));
  }

  function calculatePayroll(month) {
    const earnedItemsRaw = buildEarnedItems(month);
    const paidMonth = month;
    const previous = prevMonth(month);
    const paidItemsRaw = [
      item('BASE_PAY','Grundvergütung', Number(state.settings.fixedMonthlyBasePay || 3022), null, null, month, month)
    ];
    paidItemsRaw.push(...buildEarnedItems(previous).filter(x => x.paidMonth === month));
    paidItemsRaw.push(...manualLinesForPaidMonth(month));
    const earnedItems = groupPayItems(earnedItemsRaw);
    const paidItems = groupPayItems(paidItemsRaw);

    const gross = { gesamt: 0, steuer: 0, sv: 0, zv: 0 };
    for (const x of paidItems) {
      if (x.counts.gesamt) gross.gesamt += x.amount;
      if (x.counts.steuer) gross.steuer += x.amount;
      if (x.counts.sv) gross.sv += x.amount;
      if (x.counts.zv) gross.zv += x.amount;
    }
    gross.gesamt = round2(gross.gesamt); gross.steuer = round2(gross.steuer); gross.sv = round2(gross.sv); gross.zv = round2(gross.zv);
    const kvbbgUmlage = round2(gross.zv * (Number(state.settings.kvbbgUmlagePercent || 0.55) / 100));
    const kvbbgZusatz = round2(gross.zv * (Number(state.settings.kvbbgZusatzPercent || 2.4) / 100));
    const statement = state.statements[month] || {};

    const estimated = {
      lohnsteuer: round2(gross.steuer * (Number(state.settings.estimatedTaxPercent || 0) / 100)),
      kv: round2(gross.sv * (Number(state.settings.estimatedHealthPercent || 0) / 100)),
      rv: round2(gross.sv * (Number(state.settings.estimatedPensionPercent || 0) / 100)),
      av: round2(gross.sv * (Number(state.settings.estimatedUnemploymentPercent || 0) / 100)),
      pv: round2(gross.sv * (Number(state.settings.estimatedCarePercent || 0) / 100))
    };
    estimated.kirchensteuer = round2(estimated.lohnsteuer * (Number(state.settings.estimatedChurchPercent || 0) / 100));
    estimated.soli = round2(estimated.lohnsteuer * (Number(state.settings.estimatedSoliPercent || 0) / 100));
    estimated.kvbbgUmlage = kvbbgUmlage;
    estimated.kvbbgZusatz = kvbbgZusatz;
    estimated.other = round2(Number(statement.other || 0));

    const hasActualCore = ['lohnsteuer','kv','rv','av','pv'].some(k => Number(statement[k] || 0) > 0);
    const preferActual = !!state.settings.preferActualDeductions;
    const deductions = {
      lohnsteuer: preferActual && Number(statement.lohnsteuer || 0) > 0 ? round2(Number(statement.lohnsteuer || 0)) : estimated.lohnsteuer,
      kirchensteuer: preferActual && Number(statement.kirchensteuer || 0) > 0 ? round2(Number(statement.kirchensteuer || 0)) : estimated.kirchensteuer,
      soli: preferActual && Number(statement.soli || 0) > 0 ? round2(Number(statement.soli || 0)) : estimated.soli,
      kv: preferActual && Number(statement.kv || 0) > 0 ? round2(Number(statement.kv || 0)) : estimated.kv,
      rv: preferActual && Number(statement.rv || 0) > 0 ? round2(Number(statement.rv || 0)) : estimated.rv,
      av: preferActual && Number(statement.av || 0) > 0 ? round2(Number(statement.av || 0)) : estimated.av,
      pv: preferActual && Number(statement.pv || 0) > 0 ? round2(Number(statement.pv || 0)) : estimated.pv,
      kvbbgUmlage,
      kvbbgZusatz,
      other: round2(Number(statement.other || 0))
    };
    const deductionMode = hasActualCore && preferActual ? 'Abrechnung + KVBbg' : 'Schätzung + KVBbg';
    const totalDeductions = round2(Object.values(deductions).reduce((s, x) => s + Number(x || 0), 0));
    const paidGrossTotal = round2(paidItems.reduce((s, x) => s + (x.reimbursement ? 0 : Number(x.amount || 0)), 0));
    const paidAllowancesTotal = round2(paidItems.filter(x => x.code !== 'BASE_PAY').reduce((s, x) => s + Number(x.amount || 0), 0));
    const payoutPreview = round2(gross.gesamt - totalDeductions);

    return { month, earnedItems, paidItems, gross, paidGrossTotal, paidAllowancesTotal, kvbbgUmlage, kvbbgZusatz, estimatedDeductions: estimated, deductions, totalDeductions, deductionMode, payoutPreview, statement };
  }

  function ensureEntry(date) {
    if (!state.dayEntries[date]) {
      const template = getTemplateForDate(date);
      state.dayEntries[date] = {
        date,
        plannedType: template.templateType,
        status: template.templateType === 'frv' ? 'open' : 'planned',
        actualType: template.templateType === 'frv' ? 'frv_open' : template.templateType,
        serviceNumber: template.serviceNumber || '',
        startTime: template.defaultStartTime || '',
        endTime: template.defaultEndTime || '',
        breakMinutes: Number(template.defaultBreakMinutes || 0),
        frvMinutes: Number(state.settings.frvPlaceholderMinutes || 468),
        isFahrdienst: state.settings.isFahrdienst,
        isHoliday: isBrandenburgHoliday(date),
        isVorfesttag: false,
        isSplitShift: false,
        isVacation: template.templateType === 'vacation',
        isSick: template.templateType === 'sick',
        isBetriebsversammlung: false,
        isVoluntarySwap: false,
        isFinal: false,
        orderedOvertimeHours: 0,
        factorValue: 0,
        vacationDays: template.templateType === 'vacation' ? 1 : 0,
        sickDays: template.templateType === 'sick' ? 1 : 0,
        parts: [],
        notes: '',
        betriebsversammlungTravelAmount: 0
      };
    }
    return state.dayEntries[date];
  }

  function startOfIsoWeek(dateObj) {
    const d = new Date(dateObj);
    const day = (d.getDay() + 6) % 7;
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - day);
    return d;
  }

  function getRotationWeekNumberForDate(date) {
    const actual = new Date(date + 'T00:00:00');
    const anchorDate = state.settings.currentRotationAnchorDate || currentDate();
    const anchorWeek = Math.min(40, Math.max(1, Number(state.settings.currentRotationWeek || 1)));
    const actualWeekStart = startOfIsoWeek(actual);
    const anchorWeekStart = startOfIsoWeek(new Date(anchorDate + 'T00:00:00'));
    const diffWeeks = Math.round((actualWeekStart - anchorWeekStart) / 604800000);
    return (((anchorWeek - 1) + diffWeeks) % 40 + 40) % 40 + 1;
  }

  function getTemplateForDate(date) {
    const actual = new Date(date + 'T00:00:00');
    const weekNumber = getRotationWeekNumberForDate(date);
    const weekIndex = weekNumber - 1;
    const weekday = (actual.getDay() + 6) % 7;
    return state.rotationWeeks[weekIndex].days[weekday];
  }

  function isPlannedWorkingDay(date) {
    const template = getTemplateForDate(date);
    return !!template && template.templateType !== 'free';
  }


  function buildTemplateDayEntry(date) {
    const template = getTemplateForDate(date);
    if (!template) return null;
    return {
      date,
      plannedType: template.templateType,
      status: template.templateType === 'frv' ? 'open' : 'planned',
      actualType: template.templateType === 'frv' ? 'frv_open' : template.templateType,
      serviceNumber: template.serviceNumber || '',
      startTime: template.defaultStartTime || '',
      endTime: template.defaultEndTime || '',
      breakMinutes: Number(template.defaultBreakMinutes || 0),
      frvMinutes: Number(state.settings.frvPlaceholderMinutes || 468),
      paidMinutes: Number(template.defaultPaidMinutes || 0),
      usesTemplatePaidMinutes: true,
      isFahrdienst: state.settings.isFahrdienst,
      isHoliday: isBrandenburgHoliday(date),
      isVorfesttag: false,
      isSplitShift: false,
      isVacation: false,
      isSick: false,
      isBetriebsversammlung: false,
      isVoluntarySwap: false,
      isFinal: false,
      orderedOvertimeHours: 0,
      factorValue: 0,
      vacationDays: 0,
      sickDays: 0,
      parts: [],
      notes: template.notes || '',
      betriebsversammlungTravelAmount: 0
    };
  }

  function getPayrollSourceEntry(date) {
    const saved = state.dayEntries[date];
    const template = getTemplateForDate(date);
    const templateEntry = template ? buildTemplateDayEntry(date) : null;

    if (saved) {
      // FRV ohne echten zugeteilten Dienst zählt noch nicht für die Lohnberechnung.
      if (
        saved.actualType === 'frv_open' &&
        !saved.isVacation &&
        !saved.isSick &&
        !saved.isBetriebsversammlung &&
        !(saved.isSplitShift || saved.actualType === 'split_shift') &&
        !(saved.startTime && saved.endTime)
      ) {
        return null;
      }

      const merged = { ...(templateEntry || {}), ...saved, payrollSource: 'tage' };

      // Wenn ein fester Umlaufdienst nur als Feiertag/Abweichung markiert wurde,
      // aber keine neuen Zeiten eingetragen sind, bleiben die Umlaufzeiten die Grundlage.
      if (templateEntry) {
        if (!saved.serviceNumber) merged.serviceNumber = templateEntry.serviceNumber || '';
        if (!saved.startTime) merged.startTime = templateEntry.startTime || '';
        if (!saved.endTime) merged.endTime = templateEntry.endTime || '';
        if (saved.breakMinutes == null || saved.breakMinutes === '') merged.breakMinutes = templateEntry.breakMinutes || 0;
        const savedHasTimes = !!(saved.startTime && saved.endTime);
        const savedMatchesTemplateTimes = savedHasTimes &&
          saved.startTime === (templateEntry.startTime || '') &&
          saved.endTime === (templateEntry.endTime || '') &&
          Number(saved.breakMinutes || 0) === Number(templateEntry.breakMinutes || 0);
        const isRealFrvAssignment = template?.templateType === 'frv' || saved.plannedType === 'frv' || saved.actualType === 'frv_assigned';
        if (saved.paidMinutes == null && templateEntry.paidMinutes != null && !isRealFrvAssignment && (!savedHasTimes || savedMatchesTemplateTimes)) {
          merged.paidMinutes = templateEntry.paidMinutes;
          merged.usesTemplatePaidMinutes = true;
        } else if (saved.paidMinutes == null) {
          merged.usesTemplatePaidMinutes = false;
        }
        if (!saved.notes) merged.notes = templateEntry.notes || '';
        if (saved.isFahrdienst == null) merged.isFahrdienst = templateEntry.isFahrdienst;
      }

      return merged;
    }

    // Nur feste Dienste aus dem Umlauf sind direkte Lohnbasis.
    if (!template || template.templateType !== 'fixed') return null;
    return { ...buildTemplateDayEntry(date), payrollSource: 'umlauf' };
  }

  function renderAll() {
    renderAppVersion();
    renderOverview();
    renderRotation();
    renderDayForm();
    renderPayroll();
    renderStatements();
    renderCommute();
    renderYear();
    renderSettings();
  }

  function setSelectedMonthPill(month) {
    document.getElementById('selectedMonthPill').textContent = formatMonth(month);
  }

  function renderOverview() {
    const monthInput = document.getElementById('overviewMonth');
    if (!monthInput.value) monthInput.value = currentMonth();
    const month = monthInput.value;
    setSelectedMonthPill(month);
    const payroll = calculatePayroll(month);
    const next = Object.keys(state.dayEntries).filter(d => d >= currentDate()).sort()[0];
    document.getElementById('metricNextDuty').textContent = next ? formatDateLong(next) : '—';
    document.getElementById('metricNextDutySub').textContent = next ? describeEntry(state.dayEntries[next]) : 'Keine Einträge';
    const openFrv = Object.values(state.dayEntries).filter(x => x.date.startsWith(month) && x.actualType === 'frv_open').length;
    document.getElementById('metricOpenFrv').textContent = String(openFrv);
    document.getElementById('metricPayout').textContent = euro(payroll.payoutPreview);
    document.getElementById('metricEarned').textContent = euro(payroll.earnedItems.reduce((s,x)=>s+x.amount,0));
    const summary = document.getElementById('overviewSummary');
    summary.innerHTML = '';
    [
      ['Fixer Monatslohn', euro(state.settings.fixedMonthlyBasePay)],
      ['Heute berechnete Umlaufwoche', `Woche ${getRotationWeekNumberForDate(currentDate())}`],
      ['Umlauf-Anker', `${state.settings.currentRotationAnchorDate || currentDate()} = Woche ${state.settings.currentRotationWeek || 1}`],
      ['Erarbeitet im Monat', euro(payroll.earnedItems.reduce((s,x)=>s+x.amount,0))],
      ['Aus Vormonat ausgezahlt', euro(payroll.paidItems.filter(x=>x.code!=='BASE_PAY').reduce((s,x)=>s+x.amount,0))],
      ['Gesamtbrutto', euro(payroll.gross.gesamt)],
      ['Steuerbrutto', euro(payroll.gross.steuer)],
      ['SV-Brutto', euro(payroll.gross.sv)],
      ['ZV-Brutto', euro(payroll.gross.zv)],
      ['Abzüge gesamt', euro(payroll.totalDeductions)],
      ['Berechnungsmodus', payroll.deductionMode]
    ].forEach(([a,b])=>summary.appendChild(dataRow(a,b)));
    const warnings = document.getElementById('overviewWarnings'); warnings.innerHTML='';
    const list = [];
    if (openFrv) list.push(`${openFrv} offene FRV-Tage im Monat ${formatMonth(month)}.`);
    if (!state.settings.homeAddress) list.push('Wohnadresse noch nicht hinterlegt.');
    if (!(state.commuteMonths?.[month] || {}).distanceKmOneWay && !state.settings.distanceKmOneWay) list.push('Entfernung zum Betriebshof noch nicht gesetzt.');
    if (!Object.keys(state.dayEntries).length) list.push('Noch keine Tagesdaten erfasst.');
    if (!list.length) list.push('Keine offenen Warnungen.');
    list.forEach(text => { const li=document.createElement('li'); li.textContent=text; warnings.appendChild(li); });
  }

  function dataRow(label, value) {
    const div=document.createElement('div'); div.className='data-row'; div.innerHTML=`<span>${label}</span><strong>${value}</strong>`; return div;
  }

  
  function calculateRotationWeekTotals(week) {
    const totals = { paidMinutes: 0, fixedDays: 0, frvDays: 0, freeDays: 0 };
    (week?.days || []).forEach((day) => {
      const type = day.templateType || 'fixed';
      if (type === 'fixed') totals.fixedDays += 1;
      if (type === 'frv') totals.frvDays += 1;
      if (type === 'free') totals.freeDays += 1;
      totals.paidMinutes += Number(day.defaultPaidMinutes || 0);
    });
    return totals;
  }

  function renderRotationWeekTotals(week) {
    const el = document.getElementById('rotationWeekTotals');
    if (!el) return;
    const totals = calculateRotationWeekTotals(week);
    el.innerHTML = `
      <div class="totals-card">
        <span>Gesamtarbeitszeit der Woche</span>
        <strong>${formatMinutes(totals.paidMinutes)}</strong>
      </div>
      <div class="totals-card">
        <span>Feste Dienste</span>
        <strong>${totals.fixedDays}</strong>
      </div>
      <div class="totals-card">
        <span>FRV-Tage</span>
        <strong>${totals.frvDays}</strong>
      </div>
      <div class="totals-card">
        <span>Freie Tage</span>
        <strong>${totals.freeDays}</strong>
      </div>
    `;
  }

function renderRotation() {
    const select = document.getElementById('rotationWeekSelect');
    const currentSelect = document.getElementById('currentRotationWeekSelect');
    if (!select.options.length) {
      state.rotationWeeks.forEach(w => {
        const opt=document.createElement('option'); opt.value=String(w.weekNumber); opt.textContent=`Woche ${w.weekNumber}`; select.appendChild(opt);
      });
      select.value='1';
    }
    if (currentSelect && !currentSelect.options.length) {
      state.rotationWeeks.forEach(w => {
        const opt=document.createElement('option'); opt.value=String(w.weekNumber); opt.textContent=`Woche ${w.weekNumber}`; currentSelect.appendChild(opt);
      });
    }
    if (currentSelect) currentSelect.value = String(state.settings.currentRotationWeek || 1);
    const anchorInput = document.getElementById('currentRotationAnchorDate');
    if (anchorInput) anchorInput.value = state.settings.currentRotationAnchorDate || currentDate();
    const rotationInfo = document.getElementById('rotationReferenceInfo');
    if (rotationInfo) {
      const todayWeek = getRotationWeekNumberForDate(currentDate());
      rotationInfo.textContent = `Automatik aktiv: ${state.settings.currentRotationAnchorDate || currentDate()} = Woche ${state.settings.currentRotationWeek || 1}. Heute berechnet die App automatisch Woche ${todayWeek}; nach Woche 40 geht es wieder mit Woche 1 weiter.`;
    }
    const week = state.rotationWeeks[Number(select.value)-1];
    const tbody = document.getElementById('rotationTableBody'); tbody.innerHTML='';
    renderRotationWeekTotals(week);
    week.days.forEach((day, idx) => {
      const tr=document.createElement('tr');
      tr.innerHTML=`
        <td>${day.weekdayName}</td>
        <td><input type="text" data-field="serviceNumber" data-idx="${idx}" value="${escapeHtml(day.serviceNumber||'')}" placeholder="4011" /></td>
        <td><select data-field="templateType" data-idx="${idx}">${TEMPLATE_TYPES.map(t=>`<option value="${t}" ${day.templateType===t?'selected':''}>${templateLabel(t)}</option>`).join('')}</select></td>
        <td><input type="time" data-field="defaultStartTime" data-idx="${idx}" value="${day.defaultStartTime||''}" /></td>
        <td><input type="time" data-field="defaultEndTime" data-idx="${idx}" value="${day.defaultEndTime||''}" /></td>
        <td><select data-field="defaultBreakMinutes" data-idx="${idx}">${[0,30,40].map(n=>`<option value="${n}" ${Number(day.defaultBreakMinutes||0)===n?'selected':''}>${n} Min</option>`).join('')}</select></td>
        <td>
          <div class="paid-cell">
            <input type="text" data-field="defaultPaidDisplay" data-idx="${idx}" value="${formatMinutes(day.defaultPaidMinutes||0)}" placeholder="7:48" />
            <label class="mini-check"><input type="checkbox" data-field="defaultPaidAuto" data-idx="${idx}" ${day.defaultPaidMode !== 'manual' ? 'checked' : ''} /> Auto</label>
          </div>
        </td>
        <td><input type="text" data-field="notes" data-idx="${idx}" value="${escapeHtml(day.notes||'')}" /></td>
        <td><button type="button" class="secondary copy-day-template" data-idx="${idx}">Auf Tage übernehmen</button></td>`;
      tbody.appendChild(tr);
    });
  }

  function renderDayForm() {
    fillSelect('plannedType', TEMPLATE_TYPES, TEMPLATE_TYPES.map(templateLabel));
    fillSelect('dayStatus', STATUSES, STATUSES.map(statusLabel));
    fillSelect('actualType', ACTUAL_TYPES, ACTUAL_TYPES.map(actualLabel));
    fillSelect('dayBreak', [0,30,40], ['0 Min','30 Min','40 Min']);
    const dateInput = document.getElementById('dayDate');
    if (!dateInput.value) dateInput.value = currentDate();
    const dayMonthInput = document.getElementById('daysMonth');
    if (dayMonthInput && !dayMonthInput.value) dayMonthInput.value = dateToMonth(dateInput.value);
    const entry = ensureEntry(dateInput.value);
    const holidayName = getHolidayName(entry.date);
    if (holidayName && !entry.isHoliday) {
      entry.isHoliday = true;
      saveState();
    }
    document.getElementById('plannedType').value = entry.plannedType || 'fixed';
    document.getElementById('dayStatus').value = entry.status || 'planned';
    document.getElementById('actualType').value = entry.actualType || 'fixed';
    document.getElementById('dayServiceNumber').value = entry.serviceNumber || '';
    document.getElementById('dayStart').value = entry.startTime || '';
    document.getElementById('dayEnd').value = entry.endTime || '';
    document.getElementById('dayBreak').value = String(entry.breakMinutes || 0);
    document.getElementById('frvMinutes').value = formatMinutes(entry.frvMinutes || state.settings.frvPlaceholderMinutes);
    document.getElementById('orderedOvertimeHours').value = String(entry.orderedOvertimeHours || 0);
    document.getElementById('dayFactor').value = String(entry.factorValue || 0);
    document.getElementById('dayVacationDays').value = String(entry.vacationDays || 0);
    document.getElementById('daySickDays').value = String(entry.sickDays || 0);
    document.getElementById('dayRangeFrom').value = entry.rangeFrom || entry.date;
    document.getElementById('dayRangeTo').value = entry.rangeTo || entry.date;
    document.getElementById('dayBvTravel').value = String(entry.betriebsversammlungTravelAmount || 0);
    document.getElementById('dayNotes').value = entry.notes || '';
    document.getElementById('flagFahrdienst').checked = !!entry.isFahrdienst;
    document.getElementById('flagHoliday').checked = holidayName ? true : !!entry.isHoliday;
    document.getElementById('flagVorfesttag').checked = !!entry.isVorfesttag;
    document.getElementById('flagSplit').checked = !!entry.isSplitShift;
    document.getElementById('flagVacation').checked = !!entry.isVacation;
    document.getElementById('flagSick').checked = !!entry.isSick;
    document.getElementById('flagBv').checked = !!entry.isBetriebsversammlung;
    document.getElementById('flagSwap').checked = !!entry.isVoluntarySwap;
    document.getElementById('flagFinal').checked = !!entry.isFinal;
    const holidayInfo = document.getElementById('dayHolidayInfo');
    if (holidayInfo) {
      if (holidayName) {
        holidayInfo.style.display = 'inline-flex';
        holidayInfo.textContent = `Gesetzlicher Feiertag in Brandenburg: ${holidayName}`;
      } else {
        holidayInfo.style.display = 'none';
        holidayInfo.textContent = '';
      }
    }
    renderSplitParts(entry.parts || []);
    syncDayPaidPreview();
    renderDaysCalendar();
    const preview = document.getElementById('dayPreview'); preview.innerHTML='';
    const paidMinutes = calculatePaidMinutes(entry);
    [
      ['Datum', formatDateLong(entry.date)],
      ['Berechnete Umlaufwoche', `Woche ${getRotationWeekNumberForDate(entry.date)}`],
      ['Dienstnummer', entry.serviceNumber || '—'],
      ['Geplant', templateLabel(entry.plannedType)],
      ['Tatsächlich', actualLabel(entry.actualType)],
      ['Bezahlte Zeit', formatMinutes(paidMinutes)],
      ['Nachtstunden', fixed2(eligibleHoursNight(entry))],
      ['Sonntagsstunden', fixed2(eligibleHoursSunday(entry))],
      ['Samstagsstunden ab 13 Uhr', fixed2(eligibleHoursSaturday(entry))],
      ['Feiertag', holidayName ? holidayName : (entry.isHoliday ? 'Ja' : 'Nein')],
      ['Vorfesttag', entry.isVorfesttag ? 'Ja' : 'Nein'],
      ['Zeitraum', (entry.rangeFrom || entry.date) + ((entry.rangeTo || entry.date) !== (entry.rangeFrom || entry.date) ? ' bis ' + (entry.rangeTo || entry.date) : '')]
    ].forEach(([a,b])=>preview.appendChild(dataRow(a,b)));
  }

  function renderDaysCalendar() {
    const monthInput = document.getElementById('daysMonth');
    const calendar = document.getElementById('daysCalendar');
    const selectedDate = document.getElementById('dayDate')?.value || currentDate();
    if (!monthInput || !calendar) return;
    if (!monthInput.value) monthInput.value = dateToMonth(selectedDate);
    const month = monthInput.value;
    const first = monthStart(month);
    const last = monthEnd(month);
    const firstWeekday = (first.getDay() + 6) % 7;
    const headers = WEEKDAYS.map(day => `<div>${day.slice(0,2)}</div>`).join('');
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push('<div class="calendar-empty"></div>');
    for (let day = 1; day <= last.getDate(); day++) {
      const iso = formatIsoDate(first.getFullYear(), first.getMonth() + 1, day);
      const holidayName = getHolidayName(iso);
      const entry = state.dayEntries[iso];
      const plannedTemplate = getTemplateForDate(iso);
      const typeLabel = entry ? actualLabel(entry.actualType || entry.plannedType) : templateLabel(plannedTemplate.templateType);
      const service = entry?.serviceNumber || plannedTemplate.serviceNumber || '';
      const note = holidayName || service || '';
      const classes = ['calendar-day'];
      if (iso === selectedDate) classes.push('selected');
      if (iso === currentDate()) classes.push('today');
      if (holidayName) classes.push('holiday');
      cells.push(`
        <button type="button" class="${classes.join(' ')}" data-calendar-date="${iso}">
          <div class="calendar-day-top">
            <span class="calendar-day-number">${day}</span>
            ${service ? `<span class="calendar-day-service">${escapeHtml(service)}</span>` : ''}
          </div>
          <div class="calendar-day-type">${escapeHtml(typeLabel)}</div>
          ${holidayName ? `<span class="holiday-tag">${escapeHtml(holidayName)}</span>` : ''}
          ${!holidayName && service ? `<div class="calendar-day-note">Dienst ${escapeHtml(service)}</div>` : ''}
        </button>`);
    }
    calendar.innerHTML = `
      <div class="month-calendar">
        <div class="month-calendar-head">${headers}</div>
        <div class="month-calendar-grid">${cells.join('')}</div>
      </div>`;
  }

  function selectCalendarDate(dateStr) {
    const dateInput = document.getElementById('dayDate');
    const monthInput = document.getElementById('daysMonth');
    if (dateInput) dateInput.value = dateStr;
    if (monthInput) monthInput.value = dateToMonth(dateStr);
    renderDayForm();
  }

  function renderSplitParts(parts) {
    const wrap = document.getElementById('splitPartsContainer'); wrap.innerHTML='';
    (parts || []).forEach((p, idx) => {
      const row=document.createElement('div'); row.className='split-part';
      row.innerHTML=`
        <label>Teil ${idx+1} Beginn<input type="time" class="split-start" data-idx="${idx}" value="${p.startTime||''}" /></label>
        <label>Teil ${idx+1} Ende<input type="time" class="split-end" data-idx="${idx}" value="${p.endTime||''}" /></label>
        <label>Pause<input type="number" class="split-break" data-idx="${idx}" value="${p.breakMinutes||0}" /></label>
        <button type="button" class="danger split-remove" data-idx="${idx}">Löschen</button>`;
      wrap.appendChild(row);
    });
  }

  function monthDateRange(month) {
    const lastDate = new Date(Number(month.slice(0,4)), Number(month.slice(5,7)), 0).getDate();
    const dates = [];
    for (let day = 1; day <= lastDate; day += 1) {
      dates.push(`${month}-${String(day).padStart(2,'0')}`);
    }
    return dates;
  }

  function monthDateRangeForIcs(month) {
    const today = currentDate();
    const lastDate = new Date(Number(month.slice(0,4)), Number(month.slice(5,7)), 0).getDate();
    let startDay = 1;
    if (month === today.slice(0,7)) startDay = Number(today.slice(8,10)) + 1;
    const dates = [];
    for (let day = startDay; day <= lastDate; day += 1) {
      dates.push(`${month}-${String(day).padStart(2,'0')}`);
    }
    return dates;
  }

  function buildTemplateExportEntry(date) {
    const template = getTemplateForDate(date);
    if (!template) return null;
    return {
      date,
      plannedType: template.templateType,
      actualType: template.templateType === 'frv' ? 'frv_open' : template.templateType,
      serviceNumber: template.serviceNumber || '',
      startTime: template.defaultStartTime || '',
      endTime: template.defaultEndTime || '',
      breakMinutes: Number(template.defaultBreakMinutes || 0),
      frvMinutes: Number(state.settings.frvPlaceholderMinutes || 468),
      isFahrdienst: state.settings.isFahrdienst,
      isHoliday: isBrandenburgHoliday(date),
      isVorfesttag: false,
      isSplitShift: false,
      isVacation: false,
      isSick: false,
      isBetriebsversammlung: false,
      notes: template.notes || ''
    };
  }

  function buildCalendarExportEntries(month) {
    const dates = monthDateRangeForIcs(month);
    const entries = [];
    dates.forEach((date) => {
      const template = getTemplateForDate(date);
      if (!template) return;
      const type = template.templateType || 'fixed';
      const serviceNumber = (template.serviceNumber || '').trim();
      const notes = template.notes || '';
      if (type === 'free') {
        entries.push({ type:'allDay', date, title:'Frei', description: notes || '', location:'' });
        return;
      }
      if (type === 'frv') {
        entries.push({ type:'allDay', date, title:'FRV', description: notes || '', location:'' });
        return;
      }
      const startTime = template.defaultStartTime || '';
      const endTime = template.defaultEndTime || '';
      const breakMinutes = Number(template.defaultBreakMinutes || 0);
      const paidMinutes = calculateTemplatePaidMinutes(template);
      const title = serviceNumber ? `Arbeit Dienst ${serviceNumber}` : 'Arbeit Dienst';
      const descriptionLines = [];
      if (serviceNumber) descriptionLines.push(`Dienstnummer: ${serviceNumber}`);
      if (startTime && endTime) descriptionLines.push(`Zeit: ${startTime}–${endTime}`);
      if (breakMinutes > 0) descriptionLines.push(`Pause: ${breakMinutes} Minuten`);
      if (paidMinutes > 0) descriptionLines.push(`Bezahlte Zeit: ${formatMinutes(paidMinutes)}`);
      if (notes) descriptionLines.push(`Notiz: ${notes}`);
      if (startTime && endTime) {
        entries.push({ type:'timed', date, startTime, endTime, title, description: descriptionLines.join('\\n'), location: state.settings.depotAddress || '' });
      } else {
        entries.push({ type:'allDay', date, title, description: descriptionLines.join('\n'), location:'' });
      }
    });
    return entries;
  }

  function calendarEntriesForDay(entry) {
    if (!entry) return [];
    if (entry.actualType === 'free' || entry.plannedType === 'free') {
      return [{ type:'allDay', date: entry.date, title:'Frei', description: buildCalendarDescription(entry), location: '' }];
    }
    if (entry.isVacation || entry.actualType === 'vacation') {
      return [{ type:'allDay', date: entry.date, title:'Urlaub', description: buildCalendarDescription(entry), location: '' }];
    }
    if (entry.isSick || entry.actualType === 'sick') {
      return [{ type:'allDay', date: entry.date, title:'Krank', description: buildCalendarDescription(entry), location: '' }];
    }
    if (entry.actualType === 'frv_open' || entry.plannedType === 'frv') {
      return [{ type:'allDay', date: entry.date, title:'FRV', description: buildCalendarDescription(entry), location: '' }];
    }
    if (entry.isSplitShift || entry.actualType === 'split_shift') {
      const parts = (entry.parts || []).filter(p => p.startTime && p.endTime);
      if (!parts.length) return [];
      return parts.map((part, idx) => ({
        type:'timed',
        date: entry.date,
        startTime: part.startTime,
        endTime: part.endTime,
        title: buildCalendarTitle(entry, `Teil ${idx+1}`),
        description: buildCalendarDescription(entry, part, idx+1),
        location: state.settings.depotAddress || ''
      }));
    }
    if (entry.startTime && entry.endTime) {
      return [{
        type:'timed',
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        title: buildCalendarTitle(entry),
        description: buildCalendarDescription(entry),
        location: state.settings.depotAddress || ''
      }];
    }
    return [];
  }

  function buildCalendarTitle(entry, suffix='') {
    const service = entry.serviceNumber ? ` ${entry.serviceNumber}` : '';
    let base = 'Arbeit Dienst';
    if (entry.isBetriebsversammlung || entry.actualType === 'betriebsversammlung') base = 'Arbeit Betriebsversammlung';
    else if (entry.isHoliday || entry.actualType === 'holiday_work') base = 'Arbeit Feiertagsdienst';
    else if (entry.isVorfesttag) base = 'Arbeit Vorfesttag';
    else if (entry.actualType === 'frv_assigned') base = 'Arbeit Dienst';
    else if (entry.isSplitShift || entry.actualType === 'split_shift') base = 'Arbeit Dienst';
    return `${base}${service}${suffix ? ' · ' + suffix : ''}`.trim();
  }

  function buildCalendarDescription(entry, part=null, partNumber=null) {
    const lines = [];
    if (entry.serviceNumber) lines.push(`Dienstnummer: ${entry.serviceNumber}`);
    if (part && part.startTime && part.endTime) lines.push(`Dienstteil ${partNumber}: ${part.startTime}–${part.endTime}`);
    else if (entry.startTime && entry.endTime) lines.push(`Zeit: ${entry.startTime}–${entry.endTime}`);
    if (entry.breakMinutes != null && entry.breakMinutes !== '') lines.push(`Pause: ${entry.breakMinutes} Minuten`);
    const paid = calculatePaidMinutes(entry);
    if (paid > 0) lines.push(`Bezahlte Zeit: ${formatMinutes(paid)}`);
    if (entry.isFahrdienst) lines.push('Fahrdienst');
    if (entry.isHoliday) lines.push('Feiertag');
    if (entry.isVorfesttag) lines.push('Vorfesttag');
    if (entry.isBetriebsversammlung) lines.push('Betriebsversammlung');
    if (entry.notes) lines.push(`Notiz: ${entry.notes}`);
    return lines.join('\n');
  }

  function icsEscape(value) {
    return String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  }

  function toIcsDate(dateStr) {
    return String(dateStr || '').replace(/-/g, '');
  }

  function addDaysIso(dateStr, days) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function toIcsDateTime(dateStr, timeStr) {
    return `${toIcsDate(dateStr)}T${String(timeStr || '00:00').replace(':','')}00`;
  }

  function buildMonthIcs(month) {
    const entries = buildCalendarExportEntries(month);
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ChatGPT//Dienstplanung und Gehalt//DE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-TIMEZONE:Europe/Berlin',
      `X-WR-CALNAME:${icsEscape(state.settings.calendarName || 'Arbeit')}`,
      'BEGIN:VTIMEZONE',
      'TZID:Europe/Berlin',
      'X-LIC-LOCATION:Europe/Berlin',
      'BEGIN:DAYLIGHT',
      'TZOFFSETFROM:+0100',
      'TZOFFSETTO:+0200',
      'TZNAME:CEST',
      'DTSTART:19700329T020000',
      'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
      'END:DAYLIGHT',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+0200',
      'TZOFFSETTO:+0100',
      'TZNAME:CET',
      'DTSTART:19701025T030000',
      'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
      'END:STANDARD',
      'END:VTIMEZONE'
    ];
    const stamp = new Date();
    const dtstamp = `${stamp.getUTCFullYear()}${String(stamp.getUTCMonth()+1).padStart(2,'0')}${String(stamp.getUTCDate()).padStart(2,'0')}T${String(stamp.getUTCHours()).padStart(2,'0')}${String(stamp.getUTCMinutes()).padStart(2,'0')}${String(stamp.getUTCSeconds()).padStart(2,'0')}Z`;

    entries.forEach((entry, idx) => {
      lines.push('BEGIN:VEVENT');
      const uidBase = `${entry.date}-${entry.type}-${idx}`;
      lines.push(`UID:${icsEscape(uidBase)}@dienstplanung-gehalt`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push('SEQUENCE:0');
      lines.push('STATUS:CONFIRMED');
      if (entry.type === 'allDay') {
        lines.push(`DTSTART;VALUE=DATE:${toIcsDate(entry.date)}`);
        lines.push(`DTEND;VALUE=DATE:${toIcsDate(addDaysIso(entry.date, 1))}`);
      } else {
        lines.push(`DTSTART;TZID=Europe/Berlin:${toIcsDateTime(entry.date, entry.startTime)}`);
        lines.push(`DTEND;TZID=Europe/Berlin:${toIcsDateTime(entry.date, entry.endTime)}`);
        lines.push('TRANSP:OPAQUE');
        const reminder = Number(state.settings.reminderMinutes || 0);
        if (reminder > 0) {
          lines.push('BEGIN:VALARM');
          lines.push(`TRIGGER:-PT${Math.round(reminder)}M`);
          lines.push('ACTION:DISPLAY');
          lines.push(`DESCRIPTION:${icsEscape(entry.title)}`);
          lines.push('END:VALARM');
        }
      }
      lines.push(`SUMMARY:${icsEscape(entry.title)}`);
      if (entry.description) lines.push(`DESCRIPTION:${icsEscape(entry.description)}`);
      if (entry.location) lines.push(`LOCATION:${icsEscape(entry.location)}`);
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return { entries, content: lines.join('\r\n') };
  }

  function exportMonthIcs(monthOverride = '') {
    const payrollMonthInput = document.getElementById('payrollMonth');
    const daysMonthInput = document.getElementById('daysMonth');
    const month = monthOverride || (daysMonthInput && daysMonthInput.value) || (payrollMonthInput && payrollMonthInput.value) || currentMonth();
    const result = buildMonthIcs(month);
    if (!result.entries.length) {
      alert('Für diesen Monat konnten keine Kalendereinträge aus dem Umlauf ab morgen bis Monatsende erzeugt werden.');
      return;
    }
    const blob = new Blob([result.content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `umlauf-ab-morgen-${month}-v152.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function renderPayroll() {
    const input = document.getElementById('payrollMonth'); if (!input.value) input.value = currentMonth();
    const month = input.value; const payroll = calculatePayroll(month);
    document.getElementById('payrollBase').textContent = euro(state.settings.fixedMonthlyBasePay);
    document.getElementById('payrollEarned').textContent = euro(payroll.earnedItems.reduce((s,x)=>s+x.amount,0));
    document.getElementById('payrollPaid').textContent = euro(payroll.payoutPreview);
    renderItemTable(document.getElementById('earnedTable'), payroll.earnedItems);
    renderItemTable(document.getElementById('paidTable'), payroll.paidItems);
    const gross = document.getElementById('grossBuckets'); gross.innerHTML='';
    [['Gesamtbrutto', payroll.gross.gesamt],['Steuerbrutto', payroll.gross.steuer],['SV-Brutto', payroll.gross.sv],['ZV-Brutto', payroll.gross.zv]].forEach(([a,b])=>gross.appendChild(dataRow(a,euro(b))));
    const ded = document.getElementById('deductionsTable'); ded.innerHTML='';
    ded.appendChild(dataRow('Berechnungsmodus', payroll.deductionMode));
    [
      ['Lohnsteuer', payroll.deductions.lohnsteuer],
      ['Kirchensteuer', payroll.deductions.kirchensteuer],
      ['Soli', payroll.deductions.soli],
      ['KV', payroll.deductions.kv],
      ['RV', payroll.deductions.rv],
      ['AV', payroll.deductions.av],
      ['PV', payroll.deductions.pv],
      ['KVBbg Umlage', payroll.deductions.kvbbgUmlage],
      ['KVBbg Zusatz', payroll.deductions.kvbbgZusatz],
      ['Sonstige Abzüge', payroll.deductions.other],
      ['Abzüge gesamt', payroll.totalDeductions],
      ['Geschätzte Auszahlung', payroll.payoutPreview]
    ].forEach(([a,b])=>ded.appendChild(dataRow(a, typeof b === 'string' ? b : euro(b))));
    const notes = document.getElementById('payrollNotes'); notes.innerHTML='';
    notes.appendChild(dataRow('Monat', formatMonth(month)));
    notes.appendChild(dataRow('Vormonat für Zuschläge', formatMonth(prevMonth(month))));
    notes.appendChild(dataRow('Zuschläge/Zulagen aus Vormonat', euro(payroll.paidAllowancesTotal)));
    notes.appendChild(dataRow('Brutto vor Abzügen', euro(payroll.paidGrossTotal)));
    notes.appendChild(dataRow('Manuelle Lohnarten im Monat', String(manualLinesForPaidMonth(month).length)));
    const exportWrap = document.getElementById('calendarExportInfo');
    if (exportWrap) {
      const exportEntries = buildCalendarExportEntries(month);
      exportWrap.innerHTML = '';
      exportWrap.appendChild(dataRow('Export-Monat', formatMonth(month)));
      exportWrap.appendChild(dataRow('Einträge in der ICS-Datei', String(exportEntries.length)));
      exportWrap.appendChild(dataRow('Quelle', 'ICS: Umlauf ab morgen · Lohn: voller Monat'));
      if (!exportEntries.length) {
        const hint = document.createElement('div');
        hint.className = 'badge warning';
        hint.textContent = 'Für diesen Monat konnten aus dem Umlauf keine exportierbaren Einträge erzeugt werden.';
        exportWrap.appendChild(hint);
      }
    }
  }

  function renderItemTable(container, items) {
    container.innerHTML='';
    if (!items.length) { container.innerHTML='<p class="small-text">Keine Einträge.</p>'; return; }
    items.forEach(x => {
      const card=document.createElement('div'); card.className='item-card';
      const details = [];
      if (x.hours != null && Number(x.hours) > 0) details.push(`<div class="data-row"><span>Stunden</span><strong>${fixed2(x.hours)} Std.</strong></div>`);
      if (x.percent != null) details.push(`<div class="data-row"><span>Zuschlag</span><strong>${fixed2(x.percent)} %</strong></div>`);
      if (x.days != null && Number(x.days) > 0) details.push(`<div class="data-row"><span>Tage</span><strong>${fixed2(x.days)}</strong></div>`);
      if (x.factor != null && Number(x.factor) > 0) details.push(`<div class="data-row"><span>Faktor</span><strong>${fixed2(x.factor)}</strong></div>`);
      card.innerHTML=`<h4>${escapeHtml(x.label)}</h4>
        <div class="data-row"><span>Betrag</span><strong>${euro(x.amount)}</strong></div>
        ${details.join('')}
        <div class="data-row"><span>Erarbeitet</span><strong>${x.earnedMonth || '—'}</strong></div>
        <div class="data-row"><span>Ausgezahlt</span><strong>${x.paidMonth || '—'}</strong></div>
        <div class="data-row"><span>Brutto-Zuordnung</span><strong>${bruttoLabel(x.counts)}</strong></div>`;
      container.appendChild(card);
    });
  }
  function bruttoLabel(counts) {
    if (counts.reimbursement) return 'Erstattung';
    const arr=[]; if(counts.gesamt) arr.push('GE'); if(counts.steuer) arr.push('ST'); if(counts.sv) arr.push('SV'); if(counts.zv) arr.push('ZV'); return arr.join('/') || '—';
  }

  function renderStatements() {
    const monthInput = document.getElementById('statementMonth'); if (!monthInput.value) monthInput.value = currentMonth();
    const month = monthInput.value;
    const stmt = state.statements[month] || {};
    setVal('stmtGesamtBrutto', stmt.gesamtBrutto); setVal('stmtSteuerBrutto', stmt.steuerBrutto); setVal('stmtSvBrutto', stmt.svBrutto);
    setVal('stmtZvBrutto', stmt.zvBrutto); setVal('stmtPayout', stmt.payout); setVal('stmtTax', stmt.lohnsteuer); setVal('stmtKv', stmt.kv);
    setVal('stmtRv', stmt.rv); setVal('stmtAv', stmt.av); setVal('stmtPv', stmt.pv); setVal('stmtOther', stmt.other);
    document.getElementById('stmtCorrection').checked = !!stmt.isCorrection;
    document.getElementById('stmtNotes').value = stmt.notes || '';
    if (!document.getElementById('stmtLineMonth').value) document.getElementById('stmtLineMonth').value = month;
    if (!document.getElementById('stmtPaidMonth').value) document.getElementById('stmtPaidMonth').value = month;
    if (!document.getElementById('stmtEarnedMonth').value) document.getElementById('stmtEarnedMonth').value = prevMonth(month);
    fillSelect('stmtLineCategory', LINE_CATEGORIES, LINE_CATEGORIES.map(lineCategoryLabel));
    const list = document.getElementById('statementLinesList'); list.innerHTML='';
    state.statementLines.filter(x => x.paidMonth === month || x.earnedMonth === month).forEach((x, idx) => {
      const card=document.createElement('div'); card.className='item-card';
      card.innerHTML=`<h4>${escapeHtml(x.label)}</h4>
        <div class="data-row"><span>Betrag</span><strong>${euro(x.amount)}</strong></div>
        <div class="data-row"><span>Monat</span><strong>${x.paidMonth || x.month || '—'}</strong></div>
        <div class="data-row"><span>Zuordnung</span><strong>${[x.countsGesamt?'GE':'',x.countsSteuer?'ST':'',x.countsSv?'SV':'',x.countsZv?'ZV':''].filter(Boolean).join('/') || (x.isReimbursement?'Erstattung':'—')}</strong></div>
        <div class="inline-actions mt-16"><button type="button" class="danger delete-line" data-idx="${idx}">Löschen</button></div>`;
      list.appendChild(card);
    });
  }

  function renderCommute() {
    fillSelect('commuteVehicle', ['car','public','mixed'], ['Auto','ÖPNV','gemischt']);
    fillSelect('expenseCategory', EXPENSE_CATEGORIES, EXPENSE_CATEGORIES.map(expenseCategoryLabel));
    const monthInput = document.getElementById('commuteMonth'); if (!monthInput.value) monthInput.value = currentMonth();
    const month = monthInput.value;
    const item = state.commuteMonths[month] || {};
    setVal('commuteKm', item.distanceKmOneWay ?? state.settings.distanceKmOneWay ?? 0);
    setVal('commuteFullDays', item.daysFullCommute ?? countFullCommuteDays(month));
    setVal('commuteHalfDays', item.daysHalfCommute ?? 0);
    document.getElementById('commuteVehicle').value = item.vehicleType || 'car';
    document.getElementById('commuteNotes').value = item.notes || '';
    const km = Number(document.getElementById('commuteKm').value || 0);
    const full = Number(document.getElementById('commuteFullDays').value || 0);
    const half = Number(document.getElementById('commuteHalfDays').value || 0);
    const kmValue = round2(km * (full + half * 0.5));
    const allowance = round2(kmValue * 0.30);
    const summary = document.getElementById('commuteSummary'); summary.innerHTML='';
    [['Steuerlich relevante km', fixed2(kmValue)],['Entfernungspauschale (0,30 €)', euro(allowance)]].forEach(([a,b])=>summary.appendChild(dataRow(a,b)));
    const expenseList = document.getElementById('expenseList'); expenseList.innerHTML='';
    state.expenses.sort((a,b)=>a.date.localeCompare(b.date)).forEach((x, idx) => {
      const card=document.createElement('div'); card.className='item-card';
      card.innerHTML=`<h4>${escapeHtml(x.label)}</h4><div class="data-row"><span>Kategorie</span><strong>${escapeHtml(expenseCategoryLabel(x.category))}</strong></div><div class="data-row"><span>Datum</span><strong>${x.date}</strong></div><div class="data-row"><span>Betrag</span><strong>${euro(x.amount)}</strong></div><div class="inline-actions mt-16"><button type="button" class="danger delete-expense" data-idx="${idx}">Löschen</button></div>`;
      expenseList.appendChild(card);
    });
    const taxHints = document.getElementById('taxHints'); taxHints.innerHTML='';
    const totalExpenses = yearlyExpenses(new Date(month+'-01').getFullYear());
    const hints = [];
    if (totalExpenses < 1230) hints.push('Werbungskosten aktuell noch unter 1.230 € Pauschbetrag.');
    else hints.push('Werbungskosten liegen über 1.230 € Pauschbetrag.');
    if (!state.settings.homeAddress) hints.push('Wohnadresse fehlt noch.');
    hints.push('Betriebshof wird als Sammelpunkt / maßgeblicher Pendelpunkt geführt.');
    hints.forEach(t => { const p=document.createElement('div'); p.className='badge'; p.textContent=t; taxHints.appendChild(p); });
  }

  function countFullCommuteDays(month) {
    return Object.values(state.dayEntries).filter(x => x.date.startsWith(month) && !x.isVacation && !x.isSick && x.actualType !== 'free').length;
  }

  function renderYear() {
    const input = document.getElementById('yearInput'); if (!input.value) input.value = String(new Date().getFullYear());
    const year = Number(input.value);
    let gross=0, payout=0, commute=0;
    const rows=[];
    for (let m=1;m<=12;m++) {
      const month = `${year}-${String(m).padStart(2,'0')}`;
      const payroll = calculatePayroll(month);
      gross += payroll.gross.gesamt; payout += payroll.payoutPreview;
      const cm = state.commuteMonths[month] || {};
      const km = Number(cm.distanceKmOneWay ?? state.settings.distanceKmOneWay ?? 0) * (Number(cm.daysFullCommute||0) + Number(cm.daysHalfCommute||0)*0.5);
      const commuteAllowance = round2(km * 0.30); commute += commuteAllowance;
      const stmt = state.statements[month] || {};
      rows.push({ month, appPayout: payroll.payoutPreview, stmtPayout: Number(stmt.payout || 0), gross: payroll.gross.gesamt, stmtGross: Number(stmt.gesamtBrutto || 0), commuteAllowance });
    }
    document.getElementById('yearGross').textContent = euro(gross);
    document.getElementById('yearPayout').textContent = euro(payout);
    document.getElementById('yearExpenses').textContent = euro(yearlyExpenses(year));
    document.getElementById('yearCommute').textContent = euro(commute);
    const wrap=document.getElementById('yearTable'); wrap.innerHTML='';
    const table=document.createElement('div'); table.className='table-wrap';
    table.innerHTML = `<table><thead><tr><th>Monat</th><th>App Auszahlung</th><th>Ist Auszahlung</th><th>App Gesamtbrutto</th><th>Ist Gesamtbrutto</th><th>Entfernungspauschale</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${formatMonth(r.month)}</td><td>${euro(r.appPayout)}</td><td>${euro(r.stmtPayout)}</td><td>${euro(r.gross)}</td><td>${euro(r.stmtGross)}</td><td>${euro(r.commuteAllowance)}</td></tr>`).join('')}</tbody></table>`;
    wrap.appendChild(table);
  }

  function yearlyExpenses(year) {
    return round2(state.expenses.filter(x => new Date(x.date).getFullYear() === year).reduce((s,x)=>s+Number(x.amount||0),0));
  }


  function getTaxProfile(taxClass) {
    return TAX_CLASS_PROFILES[String(taxClass || '1')] || TAX_CLASS_PROFILES['1'];
  }
  function getHealthInsuranceProfile(key) {
    return HEALTH_INSURANCE_PROFILES.find(x => x.key === key) || HEALTH_INSURANCE_PROFILES[0];
  }
  function calculateHealthEmployeePercent(additionalPercent) {
    // Arbeitnehmeranteil KV = 7,3 % allgemeiner Anteil + halber kassenindividueller Zusatzbeitrag
    return round2(7.3 + (Number(additionalPercent || 0) / 2));
  }
  function applyTaxClassToFields() {
    const select = document.getElementById('setTaxClass');
    const taxInput = document.getElementById('setTaxPercent');
    if (!select || !taxInput) return;
    taxInput.value = fixed2(getTaxProfile(select.value).estimatedTaxPercent).replace(',', '.');
    refreshPayrollViews();
  }
  function applyHealthInsuranceToFields() {
    const select = document.getElementById('setHealthInsurance');
    const addInput = document.getElementById('setHealthAdditionalPercent');
    const healthInput = document.getElementById('setHealthPercent');
    if (!select || !addInput || !healthInput) return;
    const profile = getHealthInsuranceProfile(select.value);
    if (profile.additionalPercent != null) addInput.value = String(profile.additionalPercent);
    const additional = Number(addInput.value || 0);
    healthInput.value = String(calculateHealthEmployeePercent(additional));
    refreshPayrollViews();
  }

  function renderSettings() {
    fillSelect('setTaxClass', Object.keys(TAX_CLASS_PROFILES), Object.values(TAX_CLASS_PROFILES).map(x => 'Steuerklasse ' + x.label));
    fillSelect('setHealthInsurance', HEALTH_INSURANCE_PROFILES.map(x => x.key), HEALTH_INSURANCE_PROFILES.map(x => x.label));
    setVal('setTariffName', state.settings.tariffName);
    setVal('setGroup', state.settings.entgeltgruppe);
    setVal('setStep', state.settings.stufe);
    setVal('setWeeklyHours', state.settings.weeklyHoursContract);
    setVal('setCycleAvg', state.settings.weeklyHoursCycleAvg);
    setVal('setBasePay', state.settings.fixedMonthlyBasePay);
    setVal('setBaseRate', state.settings.baseHourRate);
    setVal('setBonusRate', state.settings.bonusHourRate);
    setVal('setFrvMinutes', formatMinutes(state.settings.frvPlaceholderMinutes));
    setVal('setKvbbgUmlage', state.settings.kvbbgUmlagePercent);
    setVal('setKvbbgZusatz', state.settings.kvbbgZusatzPercent);
    setVal('setTaxClass', state.settings.taxClass || '1');
    setVal('setTaxPercent', state.settings.estimatedTaxPercent);
    setVal('setHealthInsurance', state.settings.healthInsurance || 'custom');
    setVal('setHealthAdditionalPercent', state.settings.healthAdditionalPercent);
    setVal('setHealthPercent', state.settings.estimatedHealthPercent);
    setVal('setPensionPercent', state.settings.estimatedPensionPercent);
    setVal('setUnemploymentPercent', state.settings.estimatedUnemploymentPercent);
    setVal('setCarePercent', state.settings.estimatedCarePercent);
    setVal('setChurchPercent', state.settings.estimatedChurchPercent);
    setVal('setSoliPercent', state.settings.estimatedSoliPercent);
    const preferActual = document.getElementById('setPreferActualDeductions'); if (preferActual) preferActual.checked = !!state.settings.preferActualDeductions;
    setVal('setCalendarName', state.settings.calendarName);
    setVal('setReminder', state.settings.reminderMinutes);
    setVal('setHomeAddress', state.settings.homeAddress);
    setVal('setDepotAddress', state.settings.depotAddress);
  }

  function setVal(id, value) { const el=document.getElementById(id); if (!el) return; el.value = value ?? ''; }
  function fillSelect(id, values, labels) {
    const select=document.getElementById(id); if (select.dataset.ready==='1') return;
    select.innerHTML = values.map((v,i)=>`<option value="${v}">${labels[i] ?? v}</option>`).join('');
    select.dataset.ready='1';
  }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

  
  function refreshPayrollViews() {
    if (document.getElementById('tab-payroll')?.classList.contains('active')) renderPayroll();
    if (document.getElementById('tab-overview')?.classList.contains('active')) renderOverview();
    if (document.getElementById('tab-year')?.classList.contains('active')) renderYear();
  }

function bindEvents() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-btn');
      if (btn) {
        e.preventDefault();
        switchTab(btn.dataset.tab);
      }
    });
    document.getElementById('overviewMonth').addEventListener('change', renderOverview);
    document.getElementById('rotationWeekSelect').addEventListener('change', renderRotation);
    document.getElementById('currentRotationWeekSelect').addEventListener('change', saveCurrentRotationReference);
    document.getElementById('currentRotationAnchorDate').addEventListener('change', saveCurrentRotationReference);
    document.getElementById('saveCurrentRotationBtn').addEventListener('click', saveCurrentRotationReference);
    document.getElementById('rotationTableBody').addEventListener('input', onRotationTableInput);
    document.getElementById('rotationTableBody').addEventListener('change', onRotationTableInput);
    document.getElementById('rotationTableBody').addEventListener('click', onRotationTableClick);
    document.getElementById('copyWeekBtn').addEventListener('click', copyWeek);
    document.getElementById('dayDate').addEventListener('change', () => { const m = document.getElementById('daysMonth'); if (m) m.value = dateToMonth(document.getElementById('dayDate').value); renderDayForm(); });
    document.getElementById('daysMonth').addEventListener('change', renderDaysCalendar);
    document.getElementById('daysCalendar').addEventListener('click', (e) => { const btn = e.target.closest('[data-calendar-date]'); if (btn) selectCalendarDate(btn.dataset.calendarDate); });
    document.getElementById('dayForm').addEventListener('submit', saveDayForm);
    document.getElementById('dayForm').addEventListener('input', syncDayPaidPreview);
    document.getElementById('addSplitPartBtn').addEventListener('click', addSplitPart);
    document.getElementById('splitPartsContainer').addEventListener('click', onSplitClick);
    document.getElementById('splitPartsContainer').addEventListener('input', onSplitInput);
    document.getElementById('payrollMonth').addEventListener('change', renderPayroll);
    document.getElementById('exportMonthIcsBtn').addEventListener('click', () => exportMonthIcs());
    const exportDaysBtn = document.getElementById('exportDaysMonthIcsBtn'); if (exportDaysBtn) exportDaysBtn.addEventListener('click', () => exportMonthIcs(document.getElementById('daysMonth').value || currentMonth()));
    document.getElementById('statementMonth').addEventListener('change', renderStatements);
    document.getElementById('statementSummaryForm').addEventListener('submit', saveStatementSummary);
    document.getElementById('statementLineForm').addEventListener('submit', saveStatementLine);
    document.getElementById('statementLinesList').addEventListener('click', deleteStatementLine);
    document.getElementById('commuteMonth').addEventListener('change', renderCommute);
    document.getElementById('commuteForm').addEventListener('submit', saveCommuteMonth);
    document.getElementById('expenseForm').addEventListener('submit', saveExpense);
    document.getElementById('expenseList').addEventListener('click', deleteExpense);
    document.getElementById('yearInput').addEventListener('change', renderYear);
    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
    const taxClassSelect = document.getElementById('setTaxClass'); if (taxClassSelect) taxClassSelect.addEventListener('change', applyTaxClassToFields);
    const healthSelect = document.getElementById('setHealthInsurance'); if (healthSelect) healthSelect.addEventListener('change', applyHealthInsuranceToFields);
    const healthAdditional = document.getElementById('setHealthAdditionalPercent'); if (healthAdditional) healthAdditional.addEventListener('input', applyHealthInsuranceToFields);
    document.getElementById('loadDemoBtn').addEventListener('click', loadDemo);
    document.getElementById('exportBtn').addEventListener('click', exportBackup);
    document.getElementById('importFile').addEventListener('change', importBackup);
    document.getElementById('resetBtn').addEventListener('click', resetAll);
    const mobileToggle = document.getElementById('mobileMenuToggle');
    if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
    window.addEventListener('resize', handleResponsiveMenuState);
  }

  function toggleMobileMenu(forceOpen) {
    const sidebar = document.querySelector('.sidebar');
    const btn = document.getElementById('mobileMenuToggle');
    if (!sidebar || !btn) return;
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !sidebar.classList.contains('mobile-open');
    sidebar.classList.toggle('mobile-open', shouldOpen);
    btn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    btn.textContent = shouldOpen ? 'Menü schließen' : 'Menü';
  }

  function handleResponsiveMenuState() {
    if (window.innerWidth > 920) {
      const sidebar = document.querySelector('.sidebar');
      const btn = document.getElementById('mobileMenuToggle');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = 'Menü';
      }
    }
  }

  function switchTab(tab) {
    if (!tab) return;
    document.querySelectorAll('.nav-btn').forEach(x=>x.classList.toggle('active', x.dataset.tab===tab));
    document.querySelectorAll('.tab-panel').forEach(x=>x.classList.toggle('active', x.id===`tab-${tab}`));
    const titleMap = {
      overview:['Übersicht','Schneller Monatsblick, offene FRV-Tage und zentrale Warnungen.'],
      rotation:['Umlauf','40-Wochen-Vorlagen nur für feste Dienste, FRV und freie Tage. Urlaub, krank und anderes trägst du erst bei Tage ein.'],
      days:['Tage','Echte Dienste pro Datum erfassen und prüfen.'],
      payroll:['Lohn','Fixer Monatslohn, erarbeitete Zuschläge und KVBbg.'],
      statements:['Abrechnungen','Ist-Werte aus echten Abrechnungen und manuelle Lohnarten.'],
      commute:['Fahrten & Steuer','Fahrttage, Werbungskosten und einfache Hinweise.'],
      year:['Jahresauswertung','Plan/Ist-Vergleich über das komplette Jahr.'],
      settings:['Einstellungen','Tarifdaten, Adressen, FRV und Standardwerte.']
    };
    const meta = titleMap[tab] || ['Dienstplanung & Gehalt',''];
    document.getElementById('tabTitle').textContent = meta[0];
    document.getElementById('tabSubtitle').textContent = meta[1];
    if (tab === 'rotation') renderRotation();
    if (tab === 'days') renderDayForm();
    if (tab === 'payroll') renderPayroll();
    if (tab === 'statements') renderStatements();
    if (tab === 'commute') renderCommute();
    if (tab === 'year') renderYear();
    if (tab === 'settings') renderSettings();
    if (tab === 'overview') renderOverview();
    if (window.innerWidth <= 920) toggleMobileMenu(false);
  }

  function onRotationTableInput(e) {
    const target = e.target; if (!target.dataset.idx) return;
    const week = state.rotationWeeks[Number(document.getElementById('rotationWeekSelect').value)-1];
    const day = week.days[Number(target.dataset.idx)];
    const field = target.dataset.field;
    if (field === 'defaultPaidAuto') {
      day.defaultPaidMode = target.checked ? 'auto' : 'manual';
      if (target.checked) {
        day.defaultPaidMinutes = calculateTemplatePaidMinutes(day);
        renderRotation();
      }
      saveState();
      renderRotationWeekTotals(week);
      refreshPayrollViews();
      return;
    }
    if (field === 'defaultPaidDisplay') {
      const parsed = parseDurationMinutes(target.value);
      if (parsed != null) day.defaultPaidMinutes = parsed;
      day.defaultPaidMode = 'manual';
      const autoBox = target.closest('.paid-cell')?.querySelector('[data-field="defaultPaidAuto"]');
      if (autoBox) autoBox.checked = false;
      saveState();
      renderRotationWeekTotals(week);
      refreshPayrollViews();
      return;
    }
    day[field] = target.type === 'number' ? Number(target.value || 0) : target.value;
    if (day.defaultPaidMode !== 'manual' && ['templateType','defaultStartTime','defaultEndTime','defaultBreakMinutes'].includes(field)) {
      day.defaultPaidMinutes = calculateTemplatePaidMinutes(day);
      const paidInput = target.closest('tr')?.querySelector('[data-field="defaultPaidDisplay"]');
      if (paidInput) paidInput.value = formatMinutes(day.defaultPaidMinutes || 0);
    }
    saveState();
    renderRotationWeekTotals(week);
    refreshPayrollViews();
  }


  function onRotationTableClick(e) {
    const btn = e.target.closest('.copy-day-template');
    if (!btn) return;
    copyRotationDay(Number(btn.dataset.idx));
  }

  function copyRotationDay(sourceIdx) {
    const week = state.rotationWeeks[Number(document.getElementById('rotationWeekSelect').value)-1];
    const source = week.days[sourceIdx];
    const raw = prompt(`Auf welche Tage übernehmen?\nBeispiele: Di,Mi,Do oder 2,3,4`, '');
    if (!raw) return;
    const targets = parseWeekdayTargets(raw, sourceIdx);
    if (!targets.length) {
      alert('Keine gültigen Zieltage erkannt. Erlaubt sind Mo, Di, Mi, Do, Fr, Sa, So oder 1-7.');
      return;
    }
    targets.forEach(idx => {
      const target = week.days[idx];
      week.days[idx] = {
        ...target,
        templateType: source.templateType,
        defaultStartTime: source.defaultStartTime,
        defaultEndTime: source.defaultEndTime,
        defaultBreakMinutes: source.defaultBreakMinutes,
        defaultPaidMinutes: source.defaultPaidMinutes,
        serviceNumber: source.serviceNumber || '',
        notes: source.notes || ''
      };
    });
    saveState();
    renderRotation();
    refreshPayrollViews();
  }

  function parseWeekdayTargets(raw, sourceIdx) {
    const map = { mo:0, montag:0, 1:0, di:1, dienstag:1, 2:1, mi:2, mittwoch:2, 3:2, do:3, donnerstag:3, 4:3, fr:4, freitag:4, 5:4, sa:5, samstag:5, 6:5, so:6, sonntag:6, 7:6 };
    return [...new Set(String(raw).split(/[;,\s]+/).map(x => map[x.trim().toLowerCase()]).filter(x => Number.isInteger(x) && x !== sourceIdx))];
  }

  function copyWeek() {
    const current = Number(document.getElementById('rotationWeekSelect').value);
    const to = Number(prompt('Auf welche Woche kopieren? (1-40)', String(Math.min(40, current+1))));
    if (!to || to < 1 || to > 40 || to === current) return;
    state.rotationWeeks[to-1].days = JSON.parse(JSON.stringify(state.rotationWeeks[current-1].days));
    saveState(); renderRotation();
  }

  function saveCurrentRotationReference() {
    const weekSelect = document.getElementById('currentRotationWeekSelect');
    const anchorInput = document.getElementById('currentRotationAnchorDate');
    state.settings.currentRotationWeek = Math.min(40, Math.max(1, Number(weekSelect?.value || 1)));
    state.settings.currentRotationAnchorDate = anchorInput?.value || currentDate();
    saveState();
    renderOverview();
    renderRotation();
    if (document.getElementById('dayDate')?.value) renderDayForm();
  }

  function dateRangeInclusive(from, to) {
    const start = new Date(from + 'T00:00:00');
    const end = new Date(to + 'T00:00:00');
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
    const realStart = start <= end ? start : end;
    const realEnd = start <= end ? end : start;
    const dates = [];
    const cursor = new Date(realStart);
    while (cursor <= realEnd) {
      dates.push(formatIsoDate(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate()));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  function applyAbsenceRange(mode, rangeFrom, rangeTo, baseValues) {
    const dates = dateRangeInclusive(rangeFrom, rangeTo);
    dates.forEach((date) => {
      const entry = ensureEntry(date);
      entry.status = baseValues.status;
      entry.factorValue = baseValues.factorValue;
      entry.notes = baseValues.notes;
      entry.isFinal = baseValues.isFinal;
      entry.isHoliday = isBrandenburgHoliday(date);
      entry.isVorfesttag = false;
      entry.isSplitShift = false;
      entry.isBetriebsversammlung = false;
      entry.isVoluntarySwap = false;
      entry.serviceNumber = '';
      entry.startTime = '';
      entry.endTime = '';
      entry.breakMinutes = 0;
      entry.parts = [];
      entry.frvMinutes = Number(state.settings.frvPlaceholderMinutes || 468);
      entry.orderedOvertimeHours = 0;
      entry.betriebsversammlungTravelAmount = 0;
      entry.isFahrdienst = false;
      if (mode === 'vacation') {
        entry.actualType = 'vacation';
        entry.isVacation = true;
        entry.isSick = false;
        entry.vacationDays = 1;
        entry.sickDays = 0;
      } else if (mode === 'sick') {
        entry.actualType = 'sick';
        entry.isVacation = false;
        entry.isSick = true;
        entry.vacationDays = 0;
        entry.sickDays = 1;
      }
    });
  }

  function saveDayForm(e) {
    e.preventDefault();
    const date = document.getElementById('dayDate').value;
    const entry = ensureEntry(date);
    entry.plannedType = document.getElementById('plannedType').value;
    entry.status = document.getElementById('dayStatus').value;
    entry.actualType = document.getElementById('actualType').value;
    entry.serviceNumber = document.getElementById('dayServiceNumber').value.trim();
    entry.startTime = document.getElementById('dayStart').value;
    entry.endTime = document.getElementById('dayEnd').value;
    entry.breakMinutes = Number(document.getElementById('dayBreak').value || 0);
    entry.frvMinutes = parseDurationMinutes(document.getElementById('frvMinutes').value) ?? Number(state.settings.frvPlaceholderMinutes);
    entry.orderedOvertimeHours = Number(document.getElementById('orderedOvertimeHours').value || 0);
    entry.factorValue = Number(document.getElementById('dayFactor').value || 0);
    entry.vacationDays = Number(document.getElementById('dayVacationDays').value || 0);
    entry.sickDays = Number(document.getElementById('daySickDays').value || 0);
    entry.rangeFrom = document.getElementById('dayRangeFrom').value || date;
    entry.rangeTo = document.getElementById('dayRangeTo').value || date;
    entry.betriebsversammlungTravelAmount = Number(document.getElementById('dayBvTravel').value || 0);
    entry.notes = document.getElementById('dayNotes').value;
    entry.isFahrdienst = document.getElementById('flagFahrdienst').checked;
    entry.isHoliday = document.getElementById('flagHoliday').checked || isBrandenburgHoliday(date);
    entry.isVorfesttag = document.getElementById('flagVorfesttag').checked;
    entry.isSplitShift = document.getElementById('flagSplit').checked;
    entry.isVacation = document.getElementById('flagVacation').checked;
    entry.isSick = document.getElementById('flagSick').checked;
    entry.isBetriebsversammlung = document.getElementById('flagBv').checked;
    entry.isVoluntarySwap = document.getElementById('flagSwap').checked;
    entry.isFinal = document.getElementById('flagFinal').checked;
    entry.vacationDays = entry.isVacation ? (entry.vacationDays || 1) : 0;
    entry.sickDays = entry.isSick ? (entry.sickDays || 1) : 0;

    if (entry.actualType === 'free' && !entry.isVacation && !entry.isSick) {
      entry.serviceNumber = '';
      entry.startTime = '';
      entry.endTime = '';
      entry.breakMinutes = 0;
      entry.orderedOvertimeHours = 0;
      entry.isFahrdienst = false;
      entry.isSplitShift = false;
      entry.parts = [];
    }

    if (entry.isVacation || entry.isSick) {
      const mode = entry.isVacation ? 'vacation' : 'sick';
      const baseValues = {
        status: entry.status,
        factorValue: entry.factorValue,
        notes: entry.notes,
        isFinal: entry.isFinal
      };
      applyAbsenceRange(mode, entry.rangeFrom || date, entry.rangeTo || date, baseValues);
      saveState();
      renderAll();
      return;
    }

    saveState(); renderAll();
  }

  function addSplitPart() {
    const date = document.getElementById('dayDate').value;
    const entry = ensureEntry(date);
    entry.parts = entry.parts || [];
    entry.parts.push({ startTime:'', endTime:'', breakMinutes:0 });
    saveState(); renderDayForm();
  }
  function onSplitClick(e) {
    if (!e.target.classList.contains('split-remove')) return;
    const date = document.getElementById('dayDate').value;
    const entry = ensureEntry(date);
    entry.parts.splice(Number(e.target.dataset.idx),1);
    saveState(); renderDayForm();
  }
  function onSplitInput(e) {
    const idx = e.target.dataset.idx; if (idx == null) return;
    const date = document.getElementById('dayDate').value;
    const entry = ensureEntry(date);
    const part = entry.parts[Number(idx)];
    if (e.target.classList.contains('split-start')) part.startTime = e.target.value;
    if (e.target.classList.contains('split-end')) part.endTime = e.target.value;
    if (e.target.classList.contains('split-break')) part.breakMinutes = Number(e.target.value || 0);
    saveState();
  }

  function saveStatementSummary(e) {
    e.preventDefault();
    const month = document.getElementById('statementMonth').value;
    state.statements[month] = {
      gesamtBrutto: Number(document.getElementById('stmtGesamtBrutto').value || 0),
      steuerBrutto: Number(document.getElementById('stmtSteuerBrutto').value || 0),
      svBrutto: Number(document.getElementById('stmtSvBrutto').value || 0),
      zvBrutto: Number(document.getElementById('stmtZvBrutto').value || 0),
      payout: Number(document.getElementById('stmtPayout').value || 0),
      lohnsteuer: Number(document.getElementById('stmtTax').value || 0),
      kv: Number(document.getElementById('stmtKv').value || 0),
      rv: Number(document.getElementById('stmtRv').value || 0),
      av: Number(document.getElementById('stmtAv').value || 0),
      pv: Number(document.getElementById('stmtPv').value || 0),
      other: Number(document.getElementById('stmtOther').value || 0),
      isCorrection: document.getElementById('stmtCorrection').checked,
      notes: document.getElementById('stmtNotes').value
    };
    saveState(); renderAll();
  }

  function saveStatementLine(e) {
    e.preventDefault();
    state.statementLines.push({
      month: document.getElementById('stmtLineMonth').value,
      label: document.getElementById('stmtLineLabel').value,
      amount: Number(document.getElementById('stmtLineAmount').value || 0),
      category: document.getElementById('stmtLineCategory').value,
      earnedMonth: document.getElementById('stmtEarnedMonth').value,
      paidMonth: document.getElementById('stmtPaidMonth').value,
      countsGesamt: document.getElementById('stmtCountGesamt').checked,
      countsSteuer: document.getElementById('stmtCountSteuer').checked,
      countsSv: document.getElementById('stmtCountSv').checked,
      countsZv: document.getElementById('stmtCountZv').checked,
      isOneTime: document.getElementById('stmtIsOneTime').checked,
      isReimbursement: document.getElementById('stmtIsReimbursement').checked
    });
    e.target.reset();
    document.getElementById('stmtCountGesamt').checked = true;
    saveState(); renderStatements(); renderPayroll(); renderYear();
  }
  function deleteStatementLine(e) {
    if (!e.target.classList.contains('delete-line')) return;
    state.statementLines.splice(Number(e.target.dataset.idx),1);
    saveState(); renderStatements(); renderPayroll(); renderYear();
  }

  function saveCommuteMonth(e) {
    e.preventDefault();
    const month = document.getElementById('commuteMonth').value;
    state.commuteMonths[month] = {
      distanceKmOneWay: Number(document.getElementById('commuteKm').value || 0),
      daysFullCommute: Number(document.getElementById('commuteFullDays').value || 0),
      daysHalfCommute: Number(document.getElementById('commuteHalfDays').value || 0),
      vehicleType: document.getElementById('commuteVehicle').value,
      notes: document.getElementById('commuteNotes').value
    };
    saveState(); renderCommute(); renderYear();
  }
  function saveExpense(e) {
    e.preventDefault();
    state.expenses.push({
      date: document.getElementById('expenseDate').value,
      category: document.getElementById('expenseCategory').value,
      label: document.getElementById('expenseLabel').value,
      amount: Number(document.getElementById('expenseAmount').value || 0),
      hasReceipt: document.getElementById('expenseReceipt').checked,
      notes: document.getElementById('expenseNotes').value
    });
    e.target.reset();
    document.getElementById('expenseReceipt').checked = true;
    saveState(); renderCommute(); renderYear();
  }
  function deleteExpense(e) {
    if (!e.target.classList.contains('delete-expense')) return;
    state.expenses.splice(Number(e.target.dataset.idx),1);
    saveState(); renderCommute(); renderYear();
  }

  function saveSettings(e) {
    e.preventDefault();
    state.settings.tariffName = document.getElementById('setTariffName').value;
    state.settings.entgeltgruppe = document.getElementById('setGroup').value;
    state.settings.stufe = Number(document.getElementById('setStep').value || 1);
    state.settings.weeklyHoursContract = Number(document.getElementById('setWeeklyHours').value || 39);
    state.settings.weeklyHoursCycleAvg = document.getElementById('setCycleAvg').value;
    state.settings.fixedMonthlyBasePay = Number(document.getElementById('setBasePay').value || 3022);
    state.settings.baseHourRate = Number(document.getElementById('setBaseRate').value || 17.82);
    state.settings.bonusHourRate = Number(document.getElementById('setBonusRate').value || 18.18);
    state.settings.frvPlaceholderMinutes = parseDurationMinutes(document.getElementById('setFrvMinutes').value) ?? 468;
    state.settings.kvbbgUmlagePercent = Number(document.getElementById('setKvbbgUmlage').value || 0.55);
    state.settings.kvbbgZusatzPercent = Number(document.getElementById('setKvbbgZusatz').value || 2.40);
    state.settings.taxClass = document.getElementById('setTaxClass')?.value || '1';
    state.settings.estimatedTaxPercent = Number(document.getElementById('setTaxPercent').value || getTaxProfile(state.settings.taxClass).estimatedTaxPercent || 0);
    state.settings.healthInsurance = document.getElementById('setHealthInsurance')?.value || 'custom';
    const selectedHealthProfile = getHealthInsuranceProfile(state.settings.healthInsurance);
    let healthAdditional = Number(document.getElementById('setHealthAdditionalPercent')?.value || state.settings.healthAdditionalPercent || 0);
    if (selectedHealthProfile.additionalPercent != null) healthAdditional = selectedHealthProfile.additionalPercent;
    state.settings.healthAdditionalPercent = healthAdditional;
    state.settings.estimatedHealthPercent = Number(document.getElementById('setHealthPercent').value || calculateHealthEmployeePercent(healthAdditional));
    state.settings.estimatedPensionPercent = Number(document.getElementById('setPensionPercent').value || 0);
    state.settings.estimatedUnemploymentPercent = Number(document.getElementById('setUnemploymentPercent').value || 0);
    state.settings.estimatedCarePercent = Number(document.getElementById('setCarePercent').value || 0);
    state.settings.estimatedChurchPercent = Number(document.getElementById('setChurchPercent').value || 0);
    state.settings.estimatedSoliPercent = Number(document.getElementById('setSoliPercent').value || 0);
    state.settings.preferActualDeductions = !!document.getElementById('setPreferActualDeductions').checked;
    state.settings.calendarName = document.getElementById('setCalendarName').value;
    state.settings.reminderMinutes = Number(document.getElementById('setReminder').value || 30);
    state.settings.homeAddress = document.getElementById('setHomeAddress').value;
    state.settings.depotAddress = document.getElementById('setDepotAddress').value;
    saveState(); renderAll();
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'dienstplanung-gehalt-backup.json'; a.click();
    URL.revokeObjectURL(url);
  }
  function importBackup(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { state = deepMerge(defaultState(), JSON.parse(String(reader.result))); saveState(); renderAll(); alert('Backup importiert.'); }
      catch { alert('Backup konnte nicht gelesen werden.'); }
    };
    reader.readAsText(file);
  }
  function resetAll() {
    if (!confirm('Wirklich alle lokalen Daten löschen?')) return;
    state = defaultState(); saveState(); renderAll();
  }

  function loadDemo() {
    state = defaultState();
    state.settings.homeAddress = 'Beispielstraße 1, 14621 Schönwalde-Glien';
    state.settings.distanceKmOneWay = 12;
    state.settings.taxClass = '1';
    state.settings.estimatedTaxPercent = 8.0;
    state.settings.healthInsurance = 'custom';
    state.settings.healthAdditionalPercent = 1.70;
    state.settings.estimatedHealthPercent = 8.15;
    state.settings.estimatedPensionPercent = 9.30;
    state.settings.estimatedUnemploymentPercent = 1.30;
    state.settings.estimatedCarePercent = 2.40;
    state.rotationWeeks[0].days[0] = { weekdayName:'Montag', weekdayIndex:0, templateType:'fixed', defaultStartTime:'05:12', defaultEndTime:'13:46', defaultBreakMinutes:30, defaultPaidMinutes:484, serviceNumber:'4011', notes:'Frühdienst' };
    state.rotationWeeks[0].days[1] = { weekdayName:'Dienstag', weekdayIndex:1, templateType:'frv', defaultStartTime:'', defaultEndTime:'', defaultBreakMinutes:0, defaultPaidMinutes:468, serviceNumber:'', notes:'FRV offen' };
    state.rotationWeeks[0].days[2] = { weekdayName:'Mittwoch', weekdayIndex:2, templateType:'fixed', defaultStartTime:'12:10', defaultEndTime:'20:55', defaultBreakMinutes:40, defaultPaidMinutes:485, serviceNumber:'4022', notes:'Spätdienst' };
    state.dayEntries['2026-05-05'] = {
      date:'2026-05-05', plannedType:'fixed', serviceNumber:'4011', status:'final', actualType:'fixed', startTime:'05:12', endTime:'13:46', breakMinutes:30,
      frvMinutes:468, isFahrdienst:true, isHoliday:false, isVorfesttag:false, isSplitShift:false, isVacation:false, isSick:false,
      isBetriebsversammlung:false, isVoluntarySwap:false, isFinal:true, orderedOvertimeHours:0, factorValue:0, vacationDays:0, sickDays:0, parts:[], notes:'', betriebsversammlungTravelAmount:0
    };
    state.dayEntries['2026-05-06'] = {
      date:'2026-05-06', plannedType:'frv', serviceNumber:'', status:'open', actualType:'frv_open', startTime:'', endTime:'', breakMinutes:0,
      frvMinutes:468, isFahrdienst:true, isHoliday:false, isVorfesttag:false, isSplitShift:false, isVacation:false, isSick:false,
      isBetriebsversammlung:false, isVoluntarySwap:false, isFinal:false, orderedOvertimeHours:0, factorValue:0, vacationDays:0, sickDays:0, parts:[], serviceNumber:'', notes:'FRV offen', betriebsversammlungTravelAmount:0
    };
    state.dayEntries['2026-05-10'] = {
      date:'2026-05-10', plannedType:'fixed', serviceNumber:'4701', status:'final', actualType:'holiday_work', startTime:'06:00', endTime:'13:27', breakMinutes:0,
      frvMinutes:468, isFahrdienst:true, isHoliday:true, isVorfesttag:false, isSplitShift:false, isVacation:false, isSick:false,
      isBetriebsversammlung:false, isVoluntarySwap:false, isFinal:true, orderedOvertimeHours:0, factorValue:0, vacationDays:0, sickDays:0, parts:[], notes:'Feiertag', betriebsversammlungTravelAmount:0
    };
    state.dayEntries['2026-05-12'] = {
      date:'2026-05-12', plannedType:'fixed', serviceNumber:'5102', status:'final', actualType:'split_shift', startTime:'', endTime:'', breakMinutes:0,
      frvMinutes:468, isFahrdienst:true, isHoliday:false, isVorfesttag:false, isSplitShift:true, isVacation:false, isSick:false,
      isBetriebsversammlung:false, isVoluntarySwap:false, isFinal:true, orderedOvertimeHours:1.25, factorValue:0, vacationDays:0, sickDays:0,
      parts:[{startTime:'04:55',endTime:'09:10',breakMinutes:0},{startTime:'13:20',endTime:'17:05',breakMinutes:0}], notes:'Geteilter Dienst', betriebsversammlungTravelAmount:0
    };
    state.dayEntries['2026-05-20'] = {
      date:'2026-05-20', plannedType:'vacation', serviceNumber:'', status:'final', actualType:'vacation', startTime:'', endTime:'', breakMinutes:0,
      frvMinutes:468, isFahrdienst:false, isHoliday:false, isVorfesttag:false, isSplitShift:false, isVacation:true, isSick:false,
      isBetriebsversammlung:false, isVoluntarySwap:false, isFinal:true, orderedOvertimeHours:0, factorValue:0.87, vacationDays:4, sickDays:0, parts:[], notes:'Urlaub', betriebsversammlungTravelAmount:0
    };
    state.dayEntries['2026-05-26'] = {
      date:'2026-05-26', plannedType:'sick', serviceNumber:'', status:'final', actualType:'sick', startTime:'', endTime:'', breakMinutes:0,
      frvMinutes:468, isFahrdienst:false, isHoliday:false, isVorfesttag:false, isSplitShift:false, isVacation:false, isSick:true,
      isBetriebsversammlung:false, isVoluntarySwap:false, isFinal:true, orderedOvertimeHours:0, factorValue:0.41, vacationDays:0, sickDays:2, parts:[], notes:'Krank', betriebsversammlungTravelAmount:0
    };
    state.statementLines.push({ month:'2026-05', label:'Tarifliche Sonderzahlung', amount:200, category:'tariff_special', earnedMonth:'2026-05', paidMonth:'2026-05', countsGesamt:true, countsSteuer:true, countsSv:true, countsZv:true, isOneTime:true, isReimbursement:false });
    state.statementLines.push({ month:'2026-05', label:'FK Betriebsversammlung', amount:35.66, category:'reimbursement', earnedMonth:'2026-05', paidMonth:'2026-05', countsGesamt:false, countsSteuer:false, countsSv:false, countsZv:false, isOneTime:false, isReimbursement:true });
    state.statements['2026-05'] = { gesamtBrutto: 3480.22, steuerBrutto: 3290.35, svBrutto: 3290.35, zvBrutto: 3365.91, payout: 2304.66, lohnsteuer: 352.16, kv: 270.58, rv: 299.93, av: 41.93, pv: 77.40, other: 35.66, isCorrection:false, notes:'Demo-Abrechnung' };
    state.commuteMonths['2026-05'] = { distanceKmOneWay: 12, daysFullCommute: 18, daysHalfCommute: 0, vehicleType:'car', notes:'' };
    state.expenses.push({ date:'2026-05-03', category:'work_equipment', label:'Tasche', amount:39.99, hasReceipt:true, notes:'' });
    saveState(); renderAll(); alert('Demo-Daten geladen.');
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    handleResponsiveMenuState();
    renderAll();
  });
})();
