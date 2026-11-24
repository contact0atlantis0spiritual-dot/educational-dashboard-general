// data_apps.js — launcher source of truth.
// Must stay in sync with apps.json (the SW reads apps.json for precaching).
// Structure mirrors the reference app's data_general.js so applyCardPalettes()
// in index.html can derive per-card shadow direction/opacity from accent hue.

window.APPS = [
  {
    id: 'arabic',
    icon: '/arabic/assets/icons/icon-192x192.png',
    link: '/arabic/',
    lightModePalette: { accent: '#0a7d5a', iconBg: '#e6f4ef' },
    darkModePalette:  { accent: '#2dd4a8', iconBg: '#1a2e27' },
    en: {
      name: 'Arabic Edu',
      description: 'Master the Arabic language with interactive lessons, grammar drills, and vocabulary building.'
    },
    fr: {
      name: 'Éduc. Arabe',
      description: 'Maîtrisez la langue arabe avec des leçons interactives, exercices de grammaire et enrichissement du vocabulaire.'
    },
    ar: {
      name: 'تعليم العربية',
      description: 'أتقن اللغة العربية من خلال دروس تفاعلية وتمارين نحوية وبناء المفردات.'
    }
  },
  {
    id: 'philo',
    icon: '/philo/assets/icons/icon-192x192.png',
    link: '/philo/',
    lightModePalette: { accent: '#6b4dab', iconBg: '#f3eefb' },
    darkModePalette:  { accent: '#a78bfa', iconBg: '#1e1b2e' },
    en: {
      name: 'Philo Edu',
      description: 'Explore philosophy through guided lessons, written reflection, and critical thinking.'
    },
    fr: {
      name: 'Philo Édu',
      description: 'Explorez la philosophie à travers des leçons guidées, la réflexion écrite et la pensée critique.'
    },
    ar: {
      name: 'تعليم الفلسفة',
      description: 'استكشف الفلسفة من خلال دروس موجهة وتأمل كتابي وتفكير نقدي.'
    }
  }
];