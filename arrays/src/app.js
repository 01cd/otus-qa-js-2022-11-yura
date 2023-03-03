export const getScore = function sum(obj) {
    var sum = 0;
    Object.keys(obj).forEach(function(key){
        sum=sum+obj[key]
    })
    return sum
}
