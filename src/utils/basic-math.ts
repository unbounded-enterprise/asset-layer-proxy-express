

export function inRange(num: number, min = 0, max = 999) {
    return ((num > max) ? false : ((num < min) ? false : true)); }

export function randomRange(min :number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}