#Team Klingon - Enterprise Computing Project

Group project at the University of Edinburgh. The website enables users to view buses live on a continuously updating map. 

Please note that the API key has not been uploaded with the project.

## Screenshots

[Album](https://onedrive.live.com/redir?resid=8c6213eff81db89f!718&authkey=!AGlSrEq9Anqd3S8&ithint=folder%2cjpg)

## Simple Setup
If on DICE:

* Untar
* Go to `enterprise-computing-project-team-klingon`
* Run `source venv/bin/activate`
* Run `cd website`
* Run `python2.7 app.py`


## Full Setup

* Clone the repository,
* Go in to the main folder,
* Run `virtualenv venv`,
    * If on DICE: Run `virtualenv --distribute --python=/usr/bin/python2.7 venv`
* Run `source venv/bin/activate`,
* Run `pip install -r requirements.txt`
* Run `cd website`
* Copy `config.default.py` to `config.py`, and update the secret details (this file is in the .gitignore, so changes won't be picked up)
* Run `python init_db.py`
    * If on DICE: Run `python2.7 init_db.py`
* Run `python app.py`
    * If on DICE: Run `python2.7 app.py`


A local web server will now be running in the terminal, listening for requests on "http://127.0.0.1:5000/". Put that link in to a web browser of your choice.

** If you're using PyCharm, set the project's working directory manually, in the Run/Debug Configurations menu**

##Tests
The backend includes fairly comprehensive testing. To run the tests:

* Run `python run_test_suite.py`.

To generate a coverage report:

* Run `coverage run -m unittest discover`
* Run `coverage html`

##Website structure
* **_models_**: data models representing tables in the database. Their operations should only be related to the particular model or its collections.
* **_static_**: images, javascript files, css sheets.
* **_templates_**: HTML templates organised into a hierarchical structure. They are rendered by views in response to HTTP requests.
* **_tests_**: a collection of unit and functional tests with a custom, common Base class.
* **_views_**: logic of the website, including handling requests, returning responses and manipulating models.