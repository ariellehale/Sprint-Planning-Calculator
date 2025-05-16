# Sprint Capacity Calculator by Arielle Hale

A web-based tool designed to help Agile teams efficiently calculate, manage, and visualize sprint capacity and workload distribution.

## Overview

This Sprint Capacity Calculator simplifies sprint planning by automatically calculating team member availability, assigned story points, and capacity utilization, enabling quick and informed project decisions.

## Features

* **Sprint Configuration:**

  * Set sprint length, velocity (average hours per point), start date, and project due date.
  * Automatically calculates the number of sprints.

* **Dynamic Team Management:**

  * Easily add, edit, collapse, or remove team members.
  * Input weekly availability (hours), sprint-specific story points, and task-level assignments.

* **Capacity Calculation:**

  * Calculates total hours and available points per sprint based on predefined velocity.
  * Dynamically adjusts capacity when assigned points exceed available hours, rolling excess to subsequent sprints.

* **Visualization & Indicators:**

  * Capacity summaries clearly displayed with utilization percentages.
  * Status indicators (Good, Warning) based on utilization thresholds:

    * Good: Under 85% utilization
    * Warning: Over 85% utilization

* **Story Points Customization:**

  * Edit story points-to-hours mappings dynamically.

## Getting Started

### Prerequisites

* Node.js & npm
* Git (optional for cloning repository directly)

### Installation

Clone the repository and install dependencies:

```bash
git clone <YOUR_GIT_URL>
cd sprint-capacity-calculator
npm install
```

### Running the Application

```bash
npm run dev
```

Visit the application at:

```
http://localhost:3000
```

## How to Use

### 1. Configure Sprints:

* Enter:

  * Number of sprints.
  * Sprint length (in weeks).
  * Velocity (default: 4 hours per story point).
  * Project dates (Start and Due).

### 2. Manage Team Members:

* Add each team member and their weekly hours availability.
* Assign story points per sprint and task-level points.
* View detailed summaries of weekly, per-sprint, and total capacity.

### 3. Sprint Planning:

* Assign planned story points per sprint.
* The calculator automatically updates remaining points and hours available.

### 4. Monitor Capacity:

* Quickly see each team member’s workload status.
* Adjust assignments dynamically, with instant feedback and recalculations.

## Project Structure

```
src/
├── components/
│   ├── SprintConfiguration.tsx
│   ├── TeamMembers.tsx
│   ├── SprintPlanning.tsx
│   ├── TeamCapacitySummary.tsx
│   ├── StoryPointReference.tsx
├── utils/
│   └── calculations.ts
├── App.tsx
└── main.tsx
```

* `components/`: UI components for different application sections.
* `utils/calculations.ts`: Logic for capacity and point calculations.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature-name`).
3. Commit changes clearly (`git commit -m "Add feature xyz"`).
4. Push branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

## Future Enhancements

* Historical capacity tracking and comparison.
* Integration with external tools (Jira, Airtable, Monday.com).
* Export capacity plans and reports (CSV/PDF).

## Support & Contact

For questions, contributions, or feedback:

* Contact Arielle Hale via GitHub Issues or the repository discussions section.

## License

Distributed under MIT License. See `LICENSE` for more details.

## Credits

* Built using [Lovable](https://lovable.dev).
* UI components powered by Tailwind CSS and shadcn/ui.
* Charting implemented via Recharts.
