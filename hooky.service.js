"use strict";
var config = require('./hooky.config.json');
var HookyService = require('./hooky.service');
var fs = require('fs'),
    path = require('path');

module.exports = function HookyService() {

    this.getHookyItems = () => {
        return getDirectories(config.reposPath)
            .filter(notExcludedRepo && repoValid);
    };

    function notExcludedRepo(repo) {
        return config.excludedRepos.indexOf(repo) > -1;
    }

    function repoValid(repo) {
       return repoIsAGitRepo(repo) && repoHasValidHooks(repo);
    }

    function repoIsAGitRepo(repo) {
        let gitPath = path.join(path.join(config.reposPath, repo), '.git');
        return isDirSync(gitPath);
    }

    function isDirSync(aPath) {
        try {
            return fs.statSync(aPath).isDirectory();
        } catch (e) {
            if (e.code === 'ENOENT') {
                return false;
            } else {
                throw e;
            }
        }
    }

    function repoHasValidHooks(repo) {
        try {
            let hookPath = path.join(path.join(config.reposPath, repo), '.git/hooks/');
            return config.hooks
                .map(hook => path.join(hookPath, hook))
                .every(fsExistsSync);
        } catch (e) {
            if (e.code === 'ENOENT') {
                return false;
            } else {
                throw e;
            }
        }
    }

    function fsExistsSync(file) {
        try {
            fs.accessSync(file);
            return true;
        } catch (e) {
            return false;
        }
    }

	function getDirectories(srcpath) {
	  return fs.readdirSync(srcpath).filter(function(file) {
	    return fs.statSync(path.join(srcpath, file)).isDirectory();
	  });
	}
};