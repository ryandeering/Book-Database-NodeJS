// JavaScript for the product page
//

// CRUD operations 


// Parse JSON
// Create product rows
// Display in web page
function displayBooks(books) {

  // Use the Array map method to iterate through the array of products (in json format)
  // Each products will be formated as HTML table rowsand added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="productRows"> element.

  const rows = books.map(book => {
    // returns a template string for each product, values are inserted using ${ }
    // <tr> is a table row and <td> a table division represents a column

    let row = `<tr>
                <td>${book.BookName}</td>
                <td>${book.BookDescription}</td>
                <td>${book.BookStock}</td>
                <td class="price">&euro;${Number(book.BookPrice).toFixed(2)}</td>
                <td>${book.AuthorName}</td>`

    // If user logged in then show edit and delete buttons
    // To add - check user role        
    if (userLoggedIn() === true) {
      row += `<td><button class="btn btn-xs" data-toggle="modal" data-target="#BookFormDialog" onclick="prepareBookUpdate(${book.BookId})"><span class="oi oi-pencil"></span></button></td>
                   <td><button class="btn btn-xs" onclick="deleteProduct(${book.BookId})"><span class="oi oi-trash"></span></button></td>`
    }
    row += '</tr>';

    return row;
  });

  // Set the innerHTML of the productRows root element = rows
  // Why use join('') ???
  document.getElementById('bookRows').innerHTML = rows.join('');
} // end function


// load and display categories in a bootstrap list group
function displayGenres(genres) {
  console.log(genres);
  const items = genres.map(genre => {
    return `<a href="#" class="list-group-item list-group-item-action" onclick="updateBooksView(${genre.GenreId})">${genre.GenreId}. ${genre.Genre}</a>`;
  });

  // Add an All categories link at the start
  items.unshift(`<a href="#" class="list-group-item list-group-item-action" onclick="loadBooks()">Show all</a>`);

  // Set the innerHTML of the productRows root element = rows
  document.getElementById('genreList').innerHTML = items.join('');
} // end function


// Get all categories and products then display
async function loadBooks() {
  try {
    const categories = await getDataAsync(`${BASE_URL}genre`);
    displayGenres(categories);

    const books = await getDataAsync(`${BASE_URL}book`);
    displayBooks(books);

    const authors = await getDataAsync(`${BASE_URL}author`);
    displayAuthors(authors);



  } // catch and log any errors
  catch (err) {
    console.log(err);
  }
}

// update products list when category is selected to show only products from that category
async function updateBooksView(id) {
  try {
    const products = await getDataAsync(`${BASE_URL}book/bycat/${id}`);
    displayBooks(products);

  } // catch and log any errors
  catch (err) {
    console.log(err);
  }
}

async function returnAuthor(id) {

  try {

    url = `${BASE_URL}author/${id}`

    const response = await fetch(url, GET_INIT);

    const jsona = await getDataAsync(`${BASE_URL}author/${id}`);
    const jsonb = await jsona.json();
    console.log("response: " + jsonb.AuthorName);

    return jsonb.AuthorName;

    // catch and log any errors
  } catch (err) {
    console.log(err);
    return err;
  }
}



// When a product is selected for update/ editing, get it by id and fill out the form
async function prepareBookUpdate(id) {

  try {
    // Get broduct by id
    const Book = await getDataAsync(`${BASE_URL}book/${id}`);
    console.log(Book);
    // Fill out the form
    document.getElementById('BookId').value = Book.BookId; // uses a hidden field - see the form
    console.log("Over here, Ryan" + Book.BookId)
    document.getElementById('GenreId').value = Book.GenreId;
    document.getElementById('AuthorId').value = Book.AuthorId;
    document.getElementById('BookName').value = Book.BookName;
    document.getElementById('BookDescription').value = Book.BookDescription;
    document.getElementById('BookStock').value = Book.BookStock;
    document.getElementById('BookPrice').value = Book.BookPrice;
  } // catch and log any errors
  catch (err) {
    console.log(err);
  }
}

// Called when form submit button is clicked
async function addOrUpdateBook() {

  // url
  let url = `${BASE_URL}book`

  // Get form fields
  const pId = Number(document.getElementById('BookId').value);
  console.log('Id ' + pId)
  const catId = document.getElementById('GenreId').value;
  const AuthId = document.getElementById('AuthorId').value;
  const pName = document.getElementById('BookName').value;
  const pDesc = document.getElementById('BookDescription').value;
  const pStock = document.getElementById('BookStock').value;
  const pPrice = document.getElementById('BookPrice').value;

  // build request body
  const reqBody = JSON.stringify({
    BookId: pId,
    GenreId: catId,
    AuthorId: AuthId,
    BookName: pName,
    BookDescription: pDesc,
    BookStock: pStock,
    BookPrice: pPrice
  });

  // Try catch 
  try {
    let json = "";
    // determine if this is an insert (POST) or update (PUT)
    // update will include product id
    if (pId > 0) {
      url += `/${pId}`;
      json = await postOrPutDataAsync(url, reqBody, 'PUT');
    } else {
      json = await postOrPutDataAsync(url, reqBody, 'POST');
    }
    // Load products
    loadBooks();
    // catch and log any errors
  } catch (err) {
    console.log(err);
    return err;
  }
}

// Delete product by id using an HTTP DELETE request
async function deleteProduct(id) {

  if (confirm("Are you sure?")) {
    // url
    const url = `${BASE_URL}book/${id}`;

    // Try catch 
    try {
      const json = await deleteDataAsync(url);
      console.log("response: " + json);

      loadBooks();

      // catch and log any errors
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

// Show product button
function showAddBookButton() {

  let addBookButton = document.getElementById('addBookButton');
  let addAuthorButton = document.getElementById('AddAuthorButton');

  if (userLoggedIn() === true) {
    viewAuthorsButton.style.display = 'block';
    addBookButton.style.display = 'block';
    addAuthorButton.style.display = 'block';
  } else {
    viewAuthorsButton.style.display = 'none';
    addBookButton.style.display = 'none';
    addAuthorButton.style.display = 'none';
  }
}

// show login or logout
showLoginLink();

// Load products
loadBooks();

showaddBookButton();