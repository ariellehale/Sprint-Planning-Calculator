
import { TeamMemberData } from "../components/types/TeamMemberTypes";

interface CapacityConfig {
  sprints: number;
  sprintLength: number;
  velocity?: number;
}

export interface CapacityMetrics {
  weeklyCapacityPoints: number;
  sprintCapacity: number;
  sprintCapacityPoints: number;
  totalSprintCapacity: number;
  totalCapacityPoints: number;
  totalAssignedPoints: number;
  capacityRemaining: number;
  statusColor: string;
}

export function calculateCapacity(member: TeamMemberData, config: CapacityConfig): CapacityMetrics {
  // Use default velocity if not provided
  const velocity = config.velocity || 2; 
  
  // Calculate capacity metrics
  const sprintCapacity = member.weeklyCapacity * config.sprintLength;
  const totalSprintCapacity = sprintCapacity * config.sprints;
  
  // Calculate points from hours
  const weeklyCapacityPoints = Math.floor(member.weeklyCapacity / velocity);
  const sprintCapacityPoints = weeklyCapacityPoints * config.sprintLength;
  const totalCapacityPoints = sprintCapacityPoints * config.sprints;
  
  // Calculate total points from sprint assignments
  const totalAssignedPoints = Object.values(member.sprintStoryPoints || {}).reduce((sum, points) => sum + points, 0);
  
  // Calculate capacity remaining in hours
  const capacityRemaining = totalSprintCapacity - (totalAssignedPoints * velocity);
  
  // Determine status color based on capacity remaining
  let statusColor = "bg-capacity-high";
  const utilizationPercentage = totalCapacityPoints > 0
    ? (totalAssignedPoints / totalCapacityPoints) * 100
    : 0;
    
  if (utilizationPercentage >= 85) {
    statusColor = "bg-capacity-low";
  } else if (utilizationPercentage >= 60) {
    statusColor = "bg-capacity-medium";
  }

  return {
    weeklyCapacityPoints,
    sprintCapacity,
    sprintCapacityPoints,
    totalSprintCapacity,
    totalCapacityPoints,
    totalAssignedPoints,
    capacityRemaining,
    statusColor
  };
}
