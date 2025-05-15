
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberData } from "./TeamMember";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
  if (teamMembers.length === 0) {
    return null;
  }
  
  // Generate sprint dates
  const generateSprintDates = () => {
    if (!sprintConfig.startDate) return [];
    
    const sprintDates = [];
    let currentDate = new Date(sprintConfig.startDate);
    
    for (let i = 0; i < sprintConfig.sprints; i++) {
      sprintDates.push(new Date(currentDate));
      // Add sprint length (in weeks) to the current date
      currentDate.setDate(currentDate.getDate() + (sprintConfig.sprintLength * 7));
    }
    
    return sprintDates;
  };
  
  const sprintDates = generateSprintDates();
  
  // Format sprint date for display
  const formatSprintDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Prepare data for the line chart
  const prepareChartData = () => {
    const chartData = [];
    
    // If we have sprint dates, use them for the chart
    if (sprintDates.length > 0) {
      for (let i = 0; i < sprintConfig.sprints; i++) {
        let totalCapacity = 0;
        let totalHoursRequired = 0;
        
        teamMembers.forEach(member => {
          const sprintCapacity = member.weeklyCapacity * sprintConfig.sprintLength;
          totalCapacity += sprintCapacity;
          
          let hoursRequired = 0;
          Object.entries(member.assignedStoryPoints).forEach(([pointsStr, count]) => {
            const points = parseInt(pointsStr);
            const hours = storyPointMappings[points] || 0;
            // Distribute story points evenly across sprints for visualization
            hoursRequired += (count * hours) / sprintConfig.sprints;
          });
          
          totalHoursRequired += hoursRequired;
        });
        
        chartData.push({
          name: `Sprint ${i + 1} (${formatSprintDate(sprintDates[i])})`,
          totalCapacity,
          hoursRequired: totalHoursRequired,
          capacityRemaining: totalCapacity - totalHoursRequired
        });
      }
    } else {
      // Fallback if no dates are provided
      for (let i = 0; i < sprintConfig.sprints; i++) {
        let totalCapacity = 0;
        let totalHoursRequired = 0;
        
        teamMembers.forEach(member => {
          const sprintCapacity = member.weeklyCapacity * sprintConfig.sprintLength;
          totalCapacity += sprintCapacity;
          
          let hoursRequired = 0;
          Object.entries(member.assignedStoryPoints).forEach(([pointsStr, count]) => {
            const points = parseInt(pointsStr);
            const hours = storyPointMappings[points] || 0;
            // Distribute story points evenly across sprints for visualization
            hoursRequired += (count * hours) / sprintConfig.sprints;
          });
          
          totalHoursRequired += hoursRequired;
        });
        
        chartData.push({
          name: `Sprint ${i + 1}`,
          totalCapacity,
          hoursRequired: totalHoursRequired,
          capacityRemaining: totalCapacity - totalHoursRequired
        });
      }
    }
    
    return chartData;
  };
  
  const chartData = prepareChartData();
  
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
              <LineChart
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
                <Line 
                  type="monotone" 
                  dataKey="totalCapacity" 
                  name="Total Capacity" 
                  stroke={chartConfig.capacity.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hoursRequired" 
                  name="Hours Required" 
                  stroke={chartConfig.required.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="capacityRemaining" 
                  name="Capacity Remaining" 
                  stroke={chartConfig.remaining.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
