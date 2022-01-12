classdef myBloom < handle

    properties
        % the bit array of Bloom Filter
        bitArray
        % array of prime numbers for different hash functions
        RArray
    end

    methods

        % Bloom Filter Constructor:
        % initialize bit array and prime number array
        % input: length of bit array, array of prime numbers
        % output: a Bloom Filter 
        function obj = myBloom(bitLength, Rs)
            obj.bitArray = zeros(bitLength);
            for i = 1:length(Rs)
                obj.RArray(i)=Rs(i);
            end
        end
        
        % insert a username into the filter
        % input: username of type string
        % output: none (but have several print messages)
        function insert(obj, username)
            for i = 1:length(obj.RArray)
                index = hash(obj.RArray(i), username, length(obj.bitArray));
                obj.bitArray(index)=1;
                fprintf('Value inserted: %s at index %d\n', username, index);
            end
        end
        
        % check whether a username exists by checking all index fields
        % input: username of type string
        % output: 0 or 1 (0 for non-existence, 1 for existence)
        function result = check(obj, username)
            for i = 1:length(obj.RArray)
                index = hash(obj.RArray(i), username, length(obj.bitArray));
                if ~obj.bitArray(index)
                    fprintf('Value check: Not Existed: %s at index %d\n', username, index);
                    result = 0;
                    return;
                end
            end
            fprintf('Value check: Probably Existed: %s\n', username);
            result = 1;
        end
    end
end