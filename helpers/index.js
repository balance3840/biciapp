export function sanitizeString(stop) {
  const parts = stop.split("_");
  let resultString = "";
  parts.map((part, index) => {
    if (index > 0) {
      resultString += `${part} `;
    }
  });
  return resultString;
}
