"use client";

import { useFormStatus } from "react-dom";
import { BidLetterFormState } from "@/app/schema";
import { BidLetterDisplay } from "./bid-letter-display";

interface ResultsDisplayProps {
  state: BidLetterFormState;
}

export function ResultsDisplay({ state }: ResultsDisplayProps) {
  const { pending } = useFormStatus();

  // If the form is submitting, render nothing. This instantly hides old results.
  if (pending) {
    return null;
  }

  // If we are not pending, and there is a state, render the results.
  if (!state) {
    return null;
  }

  return (
    <>
      {state.message && (
        <div
          className={`mt-6 p-4 rounded-md ${
            state.data
              ? "bg-green-100 border-green-400 text-green-800"
              : "bg-red-100 border-red-400 text-red-800"
          }`}
        >
          <p className="font-semibold">{state.message}</p>
        </div>
      )}

      {state.data?.generatedLetter && (
        <BidLetterDisplay data={state.data.generatedLetter} />
      )}
    </>
  );
}
