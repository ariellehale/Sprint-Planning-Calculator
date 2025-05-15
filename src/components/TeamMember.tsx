
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, Minimize, Expand, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface TeamMemberData {
  id: string;
  name: string;
  weeklyCapacity: number;
  assignedStoryPoints: Record<string, number>;
  sprintStoryPoints?: Record<number, number>; // Points assigned per sprint
}

interface TeamMemberProps {
  member: TeamMemberData;
  onChange: (updatedMember: TeamMemberData) => void;
  onRemove: (id: string) => void;
  storyPointMappings: Record<number, number>;
  sprintConfig: { sprints: number; sprintLength: number; velocity?: number };
  isNew?: boolean;
}

export default function TeamMember({ 
  member, 
  onChange, 
  onRemove, 
  storyPointMappings,
  sprintConfig,
  isNew = false
}: TeamMemberProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(member.name);
  const [tempWeeklyCapacity, setTempWeeklyCapacity] = useState(member.weeklyCapacity.toString());
  const [isOpen, setIsOpen] = useState(isNew);

  // Initialize sprint story points if not already present
  if (!member.sprintStoryPoints) {
    member.sprintStoryPoints = {};
    for (let i = 1; i <= sprintConfig.sprints; i++) {
      member.sprintStoryPoints[i] = 0;
    }
  }

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
    } else {
      // Open the collapsible when editing
      setIsOpen(true);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setTempName(member.name);
    setTempWeeklyCapacity(member.weeklyCapacity.toString());
    setIsEditing(false);
  };

  const handleSprintPointsChange = (e: React.ChangeEvent<HTMLInputElement>, sprintNumber: number) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    const updatedSprintPoints = { ...(member.sprintStoryPoints || {}) };
    updatedSprintPoints[sprintNumber] = value;

    onChange({
      ...member,
      sprintStoryPoints: updatedSprintPoints,
    });
  };

  // Calculate capacity metrics
  const sprintCapacity = member.weeklyCapacity * sprintConfig.sprintLength;
  const totalSprintCapacity = sprintCapacity * sprintConfig.sprints;
  const velocity = sprintConfig.velocity || 2; // Default to 2 hours per point
  
  // Calculate points from hours
  const weeklyCapacityPoints = Math.floor(member.weeklyCapacity / velocity);
  const sprintCapacityPoints = Math.floor(sprintCapacity / velocity);
  const totalCapacityPoints = Math.floor(totalSprintCapacity / velocity);
  
  // Calculate total points from sprint assignments
  const totalAssignedPoints = Object.values(member.sprintStoryPoints || {}).reduce((sum, points) => sum + points, 0);
  
  const capacityRemaining = totalSprintCapacity - (totalAssignedPoints * velocity);
  
  let statusColor = "bg-capacity-high";
  if (capacityRemaining < 20 && capacityRemaining >= 5) {
    statusColor = "bg-capacity-medium";
  } else if (capacityRemaining < 5) {
    statusColor = "bg-capacity-low";
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-0 mr-2 text-pink-500 hover:text-pink-600 hover:bg-pink-50"
              >
                {isOpen ? 
                  <Minimize className="h-5 w-5" /> : 
                  <Expand className="h-5 w-5" />
                }
              </Button>
              <h3 className="font-bold text-lg">{member.name}</h3>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-pink-50 hover:bg-pink-100 text-pink-600"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? "Collapse" : "Expand"}
              </Button>
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
            </div>
          </div>

          <CollapsibleContent className="mt-4 space-y-4">
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mb-4">
                <div>
                  <Label htmlFor={`name-${member.id}`}>
                    Team Member's Name
                  </Label>
                  <Input
                    id={`name-${member.id}`}
                    placeholder="Add team member's name here"
                    value={tempName}
                    onChange={handleNameChange}
                  />
                </div>
                <div>
                  <Label htmlFor={`capacity-${member.id}`}>
                    Available Working Hours per Week
                  </Label>
                  <Input
                    id={`capacity-${member.id}`}
                    type="number"
                    placeholder="Insert working hours per week here"
                    value={tempWeeklyCapacity}
                    onChange={handleCapacityChange}
                    min={0}
                  />
                </div>
                <div className="col-span-full flex justify-end space-x-2 mt-2">
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleEditToggle}>
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground space-y-1">
                <p>Weekly Capacity: {member.weeklyCapacity} hours / {weeklyCapacityPoints} points</p>
                <p>Sprint Capacity: {sprintCapacity} hours / {sprintCapacityPoints} points</p>
                <p>Total Capacity: {totalSprintCapacity} hours / {totalCapacityPoints} points</p>
              </div>
            )}

            {/* Sprint-specific story points assignment */}
            <div className="border rounded-md p-3">
              <h4 className="font-medium text-sm mb-2">Story Points per Sprint</h4>
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: sprintConfig.sprints }, (_, i) => i + 1).map((sprintNumber) => (
                  <div key={`sprint-${sprintNumber}`} className="flex items-center space-x-2">
                    <Label htmlFor={`sprint-${sprintNumber}-${member.id}`} className="whitespace-nowrap">
                      Sprint {sprintNumber}:
                    </Label>
                    <Input
                      id={`sprint-${sprintNumber}-${member.id}`}
                      type="number"
                      min={0}
                      value={(member.sprintStoryPoints?.[sprintNumber] || 0)}
                      onChange={(e) => handleSprintPointsChange(e, sprintNumber)}
                      className="h-8 w-16"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-md p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Sprint Capacity:</span>
                <span className="font-medium">{totalSprintCapacity} hours / {totalCapacityPoints} points</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Assigned Story Points:</span>
                <span className="font-medium">{totalAssignedPoints} points ({totalAssignedPoints * velocity} hours)</span>
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
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
