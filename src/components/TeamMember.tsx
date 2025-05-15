import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { TeamMemberEditForm } from "./team/TeamMemberEditForm";
import { TeamMemberView } from "./team/TeamMemberView";
import { TeamMemberData } from "./types/TeamMemberTypes";

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
      
      // After saving, close the editing mode and collapse the section
      setIsEditing(false);
      setIsOpen(false);
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
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="font-bold text-lg">{member.name}</h3>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <>
                  <div 
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </div>
                  <div 
                    className="cursor-pointer text-red-500 hover:text-red-600"
                    onClick={() => onRemove(member.id)}
                  >
                    Remove
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <CollapsibleContent className="mt-4 space-y-4">
            {isEditing ? (
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
                onSave={handleEditToggle}
                onCancel={handleCancel}
              />
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
