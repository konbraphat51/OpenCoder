export interface TargetDataItem {
	index: number
	content: string
}

export interface TargetData {
	data: TargetDataItem[]
}

export interface Annotation {
	property: string[]
	dimension: string[]
}

export interface AnnotationDataItem {
	index: number
	annotations: Annotation[]
}

export interface AnnotationData {
	data: AnnotationDataItem[]
}
