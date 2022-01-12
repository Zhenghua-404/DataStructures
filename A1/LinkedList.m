classdef LinkedList < handle

    properties
        headNode
        endNode
    end

    methods

        % initialize head node and end node to NaN
        function obj = LinkedList
            obj.headNode = NaN;
            obj.endNode = NaN;
        end
        
        % add a node at the end of the linked list
        % input: a string
        function add(obj, value)
            % create a node
            a = Node(value);
            % if the head node is NaN, update head and end nodes
            if isnan(obj.headNode)
                obj.headNode = a;
                obj.endNode = a;
            else
                % head node is not NaN, only update end node
                obj.endNode.next = a;
                obj.endNode = a;
            end
            fprintf('Value added: %s\n', value);
        end
        
        % search for a node of a certain value in the linked list
        % input: a string value
        % output: 0 or 1 (0 for non-existence, 1 for existence)
        function result = search(obj, value)
            cur = obj.headNode;
            % iterate through the linked list
            while isa(cur,'Node')
                if strcmp(cur.value, value)
                    fprintf('Value check: Existed: %s\n', value);
                    result = 1;
                    return;
                end
                cur = cur.next;
            end
            fprintf('Value check: Not Existed: %s\n', value);
            result = 0;
            return;
        end
    end
end


