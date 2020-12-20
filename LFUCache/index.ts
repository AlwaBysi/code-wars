type CacheItem = {
    key: number;
    value: number;
    useCount: number;
}

class LFUCache {
    private capacity: number;
    private cache: CacheItem[];

    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = []
    }

    get(key: number) {
        if (this.capacity === 0 || this.capacity < 0) return -1;

        const indexOfFindedEl = this.findElByKey(key);
        if (indexOfFindedEl === -1) return indexOfFindedEl;
        const removedItem = this.deleteItemByIndex(indexOfFindedEl)
        this.addElByPriory(indexOfFindedEl, removedItem)
        return removedItem.value
    }

    put(key: number, value: number): void {
        const indexOfFindedEl = this.findElByKey(key)
        if (indexOfFindedEl === -1) {
            if (this.cache.length >= this.capacity) this.deleteItemByPriory()
            this.pushByPriory(key, value)
        } else {
            const removedItem = this.deleteItemByIndex(indexOfFindedEl)
            this.addElByPriory(indexOfFindedEl, { key, value, useCount: removedItem.useCount })
        }
        return null
    }

    pushByPriory (key: number, value: number) {
        const smallPrioryElIndex = this.findElWithSmallPriory()
        if (smallPrioryElIndex === -1) {
            this.cache.push({
                key,
                value,
                useCount: 0
            })
        } else {
            this.cache.splice(smallPrioryElIndex - 1, 0, {
                key,
                value,
                useCount: 0
            })
        }
    }

    findElByKey(key: number): number {
        return this.cache.findIndex(item => item.key === key)
    }

    findElWithSmallPriory(): number {
        const { index } = this.cache.reduce((acc, item, index) => {
            if (index === 0) acc = { count: item.useCount, index: 0}
            if (item.useCount <= acc.count) acc = { count: item.useCount, index }
            return acc
        }, { count: -1, index: -1 })
        return index
    }

    deleteItemByPriory(): void {
        let deleteIndex = this.findElWithSmallPriory()
        if (deleteIndex === -1) deleteIndex = this.cache.length - 1
        this.cache.splice(deleteIndex, 1)
    }

    deleteItemByIndex(index: number): CacheItem {
        const removedItem = this.cache.splice(index, 1)
        return removedItem[0]
    }

    addElByPriory (index: number, { key, value, useCount}: CacheItem): void {
        const currentIndex = this.cache.findIndex(item => item.useCount < useCount)
        if (currentIndex === -1) {
            this.cache.unshift({ key, value, useCount: useCount + 1 })
        } else {
            this.cache.splice(index - 1, 0, { key, value, useCount: useCount + 1})
        }
    }
}

const test = [[3],[2,2],[1,1],[2],[1],[2],[3,3],[4,4],[3],[2],[1],[4]]
const newClass = new LFUCache(test[0][0])
test.splice(0, 1)

for (let i = 0; i < test.length; i++) {
    const currentTest = test[i]
    if (currentTest.length === 1) {
        console.log('get', newClass.get(currentTest[0]))
    } else {
        console.log('put', newClass.put(currentTest[0], currentTest[1]))
    }
}
