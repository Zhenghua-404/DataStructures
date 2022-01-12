classdef myHashMap < handle

    properties
        % Map: the array of Linked-lists of data
        Map = [LinkedList];
        % R: prime parameter for hashing
        R
    end

    methods
        % HashMap Constructor:
        % initialize Map and R
        % input: length of array Map, a prime number
        % output: a HashMap object
        function obj = myHashMap(mapLength, prime)
            for i = 1:mapLength
                obj.Map(i)=LinkedList;
            end
            obj.R = prime;
        end
        
        
        % insert a username into the HashMap
        % input: username of type string
        % output: none (but have several print messages)
        function insert(obj,username)
            index = hash(obj.R, username, length(obj.Map));
            fprintf('Insertion: index: %d\n',index);
            % Linkedlist.add(string) method
            obj.Map(index).add(username);
        end

        % check whether a username exists in the HashMap
        % input: username of type string
        % output: 0 or 1 (0 for non-existence, 1 for existence)
        function result = check(obj,username)
            index = hash(obj.R, username, length(obj.Map));
            result = obj.Map(index).search(username);
        end
    end
end