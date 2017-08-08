module.exports = function (grunt) {

  grunt.initConfig({
    watch: {
      jade: {
        files: ['views/**'],//监听文件的目录
        options: {
          livereload: true//当监听的文件出现改动时，重新启动grunt服务
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
        options: {
          livereload: true
        }
      }
    },
    nodemon: {
      dev: {//开发环境
        options: {
          file: 'app.js',//当前的入口文件
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,//如果有大批量的文件改动时，会等1s后来重新启动服务
          env: {
            PORT: 3008
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch');//监听js文件
  grunt.loadNpmTasks('grunt-nodemon');//监听入口文件app.js
  grunt.loadNpmTasks('grunt-concurrent');//针对慢任务(sass、less、coffee文件的编译时间)，可以优化慢任务的构建时间,同时可以跑多个阻塞的任务(如nodemon、watch)

  grunt.option('force', true);//便于开发的时候不会因为语法、警告而导致grunt服务的整个中断

  grunt.registerTask('default', ['concurrent']);//注册默认任务


}