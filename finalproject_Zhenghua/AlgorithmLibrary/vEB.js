// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY David Galles ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco


// 2021.Dec.3
// implemented by Zhenghua Chen
// reference: https://iq.opengenus.org/van-emde-boas-tree/

// Constants.

vEB.LINK_COLOR = "#007700";
vEB.HIGHLIGHT_CIRCLE_COLOR = "#007700";
vEB.FOREGROUND_COLOR = "#007700";
vEB.BACKGROUND_COLOR = "#EEFFEE";
vEB.PRINT_COLOR = vEB.FOREGROUND_COLOR;

vEB.WIDTH_DELTA  = 50;
vEB.HEIGHT_DELTA = 50;
vEB.STARTING_Y = 50;


vEB.FIRST_PRINT_POS_X  = 50;
vEB.PRINT_VERTICAL_GAP  = 20;
vEB.PRINT_HORIZONTAL_GAP = 50;



function vEB(am, w, h)
{
    this.init(am, w, h);
}

vEB.prototype = new Algorithm();
vEB.prototype.constructor = vEB;
vEB.superclass = Algorithm.prototype;

// initialization of the animation controls and class properties
// input: am= canvas; w= canvas width; h= canvas height
vEB.prototype.init = function(am, w, h)
{
    var sc = vEB.superclass;
    this.startingX =  w / 2;
    this.first_print_pos_y  = h - 2 * vEB.PRINT_VERTICAL_GAP;
    this.print_max  = w - 10;

    var fn = sc.init;
    fn.call(this,am);
    this.addControls();
    this.nextIndex = 0;
    this.commands = [];
    this.universe_size = null;
    // create a label: left top words description of the web page
    this.cmd("CreateLabel", 0, "", 20, 10, 0);
    // clarify the input requirement at the beginning
    this.cmd("SetText", 0, "Firstly, input a positive integer in size to construct a vEB tree with value range [0, 2^(2^k)-1]");
    this.nextIndex = 1;
    this.animationManager.StartNewAnimation(this.commands);
    this.animationManager.skipForward();
    this.animationManager.clearHistory();

}

// adding animation controls and callbacks
vEB.prototype.addControls =  function()
{
    this.sizeField = addControlToAlgorithmBar("Text", "");
    this.sizeField.onkeydown = this.returnSubmit(this.sizeField,  this.universe_sizeCallback.bind(this), 4);
    this.sizeButton = addControlToAlgorithmBar("Button", "Size");
    this.sizeButton.onclick = this.universe_sizeCallback.bind(this);
    this.insertField = addControlToAlgorithmBar("Text", "");
    this.insertField.onkeydown = this.returnSubmit(this.insertField,  this.insertCallback.bind(this), 4);
    this.insertButton = addControlToAlgorithmBar("Button", "Insert");
    this.insertButton.onclick = this.insertCallback.bind(this);
    this.deleteField = addControlToAlgorithmBar("Text", "");
    this.deleteField.onkeydown = this.returnSubmit(this.deleteField,  this.deleteCallback.bind(this), 4);
    this.deleteButton = addControlToAlgorithmBar("Button", "Delete");
    this.deleteButton.onclick = this.deleteCallback.bind(this);
    this.findField = addControlToAlgorithmBar("Text", "");
    this.findField.onkeydown = this.returnSubmit(this.findField,  this.findCallback.bind(this), 4);
    this.findButton = addControlToAlgorithmBar("Button", "Find");
    this.findButton.onclick = this.findCallback.bind(this);
    this.successorField = addControlToAlgorithmBar("Text", "");
    this.successorField.onkeydown = this.returnSubmit(this.successorField,  this.successorCallback.bind(this), 4);
    this.successorButton = addControlToAlgorithmBar("Button", "Successor");
    this.successorButton.onclick = this.successorCallback.bind(this);
    this.predecessorField = addControlToAlgorithmBar("Text", "");
    this.predecessorField.onkeydown = this.returnSubmit(this.predecessorField,  this.successorCallback.bind(this), 4);
    this.predecessorButton = addControlToAlgorithmBar("Button", "Predecessor");
    this.predecessorButton.onclick = this.predecessorCallback.bind(this);
}

