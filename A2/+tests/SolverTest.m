% class for unit test
classdef SolverTest < matlab.unittest.TestCase
    methods(Test)
       
        % test Linkedlist's search using existing data
        function testlinkedlist1(testCase)
            m=LinkedList;
            a= [8,4,6,2,9,1];
            for i = 1:length(a)
                m.insert(a(i));
            end
            actSolution = m.search(4);
            expSolution = 1;
            testCase.verifyEqual(actSolution,expSolution)
        end

        % check linkedlist's order after insertions
        function testlinkedlist2(testCase)
            m=LinkedList;
            a= [8,4,6,2,9,1];
            for i = 1:length(a)
                m.insert(a(i));
            end
            res=[1,2,4,6,8,9];
            actSolution = m.displayList(6);
            expSolution = res;
            testCase.verifyEqual(actSolution,expSolution)
        end

        %test Skip List

        % test SkipList's search of existing data
        function testSkipList1(testCase)
            rng(1)
            l=SkipList(4,0.5);
            a= [3,6,7,9,12,19,17,26,21,25];
            for i = 1:length(a)
                l.insert(a(i));
            end
            actSolution = l.search(21);
            expSolution = 1;
            testCase.verifyEqual(actSolution,expSolution)
        end

         % test SkipList's search of nonexisting data
        function testSkipList2(testCase)
            rng(1)
            l=SkipList(4,0.5);
            a= [3,6,7,9,12,19,17,26,21,25];
            for i = 1:length(a)
                l.insert(a(i));
            end
            actSolution = l.search(15);
            expSolution = 0;
            testCase.verifyEqual(actSolution,expSolution)
        end

        %test BST

        % test SkipList's search of existing data
        function testBST1(testCase)
            b=BST;
            a= [8,4,6,2,9,1];
            for i = 1:length(a)
                b.insert(a(i));
            end
            actSolution = b.search(b.root,6);
            expSolution = 1;
            testCase.verifyEqual(actSolution,expSolution)
        end

        % test SkipList's search of nonexisting data
        function testBST2(testCase)
            b=BST;
            a= [8,4,6,2,9,1];
            for i = 1:length(a)
                b.insert(a(i));
            end
            actSolution = b.search(b.root,11);
            expSolution = 0;
            testCase.verifyEqual(actSolution,expSolution)
        end

    end
end