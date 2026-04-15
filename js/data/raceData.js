// Dataset RACE (Reading Comprehension from Examinations) - Samples
export const RACE_DATA = [
    {
        id: "race_1",
        article: "The traditional way of learning is to sit in a classroom and listen to a teacher. However, online learning is becoming more popular. Students can study at home and choose their own time. This flexibility is great for people who have jobs or live far from a school. On the other hand, online learning requires a lot of self-discipline. Some students find it hard to stay motivated without the physical presence of a teacher and classmates.",
        questions: [
            "What is a major benefit of online learning mentioned in the text?",
            "What is a challenge of online learning?",
            "For whom is online learning particularly suitable?"
        ],
        options: [
            ["Physical presence of a teacher", "Flexibility in timing", "Living closer to school", "Traditional classroom atmosphere"],
            ["Too much discipline", "Lack of motivation", "Having a job", "Studying at home"],
            ["Students who live close to school", "People with full-time jobs or far locations", "Teachers in classrooms", "Students with no discipline"]
        ],
        answers: ["B", "B", "B"],
        explanations: [
            "El texto menciona que la flexibilidad es ideal para personas con trabajo o que viven lejos.",
            "El texto señala que algunos estudiantes encuentran difícil mantenerse motivados sin compañeros ni profesor físico.",
            "Específicamente menciona a personas con empleos o que viven lejos de las escuelas."
        ]
    },
    {
        id: "race_2",
        article: "Plastic pollution is a global problem. Millions of tons of plastic enter the oceans every year, harming marine life. Many animals mistake plastic for food, which can lead to injury or death. To solve this, many countries are banning single-use plastics like straws and bags. Recycling is also helpful, but reducing the amount of plastic we use in the first place is the most effective solution.",
        questions: [
            "Why is plastic dangerous for marine life?",
            "How are countries responding to plastic pollution?",
            "What is considered the most effective solution in the text?"
        ],
        options: [
            ["It helps them find food", "Animals mistake it for food and get hurt", "It makes the water warmer", "Animals use it to build homes"],
            ["Increasing plastic production", "Banning straws and plastic bags", "Exporting all plastic to other planets", "Ignoring the problem"],
            ["Recycling more", "Cleaning the oceans once a year", "Reducing plastic use from the beginning", "Using more plastic bags"]
        ],
        answers: ["B", "B", "C"],
        explanations: [
            "El texto explica que los animales confunden el plástico con comida, causándoles daño.",
            "Se menciona la prohibición de plásticos de un solo uso como pajitas y bolsas.",
            "El texto afirma que reducir el uso de plástico inicialmente es la solución más efectiva."
        ]
    },
    {
        id: "race_3",
        article: "The Great Wall of China is one of the world's most famous landmarks. It was built over many centuries to protect China from invasions. It is thousands of miles long and passes through mountains, deserts, and grasslands. Today, it is a major tourist attraction, but it also serves as a symbol of China's long history and strength.",
        questions: [
            "Why was the Great Wall of China originally built?",
            "What kind of terrain does the wall pass through?",
            "What does the wall represent today?"
        ],
        options: [
            ["To facilitate trade with other countries", "To protect China from invasions", "To provide homes for workers", "To mark the border of a desert"],
            ["Only through mountains", "Grasslands, mountains, and deserts", "Mostly through oceans", "Strictly in urban areas"],
            ["A modern office building", "A symbol of history and strength", "A failed defensive wall", "The birth of the internet"]
        ],
        answers: ["B", "B", "B"],
        explanations: [
            "El texto indica claramente que se construyó para proteger a China de invasiones.",
            "Menciona que atraviesa montañas, desiertos y praderas.",
            "Dice que sirve como símbolo de la larga historia y fortaleza de China."
        ]
    }
];
