"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(manifest) {
    if (!manifest.assetCategories) {
        return [];
    }
    if (!Array.isArray(manifest.assetCategories)) {
        throw new Error(`${manifest.name}'s nodecg.assetCategories is not an Array`);
    }
    return manifest.assetCategories.map((category, index) => {
        if (typeof category.name !== 'string') {
            throw new Error(`nodecg.assetCategories[${index}] in bundle ${manifest.name} lacks a "name" property`);
        }
        if (category.name.toLowerCase() === 'sounds') {
            throw new Error('"sounds" is a reserved assetCategory name. ' +
                `Please change nodecg.assetCategories[${index}].name in bundle ${manifest.name}`);
        }
        if (typeof category.title !== 'string') {
            throw new Error(`nodecg.assetCategories[${index}] in bundle ${manifest.name} lacks a "title" property`);
        }
        if (category.allowedTypes && !Array.isArray(category.allowedTypes)) {
            throw new Error(`nodecg.assetCategories[${index}].allowedTypes in bundle ${manifest.name} is not an Array`);
        }
        return category;
    });
}
exports.default = default_1;
//# sourceMappingURL=assets.js.map