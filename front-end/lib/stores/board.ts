import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { List, Task } from '@/lib/types/board';

interface BoardState {
  // Estado das listas
  lists: List[];
  isLoading: boolean;
  
  // Actions para listas
  setLists: (lists: List[]) => void;
  addList: (list: List) => void;
  removeList: (listId: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Actions para tarefas
  addTask: (listId: string, task: Task) => void;
  removeTask: (taskId: string) => void;
  moveTask: (sourceListIdx: number, taskIdx: number, destListIdx: number, destTaskIdx?: number) => void;
  
  // Utils
  getNextTaskPosition: (listId: string) => number;
  getListIndex: (listId: string) => number;
  getTaskPosition: (taskId: string) => { listIndex: number; taskIndex: number } | null;
}

export const useBoardStore = create<BoardState>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    lists: [],
    isLoading: false,

    // Actions para listas
    setLists: (lists) => set({ lists }),
    
    addList: (list) => set((state) => ({
      lists: [...state.lists, list]
    })),
    
    removeList: (listId) => set((state) => ({
      lists: state.lists.filter(list => list.id !== listId)
    })),
    
    setLoading: (loading) => set({ isLoading: loading }),

    // Actions para tarefas
    addTask: (listId, task) => set((state) => ({
      lists: state.lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: [task, ...list.tasks]
          };
        }
        return list;
      })
    })),
    
    removeTask: (taskId) => set((state) => ({
      lists: state.lists.map(list => ({
        ...list,
        tasks: list.tasks.filter(task => task.id !== taskId)
      }))
    })),
    
    moveTask: (sourceListIdx, taskIdx, destListIdx, destTaskIdx) => set((state) => {
      const newLists = state.lists.map(l => ({ ...l, tasks: [...l.tasks] }));
      const [removedTask] = newLists[sourceListIdx].tasks.splice(taskIdx, 1);

      if (destTaskIdx === undefined || destTaskIdx === -1) {
        newLists[destListIdx].tasks.push(removedTask);
      } else {
        newLists[destListIdx].tasks.splice(destTaskIdx, 0, removedTask);
      }
      
      return { lists: newLists };
    }),

    // Utils
    getNextTaskPosition: (listId) => {
      const list = get().lists.find(l => l.id === listId);
      return list && list.tasks.length > 0
        ? Math.max(...list.tasks.map(t => t.position)) + 1
        : 1;
    },
    
    getListIndex: (listId) => {
      return get().lists.findIndex(l => l.id === listId);
    },
    
    getTaskPosition: (taskId) => {
      const lists = get().lists;
      for (let listIndex = 0; listIndex < lists.length; listIndex++) {
        const taskIndex = lists[listIndex].tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          return { listIndex, taskIndex };
        }
      }
      return null;
    }
  }))
);
