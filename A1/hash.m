% Hashing function: map a string to an integer index
% input: username of type string/ fingerprint of type int
% output: index of type int
function index = hash(R, username, len)
    % hashing and compressing to get an index of array Map
    conv = username;
    index = 0;
    % convert input to array of chars
    if isa(username, 'double')==1
        conv = int2str(username)-'0';
    end
    input = double(conv);
    % hash function
    for i = input
        index = mod(R * index + i, len);
    end
    % to avoid index 0, add 1 to the index
    index = index+1;
end