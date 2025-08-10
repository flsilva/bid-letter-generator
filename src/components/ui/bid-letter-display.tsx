"use client";

import { useState } from "react";
import { BidLetterData } from "@/app/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./card";
import { Button } from "./button";
import { Check, Copy } from "lucide-react";

interface BidLetterDisplayProps {
  data: BidLetterData;
}

// Helper to convert the structured data back into a plain text string for copying
const formatLetterAsText = (data: BidLetterData): string => {
  return [
    `Date: ${data.date}`,
    data.recipientName,
    `\nSubject: ${data.subjectLine}`,
    `\n${data.salutation}`,
    `\n${data.openingParagraph}`,
    `\n${data.projectUnderstandingParagraph}`,
    `\n${data.methodologyTeaser}`,
    `\n${data.budgetSummary}`,
    `\nOur bid is based on the following key deliverables:`,
    data.keyDeliverables,
    `\nAnd includes the following assumptions:`,
    data.keyAssumptions,
    `\n${data.closingParagraph}`,
    `\n${data.signOff}`,
    `\n${data.senderName}`,
    data.senderRole,
    data.senderCompany,
  ].join("\n\n");
};

const ListFromString = ({ text }: { text: string }) => (
  <ul className="list-disc pl-6 space-y-1">
    {text.split("\n").map((item, index) => {
      const cleanedItem = item.trim().replace(/^(-|•)\s*/, "");
      if (cleanedItem) {
        return <li key={index}>{cleanedItem}</li>;
      }
      return null;
    })}
  </ul>
);

export function BidLetterDisplay({ data }: BidLetterDisplayProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    const letterText = formatLetterAsText(data);
    navigator.clipboard.writeText(letterText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Generated Bid Letter</CardTitle>
          <CardDescription>
            Review the AI-drafted letter below. Copy it as plain text for your
            email.
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleCopy}>
          {hasCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy to clipboard</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-white p-6 md:p-8 border rounded-md font-serif text-slate-800 shadow-sm">
          <div className="space-y-4 text-base">
            <p>{data.date}</p>
            <p>{data.recipientName}</p>
            <p className="font-sans font-bold">Subject: {data.subjectLine}</p>

            <p className="pt-4">{data.salutation}</p>

            <p>{data.openingParagraph}</p>
            <p>{data.projectUnderstandingParagraph}</p>
            <p>{data.methodologyTeaser}</p>
            <p className="font-sans font-semibold">{data.budgetSummary}</p>

            <div className="font-sans space-y-3 pt-2">
              <div>
                <h3 className="font-semibold mb-1">Key Deliverables:</h3>
                <ListFromString text={data.keyDeliverables} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  Key Assumptions & Exclusions:
                </h3>
                <ListFromString text={data.keyAssumptions} />
              </div>
            </div>

            <p>{data.closingParagraph}</p>

            <div className="pt-4">
              <p>{data.signOff}</p>
              <p className="font-sans font-bold">{data.senderName}</p>
              <p className="font-sans">{data.senderRole}</p>
              <p className="font-sans">{data.senderCompany}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