// reset the whole class
vEB.prototype.reset = function()
{
    this.nextIndex = 1;
    this.treeRoot = null;
}

// callback when hit the insertion button
vEB.prototype.insertCallback = function(event)
{
    var insertedValue = this.insertField.value;
    // Get text value
    insertedValue = this.normalizeNumber(insertedValue, 4);
    if (insertedValue != "")
    {
        // set text value back to nothing
        this.insertField.value = "";
        this.implementAction(this.insertElement.bind(this), insertedValue);
    }
}

// callback when hit the delete button
vEB.prototype.deleteCallback = function(event)
{
    var deletedValue = this.deleteField.value;
    if (deletedValue != "")
    {
        deletedValue = this.normalizeNumber(deletedValue, 4);
        this.deleteField.value = "";
        this.implementAction(this.deleteElement.bind(this),deletedValue);
    }
}

// callback when hit the find button
vEB.prototype.findCallback = function(event)
{
    var findValue;
    findValue = this.normalizeNumber(this.findField.value, 4);
    this.findField.value = "";
    this.implementAction(this.findElement.bind(this),findValue);
}

// callback when hit the successor button
vEB.prototype.successorCallback = function(event)
{
    var successorValue = this.successorField.value;
    if (successorValue != "")
    {
        successorValue = this.normalizeNumber(successorValue, 4);
        this.successorField.value = "";
        this.implementAction(this.successorFind.bind(this),successorValue);
    }
}

// callback when hit the predecessor button
vEB.prototype.predecessorCallback = function(event)
{
    var predecessorValue = this.predecessorField.value;
    if (predecessorValue != "")
    {
        predecessorValue = this.normalizeNumber(predecessorValue, 4);
        this.predecessorField.value = "";
        this.implementAction(this.predecessorFind.bind(this),predecessorValue);
    }
}

// callback when hit the size button
vEB.prototype.universe_sizeCallback = function(event)
{
    var kValue = this.sizeField.value;
    if (kValue != "")
    {
        kValue = this.normalizeNumber(kValue, 4);
        this.sizeField.value = "";
        this.implementAction(this.setUniverse_size.bind(this),kValue);
        // can only assign size once!
        this.sizeField.disabled = true;
        this.sizeButton.disabled = true;
    }
}

// initialize the vEB tree given the size U
// input: universe size
vEB.prototype.setUniverse_size = function(kValue)
{
    this.universe_size=Math.pow(2, Math.pow(2, kValue));
    this.commands = new Array();
    this.cmd("SetText", 0, "Constructing tree of size "+this.universe_size);
    this.cmd("Step");
    this.constructTree(this.universe_size);
    return this.commands;
}

// establishing a root node and recursively build the tree
// input: universe size
vEB.prototype.constructTree = function(sizeValue) {

    this.treeRoot = new VEBNode(this.universe_size, this.nextIndex, "Root", this.startingX, vEB.STARTING_Y);
    this.visualizeTreeRec(null, this.treeRoot);

    this.cmd("SetText", 0, "");

    // key step to move the established tree nodes to the right position!
    this.resizeTree();
}

