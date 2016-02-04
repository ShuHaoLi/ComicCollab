/**
 * Created by wendywang on 2016-02-02.
 */
var Tag = (function () {
    function Tag(id, tagName) {
        this.id = id;
        this.tagName = tagName;
    }
    Tag.prototype.getTagId = function () { return this.id; };
    Tag.prototype.setTagId = function (id) { this.id = id; };
    Tag.prototype.getTagName = function () { return this.tagName; };
    Tag.prototype.setTagName = function (tagName) { this.tagName = tagName; };
    return Tag;
})();
//# sourceMappingURL=tag.js.map