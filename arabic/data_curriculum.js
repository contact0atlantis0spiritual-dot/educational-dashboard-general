// arabic/data_curriculum.js — Tunisian program structure.
// Levels: year → (sections) → categories → modules → lessons.
// - No sections: year.categories = { … }
// - Has sections: year.sections = [{ id, name, categories: { … } }, …]
// Leave categories empty {} to show "coming soon".

window.CURRICULUM = {
  years: [
    // ── Basic years (5–9) ───────────────────────────────────────
    {
      id: 'y5b', level: 'basic', icon: '📗',
      name: { en: 'Year 5 · Basic', fr: '5ᵉ année de base', ar: 'السنة الخامسة أساسي' },
      lightModePalette: { accent: '#0a7d5a', iconBg: '#e6f4ef' },
      darkModePalette:  { accent: '#2dd4a8', iconBg: '#1a2e27' },
      categories: {}   // fill in when ready
    },
    {
      id: 'y6b', level: 'basic', icon: '📘',
      name: { en: 'Year 6 · Basic', fr: '6ᵉ année de base', ar: 'السنة السادسة أساسي' },
      lightModePalette: { accent: '#0d9488', iconBg: '#e6f5f3' },
      darkModePalette:  { accent: '#2dd4bf', iconBg: '#14261f' },
      categories: {}
    },
    {
      id: 'y7b', level: 'basic', icon: '📙',
      name: { en: 'Year 7 · Basic', fr: '7ᵉ année de base', ar: 'السنة السابعة أساسي' },
      lightModePalette: { accent: '#2563eb', iconBg: '#eef2ff' },
      darkModePalette:  { accent: '#60a5fa', iconBg: '#1a2030' },
      // Existing lessons are preserved as the first Literature module:
      categories: {
        literature: {
          name: { en: 'Literature', fr: 'Littérature', ar: 'الأدب' },
          icon: '📖',
          modules: [
            {
              name: { en: 'Module 1', fr: 'Module 1', ar: 'الوحدة 1' },
              lessons: [
                { name: { en: 'Lesson 1 — Introduction', fr: 'Leçon 1 — Introduction', ar: 'الدرس الأول — مقدمة' },
                  link: '/arabic/year7/module1/lesson1.html' },
                { name: { en: 'Lesson 2 — Practice', fr: 'Leçon 2 — Exercices', ar: 'الدرس الثاني — تمارين' },
                  link: '/arabic/year7/module1/lesson2.html' }
              ]
            }
          ]
        }
      }
    },
    {
      id: 'y8b', level: 'basic', icon: '📕',
      name: { en: 'Year 8 · Basic', fr: '8ᵉ année de base', ar: 'السنة الثامنة أساسي' },
      lightModePalette: { accent: '#4f46e5', iconBg: '#f1effa' },
      darkModePalette:  { accent: '#818cf8', iconBg: '#1c1b30' },
      categories: {}
    },
    {
      id: 'y9b', level: 'basic', icon: '📔',
      name: { en: 'Year 9 · Basic', fr: '9ᵉ année de base', ar: 'السنة التاسعة أساسي' },
      lightModePalette: { accent: '#7c3aed', iconBg: '#f3eefb' },
      darkModePalette:  { accent: '#a78bfa', iconBg: '#1e1b2e' },
      categories: {}
    },

    // ── Secondary years (1–4) ───────────────────────────────────
    {
      id: 'y1s', level: 'secondary', icon: '📚',
      name: { en: 'Year 1 · Secondary', fr: '1ʳᵉ année secondaire', ar: 'السنة الأولى ثانوي' },
      lightModePalette: { accent: '#d97706', iconBg: '#fdf4ea' },
      darkModePalette:  { accent: '#fbbf24', iconBg: '#2a2016' },
      // No sections for Y1 — one shared program
      categories: {
        literature: {
          name: { en: 'Literature', fr: 'Littérature', ar: 'الأدب' },
          icon: '📖',
          modules: [
            {
              name: { en: 'Ghazal poetry — Jamil B. Ma‘mar', fr: 'Poésie ghazal — Jamil B. Ma‘mar', ar: 'شعر الغزل — جميل بن معمر' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص الأول' }, link: 'AH_1SY_literature_module1_section1_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص الثاني' }, link: 'AH_1SY_literature_module1_section1_lesson2.html' },
                { name: { en: 'Text 3', fr: 'Texte 3', ar: 'النص الثالث' }, link: 'AH_1SY_literature_module1_section1_lesson3.html' }
              ]
            },
            {
              name: { en: 'Ghazal poetry — ‘Umar B. Abī Rabī‘a', fr: 'Poésie ghazal — ‘Umar B. Abī Rabī‘a', ar: 'شعر الغزل — عمر ابن أبي ربيعة' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص الأول' }, link: 'AH_1SY_literature_module1_section2_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص الثاني' }, link: 'AH_1SY_literature_module1_section2_lesson2.html' },
                { name: { en: 'Text 3', fr: 'Texte 3', ar: 'النص الثالث' }, link: 'AH_1SY_literature_module1_section2_lesson3.html' }
              ]
            },
            {
              name: { en: 'Ancient Arabic tale — the parable', fr: 'Conte arabe ancien — la parabole', ar: 'من أشكال القص العربي القديم: الحكاية المثلية' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص الأول' }, link: 'AH_1SY_literature_module2_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص الثاني' }, link: 'AH_1SY_literature_module2_lesson2.html' },
                { name: { en: 'Text 3', fr: 'Texte 3', ar: 'النص الثالث' }, link: 'AH_1SY_literature_module2_lesson3.html' }
              ]
            },
            {
              name: { en: 'Contemporary Arabic poetry — the patriotic poem', fr: 'Poésie arabe contemporaine — le poème patriotique', ar: 'الشعر العربي المعاصر: الشعر الوطني' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص الأول' }, link: 'AH_1SY_literature_module3_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص الثاني' }, link: 'AH_1SY_literature_module3_lesson2.html' },
                { name: { en: 'Text 3', fr: 'Texte 3', ar: 'النص الثالث' }, link: 'AH_1SY_literature_module3_lesson3.html' }
              ]
            },
            {
              name: { en: 'Modern tale — the short story', fr: 'Conte moderne — la nouvelle', ar: 'القص العربي المعاصر: الأقصوصة' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص الأول' }, link: 'AH_1SY_literature_module4_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص الثاني' }, link: 'AH_1SY_literature_module4_lesson2.html' },
                { name: { en: 'Text 3', fr: 'Texte 3', ar: 'النص الثالث' }, link: 'AH_1SY_literature_module4_lesson3.html' }
              ]
            }
          ]
        },
        communication: {
          name: { en: 'Communication', fr: 'Communication', ar: 'التواصل' },
          icon: '💬',
          modules: [
            {
              name: { en: 'Aspects of contemporary life', fr: 'Aspects de la vie contemporaine', ar: 'مظاهر من الحياة المعاصرة' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص 1' }, link: 'AH_1SY_communication_module1_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص 2' }, link: 'AH_1SY_communication_module1_lesson2.html' }
              ]
            },
            {
              name: { en: 'Sport and values', fr: 'Sport et valeurs', ar: 'الرياضة والقيم' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص 1' }, link: 'AH_1SY_communication_module2_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص 2' }, link: 'AH_1SY_communication_module2_lesson2.html' }
              ]
            },
            {
              name: { en: 'Music and taste', fr: 'Musique et goût', ar: 'موسيقى وأذواق' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص 1' }, link: 'AH_1SY_communication_module3_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص 2' }, link: 'AH_1SY_communication_module3_lesson2.html' }
              ]
            }
          ]
        },
        language: {
          name: { en: 'Language', fr: 'Langue', ar: 'اللغة' },
          icon: '🔤',
          modules: [
            {
              name: { en: 'The sentence — structure and order', fr: 'La phrase — structure et ordre', ar: 'الجملة وتركيبها ورتبتها' },
              lessons: [
                { name: { en: 'The concept of a sentence', fr: 'Le concept de phrase', ar: 'مفهوم الجملة' }, link: 'AH_1SY_language_module1_lesson1.html' },
                { name: { en: 'Sentence structure', fr: 'Structure de la phrase', ar: 'تركيب الجملة' }, link: 'AH_1SY_language_module1_lesson2.html' },
                { name: { en: 'Sentence order', fr: 'Ordre de la phrase', ar: 'رتبة الجملة' }, link: 'AH_1SY_language_module1_lesson3.html' },
                { name: { en: 'Connectors between sentences', fr: 'Connecteurs entre phrases', ar: 'أدوات الربط بين الجمل' }, link: 'AH_1SY_language_module1_lesson4.html' }
              ]
            },
            {
              name: { en: 'The semi-predicative compound', fr: 'Le composé semi-prédicatif', ar: 'المركب شبه الإسنادي' },
              lessons: [
                { name: { en: 'General rules and applications', fr: 'Règles générales et applications', ar: 'قواعد عامة وتطبيقات' }, link: 'AH_1SY_language_module2_lesson1.html' },
                { name: { en: 'Applications', fr: 'Applications', ar: 'تطبيقات' }, link: 'AH_1SY_language_module2_lesson2.html' }
              ]
            },
            {
              name: { en: 'The relative compound', fr: 'Le composé relatif', ar: 'المركب الموصولي' },
              lessons: [
                { name: { en: 'General rules and applications', fr: 'Règles générales et applications', ar: 'قواعد عامة وتطبيقات' }, link: 'AH_1SY_language_module3_lesson1.html' },
                { name: { en: 'Applications', fr: 'Applications', ar: 'تطبيقات' }, link: 'AH_1SY_language_module3_lesson2.html' }
              ]
            },
            {
              name: { en: 'Choice, equalisation and conclusion', fr: 'Choix, égalisation et conclusion', ar: 'التخيير والتسوية والاستنتاج' },
              lessons: [
                { name: { en: 'General rules and applications', fr: 'Règles générales et applications', ar: 'قواعد عامة وتطبيقات' }, link: 'AH_1SY_language_module4_lesson1.html' },
                { name: { en: 'Applications', fr: 'Applications', ar: 'تطبيقات' }, link: 'AH_1SY_language_module4_lesson2.html' }
              ]
            },
            {
              name: { en: 'Exception and restriction', fr: 'Exception et restriction', ar: 'الاستثناء والحصر' },
              lessons: [
                { name: { en: 'General rules and applications', fr: 'Règles générales et applications', ar: 'قواعد عامة وتطبيقات' }, link: 'AH_1SY_language_module5_lesson1.html' },
                { name: { en: 'Applications', fr: 'Applications', ar: 'تطبيقات' }, link: 'AH_1SY_language_module5_lesson2.html' }
              ]
            },
            {
              name: { en: 'Prepositions and their meanings', fr: 'Prépositions et leurs sens', ar: 'حروف الجر ومعانيها' },
              lessons: [
                { name: { en: 'General rules and applications', fr: 'Règles générales et applications', ar: 'قواعد عامة وتطبيقات' }, link: 'AH_1SY_language_module6_lesson1.html' },
                { name: { en: 'Applications', fr: 'Applications', ar: 'تطبيقات' }, link: 'AH_1SY_language_module6_lesson2.html' }
              ]
            }
          ]
        },
        rhetoric: {
          name: { en: 'Rhetoric', fr: 'Rhétorique', ar: 'البلاغة' },
          icon: '🎭',
          modules: [
            {
              name: { en: 'Communication', fr: 'Communication', ar: 'التخاطب' },
              lessons: [
                { name: { en: 'The communication process', fr: 'Le processus de communication', ar: 'عملية التخاطب وأركانها' }, link: 'AH_1SY_rhetoric_module1_lesson1.html' },
                { name: { en: 'Applications', fr: 'Applications', ar: 'تطبيقات' }, link: 'AH_1SY_rhetoric_module1_lesson2.html' }
              ]
            },
            {
              name: { en: 'Science of meaning', fr: 'Science du sens', ar: 'علم المعاني' },
              lessons: [
                { name: { en: 'Statement — types', fr: 'Énoncé — types', ar: 'الخبر: أنواعه' }, link: 'AH_1SY_rhetoric_module2_section1_lesson1.html' },
                { name: { en: 'Statement — implied meanings', fr: 'Énoncé — sens implicites', ar: 'الخبر: المعاني المستفادة' }, link: 'AH_1SY_rhetoric_module2_section1_lesson2.html' },
                { name: { en: 'Performative — request', fr: 'Performatif — requête', ar: 'الإنشاء الطلبي' }, link: 'AH_1SY_rhetoric_module2_section2_lesson1.html' },
                { name: { en: 'Performative — non-request', fr: 'Performatif — non-requête', ar: 'الإنشاء غير الطلبي' }, link: 'AH_1SY_rhetoric_module2_section2_lesson2.html' }
              ]
            },
            {
              name: { en: 'Science of eloquence', fr: 'Science de l’éloquence', ar: 'علم البيان' },
              lessons: [
                { name: { en: 'Simile — pillars', fr: 'Comparaison — piliers', ar: 'التشبيه: أركانه' }, link: 'AH_1SY_rhetoric_module3_section1_lesson1.html' },
                { name: { en: 'Simile — types', fr: 'Comparaison — types', ar: 'التشبيه: أنواعه' }, link: 'AH_1SY_rhetoric_module3_section1_lesson2.html' },
                { name: { en: 'Metaphor — pillars', fr: 'Métaphore — piliers', ar: 'الاستعارة: أركانها' }, link: 'AH_1SY_rhetoric_module3_section2_lesson1.html' },
                { name: { en: 'Metaphor — types', fr: 'Métaphore — types', ar: 'الاستعارة: أنواعها' }, link: 'AH_1SY_rhetoric_module3_section2_lesson2.html' },
                { name: { en: 'Metonymy — text 1', fr: 'Métonymie — texte 1', ar: 'الكناية: النص 1' }, link: 'AH_1SY_rhetoric_module3_section3_lesson1.html' },
                { name: { en: 'Metonymy — text 2', fr: 'Métonymie — texte 2', ar: 'الكناية: النص 2' }, link: 'AH_1SY_rhetoric_module3_section3_lesson2.html' }
              ]
            }
          ]
        },
        production: {
          name: { en: 'Production', fr: 'Production', ar: 'الإنتاج' },
          icon: '✍️',
          modules: [
            {
              name: { en: 'Essay writing', fr: 'Rédaction d’un essai', ar: 'إنتاج المقال' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص الأول' }, link: 'AH_1SY_writing_module1_section1_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص الثاني' }, link: 'AH_1SY_writing_module1_section1_lesson2.html' }
              ]
            },
            {
              name: { en: 'Literary text analysis', fr: 'Analyse de texte littéraire', ar: 'تحليل النص الأدبي' },
              lessons: [
                { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص الأول' }, link: 'AH_1SY_writing_module1_section2_lesson1.html' },
                { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص الثاني' }, link: 'AH_1SY_writing_module1_section2_lesson2.html' }
              ]
            }
          ]
        }
      }
    },
    {
      id: 'y2s', level: 'secondary', icon: '📖',
      name: { en: 'Year 2 · Secondary', fr: '2ᵉ année secondaire', ar: 'السنة الثانية ثانوي' },
      lightModePalette: { accent: '#dc2626', iconBg: '#fdf2f2' },
      darkModePalette:  { accent: '#f87171', iconBg: '#2a1c1c' },
      // Sections — each with its own program
      sections: [
        { id: 'eco',    name: { en: 'Economy', fr: 'Économie', ar: 'اقتصاد' } },
        { id: 'maths',  name: { en: 'Maths', fr: 'Maths', ar: 'رياضيات' } },
        { id: 'sci',    name: { en: 'Sciences', fr: 'Sciences', ar: 'علوم' } },
        { id: 'letters',name: { en: 'Letters', fr: 'Lettres', ar: 'آداب' } }
        // Fill categories per section below — flat map:
        // categoriesBySection: { eco: { … }, maths: { … }, … }
      ],
      categoriesBySection: {
        // eco:    { literature: { … }, … },
        // maths:  { literature: { … }, … },
        // sci:    { literature: { … }, … },
        // letters:{ literature: { … }, … }
      }
    },
    {
      id: 'y3s', level: 'secondary', icon: '📰',
      name: { en: 'Year 3 · Secondary', fr: '3ᵉ année secondaire', ar: 'السنة الثالثة ثانوي' },
      lightModePalette: { accent: '#db2777', iconBg: '#fdf2f7' },
      darkModePalette:  { accent: '#f472b6', iconBg: '#2a1c24' },
      sections: [
        { id: 'eco',    name: { en: 'Economy', fr: 'Économie', ar: 'اقتصاد' } },
        { id: 'maths',  name: { en: 'Maths', fr: 'Maths', ar: 'رياضيات' } },
        { id: 'sci',    name: { en: 'Sciences', fr: 'Sciences', ar: 'علوم' } },
        { id: 'letters',name: { en: 'Letters', fr: 'Lettres', ar: 'آداب' } }
      ],
      // Example for one section (Literature → modules → lessons).
      categoriesBySection: {
        letters: {
          literature: {
            name: { en: 'Literature', fr: 'Littérature', ar: 'الأدب' },
            icon: '📖',
            modules: [
              {
                name: { en: 'Andalusian poetry', fr: 'Poésie andalouse', ar: 'الشعر العربي في الأندلس' },
                lessons: [
                  { name: { en: 'Text 1', fr: 'Texte 1', ar: 'النص الأول' }, link: 'AH_3SY_literature_module3_lesson1.html' },
                  { name: { en: 'Text 2', fr: 'Texte 2', ar: 'النص الثاني' }, link: null },
                  { name: { en: 'Text 3', fr: 'Texte 3', ar: 'النص الثالث' }, link: null }
                ]
              }
            ]
          }
        }
        // Fill other sections following the same shape.
      }
    },
    {
      id: 'y4s', level: 'secondary', icon: '📜',
      name: { en: 'Year 4 · Secondary', fr: '4ᵉ année secondaire', ar: 'السنة الرابعة ثانوي' },
      lightModePalette: { accent: '#ca8a04', iconBg: '#fef9e7' },
      darkModePalette:  { accent: '#fbbf24', iconBg: '#2a2010' },
      sections: [
        { id: 'eco',    name: { en: 'Economy', fr: 'Économie', ar: 'اقتصاد' } },
        { id: 'maths',  name: { en: 'Maths', fr: 'Maths', ar: 'رياضيات' } },
        { id: 'sci',    name: { en: 'Sciences', fr: 'Sciences', ar: 'علوم' } },
        { id: 'letters',name: { en: 'Letters', fr: 'Lettres', ar: 'آداب' } }
      ],
      categoriesBySection: {}
    },

    // ── General education ───────────────────────────────────────
    {
      id: 'general', level: 'general', icon: '🌐',
      name: { en: 'General Education', fr: 'Éducation générale', ar: 'تعليم عام' },
      lightModePalette: { accent: '#475569', iconBg: '#f3f4f6' },
      darkModePalette:  { accent: '#94a3b8', iconBg: '#1f2937' },
      categories: {}
    }
  ]
};