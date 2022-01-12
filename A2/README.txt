Set up:
1. unzip and go to current directory.
2. for unit test and coverage report: run unit_test.m
   *** Note that the coverage may be low because there're numerical test scripts
   *** the coverage of the data structure classes are above 80%
3. for numerical tests and performance profile: run numerical_test.m
   *** generating datasets takes around 1 min on my computer
   *** the result runtime tables are: insertion_time: 21 test * 3 data structures
                                      search_time: 21 test * 3 data structures
   *** will generate 5 figures in report: all.jpg, insert.jpg, search.jpg, two.jpg, twosearch.jpg