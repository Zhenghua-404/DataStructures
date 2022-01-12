classdef Node

    % Node containing a value and a pointer to next node
    properties
        value
        next
    end

    methods
        function obj = Node(v)
            obj.value = v;
            obj.next = NaN;
        end
    end
end