import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom"
import { useAppData } from "./hooks/useAppData"
import { DataInput } from "./pages/DataInput"
import { AnnotationPage } from "./pages/AnnotationPage"
import "./App.css"

function App() {
	const {
		targetData,
		annotationData,
		loadTargetData,
		loadAnnotationData,
		saveAnnotationData,
	} = useAppData()

	return (
		<Router>
			<div className="app">
				<Routes>
					<Route
						path="/"
						element={
							<DataInput
								onTargetDataLoad={loadTargetData}
								onAnnotationDataLoad={loadAnnotationData}
							/>
						}
					/>
					<Route
						path="/annotation"
						element={
							<AnnotationPage
								targetData={targetData}
								annotationData={annotationData}
								onSave={saveAnnotationData}
							/>
						}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App
