
# Book Database - NodeJS, Express

This was a project to become familiar with NodeJS, JavaScript, using an Azure database and RESTful APIs. I built it in a few days based on a simple ERD of four tables, this is found in the documentation. 


To run the application type this into the directory, this will grab all necessary dependencies:
```
npm install
```

Then you will want to edit default.json to provide your credentials, to hook it up to a database and a WebUser with necessary permissions to perform CRUD operations in SQL.

I would recommend running the SQL file in your respective database, as this will fill the necessary tables used in the application with sample data.

Then to run the application:
```
npm run dev, or alternatively npm run start
```
To gain access as an authenticated user, use 'alice@web.com' as an email and 'password' as a password, providing you are using my sample data. 

## Built With

* [NPM](https://www.npmjs.com/) - Package manager for NodeJS
* [NodeJS](https://nodejs.org/en/) - JavaScript runtime.
* [Express](https://expressjs.com/) - Web framework.
* [Passport](http://www.passportjs.org/) - Authentication middleware for Node. Used for user authentication.
* [BootStrap](https://getbootstrap.com/) - Front-end framework.
* [nodemon](https://nodemon.io/) - Used for automatic refresh when code is changed.
* [Microsoft Azure](https://azure.microsoft.com/) - Used for the database when SQL queries are ran. 


## Authors
* **Ryan Deering** - [ryandeering](https://github.com/ryandeering)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
