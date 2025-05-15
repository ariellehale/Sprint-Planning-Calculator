
import { Button } from "@/components/ui/button";
import { Save, X, Trash2 } from "lucide-react";

interface TeamMemberActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function TeamMemberActions({ 
  isEditing, 
  onSave, 
  onCancel,
  onDelete 
}: TeamMemberActionsProps) {
  if (!isEditing) return null;
  
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <Button 
          variant="destructive" 
          onClick={onDelete}
          className="bg-[#ea384c] hover:bg-[#d32f2f] text-white"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete Team Member
        </Button>
      </div>
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
