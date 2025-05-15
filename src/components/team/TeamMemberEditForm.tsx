
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { SprintPointsEditor } from "./SprintPointsEditor";
import { CapacityMetrics } from "./CapacityMetrics";
import { TeamMemberData } from "../types/TeamMemberTypes";

interface TeamMemberEditFormProps {
  member: TeamMemberData;
  tempName: string;
  tempWeeklyCapacity: string;
  sprintConfig: { sprints: number; sprintLength: number; velocity?: number };
  totalSprintCapacity: number;
  totalCapacityPoints: number;
  totalAssignedPoints: number;
  capacityRemaining: number;
  statusColor: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCapacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSprintPointsChange: (e: React.ChangeEvent<HTMLInputElement>, sprintNumber: number) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function TeamMemberEditForm({
  member,
  tempName,
  tempWeeklyCapacity,
  sprintConfig,
  totalSprintCapacity,
  totalCapacityPoints,
  totalAssignedPoints,
  capacityRemaining,
  statusColor,
  onNameChange,
  onCapacityChange,
  onSprintPointsChange,
  onSave,
  onCancel
}: TeamMemberEditFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mb-4">
      <div>
        <Label htmlFor={`name-${member.id}`}>
          Team Member's Name
        </Label>
        <Input
          id={`name-${member.id}`}
          placeholder="Add team member's name here"
          value={tempName}
          onChange={onNameChange}
        />
      </div>
      <div>
        <Label htmlFor={`capacity-${member.id}`}>
          Available Working Hours per Week
        </Label>
        <Input
          id={`capacity-${member.id}`}
          type="number"
          placeholder="Insert working hours per week here"
          value={tempWeeklyCapacity}
          onChange={onCapacityChange}
          min={0}
        />
      </div>

      <div className="col-span-full">
        <SprintPointsEditor 
          member={member} 
          sprints={sprintConfig.sprints} 
          onChange={onSprintPointsChange} 
        />
      </div>

      <div className="col-span-full">
        <CapacityMetrics 
          totalSprintCapacity={totalSprintCapacity}
          totalCapacityPoints={totalCapacityPoints}
          totalAssignedPoints={totalAssignedPoints}
          capacityRemaining={capacityRemaining}
          statusColor={statusColor}
        />
      </div>

      <div className="col-span-full flex justify-end space-x-2 mt-2">
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
        <Button size="sm" onClick={onSave}>
          <Check className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
}
