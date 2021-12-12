const { TopK } = require('bloom-filters')
const fs = require('fs')
const path = require('path')
const _ = require('underscore')

const taxonomyPathEn = './example-data.txt'
const fileSyncEn = fs.readFileSync(path.join(__dirname, taxonomyPathEn)).toString()
const fileContentEn = fileSyncEn.replace(',', '_').split('\n').filter(Boolean)

const load = (lines) =>
  [lines]
    // separate id and categories
    // e.g ['3237', 'Animals & Pet Supplies > Live Animals']
    .map((lines) => lines.map(splitLine))
    // split categories and put id last
    // e.g. ['Animals & Pet Supplies', 'Live Animals', 3237]
    .map((lines) => lines.map(([id, cats]) => splitCategories(cats)))
    .pop()
const splitBy = (sep) => (str) =>
  str.split(sep).map((x) => x.trim())
const splitLine = splitBy('-')
const splitCategories = splitBy('>')

const keywords = _.flatten(
  load(fileContentEn)
    .filter((arr) => arr.length == 2), (x) => x.join('')
)
console.log(keywords)
// create a new TopK with k = 10, an error rate of 0.001 and an accuracy of 0.99
let topk = new TopK(10, 0.001, 0.99)

// push occurrences one-at-a-time in the multiset
keywords.forEach(keyword => {
  topk.add(keyword)
})

// or, equally, push multiple occurrences at-once in the multiset
// topk.add('alice', 2)
// topk.add('bob', 1)

// print the top k values
for (let item of topk.values()) {
  console.log(`Item "${item.value}" is in position ${item.rank} with an estimated frequency of ${item.frequency}`)
}
// Output:
// Item "alice" is in position 1 with an estimated frequency of 2
// Item "bob" is in position 2 with an estimated frequency of 1
console.log('-++++++++++++++++++++++++++++++++++++++++++++++++++')
console.log('-++++++++++++++++++++++++++++++++++++++++++++++++++')
console.log('-++++++++++++++++++++++++++++++++++++++++++++++++++')

// Import
var adt_1 = require("@toreda/adt")
// Also purge earlier than one week elements !!!! (CRON JOB)

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

const maxSize = 3000
// Use as Buffer
var circularBuffer = new adt_1.CircularQueue({
  maxSize: maxSize,
  overwrite: true
})

let pushCount = 0
const isHalfSeen = () => ((pushCount++) % maxSize) > maxSize / 2
const purgeOld = () => {
  const front = circularBuffer.front()
  if (front && front.when < new Date().getTime() - 2592000000 /*month*/) {
    circularBuffer.pop()
    purgeOld()
  } else {
    return
  }
}
const refreshTopK = (keyword) => {
  purgeOld()
  circularBuffer.push([new Date().getTime(), keyword])
  if (isHalfSeen()) {
    console.log(('isHalfSeenisHalfSeenisHalfSeenisHalfSeenisHalfSeenisHalfSeens'))
    for (let item of topk.values()) {
      console.log(`Item "${item.value}" is in position ${item.rank} with an estimated frequency of ${item.frequency}`)
    }
    pushCount = 0
    topk = new TopK(10, 0.001, 0.99)
    circularBuffer.forEach((elem, index, arr) => {
      topk.add(elem[1])
    })
  }
}

for (let index = 0; index < 10000; index++) {
  refreshTopK(makeid(5))
}

for (let item of topk.values()) {
  console.log(`Item "${item.value}" is in position ${item.rank} with an estimated frequency of ${item.frequency}`)
}

// circularBuffer.push(10) // returns true
// circularBuffer.push(20) // returns true
// console.log(circularBuffer.size())
// circularBuffer.push(30) // returns true
// circularBuffer.push(40) // returns true
// circularBuffer.push(50) // returns true
// console.log('-++++++++++++++++++++++++++++++++++++++++++++++++++')
// circularBuffer.forEach((elem, index, arr) => {
//   console.log(elem + ' is at index ' + index + ' in array ' + arr)
// })

// circularBuffer.push(60) // returns true
// // Get queue size
// circularBuffer.size() // returns 4
// // Get first element added to buffer
// var result = circularBuffer.front() // returns 20
// console.log(result)
// // Get last element added to buffer
// result = circularBuffer.rear() // returns 50
// console.log(result)
// console.log('-++++++++++++++++++++++++++++++++++++++++++++++++++')
// circularBuffer.forEach((elem, index, arr) => {
//   console.log(elem + ' is at index ' + index + ' in array ' + arr)
// })
// circularBuffer.push(70)
// console.log('-++++++++++++++++++++++++++++++++++++++++++++++++++')
// circularBuffer.forEach((elem, index, arr) => {
//   console.log(elem + ' is at index ' + index + ' in array ' + arr)
// })















// circularBuffer.clearElements()
// console.log('-++++++++++++++++++++++++++++++++++++++++++++++++++')
// circularBuffer.forEach((elem, index, arr) => {
// 	console.log(elem + ' is at index ' + index + ' in array ' + arr)
// }) 


