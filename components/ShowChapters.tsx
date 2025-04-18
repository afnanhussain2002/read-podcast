import { chapters } from "@/dataTypes/transcribeDataTypes";
import { formatTime } from "@/lib/formatDate";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// Dummy formatter (reuse your real one if available)
type ChaptersProps = {
  chapters: chapters[];
};

const Chapters: React.FC<ChaptersProps> = ({ chapters }) => {
  if (!chapters || chapters.length === 0) return null;

  return (
    <div className="space-y-6 mt-10 ">
    <h2 className="text-2xl font-semibold">📚 All Chapters</h2>
    {chapters.map((chapter, index) => (
      <Card key={index} className="w-full max-w-5xl border-border dark:border-darkBorder dark:bg-brand-dark shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-brand-light p-5">
        <CardHeader>
          <CardTitle>{ chapter.gist || `Chapter ${index + 1}`}</CardTitle>
          {(chapter.start !== undefined && chapter.end !== undefined) && (
            <CardDescription>
              🕒 {formatTime(chapter.start)} - {formatTime(chapter.end)}
            </CardDescription>
          )}
        </CardHeader>
        {chapter.headline && (
          <CardContent>
            <p className="text-base text-muted-foreground">{chapter.headline}</p>
          </CardContent>
        )}
      </Card>
    ))}
  </div>
  );
};

export default Chapters;
