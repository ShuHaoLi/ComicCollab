/**
 * Created by wendywang on 2016-02-02.
 */
///<reference path='../db_objects/account.ts'/>
///<reference path='../db_objects/comicImage.ts'/>
class Comics {
    id : number;
    title : string;
    author : Account;
    image: ComicImage;
    constructor (id, title, author, image){
        this.id = id;
        this.title = title;
        this.author = author;
        this.image = image;
    }
    getComicsId() {return this.id;}
    getComicsTitle() {return this.title;}
    getComicsAuthor() {return this.author;}
    getComicsImage() {return this.image;}


}
