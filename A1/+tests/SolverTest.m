classdef SolverTest < matlab.unittest.TestCase
    methods(Test)
       
        % test Hash Map

        % insert four usernames, check whether one of them exists
        function testHashMap1(testCase)
            m = myHashMap(8000,53);
            a= {'mavischen5', 'robertj14', 'furr888', 'pin8ple'};
            for i = 1:length(a)
                m.insert(a{i})
            end
            actSolution = m.check('mavischen5');
            expSolution = 1;
            testCase.verifyEqual(actSolution,expSolution)
        end

        % insert four usernames, check whether another name exists
        function testHashMap2(testCase)
            m = myHashMap(8000,53);
            a= {'mavischen5', 'robertj14', 'furr888', 'pin8ple'};
            for i = 1:length(a)
                m.insert(a{i})
            end
            actSolution = m.check('mavischen');
            expSolution = 0;
            testCase.verifyEqual(actSolution,expSolution)
        end

        %test Bloom filter

        % insert four usernames, check whether one of them exists
        function testBloom1(testCase)
            m = myBloom(10000, [53 73 97]);
            a= {'mavischen5', 'robertj14', 'furr888', 'pin8ple'};
            for i = 1:length(a)
                m.insert(a{i})
            end
            actSolution = m.check('mavischen5');
            expSolution = 1;
            testCase.verifyEqual(actSolution,expSolution)
        end

         % insert four usernames, check whether another name exists
        function testBloom2(testCase)
            m = myBloom(10000, [53 73 97]);
            a= {'mavischen5', 'robertj14', 'furr888', 'pin8ple'};
            for i = 1:length(a)
                m.insert(a{i})
            end
            actSolution = m.check('mavischen');
            expSolution = 0;
            testCase.verifyEqual(actSolution,expSolution)
        end

        %test Cuckoo hashing

        % insert four usernames, check whether one of them exists
        function testCuckoo1(testCase)
            m = myCuckoo(4000, 53, 73, 100);
            a= {'mavischen5', 'robertj14', 'furr888', 'pin8ple'};
            for i = 1:length(a)
                m.insert(a{i})
            end
            actSolution = m.check('mavischen5');
            expSolution = 1;
            testCase.verifyEqual(actSolution,expSolution)
        end

        % insert four usernames, check whether another name exists
        function testCuckoo2(testCase)
            m = myCuckoo(4000, 53, 73, 100);
            a= {'mavischen5', 'robertj14', 'furr888', 'pin8ple'};
            for i = 1:length(a)
                m.insert(a{i})
            end
            actSolution = m.check('mavischen');
            expSolution = 0;
            testCase.verifyEqual(actSolution,expSolution)
        end

        % define a table of only length 1, but inserting two same values
        % since they are the same string, their indices are the same
        % therefore the second insertion should be in index 2 (test coverage of code)
        function testCuckoo3(testCase)
            m = myCuckoo(1, 53, 73, 100);
            a= {'mavischen', 'mavischen'};
            for i = 1:length(a)
                m.insert(a{i})
            end
            actSolution = m.check('mavischen');
            expSolution = 1;
            testCase.verifyEqual(actSolution,expSolution)
        end

        % define a table of only length 1, but inserting 3 same values
        % since they are the same string, their indices are the same
        % obviously the space is not enough and they are looping forever
        % therefore the code automatically expand the array by 100 rows
        % theresore the expected lines of table should be 1+100=101
        function testCuckoo4(testCase)
            m = myCuckoo(1, 53, 73, 100);
            a= {'mavischen', 'mavischen','mavischen'};
            for i = 1:length(a)
                m.insert(a{i})
            end
            %number of rows after expanding table
            actSolution = size(m.table,1);
            expSolution = 101;
            testCase.verifyEqual(actSolution,expSolution)
        end
    end
end