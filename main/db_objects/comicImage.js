/**
 * Created by wendywang on 2016-02-02.
 */
///<reference path='../db_objects/account.ts'/>
var ComicImage = (function () {
    function ComicImage(id, order, author, image) {
        this.id = id;
        this.order = order;
        this.image = image;
    }
    ComicImage.prototype.getComicImageid = function () { return this.id; };
    ComicImage.prototype.getComicOrder = function () { return this.order; };
    ComicImage.prototype.getComicAuthor = function () { return this.author; };
    ComicImage.prototype.getComicImage = function () { return this.image; };
    return ComicImage;
})();
//# sourceMappingURL=comicImage.js.map