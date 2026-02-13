/**
 * Converts Firestore Timestamps (or objects with seconds/nanoseconds) to a serializable format (ISO string or number).
 * Useful for storing Firestore data in Redux.
 */
export function toSerializable(data: any): any {
    if (data === null || data === undefined) {
        return data;
    }

    // Handle Firestore Timestamp or objects that look like it
    if (typeof data === 'object' && 'seconds' in data && 'nanoseconds' in data) {
        return new Date(data.seconds * 1000 + data.nanoseconds / 1e6).toISOString();
    }

    // Handle Date objects
    if (data instanceof Date) {
        return data.toISOString();
    }

    // Handle Arrays
    if (Array.isArray(data)) {
        return data.map(toSerializable);
    }

    // Handle Objects
    if (typeof data === 'object') {
        const result: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                result[key] = toSerializable(data[key]);
            }
        }
        return result;
    }

    return data;
}
