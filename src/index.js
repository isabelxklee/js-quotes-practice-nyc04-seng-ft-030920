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
        createNewQuote(quotesArray)
    })

function renderQuote(quote) {
    let quoteItem = document.createElement("li")
    quoteItem.classList.add("quote-card")

    quoteItem.innerHTML = `
        <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
        </blockquote>
    `
    quoteList.append(quoteItem)
   
    let likeButton = quoteItem.querySelector(".btn-success")
    let deleteButton = quoteItem.querySelector(".btn-danger")
    let likeNumber = quoteItem.querySelector("span")

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

function createNewQuote(quotesArray) {
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