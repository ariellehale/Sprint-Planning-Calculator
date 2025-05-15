
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
import { 
  Input
} from "@/components/ui/input";
import { format, addDays } from "date-fns";
import { TeamMemberData } from "./TeamMember";
import { useToast } from "@/hooks/use-toast";

interface SprintPlanningProps {
  sprintConfig: {
    sprints: number;
    sprintLength: number;
    startDate: Date | null;
    dueDate: Date | null;
    velocity: number;
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
    teamCapacityPoints: number;
    adjustedCapacityPoints: number;
    remainingPoints: number;
  }>>([]);
  const { toast } = useToast();

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
    const teamCapacityPoints = Math.floor(teamCapacity / sprintConfig.velocity);

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
        teamCapacity,
        teamCapacityPoints,
        adjustedCapacityPoints: teamCapacityPoints, // Initially same as teamCapacityPoints
        remainingPoints: teamCapacityPoints // Initially same as adjusted capacity points
      });

      // Move to next sprint start (next Monday)
      currentStartDate = addDays(sprintEndDate, 3); // Move to next Monday from Friday
    }

    recalculateCapacityOverflow(newSprintPlan);
  };

  // Recalculate capacity overflow across all sprints
  const recalculateCapacityOverflow = (sprintPlanArray = sprintPlan) => {
    const updatedPlan = [...sprintPlanArray];
    
    // Reset all adjusted capacities to original teamCapacity points
    updatedPlan.forEach(sprint => {
      sprint.adjustedCapacityPoints = sprint.teamCapacityPoints;
      sprint.remainingPoints = sprint.teamCapacityPoints;
    });
    
    // Calculate overflows
    for (let i = 0; i < updatedPlan.length - 1; i++) {
      const currentSprint = updatedPlan[i];
      const nextSprint = updatedPlan[i + 1];
      
      // Calculate remaining points after planned points
      currentSprint.remainingPoints = currentSprint.adjustedCapacityPoints - currentSprint.totalPoints;
      
      // Check if points exceed the adjusted capacity points
      if (currentSprint.remainingPoints < 0) {
        // Calculate overflow
        const overflow = Math.abs(currentSprint.remainingPoints);
        currentSprint.remainingPoints = 0;
        
        // Reduce next sprint's capacity by overflow
        nextSprint.adjustedCapacityPoints = nextSprint.teamCapacityPoints - overflow;
        if (nextSprint.adjustedCapacityPoints < 0) {
          nextSprint.adjustedCapacityPoints = 0;
        }
        nextSprint.remainingPoints = nextSprint.adjustedCapacityPoints;
      } else {
        // No overflow
        currentSprint.remainingPoints = currentSprint.adjustedCapacityPoints - currentSprint.totalPoints;
      }
    }
    
    // Check the last sprint for overflow (no next sprint to adjust)
    const lastSprint = updatedPlan[updatedPlan.length - 1];
    lastSprint.remainingPoints = lastSprint.adjustedCapacityPoints - lastSprint.totalPoints;
    if (lastSprint.remainingPoints < 0) {
      lastSprint.remainingPoints = 0;
    }
    
    setSprintPlan(updatedPlan);
  };

  // Using Input component for direct numerical input
  const handlePointsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const points = parseInt(value) || 0;
    
    // Create a new array with all sprints
    const newPlan = [...sprintPlan];
    
    // Update the specific sprint with new points
    newPlan[index] = {
      ...newPlan[index],
      totalPoints: points
    };
    
    // Recalculate capacity overflow
    recalculateCapacityOverflow(newPlan);
    
    // Add a toast notification to confirm the update
    toast({
      title: "Points Updated",
      description: `Sprint ${newPlan[index].sprintNumber} planned points set to ${points}`,
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
                <TableHead>Team Capacity (Points)</TableHead>
                <TableHead>Planned Points</TableHead>
                <TableHead>Remaining Points</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sprintPlan.map((sprint, index) => {
                // Calculate utilization percentage based on points
                const utilizationPercentage = sprint.adjustedCapacityPoints > 0 
                  ? Math.min(100, Math.round((sprint.totalPoints / sprint.adjustedCapacityPoints) * 100))
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
                      {sprint.adjustedCapacityPoints} 
                      {sprint.adjustedCapacityPoints < sprint.teamCapacityPoints && (
                        <span className="text-red-500 ml-1">
                          (-{sprint.teamCapacityPoints - sprint.adjustedCapacityPoints})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={sprint.totalPoints}
                        onChange={(e) => handlePointsChange(index, e)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell className={sprint.remainingPoints < 5 ? "text-red-500 font-medium" : ""}>
                      {sprint.remainingPoints}
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