// recursive step for constructing the tree and visualization
// input: parent node and current node
// to be built: summary node and cluster nodes
vEB.prototype.visualizeTreeRec = function(parent, curRoot)
{
    if(curRoot!=null) {
        var NodeInfo = getInfo(curRoot);
        //visualize curRoot
        if (curRoot.type == "Root") {
            this.cmd("CreateRectangle", this.nextIndex, NodeInfo, this.startingX, vEB.STARTING_Y, vEB.HEIGHT_DELTA, vEB.WIDTH_DELTA);
        } else {
            this.cmd("CreateRectangle", this.nextIndex, NodeInfo, 100, 100, vEB.HEIGHT_DELTA, vEB.WIDTH_DELTA);
            // this.cmd("SetHighlight", curRoot.graphicID, 1);
        }
        this.cmd("SetForegroundColor", this.nextIndex, vEB.FOREGROUND_COLOR);
        this.cmd("SetBackgroundColor", this.nextIndex, vEB.BACKGROUND_COLOR);
        this.cmd("Step");
        this.nextIndex += 1;

        if(parent!=null){
            // console.log("connect "+parent.graphicID+" "+curRoot.graphicID)
            this.cmd("Connect", parent.graphicID, curRoot.graphicID, vEB.LINK_COLOR);
        }
        this.cmd("Step");
        this.visualizeTreeRec(curRoot, curRoot.summary);

        for (var i = 0; i < curRoot.clusters.length; i++) {

            this.cmd("Step");
            this.visualizeTreeRec(curRoot, curRoot.clusters[i]);
        }
    }
}

// find the successor of the given value
// input: given value
vEB.prototype.successorFind = function(successorValue){
    this.commands = [];
    this.cmd("SetText", 0, "Looking for successor of "+successorValue);
    this.highlightID = this.nextIndex++;

    var res = successor(this, this.treeRoot, successorValue);
    if(res==this.treeRoot.u){
        this.cmd("SetText", 0, "The successor doesn't exist among inserted values.");
    }else {
        this.cmd("SetText", 0, "The successor is:" + res);
    }
    this.cmd("Step");
    this.cmd("SetText", 0, "");
    return this.commands;
}

// find the predecessor of the given value
// input: given value
vEB.prototype.predecessorFind = function(predecessorValue){
    this.commands = [];
    this.cmd("SetText", 0, "Looking for predecessor of "+predecessorValue);
    this.highlightID = this.nextIndex++;

    var res = predecessor(this, this.treeRoot, predecessorValue);
    if(res==-1){
        this.cmd("SetText", 0, "The predecessor doesn't exist among inserted values.");
    }else {
        this.cmd("SetText", 0, "The predecessor is:" + res);
    }
    this.cmd("Step");
    this.cmd("SetText", 0, "");
    return this.commands;
}

// find whether or not this given value has already been inserted
// input: given value
vEB.prototype.findElement = function(findValue)
{
    this.commands = [];
    this.cmd("SetText", 0, "Looking for "+findValue);
    this.highlightID = this.nextIndex++;

    var res = find(this, this.treeRoot, findValue);
    if(res) {
        this.cmd("SetText", 0, "Found!");
    }else {
        this.cmd("SetText", 0, "Not found!");
    }
    this.cmd("Step");
    this.cmd("SetText", 0, "");
    return this.commands;
}

// insert the value
// input: value to be inserted
vEB.prototype.insertElement = function(insertedValue)
{
    this.commands = [];
    this.cmd("SetText", 0, "Inserting "+insertedValue);
    this.highlightID = this.nextIndex++;

    insert(this, this.treeRoot, insertedValue);
    this.cmd("SetText", 0, "");
    return this.commands;
}

// delete the value
// input: value to be deleted
vEB.prototype.deleteElement = function(deletedValue)
{
    this.commands = [];
    this.cmd("SetText", 0, "Deleting "+deletedValue);
    this.highlightID = this.nextIndex++;

    remove(this, this.treeRoot, deletedValue);
    this.cmd("SetText", 0, "");
    return this.commands;
}

// resize the whole tree based on the structures
vEB.prototype.resizeTree = function()
{
    var startingPoint  = this.startingX;
    this.resizeWidths(this.treeRoot);
    if (this.treeRoot != null)
    {
        if (this.treeRoot.branchWidth/2 > startingPoint)
        {
            startingPoint = this.treeRoot.branchWidth/2;
        }
        this.setNewPositions(this.treeRoot, null, startingPoint, vEB.STARTING_Y, -1);
        this.animateNewPositions(this.treeRoot);
        this.cmd("Step");
    }

}

