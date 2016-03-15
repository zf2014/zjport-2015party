module.exports = {
    config: {
        dist: {
            files: [
            {
              expand: true,
              // dot: true,
              cwd: '<%= product.app %>/images',
              dest: '<%= product.dist %>/images',
              src: [
                 '*/**'
                ,'!*/sprite/**'
              ]
              // ,
              // filter:function(filePath){
              //   console.log(filePath)
              //   return true;
              // }
            },
            {
              expand: true,
              // dot: true,
              cwd: '<%= product.app %>',
              dest: '<%= product.dist %>',
              src: [
                'view/**'
                ,'json/**'
                ,'music/**'
                ,'css/**'
                ,'scripts/**'
              ]
            }]
        }
    }
}