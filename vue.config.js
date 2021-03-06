module.exports = {
  devServer: {
    open: true,
    // host: "127.0.0.1",
    host: "localhost",

    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      // 配置跨域
      "/api": {
        target: "https://ele-interface.herokuapp.com/api/",
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
