module.exports = {
    config: {
        dist: {
            files: [{
              expand: true,
              // dot: true,
              cwd: '<%= product.dist %>',
              dest: '<%= product.dist %>',
              src: [
                'css/{,*/,*/*/}*.css'
              ]
            }]
        }
    }
}