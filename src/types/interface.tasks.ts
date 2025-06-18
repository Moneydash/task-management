export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high',
  order: number;
  dueDate: Date;
  assigned_user: {
    id: number;
    name?: string;
    email?: string;
  }
};