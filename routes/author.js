const router = require('express').Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

// Input validation package
// https://www.npmjs.com/package/validator
const validator = require('validator');

// require the database connection
const {
    sql,
    dbConnPoolPromise
} = require('../database/db.js');

// Define SQL statements here for use in function below
// These are parameterised queries note @named parameters.
// Input parameters are parsed and set before queries are executed

// for json path - Tell MS SQL to return results as JSON 
const SQL_SELECT_ALL = 'SELECT * FROM dbo.Author ORDER BY AuthorId ASC for json path;';

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM dbo.Author WHERE AuthorId = @id for json path, without_array_wrapper;';

const SQL_INSERT = 'INSERT INTO dbo.Author (AuthorName) VALUES (@AuthorName); SELECT * from dbo.Author WHERE AuthorId = SCOPE_IDENTITY(); ';

// GET listing of all authors
// Address http://server:port/author
// returns JSON
router.get('/', async (req, res) => {

    // Get a DB connection and execute SQL
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_SELECT_ALL);

        // Send HTTP response.
        // JSON data from MS SQL is contained in first element of the recordset.
        res.json(result.recordset[0]);

        // Catch and send errors  
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

// GET a single author by id
// id passed as parameter via url
// Address http://server:port/author/:id
// returns JSON
router.get('/:id', async (req, res) => {

    // read value of id parameter from the request url
    const AuthorId = req.params.id;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // See link to validator npm package (at top) for doc.
    // If validation fails return an error message
    if (!validator.isNumeric(AuthorId, {
            no_symbols: true
        })) {
        res.json({
            "error": "invalid id parameter"
        });
        return false;
    }

    // If validation passed execute query and return results
    // returns a single book with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set name parameter(s) in query
            .input('id', sql.Int, AuthorId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        res.json(result.recordset)

    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});



router.post('/', passport.authenticate('jwt', {
        session: false
    }),
    async (req, res) => {

        // Validate - this string, inially empty, will store any errors
        let errors = "";


        const AuthorName = validator.escape(req.body.AuthorName);
        if (AuthorName === "") {
            errors += "invalid AuthorName; ";
        }

        // If errors send details in response
        if (errors != "") {
            // return http response with  errors if validation failed
            res.json({
                "error": errors
            });
            return false;
        }

        // If no errors, insert
        try {
            // Get a DB connection and execute SQL
            const pool = await dbConnPoolPromise
            const result = await pool.request()
                // set named parameter(s) in query
                .input('AuthorName', sql.NVarChar, AuthorName)
                // Execute Query
                .query(SQL_INSERT);

            // If successful, return inserted Book via HTTP   
            res.json(result.recordset[0]);

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }

    });


module.exports = router;