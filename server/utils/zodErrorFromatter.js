export const zodErrorFormat = (errors) => {
  let formatted = {};

  errors.issues.forEach((err) => {
    const field = err.path[0];
    formatted[field] = err.message;
  });
  return formatted;
};
