% a sorted Linked list
classdef LinkedList < handle

    properties
        % the head node of linked list
        headNode
    end

    methods

        % initialize head node to NaN
        function obj = LinkedList
            obj.headNode = NaN;
        end
        
        
        % add a node to the sorted linked list
        % input: a positive integer
        function insert(obj, value)
            % create a node with value and 1 pointer to next node
            newNode = Node(value,1);
            % special case for the head node
            if ~isa(obj.headNode, 'Node') || (obj.headNode.value >= newNode.value)
                newNode.pointers{1} = obj.headNode;
                obj.headNode = newNode;
            else
                % compare through the list and insert
                cur = obj.headNode;
                while isa(cur.pointers{1},'Node') && (cur.pointers{1}.value < newNode.value)
                    cur = cur.pointers{1};
                end
                % if reach the end of list or hit a larger key, insert
                newNode.pointers{1} = cur.pointers{1};
                cur.pointers{1} = newNode;
            end
        end
        
        % search for a certain value in the linked list
        % input: a positive integer 
        % output: 0 or 1 (0 for non-existence, 1 for existence)
        function result = search(obj, value)
            cur = obj.headNode;
            % iterate through the linked list
            while isa(cur,'Node')
                if cur.value==value
                    result = 1;
                    return;
                end
                cur = cur.pointers{1};
            end
            result = 0;
            return;
        end

        function tolist = displayList(obj,size)
            cur=obj.headNode;
            tolist=zeros(1,size);
            i=1;
            while isa(cur,'Node')
                tolist(i)=cur.value;
                cur = cur.pointers{1};
                i=i+1;
            end
        end
    end
end