// reset each node's position of the tree based on the parent's bandwidth and number of children
// input: current tree node, parent node, original x, original y, branch index
vEB.prototype.setNewPositions = function(tree, parent, xPosition, yPosition, branch)
{
    if (tree != null)
    {
        yPosition += 10;
        tree.y = yPosition;

        if (branch!=-1)
        {
            xPosition += parent.branchWidth/(parent.branch_no) * branch - parent.branchWidth*15/36;
        }
        tree.x = xPosition;
        // console.log("setNewPositions:"+tree.graphicID+" "+tree.x+" "+tree.y);
        this.setNewPositions(tree.summary, tree, xPosition, yPosition + vEB.HEIGHT_DELTA, 0)
        for(var i = 1; i<tree.branch_no; i++)
            this.setNewPositions(tree.clusters[i-1], tree, xPosition, yPosition + vEB.HEIGHT_DELTA, i)

    }

}

// move the nodes to their new positions
// input: root of the subtree
vEB.prototype.animateNewPositions = function(tree)
{
    if (tree != null)
    {
        this.cmd("Move", tree.graphicID, tree.x, tree.y);
        this.animateNewPositions(tree.summary)
        for(var i = 1; i<tree.branch_no; i++)
            this.animateNewPositions(tree.clusters[i-1]);
    }
}

// calculate the bandwidth of each node recursively to avoid crowding
vEB.prototype.resizeWidths = function(tree)
{
    if (tree == null)
    {
        return 0;
    }

    tree.branch_no = tree.clusters.length+1;
    tree.branchWidth = Math.max(this.resizeWidths(tree.summary), vEB.WIDTH_DELTA / tree.branch_no);
    for(var i =0; i<tree.branch_no-1; i++){
        tree.branchWidth += Math.max(this.resizeWidths(tree.clusters[i]), vEB.WIDTH_DELTA / tree.branch_no);
    }
    return tree.branchWidth;

}


// constructor of vEB tree node
// input: universe size, unique id, type of nodes ("Root", "Summary" or "Cluster"), initial x position, initial y position
function VEBNode(size, id, type, initialX, initialY) {
    this.u = size;
    this.min = size;
    this.max = -1;
    this.type = type;
    this.x = initialX;
    this.y = initialY;
    this.graphicID = id;
    this.summary = null;
    this.clusters = [];

    if (size > 2) {
        var cluster_num = Math.ceil(root(size));
        var cluster_size = Math.ceil(size/root(size))

        vEB.nodeID=id+1;
        this.summary = new VEBNode(cluster_num, vEB.nodeID, "Summary", 100, 100);

        for (var i = 0; i < cluster_num; i++) {
            vEB.nodeID += 1;
            this.clusters[i] = new VEBNode(cluster_num, vEB.nodeID, "Cluster"+i, 100, 100);
        }
    }else{
        for (var i = 0; i < cluster_num; i++) {
            this.clusters[i] = null;
        }
    }
}

// concatenate the node information together for displaying
function getInfo(tree){
    return tree.type+";"+tree.u+";"+tree.min+";"+tree.max;
}

