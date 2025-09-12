// Portuguese MBTI Results Data
window.mbtiResults = {
    INTJ: {
        title: "O Arquiteto",
        description: "Pensadores imaginativos e estratégicos, com um plano para tudo.",
        strengths: ["Independente", "Criativo", "Decisivo", "Perfeccionista", "Pensamento estratégico"],
        weaknesses: ["Teimoso", "Crítico", "Estresse perfeccionista", "Dificuldade para expressar emoções"],
        compatible: ["ENFP", "ENTP", "INFJ"],
        famous: "Elon Musk, Mark Zuckerberg, Nikola Tesla"
    },
    INTP: {
        title: "O Pensador",
        description: "Inventores inovadores com uma sede insaciável de conhecimento.",
        strengths: ["Lógico", "Objetivo", "Original", "Pensamento flexível", "Curiosidade intelectual"],
        weaknesses: ["Indeciso", "Indiferente", "Insensível emocionalmente", "Ignora regras", "Falta de praticidade"],
        compatible: ["ENTJ", "ESTJ", "INFJ"],
        famous: "Albert Einstein, Bill Gates, Charles Darwin"
    },
    ENTJ: {
        title: "O Comandante",
        description: "Líderes ousados, imaginativos e de forte vontade, sempre encontram um caminho ou criam um.",
        strengths: ["Liderança", "Eficiência", "Confiança", "Estratégico", "Decisivo"],
        weaknesses: ["Impaciente", "Teimoso", "Insensível emocionalmente", "Dominante", "Crítico"],
        compatible: ["INFP", "INTP", "ENFJ"],
        famous: "Steve Jobs, Gordon Ramsay, Napoleão"
    },
    ENTP: {
        title: "O Debatedor",
        description: "Pensadores inteligentes e curiosos que não conseguem resistir a um desafio intelectual.",
        strengths: ["Criativo", "Entusiasmado", "Carismático", "Intelectual", "Adaptável"],
        weaknesses: ["Falta de foco", "Sensível ao estresse", "Argumentativo", "Falta de praticidade", "Odeia rotina"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "Thomas Edison, Leonardo da Vinci, Mark Twain"
    },
    INFJ: {
        title: "O Advogado",
        description: "Idealistas silenciosos e místicos, mas muito inspiradores e incansáveis.",
        strengths: ["Idealista", "Perspicaz", "Determinado", "Empático", "Criativo"],
        weaknesses: ["Sensível", "Extremamente privado", "Perfeccionista", "Sempre precisa de uma causa", "Se esgota facilmente"],
        compatible: ["ENTP", "ENFP", "INTJ"],
        famous: "Martin Luther King Jr., Nelson Mandela, Madre Teresa"
    },
    INFP: {
        title: "O Mediador",
        description: "Altruístas poéticos e gentis, sempre ansiosos para ajudar em uma boa causa.",
        strengths: ["Idealista", "Empático", "Criativo", "Flexível", "Bondoso"],
        weaknesses: ["Muito idealista", "Muito altruísta", "Impraticável", "Desorganizado", "Difícil de conhecer"],
        compatible: ["ENFJ", "ENTJ", "INFJ"],
        famous: "William Shakespeare, J.R.R. Tolkien, Virginia Woolf"
    },
    ENFJ: {
        title: "O Protagonista",
        description: "Líderes carismáticos e inspiradores, capazes de hipnotizar seus ouvintes.",
        strengths: ["Liderança", "Empático", "Inspirador", "Comunicativo", "Carismático"],
        weaknesses: ["Muito idealista", "Muito sensível", "Autoestima flutuante", "Luta para tomar decisões difíceis"],
        compatible: ["INFP", "ISFP", "ENTP"],
        famous: "Barack Obama, Oprah Winfrey, John Lennon"
    },
    ENFP: {
        title: "O Ativista",
        description: "Espíritos livres entusiasmados, criativos e sociáveis, que sempre podem encontrar uma razão para sorrir.",
        strengths: ["Entusiasmado", "Criativo", "Social", "Flexível", "Bondoso"],
        weaknesses: ["Busca aprovação", "Desorganizado", "Estressante", "Emocional", "Independente"],
        compatible: ["INTJ", "INFJ", "ENTJ"],
        famous: "Robin Williams, Ellen DeGeneres, Walt Disney"
    },
    ISTJ: {
        title: "O Logístico",
        description: "Práticos e focados em fatos, confiabilidade que não pode ser questionada.",
        strengths: ["Honesto", "Direto", "Forte vontade", "Muito responsável", "Calmo"],
        weaknesses: ["Teimoso", "Insensível", "Sempre pelas regras", "Julga", "Frequentemente se culpa"],
        compatible: ["ESFP", "ESTP", "ISFP"],
        famous: "Warren Buffett, Rainha Elizabeth II, George Washington"
    },
    ISFJ: {
        title: "O Protetor",
        description: "Protetores muito dedicados e calorosos, sempre prontos para defender seus entes queridos.",
        strengths: ["Solidário", "Confiável", "Paciente", "Imaginativo", "Observador"],
        weaknesses: ["Humilde", "Reprime sentimentos", "Sobrecarga", "Relutante à mudança", "Muito altruísta"],
        compatible: ["ESTP", "ESFP", "ENFP"],
        famous: "Madre Teresa, Kate Middleton, Jimmy Carter"
    },
    ESTJ: {
        title: "O Executivo",
        description: "Excelentes administradores, incomparáveis na gestão de coisas ou pessoas.",
        strengths: ["Dedicado", "Forte vontade", "Direto", "Honesto", "Leal"],
        weaknesses: ["Inflexível", "Desconfortável com o incomum", "Julga", "Muito focado em status social"],
        compatible: ["ISFP", "ISTP", "INFP"],
        famous: "Frank Sinatra, John D. Rockefeller, Lyndon B. Johnson"
    },
    ESFJ: {
        title: "O Cônsul",
        description: "Extraordinariamente carinhosos, sociais e populares, sempre ansiosos para ajudar.",
        strengths: ["Forte senso prático", "Forte senso de dever", "Muito leal", "Sensível", "Caloroso"],
        weaknesses: ["Preocupado com status social", "Inflexível", "Relutante à mudança", "Vulnerável à crítica"],
        compatible: ["ISFP", "INFP", "ESTP"],
        famous: "Bill Clinton, Steve Harvey, Sarah Palin"
    },
    ISTP: {
        title: "O Virtuoso",
        description: "Experimentadores ousados e práticos, mestres de todos os tipos de ferramentas.",
        strengths: ["Otimista", "Criativo", "Prático", "Espontâneo", "Racional"],
        weaknesses: ["Teimoso", "Insensível", "Privado", "Reservado", "Facilmente entediado"],
        compatible: ["ESTJ", "ENTJ", "ESFJ"],
        famous: "Clint Eastwood, Tom Cruise, Daniel Craig"
    },
    ISFP: {
        title: "O Aventureiro",
        description: "Artistas flexíveis e encantadores, sempre prontos para explorar novas possibilidades.",
        strengths: ["Encantador", "Sensível aos outros", "Imaginativo", "Apaixonado", "Curioso"],
        weaknesses: ["Facilmente estressado", "Muito competitivo", "Autoestima flutuante", "Independente"],
        compatible: ["ESTJ", "ESFJ", "ENFJ"],
        famous: "Audrey Hepburn, Barbra Streisand, Jacqueline Kennedy Onassis"
    },
    ESTP: {
        title: "O Empreendedor",
        description: "Inteligentes, enérgicos e muito perceptivos, verdadeiramente gostam de viver no limite.",
        strengths: ["Ousado", "Racional", "Prático", "Original", "Perceptivo"],
        weaknesses: ["Insensível", "Impaciente", "Assume riscos", "Desestruturado", "Pode perder o quadro geral"],
        compatible: ["ISFJ", "ISTJ", "INFJ"],
        famous: "Ernest Hemingway, Jack Nicholson, Madonna"
    },
    ESFP: {
        title: "O Animador",
        description: "Espontâneos, enérgicos e entusiasmados, a vida nunca é chata ao redor deles.",
        strengths: ["Ousado", "Original", "Estético", "Habilidades práticas", "Observador"],
        weaknesses: ["Sensível", "Evita conflito", "Facilmente entediado", "Planejamento de longo prazo ruim"],
        compatible: ["ISTJ", "ISFJ", "INTJ"],
        famous: "Marilyn Monroe, Elvis Presley, Jamie Foxx"
    }
};
