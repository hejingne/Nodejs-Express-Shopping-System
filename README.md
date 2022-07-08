# Nodejs-Express-Shopping-System
This is an application built with the Express framework in Nodejs environment that provides an online catalog for a small local online atheletic clothing store.

# Main Features
- Users can browse information or perform CRUD operation on each designer, clothing item, category and style
- Connect to MongoDB with Mongoose for data storage and operations
- Display response data via html templates using the ```pug``` view rendering engine
- Send http requests to fetch stored data using the node ```async``` module to manage flow control
- Implement website routings to receive and forward http requests to be processed by controller functions
- Incorporate ```MVC``` design pattern by separating out controller logic with created models and layout templates
- Work with forms to extract user inputs

# Available scripts
- Install dependencies\
```npm install```
- Run the app in development mode\
```DEBUG=nodejs-express-shopping-system:* npm run devstart``` On macOS or Linux or ```SET DEBUG=nodejs-express-shopping-system:* & npm run devstart``` on Windows CMD prompt