// actual insert implementation
// input: p=vEB.prototype, tree=current tree node, k=value to be inserted
function insert(p, tree, k){

    p.cmd("SetHighlight", tree.graphicID , 1);
    p.cmd("Step");

    if(tree.min >  tree.max){
        p.cmd("SetText", 0, "The tree is empty. Insert the value as min: "+k);
        tree.min = k;
        tree.max = k;
        p.cmd("SetText", tree.graphicID, getInfo(tree));
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return;
    }

    if(k == tree.min){
        p.cmd("SetText", 0, "Already inside the tree. (min)");
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return;
    }

    if(k < tree.min){
        var temp;
        temp = tree.min;
        p.cmd("SetText", 0, "This value becomes the min of the tree. Change min to: "+k);
        tree.min = k;
        p.cmd("SetText", tree.graphicID, getInfo(tree));
        //this previous min needs to be stored some where else
        k = temp;
        p.cmd("SetText", 0, "The old min value is "+k+". Store it.");
    }

    if(k > tree.max){
        tree.max = k;
        p.cmd("SetText", 0, "This value becomes the max of the tree. Change max to: "+k);
        p.cmd("SetText", tree.graphicID, getInfo(tree));
    }

    if(tree.u == 2){
        tree.max = k;
        p.cmd("SetText", 0, "Change leaf max: "+k);
        p.cmd("Step");
        p.cmd("SetText", tree.graphicID, getInfo(tree));
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return;
    }

    p.cmd("Step");

    var i = high(tree, k);
    var j = low(tree, k);
    p.cmd("SetText", 0, "Calculate the bucket and index: "+i+", "+j);

    insert(p, tree.clusters[i], j);

    if(tree.clusters[i].max == tree.clusters[i].min){
        p.cmd("SetText", 0, "Update summary if a cluster is not empty: "+k);
        insert(p, tree.summary, i);
    }

    p.cmd("SetHighlight", tree.graphicID , 0);
}

// actual remove implementation
// input: p=vEB.prototype, tree=current tree node, k=value to be removed
function remove(p, tree, k){
    p.cmd("SetHighlight", tree.graphicID , 1);
    p.cmd("Step");

    // empty tree
    if(tree.min > tree.max){
        p.cmd("SetText", 0, "The tree is empty. Didn't find the key.");
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return;
    }

    // k is not in range
    if(k>tree.max || k<tree.min){
        p.cmd("SetText", 0, "k is not in range. key doesn't exist.");
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return;
    }

    // tree has only one node value
    if(tree.min == tree.max && k==tree.min){
        // only one value and that's key
        p.cmd("SetText", 0, "Found k is the only value. Remove "+k);
        p.cmd("Step");
        tree.min = tree.u;
        tree.max = -1;
        p.cmd("SetText", 0, "Empty the current node.");
        p.cmd("Step");
        p.cmd("SetText", tree.graphicID, getInfo(tree));
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        p.cmd("Step");
        return;
    }

    if(tree.u == 2){
        if(k == 1){
            // only (1,1), so empty the tree
            if(tree.min ==1){
                tree.min = tree.u;
                tree.max = -1;
                p.cmd("SetText", 0, "Found k is the only value (min). Remove "+k);
                p.cmd("SetText", 0, "Then empty this tree.");
                p.cmd("Step");
                p.cmd("SetText", tree.graphicID, getInfo(tree));
            }
            else if(tree.min == 0 && tree.max == 1){
                // there are 2 nodes, so remove node 1
                tree.max = 0;
                p.cmd("SetText", 0, "Found the value (max). Remove " + k);
                p.cmd("SetText", 0, "The only value left in this tree now becomes both min and max.");
                p.cmd("Step");
                p.cmd("SetText", tree.graphicID, getInfo(tree));
            }else{
                p.cmd("SetText", 0, "Value k doesn't exist.");
            }
        }else{
            // k = 0
            if(tree.max == 0){
                // only (0,0), so empty this tree
                tree.min = tree.u;
                tree.max = -1;
                p.cmd("SetText", 0, "Found k is the only value (min). Remove " + k);
                p.cmd("SetText", 0, "Then empty this tree.");
                p.cmd("Step");
                p.cmd("SetText", tree.graphicID, getInfo(tree));
            }else if(tree.max == 1 && tree.min==0){
                // 2 values exist
                tree.min = 1;
                p.cmd("SetText", 0, "Found the value (min). Remove " + k);
                p.cmd("Step");
                p.cmd("SetText", tree.graphicID, getInfo(tree));
            }else{
                p.cmd("SetText", 0, "Value k doesn't exist.");
            }
        }
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return;
    }

    if(k == tree.min) {
        // remove the min and store next as min (note that min is only stored in min field,
        // so find min value indicated by summary as next min)
        // i: first non-empty bucket
        var i = tree.summary.min;
        tree.min = index(tree, i, tree.clusters[i].min);
        p.cmd("SetText", 0, "Found k is the min value. Remove " + k);
        p.cmd("Step");
        p.cmd("SetText", 0, "Found the next min value using summary. Update min: " + tree.min);
        p.cmd("Step");
        p.cmd("SetText", tree.graphicID, getInfo(tree));

        //remove this min from anywhere else (what if result in a empty bucket?)
        p.cmd("SetText", 0, "Remove the next min from the cluster.");
        p.cmd("Step");
        remove(p, tree.clusters[i], tree.clusters[i].min);
        // if the cluster becomes empty, update summary
        if (tree.clusters[i].max = -1) {
            p.cmd("SetText", 0, "The cluster becomes empty. Remove its index from summary.");
            p.cmd("Step");
            remove(p, tree.summary, i);
        }
        p.cmd("SetHighlight", tree.graphicID , 0);
        return;
    }

    var i = high(tree, k);
    var j = low(tree, k);
    p.cmd("SetText", 0, "Calculate the bucket and index: "+i+", "+j);

    p.cmd("Step");
    p.cmd("SetText", 0, "Remove the value "+j+" from the subtree "+i);
    p.cmd("Step");
    remove(p, tree.clusters[i], j);

    // The following code are processed ONLY AFTER removing the node in the subtree...
    // if the bucket is empty,then set the i node in summary to be 0
    if(tree.clusters[i].min > tree.clusters[i].max){
        p.cmd("SetText", 0, "The bucket is empty after removal of k. Update the summary.");
        p.cmd("Step");
        remove(p, tree.summary, i);
    }

    if(k == tree.max){

        p.cmd("SetText", 0, "Found k is the max value.");
        p.cmd("Step");
        // summary is empty => tree has only one node
        if(tree.summary.min > tree.summary.max){
            tree.max = tree.min;
            p.cmd("SetText", 0, "If there is only one node (min) left in this tree, reset max to min.");
            p.cmd("Step");
            p.cmd("SetText", tree.graphicID , getInfo(tree));
        }
        else{
            i = tree.summary.max;
            tree.max = index(tree, i, tree.clusters[i].max);
            p.cmd("SetText", 0, "Removed the max value. Update the new max: " + tree.max);
            p.cmd("Step");
            p.cmd("SetText", tree.graphicID , getInfo(tree));
        }
    }
    p.cmd("SetHighlight", tree.graphicID , 0);
    p.cmd("Step");
    return;
}


