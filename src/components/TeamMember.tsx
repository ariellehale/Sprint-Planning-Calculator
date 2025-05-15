
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { TeamMemberEditForm } from "./team/TeamMemberEditForm";
import { TeamMemberView } from "./team/TeamMemberView";
import { TeamMemberData } from "./types/TeamMemberTypes";
import { Save, X, Trash2 } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(isNew);
  const [tempName, setTempName] = useState(member.name);
  const [tempWeeklyCapacity, setTempWeeklyCapacity] = useState(member.weeklyCapacity.toString());
  const [isOpen, setIsOpen] = useState(isNew);

  // When isNew changes, update editing state
  useEffect(() => {
    if (isNew) {
      setIsEditing(true);
      setIsOpen(true);
    }
  }, [isNew]);

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
      
      // After saving, close the editing mode but keep the section open
      setIsEditing(false);
    } else {
      // Open the collapsible when editing
      setIsOpen(true);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setTempName(member.name);
    setTempWeeklyCapacity(member.weeklyCapacity.toString());
    setIsEditing(false);
    
    // If this is a new member, keep it expanded
    if (!isNew) {
      setIsOpen(false);
    }
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
  const velocity = sprintConfig.velocity || 2; // Default to 2 hours per point
  const sprintCapacity = member.weeklyCapacity * sprintConfig.sprintLength;
  const totalSprintCapacity = sprintCapacity * sprintConfig.sprints;
  
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
          {isEditing ? (
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{tempName || member.name}</h3>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="bg-[#9b87f5] text-white hover:bg-[#8a76e4]"
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleEditToggle}
                  className="bg-[#4CAF50] hover:bg-[#43A047] text-white"
                >
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => setIsOpen(!isOpen)}
              >
                <h3 className="font-bold text-lg">{member.name}</h3>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsOpen(true);
                  setIsEditing(true);
                }}
                className="bg-[#311B92] text-white hover:bg-[#4527A0]"
              >
                Edit
              </Button>
            </div>
          )}

          <CollapsibleContent className="mt-4 space-y-4">
            {isEditing ? (
              <>
                <TeamMemberEditForm
                  member={member}
                  tempName={tempName}
                  tempWeeklyCapacity={tempWeeklyCapacity}
                  sprintConfig={sprintConfig}
                  totalSprintCapacity={totalSprintCapacity}
                  totalCapacityPoints={totalCapacityPoints}
                  totalAssignedPoints={totalAssignedPoints}
                  capacityRemaining={capacityRemaining}
                  statusColor={statusColor}
                  onNameChange={handleNameChange}
                  onCapacityChange={handleCapacityChange}
                  onSprintPointsChange={handleSprintPointsChange}
                />
                <div className="mt-4">
                  <Button 
                    variant="destructive" 
                    onClick={() => onRemove(member.id)}
                    className="bg-[#ea384c] hover:bg-[#d32f2f] text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete Team Member
                  </Button>
                </div>
              </>
            ) : (
              <TeamMemberView
                member={member}
                weeklyCapacityPoints={weeklyCapacityPoints}
                sprintCapacityPoints={sprintCapacityPoints}
                totalCapacityPoints={totalCapacityPoints}
                totalSprintCapacity={totalSprintCapacity}
                totalAssignedPoints={totalAssignedPoints}
                capacityRemaining={capacityRemaining}
                statusColor={statusColor}
                sprintConfig={sprintConfig}
                onSprintPointsChange={handleSprintPointsChange}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
