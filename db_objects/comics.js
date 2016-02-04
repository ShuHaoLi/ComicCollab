/**
 * Created by wendywang on 2016-02-02.
 */
///<reference path='../db_objects/account.ts'/>
///<reference path='../db_objects/comicImage.ts'/>
var Comics = (function () {
    function Comics(id, title, author, image) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.image = image;
    }
    Comics.prototype.getComicsId = function () { return this.id; };
    Comics.prototype.getComicsTitle = function () { return this.title; };
    Comics.prototype.getComicsAuthor = function () { return this.author; };
    Comics.prototype.getComicsImage = function () { return this.image; };
    return Comics;
})();
//# sourceMappingURL=comics.js.map