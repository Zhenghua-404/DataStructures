% Node in Linked-list, Skip-list and BST
classdef Node < handle

    properties

        % value of current node
        value
        % pointers to other nodes
        pointers
        % number of pointers to other nodes
        % in Linkedlist, it's 1
        % in BST, it's 2
        % in Skip-list, it's the number of levels of the node
        numofp

    end

    methods
        % Node Constructor ti initialize value, number of pointers and
        % the pointers
        % input: node value and number of pointers
        % output: a node
        function obj = Node(key, nop)
            obj.value = key;
            obj.numofp = nop;
            obj.pointers = cell(1,nop);
        end
    end
end