function perf(T,logplot, titleName, figname)
%PERF    Performace profiles
%
% PERF(T,logplot)-- produces a performace profile as described in
%   Benchmarking optimization software with performance profiles,
%   E.D. Dolan and J.J. More', 
%   Mathematical Programming, 91 (2002), 201--213.
% Each column of the matrix T defines the performance data for a solver.
% Failures on a given problem are represented by a NaN.
% The optional argument logplot is used to produce a 
% log (base 2) performance plot.
%
% This function is based on the perl script of Liz Dolan.
%
% Jorge J. More', June 2004

%if (nargin < 2) logplot = 0; end

%colors  = ['m' 'b' 'r' 'g' 'c' 'k' 'y'];
colors  = [ [0 0 0];[0 0 1];[0 1 0];[0 1 1];[1 0 0];[1 0 1];
            [0 0 0.5];[0 0.5 0];[0 0.5 0.5];[0.5 0 0];[0.5 0 0.5];[0.5 0.5 0];
            [0.3 0.9 0.5];[0.7 0.3 0.5];[0.5 0.3 0.5];[0.3 0.3 0.7];[0.2 0.5 0.9];[0.1 0.4 0.3]
          ];
%lines   = cellstr(char( '-.', '--', ':', '-'));
lines   = [ '-.' '--' ':' '-'];
markers = ['x' '>'  'o' 'v' 's' 'd' '*'];

[np,ns] = size(T);

% Minimal performance per solver

minperf = min(T,[],2);

% Compute ratios and divide by smallest element in each row.

r = zeros(np,ns);
for p = 1: np
  r(p,:) = T(p,:)/minperf(p);
end

if (logplot) r = log2(r); end

max_ratio = max(max(r));

% Replace all NaN's with twice the max_ratio and sort.

r(find(isnan(r))) = 2*max_ratio;
r = sort(r);

% Plot stair graphs with markers.
clf;
for s = 1: ns
 [xs,ys] = stairs(r(:,s),[1:np]/np); 
 temp = floor((s-1)./3)+1;
 %set(gca, 'LineStyle', '-');
 plot(xs,ys,'Color', colors(s,:),'LineWidth' ,1.3, 'Marker', markers(temp), 'LineStyle', '-');
 hold on;
end
%legend('Strategy1','Strategy2','Strategy3','Strategy4','Strategy5','Strategy6','Strategy7','Strategy8', 'Strategy9','Strategy10','Strategy11','Strategy12','Strategy13','Strategy14', 'Strategy15','Strategy16','Strategy17','Strategy18');
%legend('Strategy10','Strategy11','Strategy12','Strategy13','Strategy14', 'Strategy15','Strategy16','Strategy17','Strategy18');
%legend('QBB', 'QBN',	'QBS',	'QNB',	'QNN',	'QNS',	'QSB',	'QSN',	'QSS',	'NBB',	'NBN',	'NBS',	'NNB',	'NNN',	'NNS',	'NSB',	'NSN',	'NSS');
%legend('NBB',	'NBN',	'NBS',	'NNB',	'NNN',	'NNS',	'NSB',	'NSN',	'NSS');
%legend('QBB', 'QBN',	'QBS',	'QNB',	'QNN',	'QNS',	'QSB',	'QSN',	'QSS');
legend('LinkedList','SkipList',	'BST');

if (logplot) 
    xlabel(strcat('log_2(\tau)')); 
    ylabel('\rho_s(log_2(\tau))');
else
    xlabel('\tau');
    ylabel('\rho_s(\tau)')
end


% Axis properties are set so that failures are not shown,
% but with the max_ratio data points shown. This highlights
% the "flatline" effect.

axis([ 0 1.1*max_ratio 0 1 ]);

% Legends and title should be added.
title(titleName);
f=gcf;
exportgraphics(f,figname);