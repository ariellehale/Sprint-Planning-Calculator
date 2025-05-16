
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface TeamMemberActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TeamMemberActions({ 
  isEditing, 
  onSave, 
  onCancel,
  onDelete 
}: TeamMemberActionsProps) {
  if (!isEditing) return null;
  
  return (
    <div className="flex justify-end items-center mb-4">
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onCancel}
          className="bg-[#9b87f5] text-white hover:bg-[#8a76e4]"
        >
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
        <Button 
          size="sm" 
          onClick={onSave}
          className="bg-[#4CAF50] hover:bg-[#43A047] text-white"
        >
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
}
