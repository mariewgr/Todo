import { createMockStore } from "state-decorator/test";
import { TaskModel, config } from "./TaskList";

describe("TaskList", () => {
  const store = createMockStore(config);
  it("createTask", async () => {
    const task: TaskModel = { text: "toto", completed: true };
    const { state, prevState } = await store
      .setPartialState({ tasks: [task] })
      .getAction("createTask")
      .call("toto2");

    expect(state.tasks).not.toBe(prevState.tasks);
    expect(state.tasks.length).toBe(2);
    expect(state.tasks[1].completed).toBeFalsy();
  });
  it("completeTask", async () => {
    const task: TaskModel = { text: "toto", completed: true };

    const { state, prevState } = await store
      .setPartialState({ tasks: [task], filter: "Completed" })
      .getAction("completeTask")
      .call(task, false);

    expect(state.tasks).not.toBe(prevState.tasks);
    expect(state.tasks[0].completed).toBeFalsy();
    expect(state.filteredTasks).toHaveLength(0);
  });
  it("changeFilter", async () => {
    const { state } = await store
      .setPartialState({ filter: "Completed" })
      .getAction("changeFilter")
      .call("All");

    expect(state.filter).toBe("All");
  });
  it("filteredTasks Uncompleted", async () => {
    const task: TaskModel = { text: "toto", completed: true };
    const { state } = await store
      .setPartialState({ tasks: [task] })
      .getAction("changeFilter")
      .call("Uncompleted");

    expect(state.filteredTasks.length).toBe(0);
  });
  it("filteredTasks Completed", async () => {
    const { state } = await store
      .setPartialState({
        tasks: [
          { text: "toto", completed: true },
          { text: "toto2", completed: false },
        ],
      })
      .getAction("changeFilter")
      .call("Completed");

    expect(state.filteredTasks.length).toBe(1);
    expect(state.filteredTasks[0].completed).toBeTruthy();
  });
  it("filteredTasks All", async () => {
    const tasks = [
      { text: "toto", completed: true },
      { text: "toto2", completed: false },
    ];
    const { state, prevState } = await store
      .setPartialState({
        tasks,
      })
      .getAction("changeFilter")
      .call("All");

    expect(state.filteredTasks).not.toBe(prevState.filteredTasks);
    expect(state.filteredTasks.length).toBe(tasks.length);
    expect(state.filteredTasks[0]).toBe(tasks[0]);
    expect(state.filteredTasks[1]).toBe(tasks[1]);
  });
});
