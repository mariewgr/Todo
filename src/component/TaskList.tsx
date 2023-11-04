// import { useMemo, useState } from "react";
import Task from "./Task";
import TaskInput from "./TaskInput";
import { useLocalStore, StoreConfig } from "state-decorator";

export type Actions = {
  createTask: (text: string) => void;
  onTextChange: (text: string) => void;
  completeTask: (task: TaskModel, checked: boolean) => void;
  changeFilter: (filter: Filter) => void;
};
export type TaskModel = { text: string; completed: boolean };
export type Filter = "All" | "Completed" | "Uncompleted";
export type State = { tasks: TaskModel[]; text: string; filter: Filter };
export type DerivedState = { filteredTasks: TaskModel[] };

export function createTask(text: string, tasks: TaskModel[]) {
  //create not completed task
  const newTask: TaskModel = {
    text,
    completed: false,
  };
  const newList = [...tasks, newTask];
  return newList;
}

export function completeTask(
  task: TaskModel,
  checked: boolean,
  tasks: TaskModel[]
) {
  //change state of a task
  const newTask = { ...task, completed: checked };
  const newTasks = [...tasks];
  const index = newTasks.findIndex((t) => t === task);
  newTasks[index] = newTask;
  return newTasks;
}

export function getFilterTasks(tasks: TaskModel[], filter: Filter) {
  const newTasks = [...tasks];
  switch (filter) {
    case "Completed":
      return newTasks.filter((t) => t.completed);
    case "Uncompleted":
      return newTasks.filter((t) => !t.completed);
    case "All":
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // const _v:never = filter;
      return newTasks;
  }
}

// Initial state & actions
export const config: StoreConfig<State, Actions, any, DerivedState> = {
  getInitialState: () => ({
    tasks: [],
    text: "",
    filter: "All",
  }),

  actions: {
    // synchronous action (simple form)
    createTask: ({ s, args: [text] }) => ({
      tasks: createTask(text, s.tasks),
      text: "",
    }),

    onTextChange: ({ args: [text] }) => ({ text }),

    completeTask: ({ s, args: [task, checked] }) => ({
      tasks: completeTask(task, checked, s.tasks),
    }),

    changeFilter: ({ args: [filter] }) => ({ filter }),
  },
  derivedState: {
    filteredTasks: {
      getDeps: ({ s }) => [s.tasks, s.filter],

      get: ({ s }) => getFilterTasks(s.tasks, s.filter),
    },
  },
  logEnabled: true,
};

function TaskList() {
  const { state: s, actions } = useLocalStore(config);
  // const handleCreateTask = (text: string) => {
  //   setTasks(createTask(text, tasks));
  //   setText('')
  // };

  // const handleCompleteTask = (task: TaskModel, checked: boolean) => {
  //   setTasks(completeTask(task, checked, tasks))
  // };

  // const onTextChange = (text: string) => {
  //   setText(text);
  // };

  // const handleShownTasks = (tasksList: TaskModel[], newFilter: Filter) => {
  //   setFilter(newFilter);
  //   setTasks(tasksList);
  // }

  // const filteredTasks = useMemo(() => {
  //   return getFilterTasks(s.tasks, s.filter);
  // }, [s.tasks, s.filter]);

  return (
    <div>
      <TaskInput
        onTextChange={actions.onTextChange}
        createTask={actions.createTask}
        text={s.text}
      />
      <button onClick={() => actions.changeFilter("Completed")}>
        Completed Tasks
      </button>
      <button onClick={() => actions.changeFilter("Uncompleted")}>
        Uncompleted Tasks
      </button>
      <button onClick={() => actions.changeFilter("All")}> All Tasks</button>
      {s.filteredTasks.map((t, i) => (
        <Task key={i} task={t} completeTask={actions.completeTask} />
      ))}
    </div>
  );
}

export default TaskList;
