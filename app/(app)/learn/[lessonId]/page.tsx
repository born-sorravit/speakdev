import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonPlayer } from "@/components/lesson/lesson-player";
import { LESSONS, getLesson } from "@/lib/data/lessons";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata(
  props: PageProps<"/learn/[lessonId]">,
): Promise<Metadata> {
  const { lessonId } = await props.params;
  const lesson = getLesson(lessonId);
  return { title: lesson ? lesson.title.en : "Lesson" };
}

export default async function LessonPage(props: PageProps<"/learn/[lessonId]">) {
  const { lessonId } = await props.params;
  const lesson = getLesson(lessonId);

  if (!lesson) notFound();

  return <LessonPlayer lesson={lesson} />;
}
