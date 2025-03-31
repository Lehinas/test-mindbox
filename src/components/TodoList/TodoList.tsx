import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../../store/store"
import {addTodo, clearCompleted, FilterType, setFilter} from "../../store/todoSlice"
import TodoItem from "../TodoItem/TodoItem"
import styles from "./TodoList.module.css"

const TodoList: React.FC = () => {
	const [newTodo, setNewTodo] = useState("")
	const dispatch = useDispatch()
	const todos = useSelector((state: RootState) => state.todos.todos)
	const filter = useSelector((state: RootState) => state.todos.filter)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (newTodo.trim()) {
			dispatch(addTodo(newTodo.trim()))
			setNewTodo("")
		}
	}

	const handleFilterChange = (newFilter: FilterType) => {
		dispatch(setFilter(newFilter))
	}

	const handleClearCompleted = () => {
		dispatch(clearCompleted())
	}

	const filteredTodos = todos.filter(todo => {
		if (filter === "active") return !todo.completed
		if (filter === "completed") return todo.completed
		return true
	})

	const activeTodosCount = todos.filter(todo => !todo.completed).length

	return (
		<div className={styles.todoListContainer}>
			<form onSubmit={handleSubmit} className={styles.inputForm}>
				<input
					type="text"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					placeholder="What needs to be done?"
					className={styles.todoInput}
					data-testid="todo-input"
				/>
			</form>

			<div className={styles.todoItems}>
				{filteredTodos.map(todo => (
					<TodoItem key={todo.id} todo={todo}/>
				))}
			</div>

			{todos.length > 0 && (
				<div className={styles.todoFooter}>
          <span className={styles.todoCount}>
            {activeTodosCount} items left
          </span>

					<div className={styles.filters}>
						<button
							className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
							onClick={() => handleFilterChange("all")}
						>
							All
						</button>
						<button
							className={`${styles.filterBtn} ${filter === "active" ? styles.active : ""}`}
							onClick={() => handleFilterChange("active")}
						>
							Active
						</button>
						<button
							className={`${styles.filterBtn} ${filter === "completed" ? styles.active : ""}`}
							onClick={() => handleFilterChange("completed")}
						>
							Completed
						</button>
					</div>

					<button
						className={styles.clearBtn}
						onClick={handleClearCompleted}
					>
						Clear completed
					</button>
				</div>
			)}
		</div>
	)
}

export default TodoList