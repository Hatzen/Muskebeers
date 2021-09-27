const MUENSTER_RELEVANT_RADIUS_IN_KM = 2.5

export function getColorForValue(value){
  var x = 2 * Math.min(value, MUENSTER_RELEVANT_RADIUS_IN_KM) / MUENSTER_RELEVANT_RADIUS_IN_KM - 1
  let normalizedValue = 0.5 * (1 + x / (1 + x**5));
  return getColor(normalizedValue);
}

export function getColor(value){
  return `rgba(${255*(1-value)}, ${150*value}, ${255*value})`
}
