 "use strict";
var AlfredNode = require('alfred-workflow-nodejs');
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
workflow.setName("example-alfred-workflow-nodejs");
var HookyService = require('./hooky.service');

(function main() {
    actionHandler.onAction("getHooks", function(query) {
        let hookyService = new HookyService();
        let Item = AlfredNode.Item;
        hookyService.getHookyItems()
            .forEach(repo => {
                let item = new Item({
                    title: repo,
                    subtitle: "Bla Bla",
                    arg: "Feedback A",
                });
                workflow.addItem(item);
            });
        workflow.feedback();
    });
    AlfredNode.run();
})();