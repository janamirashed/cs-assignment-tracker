export interface Assignment {
  id: number;
  courseName: string;
  courseColor: 'blue' | 'purple' | 'green' | 'amber' | 'rose' | 'teal';
  title: string;
  dueDate: string;
  completed: boolean;
  comment?: string;
  requirementUrl?: string;
  submissionType: 'form' | 'teams' | 'both';
  submissionUrl?: string;
}
