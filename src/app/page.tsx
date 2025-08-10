"use client";

import { useActionState, useState } from "react";

import { generateBidLetterAction } from "./actions";
import { BidLetterFormState } from "./schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SubmitButton } from "@/components/ui/submit-button";
import { ResultsDisplay } from "@/components/ui/results-display";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const initialState: BidLetterFormState = null;

export default function BidLetterGeneratorPage() {
  const [state, formAction] = useActionState(
    generateBidLetterAction,
    initialState
  );
  const [date, setDate] = useState<Date | undefined>();

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            AI Bid Letter Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Fill in the project specs to instantly draft a professional bid
            letter.
          </p>
        </div>

        <form action={formAction}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Project & Client Info</CardTitle>
                <CardDescription>
                  Details about the project and who it&apos;s for.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* --- UPDATED: Add defaultValue to all inputs --- */}
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    placeholder="e.g., Nike"
                    defaultValue={state?.submittedData?.clientName ?? ""}
                  />
                  {state?.errors?.clientName && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.clientName[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    name="projectName"
                    placeholder="e.g., 'Future Run' Campaign"
                    defaultValue={state?.submittedData?.projectName ?? ""}
                  />
                  {state?.errors?.projectName && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.projectName[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="agencyName">Agency Name (Optional)</Label>
                  <Input
                    id="agencyName"
                    name="agencyName"
                    placeholder="e.g., Wieden+Kennedy"
                    defaultValue={state?.submittedData?.agencyName ?? ""}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  Details for the letter&apos;s sign-off.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactName">Your Name</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    placeholder="e.g., Jane Doe"
                    defaultValue={state?.submittedData?.contactName ?? ""}
                  />
                  {state?.errors?.contactName && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.contactName[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contactRole">Your Role</Label>
                  <Input
                    id="contactRole"
                    name="contactRole"
                    placeholder="e.g., Executive Producer"
                    defaultValue={state?.submittedData?.contactRole ?? ""}
                  />
                  {state?.errors?.contactRole && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.contactRole[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="companyName">Your Production Company</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="e.g., RadicalMedia"
                    defaultValue={state?.submittedData?.companyName ?? ""}
                  />
                  {state?.errors?.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.companyName[0]}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Creative & Logistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="creativeSynopsis">Creative Synopsis</Label>
                <Textarea
                  id="creativeSynopsis"
                  name="creativeSynopsis"
                  placeholder="Describe the creative vision..."
                  defaultValue={state?.submittedData?.creativeSynopsis ?? ""}
                />
                {state?.errors?.creativeSynopsis && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.creativeSynopsis[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shootDays">Number of Shoot Days</Label>
                  <Input
                    id="shootDays"
                    name="shootDays"
                    type="number"
                    placeholder="e.g., 3"
                    defaultValue={state?.submittedData?.shootDays ?? ""}
                  />
                  {state?.errors?.shootDays && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.shootDays[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="shootLocations">Shoot Location(s)</Label>
                  <Input
                    id="shootLocations"
                    name="shootLocations"
                    placeholder="e.g., Los Angeles & sound stage"
                    defaultValue={state?.submittedData?.shootLocations ?? ""}
                  />
                  {state?.errors?.shootLocations && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.shootLocations[0]}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="keyDeliverables">
                  Key Deliverables (one per line)
                </Label>
                <Textarea
                  id="keyDeliverables"
                  name="keyDeliverables"
                  placeholder="e.g.,&#10;1 x 60s TVC..."
                  defaultValue={state?.submittedData?.keyDeliverables ?? ""}
                />
                {state?.errors?.keyDeliverables && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.keyDeliverables[0]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Budget & Bid Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalBudget">Total Budget (USD)</Label>
                  <Input
                    id="totalBudget"
                    name="totalBudget"
                    type="number"
                    step="1000"
                    placeholder="e.g., 500000"
                    defaultValue={state?.submittedData?.totalBudget ?? ""}
                  />
                  {state?.errors?.totalBudget && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.totalBudget[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bidDueDate">Bid Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="hidden"
                    name="bidDueDate"
                    value={date?.toISOString()}
                  />
                  {state?.errors?.bidDueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.bidDueDate[0]}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="assumptions">
                  Key Assumptions & Exclusions (one per line)
                </Label>
                <Textarea
                  id="assumptions"
                  name="assumptions"
                  placeholder="e.g.,&#10;Budget assumes non-union talent..."
                  defaultValue={state?.submittedData?.assumptions ?? ""}
                />
                {state?.errors?.assumptions && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.assumptions[0]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mb-8">
            <SubmitButton />
          </div>

          <ResultsDisplay state={state} />
        </form>
      </div>
    </main>
  );
}
