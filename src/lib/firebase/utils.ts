import { Timestamp } from 'firebase/firestore';

export function generateRandomToken(length = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

export function convertTimestampToDate(timestamp: Timestamp | null): Date | null {
    return timestamp ? new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000) : null;
}

export function convertDateToTimestamp(date: Date | null): Timestamp | null {
    return date ? {
        seconds: Math.floor(date.getTime() / 1000),
        nanoseconds: (date.getTime() % 1000) * 1000000
    } as Timestamp : null;
}
