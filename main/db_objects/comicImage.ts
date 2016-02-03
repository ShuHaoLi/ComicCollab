/**
 * Created by wendywang on 2016-02-02.
 */
///<reference path='../db_objects/account.ts'/>
class ComicImage{
    id : number;
    order : number;
    author: Account;
    image : Image;

    constructor (id, order, author, image){
        this.id = id;
        this.order = order;
        this.image = image;
    }
    getComicImageid() {return this.id;}
    getComicOrder() {return this.order;}
    getComicAuthor() {return this.author;}
    getComicImage() {return this.image;}

}
