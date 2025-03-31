import {fireEvent, render, screen} from "@testing-library/react"
import {Provider} from "react-redux"
import {configureStore} from "@reduxjs/toolkit"
import todoReducer, {addTodo} from "../store/todoSlice"
import TodoItem from "../components/TodoItem/TodoItem"
import {describe, expect, it} from "vitest"

// Создаем тестовый стор
const createTestStore = () => {
	return configureStore({
		reducer: {
			todos: todoReducer,
		},
	})
}

describe("TodoItem Component", () => {
	it("должен отображать задачу и чекбокс", () => {
		const store = createTestStore()

		render(
			<Provider store={store}>
				<TodoItem todo={{id: "1", text: "Тестовая задача", completed: false}}/>
			</Provider>
		)

		expect(screen.getByText("Тестовая задача")).toBeInTheDocument()
		expect(screen.getByRole("checkbox")).not.toBeChecked()
	})

	it("должен отображать выполненную задачу с отмеченным чекбоксом", () => {
		const store = createTestStore()

		render(
			<Provider store={store}>
				<TodoItem todo={{id: "1", text: "Тестовая задача", completed: true}}/>
			</Provider>
		)

		expect(screen.getByText("Тестовая задача").className).toContain("completed")
		expect(screen.getByRole("checkbox")).toBeChecked()
	})

	it("должен переключать состояние задачи при клике на чекбокс", () => {
		const store = createTestStore()
		store.dispatch(addTodo("Тестовая задача"))

		const todos = store.getState().todos.todos

		render(
			<Provider store={store}>
				<TodoItem todo={todos[0]}/>
			</Provider>
		)

		const checkbox = screen.getByRole("checkbox")
		fireEvent.click(checkbox)

		// Проверяем, что задача отмечена как выполненная в Redux
		const updatedTodos = store.getState().todos.todos
		expect(updatedTodos[0].completed).toBe(true)
	})
})