// actual find implementation
// input: p=vEB.prototype, tree=current tree node, k=value to be found
// output: true or false
function find(p, tree, k){

    p.cmd("SetHighlight", tree.graphicID , 1);
    p.cmd("Step");

    //empty tree
    if(tree.min>tree.max){
        p.cmd("SetText", 0, "Empty Tree. Pass.");
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return false;
    }

    if(k < tree.min || k > tree.max) {
        p.cmd("SetText", 0, "Not in range. Pass.");
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID, 0);
        return false;
    }

    if(k == tree.min || k == tree.max){
        p.cmd("SetText", 0, "Equals to min/max value.");
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return true;
    }

    if (tree.u <=2){
        if(tree.min == k || tree.max == k){
            p.cmd("SetText", 0, "In leaf node.");
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID , 0);
            return true;
        }else{
            p.cmd("SetText", 0, "Read through all buckets.");
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID , 0);
            return false;
        }
    }else {
        // find the bucket and index
        var i = high(tree, k);
        var j = low(tree, k);
        p.cmd("SetText", 0, "Calculate the bucket and index: "+i+", "+j);
        p.cmd("Step");
        var res = find(p, tree.clusters[i], j);
        if(res){
            p.cmd("SetHighlight", tree.graphicID , 0);
            return true;
        }

    }
    p.cmd("SetHighlight", tree.graphicID , 0);
    return false;
}

