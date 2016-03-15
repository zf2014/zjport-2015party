module.exports = {
    config: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '<%= product.dist %>/*',
              '!<%= product.dist %>/.svn'
            ]
            // ,
            // filter:function(filePath){
            //   console.log(filePath)
            //   return true;
            // }
          }
        ]
      },
    }
}