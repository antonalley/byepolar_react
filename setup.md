# Pre-scale Work flow:

## To update Live Website:
Push of submit pull request to Production Branch to update live website

## To Test Changes:
To test in the development environment on a temporary 7-day url run this and replace NAME_OF_PREVIEW_CHANNEL with whatever you want to name it:
`npm ci`
`npm run build`
`firebase hosting:channel:deploy NAME_OF_PREVIEW_CHANNEL`