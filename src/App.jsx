import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"));
      setTodos(todos);
    }
  }, []);

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = (e) => {
    setshowFinished(!showFinished);
  };

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
    saveToLS();
  };

  const handleEdit = (e, id) => {
    let t = todos.filter((i) => i.id === id);
    setTodo(t[0].todo);
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS();
  };

  const handleDelete = (e, id) => {
    let newTodos = todos.filter((item) => {
      return item.id !== id;
    });
    setTodos(newTodos);
    saveToLS();
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex((item) => {
      return item.id === id;
    });
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-xl">
          iTask - Manage your daily tasks at one place
        </h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h1 className="text-lg font-bold">Add a Todo</h1>
          <input
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={todo}
            type="text"
            className="w-full rounded-lg px-5 py-1"
          />
          <button
            onClick={handleAdd}
            disabled={todo.length <= 3}
            className="bg-violet-800 disabled:bg-violet-900 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md"
          >
            Save
          </button>
        </div>
        <input
          className="my-4"
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
          name=""
          id=""
        />{" "}
        <label className="mx-2" htmlFor="show">
          Show Finished
        </label>
        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-1"></div>
        <h2 className="text-lg font-bold">Your Todos</h2>
        <div className="todos">
          {todos.length == 0 && <div className="m-5">No Todos to display</div>}
          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div key={item.id} className="todo flex my-3 justify-between">
                  <div className="flex gap-5 items-center">
                    <input
                      onChange={handleCheckbox}
                      type="checkbox"
                      checked={item.isCompleted}
                      name={item.id}
                      id=""
                    />
                    <div className={item.isCompleted ? "line-through" : ""}>
                      {item.todo}
                    </div>
                  </div>
                  <div className="buttons flex h-full">
                    <button
                      onClick={(e) => {
                        handleEdit(e, item.id);
                      }}
                      className={
                        item.isCompleted
                          ? "hidden"
                          : "bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                      }
                    >
                      <CiEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        handleDelete(e, item.id);
                      }}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
