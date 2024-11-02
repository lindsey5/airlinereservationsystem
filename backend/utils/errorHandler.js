export const errorHandler = (err) => {
    const errors = [];

    if (err.errors) {
        for (const key in err.errors) {
            errors.push(key.message);
        }
    } else {
        err.message.includes('duplicate key') ? errors.push(`${JSON.stringify(err.errorResponse.keyValue)} is already exist`) : 
        errors.push(err.message);
    }
    return errors;
};