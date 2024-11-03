export const errorHandler = (err) => {
    const errors = [];

    if (err.errors) {
        for (const key in err.errors) {
            errors.push(err.errors[key].message);
        }
    } else {
        if (err.message.includes('duplicate key')) {
            errors.push(`${JSON.stringify(err.errorResponse.keyValue)} already exists`);
        } else {
            errors.push(err.message);
        }
    }

    return errors;
};
