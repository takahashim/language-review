module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Java用プロジェクト構成向け設定
    opt: {
      client: {
        "jsMain": "lib/js",
        "tsMain": "lib",
        "tsTypings": "typings",
        "tsTest": "spec"
      }
    },

    ts: {
      default: {
        tsconfig: {
          tsconfig: "./tsconfig.json",
          updateFiles:false
        }
      }
    },
    tsconfig: {
        main: {
        }
    },
    tslint: {
      options: {
        configuration: grunt.file.readJSON("tslint.json")
      },
      files: {
        src: [
          '<%= opt.client.tsMain %>/**/*.ts',
          '!<%= opt.client.tsMain %>/typings/**/*.ts',
        ]
      }
    },
    bower: {
      install: {
        options: {
          targetDir: 'bower-task',
          layout: 'byType', // exportsOverride の左辺に従って分類
          install: true,
          verbose: true, // ログの詳細を出すかどうか
          cleanTargetDir: true,
          cleanBowerDir: false
        }
      }
    },
    dtsm: {
      client: {
        options: {
          // optional: specify config file
          confog: './dtsm.json'
        }
      }
    },
    clean: {
      clientScript: {
        src: [
          // client
          '<%= opt.client.tsMain %>/**/*.js',
          '<%= opt.client.tsMain %>/**/*.d.ts',
          '<%= opt.client.tsMain %>/**/*.js.map',
          '!<%= opt.client.tsMain %>/typings/**/*.d.ts',
          // test
          '<%= opt.client.tsTest %>/**/*.js',
          '<%= opt.client.tsTest %>/**/*.d.ts',
          '<%= opt.client.tsTest %>/**/*.js.map'
        ]
      },
      dtsm: {
        src: [
          // tsd installed
          "<%= opt.client.tsTypings %>"
        ]
      }
    },
    exec: {
      test: {
        command: 'apm test'
      }
    }
  });

  grunt.registerTask(
    'setup',
    "プロジェクトの初期セットアップを行う。",
    ['clean', 'dtsm']);

  grunt.registerTask(
    'default',
    "必要なコンパイルを行いAtomプラグインとして実行できるようにする。",
    ['clean:clientScript', 'tsconfig', 'ts'/*, 'tslint' */]);

  grunt.registerTask(
    'test',
    "テストを実行する。",
    ['default', 'exec:test']);

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
