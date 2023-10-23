import { v4 as uuid } from "uuid";
import "./App.css";
import { useState } from "react";

function App() {
  // state 새로운 값으로 대체한다
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const [sort, setSort] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [updateValue, setUpdateValue] = useState("");
  const [updateTargetIndex, setUpdateTargetIndex] = useState(-1);
  /** computedValue */
  const isUpdateMode = updateTargetIndex >= 0;

  const computedTodos = todos
    .filter((todo) => {
      if (filter === "ALL") return true;
      if (filter === "DONE") return todo.isDone === true;
      if (filter === "NOT_DONE") return todo.isDone === false;
    })
    .sort((a, b) => {
      if (sort === "none") return 0;
      if (sort === "createdAt") return b.createdAt - a.createdAt;
      if (sort === "content") return a.content.localeCompare(b.content);
    });

  return (
    <div className="App">
      <h1>TODO LIST</h1>
      <div>
        <label>필터 : </label>
        <input
          type="radio"
          value="ALL"
          checked={filter === "ALL"}
          onChange={(e) => setFilter(e.target.value)}
        />
        <label>전체</label>
        <input
          type="radio"
          value="DONE"
          checked={filter === "DONE"}
          onChange={(e) => setFilter(e.target.value)}
        />
        <label>완료</label>
        <input
          type="radio"
          value="NOT_DONE"
          checked={filter === "NOT_DONE"}
          onChange={(e) => setFilter(e.target.value)}
        />
        <label>미완료</label>
      </div>
      <div>
        <label htmlFor="sort">정렬 : </label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="none">생성순</option>
          <option value="createdAt">최신순</option>
          <option value="content">가나다순</option>
        </select>
      </div>
      {/*
      SPA(Single Page Application), CSR(client Side Rendering  <-> SSR, Server side rendering)
      client가 dom그리기를 제어한다.
      */}
      <form
        onSubmit={(e) => {
          // form은 기본적으로 새로고침을 trigger, why? 새로운 html파일을 내려받아야하니까
          e.preventDefault();
          if (!inputValue) return;
          const newTodo = {
            id: uuid(),
            content: inputValue,
            isDone: false,
            createdAt: Date.now(),
          };
          setTodos([...todos, newTodo]);
          setInputValue("");
        }}
      >
        <input
          // Input의 제어권을 React(JS)가 가지고 있을 수 있게, state값을 주입했다.
          value={inputValue}
          // Input의 값이 변하는 이벤트가 발생했을 때, 제어권을 가진 React(JS)의 state값을 변경한다.
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          disabled={isUpdateMode}
        />
        <button disabled={!inputValue || isUpdateMode}>{"ADD"}</button>
      </form>
      <div>
        {computedTodos.map((todo, index) => (
          <div key={todo.id}>
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={(e) => {
                const nextTodos = todos.map((todo, idx) =>
                  idx === index ? { ...todo, isDone: e.target.checked } : todo
                );
                setTodos(nextTodos);
              }}
            />
            {updateTargetIndex === index ? (
              <input
                value={updateValue}
                onChange={(e) => setUpdateValue(e.target.value)}
              />
            ) : (
              <span
                style={{ textDecoration: todo.isDone ? "line-through" : "" }}
              >
                {todo.content}
              </span>
            )}
            <button
              onClick={() => {
                const nextTodos = todos.filter((_, idx) => idx !== index);
                setTodos(nextTodos);
              }}
              disabled={isUpdateMode}
            >
              DEL
            </button>
            <button
              onClick={() => {
                if (isUpdateMode) {
                  const nextTodos = todos.map((todo, index) =>
                    index === updateTargetIndex
                      ? { ...todo, content: updateValue }
                      : todo
                  );
                  setTodos(nextTodos);
                  setUpdateValue("");
                  setUpdateTargetIndex(-1);
                  return;
                }

                setUpdateTargetIndex(index);
                setUpdateValue(todo.content);
              }}
              disabled={isUpdateMode && index !== updateTargetIndex}
            >
              UPDATE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;