
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMemberData } from "./TeamMember";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface TeamCapacityChartProps {
  teamMembers: TeamMemberData[];
  storyPointMappings: Record<number, number>;
  sprintConfig: { sprints: number; sprintLength: number };
}

export default function TeamCapacityChart({
  teamMembers,
  storyPointMappings,
  sprintConfig,
}: TeamCapacityChartProps) {
  if (teamMembers.length === 0) {
    return null;
  }

  const chartData = teamMembers.map(member => {
    const totalSprintCapacity = member.weeklyCapacity * sprintConfig.sprintLength * sprintConfig.sprints;
    
    let hoursRequired = 0;
    Object.entries(member.assignedStoryPoints).forEach(([pointsStr, count]) => {
      const points = parseInt(pointsStr);
      const hours = storyPointMappings[points] || 0;
      hoursRequired += count * hours;
    });
    
    const capacityRemaining = totalSprintCapacity - hoursRequired;
    
    return {
      name: member.name,
      totalCapacity: totalSprintCapacity,
      hoursRequired: hoursRequired,
      capacityRemaining: capacityRemaining
    };
  });

  // Calculate team totals for additional bar
  const teamTotals = {
    name: "Team Total",
    totalCapacity: chartData.reduce((sum, item) => sum + item.totalCapacity, 0),
    hoursRequired: chartData.reduce((sum, item) => sum + item.hoursRequired, 0),
    capacityRemaining: chartData.reduce((sum, item) => sum + item.capacityRemaining, 0)
  };

  // Add team totals to chart data
  const completeChartData = [...chartData, teamTotals];

  const chartConfig = {
    capacity: { label: "Total Capacity", color: "#9b87f5" },
    required: { label: "Hours Required", color: "#F97316" },
    remaining: { label: "Capacity Remaining", color: "#0EA5E9" }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-capacity-default">
          Team Capacity Visualization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={completeChartData}
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
                <Bar dataKey="totalCapacity" name="Total Capacity" fill={chartConfig.capacity.color} />
                <Bar dataKey="hoursRequired" name="Hours Required" fill={chartConfig.required.color} />
                <Bar dataKey="capacityRemaining" name="Capacity Remaining" fill={chartConfig.remaining.color} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
