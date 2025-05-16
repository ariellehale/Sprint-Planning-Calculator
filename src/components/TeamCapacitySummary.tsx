
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { TeamMemberData } from "./types/TeamMemberTypes";

interface TeamCapacitySummaryProps {
  teamMembers: TeamMemberData[];
  storyPointMappings: Record<number, number>;
  sprintConfig: { 
    sprints: number; 
    sprintLength: number;
    startDate: Date | null;
    dueDate: Date | null;
    velocity: number;
  };
}

export default function TeamCapacitySummary({
  teamMembers,
  storyPointMappings,
  sprintConfig,
}: TeamCapacitySummaryProps) {
  // Calculate team totals
  let totalTeamCapacity = 0;
  let totalHoursRequired = 0;
  const velocity = sprintConfig.velocity || 2; // Default to 2 hours per point
  
  const memberSummaries = teamMembers.map(member => {
    const totalSprintCapacity = member.weeklyCapacity * sprintConfig.sprintLength * sprintConfig.sprints;
    totalTeamCapacity += totalSprintCapacity;
    
    // Calculate total points from sprint assignments
    const totalAssignedPoints = Object.values(member.sprintStoryPoints || {}).reduce((sum: number, points: number) => sum + points, 0);
    const memberHoursRequired = totalAssignedPoints * velocity;
    totalHoursRequired += memberHoursRequired;
    
    const totalCapacityPoints = Math.floor(totalSprintCapacity / velocity);
    const capacityRemaining = totalCapacityPoints - totalAssignedPoints;
    
    let statusColor = "bg-green-500"; // Good: Under 60% utilization
    const utilizationPercentage = totalCapacityPoints > 0 
      ? Math.min(100, Math.round((totalAssignedPoints / totalCapacityPoints) * 100))
      : 0;
      
    if (utilizationPercentage >= 85) {
      statusColor = "bg-red-500"; // Overloaded: >85% utilization
    } else if (utilizationPercentage >= 60) {
      statusColor = "bg-amber-500"; // Warning: 60%-85% utilization
    }
    
    return {
      name: member.name,
      weeklyCapacity: member.weeklyCapacity,
      totalCapacity: totalSprintCapacity,
      totalCapacityPoints,
      assignedPoints: totalAssignedPoints,
      hoursRequired: memberHoursRequired,
      capacityRemaining,
      statusColor,
      utilizationPercentage
    };
  });
  
  const totalTeamCapacityPoints = Math.floor(totalTeamCapacity / velocity);
  const totalAssignedPoints = memberSummaries.reduce((sum: number, member: any) => sum + member.assignedPoints, 0);
  const teamCapacityRemaining = totalTeamCapacityPoints - totalAssignedPoints;
  const teamUtilizationPercentage = totalTeamCapacityPoints > 0 
    ? Math.min(100, Math.round((totalAssignedPoints / totalTeamCapacityPoints) * 100))
    : 0;
  
  let teamStatusColor = "bg-green-500";
  if (teamUtilizationPercentage >= 85) {
    teamStatusColor = "bg-red-500";
  } else if (teamUtilizationPercentage >= 60) {
    teamStatusColor = "bg-amber-500";
  }

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-capacity-default">
          Team Capacity Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead className="text-right">Weekly Hours</TableHead>
                <TableHead className="text-right">Total Capacity (Hours)</TableHead>
                <TableHead className="text-right">Total Capacity (Points)</TableHead>
                <TableHead className="text-right">Assigned Points</TableHead>
                <TableHead className="text-right">Remaining Points</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberSummaries.map((summary) => (
                <TableRow key={summary.name} className="hover:bg-muted/20">
                  <TableCell className="font-medium">{summary.name}</TableCell>
                  <TableCell className="text-right">{summary.weeklyCapacity}</TableCell>
                  <TableCell className="text-right">{summary.totalCapacity}</TableCell>
                  <TableCell className="text-right">{summary.totalCapacityPoints}</TableCell>
                  <TableCell className="text-right">{summary.assignedPoints}</TableCell>
                  <TableCell className="text-right">{summary.capacityRemaining}</TableCell>
                  <TableCell className="text-right">{summary.utilizationPercentage}%</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`h-3 w-3 rounded-full ${summary.statusColor}`}></div>
                      <span className="text-xs">
                        {summary.statusColor.includes("green") && "Good"}
                        {summary.statusColor.includes("amber") && "Warning"}
                        {summary.statusColor.includes("red") && "Overloaded"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/50">
              <TableRow>
                <TableCell colSpan={2}>Team Totals</TableCell>
                <TableCell className="text-right">{totalTeamCapacity}</TableCell>
                <TableCell className="text-right">{totalTeamCapacityPoints}</TableCell>
                <TableCell className="text-right">{totalAssignedPoints}</TableCell>
                <TableCell className="text-right">{teamCapacityRemaining}</TableCell>
                <TableCell className="text-right">{teamUtilizationPercentage}%</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${teamStatusColor}`}></div>
                    <span className="text-xs">
                      {teamStatusColor.includes("green") && "Good"}
                      {teamStatusColor.includes("amber") && "Warning"}
                      {teamStatusColor.includes("red") && "Overloaded"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
