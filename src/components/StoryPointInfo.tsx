
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

interface StoryPointInfoProps {
  storyPointMappings: Record<number, number>;
  onMappingsChange: (mappings: Record<number, number>) => void;
}

export default function StoryPointInfo({ 
  storyPointMappings, 
  onMappingsChange 
}: StoryPointInfoProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editValues, setEditValues] = useState<Record<number, number>>({...storyPointMappings});

  const handleSave = () => {
    onMappingsChange(editValues);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditValues({...storyPointMappings});
    setEditMode(false);
  };

  const handleChange = (points: number, hours: string) => {
    const hoursValue = parseInt(hours) || 0;
    setEditValues({
      ...editValues,
      [points]: hoursValue
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-capacity-default">
          Story Point Reference
        </CardTitle>
        {editMode ? (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setEditMode(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Story Points</TableHead>
                <TableHead>Estimated Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(editMode ? editValues : storyPointMappings).map(([points, hours]) => (
                <TableRow key={points} className={Number(points) % 2 === 0 ? "bg-muted/30" : ""}>
                  <TableCell>{points}</TableCell>
                  <TableCell>
                    {editMode ? (
                      <Input
                        type="number"
                        min={0}
                        value={hours}
                        onChange={(e) => handleChange(Number(points), e.target.value)}
                        className="h-8 w-20"
                      />
                    ) : (
                      hours
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
