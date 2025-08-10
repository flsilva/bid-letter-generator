// lib/schema.ts
import { z } from "zod";

// --- INPUT SCHEMA (from the form) - Unchanged ---
export const bidLetterSchema = z.object({
  clientName: z.string().min(2, { message: "Client name is required." }),
  projectName: z.string().min(2, { message: "Project name is required." }),
  agencyName: z.string().optional(),

  creativeSynopsis: z
    .string()
    .min(20, { message: "Synopsis must be at least 20 characters." }),

  shootDays: z.coerce
    .number()
    .int()
    .positive({ message: "Must be a positive number." }),
  shootLocations: z.string().min(3, { message: "Locations are required." }),
  keyDeliverables: z
    .string()
    .min(10, { message: "Deliverables are required." }),

  totalBudget: z.coerce
    .number()
    .positive({ message: "Budget must be a positive number." }),
  bidDueDate: z.date({ required_error: "A bid due date is required." }),

  assumptions: z
    .string()
    .min(10, { message: "Please list at least one assumption." }),

  contactName: z.string().min(2, { message: "Your name is required." }),
  contactRole: z.string().min(2, { message: "Your role is required." }),
  companyName: z.string().min(2, { message: "Your company name is required." }),
});

export const bidLetterResponseSchema = z.object({
  date: z
    .string()
    .describe(
      "Today's date, formatted as 'Month Day, Year'. Example: August 8, 2025."
    ),
  recipientName: z
    .string()
    .describe(
      "The name of the primary recipient, usually the agency or client contact. Formatted as 'To: [Client Name] & [Agency Name]' or just 'To: [Client Name]' if agency is not provided."
    ),
  subjectLine: z
    .string()
    .describe(
      "A clear subject line including the project name and the words 'Bid Proposal' or 'Production Bid'."
    ),
  salutation: z
    .string()
    .describe(
      "A professional salutation. Example: 'Dear Team at [Client/Agency Name],' or 'Hello,'."
    ),
  openingParagraph: z
    .string()
    .describe(
      "1-2 sentences expressing enthusiasm for the project and confirming receipt of the bid materials. Must mention the project name."
    ),
  projectUnderstandingParagraph: z
    .string()
    .describe(
      "2-3 sentences summarizing the creative vision from the synopsis. This demonstrates comprehension."
    ),
  methodologyTeaser: z
    .string()
    .describe(
      "1-2 sentences about the logistical approach, mentioning shoot days and locations."
    ),
  budgetSummary: z
    .string()
    .describe(
      "A sentence that clearly states the total budget for the project."
    ),
  keyAssumptions: z
    .string()
    .describe(
      "A multi-line string containing the key assumptions, with each assumption on a new line. Start each line with a bullet point (•) or hyphen (-)."
    ),
  keyDeliverables: z
    .string()
    .describe(
      "A multi-line string containing the key deliverables, with each deliverable on a new line. Start each line with a bullet point (•) or hyphen (-)."
    ),
  closingParagraph: z
    .string()
    .describe(
      "A concluding paragraph that reiterates enthusiasm, states the bid's validity period until the due date, and invites further discussion."
    ),
  signOff: z
    .string()
    .describe(
      "A professional closing. Example: 'Sincerely,' or 'Best regards,'."
    ),
  senderName: z.string().describe("The name of the person sending the bid."),
  senderRole: z
    .string()
    .describe("The job title of the person sending the bid."),
  senderCompany: z.string().describe("The name of the production company."),
});

export type BidLetterData = z.infer<typeof bidLetterResponseSchema>;

export type BidLetterFormState = {
  message: string;
  errors?: {
    [key in keyof z.infer<typeof bidLetterSchema>]?: string[];
  };
  data?: {
    generatedLetter: BidLetterData;
  };
  submittedData?: {
    [key: string]: string;
  };
} | null;
