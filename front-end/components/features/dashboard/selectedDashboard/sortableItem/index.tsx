import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [dragEnabled, setDragEnabled] = useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: dragEnabled ? 'grab' : 'default',
  };
  const handleDoubleClick = () => setDragEnabled(true);
  const handleMouseLeave = () => setDragEnabled(false);
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(dragEnabled ? listeners : {})}
      onDoubleClick={handleDoubleClick}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
