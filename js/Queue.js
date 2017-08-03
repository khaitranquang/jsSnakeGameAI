/**
 * Created by Tran Quang Khai on 8/3/2017.
 * Queue - Data Structure
 */
function Queue() {
    var data = [];
    
    this.isEmpty = function () {
        return data.length == 0;
    }
    
    this.clear = function () {
        return data.length = 0;
    }
    
    this.getLength = function () {
        return data.length;
    }
    
    this.enqueue = function (item) {
        data.push(item);
    }
    
    this.dequeue = function (item) {
        if(data.length == 0) return undefined;
        return data.shift();
    }

    this.peek = function (item) {
        return (data.length > 0 ? data[0] : undefined);
    }
}