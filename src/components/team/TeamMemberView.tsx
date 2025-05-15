
import { SprintPointsEditor } from "./SprintPointsEditor";
import { CapacityMetrics } from "./CapacityMetrics";
import { TeamMemberData } from "../types/TeamMemberTypes";

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
  onSprintPointsChange
}: TeamMemberViewProps) {
  return (
    <>
      <div className="text-muted-foreground space-y-1">
        <p>Weekly Capacity: {member.weeklyCapacity} hours / {weeklyCapacityPoints} points</p>
        <p>Sprint Capacity: {member.weeklyCapacity * sprintConfig.sprintLength} hours / {sprintCapacityPoints} points</p>
        <p>Total Capacity: {totalSprintCapacity} hours / {totalCapacityPoints} points</p>
      </div>

      <SprintPointsEditor 
        member={member} 
        sprints={sprintConfig.sprints} 
        onChange={onSprintPointsChange} 
      />

      <CapacityMetrics 
        totalSprintCapacity={totalSprintCapacity}
        totalCapacityPoints={totalCapacityPoints}
        totalAssignedPoints={totalAssignedPoints}
        capacityRemaining={capacityRemaining}
        statusColor={statusColor}
      />
    </>
  );
}
