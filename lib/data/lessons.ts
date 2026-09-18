import type { Lesson } from "@/lib/types";

/**
 * The first 30 days of the 90-day program, authored in full (brief §29: the
 * MVP ships 30 lessons). Days 31–84 are described in `curriculum.ts` so the
 * Learn page can show the whole three-month map with later weeks locked.
 *
 * Content rule followed throughout: explanations are plain Thai about *when to
 * use* a sentence, never grammar terminology (§9 Stage 2).
 */
export const LESSONS: Lesson[] = [
  // ══════════════════ WEEK 1 — Basic Sentences ══════════════════
  {
    id: "d1",
    day: 1,
    month: 1,
    week: 1,
    title: { en: "Introducing Yourself", th: "แนะนำตัวเอง" },
    description: {
      en: "The four sentences you need the first time you meet someone.",
      th: "สี่ประโยคที่ต้องใช้ตอนเจอใครครั้งแรก",
    },
    level: "A1",
    category: "basics",
    estimatedMinutes: 15,
    patterns: ["I am ...", "I work ...", "Nice to meet you."],
    phrases: [
      {
        id: "d1p1",
        en: "Hi, I'm Nut. Nice to meet you.",
        th: "สวัสดีครับ ผมณัฐ ยินดีที่ได้รู้จัก",
        pronunciation: "ไฮ-ไอม์-นัท ไนซ์-ทู-มีท-ยู",
        usageTh:
          "ใช้ทักทายครั้งแรกได้ทุกสถานการณ์ ทั้งในที่ทำงานและนอกที่ทำงาน ปลอดภัยที่สุด",
      },
      {
        id: "d1p2",
        en: "I'm a software developer.",
        th: "ผมเป็น software developer",
        pronunciation: "ไอม์-อะ-ซอฟท์แวร์-ดีเวลลอปเปอร์",
        usageTh:
          "บอกอาชีพ ใช้ I'm a + อาชีพ อย่าลืมคำว่า a ข้างหน้า คนไทยมักลืมคำนี้",
      },
      {
        id: "d1p3",
        en: "I work at a startup in Bangkok.",
        th: "ผมทำงานที่สตาร์ทอัพในกรุงเทพ",
        pronunciation: "ไอ-เวิร์ค-แอท-อะ-สตาร์ทอัพ-อิน-แบงคอก",
        usageTh:
          "บอกที่ทำงาน ใช้ work at + ชื่อบริษัท หรือ work at a + ประเภทบริษัท",
      },
      {
        id: "d1p4",
        en: "I've been a developer for three years.",
        th: "ผมเป็น developer มาสามปีแล้ว",
        pronunciation: "ไอฟ์-บีน-อะ-ดีเวลลอปเปอร์-ฟอร์-ทรี-เยียร์ส",
        usageTh:
          "บอกว่าทำมานานแค่ไหนและยังทำอยู่ ใช้ for + ระยะเวลา เช่น for three years",
      },
    ],
    practice: [
      {
        id: "d1q1",
        question: "Hi! Nice to meet you. What's your name?",
        questionTh: "สวัสดี ยินดีที่ได้รู้จัก คุณชื่ออะไร",
        hints: ["Hi, I'm ...", "Nice to meet you too."],
        sampleAnswer: "Hi, I'm Nut. Nice to meet you too.",
      },
      {
        id: "d1q2",
        question: "So, what do you do?",
        questionTh: "แล้วคุณทำงานอะไรเหรอ",
        hints: ["I'm a ...", "I work at ..."],
        sampleAnswer: "I'm a software developer. I work at a startup in Bangkok.",
      },
    ],
    vocabularyIds: ["v-introduce"],
  },
  {
    id: "d2",
    day: 2,
    month: 1,
    week: 1,
    title: { en: "What Do You Do?", th: "คุณทำงานอะไร" },
    description: {
      en: "Say what your job is and what you build, in two sentences.",
      th: "บอกว่าคุณทำงานอะไร และสร้างอะไรอยู่ ด้วยสองประโยค",
    },
    level: "A1",
    category: "basics",
    estimatedMinutes: 15,
    patterns: ["I work as ...", "I build ...", "I'm responsible for ..."],
    phrases: [
      {
        id: "d2p1",
        en: "I work as a backend developer.",
        th: "ผมทำงานเป็น backend developer",
        usageTh: "work as + ตำแหน่ง ใช้ตอนอยากเน้นว่าทำหน้าที่อะไร",
      },
      {
        id: "d2p2",
        en: "I build APIs for a hotel booking app.",
        th: "ผมสร้าง API ให้แอปจองโรงแรม",
        usageTh:
          "บอกว่าสร้างอะไร ใช้ I build + สิ่งที่ทำ + for + โปรเจกต์ที่มันอยู่",
      },
      {
        id: "d2p3",
        en: "I'm responsible for the payment system.",
        th: "ผมรับผิดชอบระบบการจ่ายเงิน",
        usageTh:
          "บอกส่วนที่เราดูแล ใช้ responsible for + สิ่งนั้น ประโยคนี้ใช้ในสัมภาษณ์งานได้ด้วย",
      },
      {
        id: "d2p4",
        en: "I mostly work with TypeScript and Node.js.",
        th: "ส่วนใหญ่ผมทำงานกับ TypeScript และ Node.js",
        usageTh: "บอกเทคโนโลยีที่ใช้ ใช้ work with + ชื่อภาษาหรือเครื่องมือ",
      },
    ],
    practice: [
      {
        id: "d2q1",
        question: "What do you do at your company?",
        questionTh: "ที่บริษัทคุณทำอะไร",
        hints: ["I work as ...", "I'm responsible for ..."],
        sampleAnswer:
          "I work as a backend developer. I'm responsible for the payment system.",
      },
      {
        id: "d2q2",
        question: "What technologies do you use?",
        questionTh: "คุณใช้เทคโนโลยีอะไรบ้าง",
        hints: ["I mostly work with ...", "I also use ..."],
        sampleAnswer: "I mostly work with TypeScript and Node.js.",
      },
    ],
    vocabularyIds: ["v-responsible"],
  },
  {
    id: "d3",
    day: 3,
    month: 1,
    week: 1,
    title: { en: "Where Do You Work?", th: "คุณทำงานที่ไหน" },
    description: {
      en: "Talk about your company, your team, and where you sit.",
      th: "พูดถึงบริษัท ทีม และที่ที่คุณนั่งทำงาน",
    },
    level: "A1",
    category: "basics",
    estimatedMinutes: 15,
    patterns: ["I work at ...", "We are a team of ...", "I work from ..."],
    phrases: [
      {
        id: "d3p1",
        en: "I work at a fintech company.",
        th: "ผมทำงานที่บริษัท fintech",
        usageTh: "work at + บริษัท ใช้บอกว่าอยู่บริษัทไหนหรือประเภทไหน",
      },
      {
        id: "d3p2",
        en: "We're a team of six engineers.",
        th: "ทีมเรามีวิศวกรหกคน",
        usageTh: "บอกขนาดทีม ใช้ a team of + จำนวน + คนตำแหน่งอะไร",
      },
      {
        id: "d3p3",
        en: "I work from home two days a week.",
        th: "ผมทำงานที่บ้านสัปดาห์ละสองวัน",
        usageTh:
          "บอกรูปแบบการทำงาน ใช้ two days a week แปลว่าสัปดาห์ละสองวัน",
      },
      {
        id: "d3p4",
        en: "Our office is near Asok station.",
        th: "ออฟฟิศเราอยู่ใกล้สถานีอโศก",
        usageTh: "บอกที่ตั้ง ใช้ near + สถานที่ แปลว่าใกล้กับ",
      },
    ],
    practice: [
      {
        id: "d3q1",
        question: "Where do you work?",
        questionTh: "คุณทำงานที่ไหน",
        hints: ["I work at ...", "Our office is ..."],
        sampleAnswer: "I work at a fintech company. Our office is near Asok station.",
      },
      {
        id: "d3q2",
        question: "How big is your team?",
        questionTh: "ทีมคุณใหญ่แค่ไหน",
        hints: ["We're a team of ..."],
        sampleAnswer: "We're a team of six engineers.",
      },
    ],
    vocabularyIds: [],
  },
  {
    id: "d4",
    day: 4,
    month: 1,
    week: 1,
    title: { en: "Talking About Your Family", th: "พูดถึงครอบครัว" },
    description: {
      en: "Small talk about family — a safe topic when you meet coworkers.",
      th: "คุยเรื่องครอบครัวแบบเบา ๆ หัวข้อที่ปลอดภัยตอนเจอเพื่อนร่วมงาน",
    },
    level: "A1",
    category: "basics",
    estimatedMinutes: 12,
    patterns: ["I have ...", "I live with ...", "My ... is ..."],
    phrases: [
      {
        id: "d4p1",
        en: "I have one older sister.",
        th: "ผมมีพี่สาวหนึ่งคน",
        usageTh: "บอกจำนวนพี่น้อง ใช้ I have + จำนวน + ความสัมพันธ์",
      },
      {
        id: "d4p2",
        en: "I live with my parents in Nonthaburi.",
        th: "ผมอยู่กับพ่อแม่ที่นนทบุรี",
        usageTh: "บอกว่าอยู่กับใคร ใช้ live with + คน + in + สถานที่",
      },
      {
        id: "d4p3",
        en: "My sister is a nurse.",
        th: "พี่สาวผมเป็นพยาบาล",
        usageTh: "บอกอาชีพคนอื่น ใช้ My + ความสัมพันธ์ + is a + อาชีพ",
      },
      {
        id: "d4p4",
        en: "We usually have dinner together on Sundays.",
        th: "เรามักกินข้าวเย็นด้วยกันวันอาทิตย์",
        usageTh: "เล่ากิจกรรมที่ทำประจำ ใช้ on + วัน เติม s เมื่อทำทุกสัปดาห์",
      },
    ],
    practice: [
      {
        id: "d4q1",
        question: "Do you have any brothers or sisters?",
        questionTh: "คุณมีพี่น้องไหม",
        hints: ["I have ...", "No, I'm an only child."],
        sampleAnswer: "Yes, I have one older sister. She's a nurse.",
      },
      {
        id: "d4q2",
        question: "Who do you live with?",
        questionTh: "คุณอยู่กับใคร",
        hints: ["I live with ...", "I live alone in ..."],
        sampleAnswer: "I live with my parents in Nonthaburi.",
      },
    ],
    vocabularyIds: ["v-usually"],
  },
  {
    id: "d5",
    day: 5,
    month: 1,
    week: 1,
    title: { en: "Talking About Your Hobbies", th: "พูดถึงงานอดิเรก" },
    description: {
      en: "What you like doing when you're not at the keyboard.",
      th: "สิ่งที่คุณชอบทำตอนไม่ได้อยู่หน้าคีย์บอร์ด",
    },
    level: "A1",
    category: "basics",
    estimatedMinutes: 12,
    patterns: ["I like ...", "I enjoy ...", "In my free time, I ..."],
    phrases: [
      {
        id: "d5p1",
        en: "I like playing badminton.",
        th: "ผมชอบเล่นแบดมินตัน",
        usageTh:
          "หลัง like ใช้กริยาเติม -ing เช่น playing, reading, cooking จำเป็นชุดไปเลย",
      },
      {
        id: "d5p2",
        en: "In my free time, I watch tech videos on YouTube.",
        th: "เวลาว่างผมดูคลิปสายเทคใน YouTube",
        usageTh:
          "ขึ้นต้นด้วย In my free time เพื่อบอกว่าเป็นสิ่งที่ทำตอนว่าง แล้วตามด้วยประโยคปกติ",
      },
      {
        id: "d5p3",
        en: "I'm learning to cook Thai food properly.",
        th: "ผมกำลังหัดทำอาหารไทยให้เป็นจริงจัง",
        usageTh:
          "ใช้ I'm learning to + กริยา เมื่อกำลังหัดทำอะไรอยู่ในช่วงนี้",
      },
      {
        id: "d5p4",
        en: "I'm not really into video games.",
        th: "ผมไม่ค่อยอินกับเกมเท่าไหร่",
        usageTh:
          "be into แปลว่าชอบหรืออิน ถ้าไม่ชอบใช้ not really into ฟังดูสุภาพกว่าบอกว่า I don't like",
      },
    ],
    practice: [
      {
        id: "d5q1",
        question: "What do you do in your free time?",
        questionTh: "เวลาว่างคุณทำอะไร",
        hints: ["In my free time, I ...", "I like ...ing"],
        sampleAnswer: "In my free time, I like playing badminton with my friends.",
      },
      {
        id: "d5q2",
        question: "Have you picked up any new hobbies this year?",
        questionTh: "ปีนี้คุณมีงานอดิเรกใหม่ไหม",
        hints: ["I'm learning to ...", "Not really, I still ..."],
        sampleAnswer: "Yes, I'm learning to cook Thai food properly.",
      },
    ],
    vocabularyIds: [],
  },
  {
    id: "d6",
    day: 6,
    month: 1,
    week: 1,
    title: { en: "Daily Routine", th: "กิจวัตรประจำวัน" },
    description: {
      en: "Describe an ordinary working day from morning to evening.",
      th: "เล่าวันทำงานธรรมดา ๆ ตั้งแต่เช้าจนเย็น",
    },
    level: "A1",
    category: "basics",
    estimatedMinutes: 15,
    patterns: ["I usually ...", "I start ... at ...", "After that, I ..."],
    phrases: [
      {
        id: "d6p1",
        en: "I usually wake up at seven.",
        th: "ปกติผมตื่นเจ็ดโมง",
        usageTh: "usually วางไว้หน้ากริยา แปลว่าทำเป็นประจำ",
      },
      {
        id: "d6p2",
        en: "I start work at nine and check my emails first.",
        th: "ผมเริ่มงานเก้าโมง แล้วเช็กอีเมลก่อน",
        usageTh: "ใช้ and เชื่อมสองสิ่งที่ทำต่อกันในประโยคเดียว",
      },
      {
        id: "d6p3",
        en: "After lunch, I have my daily standup.",
        th: "หลังมื้อเที่ยงผมมี standup ประจำวัน",
        usageTh: "After + ช่วงเวลา ใช้บอกลำดับว่าอะไรเกิดหลังอะไร",
      },
      {
        id: "d6p4",
        en: "I finish around six, but sometimes later.",
        th: "ผมเลิกงานประมาณหกโมง แต่บางทีก็ดึกกว่านั้น",
        usageTh: "around + เวลา แปลว่าประมาณ ใช้เมื่อไม่ตรงเป๊ะ",
      },
    ],
    practice: [
      {
        id: "d6q1",
        question: "What does a normal working day look like for you?",
        questionTh: "วันทำงานปกติของคุณเป็นยังไง",
        hints: ["I usually ...", "I start work at ...", "After that, I ..."],
        sampleAnswer:
          "I usually wake up at seven and start work at nine. After lunch, I have my daily standup.",
      },
      {
        id: "d6q2",
        question: "What time do you finish work?",
        questionTh: "คุณเลิกงานกี่โมง",
        hints: ["I finish around ..."],
        sampleAnswer: "I finish around six, but sometimes later.",
      },
    ],
    vocabularyIds: ["v-usually", "v-standup"],
  },
  {
    id: "d7",
    day: 7,
    month: 1,
    week: 1,
    title: { en: "Week 1 Review", th: "ทบทวนสัปดาห์ที่ 1" },
    description: {
      en: "Put the week together: who you are, what you do, and your day.",
      th: "รวมทุกอย่างของสัปดาห์นี้ คุณเป็นใคร ทำอะไร และวันหนึ่งเป็นยังไง",
    },
    level: "A1",
    category: "basics",
    estimatedMinutes: 20,
    patterns: ["I am ...", "I work ...", "I like ...", "I usually ..."],
    phrases: [
      {
        id: "d7p1",
        en: "I'm Nut, and I'm a backend developer at a fintech company.",
        th: "ผมณัฐ เป็น backend developer อยู่ที่บริษัท fintech",
        usageTh: "รวมชื่อกับอาชีพไว้ในประโยคเดียว ใช้ and เชื่อม",
      },
      {
        id: "d7p2",
        en: "I've been doing this for about three years.",
        th: "ผมทำงานนี้มาประมาณสามปีแล้ว",
        usageTh: "about + ระยะเวลา แปลว่าประมาณ ใช้ตอนไม่อยากพูดเป๊ะ",
      },
      {
        id: "d7p3",
        en: "Outside of work, I play badminton and cook.",
        th: "นอกเวลางานผมเล่นแบดกับทำอาหาร",
        usageTh: "Outside of work ใช้ขึ้นต้นเพื่อพูดถึงเรื่องนอกงาน",
      },
    ],
    practice: [
      {
        id: "d7q1",
        question: "Tell me a little about yourself.",
        questionTh: "เล่าเรื่องตัวเองให้ฟังหน่อย",
        hints: ["I'm ... and I'm a ...", "I've been ... for ...", "Outside of work, I ..."],
        sampleAnswer:
          "I'm Nut, and I'm a backend developer at a fintech company. I've been doing this for about three years. Outside of work, I play badminton and cook.",
      },
      {
        id: "d7q2",
        question: "Walk me through a typical day for you.",
        questionTh: "เล่าวันทำงานทั่วไปของคุณให้ฟังหน่อย",
        hints: ["I usually ...", "I start work at ...", "I finish around ..."],
        sampleAnswer:
          "I usually wake up at seven and start work at nine. After lunch I have my standup, and I finish around six.",
      },
    ],
    vocabularyIds: ["v-introduce", "v-usually"],
  },

  // ══════════════════ WEEK 2 — Talking About Yourself ══════════════════
  {
    id: "d8",
    day: 8,
    month: 1,
    week: 2,
    title: { en: "My Job", th: "งานของฉัน" },
    description: {
      en: "Go one level deeper than your job title.",
      th: "เล่าให้ลึกกว่าแค่ชื่อตำแหน่ง",
    },
    level: "A1",
    category: "self",
    estimatedMinutes: 15,
    patterns: ["My job is to ...", "I spend most of my time ...", "I work closely with ..."],
    phrases: [
      {
        id: "d8p1",
        en: "My job is to build and maintain our APIs.",
        th: "งานของผมคือสร้างและดูแล API ของเรา",
        usageTh: "My job is to + กริยา ใช้สรุปหน้าที่หลักในหนึ่งประโยค",
      },
      {
        id: "d8p2",
        en: "I spend most of my time writing backend code.",
        th: "ส่วนใหญ่ผมใช้เวลาไปกับการเขียนโค้ดฝั่ง backend",
        usageTh: "spend time + กริยาเติม -ing ใช้บอกว่าหมดเวลาไปกับอะไร",
      },
      {
        id: "d8p3",
        en: "I work closely with the frontend team.",
        th: "ผมทำงานใกล้ชิดกับทีม frontend",
        usageTh: "work closely with + ทีมหรือคน ใช้บอกว่าต้องประสานงานกับใคร",
      },
      {
        id: "d8p4",
        en: "Part of my job is reviewing other people's code.",
        th: "ส่วนหนึ่งของงานผมคือรีวิวโค้ดคนอื่น",
        usageTh: "Part of my job is + กริยาเติม -ing ใช้บอกงานรองที่ยังต้องทำ",
      },
    ],
    practice: [
      {
        id: "d8q1",
        question: "What does your job actually involve day to day?",
        questionTh: "จริง ๆ แล้วงานคุณต้องทำอะไรบ้างในแต่ละวัน",
        hints: ["My job is to ...", "I spend most of my time ..."],
        sampleAnswer:
          "My job is to build and maintain our APIs. I spend most of my time writing backend code.",
      },
      {
        id: "d8q2",
        question: "Who do you work with most?",
        questionTh: "คุณทำงานกับใครมากที่สุด",
        hints: ["I work closely with ..."],
        sampleAnswer: "I work closely with the frontend team.",
      },
    ],
    vocabularyIds: ["v-responsible", "v-merge"],
  },
  {
    id: "d9",
    day: 9,
    month: 1,
    week: 2,
    title: { en: "My Skills", th: "ทักษะของฉัน" },
    description: {
      en: "Say what you're good at without sounding arrogant or shy.",
      th: "บอกสิ่งที่เราถนัด โดยไม่ฟังดูโอ้อวดและไม่ถ่อมเกินไป",
    },
    level: "A2",
    category: "self",
    estimatedMinutes: 15,
    patterns: ["I'm good at ...", "I'm comfortable with ...", "I'm still learning ..."],
    phrases: [
      {
        id: "d9p1",
        en: "I'm good at debugging tricky problems.",
        th: "ผมถนัดเรื่องไล่บั๊กปัญหายาก ๆ",
        usageTh: "good at + กริยาเติม -ing ใช้บอกสิ่งที่เราทำได้ดี",
      },
      {
        id: "d9p2",
        en: "I'm comfortable with SQL and database design.",
        th: "ผมทำ SQL และออกแบบฐานข้อมูลได้สบาย",
        usageTh:
          "comfortable with ฟังดูถ่อมตัวกว่า good at ใช้ตอนไม่อยากดูโอ้อวด",
      },
      {
        id: "d9p3",
        en: "I'm still learning about system design.",
        th: "ผมยังเรียนรู้เรื่อง system design อยู่",
        usageTh:
          "still learning ใช้ยอมรับว่ายังไม่เก่ง แบบมืออาชีพ ฝรั่งมองว่าเป็นข้อดี",
      },
      {
        id: "d9p4",
        en: "I'd like to get better at writing tests.",
        th: "ผมอยากเก่งเรื่องเขียนเทสต์ให้มากขึ้น",
        usageTh: "get better at + กริยาเติม -ing ใช้บอกสิ่งที่อยากพัฒนา",
      },
    ],
    practice: [
      {
        id: "d9q1",
        question: "What would you say you're best at?",
        questionTh: "คุณคิดว่าตัวเองเก่งเรื่องอะไรที่สุด",
        hints: ["I'm good at ...", "I'm comfortable with ..."],
        sampleAnswer:
          "I'm good at debugging tricky problems, and I'm comfortable with SQL.",
      },
      {
        id: "d9q2",
        question: "Is there anything you want to improve?",
        questionTh: "มีอะไรที่อยากพัฒนาไหม",
        hints: ["I'm still learning ...", "I'd like to get better at ..."],
        sampleAnswer:
          "I'm still learning about system design, and I'd like to get better at writing tests.",
      },
    ],
    vocabularyIds: ["v-improve"],
  },
  {
    id: "d10",
    day: 10,
    month: 1,
    week: 2,
    title: { en: "My Daily Routine at Work", th: "กิจวัตรที่ทำงาน" },
    description: {
      en: "The shape of your working day, in the order it happens.",
      th: "ลำดับการทำงานของคุณในหนึ่งวัน เรียงตามที่เกิดขึ้นจริง",
    },
    level: "A2",
    category: "self",
    estimatedMinutes: 15,
    patterns: ["First, I ...", "Then I ...", "By the end of the day, I ..."],
    phrases: [
      {
        id: "d10p1",
        en: "First, I check Slack and my pull requests.",
        th: "อย่างแรกผมเช็ก Slack กับ pull request ของตัวเอง",
        usageTh: "First ใช้ขึ้นต้นสิ่งแรกที่ทำ ตามด้วยเครื่องหมายจุลภาค",
      },
      {
        id: "d10p2",
        en: "Then I join the standup at ten.",
        th: "จากนั้นผมเข้า standup ตอนสิบโมง",
        usageTh: "Then ใช้เชื่อมสิ่งที่ทำต่อจากอันแรก ไม่ต้องมีจุลภาคก็ได้",
      },
      {
        id: "d10p3",
        en: "After that, I work on my tickets until lunch.",
        th: "หลังจากนั้นผมทำ ticket ของตัวเองจนถึงเที่ยง",
        usageTh: "After that ใช้เชื่อมลำดับถัดไป until + เวลา แปลว่าจนถึง",
      },
      {
        id: "d10p4",
        en: "By the end of the day, I try to push my changes.",
        th: "ก่อนจบวันผมพยายาม push โค้ดที่แก้ไว้",
        usageTh: "By the end of the day ใช้บอกสิ่งที่ตั้งใจทำให้เสร็จก่อนเลิกงาน",
      },
    ],
    practice: [
      {
        id: "d10q1",
        question: "How do you usually start your working day?",
        questionTh: "ปกติคุณเริ่มวันทำงานยังไง",
        hints: ["First, I ...", "Then I ..."],
        sampleAnswer:
          "First, I check Slack and my pull requests. Then I join the standup at ten.",
      },
      {
        id: "d10q2",
        question: "And how does your day usually end?",
        questionTh: "แล้วจบวันยังไง",
        hints: ["By the end of the day, I ..."],
        sampleAnswer: "By the end of the day, I try to push my changes.",
      },
    ],
    vocabularyIds: ["v-standup", "v-merge"],
  },
  {
    id: "d11",
    day: 11,
    month: 1,
    week: 2,
    title: { en: "What I Did Today", th: "วันนี้ฉันทำอะไรไปบ้าง" },
    description: {
      en: "Report today's work — the exact skill a standup needs.",
      th: "รายงานงานของวันนี้ ทักษะเดียวกับที่ใช้ใน standup",
    },
    level: "A2",
    category: "self",
    estimatedMinutes: 15,
    patterns: ["Today I finished ...", "I've been working on ...", "I haven't started ... yet."],
    phrases: [
      {
        id: "d11p1",
        en: "Today I finished the login screen.",
        th: "วันนี้ผมทำหน้า login เสร็จ",
        usageTh:
          "finished ใช้กับงานที่ทำเสร็จแล้ว จบไปแล้วจริง ๆ ไม่ต้องทำต่อ",
      },
      {
        id: "d11p2",
        en: "I've been working on the search feature all morning.",
        th: "ผมทำฟีเจอร์ค้นหามาทั้งเช้าแล้ว",
        usageTh:
          "I've been working on ใช้กับงานที่เริ่มไปแล้วและยังทำต่ออยู่ ต่างจาก finished",
      },
      {
        id: "d11p3",
        en: "I fixed two bugs and opened a pull request.",
        th: "ผมแก้บั๊กไปสองตัวแล้วเปิด pull request",
        usageTh:
          "เล่างานที่ทำเสร็จหลายอย่าง ใช้กริยาช่องสองทั้งคู่ เชื่อมด้วย and",
      },
      {
        id: "d11p4",
        en: "I haven't started the tests yet.",
        th: "ผมยังไม่ได้เริ่มเขียนเทสต์เลย",
        usageTh: "haven't + กริยาช่องสาม + yet ใช้บอกสิ่งที่ยังไม่ได้ทำ",
      },
    ],
    practice: [
      {
        id: "d11q1",
        question: "What did you get done today?",
        questionTh: "วันนี้ทำอะไรเสร็จบ้าง",
        hints: ["Today I finished ...", "I fixed ...", "I haven't ... yet."],
        sampleAnswer:
          "Today I finished the login screen and fixed two bugs. I haven't started the tests yet.",
      },
      {
        id: "d11q2",
        question: "What are you in the middle of right now?",
        questionTh: "ตอนนี้กำลังทำอะไรค้างอยู่",
        hints: ["I've been working on ..."],
        sampleAnswer: "I've been working on the search feature all morning.",
      },
    ],
    vocabularyIds: ["v-merge", "v-currently"],
  },
  {
    id: "d12",
    day: 12,
    month: 1,
    week: 2,
    title: { en: "Talking About Your Work", th: "พูดถึงงานที่ทำ" },
    description: {
      en: "Say what you worked on yesterday, using the past correctly.",
      th: "เล่าว่าเมื่อวานทำอะไร โดยใช้รูปอดีตให้ถูก",
    },
    level: "A2",
    category: "self",
    estimatedMinutes: 15,
    patterns: ["Yesterday I worked on ...", "I spent the day ...", "It took me ..."],
    phrases: [
      {
        id: "d12p1",
        en: "Yesterday, I worked on the payment API.",
        th: "เมื่อวานผมทำ payment API",
        usageTh:
          "มี yesterday ต้องเปลี่ยน work เป็น worked เสมอ ภาษาไทยไม่ผันกริยา ตรงนี้คนไทยพลาดบ่อยที่สุด",
      },
      {
        id: "d12p2",
        en: "I spent most of the day debugging.",
        th: "ผมหมดเวลาไปกับการไล่บั๊กเกือบทั้งวัน",
        usageTh: "spent the day + กริยาเติม -ing ใช้บอกว่าวันนั้นหมดไปกับอะไร",
      },
      {
        id: "d12p3",
        en: "It took me longer than I expected.",
        th: "มันใช้เวลานานกว่าที่คิดไว้",
        usageTh:
          "It took me + ระยะเวลา ใช้บอกว่าใช้เวลาเท่าไหร่ ประโยคนี้ใช้ตอนงานช้าได้ดีมาก",
      },
      {
        id: "d12p4",
        en: "In the end, I got it working.",
        th: "สุดท้ายก็ทำให้มันทำงานได้",
        usageTh: "In the end ใช้ขึ้นต้นตอนเล่าผลลัพธ์สุดท้าย",
      },
    ],
    practice: [
      {
        id: "d12q1",
        question: "What did you work on yesterday?",
        questionTh: "เมื่อวานคุณทำอะไร",
        hints: ["Yesterday, I worked on ...", "I spent most of the day ..."],
        sampleAnswer:
          "Yesterday, I worked on the payment API. I spent most of the day debugging.",
      },
      {
        id: "d12q2",
        question: "Did it go smoothly?",
        questionTh: "ราบรื่นไหม",
        hints: ["It took me ...", "In the end, I ..."],
        sampleAnswer: "It took me longer than I expected, but in the end I got it working.",
      },
    ],
    vocabularyIds: ["v-endpoint", "v-request"],
  },
  {
    id: "d13",
    day: 13,
    month: 1,
    week: 2,
    title: { en: "My Weekend", th: "วันหยุดของฉัน" },
    description: {
      en: "The Monday morning question every office asks.",
      th: "คำถามเช้าวันจันทร์ที่ทุกออฟฟิศต้องถาม",
    },
    level: "A2",
    category: "self",
    estimatedMinutes: 12,
    patterns: ["I went ...", "I stayed ...", "It was ..."],
    phrases: [
      {
        id: "d13p1",
        en: "I went to Chiang Mai with my friends.",
        th: "ผมไปเชียงใหม่กับเพื่อน",
        usageTh: "go เปลี่ยนเป็น went เมื่อเล่าเรื่องอดีต ไม่ใช่ goed",
      },
      {
        id: "d13p2",
        en: "I mostly stayed home and rested.",
        th: "ส่วนใหญ่ผมอยู่บ้านพักผ่อน",
        usageTh: "stayed home ไม่ต้องมี at ข้างหน้า home ใช้แบบนี้ได้เลย",
      },
      {
        id: "d13p3",
        en: "It was pretty relaxing, actually.",
        th: "จริง ๆ แล้วก็ค่อนข้างชิลนะ",
        usageTh:
          "pretty + คำคุณศัพท์ แปลว่าค่อนข้าง ส่วน actually วางท้ายเพื่อให้ฟังเป็นกันเอง",
      },
      {
        id: "d13p4",
        en: "How about you? How was your weekend?",
        th: "แล้วคุณล่ะ วันหยุดเป็นยังไงบ้าง",
        usageTh:
          "ถามกลับด้วย How about you? สำคัญมาก การสนทนาจะได้ไม่จบลงห้วน ๆ",
      },
    ],
    practice: [
      {
        id: "d13q1",
        question: "How was your weekend?",
        questionTh: "วันหยุดเป็นยังไงบ้าง",
        hints: ["I went ...", "I mostly stayed ...", "It was ..."],
        sampleAnswer:
          "It was good. I mostly stayed home and rested. It was pretty relaxing. How about you?",
      },
      {
        id: "d13q2",
        question: "Did you do anything interesting?",
        questionTh: "ได้ทำอะไรน่าสนใจบ้างไหม",
        hints: ["I went to ...", "Not really, I just ..."],
        sampleAnswer: "Yes, I went to Chiang Mai with my friends.",
      },
    ],
    vocabularyIds: ["v-actually"],
  },
  {
    id: "d14",
    day: 14,
    month: 1,
    week: 2,
    title: { en: "Week 2 Review", th: "ทบทวนสัปดาห์ที่ 2" },
    description: {
      en: "Combine job, skills and what you did — a mini self-introduction.",
      th: "รวมเรื่องงาน ทักษะ และสิ่งที่ทำ เป็นการแนะนำตัวแบบย่อ",
    },
    level: "A2",
    category: "self",
    estimatedMinutes: 20,
    patterns: ["My job is to ...", "I'm good at ...", "Yesterday I worked on ..."],
    phrases: [
      {
        id: "d14p1",
        en: "My job is to build APIs, and I'm good at debugging.",
        th: "งานผมคือสร้าง API และผมถนัดเรื่องไล่บั๊ก",
        usageTh: "รวมหน้าที่กับจุดแข็งในประโยคเดียว เชื่อมด้วย and",
      },
      {
        id: "d14p2",
        en: "Yesterday I worked on the payment API, and today I'm testing it.",
        th: "เมื่อวานผมทำ payment API วันนี้กำลังเทสต์อยู่",
        usageTh:
          "สังเกตว่า yesterday ใช้ worked ส่วน today ใช้ I'm testing เพราะยังทำอยู่",
      },
    ],
    practice: [
      {
        id: "d14q1",
        question: "Tell me about your job and what you're good at.",
        questionTh: "เล่าเรื่องงานและสิ่งที่คุณถนัดให้ฟังหน่อย",
        hints: ["My job is to ...", "I'm good at ...", "I'm still learning ..."],
        sampleAnswer:
          "My job is to build and maintain our APIs. I'm good at debugging, and I'm still learning about system design.",
      },
      {
        id: "d14q2",
        question: "What did you work on yesterday, and what about today?",
        questionTh: "เมื่อวานทำอะไร แล้ววันนี้ล่ะ",
        hints: ["Yesterday I worked on ...", "Today I'm ...ing"],
        sampleAnswer:
          "Yesterday I worked on the payment API, and today I'm testing it.",
      },
    ],
    vocabularyIds: ["v-responsible", "v-improve"],
  },

  // ══════════════════ WEEK 3 — Time ══════════════════
  {
    id: "d15",
    day: 15,
    month: 1,
    week: 3,
    title: { en: "Present — What's Happening Now", th: "ปัจจุบัน — สิ่งที่เกิดขึ้นตอนนี้" },
    description: {
      en: "The single most useful pattern at work: I'm working on ...",
      th: "รูปประโยคที่ใช้บ่อยที่สุดในที่ทำงาน: I'm working on ...",
    },
    level: "A2",
    category: "time",
    estimatedMinutes: 15,
    patterns: ["I'm working on ...", "I'm trying to ...", "Right now, I'm ..."],
    phrases: [
      {
        id: "d15p1",
        en: "I'm working on a new feature.",
        th: "ผมกำลังทำฟีเจอร์ใหม่อยู่",
        pronunciation: "ไอม์-เวิร์คกิ้ง-ออน-อะ-นิว-ฟีเจอร์",
        usageTh:
          "ใช้พูดถึงสิ่งที่กำลังทำอยู่ตอนนี้ ห้ามลืม I'm เด็ดขาด พูดว่า I working ไม่ได้",
      },
      {
        id: "d15p2",
        en: "Right now, I'm testing the new endpoint.",
        th: "ตอนนี้ผมกำลังเทสต์ endpoint ใหม่อยู่",
        usageTh: "Right now ใช้เน้นว่าทำอยู่จริง ๆ ณ วินาทีนี้",
      },
      {
        id: "d15p3",
        en: "I'm trying to figure out why it's slow.",
        th: "ผมกำลังพยายามหาสาเหตุว่าทำไมมันช้า",
        usageTh:
          "I'm trying to figure out ใช้บอกว่ากำลังหาคำตอบอยู่ ยังไม่รู้ ประโยคนี้ช่วยได้มากตอนงานติด",
      },
      {
        id: "d15p4",
        en: "I'm not working on that anymore.",
        th: "ผมไม่ได้ทำอันนั้นแล้ว",
        usageTh: "เติม not หลัง I'm เพื่อทำเป็นปฏิเสธ anymore แปลว่าไม่แล้ว",
      },
    ],
    practice: [
      {
        id: "d15q1",
        question: "What are you working on right now?",
        questionTh: "ตอนนี้กำลังทำอะไรอยู่",
        hints: ["I'm working on ...", "Right now, I'm ...ing"],
        sampleAnswer: "Right now, I'm working on the search feature.",
      },
      {
        id: "d15q2",
        question: "Is anything giving you trouble at the moment?",
        questionTh: "ตอนนี้มีอะไรที่ทำให้ติดขัดไหม",
        hints: ["I'm trying to figure out ..."],
        sampleAnswer: "Yes, I'm trying to figure out why the page is slow.",
      },
    ],
    vocabularyIds: ["v-currently", "v-endpoint"],
  },
  {
    id: "d16",
    day: 16,
    month: 1,
    week: 3,
    title: { en: "Past — What You Did", th: "อดีต — สิ่งที่ทำไปแล้ว" },
    description: {
      en: "Changing the verb for the past — the mistake Thai speakers make most.",
      th: "การผันกริยาเป็นอดีต จุดที่คนไทยพลาดบ่อยที่สุด",
    },
    level: "A2",
    category: "time",
    estimatedMinutes: 15,
    patterns: ["I worked on ...", "I finished ...", "I didn't ..."],
    phrases: [
      {
        id: "d16p1",
        en: "I worked on the login flow last week.",
        th: "สัปดาห์ที่แล้วผมทำ flow การ login",
        usageTh:
          "เมื่อพูดถึงเรื่องที่จบไปแล้ว เติม -ed ที่กริยา work จึงกลายเป็น worked",
      },
      {
        id: "d16p2",
        en: "I finished it on Thursday.",
        th: "ผมทำเสร็จวันพฤหัส",
        usageTh: "on + วันในสัปดาห์ ใช้บอกว่าทำวันไหน",
      },
      {
        id: "d16p3",
        en: "I found the bug, but I didn't fix it yet.",
        th: "ผมเจอบั๊กแล้ว แต่ยังไม่ได้แก้",
        usageTh:
          "find กลายเป็น found ส่วนหลัง didn't กริยากลับไปเป็นรูปปกติ พูดว่า didn't fix ไม่ใช่ didn't fixed",
      },
      {
        id: "d16p4",
        en: "It took about two days.",
        th: "ใช้เวลาประมาณสองวัน",
        usageTh: "take กลายเป็น took ใช้บอกว่าใช้เวลาไปเท่าไหร่",
      },
    ],
    practice: [
      {
        id: "d16q1",
        question: "What did you work on last week?",
        questionTh: "สัปดาห์ที่แล้วคุณทำอะไร",
        hints: ["I worked on ...", "I finished ... on ..."],
        sampleAnswer: "I worked on the login flow and finished it on Thursday.",
      },
      {
        id: "d16q2",
        question: "Did you fix the bug you mentioned?",
        questionTh: "บั๊กที่บอกไว้แก้แล้วหรือยัง",
        hints: ["I found ... but I didn't ... yet."],
        sampleAnswer: "I found the bug, but I didn't fix it yet.",
      },
    ],
    vocabularyIds: ["v-reproduce"],
  },
  {
    id: "d17",
    day: 17,
    month: 1,
    week: 3,
    title: { en: "Future — What You Will Do", th: "อนาคต — สิ่งที่จะทำ" },
    description: {
      en: "Two ways to talk about the future, and when each one fits.",
      th: "สองวิธีพูดถึงอนาคต และแต่ละแบบใช้ตอนไหน",
    },
    level: "A2",
    category: "time",
    estimatedMinutes: 15,
    patterns: ["I will ...", "I'm going to ...", "I'll probably ..."],
    phrases: [
      {
        id: "d17p1",
        en: "I'll send you the link after the meeting.",
        th: "ผมจะส่งลิงก์ให้หลังประชุม",
        usageTh:
          "I'll ใช้ตอนตัดสินใจเดี๋ยวนั้น ยังไม่ได้วางแผนมาก่อน ฟังดูเป็นธรรมชาติกว่า I will เต็ม ๆ",
      },
      {
        id: "d17p2",
        en: "I'm going to start the new task tomorrow.",
        th: "พรุ่งนี้ผมจะเริ่มงานใหม่",
        usageTh:
          "I'm going to ใช้ตอนวางแผนไว้แล้ว ต่างจาก I'll ที่เพิ่งตัดสินใจ",
      },
      {
        id: "d17p3",
        en: "I'll probably finish by Friday.",
        th: "ผมน่าจะเสร็จภายในวันศุกร์",
        usageTh:
          "probably วางหลัง I'll ใช้ตอนไม่มั่นใจร้อยเปอร์เซ็นต์ ปลอดภัยกว่าการรับปากเต็มที่",
      },
      {
        id: "d17p4",
        en: "I won't have time for that this week.",
        th: "สัปดาห์นี้ผมคงไม่มีเวลาทำอันนั้น",
        usageTh: "won't คือ will not ใช้ปฏิเสธเรื่องอนาคตอย่างสุภาพ",
      },
    ],
    practice: [
      {
        id: "d17q1",
        question: "What are you going to work on tomorrow?",
        questionTh: "พรุ่งนี้จะทำอะไร",
        hints: ["I'm going to ...", "I'll probably ..."],
        sampleAnswer: "I'm going to start the new task tomorrow.",
      },
      {
        id: "d17q2",
        question: "When do you think you'll be done?",
        questionTh: "คิดว่าจะเสร็จเมื่อไหร่",
        hints: ["I'll probably finish by ...", "I won't ..."],
        sampleAnswer: "I'll probably finish by Friday.",
      },
    ],
    vocabularyIds: ["v-probably", "v-deadline"],
  },
  {
    id: "d18",
    day: 18,
    month: 1,
    week: 3,
    title: { en: "Plans", th: "การวางแผน" },
    description: {
      en: "Talk about what you intend to do, and what depends on what.",
      th: "พูดถึงสิ่งที่ตั้งใจจะทำ และอะไรขึ้นอยู่กับอะไร",
    },
    level: "A2",
    category: "time",
    estimatedMinutes: 15,
    patterns: ["I'm planning to ...", "First ... then ...", "It depends on ..."],
    phrases: [
      {
        id: "d18p1",
        en: "I'm planning to refactor this service next sprint.",
        th: "ผมวางแผนจะ refactor service นี้ใน sprint หน้า",
        usageTh: "planning to + กริยารูปปกติ ใช้บอกแผนที่คิดไว้แล้ว",
      },
      {
        id: "d18p2",
        en: "First I'll finish the API, then I'll write the tests.",
        th: "ผมจะทำ API ให้เสร็จก่อน แล้วค่อยเขียนเทสต์",
        usageTh: "First ... then ... ใช้เรียงลำดับว่าจะทำอะไรก่อนหลัง",
      },
      {
        id: "d18p3",
        en: "It depends on when the design is ready.",
        th: "ขึ้นอยู่กับว่าดีไซน์จะเสร็จเมื่อไหร่",
        usageTh:
          "depend คู่กับ on เสมอ ประโยคนี้ใช้เลี่ยงการรับปากเวลาที่เรายังไม่แน่ใจ",
      },
      {
        id: "d18p4",
        en: "If everything goes well, we can release on Monday.",
        th: "ถ้าทุกอย่างไปได้ดี เราน่าจะปล่อยได้วันจันทร์",
        usageTh:
          "If + ประโยค, ประโยคหลัก ใช้พูดถึงเงื่อนไข สังเกตว่าหลัง if ใช้กริยาปัจจุบัน",
      },
    ],
    practice: [
      {
        id: "d18q1",
        question: "What's your plan for this sprint?",
        questionTh: "sprint นี้คุณวางแผนไว้ยังไง",
        hints: ["I'm planning to ...", "First ... then ..."],
        sampleAnswer:
          "I'm planning to finish the API first, then I'll write the tests.",
      },
      {
        id: "d18q2",
        question: "Can we release next week?",
        questionTh: "สัปดาห์หน้าปล่อยได้ไหม",
        hints: ["It depends on ...", "If everything goes well, ..."],
        sampleAnswer:
          "It depends on when the design is ready. If everything goes well, we can release on Monday.",
      },
    ],
    vocabularyIds: ["v-refactor", "v-priority"],
  },
  {
    id: "d19",
    day: 19,
    month: 1,
    week: 3,
    title: { en: "Yesterday in Detail", th: "เล่าเรื่องเมื่อวานแบบละเอียด" },
    description: {
      en: "Tell a short story about yesterday, in order, without freezing.",
      th: "เล่าเรื่องเมื่อวานสั้น ๆ เรียงลำดับได้ ไม่ตื้อกลางคัน",
    },
    level: "A2",
    category: "time",
    estimatedMinutes: 15,
    patterns: ["In the morning I ...", "Then ...", "By the afternoon ..."],
    phrases: [
      {
        id: "d19p1",
        en: "In the morning, I reviewed two pull requests.",
        th: "ตอนเช้าผมรีวิว pull request ไปสองอัน",
        usageTh: "In the morning ใช้ขึ้นต้นบอกช่วงเวลา ตามด้วยจุลภาค",
      },
      {
        id: "d19p2",
        en: "Then I had a call with the product team.",
        th: "จากนั้นผมมีประชุมกับทีม product",
        usageTh: "have กลายเป็น had ในอดีต have a call แปลว่ามีประชุมสาย",
      },
      {
        id: "d19p3",
        en: "By the afternoon, I was stuck on a weird error.",
        th: "พอถึงบ่ายผมก็ติดอยู่กับ error แปลก ๆ",
        usageTh:
          "be stuck on แปลว่าติดอยู่กับอะไร ในอดีตใช้ was stuck ประโยคนี้ใช้ใน standup ได้เลย",
      },
      {
        id: "d19p4",
        en: "I asked my teammate and we solved it together.",
        th: "ผมถามเพื่อนร่วมทีม แล้วเราก็แก้ด้วยกัน",
        usageTh: "ask + คน ไม่ต้องมี to ตามหลัง พูดว่า ask my teammate ได้เลย",
      },
    ],
    practice: [
      {
        id: "d19q1",
        question: "Walk me through what you did yesterday.",
        questionTh: "เล่าให้ฟังหน่อยว่าเมื่อวานทำอะไรไปบ้าง",
        hints: ["In the morning, I ...", "Then ...", "By the afternoon, ..."],
        sampleAnswer:
          "In the morning, I reviewed two pull requests. Then I had a call with the product team. By the afternoon, I was stuck on a weird error.",
      },
      {
        id: "d19q2",
        question: "How did you get unstuck?",
        questionTh: "แล้วหลุดจากที่ติดได้ยังไง",
        hints: ["I asked ...", "We solved it ..."],
        sampleAnswer: "I asked my teammate and we solved it together.",
      },
    ],
    vocabularyIds: ["v-blocker", "v-merge"],
  },
  {
    id: "d20",
    day: 20,
    month: 1,
    week: 3,
    title: { en: "Tomorrow", th: "พรุ่งนี้" },
    description: {
      en: "Commit to tomorrow's work without over-promising.",
      th: "บอกงานพรุ่งนี้โดยไม่รับปากเกินตัว",
    },
    level: "A2",
    category: "time",
    estimatedMinutes: 15,
    patterns: ["Tomorrow I'll ...", "I hope to ...", "I should be able to ..."],
    phrases: [
      {
        id: "d20p1",
        en: "Tomorrow I'll continue with the search feature.",
        th: "พรุ่งนี้ผมจะทำฟีเจอร์ค้นหาต่อ",
        usageTh: "continue with + งาน ใช้บอกว่าจะทำสิ่งเดิมต่อ",
      },
      {
        id: "d20p2",
        en: "I hope to finish it by the end of the week.",
        th: "ผมหวังว่าจะเสร็จภายในสิ้นสัปดาห์",
        usageTh:
          "hope to + กริยา ใช้ตอนอยากให้เป็นแบบนั้นแต่ไม่กล้ารับปาก ปลอดภัยกว่า I will",
      },
      {
        id: "d20p3",
        en: "I should be able to start testing on Wednesday.",
        th: "ผมน่าจะเริ่มเทสต์ได้วันพุธ",
        usageTh:
          "should be able to ใช้บอกว่าน่าจะทำได้ แต่ยังไม่ร้อยเปอร์เซ็นต์ ฝรั่งใช้กันบ่อยมากในที่ทำงาน",
      },
      {
        id: "d20p4",
        en: "I'll let you know if anything changes.",
        th: "ถ้ามีอะไรเปลี่ยนผมจะแจ้งให้ทราบ",
        usageTh:
          "I'll let you know ใช้ปิดท้ายการรับงาน ทำให้ดูรับผิดชอบและเป็นมืออาชีพ",
      },
    ],
    practice: [
      {
        id: "d20q1",
        question: "What's on your plate tomorrow?",
        questionTh: "พรุ่งนี้มีอะไรต้องทำบ้าง",
        hints: ["Tomorrow I'll ...", "I hope to ..."],
        sampleAnswer:
          "Tomorrow I'll continue with the search feature. I hope to finish it by the end of the week.",
      },
      {
        id: "d20q2",
        question: "Can you commit to Wednesday?",
        questionTh: "รับปากวันพุธได้ไหม",
        hints: ["I should be able to ...", "I'll let you know if ..."],
        sampleAnswer:
          "I should be able to start testing on Wednesday. I'll let you know if anything changes.",
      },
    ],
    vocabularyIds: ["v-deadline", "v-followup"],
  },
  {
    id: "d21",
    day: 21,
    month: 1,
    week: 3,
    title: { en: "Week 3 Review — Past, Present, Future", th: "ทบทวนสัปดาห์ที่ 3 — อดีต ปัจจุบัน อนาคต" },
    description: {
      en: "Three sentences, three times — the core of every standup.",
      th: "สามประโยค สามช่วงเวลา หัวใจของ standup ทุกครั้ง",
    },
    level: "A2",
    category: "time",
    estimatedMinutes: 20,
    patterns: [
      "Yesterday, I worked on ...",
      "Today, I'm working on ...",
      "Tomorrow, I'll ...",
    ],
    phrases: [
      {
        id: "d21p1",
        en: "Yesterday, I worked on the payment API.",
        th: "เมื่อวานผมทำ payment API",
        usageTh: "อดีต ใช้ worked เพราะจบไปแล้ว",
      },
      {
        id: "d21p2",
        en: "Today, I'm working on the tests.",
        th: "วันนี้ผมกำลังเขียนเทสต์อยู่",
        usageTh: "ปัจจุบัน ใช้ I'm working เพราะยังทำอยู่",
      },
      {
        id: "d21p3",
        en: "Tomorrow, I'll start the documentation.",
        th: "พรุ่งนี้ผมจะเริ่มเขียนเอกสาร",
        usageTh: "อนาคต ใช้ I'll เพราะยังไม่เกิดขึ้น",
      },
    ],
    practice: [
      {
        id: "d21q1",
        question: "Give me your update: yesterday, today, and tomorrow.",
        questionTh: "อัปเดตหน่อย เมื่อวาน วันนี้ และพรุ่งนี้",
        hints: [
          "Yesterday, I worked on ...",
          "Today, I'm working on ...",
          "Tomorrow, I'll ...",
        ],
        sampleAnswer:
          "Yesterday, I worked on the payment API. Today, I'm working on the tests. Tomorrow, I'll start the documentation.",
      },
      {
        id: "d21q2",
        question: "Anything slowing you down?",
        questionTh: "มีอะไรทำให้ช้าลงไหม",
        hints: ["I'm trying to figure out ...", "It depends on ..."],
        sampleAnswer: "Not really. I'm just trying to figure out one failing test.",
      },
    ],
    vocabularyIds: ["v-currently", "v-standup"],
  },

  // ══════════════════ WEEK 4 — Basic Conversation ══════════════════
  {
    id: "d22",
    day: 22,
    month: 1,
    week: 4,
    title: { en: "Asking Questions", th: "การถามคำถาม" },
    description: {
      en: "Keep a conversation alive by asking, not just answering.",
      th: "ทำให้บทสนทนาไปต่อได้ ด้วยการถามกลับ ไม่ใช่แค่ตอบ",
    },
    level: "A2",
    category: "conversation",
    estimatedMinutes: 15,
    patterns: ["What ...?", "How ...?", "Do you ...?"],
    phrases: [
      {
        id: "d22p1",
        en: "What are you working on at the moment?",
        th: "ตอนนี้คุณทำอะไรอยู่",
        usageTh: "คำถามที่ถามเพื่อนร่วมงานได้เสมอ ปลอดภัยและเปิดบทสนทนาได้ดี",
      },
      {
        id: "d22p2",
        en: "How long have you been working here?",
        th: "คุณทำงานที่นี่มานานแค่ไหนแล้ว",
        usageTh: "How long have you been + กริยาเติม -ing ใช้ถามระยะเวลา",
      },
      {
        id: "d22p3",
        en: "Do you know who owns this service?",
        th: "คุณรู้ไหมว่าใครดูแล service นี้",
        usageTh:
          "Do you know who ... ใช้ถามหาข้อมูล สุภาพกว่าการถามตรง ๆ ว่า Who owns this?",
      },
      {
        id: "d22p4",
        en: "What do you think about this approach?",
        th: "คุณคิดยังไงกับวิธีนี้",
        usageTh:
          "What do you think about ... ใช้ขอความเห็น ไม่ใช่ How do you think ซึ่งผิด",
      },
    ],
    practice: [
      {
        id: "d22q1",
        question: "I just joined the team last month.",
        questionTh: "ผมเพิ่งเข้าทีมเมื่อเดือนที่แล้วเอง",
        hints: ["What are you working on ...?", "How long ...?"],
        sampleAnswer: "Welcome! What are you working on at the moment?",
      },
      {
        id: "d22q2",
        question: "We're thinking about moving to a new database.",
        questionTh: "เรากำลังคิดจะย้ายไปใช้ฐานข้อมูลใหม่",
        hints: ["What do you think about ...?", "Do you know ...?"],
        sampleAnswer: "Interesting. What do you think about that approach?",
      },
    ],
    vocabularyIds: ["v-clarify"],
  },
  {
    id: "d23",
    day: 23,
    month: 1,
    week: 4,
    title: { en: "Answering Questions", th: "การตอบคำถาม" },
    description: {
      en: "Answer with more than one word, even when you're unsure.",
      th: "ตอบให้ยาวกว่าคำเดียว แม้ตอนที่ยังไม่มั่นใจ",
    },
    level: "A2",
    category: "conversation",
    estimatedMinutes: 15,
    patterns: ["Yes, and ...", "Not yet, but ...", "I'm not sure, but ..."],
    phrases: [
      {
        id: "d23p1",
        en: "Yes, and I've already tested it.",
        th: "ใช่ครับ แล้วผมก็เทสต์ไปแล้วด้วย",
        usageTh:
          "ตอบ Yes แล้วต่อด้วย and เพื่อเพิ่มข้อมูล อย่าตอบแค่ Yes คำเดียว จะดูห้วน",
      },
      {
        id: "d23p2",
        en: "Not yet, but I'll do it today.",
        th: "ยังครับ แต่วันนี้จะทำให้",
        usageTh:
          "Not yet, but ... ใช้ตอนยังไม่ได้ทำ แต่ต้องบอกว่าจะทำเมื่อไหร่ด้วย จะดูรับผิดชอบ",
      },
      {
        id: "d23p3",
        en: "I'm not sure, but I think it's in the auth service.",
        th: "ผมไม่แน่ใจ แต่คิดว่าน่าจะอยู่ใน auth service",
        usageTh:
          "I'm not sure, but I think ... ใช้ตอบตอนไม่มั่นใจ ดีกว่าเงียบหรือบอกว่า I don't know เฉย ๆ",
      },
      {
        id: "d23p4",
        en: "Let me check and get back to you.",
        th: "ขอเช็กก่อนแล้วจะกลับมาบอก",
        usageTh:
          "get back to you แปลว่าจะกลับมาตอบทีหลัง เป็นประโยคช่วยชีวิตตอนตอบไม่ได้",
      },
    ],
    practice: [
      {
        id: "d23q1",
        question: "Have you deployed the fix?",
        questionTh: "deploy ตัวแก้ไปหรือยัง",
        hints: ["Yes, and ...", "Not yet, but ..."],
        sampleAnswer: "Not yet, but I'll do it today.",
      },
      {
        id: "d23q2",
        question: "Where is the token validated?",
        questionTh: "token ถูกตรวจสอบที่ไหน",
        hints: ["I'm not sure, but I think ...", "Let me check and ..."],
        sampleAnswer:
          "I'm not sure, but I think it's in the auth service. Let me check and get back to you.",
      },
    ],
    vocabularyIds: ["v-deploy", "v-authentication"],
  },
  {
    id: "d24",
    day: 24,
    month: 1,
    week: 4,
    title: { en: "Asking for Clarification", th: "การขอให้อธิบายเพิ่ม" },
    description: {
      en: "Ask what someone means without feeling embarrassed.",
      th: "ถามว่าอีกฝ่ายหมายถึงอะไร โดยไม่ต้องรู้สึกอาย",
    },
    level: "A2",
    category: "conversation",
    estimatedMinutes: 15,
    patterns: ["What do you mean by ...?", "Can you explain ...?", "So you're saying ...?"],
    phrases: [
      {
        id: "d24p1",
        en: "What do you mean by 'soon'?",
        th: "คำว่า soon นี่หมายถึงเมื่อไหร่",
        usageTh:
          "What do you mean by + คำที่ไม่เข้าใจ ใช้ถามเฉพาะคำนั้น ไม่ต้องถามทั้งประโยค",
      },
      {
        id: "d24p2",
        en: "Can you explain that a bit more?",
        th: "ช่วยขยายความอีกนิดได้ไหม",
        usageTh: "a bit more แปลว่าอีกนิดหน่อย ทำให้คำขอฟังดูเบาและสุภาพ",
      },
      {
        id: "d24p3",
        en: "So you're saying we should wait for the design?",
        th: "แปลว่าคุณหมายถึงให้รอดีไซน์ก่อนใช่ไหม",
        usageTh:
          "So you're saying ... ใช้ทวนความเข้าใจของเรา เป็นวิธีเช็กว่าเข้าใจตรงกันที่ดีที่สุด",
      },
      {
        id: "d24p4",
        en: "Sorry, just to make sure I understand correctly —",
        th: "ขอโทษนะ ขอเช็กให้แน่ใจว่าเข้าใจถูกนะครับ",
        usageTh:
          "ใช้ขึ้นต้นก่อนทวนสิ่งที่เข้าใจ ฟังดูเป็นมืออาชีพ ไม่ได้ดูว่าเราโง่",
      },
    ],
    practice: [
      {
        id: "d24q1",
        question: "We need to ship this soon.",
        questionTh: "เราต้องปล่อยอันนี้เร็ว ๆ นี้",
        hints: ["What do you mean by ...?"],
        sampleAnswer: "What do you mean by 'soon'? Do you mean this week?",
      },
      {
        id: "d24q2",
        question:
          "The plan is to hold off on the migration until the API is stable.",
        questionTh: "แผนคือจะยังไม่ทำ migration จนกว่า API จะนิ่ง",
        hints: ["So you're saying ...?", "Just to make sure I understand —"],
        sampleAnswer:
          "Just to make sure I understand correctly — so you're saying we should wait until the API is stable?",
      },
    ],
    vocabularyIds: ["v-clarify", "v-migration"],
  },
  {
    id: "d25",
    day: 25,
    month: 1,
    week: 4,
    title: { en: "Saying You Don't Understand", th: "บอกว่าฟังไม่เข้าใจ" },
    description: {
      en: "The most important survival phrases in an English meeting.",
      th: "ประโยคเอาตัวรอดที่สำคัญที่สุดในการประชุมภาษาอังกฤษ",
    },
    level: "A2",
    category: "conversation",
    estimatedMinutes: 15,
    patterns: ["I'm not sure I understand.", "I didn't catch that.", "Could you ...?"],
    phrases: [
      {
        id: "d25p1",
        en: "I'm not sure I understand.",
        th: "ผมไม่แน่ใจว่าเข้าใจถูกไหม",
        usageTh:
          "สุภาพกว่าการพูดว่า I don't understand มาก และไม่ได้ทำให้เราดูแย่เลย",
      },
      {
        id: "d25p2",
        en: "Sorry, I didn't catch that.",
        th: "ขอโทษครับ ผมฟังไม่ทัน",
        usageTh:
          "catch แปลว่าฟังทัน ใช้ตอนได้ยินไม่ชัดหรือเขาพูดเร็วเกินไป ฝรั่งใช้กันเป็นปกติ",
      },
      {
        id: "d25p3",
        en: "Could you say that in a different way?",
        th: "ช่วยพูดใหม่อีกแบบได้ไหม",
        usageTh:
          "ใช้ตอนเขาพูดซ้ำแล้วเรายังไม่เข้าใจ ขอให้เปลี่ยนคำพูดแทนการพูดซ้ำเดิม",
      },
      {
        id: "d25p4",
        en: "Could you write it in the chat?",
        th: "ช่วยพิมพ์ลงแชทให้หน่อยได้ไหม",
        usageTh:
          "ตัวช่วยสำคัญในประชุมออนไลน์ การอ่านง่ายกว่าการฟังมากสำหรับคนไทย",
      },
    ],
    practice: [
      {
        id: "d25q1",
        question:
          "We'll deprecate the legacy endpoint and cut over next sprint.",
        questionTh: "เราจะเลิกใช้ endpoint เดิมแล้วย้ายระบบใน sprint หน้า",
        hints: ["I'm not sure I understand.", "Could you ...?"],
        sampleAnswer:
          "I'm not sure I understand. Could you say that in a different way?",
      },
      {
        id: "d25q2",
        question: "Sorry, the connection is bad — did you get that?",
        questionTh: "ขอโทษที สัญญาณไม่ดี ได้ยินไหม",
        hints: ["I didn't catch that.", "Could you write it in the chat?"],
        sampleAnswer:
          "Sorry, I didn't catch that. Could you write it in the chat?",
      },
    ],
    vocabularyIds: ["v-clarify", "v-endpoint"],
  },
  {
    id: "d26",
    day: 26,
    month: 1,
    week: 4,
    title: { en: "Asking Someone to Repeat", th: "ขอให้พูดซ้ำหรือพูดช้าลง" },
    description: {
      en: "Slow the conversation down — politely, and as often as you need.",
      th: "ทำให้บทสนทนาช้าลง อย่างสุภาพ และขอได้บ่อยเท่าที่ต้องการ",
    },
    level: "A2",
    category: "conversation",
    estimatedMinutes: 12,
    patterns: ["Could you repeat that?", "Could you speak more slowly?", "One more time, please."],
    phrases: [
      {
        id: "d26p1",
        en: "Could you repeat that, please?",
        th: "ช่วยพูดอีกครั้งได้ไหมครับ",
        pronunciation: "คู้ด-ยู-รี-พีท-แดท-พลีส",
        usageTh: "Could you ... please? เป็นรูปขอร้องที่สุภาพที่สุด ใช้ได้ทุกที่",
      },
      {
        id: "d26p2",
        en: "Could you speak a little more slowly, please?",
        th: "ช่วยพูดช้าลงอีกนิดได้ไหมครับ",
        usageTh:
          "เติม a little ทำให้คำขอฟังเบาลง ฝรั่งไม่ได้รู้สึกแย่ที่เราขอเลย",
      },
      {
        id: "d26p3",
        en: "Sorry, one more time?",
        th: "ขอโทษครับ อีกทีได้ไหม",
        usageTh:
          "แบบสั้นที่สุด ใช้ได้ในบทสนทนาเป็นกันเอง เร็วและไม่ขัดจังหวะมาก",
      },
      {
        id: "d26p4",
        en: "I follow you now, thanks.",
        th: "ตอนนี้ผมตามทันแล้วครับ ขอบคุณ",
        usageTh:
          "I follow you แปลว่าเข้าใจตามแล้ว ใช้ปิดท้ายหลังเขาอธิบายซ้ำ ทำให้เขาสบายใจ",
      },
    ],
    practice: [
      {
        id: "d26q1",
        question: "SowehavetomovethewholepipelinebyFriday, okay?",
        questionTh: "เขาพูดเร็วมากจนฟังไม่ทัน",
        hints: ["Could you repeat that?", "Could you speak more slowly?"],
        sampleAnswer:
          "Sorry, could you speak a little more slowly, please?",
      },
      {
        id: "d26q2",
        question: "So — we move the pipeline by Friday. Does that make sense?",
        questionTh: "สรุปคือย้าย pipeline ให้เสร็จวันศุกร์ เข้าใจตรงกันไหม",
        hints: ["I follow you now.", "Yes, that makes sense."],
        sampleAnswer: "Yes, I follow you now. Thanks.",
      },
    ],
    vocabularyIds: [],
  },
  {
    id: "d27",
    day: 27,
    month: 1,
    week: 4,
    title: { en: "Small Talk", th: "คุยเล่นเรื่องทั่วไป" },
    description: {
      en: "The two minutes before a meeting starts — and how to survive them.",
      th: "สองนาทีก่อนประชุมเริ่ม และวิธีผ่านมันไปให้ได้",
    },
    level: "A2",
    category: "conversation",
    estimatedMinutes: 15,
    patterns: ["How's it going?", "How was your ...?", "Same here."],
    phrases: [
      {
        id: "d27p1",
        en: "Hey, how's it going?",
        th: "เป็นยังไงบ้าง",
        usageTh:
          "คำทักทายลำลองที่ใช้บ่อยที่สุด ตอบสั้น ๆ ว่า Good, thanks. You? ก็พอ",
      },
      {
        id: "d27p2",
        en: "Pretty good, thanks. A bit busy this week.",
        th: "ก็ดีนะ ขอบคุณ สัปดาห์นี้ยุ่งนิดหน่อย",
        usageTh:
          "ตอบแล้วเติมข้อมูลนิดหน่อย จะทำให้บทสนทนาไปต่อได้ ไม่จบห้วน",
      },
      {
        id: "d27p3",
        en: "Same here. How was your weekend?",
        th: "เหมือนกันเลย วันหยุดเป็นยังไงบ้าง",
        usageTh:
          "Same here แปลว่าเหมือนกัน แล้วถามกลับทันที เป็นสูตรคุยเล่นที่ใช้ได้เสมอ",
      },
      {
        id: "d27p4",
        en: "Anyway, shall we get started?",
        th: "เอาล่ะ เริ่มกันเลยไหม",
        usageTh:
          "Anyway ใช้เปลี่ยนจากคุยเล่นเข้าสู่เรื่องงาน เป็นสัญญาณที่ฝรั่งเข้าใจกันดี",
      },
    ],
    practice: [
      {
        id: "d27q1",
        question: "Hey! How's it going?",
        questionTh: "เฮ้ เป็นยังไงบ้าง",
        hints: ["Pretty good, thanks.", "A bit busy ...", "How about you?"],
        sampleAnswer:
          "Pretty good, thanks. A bit busy this week. How about you?",
      },
      {
        id: "d27q2",
        question: "Yeah, same here. Busy week for everyone.",
        questionTh: "เหมือนกันเลย สัปดาห์นี้ยุ่งกันทุกคน",
        hints: ["Same here.", "Anyway, shall we ...?"],
        sampleAnswer: "Anyway, shall we get started?",
      },
    ],
    vocabularyIds: ["v-catchup"],
  },
  {
    id: "d28",
    day: 28,
    month: 1,
    week: 4,
    title: { en: "Month 1 Review", th: "ทบทวนเดือนที่ 1" },
    description: {
      en: "A full short conversation: greet, introduce, update, clarify.",
      th: "บทสนทนาสั้น ๆ แบบครบวงจร ทักทาย แนะนำตัว อัปเดตงาน ถามให้ชัด",
    },
    level: "A2",
    category: "conversation",
    estimatedMinutes: 20,
    patterns: [
      "I'm ... and I work on ...",
      "Right now I'm working on ...",
      "What do you mean by ...?",
    ],
    phrases: [
      {
        id: "d28p1",
        en: "Hi, I'm Nut. I work on the backend team.",
        th: "สวัสดีครับ ผมณัฐ อยู่ทีม backend",
        usageTh: "แนะนำตัวในที่ทำงาน บอกชื่อกับทีมก็เพียงพอ",
      },
      {
        id: "d28p2",
        en: "Right now I'm working on the payment API, and I should finish it this week.",
        th: "ตอนนี้ผมทำ payment API อยู่ น่าจะเสร็จสัปดาห์นี้",
        usageTh: "รวมปัจจุบันกับอนาคตในประโยคเดียว เชื่อมด้วย and",
      },
      {
        id: "d28p3",
        en: "Sorry, what do you mean by that?",
        th: "ขอโทษครับ อันนั้นหมายถึงอะไรเหรอ",
        usageTh: "ถามให้ชัดเมื่อไม่เข้าใจ อย่าพยักหน้าทั้งที่ยังไม่เข้าใจ",
      },
    ],
    practice: [
      {
        id: "d28q1",
        question: "Hi, I don't think we've met. What's your name?",
        questionTh: "สวัสดี เหมือนเรายังไม่เคยเจอกันนะ คุณชื่ออะไร",
        hints: ["Hi, I'm ... I work on ..."],
        sampleAnswer: "Hi, I'm Nut. I work on the backend team. Nice to meet you.",
      },
      {
        id: "d28q2",
        question: "Great. So what's on your plate at the moment?",
        questionTh: "ดีเลย แล้วตอนนี้กำลังทำอะไรอยู่",
        hints: ["Right now I'm working on ...", "I should finish ..."],
        sampleAnswer:
          "Right now I'm working on the payment API, and I should finish it this week.",
      },
    ],
    vocabularyIds: ["v-currently", "v-clarify", "v-introduce"],
  },

  // ══════════════════ WEEK 5 — Daily Standup ══════════════════
  {
    id: "d29",
    day: 29,
    month: 2,
    week: 5,
    title: { en: "Standup — Yesterday", th: "Standup — เมื่อวาน" },
    description: {
      en: "The first line of every standup, said without hesitating.",
      th: "ประโยคแรกของทุก standup พูดได้โดยไม่ต้องลังเล",
    },
    level: "A2",
    category: "standup",
    estimatedMinutes: 15,
    patterns: ["Yesterday, I worked on ...", "I finished ...", "I also ..."],
    phrases: [
      {
        id: "d29p1",
        en: "Yesterday, I worked on the booking flow.",
        th: "เมื่อวานผมทำ flow การจอง",
        usageTh: "ประโยคเปิด standup มาตรฐาน ใช้ได้ทุกวัน แค่เปลี่ยนงานท้ายประโยค",
      },
      {
        id: "d29p2",
        en: "I finished the API and opened a pull request.",
        th: "ผมทำ API เสร็จแล้วเปิด pull request",
        usageTh: "บอกงานที่เสร็จ ใช้กริยาช่องสองทั้งหมดเพราะเป็นอดีต",
      },
      {
        id: "d29p3",
        en: "I also helped Ploy with a database issue.",
        th: "ผมช่วยพลอยเรื่องปัญหาฐานข้อมูลด้วย",
        usageTh:
          "also วางไว้หน้ากริยา ใช้เพิ่มงานอีกอย่างที่ทำ ทำให้รายงานดูครบถ้วน",
      },
      {
        id: "d29p4",
        en: "That's it from me.",
        th: "ของผมมีเท่านี้ครับ",
        usageTh:
          "ใช้ปิดท้ายรายงาน standup เป็นสัญญาณให้คนถัดไปพูดต่อ สั้นและเป็นธรรมชาติมาก",
      },
    ],
    practice: [
      {
        id: "d29q1",
        question: "Morning everyone. Nut, what did you do yesterday?",
        questionTh: "สวัสดีตอนเช้าทุกคน ณัฐ เมื่อวานทำอะไรไปบ้าง",
        hints: ["Yesterday, I worked on ...", "I finished ...", "That's it from me."],
        sampleAnswer:
          "Yesterday, I worked on the booking flow. I finished the API and opened a pull request. That's it from me.",
      },
      {
        id: "d29q2",
        question: "Did you help anyone else on the team?",
        questionTh: "ได้ช่วยคนอื่นในทีมบ้างไหม",
        hints: ["I also helped ... with ..."],
        sampleAnswer: "Yes, I also helped Ploy with a database issue.",
      },
    ],
    vocabularyIds: ["v-standup", "v-merge"],
  },
  {
    id: "d30",
    day: 30,
    month: 2,
    week: 5,
    title: { en: "Standup — Today", th: "Standup — วันนี้" },
    description: {
      en: "The second line: what you're picking up today.",
      th: "ประโยคที่สอง งานที่จะหยิบทำวันนี้",
    },
    level: "A2",
    category: "standup",
    estimatedMinutes: 15,
    patterns: ["Today, I'm working on ...", "I'm going to ...", "I'm still working on ..."],
    phrases: [
      {
        id: "d30p1",
        en: "Today, I'm working on the payment integration.",
        th: "วันนี้ผมทำเรื่องเชื่อมต่อระบบจ่ายเงิน",
        usageTh: "ประโยคที่สองของ standup ใช้ I'm working on เพราะกำลังทำอยู่",
      },
      {
        id: "d30p2",
        en: "I'm still working on the tests from yesterday.",
        th: "ผมยังทำเทสต์ที่ค้างจากเมื่อวานอยู่",
        usageTh:
          "still แปลว่ายังทำอยู่ ใช้ตอนงานยังไม่เสร็จ พูดตรง ๆ ได้เลย ไม่ใช่เรื่องเสียหาย",
      },
      {
        id: "d30p3",
        en: "After that, I'm going to review Ploy's pull request.",
        th: "หลังจากนั้นผมจะไปรีวิว pull request ของพลอย",
        usageTh: "After that ใช้เรียงลำดับงานในวันเดียวกัน",
      },
      {
        id: "d30p4",
        en: "No blockers on my side.",
        th: "ฝั่งผมไม่มีอะไรติดครับ",
        usageTh:
          "ประโยคปิด standup ที่ใช้บ่อยที่สุด on my side แปลว่าในส่วนของผม",
      },
    ],
    practice: [
      {
        id: "d30q1",
        question: "And what are you picking up today?",
        questionTh: "แล้ววันนี้จะทำอะไร",
        hints: ["Today, I'm working on ...", "After that, I'm going to ..."],
        sampleAnswer:
          "Today, I'm working on the payment integration. After that, I'm going to review Ploy's pull request.",
      },
      {
        id: "d30q2",
        question: "Anything blocking you?",
        questionTh: "มีอะไรติดไหม",
        hints: ["No blockers on my side.", "I'm still working on ..."],
        sampleAnswer:
          "I'm still working on the tests from yesterday, but no blockers on my side.",
      },
    ],
    vocabularyIds: ["v-standup", "v-blocker", "v-currently"],
  },
];

export const LESSONS_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));

export function getLesson(id: string): Lesson | undefined {
  return LESSONS_BY_ID.get(id);
}

export function getLessonByDay(day: number): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.day === day);
}

/** Highest day with authored content — used to lock the rest of the map. */
export const AUTHORED_THROUGH_DAY = Math.max(...LESSONS.map((l) => l.day));
