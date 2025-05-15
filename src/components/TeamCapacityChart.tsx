
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberData } from "./TeamMember";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TeamCapacityChartProps {
  teamMembers: TeamMemberData[];
  storyPointMappings: Record<number, number>;
  sprintConfig: { 
    sprints: number; 
    sprintLength: number;
    startDate: Date | null;
  };
}

export default function TeamCapacityChart({
  teamMembers,
  storyPointMappings,
  sprintConfig,
}: TeamCapacityChartProps) {
  // If there are no team members, don't render the chart
  if (teamMembers.length === 0) {
    return null;
  }
  
  // Generate sprint dates - improved to handle null dates
  const generateSprintDates = () => {
    if (!sprintConfig.startDate) return [];
    
    const sprintDates = [];
    let currentDate = new Date(sprintConfig.startDate);
    
    // Ensure start date is a Monday
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 1) { // 1 is Monday
      // If not Monday, move to the next Monday
      const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + daysUntilMonday));
    }
    
    for (let i = 0; i < sprintConfig.sprints; i++) {
      sprintDates.push(new Date(currentDate));
      // Add sprint length (in weeks) to the current date
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + (sprintConfig.sprintLength * 7));
      currentDate = newDate;
    }
    
    return sprintDates;
  };
  
  const sprintDates = generateSprintDates();
  
  // Format sprint date for display
  const formatSprintDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Prepare data for the bar chart
  const prepareChartData = () => {
    const chartData = [];
    
    // Calculate basic capacity values even if we don't have sprint dates
    let totalTeamCapacity = 0;
    let totalHoursRequired = 0;
    
    teamMembers.forEach(member => {
      totalTeamCapacity += member.weeklyCapacity * sprintConfig.sprintLength;
      
      Object.entries(member.assignedStoryPoints).forEach(([pointsStr, count]) => {
        const points = parseInt(pointsStr);
        const hours = storyPointMappings[points] || 0;
        totalHoursRequired += (count * hours);
      });
    });
    
    // Distribute the total across the number of sprints
    const hoursRequiredPerSprint = totalHoursRequired / Math.max(1, sprintConfig.sprints);
    
    // If we have sprint dates, use them for the chart
    if (sprintDates.length > 0) {
      for (let i = 0; i < sprintConfig.sprints; i++) {
        chartData.push({
          name: `Sprint ${i + 1} (${formatSprintDate(sprintDates[i])})`,
          totalCapacity: totalTeamCapacity,
          hoursRequired: hoursRequiredPerSprint,
          capacityRemaining: totalTeamCapacity - hoursRequiredPerSprint
        });
      }
    } else {
      // Fallback if no dates are provided
      for (let i = 0; i < sprintConfig.sprints; i++) {
        chartData.push({
          name: `Sprint ${i + 1}`,
          totalCapacity: totalTeamCapacity,
          hoursRequired: hoursRequiredPerSprint,
          capacityRemaining: totalTeamCapacity - hoursRequiredPerSprint
        });
      }
    }
    
    return chartData;
  };
  
  const chartData = prepareChartData();
  
  // If we don't have any chart data, don't render
  if (chartData.length === 0) {
    return null;
  }
  
  const chartConfig = {
    capacity: { label: "Total Capacity", color: "#9b87f5" },
    required: { label: "Hours Required", color: "#F97316" },
    remaining: { label: "Capacity Remaining", color: "#0EA5E9" }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-capacity-default">
          Team Capacity Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={70} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="font-medium">{payload[0]?.payload.name}</p>
                          {payload.map((entry, index) => (
                            <p key={`item-${index}`} style={{ color: entry.color }}>
                              {entry.name}: {entry.value} hours
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="totalCapacity" 
                  name="Total Capacity" 
                  fill={chartConfig.capacity.color}
                  barSize={30}
                />
                <Bar 
                  dataKey="hoursRequired" 
                  name="Hours Required" 
                  fill={chartConfig.required.color}
                  barSize={30}
                />
                <Bar 
                  dataKey="capacityRemaining" 
                  name="Capacity Remaining" 
                  fill={chartConfig.remaining.color}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
