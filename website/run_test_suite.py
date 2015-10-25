import unittest
from tests.views.test_home import HomeTest
from tests.models.test_vehicle import VehicleTest
from tests.views.test_bus import BusTest
from tests.models.test_associations import AssociationsTest
from coverage import coverage
from constants import BASEDIR
import os
import sys

if __name__ == '__main__':

    if len(sys.argv) > 1:

        cov = coverage(branch=True, omit=['website/*', 'run_test_suite.py'])
        cov.start()

        try:
            unittest.main(argv=[sys.argv[0]])
        except:
            pass

        cov.stop()
        cov.save()

        print "\n\nCoverage Report:\n"
        cov.report()

        print "HTML version: " + os.path.join(BASEDIR, "tmp/coverage/index.html")
        cov.html_report(directory='tmp/coverage')
        cov.erase()

    else:
        unittest.main()