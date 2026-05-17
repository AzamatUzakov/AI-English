import type { Task } from '../../model/types';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>Status: {task.completed ? 'Done' : 'Pending'}</p>
    </div>
  );
};
