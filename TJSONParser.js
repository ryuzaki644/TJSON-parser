const stringParser = input => {
  input = input.trim() // change to regex later
  if (input.startsWith('"') === false) return null
  var end = input.slice(1).indexOf('"')
  return [input.slice(1, end + 1), input.slice(end + 2)]
}

const intParser = (input, numPattern = /^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/) => {
  input = input.trim()
  if (input.match(numPattern)) {
    return [parseFloat(input.match(numPattern)[0]), input.slice(input.match(numPattern)[0].length)]
  }
  return null
}

const keyParser = input => {
  const keyRegex = /^("([a-zA-Z]+[a-z\-A-Z]*))((.|\n)*)$/
  if (keyRegex.exec(input) === null) return null
  return [keyRegex.exec(input)[2], keyRegex.exec(input)[3]]
}

const tagParser = input => {
  const tagRegex = /^:([a-zA-Z0-9<]+[>]*)((.|\n)*)$/
  if (tagRegex.exec(input) === null) return null
  return [tagRegex.exec(input)[1], tagRegex.exec(input)[2]]
}


const colonParser = input => {
  input = input.trim()
  if (input.startsWith(':') === false) return null
  return [':', input.slice(1)]
}

const commaParser = (input) => {
  input = input.trim() // use space parser
  if (input.startsWith(',') === true) {
    return [',', input.slice(1)]
  }
  return null
}
