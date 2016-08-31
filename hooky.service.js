"use strict";
var config = require('./hooky.config.json');
var HookyFileService = require('./hooky.file.service');
var path = require('path');

module.exports = function HookyService() {

    let hookyFileService = new HookyFileService();

    this.getHookyItems = () => {
        return hookyFileService.getDirectories(config.reposPath)
            .filter(notExcludedRepo)
            .map(mapRepo);
    };

    this.hookyRepo = (repo) => {
        let missingHooks = getMissingHooks(repo);
        missingHooks.forEach(hook => setHook(repo, hook));
        return getMissingHooks(repo);
    };

    function setHook(repo, hook) {
        let hooksPathInRepo = getHooksPath(repo);
        let targetHooksPath = config.hooksPath;
        hookyFileService.symlink(path.join(targetHooksPath, hook), path.join(hooksPathInRepo, hook));
    }

    function mapRepo(repo) {
        if(repoValid(repo)) {
            return {
                title: repo,
                valid: true,
                missingHooks: [],
            };
        }

        return {
            title: repo,
            valid: false,
            missingHooks: getMissingHooks(repo),
        };
    }

    function getMissingHooks(repo) {
        return config.hooks.filter(hook => !hookyFileService.fsExistsSync(path.join(getHooksPath(repo), hook)));
    }

    function notExcludedRepo(repo) {
        return config.excludedRepos.indexOf(repo) === -1;
    }

    function repoValid(repo) {
       return repoIsAGitRepo(repo) && repoHasValidHooks(repo);
    }

    function repoIsAGitRepo(repo) {
        let gitPath = path.join(path.join(config.reposPath, repo), '.git');
        return hookyFileService.isDirSync(gitPath);
    }

    var getHooksPath = function (repo) {
        return path.join(path.join(config.reposPath, repo), '.git/hooks/');
    };

    function repoHasValidHooks(repo) {
        try {
            return config.hooks
                .map(hook => path.join(getHooksPath(repo), hook))
                .every(hookyFileService.fsExistsSync);
        } catch (e) {
            if (e.code === 'ENOENT') {
                return false;
            } else {
                throw e;
            }
        }
    }
};