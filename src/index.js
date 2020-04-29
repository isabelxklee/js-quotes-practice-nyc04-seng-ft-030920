const quotesURL = `http://localhost:3000/quotes?_embed=likes`
const quoteLikeURL = `http://localhost:3000/likes`
const quoteArrayURL = `http://localhost:3000/quotes`
const quoteList = document.getElementById("quote-list")
const newForm = document.getElementById("new-quote-form")

fetch(quotesURL)
    .then(r => r.json())
    .then((quotesArray) => {
        quotesArray.forEach((quote) => {
            renderQuote(quote)
        })
        createNewQuote()
        createQuoteEditForm()
    })

function createQuoteEditForm() {
    let body = document.querySelector(".container")
    let editForm = document.createElement('form')
    editForm.classList.add("edit-form")

    editForm.innerHTML = 
        `<div class="form-group">

        <label for="new-quote">Edit quote</label>
        <input name="quote" type="text" class="form-control" id="edit-quote" placeholder="Quote content">
        <label for="new-quote">Edit author</label>

        <input name="quote" type="text" class="form-control" id="edit-author" placeholder="Author content">
        <input type="submit" class="btn btn-primary"></input>

        </div>`
    
    body.append(editForm)
}

function renderQuote(quote) {
    let quoteItem = document.createElement("li")
    quoteItem.classList.add("quote-card")
    quoteItem.id = `${quote.id}`

    quoteItem.innerHTML = `
        <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn'>Edit</button>
        <button class='btn-danger'>Delete</button>
        </blockquote>
    `

    quoteList.append(quoteItem)

    let quoteContent = quoteItem.querySelector(".mb-0")
    let authorContent = quoteItem.querySelector(".blockquote-footer")

    let likeButton = quoteItem.querySelector(".btn-success")
    let editButton = quoteItem.querySelector(".btn")
    let deleteButton = quoteItem.querySelector(".btn-danger")
    let likeNumber = quoteItem.querySelector("span")

    editButton.addEventListener("click", (event) => {
        populateEditForm(quote)
    })

    deleteButton.addEventListener("click", (event) => {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE"
            })
            .then(r => r.json())
            .then(quoteItem.remove())
        })

    likeButton.addEventListener("click", (event) => {
        fetch(quoteLikeURL, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                quoteId: quote.id,
            })
        })
            .then(r => r.json())
            .then((newLike) => {
                console.log(quote.likes)
                quote.likes.push(newLike)
                likeNumber.innerText = quote.likes.length
            })
    })
}

function createNewQuote() {
    newForm.addEventListener("submit", (event) => {
        event.preventDefault()

        let newQuoteContent = event.target["new-quote"].value
        let newAuthor = event.target.author.value

        fetch(quoteArrayURL, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                quote: newQuoteContent,
                author: newAuthor
            })
        })
            .then(r => r.json())
            .then((newQuote) => {
                newQuote.likes = []
                renderQuote(newQuote)
            })
    })
}

function populateEditForm(quote) {
    const editQuoteForm = document.querySelector(".edit-form")

    let editQuoteInput = editQuoteForm.querySelector("#edit-quote")
    let editAuthorInput = editQuoteForm.querySelector("#edit-author")

    editQuoteInput.value = quote.quote
    editAuthorInput.value = quote.author

    let quoteItem = quoteList.querySelector(`[id='${quote.id}']`)
    let quoteContent = quoteItem.querySelector(".mb-0")
    let authorContent = quoteItem.querySelector(".blockquote-footer")

    editQuoteForm.addEventListener("submit", (event) => {
        event.preventDefault(),
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                quote: editQuoteInput.value,
                author: editAuthorInput.value,
            })
        })
            .then(r => r.json())
            .then((editedObj) => {
                console.log("This quote got updated!")
                quoteContent.innerText = editedObj.quote
                authorContent.innerText = editedObj.author
                editQuoteForm.reset()
                console.log(quoteContent, authorContent)
            })
        })
}