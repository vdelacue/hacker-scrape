// append article(s) to page
const appendAllArticles = function () {
    $(".articles").empty();
    $.getJSON("/articles", function (data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].note == undefined) {
                $(".articles").append(`
        <span class=" float-left singleArticle">${data[i].image}  
        <p class="colM hl6" target="top-page" data-id="${data[i]._id}">
        ${data[i].title}<a href="${data[i].link}"class="alink">read me!</a></p>
        </span>`);
            } else {
                $(".articles").append(`
        <span class=" float-left singleArticle">${data[i].image}  
        <p class="colM headlines" target="top-page" data-id="${data[i]._id}">
        ${data[i].title}<a href="${data[i].link}" class="alink">read me!</a></p>
        <i class="fas fa-trash-alt ml-2 delete-note" data-id="${data[i].note}">click trash can to delete note</i></span>
        `);
            }
        }
    });
};
// call function when page loads
appendAllArticles();

// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    $(".articles").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            if (data.note == undefined) {
                $(".articles").append(`
          <span class=" float-left singleArticle">${data.image}  
          <p class="colM headlines" target="top-page" data-id="${data._id}">
          ${data.title}<a href="${data.link}" class="alink">click on this link to see article or click title to leave a note</a></p>
          `);
            } else {
                $(".articles").append(`
          <span class=" float-left singleArticle">${data.image}  
          <p class="colM headlines" target="top-page" data-id="${data._id}">
          ${data.title}<a href="${data.link}" class="alink">read me!</a></p>
          <i class="fas fa-trash-alt m-2 delete-note" data-id="${data.note}">click trash can to delete note</i></span>
          `);
            }
            // A textarea to add a new note body
            $("#notes").append(`
            <img class="media" id="giffy" src="https://media.giphy.com/media/7vfhdCIn13zm8/giphy.gif"
            alt="Card image cap"><label for="comment">Enter your title and comment for this article:</label><input id='titleinput' name='title'> <textarea class='form-control' rows='5' id='bodyinput' name='body'></textarea>`);
                // A button to submit a new note, with the id of the article saved to it
            $("#notes").append(
                `<button class="btn btn-secondary btn-block" 
                data-id="${data._id}" id='savenote'>Save Note
                </button>`
            );
            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(".delete-note").on("click", function (event) {
    var thisId = $(this).attr("data-id");
    // Send the DELETE request.
    $.ajax("/api/notes/" + thisId, {
        type: "DELETE"
    }).then(function () {
        console.log("deleted note", id);
        // Reload the page to get the updated list
        location.reload();
    });
});

$(document).on("click", "#newScrape", function () {
    // Empty the notes from the note section
    $("#notes").empty();

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/scrape"
        })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            location.reload();
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
            appendAllArticles();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});