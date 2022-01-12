% a script to get numerical experiment data and plot profiles

% a matrix storing 21 insertion time of 3 solvers
insert_time=zeros(21,3);
% a matrix storing 20 searching time of 3 solvers
search_time=zeros(21,3);

% input data size ranges from 500 to 1500, every 50#
for data=500:50:1500
    % linked list runtime [insertion time, search time]
    ll = perf_test(1,data);
    % skip list runtime [insertion time, search time]
    sl = perf_test(2,data);
    % bst runtime [insertion time, search time]
    bst = perf_test(3,data);
    insert_time((data-500)/50+1,:)=[ll(1),sl(1),bst(1)];
    search_time((data-500)/50+1,:)=[ll(2),sl(2),bst(2)];
end

% Performance Profiles of insertion, searching and both 
all=insert_time+search_time;
perf(insert_time,0,'Performance Profile of Insertion Test Case','insert.jpg');
perf(search_time,0,'Performance Profile of Searching Test Case','search.jpg');
perf(all,0,'Overall Performance Profile','all.jpg');
% Performance Profile Limitation Test: plot only Linkedlist and Skiplist,
% and only on searching
perf(all(:,1:2),0,'Performance Profile of Two Solvers','two.jpg');
perf(search_time(:,1:2),0,'Performance Profile of Two Solvers of Searching Test Case','twosearch.jpg');

