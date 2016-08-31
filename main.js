var AlfredNode = require('alfred-workflow-nodejs');
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
workflow.setName("example-alfred-workflow-nodejs");
var Item = AlfredNode.Item;

(function main() {
    // --- simple example of using action handler
    actionHandler.onAction("action1", function(query) {
        var Item = AlfredNode.Item;
        var item1 = new Item({
            title: query,
            arg: query,
            subtitle: "you are querying " + query,
            valid: true
        });
        
        workflow.addItem(item1);
        // generate feedbacks
        workflow.feedback();
    });

    // --- example of menu handler
    // handle action "menuExample"
    actionHandler.onAction("menuExample", function(query) {
        var Item = AlfredNode.Item;
        var item1 = new Item({
            title: "Feedback A",
            subtitle: "Press tab to get menu items",
            arg: "Feedback A",
            hasSubItems: true, // set this to true to tell that this feedback has sub Items
            valid: true,
            data: {alias: "X"} // we can set data to item to use later to build sub items
        });
        
        workflow.addItem(item1);

        var item2 = new Item({
            title: "Feedback B",
            subtitle: "Press tab to get menu items",
            arg: "Feedback B",
            hasSubItems: true, // set this to true to tell that this feedback has sub Items
            valid: true,
            data: {alias: "Y"} // we can set data to item to use later to build sub items
        });
        
        workflow.addItem(item2);

        // generate feedbacks
        workflow.feedback();
    });

    // handle menu item select of action "menuExample"
    actionHandler.onMenuItemSelected("menuExample", function(query, title, data) {
        var Item = AlfredNode.Item;
        var item1 = new Item({
            title: "Item 1 of " + title,
            arg: "item 1 of " + title + " which has alias " + data.alias,
            subtitle: data.alias,
            valid: true
        });

        var item2 = new Item({
            title: "Item 2 of " + title,
            arg: "item 2 of " + title + " which has alias " + data.alias,
            subtitle: data.alias,
            valid: true
        });
        
        workflow.addItem(item1);
        workflow.addItem(item2);
        // generate feedbacks
        workflow.feedback();
    });

    AlfredNode.run();
})();