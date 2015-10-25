from tests.base_test import BaseTest


class HomeTest(BaseTest):

    # Test GET request for the home page
    def test_home_page(self):
        rv = self.app.get('/')
        self.assertEquals(rv.status_code, 200)

    # Test GET request for the about page
    def test_about_page(self):
        rv = self.app.get('/about')
        self.assertEquals(rv.status_code, 200)

    # Test GET request for the map page
    def test_map_page(self):
        rv = self.app.get('/map')
        self.assertEquals(rv.status_code, 200)