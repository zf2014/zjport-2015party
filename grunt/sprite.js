// module.exports = {
//     config: {
//         app: {
//             files: [
//                 {
//                     src: '<%= product.app %>/images/testSprites/sprite/*.png',
//                     dest: '<%= product.app %>/images/testSprites/sprite.png',
//                     destCss: '<%= product.app %>/stylus/testSprites/sprites.styl'
//                 }
//             ]
//         },

//         app2: {
//             files: [
//                 {
//                     src: '<%= product.app %>/images/testSprites/sprite/*.png',
//                     dest: '<%= product.app %>/images/testSprites/sprite.png',
//                     destCss: '<%= product.app %>/stylus/testSprites/sprites2.styl'
//                 }
//             ]
//         }
//     }
// }



module.exports = Config;


function Config(sprites){
    var obj = {};

    sprites.forEach(function(item){
        obj[item] = {
            src: '<%= product.app %>/images/'+item+'/sprite/*.png',
            dest: '<%= product.app %>/images/'+item+'/sprite.png',
            destCss: '<%= product.app %>/stylus/'+item+'/sprites.styl'

        }
    });

    return obj;

}