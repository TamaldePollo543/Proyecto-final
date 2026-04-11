export const SYLLABUS = [
    {
        id: "level-basic",
        title: "NIVEL BÁSICO (A1 - A2)",
        themeColor: "#2563eb",
        bgLight: "#eff6ff",
        sections: [
            {
                type: "Gramática",
                icon: "text-outline",
                topics: [
                    { id: "b-g-1", title: "Present Simple", description: "usos (hechos, rutinas), conjugación (he/she/it +s), adverbios de frecuencia (always, never, sometimes)" },
                    { id: "b-g-2", title: "Present Continuous", description: "acciones ahora mismo, planes futuros cercanos, diferencia con Present Simple" },
                    { id: "b-g-3", title: "Past Simple", description: "verbos regulares (-ed), verbos irregulares (lista básica), expresiones de tiempo (yesterday, last week)" },
                    { id: "b-g-4", title: "Future: Will vs Going to", description: "Will (predicciones, decisiones espontáneas), Going to (planes, evidencias)" },
                    { id: "b-g-5", title: "There is / There are", description: "afirmativo, negativo, preguntas, uso con some/any" },
                    { id: "b-g-6", title: "Pronombres Personales", description: "Subject (I, you, he...), Object (me, him, us...)" },
                    { id: "b-g-7", title: "Adjetivos Posesivos", description: "my, your, his, her, its, our, their" },
                    { id: "b-g-8", title: "Preposiciones de Lugar", description: "in, on, at, under, behind, next to, between" },
                    { id: "b-g-9", title: "Preposiciones de Tiempo", description: "at (hours), in (months/years), on (days/dates)" },
                    { id: "b-g-10", title: "This / That / These / Those", description: "demostrativos para distancia y número" }
                ]
            },
            {
                type: "Vocabulario",
                icon: "library-outline",
                topics: [
                    { id: "b-v-1", title: "Family", description: "mother, father, brother, sister, grandparents, cousin, aunt, uncle" },
                    { id: "b-v-2", title: "Daily Routine", description: "wake up, have breakfast, go to work, take a shower, go to bed" },
                    { id: "b-v-3", title: "Food and Drinks", description: "fruits, vegetables, meats, drinks, meals (breakfast, lunch, dinner)" },
                    { id: "b-v-4", title: "Clothes", description: "shirt, pants, dress, shoes, jacket, hat, socks" },
                    { id: "b-v-5", title: "Weather", description: "sunny, rainy, cloudy, windy, snowy, hot, cold, warm" }
                ]
            }
        ]
    },
    {
        id: "level-intermediate",
        title: "NIVEL INTERMEDIO (B1 - B2)",
        themeColor: "#10b981",
        bgLight: "#ecfdf5",
        sections: [
            {
                type: "Gramática",
                icon: "text-outline",
                topics: [
                    { id: "i-g-1", title: "Present Perfect", description: "experiencias (ever/never), cambios recientes (just/already/yet), duración (for/since)" },
                    { id: "i-g-2", title: "Present Perfect vs Past Simple", description: "cuándo usar cada uno, marcadores de tiempo (yesterday vs ever)" },
                    { id: "i-g-3", title: "Past Continuous", description: "acciones en progreso en el pasado, interrupciones (while/when)" },
                    { id: "i-g-4", title: "Past Perfect", description: "acción anterior a otra en pasado (had + past participle)" },
                    { id: "i-g-5", title: "Conditionals Type 0 y 1", description: "Zero (hechos generales: if + present), First (posibilidades reales: if + present, will)" },
                    { id: "i-g-6", title: "Conditionals Type 2", description: "situaciones hipotéticas en presente (if + past, would)" },
                    { id: "i-g-7", title: "Conditionals Type 3", description: "situaciones hipotéticas en pasado (if + past perfect, would have)" },
                    { id: "i-g-8", title: "Modal Verbs (1)", description: "can/could (habilidad, permiso), must/have to (obligación)" },
                    { id: "i-g-9", title: "Modal Verbs (2)", description: "should (consejo), might/may (posibilidad), would (cortesía, deseos)" },
                    { id: "i-g-10", title: "Comparative Adjectives", description: "short adjectives (-er), long adjectives (more), irregular (good/better, bad/worse)" },
                    { id: "i-g-11", title: "Superlative Adjectives", description: "the + est, the most, irregular (best, worst, farthest)" },
                    { id: "i-g-12", title: "Passive Voice (Present & Past)", description: "is/are/was/were + past participle, cuándo usar voz pasiva" },
                    { id: "i-g-13", title: "Reported Speech", description: "cambios de tiempos verbales, cambios de pronombres, say vs tell" },
                    { id: "i-g-14", title: "Questions Tags", description: "isn't it?, don't you?, haven't they? (uso y entonación)" },
                    { id: "i-g-15", title: "Relative Clauses", description: "who (personas), which (cosas), that (ambos), where (lugares)" }
                ]
            },
            {
                type: "Vocabulario",
                icon: "library-outline",
                topics: [
                    { id: "i-v-1", title: "Work and Jobs", description: "manager, employee, salary, meeting, deadline, resume, interview" },
                    { id: "i-v-2", title: "Travel and Tourism", description: "airport, ticket, luggage, hotel, reservation, sightseeing, passport" },
                    { id: "i-v-3", title: "Health and Body", description: "headache, fever, doctor, medicine, exercise, diet, symptoms" },
                    { id: "i-v-4", title: "Technology", description: "laptop, smartphone, app, website, download, update, password" },
                    { id: "i-v-5", title: "Feelings and Emotions", description: "excited, nervous, frustrated, proud, embarrassed, grateful, lonely" },
                    { id: "i-v-6", title: "Phrasal Verbs Comunes", description: "get up, look for, turn on, give up, run out of, look forward to" }
                ]
            }
        ]
    },
    {
        id: "level-advanced",
        title: "NIVEL AVANZADO (C1 - C2)",
        themeColor: "#8b5cf6",
        bgLight: "#f3e8ff",
        sections: [
            {
                type: "Gramática",
                icon: "text-outline",
                topics: [
                    { id: "a-g-1", title: "Inversion", description: "never have I seen..., not only... but also, only after..." },
                    { id: "a-g-2", title: "Mixed Conditionals", description: "past condition → present result, present condition → past result" },
                    { id: "a-g-3", title: "Wishes and Regrets", description: "I wish / If only (present, past, future)" },
                    { id: "a-g-4", title: "Gerunds vs Infinitives", description: "verbos seguidos de -ing, verbos seguidos de to, diferencia de significado" },
                    { id: "a-g-5", title: "Advanced Passive", description: "it is said that..., he is believed to be..., passive with get" },
                    { id: "a-g-6", title: "Causative Have/Get", description: "have something done, get someone to do something" },
                    { id: "a-g-7", title: "Modal Verbs (Perfect forms)", description: "must have, might have, could have, should have, would have" },
                    { id: "a-g-8", title: "Subjunctive", description: "I suggest that he go..., It's important that she be..." },
                    { id: "a-g-9", title: "Ellipsis and Substitution", description: "so do I, neither have I, I think so, I hope not" },
                    { id: "a-g-10", title: "Emphatic Structures", description: "what I need is..., the reason why is..., it was... that..." }
                ]
            },
            {
                type: "Vocabulario",
                icon: "library-outline",
                topics: [
                    { id: "a-v-1", title: "Business English", description: "negotiation, contract, stakeholder, ROI, strategy, merger, invoice" },
                    { id: "a-v-2", title: "Academic English", description: "thesis, hypothesis, methodology, analysis, citation, peer review" },
                    { id: "a-v-3", title: "Idioms (30 comunes)", description: "break the ice, hit the nail on the head, cost an arm and a leg" },
                    { id: "a-v-4", title: "Collocations Avanzadas", description: "make a decision, do business, take responsibility, pay attention" }
                ]
            }
        ]
    }
];
