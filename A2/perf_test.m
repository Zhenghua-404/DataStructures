% generate experiment dataset and measure performance statistics
% input: 
% solver 1,2,3 correspond to: Linkedlist, Skiplist, BST
% ds: input data size
% output: [insertion time, searching time]
function res = perf_test(solver, ds)
    
    % random seed to make sure the same dataset
    rng(1);
    % generate ds different integers in [1:ds]
    a=randperm(ds);
    % look for the middle element
    v=a(round(ds/2));
    if solver==1
        s=LinkedList;
        res(1)=testInsert(s,a);
        res(2)=testSearch(s,v);
    elseif solver ==2
        % can tune parameter of skip list
        s=SkipList(5,0.5);
        res(1)=testInsert(s,a);
        res(2)=testSearch(s,v);
    elseif solver ==3
        s=BST;
        res(1)=testInsert(s,a);
        res(2)=testSearch(s,v);
    end
end

% using profile to measure insertion time
% input: m: data structure; a, the element to be inserted.
% output: ti: runtime of this function
function ti = testInsert(m,a)
    profile on -timer performance
    for i = 1:length(a)
        m.insert(a(i));
    end
    p=profile('info');
    len=length(p.FunctionTable);
    for i=1:len
        % extract the runtime of only this function to remove noise
        if strcmp(p.FunctionTable(i).FunctionName,'LinkedList>LinkedList.insert') || strcmp(p.FunctionTable(i).FunctionName,'SkipList>SkipList.insert') || strcmp(p.FunctionTable(i).FunctionName,'BST>BST.insert')
            p.FunctionTable(i);
            ti=p.FunctionTable(i).TotalTime;
            return;
        end
    end
end

% using profile to measure searching time
% input: m: data structure; a, the element to search for.
% output: ts: runtime of this function
function ts = testSearch(m,v)
    profile on -timer performance
    m.search(v);
    p=profile('info');
    len=length(p.FunctionTable);
    for i=1:len
        % extract the runtime of only this function to remove noise
        if strcmp(p.FunctionTable(i).FunctionName,'LinkedList>LinkedList.search') || strcmp(p.FunctionTable(i).FunctionName,'SkipList>SkipList.search') || strcmp(p.FunctionTable(i).FunctionName,'BST>BST.search')
            p.FunctionTable(i);
            ts=p.FunctionTable(i).TotalTime;
            return;
        end
    end
end
