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

export function getBadgeColor(value) {

    if(value <= 3) {
        color = "danger";
    }
    else if(value > 3 && value <= 8) {
        color = "warning";
    }
    else {
        color = "success";
    }

    return color;
}
