import type { Bilingual, EnglishLevel, LessonCategory } from "@/lib/types";

/**
 * The whole 3-month map (§6–§8).
 *
 * Days 1–30 have authored content in `lessons.ts`; the rest are listed here so
 * the Learn page can show where the program is going. Anything past the
 * authored range renders as locked.
 */
export interface CurriculumEntry {
  day: number;
  month: 1 | 2 | 3;
  week: number;
  title: Bilingual;
  level: EnglishLevel;
  category: LessonCategory;
  estimatedMinutes: number;
}

export interface CurriculumWeek {
  week: number;
  month: 1 | 2 | 3;
  title: Bilingual;
  days: CurriculumEntry[];
}

export interface CurriculumMonth {
  month: 1 | 2 | 3;
  title: Bilingual;
  goal: Bilingual;
  weeks: CurriculumWeek[];
}

type DaySpec = [en: string, th: string];

function buildWeek(
  month: 1 | 2 | 3,
  week: number,
  weekTitle: Bilingual,
  level: EnglishLevel,
  category: LessonCategory,
  days: DaySpec[],
): CurriculumWeek {
  const firstDay = (week - 1) * 7 + 1;
  return {
    week,
    month,
    title: weekTitle,
    days: days.map(([en, th], index) => ({
      day: firstDay + index,
      month,
      week,
      title: { en, th },
      level,
      category,
      // Review days are the long ones; the rest are short by design (§3).
      estimatedMinutes: index === 6 ? 20 : 15,
    })),
  };
}

