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

export function getBadgeColor(value, total) {
    const percentage = (value / total) * 100;
    let color;

    if(percentage <= 20) {
        color = "danger";
    }
    else if(percentage > 20 && percentage <= 60) {
        color = "warning";
    }
    else {
        color = "success";
    }

    return color;
}
