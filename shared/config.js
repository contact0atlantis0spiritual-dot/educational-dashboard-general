// shared/config.js — single source of truth for build-time choices.
export const CONFIG = {
  backend: 'local',               // 'local' | 'supabase'
  supabaseUrl: '',                // fill only when backend === 'supabase'
  supabaseAnonKey: '',
  defaultLang: 'en',              // fallback when page lang + stored pref are missing
  apps: {
    arabic: { name: 'Arabic Edu', url: '/arabic/' },
    philo:  { name: 'Philo Edu',  url: '/philo/'  }
  }
};