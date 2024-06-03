// Credit to https://gist.github.com/lorisleiva/ac21f8492f9e74ddb8a565e054188d1c

import { customRef } from 'vue'

export default function<T>(key: string, defaultValue: T) {
    return customRef((track, trigger) => ({
        get: () => {
            track()
            const value = localStorage.getItem(key)
            return value ? JSON.parse(value) : defaultValue
        },
        set: (value: T) => {
            if (value === null) {
                localStorage.removeItem(key)
            } else {
                localStorage.setItem(key, JSON.stringify(value))
            }
            trigger()
        },
    }))
}