// actual successor implementation
// input: p=vEB.prototype, tree=current tree node, k=whose successor to be found
// output: index number of the successor
// (if k is larger than all possible values, return universe size)
function successor(p, tree, k){

    p.cmd("SetHighlight", tree.graphicID , 1);
    p.cmd("Step");

    //base case
    if(k < tree.min) {
        p.cmd("SetText", 0, "k is smaller than min, output min: " + tree.min);
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return tree.min;
    }else if(k > tree.max) {
        p.cmd("SetText", 0, "k is larger than max, output null: " + tree.u);
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return tree.u;
    }

    //if the child has only 2 values
    if(tree.u == 2){
        p.cmd("SetText", 0, "Reach a leaf node.");
        p.cmd("Step");
        // subtree size is 2
        if (k==0 && tree.max==1) {
            p.cmd("SetText", 0, "Found the max is the successor.");
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID, 0);
            // return the index of max to the previous recursion
            return 1;
        }
    }

    // find the bucket and index
    var i = high(tree, k);
    var j = low(tree, k);
    p.cmd("SetText", 0, "Calculate the bucket and index: "+i+", "+j);
    p.cmd("Step");

    if (j < tree.clusters[i].max) {
        // if successor is in the bucket i
        p.cmd("SetText", 0, "k is smaller than max, successor must be in the bucket.");
        p.cmd("Step");
        var res = successor(p, tree.clusters[i], j);
        p.cmd("SetHighlight", tree.graphicID, 0);
        return k - j + res;
    }
    // if successor is not in bucket i
    else {
        p.cmd("SetText", 0, "k is larger than max, successor must be in the next bucket.");
        p.cmd("Step");
        // find next nonempty bucket => successor(tree.summary,i)
        // take the min
        var nonemp = successor(p, tree.summary, i);
        var res = -1;
        if (tree.clusters[nonemp] != null) {
            var res = tree.clusters[nonemp].min;
            p.cmd("SetText", 0, "Found next nonempty bucket: " + nonemp);
            p.cmd("Step");
            p.cmd("SetText", 0, "Found the min inside this bucket: " + res);
            var ans = index(tree, nonemp, res);
            p.cmd("SetText", 0, "Found the successor: " + ans);
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID, 0);
            return ans;

        } else {
            p.cmd("SetText", 0, "All empty buckets. Successor doesn't exist.");
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID, 0);
            return tree.u;
        }
    }
    p.cmd("SetText", 0, "The successor doesn't exist.");
    p.cmd("Step");
    p.cmd("SetHighlight", tree.graphicID, 0);
    return tree.u;

}

