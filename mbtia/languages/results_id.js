// Indonesian MBTI Results Data
window.mbtiResults = {
    INTJ: {
        title: "Arsitek",
        description: "Pemikir imajinatif dan strategis, dengan rencana untuk segala hal.",
        strengths: ["Mandiri", "Kreatif", "Tegas", "Perfeksionis", "Pemikiran strategis"],
        weaknesses: ["Keras kepala", "Kritis", "Stres perfeksionis", "Sulit mengekspresikan emosi"],
        compatible: ["ENFP", "ENTP", "INFJ"],
        famous: "Elon Musk, Mark Zuckerberg, Nikola Tesla"
    },
    INTP: {
        title: "Pemikir",
        description: "Penemu inovatif dengan rasa haus akan pengetahuan yang tak pernah puas.",
        strengths: ["Logis", "Objektif", "Orisinal", "Pemikiran fleksibel", "Keingintahuan intelektual"],
        weaknesses: ["Ragu-ragu", "Acuh tak acuh", "Tidak sensitif secara emosional", "Mengabaikan aturan", "Kurang praktis"],
        compatible: ["ENTJ", "ESTJ", "INFJ"],
        famous: "Albert Einstein, Bill Gates, Charles Darwin"
    },
    ENTJ: {
        title: "Komandan",
        description: "Pemimpin yang berani, imajinatif dan berkemauan kuat, selalu menemukan jalan atau membuatnya.",
        strengths: ["Kepemimpinan", "Efisiensi", "Percaya diri", "Strategis", "Tegas"],
        weaknesses: ["Tidak sabar", "Keras kepala", "Tidak sensitif secara emosional", "Dominan", "Kritis"],
        compatible: ["INFP", "INTP", "ENFJ"],
        famous: "Steve Jobs, Gordon Ramsay, Napoleon"
    },
    ENTP: {
        title: "Debater",
        description: "Pemikir cerdas dan ingin tahu yang tidak bisa menolak tantangan intelektual.",
        strengths: ["Kreatif", "Antusias", "Karismatik", "Intelektual", "Dapat beradaptasi"],
        weaknesses: ["Kurang fokus", "Sensitif terhadap stres", "Suka berdebat", "Kurang praktis", "Benci rutinitas"],
        compatible: ["INFJ", "INTJ", "ENFJ"],
        famous: "Thomas Edison, Leonardo da Vinci, Mark Twain"
    },
    INFJ: {
        title: "Advokat",
        description: "Idealis yang tenang dan mistis, namun sangat menginspirasi dan tak kenal lelah.",
        strengths: ["Idealis", "Tajam", "Bertekad", "Empati", "Kreatif"],
        weaknesses: ["Sensitif", "Sangat pribadi", "Perfeksionis", "Selalu membutuhkan tujuan", "Mudah lelah"],
        compatible: ["ENTP", "ENFP", "INTJ"],
        famous: "Martin Luther King Jr., Nelson Mandela, Bunda Teresa"
    },
    INFP: {
        title: "Mediator",
        description: "Altruistik yang puitis dan baik hati, selalu bersemangat membantu untuk tujuan yang baik.",
        strengths: ["Idealis", "Empati", "Kreatif", "Fleksibel", "Baik hati"],
        weaknesses: ["Terlalu idealis", "Terlalu altruistik", "Tidak praktis", "Tidak terorganisir", "Sulit dipahami"],
        compatible: ["ENFJ", "ENTJ", "INFJ"],
        famous: "William Shakespeare, J.R.R. Tolkien, Virginia Woolf"
    },
    ENFJ: {
        title: "Protagonis",
        description: "Pemimpin yang karismatik dan menginspirasi, mampu memesona pendengarnya.",
        strengths: ["Kepemimpinan", "Empati", "Menginspirasi", "Komunikatif", "Karismatik"],
        weaknesses: ["Terlalu idealis", "Terlalu sensitif", "Harga diri berfluktuasi", "Kesulitan membuat keputusan sulit"],
        compatible: ["INFP", "ISFP", "ENTP"],
        famous: "Barack Obama, Oprah Winfrey, John Lennon"
    },
    ENFP: {
        title: "Aktivis",
        description: "Jiwa bebas yang antusias, kreatif dan sosial, yang selalu bisa menemukan alasan untuk tersenyum.",
        strengths: ["Antusias", "Kreatif", "Sosial", "Fleksibel", "Baik hati"],
        weaknesses: ["Mencari persetujuan", "Tidak terorganisir", "Stres", "Emosional", "Mandiri"],
        compatible: ["INTJ", "INFJ", "ENTJ"],
        famous: "Robin Williams, Ellen DeGeneres, Walt Disney"
    },
    ISTJ: {
        title: "Logistik",
        description: "Praktis dan berorientasi pada fakta, keandalan yang tidak dapat diragukan.",
        strengths: ["Jujur", "Langsung", "Berkemauan kuat", "Sangat bertanggung jawab", "Tenang"],
        weaknesses: ["Keras kepala", "Tidak sensitif", "Selalu mengikuti aturan", "Menghakimi", "Sering menyalahkan diri sendiri"],
        compatible: ["ESFP", "ESTP", "ISFP"],
        famous: "Warren Buffett, Ratu Elizabeth II, George Washington"
    },
    ISFJ: {
        title: "Pelindung",
        description: "Pelindung yang sangat setia dan hangat, selalu siap membela orang-orang terkasih.",
        strengths: ["Mendukung", "Dapat diandalkan", "Sabar", "Imajinatif", "Pengamat"],
        weaknesses: ["Merendah", "Menekan perasaan", "Kelebihan beban", "Enggan berubah", "Terlalu altruistik"],
        compatible: ["ESTP", "ESFP", "ENFP"],
        famous: "Bunda Teresa, Kate Middleton, Jimmy Carter"
    },
    ESTJ: {
        title: "Eksekutif",
        description: "Administrator yang luar biasa, tak tertandingi dalam mengelola hal atau orang.",
        strengths: ["Berdedikasi", "Berkemauan kuat", "Langsung", "Jujur", "Setia"],
        weaknesses: ["Tidak fleksibel", "Tidak nyaman dengan yang tidak biasa", "Menghakimi", "Terlalu fokus pada status sosial"],
        compatible: ["ISFP", "ISTP", "INFP"],
        famous: "Frank Sinatra, John D. Rockefeller, Lyndon B. Johnson"
    },
    ESFJ: {
        title: "Konsul",
        description: "Luar biasa peduli, sosial dan populer, selalu bersemangat membantu.",
        strengths: ["Rasa praktis yang kuat", "Rasa kewajiban yang kuat", "Sangat setia", "Sensitif", "Hangat"],
        weaknesses: ["Khawatir tentang status sosial", "Tidak fleksibel", "Enggan berubah", "Rentan terhadap kritik"],
        compatible: ["ISFP", "INFP", "ESTP"],
        famous: "Bill Clinton, Steve Harvey, Sarah Palin"
    },
    ISTP: {
        title: "Virtuoso",
        description: "Eksperimenter yang berani dan praktis, ahli dari semua jenis alat.",
        strengths: ["Optimis", "Kreatif", "Praktis", "Spontan", "Rasional"],
        weaknesses: ["Keras kepala", "Tidak sensitif", "Pribadi", "Tertutup", "Mudah bosan"],
        compatible: ["ESTJ", "ENTJ", "ESFJ"],
        famous: "Clint Eastwood, Tom Cruise, Daniel Craig"
    },
    ISFP: {
        title: "Petualang",
        description: "Seniman yang fleksibel dan menawan, selalu siap menjelajahi kemungkinan baru.",
        strengths: ["Menawan", "Sensitif terhadap orang lain", "Imajinatif", "Penuh gairah", "Ingin tahu"],
        weaknesses: ["Mudah stres", "Terlalu kompetitif", "Harga diri berfluktuasi", "Mandiri"],
        compatible: ["ESTJ", "ESFJ", "ENFJ"],
        famous: "Audrey Hepburn, Barbra Streisand, Jacqueline Kennedy Onassis"
    },
    ESTP: {
        title: "Pengusaha",
        description: "Cerdas, energik dan sangat perseptif, benar-benar menikmati hidup di tepi.",
        strengths: ["Berani", "Rasional", "Praktis", "Orisinal", "Perseptif"],
        weaknesses: ["Tidak sensitif", "Tidak sabar", "Mengambil risiko", "Tidak terstruktur", "Mungkin kehilangan gambaran besar"],
        compatible: ["ISFJ", "ISTJ", "INFJ"],
        famous: "Ernest Hemingway, Jack Nicholson, Madonna"
    },
    ESFP: {
        title: "Penghibur",
        description: "Spontan, energik dan antusias, hidup tidak pernah membosankan di sekitar mereka.",
        strengths: ["Berani", "Orisinal", "Estetis", "Keterampilan praktis", "Pengamat"],
        weaknesses: ["Sensitif", "Menghindari konflik", "Mudah bosan", "Perencanaan jangka panjang yang buruk"],
        compatible: ["ISTJ", "ISFJ", "INTJ"],
        famous: "Marilyn Monroe, Elvis Presley, Jamie Foxx"
    }
};
