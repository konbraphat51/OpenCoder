import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import type { TargetData, AnnotationData } from "../types"

interface DataInputProps {
	onTargetDataLoad: (data: TargetData) => void
	onAnnotationDataLoad: (data: AnnotationData) => void
}

export const DataInput = ({
	onTargetDataLoad,
	onAnnotationDataLoad,
}: DataInputProps) => {
	const [targetFile, setTargetFile] = useState<File | null>(null)
	const [annotationFile, setAnnotationFile] = useState<File | null>(null)
	const [error, setError] = useState<string>("")
	const navigate = useNavigate()

	const handleFileRead = (file: File, callback: (data: any) => void) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target?.result as string)
				callback(data)
				setError("")
			} catch (err) {
				setError(`Invalid JSON in ${file.name}: ${err}`)
			}
		}
		reader.readAsText(file)
	}

	const handleSubmit = () => {
		if (!targetFile) {
			setError("Please select a target data file")
			return
		}

		handleFileRead(targetFile, (data) => {
			// Validate target data structure
			if (!data.data || !Array.isArray(data.data)) {
				setError("Invalid target data structure. Expected {data: [...]}")
				return
			}

			for (const item of data.data) {
				if (
					typeof item.index !== "number" ||
					typeof item.content !== "string"
				) {
					setError(
						"Invalid target data item. Expected {index: number, content: string}"
					)
					return
				}
			}

			onTargetDataLoad(data)

			// Handle annotation file if provided
			if (annotationFile) {
				handleFileRead(annotationFile, (annotationData) => {
					// Validate annotation data structure
					if (!annotationData.data || !Array.isArray(annotationData.data)) {
						setError(
							"Invalid annotation data structure. Expected {data: [...]}"
						)
						return
					}

					onAnnotationDataLoad(annotationData)
					navigate("/annotation")
				})
			} else {
				// Create empty annotation data
				const emptyAnnotationData: AnnotationData = {
					data: data.data.map((item: any) => ({
						index: item.index,
						annotations: [],
					})),
				}
				onAnnotationDataLoad(emptyAnnotationData)
				navigate("/annotation")
			}
		})
	}

	const handleCreateTargetData = () => {
		navigate("/text-input")
	}

	return (
		<>
			<Header />
			<div className="data-input-container">
				<h1>Data Input</h1>

				<div className="upload-section">
					<div className="section-header-with-button">
						<div className="section-header">
							<h2>Target Data JSON *</h2>
							<p>
								Expected structure:{" "}
								{`{data: [{index: number, content: string}, ...]}`}
							</p>
						</div>
						<button
							onClick={handleCreateTargetData}
							className="create-target-inline-button"
						>
							Create from Text
						</button>
					</div>
					<input
						type="file"
						accept=".json"
						onChange={(e) => setTargetFile(e.target.files?.[0] || null)}
						className="file-input"
					/>
					{targetFile && (
						<p className="file-selected">Selected: {targetFile.name}</p>
					)}
				</div>

				<div className="upload-section">
					<h2>Annotation JSON (Optional)</h2>
					<p>
						Expected structure:{" "}
						{`{data: [{index: number, annotations: [{property: [string], dimension: [string]}]}, ...]}`}
					</p>
					<input
						type="file"
						accept=".json"
						onChange={(e) => setAnnotationFile(e.target.files?.[0] || null)}
						className="file-input"
					/>
					{annotationFile && (
						<p className="file-selected">Selected: {annotationFile.name}</p>
					)}
				</div>

				{error && <div className="error-message">{error}</div>}

				<button onClick={handleSubmit} className="submit-button">
					Load Data & Continue to Annotation
				</button>
			</div>
		</>
	)
}
