
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberData } from "./TeamMember";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

interface TeamCapacitySummaryProps {
  teamMembers: TeamMemberData[];
  storyPointMappings: Record<number, number>;
  sprintConfig: { sprints: number; sprintLength: number };
}

export default function TeamCapacitySummary({
  teamMembers,
  storyPointMappings,
  sprintConfig,
}: TeamCapacitySummaryProps) {
  // Calculate team totals
  let totalTeamCapacity = 0;
  let totalHoursRequired = 0;
  
  const memberSummaries = teamMembers.map(member => {
    const totalSprintCapacity = member.weeklyCapacity * sprintConfig.sprintLength * sprintConfig.sprints;
    totalTeamCapacity += totalSprintCapacity;
    
    let memberHoursRequired = 0;
    Object.entries(member.assignedStoryPoints).forEach(([pointsStr, count]) => {
      const points = parseInt(pointsStr);
      const hours = storyPointMappings[points] || 0;
      memberHoursRequired += count * hours;
    });
    totalHoursRequired += memberHoursRequired;
    
    const capacityRemaining = totalSprintCapacity - memberHoursRequired;
    
    let statusColor = "bg-capacity-high";
    if (capacityRemaining < 20 && capacityRemaining >= 5) {
      statusColor = "bg-capacity-medium";
    } else if (capacityRemaining < 5) {
      statusColor = "bg-capacity-low";
    }
    
    return {
      name: member.name,
      weeklyCapacity: member.weeklyCapacity,
      totalCapacity: totalSprintCapacity,
      hoursRequired: memberHoursRequired,
      capacityRemaining,
      statusColor,
      utilizationPercentage: totalSprintCapacity > 0 
        ? Math.min(100, Math.round((memberHoursRequired / totalSprintCapacity) * 100))
        : 0
    };
  });
  
  const teamCapacityRemaining = totalTeamCapacity - totalHoursRequired;
  const teamUtilizationPercentage = totalTeamCapacity > 0 
    ? Math.min(100, Math.round((totalHoursRequired / totalTeamCapacity) * 100))
    : 0;
  
  let teamStatusColor = "bg-capacity-high";
  if (teamCapacityRemaining < 40 && teamCapacityRemaining >= 10) {
    teamStatusColor = "bg-capacity-medium";
  } else if (teamCapacityRemaining < 10) {
    teamStatusColor = "bg-capacity-low";
  }

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <Card>
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
                <TableHead className="text-right">Total Capacity</TableHead>
                <TableHead className="text-right">Hours Required</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberSummaries.map((summary) => (
                <TableRow key={summary.name}>
                  <TableCell className="font-medium">{summary.name}</TableCell>
                  <TableCell className="text-right">{summary.weeklyCapacity}</TableCell>
                  <TableCell className="text-right">{summary.totalCapacity}</TableCell>
                  <TableCell className="text-right">{summary.hoursRequired}</TableCell>
                  <TableCell className="text-right">{summary.capacityRemaining}</TableCell>
                  <TableCell className="text-right">{summary.utilizationPercentage}%</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`h-3 w-3 rounded-full ${summary.statusColor}`}></div>
                      <span className="text-xs">
                        {summary.statusColor.includes("high") && "Good"}
                        {summary.statusColor.includes("medium") && "Warning"}
                        {summary.statusColor.includes("low") && "Overloaded"}
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
                <TableCell className="text-right">{totalHoursRequired}</TableCell>
                <TableCell className="text-right">{teamCapacityRemaining}</TableCell>
                <TableCell className="text-right">{teamUtilizationPercentage}%</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${teamStatusColor}`}></div>
                    <span className="text-xs">
                      {teamStatusColor.includes("high") && "Good"}
                      {teamStatusColor.includes("medium") && "Warning"}
                      {teamStatusColor.includes("low") && "Overloaded"}
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
