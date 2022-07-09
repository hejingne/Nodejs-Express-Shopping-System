# Nodejs-Express-Shopping-System
This is an application built with the Express framework in Nodejs environment that provides an online catalog for a small local online atheletic clothing store.

# Main Features
- Users can browse information or perform CRUD operation on each designer, clothing item, category and style
- Connect to MongoDB with Mongoose for data storage and operations
- Display response data via html templates using the ```pug``` view rendering engine
- Send http requests to fetch stored data using the node ```async``` module to manage flow control
- Implement website routings to receive and forward http requests to be processed by controller functions
- Incorporate ```MVC``` design pattern by separating out controller logic with created models and layout templates
- Work with forms to collect user inputs
- Inspect form data using the ```express-validator``` module and validation and sanitization chains as middleware
- Error handling for cases such as where users intend to add new item from designer that does not exist or to remove a style from database when it is still being referenced by an item, etc

# Available scripts
- Install dependencies\
```npm install```
- Run the app in development mode\
```DEBUG=nodejs-express-shopping-system:* npm start``` On macOS or Linux or ```SET DEBUG=nodejs-express-shopping-system:* & npm start``` on Windows CMD prompt
