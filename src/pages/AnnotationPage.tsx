import { useState, useEffect } from "react"
import type { TargetData, AnnotationData, Annotation } from "../types"

interface AnnotationPageProps {
	targetData: TargetData | null
	annotationData: AnnotationData | null
	onSave: (data: AnnotationData) => void
}

export const AnnotationPage = ({
	targetData,
	annotationData,
	onSave,
}: AnnotationPageProps) => {
	const [selectedIndex, setSelectedIndex] = useState<number>(0)
	const [currentAnnotations, setCurrentAnnotations] =
		useState<AnnotationData | null>(null)

	useEffect(() => {
		if (annotationData) {
			setCurrentAnnotations(JSON.parse(JSON.stringify(annotationData))) // Deep copy
		}
	}, [annotationData])

	if (!targetData || !currentAnnotations) {
		return (
			<div className="error-container">
				<h2>No data loaded</h2>
				<p>Please go back to the data input page and load your files.</p>
			</div>
		)
	}

	const currentTarget = targetData.data.find(
		(item) => item.index === selectedIndex
	)
	const currentAnnotationItem = currentAnnotations.data.find(
		(item) => item.index === selectedIndex
	)

	const addAnnotation = () => {
		if (!currentAnnotationItem) return

		const newAnnotation: Annotation = {
			property: [""],
			dimension: [""],
		}

		currentAnnotationItem.annotations.push(newAnnotation)
		setCurrentAnnotations({ ...currentAnnotations })
	}

	const removeAnnotation = (annotationIndex: number) => {
		if (!currentAnnotationItem) return

		currentAnnotationItem.annotations.splice(annotationIndex, 1)
		setCurrentAnnotations({ ...currentAnnotations })
	}

	const updateAnnotationProperty = (
		annotationIndex: number,
		propertyIndex: number,
		value: string
	) => {
		if (!currentAnnotationItem) return

		currentAnnotationItem.annotations[annotationIndex].property[propertyIndex] =
			value
		setCurrentAnnotations({ ...currentAnnotations })
	}

	const updateAnnotationDimension = (
		annotationIndex: number,
		dimensionIndex: number,
		value: string
	) => {
		if (!currentAnnotationItem) return

		currentAnnotationItem.annotations[annotationIndex].dimension[
			dimensionIndex
		] = value
		setCurrentAnnotations({ ...currentAnnotations })
	}

	const addPropertyField = (annotationIndex: number) => {
		if (!currentAnnotationItem) return

		currentAnnotationItem.annotations[annotationIndex].property.push("")
		setCurrentAnnotations({ ...currentAnnotations })
	}

	const removePropertyField = (
		annotationIndex: number,
		propertyIndex: number
	) => {
		if (!currentAnnotationItem) return

		currentAnnotationItem.annotations[annotationIndex].property.splice(
			propertyIndex,
			1
		)
		setCurrentAnnotations({ ...currentAnnotations })
	}

	const addDimensionField = (annotationIndex: number) => {
		if (!currentAnnotationItem) return

		currentAnnotationItem.annotations[annotationIndex].dimension.push("")
		setCurrentAnnotations({ ...currentAnnotations })
	}

	const removeDimensionField = (
		annotationIndex: number,
		dimensionIndex: number
	) => {
		if (!currentAnnotationItem) return

		currentAnnotationItem.annotations[annotationIndex].dimension.splice(
			dimensionIndex,
			1
		)
		setCurrentAnnotations({ ...currentAnnotations })
	}

	const handleSave = () => {
		if (currentAnnotations) {
			onSave(currentAnnotations)
		}
	}

	return (
		<div className="annotation-page">
			<div className="annotation-left">
				<div className="index-selector">
					<label htmlFor="index-select">Select Index:</label>
					<select
						id="index-select"
						value={selectedIndex}
						onChange={(e) => setSelectedIndex(Number(e.target.value))}
						className="index-dropdown"
					>
						{targetData.data.map((item) => (
							<option key={item.index} value={item.index}>
								Index {item.index}
							</option>
						))}
					</select>
				</div>

				<div className="content-display">
					<h3>Content:</h3>
					<div className="content-text">
						{currentTarget?.content || "No content found for this index"}
					</div>
				</div>
			</div>

			<div className="annotation-right">
				<div className="annotations-list">
					<h3>Annotations for Index {selectedIndex}</h3>

					{currentAnnotationItem?.annotations.map(
						(annotation, annotationIndex) => (
							<div key={annotationIndex} className="annotation-card">
								<div className="annotation-header">
									<h4>Annotation {annotationIndex + 1}</h4>
									<button
										onClick={() => removeAnnotation(annotationIndex)}
										className="delete-annotation-btn"
										title="Delete annotation"
									>
										🗑️
									</button>
								</div>

								<div className="property-section">
									<h5>Properties:</h5>
									{annotation.property.map((prop, propIndex) => (
										<div key={propIndex} className="input-field">
											<input
												type="text"
												value={prop}
												onChange={(e) =>
													updateAnnotationProperty(
														annotationIndex,
														propIndex,
														e.target.value
													)
												}
												placeholder="Enter property"
												className="property-input"
											/>
											<button
												onClick={() =>
													removePropertyField(annotationIndex, propIndex)
												}
												className="delete-field-btn"
												title="Delete property field"
											>
												🗑️
											</button>
										</div>
									))}
									<button
										onClick={() => addPropertyField(annotationIndex)}
										className="add-field-btn"
									>
										+ Add Property
									</button>
								</div>

								<div className="dimension-section">
									<h5>Dimensions:</h5>
									{annotation.dimension.map((dim, dimIndex) => (
										<div key={dimIndex} className="input-field">
											<input
												type="text"
												value={dim}
												onChange={(e) =>
													updateAnnotationDimension(
														annotationIndex,
														dimIndex,
														e.target.value
													)
												}
												placeholder="Enter dimension"
												className="dimension-input"
											/>
											<button
												onClick={() =>
													removeDimensionField(annotationIndex, dimIndex)
												}
												className="delete-field-btn"
												title="Delete dimension field"
											>
												🗑️
											</button>
										</div>
									))}
									<button
										onClick={() => addDimensionField(annotationIndex)}
										className="add-field-btn"
									>
										+ Add Dimension
									</button>
								</div>
							</div>
						)
					)}

					<button onClick={addAnnotation} className="add-annotation-btn">
						+ Add New Annotation
					</button>
				</div>

				<div className="save-section">
					<button onClick={handleSave} className="save-btn">
						Save Annotations
					</button>
				</div>
			</div>
		</div>
	)
}
