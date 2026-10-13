import React from 'react';
import { AssignmentCard, AssignmentCardProps } from './AssignmentCard';
import { useAppDispatch } from '../../app/hooks';
import { toggleTaskCompletion, deleteTask } from './deadlinesSlice';
import { usePinStore } from '../../stores/usePinStore';

export interface DeadlineItemProps extends Partial<AssignmentCardProps> {
  task: AssignmentCardProps['task'];
}

export const DeadlineItem: React.FC<DeadlineItemProps> = ({ task, ...props }) => {
  const dispatch = useAppDispatch();
  const storePinned = usePinStore((state) => state.pinnedIds.includes(task.id));
  const togglePin = usePinStore((state) => state.togglePin);

  const isPinned = props.isPinned !== undefined ? props.isPinned : storePinned;
  const onToggle = props.onToggle || ((id: string) => dispatch(toggleTaskCompletion(id)));
  const onDelete = props.onDelete || ((id: string) => dispatch(deleteTask(id)));
  const onTogglePin = props.onTogglePin || ((id: string) => togglePin(id));

  return (
    <AssignmentCard
      task={task}
      isPinned={isPinned}
      onToggle={onToggle}
      onDelete={onDelete}
      onTogglePin={onTogglePin}
    />
  );
};

export default DeadlineItem;
