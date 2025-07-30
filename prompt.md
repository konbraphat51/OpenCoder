## Requirements

create a two-page static website that fills these requirements:

- page1: data input

  - receive uploads:

    - target data JSON
      - the structure
        {
        "data":[
        {
        "index":INT,
        "content":STR
        }
        ]
        }
    - annotation JSON

      - the structure

      {
      "data":[
      {
      "index":INT,
      "annotations":[
      {
      "property": [STR]
      "dimension": [STR]
      }
      ]
      }
      ]
      }

      - This can be null if first time

- page2: annotation
  - divide the page left and right
  - left
    - put the pulldown at the top that can select index
      - this pulldown switch the target data for annotation
    - show the content for the rest of the area
      - Make this scrollable, keep it inside the screen
  - right
    - List the cards of annotations associated with the index
      - each annotation has property and dimension
      - each property and dimension has their own card inside annotation card
        - in the inside-card, there is list of input fields
        - each inputfield has trashcan icon to delete
        - put + button at bottom to add new one
      - Make cards list scrollable and keep it inside the screen
    - Put small save button at the bottom
      - save button create annotation JSON above

## Notes

- You can delete unnecessary files inside this repository. Especially the default vite files.
- Try to write clearly. Divide components for readability
