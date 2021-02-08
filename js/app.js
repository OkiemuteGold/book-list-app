// add s/n column which increments
// do auto-correct, and auto-suggestion for input field using api
// make a "book open" icon show close to its title on hover of the row
// set link to open book details


// Book Class: Represents a book
class Book {
    constructor(title, author, isbn) {
        // this.number = number;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');
        const rowForList = document.createElement('tr');
        
        rowForList.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>
                <a href="#" class="btn btn-danger rounded-lg btn-sm delete-btn">X</a>
            </td>
        `;

        list.appendChild(rowForList);
        console.log(book.title);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete-btn')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        // <div class="alert alert-..."> ...Message... </div>
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${className}`;
        alertDiv.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(alertDiv, form);
        
        // Fade out and remove after 1.2seconds
        setTimeout(() => {
            $('.alert').fadeOut(400, function () {
                this.remove();
            });
        }, 1200);
    }
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add books
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit or default
    e.preventDefault();
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    }
    else {
        // Instantiate book
        const book = new Book(title, author, isbn);
        
        // Add book to UI
        UI.addBookToList(book);

        // Add book to localStorage
        Store.addBook(book);
        
        // Show success message
        UI.showAlert("Book added", "success");

        // Clear fields
        UI.clearFields();
    }    
});

// Event: Remove books
document.getElementById('book-list').addEventListener('click', (e) => {
    e.preventDefault();
    // Delete book from UI
    UI.deleteBook(e.target);

    // Remove book from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Book removed', 'success');
});