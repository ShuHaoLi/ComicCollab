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
    setTagId(id : number) {this.id = id;}
    getTagName() {return this.tagName;}
    setTagName(tagName : string) {this.tagName = tagName;}

}
