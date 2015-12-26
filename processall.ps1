foreach($inputFile in get-childitem html) {
    node process.js $inputFile
}

