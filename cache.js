// import
// npm i keyv map-expire ecerroni/fast-memoize.js
const memoize = require('fast-memoize')
const Keyv = require('keyv')
const Cache = require('map-expire/MapExpire')

// create a custom cache adapter
const storageAdapter = new Keyv({
    ttl: 1000, // in milliseconds, expires the entry after 1s
    store: new Cache([], {
        capacity: 1000,
        // duration: 1000, // in millisecond, default expiration time. Not need to set it if ttl is already set
    }),
})

// wrap the storage in a type of cache fast-memoize expects
const cache = {
    create: function create() {
        return storageAdapter
    },
}

async function main() {
    // function
    let myFn = () => {
        console.log('wow')
    }

    myFn = memoize(myFn, { cache })
    const memoizedFn = myFn

    await memoizedFn() // cached fn will be removed after 1 second
}

main()