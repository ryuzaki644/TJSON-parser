const inp = require('fs').readFileSync('./example.json').toString()

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

const parserFactory = (tag) => {
  if (tag === 's') return stringParser
  if (tag === 'i') return intParser
  if (tag === 'O') return objectParser

  if (tag.startsWith('A') === true) {
    return (tag) => {
      const insideTag = 's'
      return arrayParserGenerator(insideTag)
    }
  }
  return input => null
}
const arrayParserGenerator = (insideTag) => input => {
  let tempArray = []
  let requiredOut, comma
  input = input.trim()
  if (input.startsWith('[') === false) return null
  input = input.slice(1)
  input = input.trim()
  if (insideTag === '' && input.startsWith(']')) return [[], input.slice(1)]
  let requiredParser = parserFactory(insideTag)
  while (input !== null) {
    input = input.trim()
    requiredOut = requiredParser(input)
    tempArray.push(requiredOut[0])
    input = requiredOut[1]
    comma = commaParser(requiredOut[1])
    if (comma === null) break
    input = comma[1]
  }
  input = input.trim()
  if (input.startsWith(']') === true) return [tempArray, input.slice(1)]
  return null
}

const objectParser = input => {
  if (input.startsWith('{') === false) return null

  let obj = {}
  let key, value, tag, comma
  input = input.slice(1)
  while (input !== null) {
    key = keyParser(input)[0]
    tag = tagParser(keyParser(input)[1])[0]
    value = tagParser(keyParser(input)[1])[1]
    value = value.trim()
    if (value.startsWith('"') === false) return null
    value = value.slice(1)
    value = colonParser(value)
    if (value === null) return null
    value = value[1]
    let reqParser = parserFactory(tag)
    value = reqParser()(value)
    if (value === null) return null
    obj[key] = value[0]
    input = value[1]
    comma = commaParser(input)
    if (comma === null) break
    input = comma[1]
  }
  input = input.trim()
  if (input.startsWith('}') === true) return [obj, input.slice(1)]
  return null
}

const out = objectParser(inp)
if (out === null) {
  console.log('INVALID TJSON')
} else console.log(JSON.stringify(out[0], null, 2))
