/**
 * Created by wendywang on 2016-02-02.
 */
///<reference path='../db_objects/account.ts'/>
class ComicImage{
    id : number;
    order : number;
    author: Account;
    //image : Image;

    constructor (id, order, author, image){
        this.id = id;
        this.order = order;
        this.image = image;
    }
    getComicImageId() {return this.id;}
    setComicImageId(id : number) {this.id = id;}
    getComicOrder() {return this.order;}
    setComicOrder(order : number) {this.order = order;}
    getComicAuthor() {return this.author;}
    setComicAuthor(author : Account) {this.author = author;}
    getComicImage() {return this.image;}
    //setComicImage(image : Image) {this.image = image;}



}
