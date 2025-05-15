
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format, addDays } from "date-fns";
import { TeamMemberData } from "./TeamMember";

interface SprintPlanningProps {
  sprintConfig: {
    sprints: number;
    sprintLength: number;
    startDate: Date | null;
    dueDate: Date | null;
  };
  teamMembers: TeamMemberData[];
}

export default function SprintPlanning({ sprintConfig, teamMembers }: SprintPlanningProps) {
  const [sprintPlan, setSprintPlan] = useState<Array<{
    sprintNumber: number;
    startDate: Date | null;
    endDate: Date | null;
    totalPoints: number;
    teamCapacity: number;
  }>>([]);

  useEffect(() => {
    // Generate sprint plan when config or team members change
    if (sprintConfig.startDate && sprintConfig.sprints > 0) {
      generateSprintPlan();
    }
  }, [sprintConfig, teamMembers]);

  const generateSprintPlan = () => {
    if (!sprintConfig.startDate) return;

    const newSprintPlan = [];
    let currentStartDate = new Date(sprintConfig.startDate);
    
    // Ensure start date is a Monday
    const dayOfWeek = currentStartDate.getDay();
    if (dayOfWeek !== 1) { // 1 is Monday
      // If not Monday, move to the next Monday
      const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      currentStartDate = addDays(currentStartDate, daysUntilMonday);
    }

    // Calculate total team capacity per sprint
    const calculateTeamCapacity = () => {
      return teamMembers.reduce((total, member) => {
        return total + (member.weeklyCapacity * sprintConfig.sprintLength);
      }, 0);
    };

    const teamCapacity = calculateTeamCapacity();

    for (let i = 0; i < sprintConfig.sprints; i++) {
      // Sprint ends on Friday of the last week
      const sprintEndDate = addDays(
        currentStartDate, 
        (sprintConfig.sprintLength * 7) - 3 // End on Friday (remove weekend days)
      );

      // Preserve existing points if available when regenerating the plan
      const existingSprint = sprintPlan.find(s => s.sprintNumber === (i + 1));
      
      newSprintPlan.push({
        sprintNumber: i + 1,
        startDate: new Date(currentStartDate),
        endDate: new Date(sprintEndDate),
        totalPoints: existingSprint ? existingSprint.totalPoints : 0,
        teamCapacity
      });

      // Move to next sprint start (next Monday)
      currentStartDate = addDays(sprintEndDate, 3); // Move to next Monday from Friday
    }

    setSprintPlan(newSprintPlan);
  };

  // Fix: Update the handler to correctly update point values
  const handlePointsChange = (index: number, value: string) => {
    const points = parseInt(value) || 0;
    
    setSprintPlan(prevPlan => {
      const updatedPlan = [...prevPlan];
      updatedPlan[index] = {
        ...updatedPlan[index],
        totalPoints: points
      };
      return updatedPlan;
    });
  };

  if (sprintPlan.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-capacity-default">
            Sprint Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please set a sprint start date and number of sprints to generate the sprint plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-capacity-default">
          Sprint Planning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sprint</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Team Capacity (Hours)</TableHead>
                <TableHead>Planned Points</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sprintPlan.map((sprint, index) => {
                const utilizationPercentage = sprint.teamCapacity > 0 
                  ? Math.min(100, Math.round((sprint.totalPoints / sprint.teamCapacity) * 100))
                  : 0;
                  
                let statusColor = "bg-green-500"; // Good: Under 60% utilization
                if (utilizationPercentage >= 85) {
                  statusColor = "bg-red-500"; // Overloaded: >85% utilization
                } else if (utilizationPercentage >= 60) {
                  statusColor = "bg-amber-500"; // Warning: 60%-85% utilization
                }
                
                return (
                  <TableRow key={sprint.sprintNumber}>
                    <TableCell>Sprint {sprint.sprintNumber}</TableCell>
                    <TableCell>
                      {sprint.startDate ? format(sprint.startDate, 'MMM dd, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      {sprint.endDate ? format(sprint.endDate, 'MMM dd, yyyy') : '-'}
                    </TableCell>
                    <TableCell>{sprint.teamCapacity}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={sprint.totalPoints}
                        onChange={(e) => handlePointsChange(index, e.target.value)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`h-3 w-3 rounded-full ${statusColor}`}></div>
                        <span className="text-xs">
                          {statusColor.includes("green") && "Good"}
                          {statusColor.includes("amber") && "Warning"}
                          {statusColor.includes("red") && "Overloaded"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
