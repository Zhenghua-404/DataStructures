import matlab.unittest.TestSuite
import matlab.unittest.TestRunner
import matlab.unittest.plugins.CodeCoveragePlugin

% unit test and coverage report
suite = TestSuite.fromPackage('tests');
runner = TestRunner.withTextOutput;
runner.addPlugin(CodeCoveragePlugin.forFolder(pwd))
result = runner.run(suite);

% Coverage rate may be low because of numerical test scripts!
% Average coverage on data structure classes are still above 80%
