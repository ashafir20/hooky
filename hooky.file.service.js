"use strict";
var fs = require('fs');
var path = require('path');

module.exports = function HookyFileService() {
    this.isDirSync = function(aPath) {
        try {
            return fs.statSync(aPath).isDirectory();
        } catch (e) {
            if (e.code === 'ENOENT') {
                return false;
            } else {
                throw e;
            }
        }
    };

    this.symlink = function(target, linkedPath) {
        fs.symlinkSync(target, linkedPath);
    };

    this.fsExistsSync = function(file) {
        try {
            fs.accessSync(file);
            return true;
        } catch (e) {
            return false;
        }
    };

    this.getDirectories = function(srcpath) {
        return fs.readdirSync(srcpath).filter(function(file) {
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    }
};

