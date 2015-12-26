foreach($inputFile in get-childitem json) {
    node verify.js $inputFile
}
