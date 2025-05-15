
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { TeamMemberEditForm } from "./team/TeamMemberEditForm";
import { TeamMemberView } from "./team/TeamMemberView";
import { TeamMemberData } from "./types/TeamMemberTypes";
import { SprintPointsEditor } from "./team/SprintPointsEditor";
import { CapacityMetrics } from "./team/CapacityMetrics";
import { TeamMemberActions } from "./team/TeamMemberActions";
import { TeamMemberHeader } from "./team/TeamMemberHeader";
import { useTeamMember } from "../hooks/useTeamMember";
import { calculateCapacity } from "../utils/calculateCapacity";

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
  const {
    isEditing,
    tempName,
    tempWeeklyCapacity,
    isOpen,
    showFullContent,
    handleNameChange,
    handleCapacityChange,
    handleEditToggle,
    handleCancel,
    handleEditClick,
    handleDelete,
    handleSprintPointsChange,
    setIsOpen
  } = useTeamMember(member, onChange, onRemove, isNew);

  // Calculate capacity metrics
  const capacityMetrics = calculateCapacity(member, sprintConfig);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {isEditing ? (
            <>
              <TeamMemberHeader 
                member={member} 
                isEditing={isEditing} 
                tempName={tempName} 
              />
              <TeamMemberActions
                isEditing={isEditing}
                onSave={handleEditToggle}
                onCancel={handleCancel}
                onDelete={handleDelete}
              />
            </>
          ) : (
            <TeamMemberView 
              member={member}
              weeklyCapacityPoints={capacityMetrics.weeklyCapacityPoints}
              sprintCapacityPoints={capacityMetrics.sprintCapacityPoints}
              totalCapacityPoints={capacityMetrics.totalCapacityPoints}
              totalSprintCapacity={capacityMetrics.totalSprintCapacity}
              totalAssignedPoints={capacityMetrics.totalAssignedPoints}
              capacityRemaining={capacityMetrics.capacityRemaining}
              statusColor={capacityMetrics.statusColor}
              sprintConfig={sprintConfig}
              onSprintPointsChange={handleSprintPointsChange}
              onEditClick={handleEditClick}
            />
          )}

          <CollapsibleContent className="mt-4 space-y-4">
            {isEditing && (
              <TeamMemberEditForm
                member={member}
                tempName={tempName}
                tempWeeklyCapacity={tempWeeklyCapacity}
                sprintConfig={sprintConfig}
                totalSprintCapacity={capacityMetrics.totalSprintCapacity}
                totalCapacityPoints={capacityMetrics.totalCapacityPoints}
                totalAssignedPoints={capacityMetrics.totalAssignedPoints}
                capacityRemaining={capacityMetrics.capacityRemaining}
                statusColor={capacityMetrics.statusColor}
                onNameChange={handleNameChange}
                onCapacityChange={handleCapacityChange}
                onSprintPointsChange={handleSprintPointsChange}
              />
            )}
            {!isEditing && showFullContent && (
              <>
                <SprintPointsEditor 
                  member={member} 
                  sprints={sprintConfig.sprints} 
                  onChange={handleSprintPointsChange} 
                />

                <CapacityMetrics 
                  totalSprintCapacity={capacityMetrics.totalSprintCapacity}
                  totalCapacityPoints={capacityMetrics.totalCapacityPoints}
                  totalAssignedPoints={capacityMetrics.totalAssignedPoints}
                  capacityRemaining={capacityMetrics.capacityRemaining}
                  statusColor={capacityMetrics.statusColor}
                />
              </>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
