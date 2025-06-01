import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [error, setError] = useState(""); // helper text when length ≤ 3
  const [selectedEstimate, setSelectedEstimate] = useState(2); // time estimate in minutes

  // Load from localStorage on mount
  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      setTodos(JSON.parse(todoString));
    }
  }, []);

  // Always save the latest todos array
  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleAdd = () => {
    // Guard: must be at least 4 chars
    if (todo.trim().length < 4) {
      setError("Task must be at least 4 characters.");
      return;
    }

    const newTodoObj = {
      id: uuidv4(),
      todo: todo.trim(),
      isCompleted: false,
      timeEstimate: selectedEstimate, // store the minutes
    };

    const updated = [...todos, newTodoObj];
    setTodos(updated);
    setTodo("");
    setError("");
    setSelectedEstimate(2); // reset dropdown back to Short
    saveToLS();
  };

  // When you double-click a todo text, warn if input already has unsaved text
  const handleEdit = (e, id) => {
    if (todo.trim() !== "") {
      const proceed = window.confirm(
        "You have unsaved changes in the input box.\n\n" +
          "If you continue, the existing input will be discarded. Proceed?"
      );
      if (!proceed) {
        return;
      }
    }

    if (e && e.stopPropagation) e.stopPropagation();

    const found = todos.find((i) => i.id === id);
    if (!found) return;

    setTodo(found.todo);
    setSelectedEstimate(found.timeEstimate || 2);

    const filtered = todos.filter((item) => item.id !== id);
    setTodos(filtered);
    setError("");
    saveToLS();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const filtered = todos.filter((item) => item.id !== id);
    setTodos(filtered);
    saveToLS();
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
    if (e.target.value.trim().length >= 4) {
      setError("");
    }
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    if (index === -1) return;

    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
    saveToLS();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (todo.trim().length < 4) {
        setError("Task must be at least 4 characters.");
        return;
      }
      handleAdd();
    }
  };

  return (
    <>
      <Navbar />

      {/* ==== NOTEPAD CONTAINER ==== */}
      <div className="md:container mx-auto my-5 max-w-md rounded-xl shadow-xl overflow-hidden bg-[#faf5ee]">
        <div className="h-4 w-full bg-gray-500"></div>

        <div className="p-6">
          {/* === HEADER === */}
          <h1 className="heading font-semibold text-center text-2xl md:text-3xl text-gray-800 pb-2">
            Manage your daily tasks at one place
          </h1>
          <div className="border-t border-gray-200 mb-4"></div>

          {/* === ADD TODO FORM (with time estimate select) === */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <h2 className="heading text-lg md:text-xl font-medium text-gray-700 mb-2">
              Add a Todo
            </h2>

            <input
              type="text"
              value={todo}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type at least 4 characters..."
              className="
                w-full bg-white border border-gray-300 rounded-lg
                px-4 py-2 text-gray-800
                focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200
                transition
              "
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

            {/* ←–– Time Estimate Dropdown ––→ */}
            <div className="flex items-center gap-2 mt-4">
              <label htmlFor="timeEstimate" className="text-sm text-gray-700">
                Estimate:
              </label>
              <select
                id="timeEstimate"
                value={selectedEstimate}
                onChange={(e) => setSelectedEstimate(Number(e.target.value))}
                className="
                  text-sm border border-gray-300 rounded-md
                  px-2 py-1
                  focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200
                  transition
                "
              >
                <option value={2}>Short (≤ 2 min)</option>
                <option value={15}>Medium (≤ 15 min)</option>
                <option value={30}>Long ({">"} 15 min)</option>
              </select>
            </div>

            <button
              onClick={handleAdd}
              disabled={todo.trim().length < 4}
              className={`
                mt-4 w-full text-white text-sm font-semibold py-2 rounded-lg transition
                ${
                  todo.trim().length >= 4
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              Add
            </button>
          </div>

          {/* === SHOW FINISHED TOGGLE === */}
          <div className="flex items-center mb-2">
            <input
              id="showFinished"
              type="checkbox"
              checked={showFinished}
              onChange={toggleFinished}
              className="
                h-5 w-5
                text-purple-600
                border-gray-300 rounded
                focus:ring-purple-500
                transition
              "
            />
            <label
              htmlFor="showFinished"
              className="ml-2 text-gray-800 text-sm font-medium"
            >
              Show Finished
            </label>
          </div>
          <div className="border-t border-gray-200 mb-4"></div>

          {/* === YOUR TODOS LIST (render dots per timeEstimate) === */}
          <h2 className="heading text-lg md:text-xl font-medium text-gray-700 mb-2">
            Your Todos
          </h2>
          <div className="bg-[#f8f5f2] border border-gray-200 rounded-lg p-4">
            {todos.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No Todos to display
              </div>
            )}

            {todos.map((item) => {
              if (!showFinished && item.isCompleted) return null;

              // Determine how many “dots” to show:
              let dotCount = 1;
              if (item.timeEstimate > 15) {
                dotCount = 3;
              } else if (item.timeEstimate > 2) {
                dotCount = 2;
              }

              return (
                <div
                  key={item.id}
                  className="
                    flex items-center justify-between
                    py-3 px-4
                    hover:bg-gray-100
                    rounded-md
                    transition
                  "
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={item.id}
                      checked={item.isCompleted}
                      onChange={handleCheckbox}
                      className="
                        h-5 w-5
                        text-purple-600
                        border-gray-300 rounded
                        focus:ring-purple-500
                        transition
                      "
                    />
                    <span
                      onDoubleClick={(e) => handleEdit(e, item.id)}
                      className={`
                        ml-3
                        todo-text text-base md:text-lg
                        ${
                          item.isCompleted
                            ? "text-gray-400 line-through cursor-default"
                            : "text-gray-800 cursor-pointer"
                        }
                      `}
                      title="Double-click to edit"
                    >
                      {item.todo}
                    </span>
                    {/* Render N black dots to indicate time */}
                    <span className="ml-2 flex space-x-1">
                      {Array.from({ length: dotCount }).map((_, i) => (
                        <span
                          key={i}
                          className="block w-2 h-2 bg-gray-700 rounded-full"
                          title={
                            dotCount === 1
                              ? "Short (≤ 2 min)"
                              : dotCount === 2
                              ? "Medium (≤ 15 min)"
                              : "Long (> 15 min)"
                          }
                        />
                      ))}
                    </span>
                  </div>

                  {/* DELETE BUTTON (gray by default, red on hover/active) */}
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="
                      p-1
                      text-gray-600
                      hover:text-red-600
                      active:text-red-800
                      focus:outline-none focus:text-red-600
                      transition
                    "
                    title="Delete todo"
                  >
                    <MdDelete size={22} />
                  </button>
                </div>
              );
            })}

            {/* Aggregate Total Time at bottom of list */}
            {todos.length > 0 && (
              <div className="mt-4 border-t border-gray-300 pt-3 text-sm text-gray-700">
                {(() => {
                  const totalMinutes = todos.reduce(
                    (sum, t) => sum + (t.timeEstimate || 0),
                    0
                  );
                  const hours = Math.floor(totalMinutes / 60);
                  const mins = totalMinutes % 60;
                  return hours > 0
                    ? `Total time ≈ ${hours} hr ${mins} min`
                    : `Total time ≈ ${mins} min`;
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
