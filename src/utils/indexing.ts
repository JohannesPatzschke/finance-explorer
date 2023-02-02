import dayjs from 'dayjs';

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateID() {
  return dayjs().add(getRandomInt(-500, 500), 'milliseconds').valueOf().toString();
}
