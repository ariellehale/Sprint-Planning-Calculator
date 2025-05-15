
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SprintConfigProps {
  onConfigChange: (sprints: number, sprintLength: number, startDate: Date | null, dueDate: Date | null) => void;
}

export default function SprintConfig({ onConfigChange }: SprintConfigProps) {
  const [sprints, setSprints] = useState<number>(1);
  const [sprintLength, setSprintLength] = useState<number>(2);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Fixed: Added proper dependency array and prevent infinite loop
  useEffect(() => {
    if (startDate && dueDate && dueDate > startDate && !isCalculating) {
      setIsCalculating(true);
      
      // Calculate total days between start and due date
      const totalDays = differenceInDays(dueDate, startDate);
      
      // Calculate number of sprints based on sprint length (in weeks)
      const calculatedSprints = Math.ceil(totalDays / (sprintLength * 7));
      
      // Update sprints
      if (calculatedSprints > 0 && calculatedSprints !== sprints) {
        setSprints(calculatedSprints);
      }
      
      setIsCalculating(false);
    }
  }, [startDate, dueDate, sprintLength, sprints, isCalculating]);

  // Fixed: Added proper dependency array and prevent infinite loop
  useEffect(() => {
    onConfigChange(sprints, sprintLength, startDate, dueDate);
  }, [sprints, sprintLength, startDate, dueDate, onConfigChange]);

  const handleSprintsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setSprints(value);
  };

  const handleSprintLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setSprintLength(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-capacity-default">
          Sprint Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="sprints">Number of Sprints</Label>
            <Input
              id="sprints"
              type="number"
              min={1}
              value={sprints}
              onChange={handleSprintsChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sprintLength">Sprint Length (weeks)</Label>
            <Input
              id="sprintLength"
              type="number"
              min={1}
              value={sprintLength}
              onChange={handleSprintLengthChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Sprint Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Project Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dueDate"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  disabled={(date) => startDate ? date < startDate : false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