// actual predecessor implementation
// input: p=vEB.prototype, tree=current tree node, k=whose predecessor to be found
// output: index number of the predecessor
// (if k is smaller than all possible values, return -1)
function predecessor(p, tree, k){

    p.cmd("SetHighlight", tree.graphicID , 1);
    p.cmd("Step");

    //base case
    if(k <= tree.min) {
        p.cmd("SetText", 0, "k is smaller than min, output null: " + -1);
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return -1;
    }else if(k > tree.max) {
        p.cmd("SetText", 0, "k is larger than max, output max: " + tree.max);
        p.cmd("Step");
        p.cmd("SetHighlight", tree.graphicID , 0);
        return tree.max;
    }
    //if the child has only 2 values
    if(tree.u == 2){
        p.cmd("SetText", 0, "Reach a leaf node.");
        p.cmd("Step");
        // subtree size is 2
        if (k==1 && tree.min==0) {
            p.cmd("SetText", 0, "Found the min is the predecessor.");
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID, 0);
            // return the index of max to the previous recursion
            return 0;
        }else{
            // return null to notify that it's still in the previous nodes
            p.cmd("SetText", 0, "No predecessor found in the leaf node. Then it must be the min of the parent!");
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID, 0);
            return -1;
        }
    }
    // find the bucket and index
    var i = high(tree, k);
    var j = low(tree, k);
    p.cmd("SetText", 0, "Calculate the bucket and index: "+i+", "+j);
    p.cmd("Step");


    if (j > tree.clusters[i].min) {
        // if predecessor is in the bucket i
        p.cmd("SetText", 0, "k is larger than min, predecessor must be in the bucket.");
        p.cmd("Step");
        var res = predecessor(p, tree.clusters[i], j);
        if(res!=-1){
            p.cmd("SetHighlight", tree.graphicID, 0);
            return k - j + res;
        }else{
            p.cmd("SetHighlight", tree.graphicID, 0);
            return tree.min;
        }
    }
    // if predecessor is not in bucket i
    else {
        p.cmd("SetText", 0, "k is smaller than min, predecessor must be in the previous bucket.");
        p.cmd("Step");

        //only the current bucket is nonempty, return min
        if(tree.summary.min==tree.summary.max) {
            p.cmd("SetText", 0, "The summary node only has one value, which means only one nonempty bucket exists.");
            p.cmd("Step");
            p.cmd("SetText", 0, "Therefore the predecessor is the tree min: "+tree.min);
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID, 0);
            return tree.min;
        }
        // find previous nonempty bucket => predecessor(tree.summary,i)
        // take the max
        var nonemp = predecessor(p, tree.summary, i);

        var res = -1;
        if (tree.clusters[nonemp] != null) {
            var res = tree.clusters[nonemp].max;
            p.cmd("SetText", 0, "Found previous nonempty bucket: " + nonemp);
            p.cmd("Step");
            p.cmd("SetText", 0, "Found the max inside this bucket: " + res);
            var ans = index(tree, nonemp, res);
            p.cmd("SetText", 0, "Found the predecessor: " + ans);
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID, 0);
            return ans;

        } else {
            p.cmd("SetText", 0, "There's no other nonempty bucket exists. Only the min satisfies.");
            p.cmd("Step");
            p.cmd("SetHighlight", tree.graphicID, 0);
            return tree.min;
            // p.cmd("SetText", 0, "All empty buckets. Predecessor doesn't exist.");
            // p.cmd("Step");
            // p.cmd("SetHighlight", tree.graphicID, 0);
            // return -1;
        }
    }

    p.cmd("SetText", 0, "The predecessor doesn't exist.");
    p.cmd("Step");
    p.cmd("SetHighlight", tree.graphicID, 0);
    return -1;

}

// helper function calculating the sqrt of universe size
function root(n)
{
    // round down
    return Math.sqrt(n);
}

// helper function to return cluster numbers
// in which key is present
function high(tree, k)
{
    var x = Math.ceil(root(tree.u));
    return Math.floor(k/x);
}

// helper function to return position of x in cluster
function low(tree, k)
{
    var x = Math.ceil(root(tree.u));
    return k % x;
}

// helper function to return the index from
// cluster number and position
function index(tree, cluster, position)
{
    return cluster * Math.floor(root(tree.u)) + position;
}


vEB.prototype.disableUI = function(event)
{
    // this.sizeField.disabled = true;
    // this.sizeButton.disabled = true;
    this.insertField.disabled = true;
    this.insertButton.disabled = true;
    this.deleteField.disabled = true;
    this.deleteButton.disabled = true;
    this.findField.disabled = true;
    this.findButton.disabled = true;
    this.successorField.disabled = true;
    this.successorButton.disabled = true;
    this.predecessorField.disabled = true;
    this.predecessorButton.disabled = true;

}

vEB.prototype.enableUI = function(event)
{
    // this.sizeField.disabled = false;
    // this.sizeButton.disabled = false;
    this.insertField.disabled = false;
    this.insertButton.disabled = false;
    this.deleteField.disabled = false;
    this.deleteButton.disabled = false;
    this.findField.disabled = false;
    this.findButton.disabled = false;
    this.successorField.disabled = false;
    this.successorButton.disabled = false;
    this.predecessorField.disabled = false;
    this.predecessorButton.disabled = false;
}


var currentAlg;

function init()
{
    var animManag = initCanvas();
    currentAlg = new vEB(animManag, canvas.width, canvas.height);

}