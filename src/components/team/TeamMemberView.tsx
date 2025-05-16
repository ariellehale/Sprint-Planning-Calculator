
import { SprintPointsEditor } from "./SprintPointsEditor";
import { CapacityMetrics } from "./CapacityMetrics";
import { TeamMemberData } from "../types/TeamMemberTypes";
import { Button } from "@/components/ui/button";

interface TeamMemberViewProps {
  member: TeamMemberData;
  weeklyCapacityPoints: number;
  sprintCapacityPoints: number;
  totalCapacityPoints: number;
  totalSprintCapacity: number;
  totalAssignedPoints: number;
  capacityRemaining: number;
  statusColor: string;
  sprintConfig: { sprints: number; sprintLength: number; velocity?: number };
  onSprintPointsChange: (e: React.ChangeEvent<HTMLInputElement>, sprintNumber: number) => void;
  onEditClick: () => void;
}

export function TeamMemberView({
  member,
  weeklyCapacityPoints,
  sprintCapacityPoints,
  totalCapacityPoints,
  totalSprintCapacity,
  totalAssignedPoints,
  capacityRemaining,
  statusColor,
  sprintConfig,
  onSprintPointsChange,
  onEditClick
}: TeamMemberViewProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{member.name}</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onEditClick}
          className="bg-[#311B92] text-white hover:bg-[#4527A0]"
        >
          Edit
        </Button>
      </div>
      
      <div className="text-muted-foreground space-y-1 mt-2">
        <p>Weekly Capacity: {weeklyCapacityPoints} points / {member.weeklyCapacity} hours</p>
        <p>Sprint Capacity: {sprintCapacityPoints} points / {member.weeklyCapacity * sprintConfig.sprintLength} hours</p>
        <p>Total Capacity: {totalCapacityPoints} points / {totalSprintCapacity} hours</p>
      </div>

      {/* The rest of the content is now hidden from the collapsed view */}
    </>
  );
}
