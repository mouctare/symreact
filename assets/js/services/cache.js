const cache = {};


function set(key, data) {
    cache[key] = {
         data,
        cachedAt: new Date().getTime()
    }
}

function get(key) {
    
    return new Promise((resolve) => { 
        // Es ce que le cache key existe si oui je retourne le cache key .data si ça n'éxiste pas , je retourne null.
        resolve(
            cache[key] && cache[key].cachedAt + 15 * 60 * 1000 > new Date().getTime() 
        ? cache[key].data 
        : null

    );
});
}

function invalidate(key) {
    delete cache[key];
}

export default {
    set,
    get,
    invalidate
};