# Zendesk Product Security
### The Zendesk Product Security Challenge

Hello friend,

We are super excited that you want to be part of the Product Security team at Zendesk.

**To get started, you need to fork this repository to your own Github profile and work off that copy.**

In this repository, there are the following files:
1. README.md - this file
2. project/ - the folder containing all the files that you require to get started
3. project/index.html - the main HTML file containing the login form
4. project/assets/ - the folder containing supporting assets such as images, JavaScript files, Cascading Style Sheets, etc. You shouldn’t need to make any changes to these but you are free to do so if you feel it might help your submission

As part of the challenge, you need to implement an authentication mechanism with as many of the following features as possible. It is a non exhaustive list, so feel free to add or remove any of it as deemed necessary.

1. Input sanitization and validation [simple XSS username and password validation server side]
2. Password hashed [32 bit salt and md5 hash]
3. Prevention of timing attacks
4. Logging
5. CSRF prevention [implemented with csurf]
6. Multi factor authentication
7. Password reset / forget password mechanism
8. Account lockout [implemented with tries]
9. Cookie
10. HTTPS
11. Known password check

You will have to create a simple binary (platform of your choice) to provide any server side functionality you may require. Please document steps to run the application. Your submission should be a link to your Github repository which you've already forked earlier together with the source code and binaries.

Thank you!

------------
Work done 
Backend server only express with no routing - basic security implementation  
Used serialized json as database instead of proper db system such as sqlite/mongodb  
Coding improvements needed
-routing framework not implemented
-proper cookie procedure not implemented
-callback from html to backend needs alot of improvement
