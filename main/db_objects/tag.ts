/**
 * Created by wendywang on 2016-02-02.
 */
class Tag {
    id : number;
    tagName : string;
    constructor (id, tagName) {
        this.id = id;
        this.tagName = tagName;
    }
    getTagId() {return this.id;}
    getTagName() {return this.tagName;}

}
