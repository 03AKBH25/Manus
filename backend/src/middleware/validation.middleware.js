const toTrimmedString = (value) =>
  typeof value === "string" ? value.trim() : value;

export const validateRequest = (rules) => (req, res, next) => {
  const validated = {
    body: {},
    query: {},
    params: {}
  };
  const errors = [];

  for (const rule of rules) {
    const source = rule.source || "body";
    const rawValue = req[source]?.[rule.field];
    const value = typeof rawValue === "string" ? toTrimmedString(rawValue) : rawValue;
    const isMissing =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.length === 0);

    if (rule.required && isMissing) {
      errors.push(`${rule.field} is required`);
      continue;
    }

    if (isMissing) {
      continue;
    }

    if (rule.type === "string" && typeof value !== "string") {
      errors.push(`${rule.field} must be a string`);
      continue;
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
      continue;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`${rule.field} must be at most ${rule.maxLength} characters`);
      continue;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(rule.message || `${rule.field} is invalid`);
      continue;
    }

    if (rule.transform === "lowercase" && typeof value === "string") {
      validated[source][rule.field] = value.toLowerCase();
      continue;
    }

    validated[source][rule.field] = value;
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors
    });
  }

  req.validated = validated;
  next();
};
