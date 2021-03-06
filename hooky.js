 "use strict";
var AlfredNode = require('alfred-workflow-nodejs');
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
workflow.setName("hooky-alfred-workflow");

var HookyService = require('./hooky.service');

 (function main() {
     let hookyService = new HookyService();
    actionHandler.onAction("getHooks", function() {
        let Item = AlfredNode.Item;
        let items = hookyService.getHookyItems();
        items.forEach(repo => {
                let item = new Item({
                    title: repo.title,
                    subtitle: getItemSubtitle(repo),
                    arg: repo.title,
                    valid: !repo.valid,
                    icon: repo.valid ? "success.png" : "warning.png",
                });
                workflow.addItem(item);
            });
        workflow.feedback();
    });

     actionHandler.onAction("setupRepoHooks", function(query) {
         let result = hookyService.hookyRepo(query);
         if(result.missingHooks.length === 0) {
             console.log(result.missingHooks.join(" ") + " hook/s were set!");
         } else {
             console.log("Problem setting hook/s: " + result.missingHooks.join(" "));
         }
     });

     actionHandler.onAction("setupAllHooks", function() {
         let results = hookyService.hookyAll();
         if(results.every(r => !r.error)) {
             console.log("All hooks set!");
         } else {
             console.log("Problem setting hooks!");
         }
     });

     function getItemSubtitle(repo) {
         if(repo.valid) return "";
         let missingText = repo.missingHooks.length === 1 ? " is missing" : " are missing";
         return repo.missingHooks.join(' and ') + missingText;
     }
    AlfredNode.run();
})();