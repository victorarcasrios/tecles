# tecles
Tool to build keyboard β¨οΈ heatmaps in real time.

## Current state:
- Logs every key press π§
- Displays a table with count of presses by key π
- Desktop application (electron) β‘

## Goals: 
- Display keyboard heatmap πΊοΈ
- Support multiple layouts π€

## Development
This project uses [iohook](https://wilix-team.github.io/iohook) to listen 
the keys pressed no matter the application being focused.

When installing iohook it will read the configuration in the package.json
and download the correct prebuilts for each of the specified platforms.
Check out the package.json and the iohook docs for troubleshooting.
