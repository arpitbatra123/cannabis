const lodash = require("lodash");

module.exports = function (array, title) {
    return lodash.get(lodash.find(array, { title: title }), "description");
};
