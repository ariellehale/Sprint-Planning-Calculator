
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeamMemberData } from "../types/TeamMemberTypes";

interface SprintPointsAssignmentProps {
  member: TeamMemberData;
  sprintNumber: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, sprintNumber: number) => void;
}

export function SprintPointsAssignment({ 
  member, 
  sprintNumber, 
  onChange 
}: SprintPointsAssignmentProps) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={`sprint-${sprintNumber}-${member.id}`} className="whitespace-nowrap">
        Sprint {sprintNumber}:
      </Label>
      <Input
        id={`sprint-${sprintNumber}-${member.id}`}
        type="number"
        min={0}
        value={(member.sprintStoryPoints?.[sprintNumber] || 0)}
        onChange={(e) => onChange(e, sprintNumber)}
        className="h-8 w-16"
      />
    </div>
  );
}
