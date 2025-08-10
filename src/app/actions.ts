"use server";

import { OpenAI } from "openai";
import { ZodError } from "zod";
import {
  bidLetterSchema,
  bidLetterResponseSchema,
  BidLetterFormState,
} from "./schema";
import { format } from "date-fns";
import { zodTextFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBidLetterAction(
  prevState: BidLetterFormState,
  formData: FormData
): Promise<BidLetterFormState> {
  const stringifiedRawData: { [key: string]: string } = {};
  for (const [key, value] of formData.entries()) {
    // This check ensures we only include string values, safely ignoring any potential File objects.
    if (typeof value === "string") {
      stringifiedRawData[key] = value;
    }
  }

  const dataToValidate = {
    ...stringifiedRawData,
    bidDueDate: formData.get("bidDueDate")
      ? new Date(formData.get("bidDueDate") as string)
      : undefined,
  };

  try {
    const validatedData = bidLetterSchema.parse(dataToValidate);

    const systemPrompt = `
You are an AI assistant named "Leo" for the Lineo platform. Your task is to act as an expert Executive Producer and populate a JSON object based on the user's project details.

You MUST follow these instructions:
1.  Adhere strictly to the provided data structure.
2.  Your tone should be professional, confident, and collaborative.
3.  The descriptions within the data structure are your primary instructions for what to write in each field.
4.  Today's date is ${format(new Date(), "MMMM d, yyyy")}.
5.  Generate the content for each field based on the user's provided data.
`;

    const userPrompt = `
Please generate a structured data object for a bid letter using the following project data. Fill out every field in the provided structure.

### Project & Client Information
- Client Name: ${validatedData.clientName}
- Agency Name: ${validatedData.agencyName || "Not provided"}
- Project Name: "${validatedData.projectName}"

### Creative & Logistical Details
- Creative Synopsis: ${validatedData.creativeSynopsis}
- Shoot Schedule: ${validatedData.shootDays} day(s)
- Shoot Locations: ${validatedData.shootLocations}
- Key Deliverables (format as a bulleted list in the final JSON field): 
${validatedData.keyDeliverables}

### Financial & Deadline Information
- Total Budget: $${validatedData.totalBudget.toLocaleString("en-US")}
- This bid is valid until the due date: ${format(
      validatedData.bidDueDate,
      "MMMM d, yyyy"
    )}

### Bid Specifics
- Key Assumptions & Exclusions (format as a bulleted list in the final JSON field): 
${validatedData.assumptions}

### Sender Information
- Contact Name: ${validatedData.contactName}
- Contact Role: ${validatedData.contactRole}
- Company Name: ${validatedData.companyName}
`;

    const response = await openai.responses.parse({
      model: "gpt-5-mini-2025-08-07",
      max_output_tokens: 2048,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      text: {
        format: zodTextFormat(bidLetterResponseSchema, "bid_letter_response"),
      },
    });

    // The result is already parsed and validated
    const validatedResponse = response.output_parsed;

    // This check is good practice, though `parse` should throw an error if it fails.
    if (!validatedResponse) {
      return {
        message:
          "Error: AI failed to generate a valid response. Please try again.",
        errors: {},
      };
    }

    return {
      message: "Success! Your bid letter has been generated below.",
      data: { generatedLetter: validatedResponse },
      errors: {},
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        message: "Validation failed. Please check the fields below.",
        errors: error.flatten().fieldErrors,
        submittedData: stringifiedRawData, // Now this matches the type perfectly
      };
    }
    // The `openai.responses.parse` method can also throw its own errors if the AI output
    // cannot be parsed into the Zod schema. This catch block will handle those cases too.
    console.error("Error during bid letter generation:", error);
    return {
      message: "An unexpected error occurred. Please check the server console.",
      errors: {},
      submittedData: stringifiedRawData, // Matches the type perfectly
    };
  }
}
