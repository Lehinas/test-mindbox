import React, {useState} from "react"
import {useDispatch} from "react-redux"
import {removeTodo, Todo, toggleTodo} from "../../store/todoSlice"
import styles from "./TodoItem.module.css"
import checkIcon from "../../assets/icons/check.svg"

interface TodoItemProps {
	todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({todo}) => {
	const dispatch = useDispatch()
	const [isHovered, setIsHovered] = useState(false)

	const handleToggle = () => {
		dispatch(toggleTodo(todo.id))
	}

	const handleRemove = () => {
		dispatch(removeTodo(todo.id))
	}

	return (
		<div
			className={styles.todoItem}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<label className={styles.checkboxContainer}>
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={handleToggle}
					className={styles.checkbox}
				/>
				<span className={styles.checkmark}>
          {todo.completed && (
	          <img src={checkIcon} alt="Completed" className={styles.checkIcon}/>
          )}
        </span>
			</label>
			<span className={`${styles.todoText} ${todo.completed ? styles.completed : ""}`}>
        {todo.text}
      </span>
			{isHovered && (
				<button
					className={styles.removeBtn}
					onClick={handleRemove}
					aria-label="Удалить задачу"
				>
					×
				</button>
			)}
		</div>
	)
}

export default TodoItem