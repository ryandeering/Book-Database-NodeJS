// Called when form submit button is clicked
async function addAuthor() {

  // url
  let url = `${BASE_URL}author`

  // Get form fields
  const authId = Number(document.getElementById('AuthorId').value);
  const authName = document.getElementById('AuthorName').value;
  // build request body
  const reqBody = JSON.stringify({
    AuthorName: authName
  });

  // Try catch 
  try {
    let json = "";
    // determine if this is an insert (POST) or update (PUT)
    // update will include book id
    json = await postOrPutDataAsync(url, reqBody, 'POST');

    // Load books
    loadBooks();
    // catch and log any errors
  } catch (err) {
    console.log(err);
    return err;
  }
}

function displayAuthors(authors) {

  // Use the Array map method to iterate through the array of books (in json format)
  // Each books will be formated as HTML table rowsand added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="productRows"> element.

  const rows = authors.map(author => {
    // returns a template string for each book, values are inserted using ${ }
    // <tr> is a table row and <td> a table division represents a column

    let row = `<tr>
                <td>${author.AuthorId}</td>
                <td>${author.AuthorName}</td>
             `
    row += '</tr>';

    return row;
  });

  // Set the innerHTML of the authorRows root element = rows
  // Why use join('') ???
  document.getElementById('authorRows').innerHTML = rows.join('');
} // end function