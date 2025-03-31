import React from "react"
import {fireEvent, render, screen} from "@testing-library/react"
import {Provider} from "react-redux"
import {configureStore} from "@reduxjs/toolkit"
import todoReducer from "../store/todoSlice"
import TodoList from "../components/TodoList/TodoList"
import {beforeEach, describe, expect, it, vi} from "vitest"

// Создаем тестовый стор
const createTestStore = () => {
	return configureStore({
		reducer: {
			todos: todoReducer,
		},
	})
}

describe("TodoList Component", () => {
	let store: ReturnType<typeof createTestStore>

	beforeEach(() => {
		// Перед каждым тестом создаем новый стор
		store = createTestStore()

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
	})

	it("должен отображать поле ввода", () => {
		render(
			<Provider store={store}>
				<TodoList/>
			</Provider>
		)

		expect(screen.getByPlaceholderText("What needs to be done?")).toBeInTheDocument()
	})

	it("должен добавлять новую задачу при отправке формы", () => {
		render(
			<Provider store={store}>
				<TodoList/>
			</Provider>
		)

		const input = screen.getByTestId("todo-input")
		fireEvent.change(input, {target: {value: "Новая задача"}})
		fireEvent.submit(input)

		expect(screen.getByText("Новая задача")).toBeInTheDocument()
	})

	it("должен отображать количество оставшихся задач", () => {
		render(
			<Provider store={store}>
				<TodoList/>
			</Provider>
		)

		const input = screen.getByTestId("todo-input")
		fireEvent.change(input, {target: {value: "Задача 1"}})
		fireEvent.submit(input)

		fireEvent.change(input, {target: {value: "Задача 2"}})
		fireEvent.submit(input)

		expect(screen.getByText("2 items left")).toBeInTheDocument()
	})

	it("должен фильтровать задачи при нажатии на кнопки фильтров", () => {
		render(
			<Provider store={store}>
				<TodoList/>
			</Provider>
		)

		// Добавляем две задачи
		const input = screen.getByTestId("todo-input")
		fireEvent.change(input, {target: {value: "Задача 1"}})
		fireEvent.submit(input)

		fireEvent.change(input, {target: {value: "Задача 2"}})
		fireEvent.submit(input)

		// Отмечаем первую задачу как выполненную
		const checkboxes = screen.getAllByRole("checkbox")
		fireEvent.click(checkboxes[0])

		// Переключаем на активные задачи
		const activeButton = screen.getByText("Active")
		fireEvent.click(activeButton)

		// Должна отображаться только вторая задача
		expect(screen.queryByText("Задача 1")).not.toBeInTheDocument()
		expect(screen.getByText("Задача 2")).toBeInTheDocument()

		// Переключаем на выполненные задачи
		const completedButton = screen.getByText("Completed")
		fireEvent.click(completedButton)

		// Должна отображаться только первая задача
		expect(screen.getByText("Задача 1")).toBeInTheDocument()
		expect(screen.queryByText("Задача 2")).not.toBeInTheDocument()
	})

	it("должен очищать выполненные задачи", () => {
		render(
			<Provider store={store}>
				<TodoList/>
			</Provider>
		)

		// Добавляем две задачи
		const input = screen.getByTestId("todo-input")
		fireEvent.change(input, {target: {value: "Задача 1"}})
		fireEvent.submit(input)

		fireEvent.change(input, {target: {value: "Задача 2"}})
		fireEvent.submit(input)

		// Отмечаем первую задачу как выполненную
		const checkboxes = screen.getAllByRole("checkbox")
		fireEvent.click(checkboxes[0])

		// Очищаем выполненные задачи
		const clearButton = screen.getByText("Clear completed")
		fireEvent.click(clearButton)

		// Должна остаться только вторая задача
		expect(screen.queryByText("Задача 1")).not.toBeInTheDocument()
		expect(screen.getByText("Задача 2")).toBeInTheDocument()
	})
})