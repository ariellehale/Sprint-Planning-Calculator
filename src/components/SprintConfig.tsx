
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SprintConfigProps {
  onConfigChange: (sprints: number, sprintLength: number) => void;
}

export default function SprintConfig({ onConfigChange }: SprintConfigProps) {
  const [sprints, setSprints] = useState<number>(1);
  const [sprintLength, setSprintLength] = useState<number>(2);

  const handleSprintsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setSprints(value);
    onConfigChange(value, sprintLength);
  };

  const handleSprintLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setSprintLength(value);
    onConfigChange(sprints, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-capacity-default">
          Sprint Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sprints">Number of Sprints</Label>
            <Input
              id="sprints"
              type="number"
              min={1}
              value={sprints}
              onChange={handleSprintsChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sprintLength">Sprint Length (weeks)</Label>
            <Input
              id="sprintLength"
              type="number"
              min={1}
              value={sprintLength}
              onChange={handleSprintLengthChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
