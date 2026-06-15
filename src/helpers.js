export function formatDate(input) {
  const [day, month, year] = input.split("/");
  return `${year}-${month}-${day}`;
}
