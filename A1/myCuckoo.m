classdef myCuckoo < handle

    properties
        % nx2 matrix containing fingerprints of data
        table
        % two prime numbers for 2 hashing
        R1
        R2
        % the max number of loop of kicking values around 2 columns
        % if loop time is huge, we assume there's a cycle conflict
        loopMax
    end

    methods

        % Cuckoo Filter Constructor:
        % initialize the table to 0s, assign prime numbers and max loop
        % input: length of table, 2 prime numbers, 1 int 
        % output: a Cuckoo Filter 
        function obj = myCuckoo(length, R1, R2, maxiter)
            obj.table = zeros(length,2);
            obj.R1 = R1;
            obj.R2 = R2;
            obj.loopMax = maxiter;
        end

        % insert a username into the filter
        % input: username of type string
        % output: none (but have several print messages)
        function obj = insert(obj, name)
            % value: fingerprint of name
            value = string2hash(name);

            % 2 indices of the value
            index1 = hash(obj.R1, value, length(obj.table));
            index2 = hash(obj.R2, value, length(obj.table));

            % get the current values of the indices
            v1 = obj.table(index1,1);
            v2 = obj.table(index2,2);

            % if index 1 is empty, add to index 1
            if v1 == 0
                obj.table(index1,1) = value;
                fprintf('Insertion: name %s (fingerprint %d) inserted at index1 %d\n', name, value, index1);
            elseif v2 == 0
                % if index 2 is empty, add to index 2
                obj.table(index2,2) = value;
                fprintf('Insertion: name %s (fingerprint %d) inserted at index2 %d\n', name, value, index2);
            else
                % if indices are full, kick out the second one and add to
                % index 2
                % 'conflict' indicates whether or not need to kick out values
                conflict = 1;
                % 'loop' marks down the number of loops
                loop = 0;

                % copy the values to new variables to be updated in loop
                curValue = value;
                newindex2 = index2;

                while (conflict==1) && (loop<obj.loopMax)
                    % Now we are inserting the new value in table2
                    % newindex2: new value's hash code 2
                    % curValue: the value to be inserted
                    % previous: the previous value in newindex2

                    previous = obj.table(newindex2,2);
                    obj.table(index2,2) = curValue;

                    % check the kicked out value's hash code in table1
                    % another: the value of hash code 1 of "previous" value
                    another = obj.table(hash(obj.R1, previous, length(obj.table)),1);
                    if another == 0
                        conflict = 0;
                    else
                        curValue = another;
                        newindex2 = hash(obj.R2, curValue, length(obj.table));
                    end
                    
                    % fit the replaced value in table 1
                    obj.table(hash(obj.R1,previous, length(obj.table)),1) = previous;
                    loop = loop+1;
                end
                
                % if the loop stops because of exceeding loop max, need to
                % resize table to resolve conflicts
                if loop>=obj.loopMax
                    fprintf('A cycle conflict! expand the table size by 100 rows...\n');
                    % expand the table size by 100
                    b = [0 0];
                    obj.table = [obj.table;repmat(b,100,1)];
                    fprintf('Expaned! Please insert the new value again.\n');
                else
                    % if the loop stops because of solving conflicts
                    % successfully, print inserted
                    fprintf('Insertion: name %s (fingerprint %d) inserted at index2 %d resulting in %d loops\n', name, value, index2, loop);
                end
            end
        end

        % check whether a username exists by checking 2 index fields
        % input: username of type string
        % output: 0 or 1 (0 for non-existence, 1 for existence)
        function result = check(obj, name)

            % value: fingerprint
            value = string2hash(name);

            % indices
            index1 = hash(obj.R1, value, length(obj.table));
            index2 = hash(obj.R2, value, length(obj.table));

            % search
            v1 = obj.table(index1,1);
            v2 = obj.table(index2,2);
            % if one of 2 fingerprints matches then teh username exists
            if (v1==value) || (v2==value)
                result=1;
                fprintf('Value check: Existed: %s at index %d %d\n', name, index1, index2);
            else
                result=0;
                fprintf('Value check: Not Existed: %s at index %d %d\n', name, index1, index2);
            end
        end
    end
end