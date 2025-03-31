import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export interface Todo {
	id: string;
	text: string;
	completed: boolean;
}

export type FilterType = "all" | "active" | "completed";

interface TodoState {
	todos: Todo[];
	filter: FilterType;
}

// load iz localStorage
const loadTodosFromStorage = (): Todo[] => {
	const storedTodos = localStorage.getItem("todos")
	return storedTodos ? JSON.parse(storedTodos) : []
}

// save v localStorage
const saveTodosToStorage = (todos: Todo[]): void => {
	localStorage.setItem("todos", JSON.stringify(todos))
}

const initialState: TodoState = {
	todos: loadTodosFromStorage(),
	filter: "all",
}

const todoSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {
		addTodo: (state, action: PayloadAction<string>) => {
			const newTodo: Todo = {
				id: Date.now().toString(),
				text: action.payload,
				completed: false,
			}
			state.todos.push(newTodo)
			saveTodosToStorage(state.todos)
		},
		toggleTodo: (state, action: PayloadAction<string>) => {
			const todo = state.todos.find(todo => todo.id === action.payload)
			if (todo) {
				todo.completed = !todo.completed
				saveTodosToStorage(state.todos)
			}
		},
		removeTodo: (state, action: PayloadAction<string>) => {
			state.todos = state.todos.filter(todo => todo.id !== action.payload)
			saveTodosToStorage(state.todos)
		},
		clearCompleted: (state) => {
			state.todos = state.todos.filter(todo => !todo.completed)
			saveTodosToStorage(state.todos)
		},
		setFilter: (state, action: PayloadAction<FilterType>) => {
			state.filter = action.payload
		},
	},
})

export const {addTodo, toggleTodo, removeTodo, clearCompleted, setFilter} = todoSlice.actions
export default todoSlice.reducer