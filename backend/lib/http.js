exports.throwIfError = (error) => { if (error) { const err = new Error(error.message); err.status = error.code === 'PGRST116' ? 404 : 400; throw err; } };
exports.clean = (source, allowed) => Object.fromEntries(allowed.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]));
