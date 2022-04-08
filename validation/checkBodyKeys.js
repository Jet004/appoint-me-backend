// This function will get the keys from an object and it's children
// and return all of the keys as a single flat array
// This function will work for arrays of objects but not for 
// multidimensional arrays
const getKeys = (obj) => {
    const keys = []
    for(let [key, value] of Object.entries(obj)) {
        if(Array.isArray(value)) {
            value.map(item => {
                // Disregard nested arrays
                if(!Array.isArray(item)) {
                    // Check if item is an object
                    if(typeof item === 'object') {
                        const nestedKeys = getKeys(item)
                        keys.push(...nestedKeys.map(childKey => key + "." + childKey))
                    }
                }
            })
        } else if(typeof value === "object") {
            const nestedKeys = getKeys(value)
            keys.push(...nestedKeys.map(childKey => key + "." + childKey))
        } else {
            keys.push(key)
        }
    }
    
    return keys
}

// This function checks for unexpected keys in the request body
const checkForUnexpectedKeys = (acceptedKeys, body) => {
    const keysToCheck = getKeys(body)

    let unexpectedKeys = []
    keysToCheck.forEach(key => {
        if(!acceptedKeys.includes(key)) {
            unexpectedKeys.push(key)
        }
    })     

    return unexpectedKeys
}

export default checkForUnexpectedKeys