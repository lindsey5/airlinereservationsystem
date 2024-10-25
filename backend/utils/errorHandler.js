export const errorHandler = (err) => {
    const errors = [];
    if (err.errors) {
        for (const key in err.errors) {
            errors.push(err.errors[key].message);
        }
    } else {
        // Handle other types of errors, e.g. validation or custom errors
        errors.push(err.message);
    }

    return errors;
};