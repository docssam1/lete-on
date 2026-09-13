// Pure models shared by concept frames, practice and answer diagrams.
function integer(value, name, min, max) {
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  }
}

export function repeatingPatternModel({ cycle, position }) {
  if (!Array.isArray(cycle) || cycle.length < 2 || cycle.length > 8 ||
      cycle.some((token) => typeof token !== "string" || !token.trim() || token.length > 30)) {
    throw new TypeError("cycle requires 2 to 8 nonempty string tokens");
  }
  integer(position, "position", 1, 1000000);
  const size = cycle.length;
  const quotient = Math.floor(position / size);
  const remainder = position % size;
  // Positions are one-based: an exact multiple belongs to the last slot.
  const slot = remainder === 0 ? size : remainder;
  return {
    kind: "repeating-pattern", cycle: [...cycle], position, size,
    quotient, remainder, slot, answer: cycle[slot - 1],
    groupNumber: Math.ceil(position / size),
    groupStart: Math.floor((position - 1) / size) * size + 1,
    preview: Array.from({ length: size * 2 }, (_, index) => cycle[index % size])
  };
}

export function equalQuotientRemainderModel({ divisor, minimum = 1, maximum = 1000000 }) {
  integer(divisor, "divisor", 2, 1000);
  integer(minimum, "minimum", 1, 1000000);
  integer(maximum, "maximum", minimum, 1000000);
  const factor = divisor + 1;
  // A positive natural number excludes q=r=0; division requires r<divisor.
  const first = Math.max(1, Math.ceil(minimum / factor));
  const last = Math.min(divisor - 1, Math.floor(maximum / factor));
  const candidates = Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => {
    const quotient = first + index;
    return { number: factor * quotient, quotient, remainder: quotient };
  });
  return {
    kind: "equal-quotient-remainder", divisor, minimum, maximum, factor,
    first: candidates.length ? first : null,
    last: candidates.length ? last : null,
    candidates, count: candidates.length
  };
}
