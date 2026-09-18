import type { ConversationScenario } from "@/lib/types";

/** Conversation scenarios, grouped exactly as the brief lists them (§12). */
export const SCENARIOS: ConversationScenario[] = [
  // ─── Beginner ─────────────────────────────────────────────────────────
  {
    id: "s-intro",
    group: "beginner",
    title: { en: "Introduce Yourself", th: "แนะนำตัวเอง" },
    description: {
      en: "Meet a new coworker and tell them who you are.",
      th: "เจอเพื่อนร่วมงานใหม่ แล้วแนะนำตัวเอง",
    },
    level: "A1",
    icon: "👋",
    opener: "Hi! I don't think we've met yet. I'm Sarah, I just joined the design team. What's your name?",
    openerTh:
      "สวัสดี เหมือนเรายังไม่เคยเจอกันนะ ฉันชื่อซาร่า เพิ่งเข้าทีมดีไซน์ คุณชื่ออะไร",
    followUps: [
      "Nice to meet you! So what do you do here?",
      "That sounds interesting. How long have you been with the company?",
      "Cool. What are you working on at the moment?",
      "Nice. Do you enjoy working here?",
      "Great talking to you. Maybe we'll work together soon!",
    ],
  },
  {
    id: "s-job",
    group: "beginner",
    title: { en: "Talk About Your Job", th: "พูดถึงงานของคุณ" },
    description: {
      en: "Explain what you do to someone outside your team.",
      th: "อธิบายว่าคุณทำอะไร ให้คนนอกทีมฟัง",
    },
    level: "A1",
    icon: "💼",
    opener: "So, you're a developer? What does that actually mean day to day?",
    openerTh: "คุณเป็น developer เหรอ แล้วจริง ๆ ในแต่ละวันทำอะไรบ้าง",
    followUps: [
      "Interesting! What kind of things do you build?",
      "Do you work alone or with a team?",
      "What's the hardest part of your job?",
      "What do you enjoy most about it?",
      "Thanks for explaining — that makes a lot more sense now.",
    ],
  },
  {
    id: "s-day",
    group: "beginner",
    title: { en: "Talk About Your Day", th: "เล่าเรื่องวันนี้" },
    description: {
      en: "Describe what you did today, from morning to now.",
      th: "เล่าว่าวันนี้ทำอะไรไปบ้าง ตั้งแต่เช้าจนถึงตอนนี้",
    },
    level: "A1",
    icon: "☀️",
    opener: "Hey, how has your day been so far?",
    openerTh: "เฮ้ วันนี้เป็นยังไงบ้าง",
    followUps: [
      "Sounds busy. What did you start with this morning?",
      "And what did you do after that?",
      "Did anything go wrong today?",
      "What's left for the rest of the day?",
      "Well, it sounds like a productive day. Nice work.",
    ],
  },
  {
    id: "s-weekend",
    group: "beginner",
    title: { en: "Talk About Your Weekend", th: "เล่าเรื่องวันหยุด" },
    description: {
      en: "The Monday morning conversation, practised safely.",
      th: "บทสนทนาเช้าวันจันทร์ ฝึกไว้ก่อนแบบไม่ต้องกดดัน",
    },
    level: "A2",
    icon: "🌤️",
    opener: "Morning! How was your weekend?",
    openerTh: "สวัสดีตอนเช้า วันหยุดเป็นยังไงบ้าง",
    followUps: [
      "Nice! Who did you go with?",
      "That sounds fun. Would you go again?",
      "Did you get enough rest?",
      "Mine was quiet — I mostly stayed home. Any plans for next weekend?",
      "Anyway, we should get started. Talk later!",
    ],
  },

  // ─── Workplace ────────────────────────────────────────────────────────
  {
    id: "s-standup",
    group: "workplace",
    title: { en: "Daily Standup", th: "Standup ประจำวัน" },
    description: {
      en: "Give your update: yesterday, today, blockers.",
      th: "รายงานอัปเดต เมื่อวาน วันนี้ และสิ่งที่ติด",
    },
    level: "A2",
    icon: "🗓️",
    opener:
      "Good morning everyone. Let's start the standup. Nut, would you like to go first?",
    openerTh:
      "สวัสดีตอนเช้าทุกคน เริ่ม standup กันเลย ณัฐ เริ่มก่อนไหม",
    followUps: [
      "Thanks. And what are you working on today?",
      "Got it. Any blockers on your side?",
      "Okay. Do you think you'll finish it this week?",
      "Great. Anything you need from the rest of the team?",
      "Perfect, thanks Nut. Let's move on to the next person.",
    ],
  },
  {
    id: "s-help",
    group: "workplace",
    title: { en: "Ask for Help", th: "ขอความช่วยเหลือ" },
    description: {
      en: "You're stuck. Ask a coworker clearly, without apologising too much.",
      th: "คุณติดอยู่ ขอความช่วยเหลือให้ชัดเจน โดยไม่ต้องขอโทษมากเกินไป",
    },
    level: "A2",
    icon: "🙋",
    opener: "Hey, you looked like you wanted to ask me something?",
    openerTh: "เฮ้ ดูเหมือนคุณอยากถามอะไรผมอยู่นะ",
    followUps: [
      "Sure, I can help. What exactly is happening?",
      "Okay. Have you tried checking the logs?",
      "Interesting. When did it start happening?",
      "Let's look at it together. Can you share your screen?",
      "There it is. Does that make sense now?",
    ],
  },
  {
    id: "s-bug",
    group: "workplace",
    title: { en: "Report a Bug", th: "แจ้งบั๊ก" },
    description: {
      en: "Explain what broke, when, and what you've already tried.",
      th: "อธิบายว่าอะไรพัง เกิดตอนไหน และคุณลองอะไรไปแล้วบ้าง",
    },
    level: "B1",
    icon: "🐛",
    opener: "You mentioned there's an issue on production. Can you walk me through it?",
    openerTh: "คุณบอกว่ามีปัญหาบน production ช่วยเล่าให้ฟังหน่อยได้ไหม",
    followUps: [
      "When exactly does it happen?",
      "Can you reproduce it every time, or only sometimes?",
      "Do you have any idea what's causing it?",
      "What have you tried so far?",
      "Okay, good analysis. Let's get a fix out today.",
    ],
  },
  {
    id: "s-task",
    group: "workplace",
    title: { en: "Discuss a Task", th: "คุยเรื่องงานที่ได้รับ" },
    description: {
      en: "Clarify scope and give an honest estimate.",
      th: "ถามขอบเขตให้ชัด แล้วประเมินเวลาอย่างตรงไปตรงมา",
    },
    level: "B1",
    icon: "📋",
    opener:
      "I'd like you to take the new notification feature. Do you have capacity this sprint?",
    openerTh:
      "อยากให้คุณรับฟีเจอร์ notification ตัวใหม่ sprint นี้พอมีเวลาไหม",
    followUps: [
      "Good question. What do you need to know before you start?",
      "How long do you think it will take?",
      "Is there anything that might slow you down?",
      "What would you deprioritise to make room for it?",
      "That works for me. Let's go with that plan.",
    ],
  },

  // ─── Developer ────────────────────────────────────────────────────────
  {
    id: "s-api",
    group: "developer",
    title: { en: "Explain an API", th: "อธิบาย API" },
    description: {
      en: "Walk a teammate through an endpoint you built.",
      th: "อธิบาย endpoint ที่คุณทำให้เพื่อนร่วมทีมฟัง",
    },
    level: "B1",
    icon: "🔌",
    opener: "Can you explain how your new booking endpoint works?",
    openerTh: "ช่วยอธิบายหน่อยว่า endpoint การจองตัวใหม่ทำงานยังไง",
    followUps: [
      "What does it return when it succeeds?",
      "And what happens if the request is invalid?",
      "Does it need authentication?",
      "How fast is it? Any performance concerns?",
      "Clear. Could you add that to the docs?",
    ],
  },
  {
    id: "s-architecture",
    group: "developer",
    title: { en: "Explain Architecture", th: "อธิบายสถาปัตยกรรม" },
    description: {
      en: "Describe how the pieces of your system fit together.",
      th: "อธิบายว่าส่วนต่าง ๆ ของระบบประกอบกันยังไง",
    },
    level: "B2",
    icon: "🏗️",
    opener: "I'm new to this codebase. Can you give me a high-level overview of the system?",
    openerTh:
      "ผมเพิ่งเข้ามาดูโค้ดเบสนี้ ช่วยอธิบายภาพรวมของระบบให้ฟังหน่อยได้ไหม",
    followUps: [
      "How do the services talk to each other?",
      "Where does the data live?",
      "What happens if one service goes down?",
      "Why was it designed that way?",
      "That helps a lot, thanks. Now I know where to look.",
    ],
  },
  {
    id: "s-review",
    group: "developer",
    title: { en: "Code Review", th: "Code Review" },
    description: {
      en: "Give and take feedback on code without it getting personal.",
      th: "ให้และรับ feedback เรื่องโค้ด โดยไม่ทำให้เป็นเรื่องส่วนตัว",
    },
    level: "B2",
    icon: "🔍",
    opener:
      "I left a few comments on your pull request. Do you have a minute to go through them?",
    openerTh:
      "ผมคอมเมนต์ไว้ใน pull request ของคุณหน่อย พอมีเวลาคุยกันสักครู่ไหม",
    followUps: [
      "My main concern is the error handling. What do you think?",
      "Would it make sense to extract that into a helper?",
      "Fair point. What's the reasoning behind your approach?",
      "Okay, I'm happy with that. Can you add a test for the edge case?",
      "Great, I'll approve it once that's in.",
    ],
  },
  {
    id: "s-deployment",
    group: "developer",
    title: { en: "Discuss Deployment", th: "คุยเรื่องการ deploy" },
    description: {
      en: "Plan a release and talk about what could go wrong.",
      th: "วางแผนปล่อยงาน และคุยว่าอะไรอาจผิดพลาดได้บ้าง",
    },
    level: "B2",
    icon: "🚀",
    opener: "Are we ready to deploy this to production today?",
    openerTh: "วันนี้พร้อม deploy ขึ้น production หรือยัง",
    followUps: [
      "Has it been tested on staging?",
      "What's the rollback plan if something breaks?",
      "Do we need to run any migrations first?",
      "Who should we notify before we start?",
      "Alright, let's do it after lunch.",
    ],
  },

  // ─── Interview ────────────────────────────────────────────────────────
  {
    id: "s-interview-intro",
    group: "interview",
    title: { en: "Self Introduction", th: "แนะนำตัวในการสัมภาษณ์" },
    description: {
      en: "The first two minutes of every interview.",
      th: "สองนาทีแรกของการสัมภาษณ์ทุกครั้ง",
    },
    level: "B1",
    icon: "🎤",
    opener:
      "Thanks for joining us today. To start, could you tell me a little about yourself?",
    openerTh:
      "ขอบคุณที่มาวันนี้นะครับ เริ่มจากช่วยเล่าเรื่องตัวเองให้ฟังสักหน่อยได้ไหม",
    followUps: [
      "Thanks. What technologies do you work with most?",
      "How many years of experience do you have with that?",
      "What kind of team do you work best in?",
      "Why are you looking for a new role?",
      "Great, that's a helpful overview. Let's move on to the technical part.",
    ],
  },
  {
    id: "s-interview-project",
    group: "interview",
    title: { en: "Project Explanation", th: "เล่าโปรเจกต์ที่เคยทำ" },
    description: {
      en: "Tell the story of a project: problem, your part, result.",
      th: "เล่าโปรเจกต์เป็นเรื่องราว ปัญหา สิ่งที่คุณทำ และผลลัพธ์",
    },
    level: "B2",
    icon: "📦",
    opener: "Tell me about a project you've worked on that you're proud of.",
    openerTh: "เล่าโปรเจกต์ที่คุณภูมิใจให้ฟังหน่อย",
    followUps: [
      "What problem was it solving?",
      "What was your specific role on it?",
      "What was the biggest challenge?",
      "How did you measure whether it worked?",
      "Thanks — that was a clear explanation.",
    ],
  },
  {
    id: "s-interview-technical",
    group: "interview",
    title: { en: "Technical Interview", th: "สัมภาษณ์เชิงเทคนิค" },
    description: {
      en: "Explain your technical reasoning out loud, in English.",
      th: "อธิบายวิธีคิดเชิงเทคนิคออกมาเป็นคำพูดภาษาอังกฤษ",
    },
    level: "B2",
    icon: "⚙️",
    opener:
      "Imagine our booking API is getting slow under load. How would you approach that?",
    openerTh:
      "สมมติว่า API การจองของเราช้าลงเมื่อมีผู้ใช้เยอะ คุณจะเริ่มแก้ยังไง",
    followUps: [
      "Good start. How would you find out where the time is going?",
      "Let's say the database is the bottleneck. What then?",
      "What are the trade-offs of adding a cache?",
      "How would you know your fix actually worked?",
      "Nice reasoning. You explained that well.",
    ],
  },
  {
    id: "s-interview-behavioral",
    group: "interview",
    title: { en: "Behavioral Questions", th: "คำถามเชิงพฤติกรรม" },
    description: {
      en: "Talk about teamwork, conflict and mistakes honestly.",
      th: "พูดถึงการทำงานเป็นทีม ความขัดแย้ง และความผิดพลาด อย่างตรงไปตรงมา",
    },
    level: "B2",
    icon: "🤝",
    opener: "Tell me about a time you disagreed with a teammate. What happened?",
    openerTh:
      "เล่าเหตุการณ์ที่คุณเห็นต่างกับเพื่อนร่วมทีมให้ฟังหน่อย เกิดอะไรขึ้นบ้าง",
    followUps: [
      "How did you handle it?",
      "What was the outcome?",
      "Looking back, would you do anything differently?",
      "How do you usually deal with tight deadlines?",
      "Thanks for being open about that. Good answers.",
    ],
  },
];

export const SCENARIOS_BY_ID = new Map(SCENARIOS.map((s) => [s.id, s]));

export function getScenario(id: string) {
  return SCENARIOS_BY_ID.get(id);
}
