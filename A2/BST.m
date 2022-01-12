% a binary search tree (unbalanced)
classdef BST < handle

    properties
        root=nan;
    end

    methods

        % add a node to the BST
        % input: node value(positive integer)
        function insert(obj, key)
            n=Node(key,2);
            if isequaln(obj.root, nan)
                obj.root = n;
                return;
            end
            prev=nan;
            temp=obj.root;
            while isa(temp, 'Node') 
                if temp.value > key
                    prev=temp;
                    temp=temp.pointers{1};
                elseif temp.value<key
                    prev=temp;
                    temp=temp.pointers{2};
                end
            end
            if  prev.value>key
                prev.pointers{1}=n;
            else 
                prev.pointers{2}=n;
            end
        end
        
        % search for a certain value in the BST
        % input: a node (default is the root node), a postive integer value
        % output: 0 or 1 (0 for non-existence, 1 for existence)
        function res = search(obj, node, key)
            if isa(node, 'Node') 
                if node.value==key
                    res=1;
                    return;
                end
            else
                res=0;
                return;
            end
            if node.value<key
                res=obj.search(node.pointers{2},key);
                return;
            end
            res=obj.search(node.pointers{1},key);
        end
        
        % a helper function for printing the data
        function inorder(obj, node)
            %Inorder traversal function.
            %This gives data in sorted order.
            if ~isa(node, 'Node')
                return;
            end
            obj.inorder(node.pointers{1});
            fprintf('%d ',node.value);
            obj.inorder(node.pointers{2});
        end
    end
end