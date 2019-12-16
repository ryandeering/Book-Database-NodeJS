const router = require('express').Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

// Input validation package
// https://www.npmjs.com/package/validator
const validator = require('validator');

// require the database connection
const { sql, dbConnPoolPromise } = require('../database/db.js');

// Define SQL statements here for use in function below
// These are parameterised queries note @named parameters.
// Input parameters are parsed and set before queries are executed

// for json path - Tell MS SQL to return results as JSON 
const SQL_SELECT_ALL = 'SELECT * FROM dbo.Book ORDER BY BookName ASC for json path;';

const SQL_select_join = 'SELECT b.BookId, b.BookName, b.BookDescription, b.BookStock, b.BookPrice, a.AuthorName FROM dbo.Book as b JOIN dbo.Author as a ON (b.AuthorId = a.AuthorId) for json path;'
//join to get novelist's name as well

// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_ID = 'SELECT * FROM dbo.Book WHERE BookId = @id for json path, without_array_wrapper;';



// for json path, without_array_wrapper - use for single json result
const SQL_SELECT_BY_CATID = 'SELECT * FROM dbo.Book WHERE GenreId = @id ORDER BY BookName ASC for json path;';

const SQL_select_by_join = 'SELECT b.BookId, b.BookName, b.BookDescription, b.BookStock, b.BookPrice, a.AuthorName FROM dbo.Book as b JOIN dbo.Author as a ON (b.AuthorId = a.AuthorId) WHERE b.GenreId = @id ORDER BY b.BookName ASC for json path;'

// Second statement (Select...) returns inserted record identified by BookId = SCOPE_IDENTITY()
const SQL_INSERT = 'INSERT INTO dbo.Book (GenreId, AuthorId,  BookName, BookDescription, BookStock, BookPrice) VALUES (@GenreId, @AuthorId,  @BookName, @BookDescription, @BookStock, @BookPrice); SELECT * from dbo.Book WHERE BookId = SCOPE_IDENTITY();';
const SQL_UPDATE = 'UPDATE dbo.Book SET GenreId = @GenreId, AuthorId = @AuthorId, BookName = @BookName, BookDescription = @BookDescription, BookStock = @BookStock, BookPrice = @BookPrice WHERE BookId = @BookId; SELECT * FROM dbo.Book WHERE BookId = @BookId;';
const SQL_DELETE = 'DELETE FROM dbo.Book WHERE BookId = @id;';


// GET listing of all Books
// Address http://server:port/Book
// returns JSON
router.get('/', async (req, res) => {

    // Get a DB connection and execute SQL
    try {
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // execute query
            .query(SQL_select_join);
        
        // Send HTTP response.
        // JSON data from MS SQL is contained in first element of the recordset.
        res.json(result.recordset[0]);

      // Catch and send errors  
      } catch (err) {
        res.status(500)
        res.send(err.message)
      }
});

// GET a single Book by id
// id passed as parameter via url
// Address http://server:port/Book/:id
// returns JSON
router.get('/:id', async (req, res) => {

    // read value of id parameter from the request url
    const BookId = req.params.id;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // See link to validator npm package (at top) for doc.
    // If validation fails return an error message
    if (!validator.isNumeric(BookId, { no_symbols: true })) {
        res.json({ "error": "invalid id parameter" });
        return false;
    }

    // If validation passed execute query and return results
    // returns a single Book with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set name parameter(s) in query
            .input('id', sql.Int, BookId)
            // execute query
            .query(SQL_SELECT_BY_ID);

        // Send response with JSON result    
        res.json(result.recordset[0])

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
});

// GET Books by category id
// id passed as parameter via url
// Address http://server:port/Book/:id
// returns JSON
router.get('/bycat/:id', async (req, res) => {

    // read value of id parameter from the request url
    const genreId = req.params.id;

    // Validate input - important as a bad input could crash the server or lead to an attack
    // See link to validator npm package (at top) for doc.
    // If validation fails return an error message
    if (!validator.isNumeric(genreId, { no_symbols: true })) {
        res.json({ "error": "invalid id parameter" });
        return false;
    }

    // If validation passed execute query and return results
    // returns a single Book with matching id
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set name parameter(s) in query
            .input('id', sql.Int, genreId)
            // execute query
            .query(SQL_select_by_join);

        // Send response with JSON result    
        res.json(result.recordset[0])

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
});