export const CURRICULUM: CurriculumMonth[] = [
  {
    month: 1,
    title: { en: "Month 1 · Basic Speaking", th: "เดือนที่ 1 · พูดพื้นฐาน" },
    goal: {
      en: "Build basic speaking confidence: introduce yourself, talk about your job, your day, and your plans.",
      th: "สร้างความมั่นใจในการพูดพื้นฐาน แนะนำตัว เล่าเรื่องงาน กิจวัตร และแผนของคุณ",
    },
    weeks: [
      buildWeek(1, 1, { en: "Basic Sentences", th: "ประโยคพื้นฐาน" }, "A1", "basics", [
        ["Introducing Yourself", "แนะนำตัวเอง"],
        ["What Do You Do?", "คุณทำงานอะไร"],
        ["Where Do You Work?", "คุณทำงานที่ไหน"],
        ["Talking About Your Family", "พูดถึงครอบครัว"],
        ["Talking About Your Hobbies", "พูดถึงงานอดิเรก"],
        ["Daily Routine", "กิจวัตรประจำวัน"],
        ["Week 1 Review", "ทบทวนสัปดาห์ที่ 1"],
      ]),
      buildWeek(1, 2, { en: "Talking About Yourself", th: "พูดถึงตัวเอง" }, "A2", "self", [
        ["My Job", "งานของฉัน"],
        ["My Skills", "ทักษะของฉัน"],
        ["My Daily Routine at Work", "กิจวัตรที่ทำงาน"],
        ["What I Did Today", "วันนี้ฉันทำอะไรไปบ้าง"],
        ["Talking About Your Work", "พูดถึงงานที่ทำ"],
        ["My Weekend", "วันหยุดของฉัน"],
        ["Week 2 Review", "ทบทวนสัปดาห์ที่ 2"],
      ]),
      buildWeek(1, 3, { en: "Time", th: "การใช้เวลา" }, "A2", "time", [
        ["Present — What's Happening Now", "ปัจจุบัน — สิ่งที่เกิดขึ้นตอนนี้"],
        ["Past — What You Did", "อดีต — สิ่งที่ทำไปแล้ว"],
        ["Future — What You Will Do", "อนาคต — สิ่งที่จะทำ"],
        ["Plans", "การวางแผน"],
        ["Yesterday in Detail", "เล่าเรื่องเมื่อวานแบบละเอียด"],
        ["Tomorrow", "พรุ่งนี้"],
        ["Week 3 Review", "ทบทวนสัปดาห์ที่ 3"],
      ]),
      buildWeek(1, 4, { en: "Basic Conversation", th: "การสนทนาพื้นฐาน" }, "A2", "conversation", [
        ["Asking Questions", "การถามคำถาม"],
        ["Answering Questions", "การตอบคำถาม"],
        ["Asking for Clarification", "การขอให้อธิบายเพิ่ม"],
        ["Saying You Don't Understand", "บอกว่าฟังไม่เข้าใจ"],
        ["Asking Someone to Repeat", "ขอให้พูดซ้ำ"],
        ["Small Talk", "คุยเล่นเรื่องทั่วไป"],
        ["Month 1 Review", "ทบทวนเดือนที่ 1"],
      ]),
    ],
  },
  {
    month: 2,
    title: {
      en: "Month 2 · English for Developers",
      th: "เดือนที่ 2 · อังกฤษสำหรับ developer",
    },
    goal: {
      en: "Run a standup, report bugs, ask for help, and take part in simple meetings.",
      th: "รายงาน standup แจ้งบั๊ก ขอความช่วยเหลือ และร่วมประชุมง่าย ๆ ได้",
    },
    weeks: [
      buildWeek(2, 5, { en: "Daily Standup", th: "Standup ประจำวัน" }, "A2", "standup", [
        ["Standup — Yesterday", "Standup — เมื่อวาน"],
        ["Standup — Today", "Standup — วันนี้"],
        ["Blockers", "สิ่งที่ทำให้งานติด"],
        ["Progress", "ความคืบหน้า"],
        ["Explaining Tasks", "อธิบายงานที่ทำ"],
        ["Standup Simulation", "จำลอง standup เต็มรูปแบบ"],
        ["Week 5 Review", "ทบทวนสัปดาห์ที่ 5"],
      ]),
      buildWeek(2, 6, { en: "Bugs and Problems", th: "บั๊กและปัญหา" }, "B1", "bugs", [
        ["Reporting a Bug", "แจ้งบั๊ก"],
        ["Explaining an Error", "อธิบาย error"],
        ["Reproducing a Bug", "ทำให้บั๊กเกิดซ้ำ"],
        ["Finding the Cause", "หาสาเหตุ"],
        ["Explaining a Fix", "อธิบายวิธีแก้"],
        ["Bug Simulation", "จำลองสถานการณ์แจ้งบั๊ก"],
        ["Week 6 Review", "ทบทวนสัปดาห์ที่ 6"],
      ]),
      buildWeek(2, 7, { en: "Meetings", th: "การประชุม" }, "B1", "meetings", [
        ["Asking Questions in Meetings", "ถามคำถามในที่ประชุม"],
        ["Giving Opinions", "แสดงความคิดเห็น"],
        ["Agreeing", "การเห็นด้วย"],
        ["Disagreeing Politely", "เห็นต่างอย่างสุภาพ"],
        ["Asking for Clarification", "ขอให้อธิบายให้ชัด"],
        ["Technical Discussion", "ถกเรื่องเทคนิค"],
        ["Week 7 Review", "ทบทวนสัปดาห์ที่ 7"],
      ]),
      buildWeek(2, 8, { en: "Technical Communication", th: "สื่อสารเชิงเทคนิค" }, "B1", "technical", [
        ["APIs", "เรื่อง API"],
        ["Frontend", "ฝั่ง Frontend"],
        ["Backend", "ฝั่ง Backend"],
        ["Database", "ฐานข้อมูล"],
        ["Deployment", "การ deploy"],
        ["Architecture", "สถาปัตยกรรมระบบ"],
        ["Month 2 Review", "ทบทวนเดือนที่ 2"],
      ]),
    ],
  },
  {
    month: 3,
    title: { en: "Month 3 · Real-World English", th: "เดือนที่ 3 · ใช้งานจริง" },
    goal: {
      en: "Hold technical meetings, explain your projects, handle misunderstandings, and interview.",
      th: "ร่วมประชุมเชิงเทคนิค อธิบายโปรเจกต์ รับมือความเข้าใจผิด และสัมภาษณ์งานได้",
    },
    weeks: [
      buildWeek(3, 9, { en: "Daily Workplace Conversation", th: "บทสนทนาในที่ทำงาน" }, "B1", "workplace", [
        ["Starting the Day", "เริ่มต้นวันทำงาน"],
        ["Asking a Coworker for Help", "ขอความช่วยเหลือเพื่อนร่วมงาน"],
        ["Offering Help", "เสนอความช่วยเหลือ"],
        ["Giving Feedback in Code Review", "ให้ feedback ตอน code review"],
        ["Receiving Feedback", "รับ feedback"],
        ["Handling Misunderstandings", "รับมือเวลาเข้าใจกันคนละอย่าง"],
        ["Week 9 Review", "ทบทวนสัปดาห์ที่ 9"],
      ]),
      buildWeek(3, 10, { en: "Technical Meetings", th: "ประชุมเชิงเทคนิค" }, "B2", "meetings", [
        ["Presenting a Proposal", "เสนอแนวทาง"],
        ["Discussing Trade-offs", "ถกข้อดีข้อเสีย"],
        ["Estimating Work", "ประเมินเวลางาน"],
        ["Pushing Back Politely", "ปฏิเสธอย่างสุภาพ"],
        ["Summarising a Decision", "สรุปข้อตกลง"],
        ["Meeting Simulation", "จำลองการประชุม"],
        ["Week 10 Review", "ทบทวนสัปดาห์ที่ 10"],
      ]),
      buildWeek(3, 11, { en: "Project Explanation", th: "อธิบายโปรเจกต์" }, "B2", "project", [
        ["Describing the Problem", "อธิบายปัญหาที่แก้"],
        ["Describing Your Role", "อธิบายบทบาทของคุณ"],
        ["Explaining the Architecture", "อธิบายสถาปัตยกรรม"],
        ["Explaining Technical Decisions", "อธิบายเหตุผลที่เลือกวิธีนั้น"],
        ["Describing the Result", "อธิบายผลลัพธ์"],
        ["Project Walkthrough", "เล่าโปรเจกต์แบบเต็ม"],
        ["Week 11 Review", "ทบทวนสัปดาห์ที่ 11"],
      ]),
      buildWeek(3, 12, { en: "Job Interview", th: "สัมภาษณ์งาน" }, "B2", "interview", [
        ["Tell Me About Yourself", "เล่าเรื่องตัวเองให้ฟังหน่อย"],
        ["What Technologies Do You Use?", "คุณใช้เทคโนโลยีอะไร"],
        ["Tell Me About a Project", "เล่าโปรเจกต์ที่เคยทำ"],
        ["The Biggest Challenge", "ความท้าทายที่สุด"],
        ["How Do You Handle Bugs?", "คุณจัดการบั๊กยังไง"],
        ["Working With a Team", "การทำงานร่วมกับทีม"],
        ["Full Interview Simulation", "จำลองสัมภาษณ์งานเต็มรูปแบบ"],
      ]),
    ],
  },
];

export const ALL_CURRICULUM_DAYS: CurriculumEntry[] = CURRICULUM.flatMap((m) =>
  m.weeks.flatMap((w) => w.days),
);

export const TOTAL_DAYS = ALL_CURRICULUM_DAYS.length;
