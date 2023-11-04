import { ChangeEvent } from "react";
import { Actions, State } from "./TaskList";


type TaskInputProps = Pick<Actions, "onTextChange" | "createTask"> & Pick<State, "text">;


function TaskInput(p: TaskInputProps) {

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        p.createTask(p.text);
      }
    };

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
      p.onTextChange(event.target.value)
    }

    return (
        <div>
          <input type="text" value={p.text} onChange={handleTextChange} onKeyDown={handleKeyDown}/>
          <button type="submit" onClick={() => {p.createTask(p.text)}}>
            Submit
          </button>
        </div>
      );

};

export default TaskInput;
