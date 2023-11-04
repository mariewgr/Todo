import { Actions, TaskModel } from "./TaskList";

type TaskProps = {task: TaskModel} & Pick<Actions, "completeTask">;

export default function Task(p: TaskProps) {

    const handleCompleteTaskChange = () => {
      p.completeTask(p.task, !p.task.completed)
    }

    return (<div>
        <button type="submit" onClick={handleCompleteTaskChange}>{p.task.completed ? "true" : "false"}</button>
        {p.task.text}
        </div>)
}