// Spanish MBTI Results Data
window.mbtiResults = {
    INTJ: {
        title: "El Arquitecto",
        description: "Pensadores imaginativos y estratégicos, con un plan para todo.",
        strengths: ["Independiente", "Creativo", "Decisivo", "Perfeccionista", "Pensamiento estratégico"],
        weaknesses: ["Terco", "Crítico", "Estrés perfeccionista", "Dificultad para expresar emociones"],
        compatible: ["ENFP", "ENTP", "INFJ"],
        famous: "Elon Musk, Mark Zuckerberg, Nikola Tesla"
    },
    INTP: {
        title: "El Pensador",
        description: "Inventores innovadores con una sed insaciable de conocimiento.",
        strengths: ["Lógico", "Objetivo", "Original", "Pensamiento flexible", "Curiosidad intelectual"],
        weaknesses: ["Indeciso", "Indiferente", "Insensible emocionalmente", "Ignora reglas", "Falta de practicidad"],
        compatible: ["ENTJ", "ESTJ", "INFJ"],
        famous: "Albert Einstein, Bill Gates, Charles Darwin"
    },
    ENTJ: {
        title: "El Comandante",
        description: "Líderes audaces, imaginativos y de voluntad fuerte, siempre encuentran un camino o crean uno.",
        strengths: ["Liderazgo", "Eficiencia", "Confianza", "Estratégico", "Decisivo"],
        weaknesses: ["Impaciente", "Terco", "Insensible emocionalmente", "Dominante", "Crítico"],
        compatible: ["INFP", "INTP", "ENFJ"],
        famous: "Steve Jobs, Gordon Ramsay, Napoleón"
    },
    ENTP: {
        title: "El Debatidor",
        description: "Pensadores inteligentes y curiosos que no pueden resistir un desafío intelectual.",
        strengths: ["Creativo", "Entusiasta", "Carismático", "Intelectual", "Adaptable"],
        weaknesses: ["Falta de concentración", "Sensible al estrés", "Argumentativo", "Falta de practicidad", "Odia la rutina"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "Thomas Edison, Leonardo da Vinci, Mark Twain"
    },
    INFJ: {
        title: "El Abogado",
        description: "Idealistas silenciosos y místicos, pero muy inspiradores e incansables.",
        strengths: ["Idealista", "Perspicaz", "Determinado", "Empático", "Creativo"],
        weaknesses: ["Sensible", "Extremadamente privado", "Perfeccionista", "Siempre necesita una causa", "Se agota fácilmente"],
        compatible: ["ENTP", "ENFP", "INTJ"],
        famous: "Martin Luther King Jr., Nelson Mandela, Madre Teresa"
    },
    INFP: {
        title: "El Mediador",
        description: "Altruistas poéticos y amables, siempre ansiosos por ayudar en una buena causa.",
        strengths: ["Idealista", "Empático", "Creativo", "Flexible", "Bondadoso"],
        weaknesses: ["Demasiado idealista", "Demasiado altruista", "Impractico", "Desorganizado", "Difícil de conocer"],
        compatible: ["ENFJ", "ENTJ", "INFJ"],
        famous: "William Shakespeare, J.R.R. Tolkien, Virginia Woolf"
    },
    ENFJ: {
        title: "El Protagonista",
        description: "Líderes carismáticos e inspiradores, capaces de hipnotizar a sus oyentes.",
        strengths: ["Liderazgo", "Empático", "Inspirador", "Comunicativo", "Carismático"],
        weaknesses: ["Demasiado idealista", "Demasiado sensible", "Fluctúa su autoestima", "Lucha por tomar decisiones difíciles"],
        compatible: ["INFP", "ISFP", "ENTP"],
        famous: "Barack Obama, Oprah Winfrey, John Lennon"
    },
    ENFP: {
        title: "El Activista",
        description: "Espíritus libres entusiastas, creativos y sociables, que siempre pueden encontrar una razón para sonreír.",
        strengths: ["Entusiasta", "Creativo", "Social", "Flexible", "Bondadoso"],
        weaknesses: ["Busca aprobación", "Desorganizado", "Estresante", "Emocional", "Independiente"],
        compatible: ["INTJ", "INFJ", "ENTJ"],
        famous: "Robin Williams, Ellen DeGeneres, Walt Disney"
    },
    ISTJ: {
        title: "El Logista",
        description: "Prácticos y orientados a los hechos, confiabilidad que no puede ser dudada.",
        strengths: ["Honesto", "Directo", "Fuerte voluntad", "Muy responsable", "Calmado"],
        weaknesses: ["Terco", "Insensible", "Siempre por el libro", "Juzga", "A menudo culpa a sí mismo"],
        compatible: ["ESFP", "ESTP", "ISFP"],
        famous: "Warren Buffett, Queen Elizabeth II, George Washington"
    },
    ISFJ: {
        title: "El Protector",
        description: "Protectores muy dedicados y cálidos, siempre listos para defender a sus seres queridos.",
        strengths: ["Solidario", "Confiable", "Paciente", "Imaginativo", "Observador"],
        weaknesses: ["Humilde", "Reprime sentimientos", "Sobrecarga", "Reacio al cambio", "Demasiado altruista"],
        compatible: ["ESTP", "ESFP", "ENFP"],
        famous: "Mother Teresa, Kate Middleton, Jimmy Carter"
    },
    ESTJ: {
        title: "El Ejecutivo",
        description: "Excelentes administradores, inigualables en la gestión de cosas o personas.",
        strengths: ["Dedicado", "Fuerte voluntad", "Directo", "Honesto", "Leal"],
        weaknesses: ["Inflexible", "Incómodo con lo inusual", "Juzga", "Demasiado enfocado en el estatus social"],
        compatible: ["ISFP", "ISTP", "INFP"],
        famous: "Frank Sinatra, John D. Rockefeller, Lyndon B. Johnson"
    },
    ESFJ: {
        title: "El Cónsul",
        description: "Extraordinariamente cariñosos, sociales y populares, siempre ansiosos por ayudar.",
        strengths: ["Fuerte sentido práctico", "Fuerte sentido del deber", "Muy leal", "Sensible", "Cálido"],
        weaknesses: ["Preocupado por su estatus social", "Inflexible", "Reacio al cambio", "Vulnerable a la crítica"],
        compatible: ["ISFP", "INFP", "ESTP"],
        famous: "Bill Clinton, Steve Harvey, Sarah Palin"
    },
    ISTP: {
        title: "El Virtuoso",
        description: "Experimentadores audaces y prácticos, maestros de todo tipo de herramientas.",
        strengths: ["Optimista", "Creativo", "Práctico", "Espontáneo", "Racional"],
        weaknesses: ["Terco", "Insensible", "Privado", "Reservado", "Fácilmente aburrido"],
        compatible: ["ESTJ", "ENTJ", "ESFJ"],
        famous: "Clint Eastwood, Tom Cruise, Daniel Craig"
    },
    ISFP: {
        title: "El Aventurero",
        description: "Artistas flexibles y encantadores, siempre listos para explorar nuevas posibilidades.",
        strengths: ["Encantador", "Sensible a otros", "Imaginativo", "Apasionado", "Curioso"],
        weaknesses: ["Fácilmente estresado", "Demasiado competitivo", "Fluctúa su autoestima", "Independiente"],
        compatible: ["ESTJ", "ESFJ", "ENFJ"],
        famous: "Audrey Hepburn, Barbra Streisand, Jacqueline Kennedy Onassis"
    },
    ESTP: {
        title: "El Empresario",
        description: "Inteligentes, enérgicos y muy perceptivos, verdaderamente disfrutan viviendo al límite.",
        strengths: ["Audaz", "Racional", "Práctico", "Original", "Perceptivo"],
        weaknesses: ["Insensible", "Impaciente", "Asume riesgos", "Desestructurado", "Puede perderse el panorama general"],
        compatible: ["ISFJ", "ISTJ", "INFJ"],
        famous: "Ernest Hemingway, Jack Nicholson, Madonna"
    },
    ESFP: {
        title: "El Animador",
        description: "Espontáneos, enérgicos y entusiastas, la vida nunca es aburrida a su alrededor.",
        strengths: ["Audaz", "Original", "Estético", "Habilidades prácticas", "Observador"],
        weaknesses: ["Sensible", "Evita el conflicto", "Fácilmente aburrido", "Mala planificación a largo plazo"],
        compatible: ["ISTJ", "ISFJ", "INTJ"],
        famous: "Marilyn Monroe, Elvis Presley, Jamie Foxx"
    }
};
