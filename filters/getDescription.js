const lodash = require("lodash");

module.exports = function (title, defaultTitle) {
    return lodash.size(title) > 0 ? title : defaultTitle;
};
