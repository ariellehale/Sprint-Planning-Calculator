
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, X } from "lucide-react";

export interface TeamMemberData {
  id: string;
  name: string;
  weeklyCapacity: number;
  assignedStoryPoints: Record<string, number>;
}

interface TeamMemberProps {
  member: TeamMemberData;
  onChange: (updatedMember: TeamMemberData) => void;
  onRemove: (id: string) => void;
  storyPointMappings: Record<number, number>;
  sprintConfig: { sprints: number; sprintLength: number; velocity?: number };
}

export default function TeamMember({ 
  member, 
  onChange, 
  onRemove, 
  storyPointMappings,
  sprintConfig 
}: TeamMemberProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(member.name);
  const [tempWeeklyCapacity, setTempWeeklyCapacity] = useState(member.weeklyCapacity.toString());

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempWeeklyCapacity(e.target.value);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      onChange({
        ...member,
        name: tempName || "Team Member",
        weeklyCapacity: Math.max(0, parseInt(tempWeeklyCapacity) || 0),
      });
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setTempName(member.name);
    setTempWeeklyCapacity(member.weeklyCapacity.toString());
    setIsEditing(false);
  };

  const handleStoryPointChange = (e: React.ChangeEvent<HTMLInputElement>, points: number) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    const updatedPoints = { ...member.assignedStoryPoints };
    updatedPoints[points.toString()] = value;
    
    onChange({
      ...member,
      assignedStoryPoints: updatedPoints,
    });
  };

  // Calculate capacity metrics
  const sprintCapacity = member.weeklyCapacity * sprintConfig.sprintLength;
  const totalSprintCapacity = sprintCapacity * sprintConfig.sprints;
  
  let totalHoursRequired = 0;
  Object.entries(member.assignedStoryPoints).forEach(([pointsStr, count]) => {
    const points = parseInt(pointsStr);
    const hours = storyPointMappings[points] || 0;
    totalHoursRequired += count * hours;
  });
  
  const capacityRemaining = totalSprintCapacity - totalHoursRequired;
  
  let statusColor = "bg-capacity-high";
  if (capacityRemaining < 20 && capacityRemaining >= 5) {
    statusColor = "bg-capacity-medium";
  } else if (capacityRemaining < 5) {
    statusColor = "bg-capacity-low";
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              <div>
                <Label htmlFor={`name-${member.id}`} className="sr-only">
                  Name
                </Label>
                <Input
                  id={`name-${member.id}`}
                  placeholder="Team Member Name"
                  value={tempName}
                  onChange={handleNameChange}
                />
              </div>
              <div>
                <Label htmlFor={`capacity-${member.id}`} className="sr-only">
                  Weekly Capacity (Hours)
                </Label>
                <Input
                  id={`capacity-${member.id}`}
                  type="number"
                  placeholder="Weekly Capacity"
                  value={tempWeeklyCapacity}
                  onChange={handleCapacityChange}
                  min={0}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <h3 className="font-bold text-lg">{member.name}</h3>
              <div className="text-muted-foreground space-y-1">
                <p>Weekly Capacity: {member.weeklyCapacity} hours</p>
                <p>Sprint Capacity: {sprintCapacity} hours</p>
                <p>Total Capacity: {totalSprintCapacity} hours</p>
              </div>
            </div>
          )}
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={handleEditToggle}>
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={handleEditToggle}>
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onRemove(member.id)}
                >
                  Remove
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="border rounded-md p-3">
            <h4 className="font-medium text-sm mb-2">Story Points Assignment</h4>
            <div className="flex flex-wrap gap-3">
              {Object.keys(storyPointMappings).map((pointsStr) => {
                const points = parseInt(pointsStr);
                return (
                  <div key={points} className="flex items-center space-x-2">
                    <Label htmlFor={`sp-${points}-${member.id}`} className="whitespace-nowrap">
                      {points} {points === 1 ? "point" : "points"}:
                    </Label>
                    <Input
                      id={`sp-${points}-${member.id}`}
                      type="number"
                      min={0}
                      value={member.assignedStoryPoints[points] || 0}
                      onChange={(e) => handleStoryPointChange(e, points)}
                      className="h-8 w-16"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border rounded-md p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Sprint Capacity:</span>
              <span className="font-medium">{totalSprintCapacity} hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Hours Required:</span>
              <span className="font-medium">{totalHoursRequired} hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Capacity Remaining:</span>
              <span className="font-medium">{capacityRemaining} hours</span>
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
        </div>
      </CardContent>
    </Card>
  );
}
