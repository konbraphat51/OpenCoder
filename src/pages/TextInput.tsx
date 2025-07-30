import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import type { TargetData } from "../types"

interface TextInputProps {
	onTargetDataCreate: (data: TargetData) => void
}

export const TextInput = ({ onTargetDataCreate }: TextInputProps) => {
	const [inputText, setInputText] = useState<string>("")
	const [delimiter, setDelimiter] = useState<string>("\n")
	const navigate = useNavigate()

	const handleDelimiterChange = (value: string) => {
		// Handle newline input
		const processedValue = value.replace(/\\n/g, "\n").replace(/\\t/g, "\t")
		setDelimiter(processedValue)
	}

	const handleRun = () => {
		if (!inputText.trim()) {
			alert("Please enter some text content")
			return
		}

		if (!delimiter) {
			alert("Please enter a delimiter")
			return
		}

		// Split the text by delimiter and filter out empty strings
		const textParts = inputText
			.split(delimiter)
			.filter((part) => part.trim() !== "")

		if (textParts.length === 0) {
			alert("No valid content found after splitting by delimiter")
			return
		}

		// Create target data structure
		const targetData: TargetData = {
			data: textParts.map((content, index) => ({
				index: index + 1,
				content: content.trim(),
			})),
		}

		// Generate filename with unix timestamp
		const unixTime = Math.floor(Date.now() / 1000)
		const filename = `OpenCoder_${unixTime}.json`

		// Create and download the file
		const blob = new Blob([JSON.stringify(targetData, null, 2)], {
			type: "application/json",
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = filename
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)

		// Also load the data into the app state
		onTargetDataCreate(targetData)

		// Show success message
		alert(`Target data created successfully! Downloaded as ${filename}`)
	}

	const handleBackToUpload = () => {
		navigate("/")
	}

	return (
		<>
			<Header />
			<div className="text-input-container">
				<div className="text-input-header">
					<button onClick={handleBackToUpload} className="back-button">
						← Back to Data Upload
					</button>
					<h1>Create Target Data</h1>
				</div>

			<div className="text-input-content">
				<div className="input-section">
					<h2>Input Text</h2>
					<p>
						Enter your text content that will be split into annotation targets:
					</p>
					<textarea
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="Enter your text content here..."
						className="large-text-input"
						rows={15}
					/>
				</div>

				<div className="delimiter-section">
					<h3>Delimiter</h3>
					<p>
						Enter the delimiter to split the text (use \n for newline, \t for
						tab):
					</p>
					<input
						type="text"
						value={delimiter}
						onChange={(e) => handleDelimiterChange(e.target.value)}
						placeholder="Enter delimiter (e.g., \n for newline)"
						className="delimiter-input"
					/>
					<div className="delimiter-preview">
						Current delimiter: "
						{delimiter.replace(/\n/g, "\\n").replace(/\t/g, "\\t")}"
					</div>
				</div>

				<div className="preview-section">
					<h3>Preview</h3>
					<p>
						Number of parts after splitting:{" "}
						{inputText && delimiter
							? inputText.split(delimiter).filter((part) => part.trim() !== "")
									.length
							: 0}
					</p>
				</div>

				<button onClick={handleRun} className="run-button">
					Run - Create Target Data
				</button>
			</div>
		</div>
		</>
	)
}
