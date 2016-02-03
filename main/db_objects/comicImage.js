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
    ComicImage.prototype.getComicImageId = function () { return this.id; };
    ComicImage.prototype.setComicImageId = function (id) { this.id = id; };
    ComicImage.prototype.getComicOrder = function () { return this.order; };
    ComicImage.prototype.setComicOrder = function (order) { this.order = order; };
    ComicImage.prototype.getComicAuthor = function () { return this.author; };
    ComicImage.prototype.setComicAuthor = function (author) { this.author = author; };
    ComicImage.prototype.getComicImage = function () { return this.image; };
    ComicImage.prototype.setComicImage = function (image) { this.image = image; };
    return ComicImage;
})();
//# sourceMappingURL=comicImage.js.map