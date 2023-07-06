const parseDuration = require("./parseDuration");

test("parses a duration for full hours", () => {
  expect(parseDuration("PT2H0M0S")).toBe("02:00:00");
});

test("parses a duration with only minutes", () => {
  expect(parseDuration("PT30M0S")).toBe("00:30:00");
});

test("parses a duration with only seconds", () => {
  expect(parseDuration("PT0M10S")).toBe("00:00:10");
});

test("parses a duration for less than one hour", () => {
  expect(parseDuration("PT5M10S")).toBe("00:05:10");
});

test("parses a duration with zero minutes", () => {
  expect(parseDuration("PT1H0M10S")).toBe("01:00:10");
});

test("correctly pads with zeros", () => {
  expect(parseDuration("PT1H4M7S")).toBe("01:04:07");
});

test("fails to parse durations longer than 24h", () => {
  expect(parseDuration("P4DT1H4M7S")).not.toBe("01:04:07");
});