// POST - Insert a new Book.
// This async function sends a HTTP post request
router.post('/', passport.authenticate('jwt', { session: false}),
async (req, res) => {

    // Validate - this string, inially empty, will store any errors
    let errors = "";

    // Make sure that category id is just a number - note that values are read from request body
    const GenreId = req.body.GenreId;
    if (!validator.isNumeric(GenreId, {no_symbols: true})) {
        errors+= "invalid Genre id; ";
    }
    const AuthorId = req.body.AuthorId;
    if (!validator.isNumeric(AuthorId, {no_symbols: true})) {
        errors+= "invalid Author id; ";
    }
    // Escape text and potentially bad characters
    const BookName = validator.escape(req.body.BookName);
    if (BookName === "") {
        errors+= "invalid BookName; ";
    }
    const BookDescription = validator.escape(req.body.BookDescription);
    if (BookDescription === "") {
        errors+= "invalid BookDescription; ";
    }
    // Make sure that category id is just a number
    const BookStock = req.body.BookStock;
    if (!validator.isNumeric(BookStock, {no_symbols: true})) {
        errors+= "invalid BookStock; ";
    }
    // Validate currency
    const BookPrice = req.body.BookPrice;
    if (!validator.isCurrency(BookPrice, {allow_negatives: false})) {
        errors+= "invalid BookPrice; ";
    }

    // If errors send details in response
    if (errors != "") {
        // return http response with  errors if validation failed
        res.json({ "error": errors });
        return false;
    }

    // If no errors, insert
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set named parameter(s) in query
            .input('GenreId', sql.Int, GenreId)
            .input('AuthorId', sql.Int, AuthorId)    
            .input('BookName', sql.NVarChar, BookName)
            .input('BookDescription', sql.NVarChar, BookDescription)
            .input('BookStock', sql.Int,  BookStock)
            .input('BookPrice', sql.Decimal, BookPrice)
            // Execute Query
            .query(SQL_INSERT);      
    
        // If successful, return inserted Book via HTTP   
        res.json(result.recordset[0]);

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    
});

// PUT update Book
// Like post but BookId is provided and method = put
router.put('/:BookId', passport.authenticate('jwt', { session: false}),
async (req, res) => {

    // Validate input values (sent in req.body)
    let errors = "";
    const BookId = req.params.BookId;
    if (!validator.isNumeric(BookId, {no_symbols: true})) {
        errors+= "invalid Book id; ";
    }
    const GenreId = req.body.GenreId;
    if (!validator.isNumeric(GenreId, {no_symbols: true})) {
        errors+= "invalid category id; ";
    }
    const AuthorId = req.body.AuthorId;
    if (!validator.isNumeric(AuthorId, {no_symbols: true})) {
        errors+= "invalid author id; ";
    }

    const BookName = validator.escape(req.body.BookName);
    if (BookName === "") {
        errors+= "invalid BookName; ";
    }
    const BookDescription = validator.escape(req.body.BookDescription);
    if (BookDescription === "") {
        errors+= "invalid BookDescription; ";
    }
    const BookStock = req.body.BookStock;
    if (!validator.isNumeric(BookStock, {no_symbols: true})) {
        errors+= "invalid BookStock; ";
    }
    const BookPrice = req.body.BookPrice;
    if (!validator.isCurrency(BookPrice, {allow_negatives: false})) {
        errors+= "invalid BookPrice; ";
    }

    // If errors send details in response
    if (errors != "") {
        // return http response with  errors if validation failed
        res.json({ "error": errors });
        return false;
    }

    // If no errors
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            // set parameters
            .input('BookId', sql.Int, BookId)
            .input('GenreId', sql.Int, GenreId)      
            .input('AuthorId', sql.Int, AuthorId)   
            .input('BookName', sql.NVarChar, BookName)
            .input('BookDescription', sql.NVarChar, BookDescription)
            .input('BookStock', sql.Int,  BookStock)
            .input('BookPrice', sql.Decimal, BookPrice)
            // run query
            .query(SQL_UPDATE);      
    
        // If successful, return updated Book via HTTP    
        res.json(result.recordset[0]);

        } catch (err) {
        res.status(500)
        res.send(err.message)
        }
   
});

// DELETE single task.
router.delete('/:id', passport.authenticate('jwt', { session: false}),
async (req, res) => {

    // Validate
    const BookId = req.params.id;

    // If validation fails return an error message
    if (!validator.isNumeric(BookId, { no_symbols: true })) {
        res.json({ "error": "invalid id parameter" });
        return false;
    }
    
    // If no errors try delete
    try {
        // Get a DB connection and execute SQL
        const pool = await dbConnPoolPromise
        const result = await pool.request()
            .input('id', sql.Int, BookId)
            .query(SQL_DELETE);      
    

        const rowsAffected = Number(result.rowsAffected);

        let response = {"deletedId": null}

        if (rowsAffected > 0)
        {
            response = {"deletedId": BookId}
        }

        res.json(response);

        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
});

module.exports = router;
