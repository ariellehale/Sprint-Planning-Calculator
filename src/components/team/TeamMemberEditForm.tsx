
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SprintPointsEditor } from "./SprintPointsEditor";
import { CapacityMetrics } from "./CapacityMetrics";
import { DeleteTeamMemberButton } from "./DeleteTeamMemberButton";
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
  onDelete: () => void;
  isEditing: boolean;
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
  onDelete,
  isEditing
}: TeamMemberEditFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
      <div>
        <Label htmlFor={`name-${member.id}`}>
          Team Member's Name
        </Label>
        <Input
          id={`name-${member.id}`}
          placeholder="Add team member's name here"
          value={tempName}
          onChange={onNameChange}
          className="mt-1"
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
          className="mt-1"
        />
      </div>

      <div className="col-span-full mt-2">
        <SprintPointsEditor 
          member={member} 
          sprints={sprintConfig.sprints} 
          onChange={onSprintPointsChange} 
        />
      </div>

      <div className="col-span-full mt-2">
        <CapacityMetrics 
          totalSprintCapacity={totalSprintCapacity}
          totalCapacityPoints={totalCapacityPoints}
          totalAssignedPoints={totalAssignedPoints}
          capacityRemaining={capacityRemaining}
          statusColor={statusColor}
        />
      </div>
      
      <div className="col-span-full">
        <DeleteTeamMemberButton onDelete={onDelete} isEditing={isEditing} />
      </div>
    </div>
  );
}
