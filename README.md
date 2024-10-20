# Introduction
RebelHub is a social media application designed for university students in order to promote campus community engagement. RebelHub allows users to create a profile and join Hubs that cater content based on their interests. Students can share posts, message others, and interact with the campus community in real time. The goal is to encourage communication and networking among us by providing targeted content within specific interest hubs, creating a more connected university experience.
# Technology
Because we are tasked to make a MVP we set up a minimal build for our web application. We use the Django & Django rest framework in order to set up our backend. This is a comprehensive framework that provides the many different tools for a standalone application. However we are utilizing it strictly for a server to our application. In the front end we are using the React framework that we set up using Next.js. This allows us to easily create the dynamic parts of our application by giving us access to Reacts component system and hooks. We are only using the client side features of React (NO SERVER COMPONENTS). That being said our backend consists mostly of python code while our frontend consists of mostly JavaScript.
# Installation
To build and run this app it's pretty straight forward. The key software needed is Node.js (for npm and next.js/react) and Python & Pip (for installing the backend). 
1. Confirm you have node.js, python, and pip installed by running the following in your terminal. (The actual output may vary, If you are on windows make sure node, pip, and python are all included in you PATH)
```bash
$ node -v
v20.15.1

$ python --version
Python 3.12.7

$ pip --version
pip 24.2 from /usr/lib/python3.12/site-packages/pip (Python 3.12)
```
2. After having the prerequistes you can clone or fork the project and step into the directory. At this point, you can create a virtual enviorment for handling the python code however it's not required. 
3. Navigate to the backend directory and install requirements.txt via pip.
```bash
$ cd backend/
$ pip install -r requirements.txt
```
4. Once pip finishes installing the requirements the backend server can be started by running the following command
```bash
$ python manage.py runserver
```
5. To install the frontend, open a new terminal and navigate back the project and find the frontend directory.
```bash
$ cd frontend/
```
6. From here we can run the following command to install the frontend app.
```bash
$ npm install
```
7. Once the install finished we can run the dev enviorment we use during development.
```bash
$ npm run dev
```
8. Once both servers are running you can go to the local host link that next js gives you and you should see a sample page regarding our app, if the backend is setup and running you will also see the sample data.

# Resources
[Django Rest Framework](https://www.django-rest-framework.org/)  
[React](https://react.dev/learn)  
[Next.js](https://nextjs.org/docs)
