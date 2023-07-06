// Expects durations of less than 24h

function parseDuration(iso8601Duration) {
  const numbers = /\d+(?:\.\d+)?/g;

  const matches = iso8601Duration.match(numbers);

  matches[matches.length - 1] = parseInt(
    matches[matches.length - 1]
  ).toString();

  for (let i = 0; i < matches.length; i++) {
    matches[i] = matches[i].padStart(2, "0");
  }

  if (matches.length === 3) {
    return `${matches[0]}:${matches[1]}:${matches[2]}`;
  } else if (matches.length === 2) {
    return `00:${matches[0]}:${matches[1]}`;
  }
  return null;
}

module.exports = parseDuration;
