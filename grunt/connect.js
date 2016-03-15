module.exports = Config;


function Config(c){
    var isExisted,
        self = this
    ;
    this.options = {
        port: 9010,
        open: true,
        livereload: 30010,
        hostname: '192.168.180.54'
    };

    this.proxies = [
        // {
        //     context: "/cgoWeixin",
        //     host: "192.168.180.35",
        //     port: 80
        // },
        // {
        //     context: "/cgoWeixin",
        //     host: "192.168.3.22",
        //     port: 26001
        // },

        {
            context: "/cgoWeixin",
            host: "weixin.chinabeston.com",
            port: 80
        }
    ];

    this.livereload = {
        options: {
            middleware: function(connect) {
                var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];
                middlewares.push(connect.static(c.app))
                // middlewares.push(connect.static(c.dist))
                return middlewares;
            }
        }
    }

}