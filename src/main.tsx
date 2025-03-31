import ReactDOM from "react-dom/client"
import {Provider} from "react-redux"
import {store} from "./store/store"
import "./index.css"
import {StrictMode} from "react"
import App from "./App.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider store={store}>
			<App/>
		</Provider>
	</StrictMode>
)