# OpenCoder - Data Annotation Tool

A modern, three-page React application for data annotation with a beautiful and intuitive interface.

## Features

### Page 1: Data Input

- Upload target data JSON files
- Upload annotation JSON files (optional)
- Real-time validation of JSON structure
- Beautiful file upload interface with drag-and-drop styling
- **Create Target Data** button to generate data from text

### Page 2: Text Input (New!)

- Large text input area for raw text content
- Delimiter input field (supports newline \n, tab \t, etc.)
- Real-time preview of how many parts will be created
- **Run** button to generate and download target data JSON
- Auto-generates filename with Unix timestamp: `OpenCoder_UNIXTIME.json`
- **Back to Data Upload** button for easy navigation

### Page 3: Annotation

- Split-screen layout for optimal workflow
- Left panel: Content display with index selector
- Right panel: Dynamic annotation cards with property and dimension management
- Scrollable content areas that stay within screen bounds
- One-click save functionality that downloads updated annotations
- **Smart default index**: Opens to the smallest unannotated index (or first if all annotated)

## Data Structure

### Target Data JSON

```json
{
	"data": [
		{
			"index": 1,
			"content": "Your text content here"
		}
	]
}
```

### Annotation Data JSON

```json
{
	"data": [
		{
			"index": 1,
			"annotations": [
				{
					"property": ["property1", "property2"],
					"dimension": ["dimension1", "dimension2"]
				}
			]
		}
	]
}
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

3. Open your browser to `http://localhost:5173`

## Sample Data

The project includes sample data files for testing:

- `sample-target-data.json` - Example target data
- `sample-annotation-data.json` - Example annotation data

## Usage

1. **Data Input**: Upload your target data JSON (required) and optionally an existing annotation JSON file
2. **Text Input**: (New!) Generate target data JSON from raw text
3. **Annotation**: Navigate to the annotation page where you can:
   - Select different content items using the dropdown
   - Add new annotations with properties and dimensions
   - Edit existing annotations
   - Delete unwanted fields or annotations
   - Save your work (downloads updated annotation file)

## Technology Stack

- React 19 with TypeScript
- React Router for navigation
- Modern CSS with gradients and animations
- Responsive design for mobile and desktop

## Features Highlights

- ✅ Clean, modern UI with beautiful gradients
- ✅ Fully responsive design
- ✅ Real-time JSON validation
- ✅ Dynamic annotation management
- ✅ Automatic file downloads
- ✅ Scrollable content areas
- ✅ Component-based architecture
- ✅ TypeScript for type safety
