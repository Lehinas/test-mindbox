import {beforeEach, describe, expect, it, vi} from "vitest"
import todoReducer, {addTodo, clearCompleted, setFilter, toggleTodo} from "../store/todoSlice"

describe("Todo Reducer", () => {
	let initialState: any

	beforeEach(() => {
		// Мокаем localStorage
		const localStorageMock = {
			getItem: vi.fn().mockReturnValue(null),
			setItem: vi.fn(),
			clear: vi.fn(),
		}

		Object.defineProperty(window, "localStorage", {
			value: localStorageMock,
			writable: true,
		})

		initialState = {
			todos: [],
			filter: "all",
		}
	})

	it("должен добавлять новую задачу", () => {
		const newState = todoReducer(initialState, addTodo("Новая задача"))

		expect(newState.todos.length).toBe(1)
		expect(newState.todos[0].text).toBe("Новая задача")
		expect(newState.todos[0].completed).toBe(false)
	})

	it("должен переключать состояние задачи", () => {
		let state = todoReducer(initialState, addTodo("Задача 1"))
		const todoId = state.todos[0].id

		state = todoReducer(state, toggleTodo(todoId))
		expect(state.todos[0].completed).toBe(true)

		state = todoReducer(state, toggleTodo(todoId))
		expect(state.todos[0].completed).toBe(false)
	})

	it("должен очищать выполненные задачи", () => {
		let state = todoReducer(initialState, addTodo("Задача 1"))
		state = todoReducer(state, addTodo("Задача 2"))

		const todoId = state.todos[0].id
		state = todoReducer(state, toggleTodo(todoId))

		state = todoReducer(state, clearCompleted())
		expect(state.todos.length).toBe(1)
		expect(state.todos[0].text).toBe("Задача 2")
	})

	it("должен изменять фильтр", () => {
		let state = todoReducer(initialState, setFilter("active"))
		expect(state.filter).toBe("active")

		state = todoReducer(state, setFilter("completed"))
		expect(state.filter).toBe("completed")

		state = todoReducer(state, setFilter("all"))
		expect(state.filter).toBe("all")
	})
})