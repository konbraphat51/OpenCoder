import { useState, useCallback } from "react"
import type { TargetData, AnnotationData } from "../types"

export const useAppData = () => {
	const [targetData, setTargetData] = useState<TargetData | null>(null)
	const [annotationData, setAnnotationData] = useState<AnnotationData | null>(
		null
	)

	const loadTargetData = useCallback((data: TargetData) => {
		setTargetData(data)
	}, [])

	const loadAnnotationData = useCallback((data: AnnotationData) => {
		setAnnotationData(data)
	}, [])

	const saveAnnotationData = useCallback((data: AnnotationData) => {
		setAnnotationData(data)

		// Create download link for the annotation data
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url

		// Generate filename with unix timestamp
		const unixTime = Math.floor(Date.now() / 1000)
		a.download = `annotation_${unixTime}.json`

		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}, [])

	return {
		targetData,
		annotationData,
		loadTargetData,
		loadAnnotationData,
		saveAnnotationData,
	}
}
