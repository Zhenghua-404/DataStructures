% a Skip List
classdef SkipList < handle

    properties
        % maxLevel is the upper bound on number of levels in the skip list
        maxLevel
        % p is the fraction of the nodes with level i pointers also having level i+1 pointers 
        p
        % current level of skip list, lowest 1
        level
        % pointer to header node
        header
    end

    methods
        % constructor: initialize properties
        % input: maximum level, the fraction of the index nodes
        function obj = SkipList(maxlvl, p)
            % create header node and initialize key to -1
            obj.header = Node(-1, maxlvl);
            obj.maxLevel = maxlvl;
            obj.p = p;
            obj.level = 1;
        end
        
        % generate a random level
        % input: (a skip list)
        % output: a random level
        function lvl = randomLevel(obj)
            % create random level for node
            r = rand();
            lvl=1;
            while r<obj.p && lvl<obj.maxLevel
                lvl=lvl+1;
                r=rand();
            end
        end
        
        % add a node to the skip list
        % input: node value(positive integer)
        function insert(obj, key)
            % Insert integers except -1 in skip list
            cur = obj.header;

            % create update array and initialize it
            update = cell(1,obj.maxLevel+1);

            % start from highest level of skip list
            % move the current pointer forward while key 
            % is greater than key of node next to current
            % Otherwise inserted current in update and 
            % move one level down and continue search
            i = obj.level;
            while i>=1
                while isa(cur.pointers{i},'Node') && cur.pointers{i}.value < key
                    cur = cur.pointers{i};
                end
                update{i}=cur;
                i=i-1;
            end

            % reached level 0 and forward pointer to 
            % right, which is desired position to 
            % insert key. 
            cur = cur.pointers{1};

            % if current is NULL that means we have reached
            % to end of the level or current's key is not equal
            % to key to insert that means we have to insert
            % node between update[0] and current node
            if ~isa(cur,'Node') || cur.value~= key
                rlevel = obj.randomLevel;
                if rlevel > obj.level
                    j=obj.level+1;
                    while j<rlevel+1
                        update{j}=obj.header;
                        j=j+1;
                    end
                    obj.level=rlevel;
                end
                n = Node(key, rlevel);
                k=1;
                while k<=rlevel
                    n.pointers{k} = update{k}.pointers{k};
                    update{k}.pointers{k}=n;
                    k=k+1;
                end
            end 
        end
        
        % search for a certain value in the skip list
        % input: a value (positive integer)
        % output: 0 or 1 (0 for non-existence, 1 for existence)
        function res = search(obj,key)
            cur = obj.header;

            i=obj.level;

            while i>=1
                while isa(cur.pointers{i},'Node') && cur.pointers{i}.value < key
                    cur = cur.pointers{i};
                end
                i=i-1;
            end

            cur = cur.pointers{1};

            if isa(cur,'Node') && cur.value == key
                res=1;
            else
                res=0;
            end
        end

        % a helper function for printing the data
        function displayList(obj)
            i=1;
            while i<=obj.level
                n = obj.header.pointers{i};
                fprintf('level %d: ',i);
                while isa(n,'Node')
                    fprintf('%d ',n.value);
                    n = n.pointers{i};
                end
                fprintf('\n');
                i=i+1;
            end
        end

    end
end