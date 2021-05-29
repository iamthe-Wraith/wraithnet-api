export const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const isValidDate = (d: string | Date) => {
  const date = d instanceof Date ? d : new Date(d);
  return !isNaN(date.getTime());
}