import { useState, useEffect } from "react";
import { TeamMemberData } from "../components/types/TeamMemberTypes";

export function useTeamMember(
  member: TeamMemberData,
  onChange: (updatedMember: TeamMemberData) => void,
  onRemove: (id: string) => void,
  isNew = false
) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [tempName, setTempName] = useState(member.name);
  const [tempWeeklyCapacity, setTempWeeklyCapacity] = useState(member.weeklyCapacity.toString());
  const [isOpen, setIsOpen] = useState(isNew);
  const [showFullContent, setShowFullContent] = useState(isNew || isEditing);

  // When isNew changes, update editing state
  useEffect(() => {
    if (isNew) {
      setIsEditing(true);
      setIsOpen(true);
      setShowFullContent(true);
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
      setShowFullContent(false);
    } else {
      // Open the collapsible when editing
      setIsOpen(true);
      setIsEditing(true);
      setShowFullContent(true);
    }
  };

  const handleCancel = () => {
    setTempName(member.name);
    setTempWeeklyCapacity(member.weeklyCapacity.toString());
    setIsEditing(false);
    setShowFullContent(false);
  };

  const handleEditClick = () => {
    setIsOpen(true);
    setIsEditing(true);
    setShowFullContent(true);
  };

  const handleDelete = () => {
    onRemove(member.id);
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

  return {
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
  };
}
