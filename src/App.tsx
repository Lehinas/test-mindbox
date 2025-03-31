import styles from "./App.module.css"
import React from "react"
import TodoList from "./components/TodoList/TodoList.tsx"

const App: React.FC = () => {
	return (
		<div className={styles.app}>
			<h1 className={styles.title}>todos</h1>
			<TodoList/>
		</div>
	)
}

export default App