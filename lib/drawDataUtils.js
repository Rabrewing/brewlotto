// @lib/drawDataUtils.js
// Summary: lightweight compatibility helpers for legacy prediction cards

export async function getNextDrawTime(_game) {
    const now = new Date();
    const nextDraw = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return nextDraw.toISOString();
}

export async function getLastDraw(_game) {
    return {
        numbers: [1, 2, 3, 4, 5],
        date: new Date().toISOString(),
        bonus: 10,
    };
}
