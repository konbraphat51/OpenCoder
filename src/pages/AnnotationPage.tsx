import { useState, useEffect, useRef } from "react"
import { Header } from "../components/Header"
import type { TargetData, AnnotationData, Annotation } from "../types"

// Focus tracking type
type FocusPosition = {
	annotationIndex: number
	fieldType: "property" | "dimension"
	fieldIndex: number
}

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
	const [focusPosition, setFocusPosition] = useState<FocusPosition | null>(null)
	const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map())

	// Helper function to find the default index (smallest unannotated index, or first if all annotated)
	const getDefaultIndex = (
		targetData: TargetData,
		annotationData: AnnotationData
	): number => {
		// Sort target data by index to get smallest first
		const sortedTargetData = [...targetData.data].sort(
			(a, b) => a.index - b.index
		)

		// Find the first index that has no annotations or empty annotations
		for (const targetItem of sortedTargetData) {
			const annotationItem = annotationData.data.find(
				(item) => item.index === targetItem.index
			)
			if (!annotationItem || annotationItem.annotations.length === 0) {
				return targetItem.index
			}
		}

		// If all are annotated, return the first (smallest) index
		return sortedTargetData[0]?.index || 0
	}

	useEffect(() => {
		if (annotationData) {
			setCurrentAnnotations(JSON.parse(JSON.stringify(annotationData))) // Deep copy
		}
	}, [annotationData])

	useEffect(() => {
		if (targetData && annotationData) {
			const defaultIndex = getDefaultIndex(targetData, annotationData)
			setSelectedIndex(defaultIndex)
		}
	}, [targetData, annotationData])

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

	// Move annotation card up or down
	const moveAnnotation = (
		annotationIndex: number,
		direction: "up" | "down"
	) => {
		if (!currentAnnotationItem) return

		const annotations = currentAnnotationItem.annotations
		if (annotations.length <= 1) return

		let newIndex: number
		if (direction === "up" && annotationIndex > 0) {
			newIndex = annotationIndex - 1
		} else if (
			direction === "down" &&
			annotationIndex < annotations.length - 1
		) {
			newIndex = annotationIndex + 1
		} else {
			return // Can't move further
		}

		// Swap annotations
		const temp = annotations[annotationIndex]
		annotations[annotationIndex] = annotations[newIndex]
		annotations[newIndex] = temp

		setCurrentAnnotations({ ...currentAnnotations })

		// Update focus position to follow the moved annotation
		if (focusPosition && focusPosition.annotationIndex === annotationIndex) {
			setTimeout(() => {
				focusInput(newIndex, focusPosition.fieldType, focusPosition.fieldIndex)
			}, 0)
		}
	}

	// Generate a unique key for input field referencing
	const getInputKey = (
		annotationIndex: number,
		fieldType: "property" | "dimension",
		fieldIndex: number
	) => {
		return `${annotationIndex}-${fieldType}-${fieldIndex}`
	}

	// Focus an input field
	const focusInput = (
		annotationIndex: number,
		fieldType: "property" | "dimension",
		fieldIndex: number
	) => {
		const key = getInputKey(annotationIndex, fieldType, fieldIndex)
		const input = inputRefs.current.get(key)
		if (input) {
			input.focus()
			setFocusPosition({ annotationIndex, fieldType, fieldIndex })
		}
	}

	// Get total field count for navigation
	const getFieldCount = (
		annotationIndex: number,
		fieldType: "property" | "dimension"
	) => {
		if (!currentAnnotationItem) return 0
		const annotation = currentAnnotationItem.annotations[annotationIndex]
		return fieldType === "property"
			? annotation.property.length
			: annotation.dimension.length
	}

	// Navigate between fields
	const navigateField = (
		direction: "up" | "down",
		shiftPressed: boolean = false
	) => {
		if (!focusPosition || !currentAnnotationItem) return

		const { annotationIndex, fieldType, fieldIndex } = focusPosition

		if (shiftPressed) {
			// Switch between property and dimension sections
			const newFieldType = fieldType === "property" ? "dimension" : "property"
			const newFieldCount = getFieldCount(annotationIndex, newFieldType)
			if (newFieldCount > 0) {
				const newFieldIndex = Math.min(fieldIndex, newFieldCount - 1)
				focusInput(annotationIndex, newFieldType, newFieldIndex)
			}
		} else {
			// Navigate within the same field type
			const fieldCount = getFieldCount(annotationIndex, fieldType)
			let newFieldIndex = fieldIndex

			if (direction === "up" && fieldIndex > 0) {
				newFieldIndex = fieldIndex - 1
			} else if (direction === "down" && fieldIndex < fieldCount - 1) {
				newFieldIndex = fieldIndex + 1
			} else if (
				direction === "up" &&
				fieldIndex === 0 &&
				annotationIndex > 0
			) {
				// Move to previous annotation's last field of same type
				const prevAnnotation =
					currentAnnotationItem.annotations[annotationIndex - 1]
				const prevFieldCount =
					fieldType === "property"
						? prevAnnotation.property.length
						: prevAnnotation.dimension.length
				if (prevFieldCount > 0) {
					focusInput(annotationIndex - 1, fieldType, prevFieldCount - 1)
				}
				return
			} else if (
				direction === "down" &&
				fieldIndex === fieldCount - 1 &&
				annotationIndex < currentAnnotationItem.annotations.length - 1
			) {
				// Move to next annotation's first field of same type
				focusInput(annotationIndex + 1, fieldType, 0)
				return
			}

			if (newFieldIndex !== fieldIndex) {
				focusInput(annotationIndex, fieldType, newFieldIndex)
			}
		}
	}

	// Handle keyboard shortcuts
	const handleKeyDown = (
		e: React.KeyboardEvent,
		annotationIndex: number,
		fieldType: "property" | "dimension",
		fieldIndex: number
	) => {
		if (e.key === "ArrowUp") {
			e.preventDefault()
			if (e.ctrlKey) {
				// Move annotation card up
				moveAnnotation(annotationIndex, "up")
			} else {
				navigateField("up", e.shiftKey)
			}
		} else if (e.key === "ArrowDown") {
			e.preventDefault()
			if (e.ctrlKey) {
				// Move annotation card down
				moveAnnotation(annotationIndex, "down")
			} else {
				navigateField("down", e.shiftKey)
			}
		} else if (e.key === "Enter") {
			e.preventDefault()
			if (e.shiftKey) {
				// Add new annotation
				addAnnotation()
				// Focus first property field of new annotation
				setTimeout(() => {
					const newAnnotationIndex =
						currentAnnotationItem!.annotations.length - 1
					focusInput(newAnnotationIndex, "property", 0)
				}, 0)
			} else {
				// Add new field in current section
				if (fieldType === "property") {
					addPropertyField(annotationIndex)
					setTimeout(() => {
						focusInput(annotationIndex, fieldType, fieldIndex + 1)
					}, 0)
				} else {
					addDimensionField(annotationIndex)
					setTimeout(() => {
						focusInput(annotationIndex, fieldType, fieldIndex + 1)
					}, 0)
				}
			}
		} else if (
			e.key === "Delete" &&
			e.target instanceof HTMLInputElement &&
			e.target.value === ""
		) {
			e.preventDefault()
			// Delete current field if it's empty
			const fieldCount = getFieldCount(annotationIndex, fieldType)
			if (fieldCount > 1) {
				// Don't delete if it's the last field
				if (fieldType === "property") {
					removePropertyField(annotationIndex, fieldIndex)
				} else {
					removeDimensionField(annotationIndex, fieldIndex)
				}
				// Focus previous field or same index if deleting first field
				const newFieldIndex = fieldIndex > 0 ? fieldIndex - 1 : 0
				setTimeout(() => {
					const newFieldCount = getFieldCount(annotationIndex, fieldType)
					if (newFieldCount > 0) {
						focusInput(
							annotationIndex,
							fieldType,
							Math.min(newFieldIndex, newFieldCount - 1)
						)
					}
				}, 0)
			}
		}
	}

	// Handle input focus for tracking focus position
	const handleInputFocus = (
		annotationIndex: number,
		fieldType: "property" | "dimension",
		fieldIndex: number
	) => {
		setFocusPosition({ annotationIndex, fieldType, fieldIndex })
	}

	return (
		<>
			<Header />
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
													ref={(el) => {
														if (el) {
															inputRefs.current.set(
																getInputKey(
																	annotationIndex,
																	"property",
																	propIndex
																),
																el
															)
														}
													}}
													type="text"
													value={prop}
													onChange={(e) =>
														updateAnnotationProperty(
															annotationIndex,
															propIndex,
															e.target.value
														)
													}
													onKeyDown={(e) =>
														handleKeyDown(
															e,
															annotationIndex,
															"property",
															propIndex
														)
													}
													onFocus={() =>
														handleInputFocus(
															annotationIndex,
															"property",
															propIndex
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
													ref={(el) => {
														if (el) {
															inputRefs.current.set(
																getInputKey(
																	annotationIndex,
																	"dimension",
																	dimIndex
																),
																el
															)
														}
													}}
													type="text"
													value={dim}
													onChange={(e) =>
														updateAnnotationDimension(
															annotationIndex,
															dimIndex,
															e.target.value
														)
													}
													onKeyDown={(e) =>
														handleKeyDown(
															e,
															annotationIndex,
															"dimension",
															dimIndex
														)
													}
													onFocus={() =>
														handleInputFocus(
															annotationIndex,
															"dimension",
															dimIndex
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
		</>
	)
}
