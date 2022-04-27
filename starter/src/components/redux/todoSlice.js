//incharege updating and controlling the todo state
//for api call create a thunk that comes from react toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//the thunk function gets called by an component
export const getTodosAsync = createAsyncThunk(
  "todos/getTodosAsync",
  async () => {
    //api call
    const response = await fetch('http://localhost:8000/todos');
    if (response.ok) {
      const todos = await response.json(); //array of todos that converts to json
      return { todos }; //once a function that will turn back to action that will be part of the payload
    }
  }
);

//creates a bunch of actions
export const addTodoAsync = createAsyncThunk(
  "todos/addTodoAsync",
  async (payload) => {
    const response = await fetch('http://localhost:8000/todos', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: payload.title }),
    });

    if (response.ok) {
      const todo = await response.json();
      return { todo };
    }
  }
);

export const toggleCompleteAsync = createAsyncThunk(
  "todos/completeTodoAsync",
  async (payload) => {
    const response = await fetch(`http://localhost:8000/todos/${payload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: payload.completed }),
    });
    if (response.ok) {
      const todo = await response.json();
      return { id: todo.id, completed: todo.completed };
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: [],

  reducers: {
    //updates the current state to the new state
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        title: action.payload.title,
        completed: true,
      };
      //state as params that will add new todo to the arrays
      state.push(newTodo);
    },

    toggleComplete: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
    deleteTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload.id);
    },
  },
  extraReducers: {
    //thunk will dispatech a fullfilled action that will be handled by the reducer function
    [getTodosAsync.pending]: (state, action) => {
      console.log("fetching data ....");
    },
    [getTodosAsync.fulfilled]: (state, action) => {
      console.log("fetched data successfully!");
      return action.payload.todos; //state gets updated due to the payload update
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      state.push(action.payload.todo);
    },
    [toggleCompleteAsync.fulfilled]: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
  },
});

//returns bunch of action right off the actions objects
export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions;

//to add it to the store
export default todoSlice.reducer;
