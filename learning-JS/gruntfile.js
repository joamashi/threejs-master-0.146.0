"Grunt"

'프로젝트 자동화를 위한 task(작업) 단위로 실행되는 커멘드라인(CLI) 빌드 도구. 자동 빌드 시스템'

// npm install -g grunt-cli

// cd grunt-template-thml

// npm install

// grunt serve



include "head.html"
include "other/lorem.html"


// *****************************************************************************


"전자동 템플릿 bash 파일 만들기"
// tem.sh template-1


// *****************************************************************************


"Gruntfile.js" 
// 파일에 사용되는 프로젝트의 구조

module.exports = function (grunt) {
  
  'use strict';
  
  
  // 작업시간 표시
  require('time-grunt')(grunt); // 작업시간 표시
  require('jit-grunt')(grunt); // 자동으로 grunt 태스크 로드. grunt.loadNpmTacks 생략
  
  
  var config = {
    src: 'SourceCode', // 소스파일이 있는 폴더
    dest: 'FinishCode', // 빌드 후 완료파일이 있는 폴더
    bower: 'bower-components' // bower 플러그인이 설치되는 폴더
  }
  
  
  
  // 작업을 설정
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    config: config, // <%= config.src %>
    
    jade: {
      dist: {
        options: {
          pretty: true
        },
        files: [{
          expand: true, // 동적 기술법 활성화
          cwd: '<%= config.src %>/jade/docs/', // src 패턴의 기준 폴더
          src: ['**/*.jade'], // 비교에 사용할 패턴 목록
          dest: '<%= config.dest %>', // 목적 경로의 접두사(사실상 폴더명)
          ext: '.html' // dest의 파일들의 확장자
        }]
      }
    },
    
    includes: {
      dist: {
        expand: true,
        cwd: '<%= config.src %>/docs/html/',
        src: ['**/*.html'],
        dest: '<%= config.dest %>',
        options: {
          flatten: true,
          // debug: true,
          includePath: '<%= config.src %>/docs/include/'
        }
      }
    },
    
    htmlhint: { // html 구문검사
      options: {
        htmlhintrc: 'grunt/.htmlhintrc'
      },
      dist: ['<%= config.dest %>/**/*.html']
    },
    
    // ------------------------------------------------------------------------
    
    sass: {
      options: {
        sourceComments: false,
        sourceMap: true,
        outputStyle: 'expanded' // nested, expanded, compact, compressed
      },
      dist: {
        expand: true,
        cwd: '<%= config.src %>/scss/',
        src: ['**/*.{sass,scss}'],
        dest: '<%= config.dest %>/css',
        ext: '.css'
      }
    },
    
    postcss: {
      options {
        processors: [
          require('autorefixer')({
            browsers: [
              'Android 2.3',
              'Android >= 4',
              'Chrome >= 20',
              'Firefox >= 24',
              'Explorer >= 8',
              'iOS >= 6',
              'Opera >= 12',
              'Safari >= 6'
            ]
          })
        ]
      },
      dist: {
        src: '<%= config.dest %>/css/*.css'
      }
    },
    
    csscomb: {
      options: {
        config: 'grunt/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: '<%= config.dest %>/css/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= config.dest %>/css/'
      }
    },
    
    cssmin: {
      options: {
        compatibility: 'ie9',
        keepSpecialComments: '*',
        sourceMap: true,
        advanced: false
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.dest %>/css',
          src: ['*.css', '!*.min.css'],
          dest: '<%= config.dest %>/css',
          ext: '.min.css'
        }]
      }
    },
    
    // ------------------------------------------------------------------------
    
    jshint: {
      options: {
        jshintrc: 'grunt/.jshintrc',
        reporter: require('jshint-stylish')
      },
      grunt: {
        src: ['Gruntfile.js']
      },
      dist: {
        src: '<%= config.src %>/js/site/*.js'
      }
    },
    
    concat: { // 병합
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %>  - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      jquery: {
        src: [
          '<%= config.bower %>/jquery/dist/jquery.js',
          '<%= config.bower %>/jquery-migrate/jquery-migrate.js'
        ],
        dest: '<%= config.dest %>/js/jqeury.js'
      },
      plugins: {
        src: [
          '<%= config.bower %>/bootstrap/dist/js/bootstrap.min.js',
          '<%= config.bower %>/jquery-ui/jquery-ui.min.js'
        ],
        dest: '<%= config.dest %>/js/plugins.js'
      },
      site: {
        src: '<%= config.src %>/js/site/*.js',
        dest: '<%= config.dest %>/js/site.js'
      }
    },
    
    uglify: { // 압축
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %>  - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      jquery: {
        src: '<%= concat.jquery.dest %>',
        dest: '<%= config.dest %>/js/jqeury.min.js'
      },
      plugins: {
        src: '<%= concat.plugins.dest %>',
        dest: '<%= config.dest %>/js/plugins.min.js'
      },
      site: {
        src: '<%= concat.site.dest %>',
        dest: '<%= config.dest %>/js/site.min.js'
      }
    },
    
    // ------------------------------------------------------------------------
    
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/images/',
          src: '**/*.{png,jpeg,jpg,gif}',
          dest: '<%= config.dest %>/images'
        }]
      }
    },
    
    clean: {
      dist: {
        files: [{
          dot: true,
          nonull: true,
          src: ['<%= config.dest %>']
        }]
      }
    },
    
    copy: { // 폴더 및 파일 복사
      dist: {
        files: [
          // fonts
          {
            expand: true,
            cwd: '<%= config.src %>/fonts/',
            src: '**',
            dest: '<%= config.dest %>/fonts/'
          },
          // bootsrap fonts
          {
            expand: true,
            cwd: '<%= config.bower %>/bootstrap/dist/fonts/',
            src: '**',
            dest: '<%= config.dest %>/fonts/'
          },
          // bootsrap css
          {
            expand: true,
            cwd: '<%= config.bower %>/bootstrap/dist/css/',
            src: '**',
            dest: '<%= config.dest %>/css/'
          },
        ]
      }
    },
    
    // ------------------------------------------------------------------------    
    
    concurrent: { // 병렬로 작업
      options: {
        logConcurrentOutput: true
      },
      dist: ['copy', 'imagemin']
    },
    
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    
    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:grunt']
      },
      jade: {
        files: ['<%= config.src %>/jade/**/*.jade'],
        tasks: ['jade', 'htmlhint']
      },
      sass: {
        files: ['<%= config.src %>/scss/**/*.{sass,scss}'],
        tasks: ['sass', 'postcss', 'csscomb', 'cssmin']
      },
      jsnt: {
        files: ['<%= config.src %>/js/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify']
      },
      img: {
        files: ['<%= config.src %>/images/**/*.{gif,jpeg,jpg,png}'],
        tasks: ['newer:imagemin']
      },
      fonts: {
        files: ['<%= config.src %>/fonts/**/*'],
        tasks: ['newer:copy']
      }
    },
    
    connect: {
      server: {
        options: {
          port: 9000,
          hostname: 'loadhost',
          livereload: 35729,
          base: '<%= config.dest %>',
          open: 'http://<%= connect.server.options.hostname %>:<%= connect.server.options.port %>/index.html'
        }
      }
    }
    
  });
  
  
  // 작업시간 표시. 커맨드창에 빌드시간이 기록
  require('time-grunt')(grunt, function (stats, done) {
    uploadReport(stats); // 원하는대로 통계를 가져옴
    done(); // 종료할 때 그런트에 알려줌
  });
    
  
  
  
  
  
    
  // 자동으로 grunt 태스크를 로드
  
  
  // 작업을 로드
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  
  
  grunt.loadNpmTasks('grunt-concurrent');
  
  
  // 작업을 등록
  
  grunt.registerTask('default', ['concurrent:target']);
  
  
  grunt.registerTack('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['connect', 'watch'])
    }
    grunt.task.run(['default', 'connect', 'watch'])
  });
  
  
  
  // html task
  grunt.registerTack('html', ['jade', 'htmlhint'])
  
  
  // css task
  grunt.registerTack('css', ['sass', 'postcss', 'csscomb', 'cssmin'])
  
  
  // javascript task
  grunt.registerTack('jsnt', ['jshint', 'concat', 'uglify'])
  
  
  grunt.registerTack('default', ['clean', 'html', 'css', 'jsnt', 'concurrent'])
}














































