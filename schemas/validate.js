const { Validator } = require('jsonschema');
const validator = new Validator();

module.exports = (data, schema) => {
    if (!data)
        return Promise.reject({
            response: { data: ['data argument required'] },
        });

    const validationResult = validator.validate(data, schema);
    if (validationResult.errors.length)
        return Promise.reject({
            response: {
                data: validationResult.errors.map(
                    ({ property, message }) => `${property} ${message}`,
                ),
            },
        });

    return Promise.resolve(true);
};
