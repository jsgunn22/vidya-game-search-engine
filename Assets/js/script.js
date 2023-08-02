// common tailwind styles / space is added at beginning and end of string so additional styles can be added after each instance
const h1 = " text-h1  font-bold  text-neu-0 ";
const h2 = " text-h2  font-bold  text-neu-0 ";
const h3 = " text-h3  font-semibold  text-neu-0 ";
const h4 = " text-h4  font-medium  text-neu-0 ";
const smTxt = " text-sm  text-neu-0 ";
const mdTxt = " text-med text-neu-0 ";
const lgTxt = " text-lg text-neu-0 ";
const btn =
  " bg-pri-5  rounded  px-4  py-3  h-10  cursor-pointer hover:bg-pri-9 " + h4;
const input =
  " bg-neu-8  text-neu-0  h-10  rounded  px-3  mr-4  w-80 outline-none outline-offset-[-2px] focus:outline-pri-5 ";
const grid = " wrapDiv flex flex-wrap gap-4";
const card =
  " card p-4 text-neu-0  bg-neu-8 w-[340px] rounded-lg shadow-md cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_25px_-5px] hover:shadow-pri-5 ";

// CORE APP
$(function () {
  let nav = $("nav");
  let root = $("#root");

  // NAV BAR LISTENERS
  let returnToLandingBtn = nav.children().eq(0);
  let freeGamesBtn = nav.children().eq(1).children().eq(0);
  let searchHistoryBtn = nav.children().eq(1).children().eq(1);
  let iveReviewedBtn = nav.children().eq(1).children().eq(2);

  returnToLandingBtn.on("click", function () {
    landingPage();
  });

  freeGamesBtn.on("click", function () {
    getFreeGames();
  });

  searchHistoryBtn.on("click", function () {
    searchHistory();
  });

  iveReviewedBtn.on("click", function () {
    getReviewed();
  });

  // COMMON FUNCTIONS
  // clears dom before re rendering
  function clearDom() {
    root.text("");
    root.css({ backgroundImage: "none", height: "100%" });
    root.removeClass(" flex");
    root.addClass(
      "    block  bg-cover h-full  bg-no-repeat p-8  bg-neu-9  bg-none "
    );
  }

  // renders searchvar when called
  function getSearchBar() {
    let searchBarDiv = $("<div>");
    let searchField = $("<input>");
    let searchBtn = $("<button>");

    searchField.addClass(input);
    searchBtn.addClass(btn);
    searchBarDiv.addClass(" flex  mb-4");

    root.append(searchBarDiv);
    searchBarDiv.append(searchField);
    searchBarDiv.append(searchBtn);
    searchBtn.text("Go!");
    searchField.attr({
      placeholder: "Search Title or Genre",
      id: "searchField",
    });
    searchBtn.on("click", getSearchResults);

    searchField.keypress(function (event) {
      if (event.which == 13) {
        searchBtn.click();
      }
    });
  }

  // renders card grid when called to house cards
  function getGrid() {
    let gridDiv = $("<div>");
    root.append(gridDiv);
    gridDiv.addClass(grid);
  }

  // renders a card for each game when called in for loop
  function getCard(
    id,
    imgSrc,
    titleSrc,
    releaseSrc,
    altLabel,
    altSrc,
    timeBool,
    timeSrc,
    steamBool,
    steamUrl
  ) {
    // imgSrc = data point for game thumbnail
    // titleSrc = data point for game title
    // releaseSrc = data point for game release date
    // altLabel = (string) the label for the data point.
    // altSrc = value or game rating data point.
    // timeBool = (boolean) used for free games to add another line item for givaway end date
    // timeSrc = value of the end date.
    // steamBool = (boolean) triggers the card click state to launch steamURL
    // steamUrl = url from the gamerpower API passed in
    let newCard = $("<div>");
    let img = $("<img>");
    let title = $("<h3>");
    let release = $("<p>");
    let altDiv = $("<div>");
    let ratingDiv = $("<div>");
    let ratingLabel = $("<p>");
    let rating = $("<h2>");
    let idConst = $("<p>" + id + "</p>");

    // renders card on .grid
    $(".wrapDiv").append(newCard);

    // holds the id collected from the api for storage
    newCard.append(idConst);
    idConst.css("display", "none").attr("id", "id");

    // renders each line item on card
    newCard.append(img);
    newCard.append(title);
    newCard.append(release);
    newCard.append(altDiv);
    altDiv.append(ratingDiv);
    ratingDiv.append(ratingLabel);
    ratingDiv.append(rating);

    // sets styles for card
    newCard.addClass(card + " relative h-[360px] ");
    img.addClass("w-full h-[168px] object-cover");
    title.addClass(h3 + " mt-4 line-clamp-2 mx-h-[40px]");
    release.addClass(smTxt + " mb-6  text-neu-3");
    altDiv.addClass("flex w-full absolute left-0 bottom-4 px-4");
    rating.addClass(h2);
    ratingLabel.addClass(" text-sm  text-neu-3");

    // conditional for release date text
    if (!releaseSrc) {
      releaseSrc = "Release: (TBA)";
    }

    if (altSrc == "N/A") {
      rating.addClass(" text-neu-5 ");
    }

    // conditional for free game card to add the date the giveaway ends
    if (timeBool) {
      let timeDiv = $("<div>");
      let timeLabel = $("<p>");
      let timeLeft = $("<h2>");

      altDiv.append(timeDiv);
      timeDiv.append(timeLabel);
      timeDiv.append(timeLeft);

      timeDiv.addClass("text-right ml-auto");
      timeLabel.addClass(" text-sm  text-neu-3");
      timeLeft.addClass(h2);

      timeLabel.text("Giveaway ends");

      if (!timeSrc || timeSrc == "N/A") {
        timeSrc = "N/A";
        timeLeft.addClass("text-neu-5");
        timeLeft.text(timeSrc);
      } else {
        timeLeft.text(formatDate(timeSrc));
      }

      if (steamBool) {
        newCard.on("click", function () {
          window.open(steamUrl, "_blank");
        });
      }
    }

    // data from returned results goes here
    img.attr("src", imgSrc);
    title.text(titleSrc);
    release.text(releaseSrc);
    ratingLabel.text(altLabel);
    rating.text(altSrc);
  }

  // listener for cards - temporily prints game title in console - will eventually render that games info page.
  root.on("click", ".card", function () {
    let id = $(this).children("#id").text();
    let title = $(this).children().eq(2).text();
    singleTitle(id, title);
  });

  // converts realease received from RAWG to "Jan 2023 format"
  function formatDate(u) {
    const releaseUnix = Date.parse(u);
    const date = new Date(releaseUnix);
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  }

  function saveToLocalStorage(id, title) {
    let thisGame = {
      thisId: id,
      thisTitle: title,
    };

    let existingViewedGames = JSON.parse(localStorage.getItem("viewedGames"));
    if (existingViewedGames === null) {
      existingViewedGames = [];
    }

    // if an id of a saved game already exists in localStorage this will move that id to be beginning of the array
    if (
      JSON.stringify(existingViewedGames).includes(JSON.stringify(thisGame))
    ) {
      existingViewedGames.push(
        existingViewedGames.splice(
          existingViewedGames.findIndex((v) => v == JSON.stringify(thisGame)),
          1
        )[0]
      );
      localStorage.setItem("viewedGames", JSON.stringify(existingViewedGames));
    } else {
      existingViewedGames.push(thisGame);
      localStorage.setItem("viewedGames", JSON.stringify(existingViewedGames));
    }
  }

  // when the review form is done we can plug in the data with this function
  function saveReviewToLocal(id, title, score, comment) {
    // id = RAWG id for recollecting game data later
    let dateOfReview = formatDate(new Date());

    let thisReview = {
      thisId: id,
      thisTitle: title,
      thisScore: score,
      thisComment: comment,
      thisDate: dateOfReview,
    };

    let existingReviews = JSON.parse(localStorage.getItem("myReviews"));

    if (existingReviews === null) {
      existingReviews = [];
    }

    // if a review for a game exists already this will over ride it and move it to the end of the array
    if (
      existingReviews.filter((e) => e.thisId == thisReview.thisId).length > 0
    ) {
      let oldReview = existingReviews.findIndex(
        (e) => e.thisId == thisReview.thisId
      );
      existingReviews.splice(oldReview, 1);
      existingReviews.push(thisReview);

      localStorage.setItem("myReviews", JSON.stringify(existingReviews));
    } else {
      existingReviews.push(thisReview);
      localStorage.setItem("myReviews", JSON.stringify(existingReviews));
    }
  }

  // PAGE RENDERS
  // renders landing page
  function landingPage() {
    clearDom();
    // sets background image and opacity
    root.css({
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images8.alphacoders.com/954/thumb-1920-954028.jpg)",
      height: "calc(100vh - 56px)",
    });
    root.addClass(" flex");

    let greetingDiv = $("<div>");
    let greeting = $("<h1>");
    let subGreeting = $("<h3>");
    let searchField = $("<input>");
    let searchBtn = $("<button>");

    let apiP = $("<p>");
    let apiDiv = $("<div>");
    let apiImgGamer = $("<img>");
    let apiAmper = $("<h2>");
    let apiRawg = $("<img>");

    root.append(greetingDiv);
    greetingDiv.append(greeting);
    greetingDiv.append(subGreeting);
    greetingDiv.append(searchField);
    greetingDiv.append(searchBtn);

    greetingDiv.append(apiP);
    greetingDiv.append(apiDiv);
    apiDiv.append(apiImgGamer);
    apiDiv.append(apiAmper);
    apiDiv.append(apiRawg);

    greeting.text("Your next adventure awaits...");
    subGreeting.text(
      "Search from 1000s of games by title or genre to compare reviews and prices"
    );
    searchField.attr({
      placeholder: "Search Title or Genre",
      id: "searchField",
    });
    searchBtn.text("Show me what you've got!");

    apiP.text("Powered by");
    apiP.addClass(h4 + "mt-8");

    apiDiv.addClass("flex justify-center align-center gap mr-8 mt-2");
    apiImgGamer.attr("src", "images/gamerpower.png ");
    apiAmper.css({
      position: "relative",
      top: "10px",
      margin: "0 5px",
    });
    apiAmper.text("&");
    apiAmper.addClass(h2);
    apiRawg.attr("src", "images/RAWG.png");

    greetingDiv.addClass(" text-center  m-auto");
    greeting.addClass(h1 + "  mb-1 ");
    subGreeting.addClass(h3 + "  mb-6");
    searchField.addClass(input + " text-center");
    searchBtn.addClass(btn + "  block  mt-4  mx-auto");

    searchBtn.on("click", getSearchResults);
    searchField.keypress(function (event) {
      if (event.which == 13) {
        getSearchResults();
      }
    });
  }

  // fetch for RAWG API
  async function getGame(gameName) {
    let fetchGame =
      "https://api.rawg.io/api/games?search=" +
      gameName +
      "&search_exact=true&page_size=5000&ordering=released&key=decffd508da34a34bc289acf081e71c0";

    if (!gameName) {
      emptyStateSearch();
      return;
    }

    const response = await fetch(fetchGame);
    const data = await response.json();
    return data;
  }

  // fetch for Gamer Power API
  function freeGames() {
    const settings = {
      async: true,
      crossDomain: true,
      url: "https://gamerpower.p.rapidapi.com/api/giveaways",
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "ec68b97893mshf85a5138dcd165ep1180d5jsnc5fcd51d8dc9",
        "X-RapidAPI-Host": "gamerpower.p.rapidapi.com",
      },
    };

    return $.ajax(settings).done(function (response) {
      return response;
    });
  }

  //renders Stuff I've Reviewed Page when nav link is clicked
  function getReviewed() {
    window.scrollTo(0, 0); // scrolls to top of page on render
    clearDom();
    getSearchBar();
    getGrid();

    // Displays message or

    // gets localStorage 'myReviews' and parses to an array
    let myReviews = JSON.parse(localStorage.getItem("myReviews"));

    if (!myReviews || myReviews.length == 0) {
      emptyStateReview();
      myReviews = [];
    }

    myReviews.reverse();

    // creates a reviewed game for every item stored in the array
    $.each(myReviews, function (i) {
      let indexer = myReviews[i];

      // search for that title but...
      getGame(indexer.thisTitle).then(function (gameData) {
        $.each(gameData.results, function (y) {
          let x = gameData.results[y];

          // only display that title if the id from RAWG matches the one we stored...
          if (x.id == indexer.thisId) {
            getCard(
              x.id,
              x.background_image,
              x.name,
              "Reviewed on: " + indexer.thisDate,
              "My Score",
              indexer.thisScore + "/10"
            );
          }
        });
      });
    });
  }

  //renders Stuff I've Reviewed Page when nav link is clicked
  function searchHistory() {
    window.scrollTo(0, 0); // scrolls to top of page on render
    clearDom();
    getSearchBar();
    getGrid();

    // gets localStorate 'viewedGames' and parse to an array
    let history = JSON.parse(localStorage.getItem("viewedGames"));

    if (!history || history.length == 0) {
      emptyStateHistory();
      history = [];
    }

    history.reverse();

    // for each item in history...
    $.each(history, function (i) {
      let indexer = history[i];

      // search for that title but...
      getGame(indexer.thisTitle).then(function (gameData) {
        $.each(gameData.results, function (y) {
          let x = gameData.results[y];
          let thisScore = x.metacritic;

          // conditional for altScr text
          if (!thisScore || thisScore == "N/A") {
            thisScore = "N/A";
          } else {
            thisScore = thisScore + "/100";
          }

          // only display that title if the id from RAWG matches the one we stored...
          if (x.id == indexer.thisId) {
            //then print that card
            getCard(
              x.id,
              x.background_image,
              x.name,
              formatDate(x.released),
              "Metacritic score",
              thisScore
            );
          }
        });
      });
    });
  }

  // renders a list of a games and DLC that are currently free on Steam
  function getFreeGames() {
    window.scrollTo(0, 0); // scrolls to top of page on render
    freeGames().then(function (gameData) {
      clearDom();

      let heading = $('<h1 class="' + h2 + '">Free Games & DLC!</h1>');
      let subHeading = $(
        '<p class="' +
          mdTxt +
          ' text-neu-3 ">The following items are currenty available for download for free on Steam<p>'
      );

      root.append(heading);
      root.append(subHeading);

      subHeading.addClass(" mb-4");

      getGrid();

      // prints cards to grid
      $.each(gameData, function (i) {
        let indexer = gameData[i];
        getCard(
          indexer.id,
          indexer.thumbnail,
          indexer.title,
          formatDate(indexer.published_date),
          "Value",
          indexer.worth,
          true,
          indexer.end_date,
          true,
          indexer.open_giveaway_url
        );
      });
    });
  }

  // renders the add review form modal
  function displayModal(id, title, text, score) {
    let cardContainer = $("<div>");
    cardContainer.addClass(
      " cardContainer grid grid-cols-3 p-4 text-neu-0 bg-neu-9 rounded-lg shadow-md sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 max-w-[640px]  "
    );
    cardContainer.css({
      "z-index": "20",
      margin: "0 auto",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    });
    $("body").append(cardContainer);

    let gameTitle = $("<h3>");
    gameTitle.addClass("col-span-2 text-h3 font-semibold text-neu-0 mt-4 mb-4");
    gameTitle.text(title);
    cardContainer.append(gameTitle);

    let exitBtn = $("<button>");
    exitBtn.addClass("col-start-3  w-10 ml-auto hover:text-neu-3 ");
    exitBtn.attr("id", "exitBtn");
    exitBtn.text("\u00D7");
    cardContainer.append(exitBtn);

    exitBtn.on("click", function () {
      cardContainer.remove();
      overlay.remove();
    });

    let myScore = $("<p>");
    myScore.addClass(" col-span-2 text-neu-0 mb-2 text-neu-3 text-medium ");
    myScore.text("My Score: ");
    cardContainer.append(myScore);

    let buttonContainer = $("<div>");
    buttonContainer.addClass("col-span-3 grid-cols-10 flex");

    let buttons = [];
    let reviewScore;

    // if a score is passed in it will set the default score in the modal
    if (score) {
      reviewScore = score;
    }

    // renders 1 through 10 score buttons
    for (let i = 1; i <= 10; i++) {
      let button = $("<button>");
      button.text(i);
      button.addClass(
        "bg-neu-8 rounded ratingBtnClass h-10 cursor-pointer hover:bg-opac-pri active:bg-opac-pri active:outline-pri-5 active:outline active:outline-2 w-full"
      );

      if (i > 1) {
        button.addClass(" ml-1");
      }
      buttons.push(button);

      button.on("click", function () {
        buttons.forEach((btn) => btn.removeClass("bg-pri-5"));
        $(this).addClass("bg-pri-5");
        if ($(this).hasClass("bg-pri-5")) {
          reviewScore = $(this).text();
        }
      });
      buttonContainer.append(button);

      // sets background color of score level on load if i am in edit mode
      if (i == score) {
        button.addClass("bg-pri-5");
      }
    }
    cardContainer.append(buttonContainer);

    let textarea = $("<textarea>");
    textarea.attr("placeholder", "My Notes");
    textarea
      .addClass(
        "col-span-3  bg-neu-8 text-neu-0 rounded px-3 mr-4 mt-4 w-full "
      )
      .css("margin-bottom", "16px");
    let gameComment;
    cardContainer.append(textarea);
    // populates the text area if i am in edit mode
    if (text) {
      textarea.text(text);
      var totalHeight =
        textarea.prop("scrollHeight") -
        parseInt(textarea.css("padding-top")) -
        parseInt(textarea.css("padding-bottom"));
      textarea.css({ height: totalHeight });
    }

    textarea.on("input", function () {
      gameComment = $(this).val();
    });

    // text area height will be based on its content.
    textarea.on({
      input: function () {
        var totalHeight =
          $(this).prop("scrollHeight") -
          parseInt($(this).css("padding-top")) -
          parseInt($(this).css("padding-bottom"));
        $(this).css({ height: totalHeight });
      },
    });

    // if a review exists for this game then give the user the ability to delete that review
    if (text && score) {
      let deleteBtn = $("<button>");
      deleteBtn.text("Delete Review");
      deleteBtn.addClass(
        "px-4 mr-auto py-3 h-10 text-dan-5 hover:scale-[1.02] col-span-2 hover:text-dan-9 redT"
      );
      cardContainer.append(deleteBtn);

      // function to delete the item from localStorage
      deleteBtn.on("click", function () {
        textarea.val("");
        buttons.forEach((btn) => btn.removeClass("bg-pri-5"));
        reviewScore = null;
        gameComment = null;
        let getLocal = JSON.parse(localStorage.getItem("myReviews"));
        let getIndex = getLocal.findIndex((v) => v.thisId == id);
        if (getIndex > -1) {
          getLocal.splice(getIndex, 1);
          localStorage.setItem("myReviews", JSON.stringify(getLocal));
          singleTitle(id, title);
          cardContainer.remove();
          overlay.remove();
        }
      });
    }
    let savebtn = $("<button>");
    savebtn.addClass(
      "ml-auto col-start-3  bg-pri-5 rounded px-4 py-3 h-10 cursor-pointer hover:bg-pri-9 text-h4 font-medium text-neu-0"
    );
    savebtn.css({
      width: "80%",
    });
    savebtn.text("Save");
    cardContainer.append(savebtn);

    // function to add the item to local storage
    savebtn.on("click", function () {
      // warning logic for form submission
      if (!gameComment && !reviewScore) {
        let warningText = $("<p>");
        cardContainer.append(warningText);
        warningText.addClass(
          "text-war-5 w-full px-4 py-3 bg-opac-war rounded col-span-3 mt-4"
        );
        warningText.text(
          "Select a review score and enter a comment to continue"
        );
        textarea.addClass(" outline outline-war-5 outline-1");
        myScore.addClass("text-war-5");
      } else if (!gameComment) {
        let warningText = $("<p>");
        cardContainer.append(warningText);
        warningText.addClass(
          "text-war-5 w-full px-4 py-3 bg-opac-war rounded col-span-3 mt-4"
        );
        warningText.text("Enter a comment to continue");
        textarea.addClass(" outline outline-war-5 outline-1");
      } else if (!reviewScore) {
        let warningText = $("<p>");
        cardContainer.append(warningText);
        warningText.addClass(
          "text-war-5 w-full px-4 py-3 bg-opac-war rounded col-span-3 mt-4"
        );
        warningText.text("Select a review score to continue");
        myScore.addClass("text-war-5");
      } else {
        saveReviewToLocal(id, title, reviewScore, gameComment);
        singleTitle(id, title);
        cardContainer.remove();
        overlay.remove();
      }
    });

    let overlay = $("<div>");
    overlay.addClass("fixed top-0 left-0 w-full h-full z-10 ");
    overlay.css("background", "rgba(0, 0, 0, 0.6)");
    $("body").append(overlay);

    overlay.click(function () {
      if (!$(this.target).is(".cardContainer")) {
        cardContainer.remove();
        overlay.remove();
      }
    });
  }

  // prints search results on page
  function getSearchResults() {
    window.scrollTo(0, 0); // scrolls to top of page on render
    getGame($("#searchField").val()).then(function (gameData) {
      if (gameData.results.length == 0) {
        emptyStateSearch();
        return;
      }

      // gets Promise from getGame() and loads page when fullfilled.
      clearDom();
      getSearchBar();
      getGrid();

      gameData.results.reverse(); // reverses the array of search results so the newest game will appear first

      $.each(gameData.results, function (i) {
        let isOfficial = gameData.results[i].added; // The RAWG API has a lot of unofficial data.  This will help us condition if content is legitimate.  We may need to use other keypairs in the object
        let indexer = gameData.results[i];
        let thisScore = indexer.metacritic;

        // conditional for altScr text
        if (!thisScore || thisScore == "N/A") {
          thisScore = "N/A";
        } else {
          thisScore = thisScore + "/100";
        }

        if (isOfficial > 10) {
          getCard(
            indexer.id,
            indexer.background_image,
            indexer.name,
            formatDate(indexer.released),
            "Metacritic Score",
            thisScore,
            false
          );
        }
      });
    });
  }

  function emptyStateSearch() {
    clearDom();
    getSearchBar();
    let messageDiv = $("<div>");
    let message = $("<h2>");
    let subMessage = $("<h4>");

    root.append(messageDiv);
    messageDiv.append(message);
    messageDiv.append(subMessage);

    messageDiv.addClass(" text-center  mt-4 ");
    message.addClass(h2 + "  mb-1 ");
    subMessage.addClass(h4);

    message.text(
      "It looks like the game you're searching for is not in our database."
    );
    subMessage.text(
      "Please search for another game or make sure your spelling is correct."
    );
  }

  // renders message when reviews page has no data saved to local storage
  function emptyStateReview() {
    let messageDiv = $("<div>");
    let message = $("<h2>");
    let subMessage = $("<h4>");

    root.append(messageDiv);
    messageDiv.append(message);
    messageDiv.append(subMessage);

    messageDiv.addClass(" text-center  mt-4 ");
    message.addClass(h2 + "  mb-1 ");
    subMessage.addClass(h4);

    message.text("Looks like you need to write some reviews!");
    subMessage.text(
      "Go ahead, search your favorite game and give it a review!"
    );
  }

  // renders message when history page has no data saved to local storage
  function emptyStateHistory() {
    let messageDiv = $("<div>");
    let message = $("<h2>");
    let subMessage = $("<h4>");

    root.append(messageDiv);
    messageDiv.append(message);
    messageDiv.append(subMessage);

    messageDiv.addClass(" text-center  mt-4 ");
    message.addClass(h2 + "  mb-1 ");
    subMessage.addClass(h4);

    message.text("You haven't searched anything yet?");
    subMessage.text("Games you save for will hang out here on this page.");
  }

  // call this function in the single title page and pass in the id
  function isGameReviewed(paramId) {
    let myReviews = JSON.parse(localStorage.getItem("myReviews"));

    $.each(myReviews, function (i) {
      let x = myReviews[i];

      if (x.thisId == paramId) {
        printReview(x.thisTitle, x.thisDate, x.thisComment, x.thisScore);

        function printReview(title, date, notes, score) {
          // elements to be rendered
          let reviewCard = $("<div>");
          let headerDiv = $("<div>");
          let titleDiv = $("<div>");
          let titleText = $("<h1>");
          let reviewDate = $("<p>");
          let editBtn = $("<button>");
          let bodyDiv = $("<div>");
          let notesDiv = $("<div>");
          let notesLabel = $("<h3>");
          let notesText = $("<p>");
          let scoreDiv = $("<div>");
          let scoreTextDiv = $("<div>");
          let scoreValueText = $("<h1>");
          let scoreOutOfText = $("<h3>");
          let scoreBarDiv = $("<div>");
          let scoreValue = $("<div>");

          root.append(reviewCard);
          reviewCard.addClass("p-4 bg-neu-8 rounded-lg mt-4 ");

          // HEADER DIV SECTION
          reviewCard.append(headerDiv);
          headerDiv.append(titleDiv);
          titleDiv.append(titleText);
          titleDiv.append(reviewDate);
          headerDiv.append(editBtn);

          headerDiv.addClass("flex mb-8");
          titleText.addClass(h1 + "mr-4 mb-1");
          reviewDate.addClass(lgTxt + "text-neu-3");
          editBtn.addClass(btn + " ml-auto ");

          titleText.text("My review of " + title);
          reviewDate.text("Reviewed on: " + date);
          editBtn.text("Edit My Review");

          // BODY DIV SECTION
          reviewCard.append(bodyDiv);
          bodyDiv.append(notesDiv);
          notesDiv.append(notesLabel);
          notesDiv.append(notesText);
          bodyDiv.append(scoreDiv);
          scoreDiv.append(scoreTextDiv);
          scoreTextDiv.append(scoreValueText);
          scoreTextDiv.append(scoreOutOfText);
          scoreDiv.append(scoreBarDiv);
          scoreBarDiv.append(scoreValue);

          bodyDiv.addClass("flex");
          notesDiv.addClass("mr-4 w-full");
          notesLabel.addClass(h3 + " mb-2");
          notesText.addClass(mdTxt);
          scoreDiv.addClass("center p-8 w-full grid place-items-center");
          scoreTextDiv.addClass("flex mb-6");
          scoreValueText.addClass(h1);
          scoreOutOfText.addClass(h3 + " text-neu-3 mt-auto mb-1");
          scoreBarDiv
            .attr({ id: "scoreBarDiv" })
            .addClass("bg-neu-7 w-3/6 h-10 rounded-lg overflow-hidden ");
          scoreValue.addClass("bg-pri-5 w-full h-full");

          notesLabel.text("My Notes");
          notesText.text(notes);
          scoreValueText.text(score);
          scoreOutOfText.text("/10");

          // logic to get chart proportions
          let inputScore = parseInt(score); // parse score to a number
          let barWidth = $("#scoreBarDiv").width(); // gets the width of the bar which changes at different view ports
          let scoreBarValue = barWidth - (barWidth / 10) * inputScore; // calculates what the right padding should be
          scoreBarDiv.css("padding-right", scoreBarValue + "px"); // sets the right padding the offsets the bar to communicate the score

          editBtn.on("click", function () {
            displayModal(paramId, x.thisTitle, x.thisComment, x.thisScore);
          });
        }
      }
    });
  }

  landingPage(); // renders the landing page on load

  async function getGameDetails(id) {
    let fetchGame =
      "https://api.rawg.io/api/games/" +
      id +
      "?key=decffd508da34a34bc289acf081e71c0";

    const response = await fetch(fetchGame);
    const data = await response.json();
    return data;
  }

  function singleTitle(id, title) {
    window.scrollTo(0, 0); // scrolls to top of page on render
    getGame(title).then(function (gameData) {
      $.each(gameData.results, function (x) {
        let indexer = gameData.results[x];
        if (indexer.id == id) {
          getGameDetails(id).then(function (gameDetails) {
            clearDom();
            getSearchBar();

            let gameDetailsCard = $("<div>");
            let gameImgDiv = $("<div>");
            let gameImg = $("<img>");
            let ratingDiv = $("<div>");
            let metacriticScore = $("<h2>");
            let metacriticLabel = $("<p>");
            let detailsDiv = $("<div>");
            let topDiv = $("<div>");
            let platformsDiv = $("<div>");
            let saveToBtn = $("<button>");
            let submitReviewBtn = $("<button>");
            let gameTitleText = $("<h1>");
            let developerText = $("<p>");
            let descriptionLabel = $("<h3>");
            let descriptionText = $("<p>");
            let tagsDiv = $("<div>");

            root.append(gameDetailsCard);
            gameDetailsCard.addClass(
              " p-4 text-neu-0  bg-neu-8  rounded-lg shadow-md flex "
            );

            // RENDERS
            gameDetailsCard.append(gameImgDiv);
            gameImgDiv.append(gameImg);
            gameImgDiv.append(ratingDiv);
            ratingDiv.append(metacriticScore, metacriticLabel);
            gameDetailsCard.append(detailsDiv);
            detailsDiv.append(topDiv);
            topDiv.append(platformsDiv);
            topDiv.append(saveToBtn);
            // topDiv.append(submitReviewBtn);
            detailsDiv.append(gameTitleText);
            detailsDiv.append(developerText);
            detailsDiv.append(descriptionLabel);
            detailsDiv.append(descriptionText);
            detailsDiv.append(tagsDiv);

            // STYLES
            gameImgDiv.addClass("w-full mr-4 relative max-h-[420px] ");
            gameImg.addClass("w-full h-full object-cover ");
            ratingDiv
              .addClass(" text-center bg-neu-9 absolute bottom-0 w-full")
              .css("padding", "8px 0");
            saveToBtn.addClass(
              " ml-auto border-solid border-pri-1 text-pri-1 border-2 h-10 px-4 bg-opac-pri rounded hover:bg-pri-5 "
            );
            metacriticScore.addClass(h2);
            metacriticLabel.addClass(h4);
            detailsDiv.addClass(" w-full ");
            topDiv.addClass(" flex").css("margin-bottom", "32px");
            platformsDiv.addClass(" flex  border-opac-neu ");
            platformsDiv.css("border-bottom", "solid 1px ");
            gameTitleText.addClass(h1 + " mb-1 ");
            developerText
              .addClass(lgTxt + " text-neu-3 mb-5")
              .css("margin-bottom", "32px");
            descriptionLabel.addClass(h3 + " mb-2 ");
            descriptionText.addClass(mdTxt);
            tagsDiv.addClass(" flex mt-4 w-full flex-wrap");

            // DATA INPUT
            // prints the list of platforms the game is available on

            gameImg.attr({ src: indexer.background_image });
            let thisScore = indexer.metacritic;

            // conditional for altScr text
            if (!thisScore || thisScore == "N/A") {
              thisScore = "N/A";
            } else {
              thisScore = thisScore + "/100";
            }
            metacriticScore.text(thisScore);
            metacriticLabel.text("Metacritic Score");
            gameTitleText.text(title);
            developerText.text("Developer: " + gameDetails.publishers[0].name);
            descriptionLabel.text("Game Description");
            descriptionText.text(gameDetails.description_raw);

            for (let p = 0; p < indexer.platforms.length; p++) {
              if (p < 4) {
                let platformItem = $("<p>");
                platformsDiv.append(platformItem);
                platformsDiv.addClass("pb-2");
                platformItem.addClass(mdTxt + " px-3 py-1 border-opac-neu");
                platformItem.css("padding", "4px 12px");

                if (p > 0 && p < 4) {
                  platformItem.css("border-left", "solid 1px");
                }

                if (p == 3) {
                  platformItem.text("+" + (indexer.platforms.length - 3));
                } else {
                  platformItem.text(indexer.platforms[p].platform.name);
                }
              }
            }

            let savedGames = JSON.parse(localStorage.getItem("viewedGames"));

            if (!savedGames) {
              savedGames = [];
            }

            if (savedGames.filter((e) => e.thisId == id).length > 0) {
              saveToBtn.text("Remove from List");
              saveToBtn.on("click", function () {
                let getIndex = savedGames.findIndex((v) => v.thisId == id);
                if (getIndex > -1) {
                  savedGames.splice(getIndex, 1);
                  localStorage.setItem(
                    "viewedGames",
                    JSON.stringify(savedGames)
                  );
                }
                singleTitle(id, title);
              });
            } else {
              saveToBtn.text("Save to List");
              saveToBtn.on("click", function () {
                saveToLocalStorage(id, title);
                saveToBtn.text("Remove from List");
                singleTitle(id, title);
              });
            }

            let tags = gameDetails.tags;

            // renders game tags truncated
            function shortTags() {
              for (let t = 0; t < tags.length; t++) {
                if (tags.length > 4) {
                  // if tags.length is more than 4 the last item in the list will be a roll up of the truncated tags
                  if (t < 3) {
                    let tag = $("<p>");
                    tagsDiv.append(tag);
                    tag.addClass(
                      " bg-sec-5  rounded text-sec-1 px-2 py-0.5 max-w-[176px] truncate"
                    );
                    tag.text(tags[t].name);
                    if (t > 0) {
                      tag.addClass("ml-1");
                    }
                  } else if (t == 3) {
                    let tag = $("<p>");
                    tagsDiv.append(tag);
                    tag.addClass(
                      " bg-sec-5  rounded text-sec-1 px-2 py-0.5 ml-1 "
                    );
                    tag.text("+ " + (tags.length - 3));

                    // button to show all tags
                    let showBtn = $("<h4>");
                    tagsDiv.append(showBtn);
                    showBtn.addClass(
                      h4 + " ml-4 my-1.5 cursor-pointer hover:text-sec-5"
                    );
                    showBtn.text("View All Tags");
                    showBtn.on("click", function () {
                      tagsDiv.text("");
                      longTags();
                    });
                  }
                } else {
                  /* if tags.length <= 4 renders the label for each tag */
                  let tag = $("<p>");
                  tagsDiv.append(tag);
                  tag.addClass(
                    " bg-sec-5  rounded text-sec-1 px-2 py-0.5 max-w-[176px] truncate"
                  );
                  tag.text(tags[t].name);
                  if (t > 0) {
                    tag.addClass("ml-1");
                  }
                }
              }
            }

            // renders all game tags when user clicks show all
            function longTags() {
              for (let t = 0; t < tags.length; t++) {
                let tag = $("<p>");
                tagsDiv.append(tag);
                tag.addClass(
                  " bg-sec-5  rounded text-sec-1 px-2 py-0.5 max-w-[176px] truncate mb-1"
                );
                tag.text(tags[t].name);
                if (t > 0) {
                  tag.addClass("ml-1");
                }
              }
              // button to truncate the tags
              let hideBtn = $("<h4>");
              tagsDiv.append(hideBtn);
              hideBtn.addClass(
                h4 + " ml-4 my-1.5 cursor-pointer hover:text-sec-5"
              );
              hideBtn.text("Show Less Tags");
              hideBtn.on("click", function () {
                tagsDiv.text("");
                shortTags();
              });
            }

            shortTags(); // renders short tags on single title load

            // if this game has a review it will print it below the deteails card.
            let myReviews = JSON.parse(localStorage.getItem("myReviews"));

            if (!myReviews) {
              myReviews = [];
            }

            if (myReviews.filter((e) => e.thisId == id).length > 0) {
              isGameReviewed(id);
            } else {
              topDiv.append(submitReviewBtn);
              submitReviewBtn.addClass(btn + " ml-4");
              submitReviewBtn.text("Submit a Review");
              submitReviewBtn.on("click", function () {
                displayModal(id, title);
              });
            }
          });
        }
      });
    });
  }
});
