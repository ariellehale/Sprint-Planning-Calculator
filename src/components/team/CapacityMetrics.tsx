
import { TeamMemberData } from "../types/TeamMemberTypes";

interface CapacityMetricsProps {
  totalSprintCapacity: number;
  totalCapacityPoints: number;
  totalAssignedPoints: number;
  capacityRemaining: number;
  statusColor: string;
}

export function CapacityMetrics({
  totalSprintCapacity,
  totalCapacityPoints,
  totalAssignedPoints,
  capacityRemaining,
  statusColor
}: CapacityMetricsProps) {
  // Calculate remaining points based on total points and assigned points
  const remainingPoints = totalCapacityPoints - totalAssignedPoints;
  
  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex justify-between text-sm">
        <span>Total Capacity:</span>
        <span className="font-medium">{totalCapacityPoints} points / {totalSprintCapacity} hours</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Assigned Story Points:</span>
        <span className="font-medium">{totalAssignedPoints} points / {totalAssignedPoints * 2} hours</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Capacity Remaining:</span>
        <span className="font-medium">{remainingPoints} points / {capacityRemaining} hours</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 mt-2">
        <div 
          className={`h-full rounded-full ${statusColor}`}
          style={{ 
            width: `${Math.max(0, Math.min(100, (capacityRemaining / totalSprintCapacity) * 100))}%` 
          }}
        ></div>
      </div>
    </div>
  );
}
