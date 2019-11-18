let curr_breaddit="";

/**
 * Auth function called when clicking the Login/Logout button.
 */
// [START buttoncallback]
function toggleSignIn() {
    if (!firebase.auth().currentUser) {
        // [START createprovider]
        var provider = new firebase.auth.GoogleAuthProvider();
        // [END createprovider]
        // [START addscopes]
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        // [END addscopes]
        // [START signin]
        firebase.auth().signInWithRedirect(provider);
        // [END signin]
    } else {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
    // [START_EXCLUDE]
    document.getElementById('googlesignin').disabled = true;
    // [END_EXCLUDE]
}
// [END buttoncallback]


/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 *  - firebase.auth().getRedirectResult(): This promise completes when the user gets back from
 *    the auth redirect flow. It is where you can get the OAuth access token from the IDP.
 */
function initApp() {
    // Result from Redirect auth flow.
    // [START getidptoken]
    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // [START_EXCLUDE]
            //document.getElementById('quickstart-oauthtoken').textContent = token;
        } else {
            //document.getElementById('quickstart-oauthtoken').textContent = 'null';
            // [END_EXCLUDE]
        }
        // The signed-in user info.
        var user = result.user;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
            // If you are using multiple auth providers on your app you should handle linking
            // the user's accounts here.
        } else {
            console.error(error);
        }
        // [END_EXCLUDE]
    });
    // [END getidptoken]

    // Listening for auth state changes.
    // [START authstatelistener]

    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            await add_pfp(photoURL);
            // [START_EXCLUDE]
            //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            document.getElementById('googlesignin').textContent = 'Sign out';
            $('#userprofile').html(`<img src="${user.photoURL}" id="pfp"> <span id="name"></span>`);
            //$('#profilepic').html(`<img src="${user.photoURL}" id="pic">`);
            //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            // [END_EXCLUDE]
            let name = await request_username(false, uid);
            $("#name").html(name);
            $("#nav").removeClass("hidden");
            $("#googlesignin").addClass("hidden");
            $("#changeuser").addClass("hidden");
            $("#notloggedin").addClass("hidden");
            $("#homepage").removeClass("hidden"); //switch to actual homepage;
            let allposts = await request_all_posts(false);
            console.log(allposts);
            let currPost = "";
            $("#breadditposts").html("");
            $("#posts").html("");
            $("#userposts").html("");
            $("#comments").html("");
            $("#usercomments").html("");
            for (postID in allposts) {
                currPost = allposts[postID];
                $("#posts").append(`<div class="hidden card w-100 mb-3 post" id="p${postID}"></div>`);
                await formPost(postID, currPost["author"],currPost["authorid"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
                $(`#p${postID}`).removeClass("hidden");
                $('#homepage').removeClass('hidden');
            }
            history.pushState({
                page: "home"
            },"Breaddit-welcome", null);
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('googlesignin').textContent = 'Sign in with Google';
            //document.getElementById('quickstart-account-details').textContent = 'null';
            //document.getElementById('quickstart-oauthtoken').textContent = 'null';
            $('#createuser').addClass("hidden");
            $('#nav').addClass("hidden");
            $("#profile").addClass("hidden");
            $("#newPost").addClass("hidden");
            $("#homepage").addClass("hidden");
            $("#changeuser").addClass("hidden");
            $("#breadditPage").addClass("hidden");
            $("#profileXtras").addClass("hidden");
            $("#postpage").addClass("hidden");
            $("#notloggedin").removeClass("hidden");
            history.pushState({
                page: "welcome"
            },"Breaddit-welcome", null);
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE]
        document.getElementById('googlesignin').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]

    document.getElementById('googlesignin').addEventListener('click', toggleSignIn, false);
}

window.onload = function () {
    initApp();
};

function formPost(postID, author, authorID,  subreddit, karma, title, body, numOfComments) {
    $(`#p${postID}`).html(`
        <div class="d-flex bd-highlight card-body breaddit" id=${subreddit}>
            <div class="p-2 bd-highlight float-left" id="votes">
                <a class="voteup"><i class="fas fa-caret-up vote-arrow up" id="u${postID}"></i></a>
                <div class="postCrumbs">${karma}</div>
                <a class="votedown"><i class="fas fa-caret-down vote-arrow down" id="d${postID}"></i></a>
            </div>
            <div class="p-2 flex-grow-1 bd-highlight float-right user" id="u${authorID}">
                <h6 class="card-subtitle mb-2 text-muted text-left"><strong class="text-white">b/<a href="#" class="postBreaddit text-white">${subreddit}</a></strong> • Posted by u/<a href="#" class="postAuthor text-muted" id="${authorID}">${author}</a></h6>
                <h5 class="card-title text-left"><strong>${title}</strong></h5>
                <p class="card-text text-left">${body}</p>
            </div>
        </div>
        <div class="card-body">
            <a href="#" class="postComments card-link text-muted float-left" id="${postID}"><i class="fas fa-comment-alt"></i> ${numOfComments} Comments</a>
        </div>
    `);
}

function formComment(commentID, author, authorID, karma, body, path) {
    $(`#c${commentID}`).html(`
        <div class="d-flex bd-highlight card-body path" id=${path}>
            <div class="p-2 bd-highlight float-left">
                <a class="voteup"><i class="fas fa-caret-up vote-arrow up" id="u${commentID}"></i></a>
                <br>
                <a class="votedown"><i class="fas fa-caret-down vote-arrow down" id="d${commentID}"></i></a>
            </div>
            <div class="p-2 flex-grow-1 bd-highlight float-right user" id="u${authorID}">
                <h6 class="card-subtitle mb-2 text-muted text-left"><strong><a href="#" class="postAuthor" id="${authorID}">${author}</a></strong> • <a href="#" class="commentCrumbs text-muted">${karma} points</a></h6>
                <p class="card-text text-left">${body}</p>
            </div>
        </div>
        <div class="card-body" id="r${commentID}">
            <a href="#" class="reply card-link text-muted float-left" id="${commentID}"><i class="fas fa-comment-alt"></i> Reply</a>
        </div>
    `);
}

function formProfileComment(commentID, author, authorID, karma, body, path) {
    $(`#c${commentID}`).html(`
        <div class="d-flex bd-highlight card-body path" id=${path}>
            <div class="p-2 bd-highlight float-left" id="votes">
                <a class="voteup"><i class="fas fa-caret-up vote-arrow up" id="u${commentID}"></i></a>
                <br>
                <a class="votedown"><i class="fas fa-caret-down vote-arrow down" id="d${commentID}"></i></a>
            </div>
            <div class="p-2 flex-grow-1 bd-highlight float-right content user" id="u${authorID}">
                <h6 class="card-subtitle mb-2 text-muted text-left"><strong>${author}</strong> • <a href="#" class="commentCrumbs text-muted">${karma} points</a></h6>
                <p class="card-text text-left">${body}</p>
            </div>
        </div>
        <div class="card-body" id="r${commentID}">
            <a href="#" class="commentDelete card-link text-muted float-right" id="d${commentID}">Delete</a>
        </div>
    `);
}

function formProfilePost(postID, author, authorID,  subreddit, karma, title, body, numOfComments) {
    $(`#p${postID}`).html(`
        <div class="d-flex bd-highlight card-body breaddit" id=${subreddit}>
            <div class="p-2 bd-highlight float-left" id="votes">
                <a class="voteup"><i class="fas fa-caret-up vote-arrow up" id="u${postID}"></i></a>
                <div class="postCrumbs">${karma}</div>
                <a class="votedown"><i class="fas fa-caret-down vote-arrow down" id="d${postID}"></i></a>
            </div>
            <div class="p-2 flex-grow-1 bd-highlight float-right user" id="u${authorID}">
                <h6 class="card-subtitle mb-2 text-muted text-left"><strong class="text-white">b/<a href="#" class="postBreaddit text-white">${subreddit}</a></strong> • Posted by u/<a id=${authorID}>${author}</a></h6>
                <h5 class="card-title text-left"><strong>${title}</strong></h5>
                <p class="card-text text-left">${body}</p>
            </div>
        </div>
        <div class="card-body">
            <a href="#" class="postComments card-link text-muted float-left" id="${postID}"><i class="fas fa-comment-alt"></i> ${numOfComments} Comments</a>
            <a href="#" class="postDelete card-link text-muted float-right" id="d${postID}">Delete</a>
        </div>
    `);
}

async function loadChildComments(parentReplies, cid){
    let replies = parentReplies["replies"];
    console.log(replies);
    let childComment="";
    for (commentID in replies){
        childComment = replies[commentID];
        $(`#c${cid}`).append(`<div class="hidden post card w-100 comment pl-2 pb-2 border-white border-top-0 border-bottom-0 border-right-0" id="c${commentID}">`);
        formComment(commentID, childComment["author"], childComment["authorID"], childComment["karma"], childComment["body"], childComment["path"]);
        $(`#c${commentID}`).removeClass("hidden");
        if(childComment["numOfReplies"] !== 0){
            loadChildComments(childComment, commentID);
        }
        $(`#c${cid}`).append(`</div>`);
    }
}

window.addEventListener("popstate", event => {
    if(event.state){
        let page = event.state.page;
        if(page === "welcome"){
            welcome();
        }
        else if (page === "home"){
            home();
        }
        else if (page === "post"){
            post(event.state.data);
        }
        else if (page === "profile"){
            profile(event.state.data);
        }
        else if (page === "myProfile"){
            myProfile();
        }
        else if(page === "postCreation"){
            postCreation(event.state.data);
        }
        else if(page === "breaddit"){
            breaddit(event.state.data);
        }
    }
});

async function welcome(){
    $("#nav").addClass("hidden");
    $("#breadditPage").addClass("hidden");
    $("#postpage").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#profileXtras").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#changeuser").addClass("hidden");
    $("#homepage").addClass("hidden");
    $("#googlesignin").removeClass("hidden");
    $("#notloggedin").removeClass("hidden");
}

async function home(){
    $("#nav").removeClass("hidden");
    $("#notloggedin").addClass("hidden");
    $("#breadditPage").addClass("hidden");
    $("#postpage").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#profileXtras").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#changeuser").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#homepage").removeClass("hidden");
    let allposts = await request_all_posts(false);
    console.log(allposts);
    let currPost = "";
    $("#breadditposts").html("");
    $("#posts").html("");
    $("#userposts").html("");
    $("#comments").html("");
    $("#usercomments").html("");
    for (postID in allposts) {
        currPost = allposts[postID];
        $("#posts").append(`<div class="hidden card w-100 mb-3 post" id="p${postID}"></div>`);
        await formPost(postID, currPost["author"],currPost["authorid"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
        $(`#p${postID}`).removeClass("hidden");
    }
}

async function post(postID){
    $("#nav").removeClass("hidden");
    $("#notloggedin").addClass("hidden");
    $("#breadditPage").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#profileXtras").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#changeuser").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#homepage").addClass("hidden");
    $("#postpage").removeClass("hidden");
    $("#breadditposts").html("");
    $("#posts").html("");
    $("#userposts").html("");
    $("#comments").html("");
    $("#usercomments").html("");
    const post = await request_post(false, postID);
    const authorID = post["authorid"];
    const author = post["author"];
    $("#crumbs").text(post["karma"]);
    $("#title").text(post["title"]);
    $("#body").text(post["body"]);
    curr_breaddit = post["subreddit"];
    $("#postInfo").html(`<strong class="text-white">b/<a href="#" class="postBreaddit text-white">${post["subreddit"]}</a></strong> • Posted by u/<a href="#" class="postAuthor text-muted" id="${authorID}">${author}</a>`);
    $("#totalComments").text(post["numOfComments"]);
    $(".submitNewComment").attr("id", postID);
    $(".upPost").attr("id", `u${postID}`);
    $(".downPost").attr("id", `d${postID}`);
    $(".postSet").attr("id", `p${postID}`);
    $(".breadditSet").attr("id", curr_breaddit);
    $(".userSet").attr("id", `u${authorID}`);
    let num = post["numOfComments"];
    let comments = post["comments"];
    console.log(post["comments"]);
    if(num > 0){
        let currComment = "";
        for (commentID in comments){
            currComment = comments[commentID];
            num = currComment["numOfReplies"];
            $("#comments").append(`<div class="hidden post card w-100 comment pl-2 pb-2 border-white border-top-0 border-bottom-0 border-right-0" id="c${commentID}">`);
            formComment(commentID, currComment["author"], currComment["authorid"], currComment["karma"], currComment["body"], currComment["path"]);
            $(`#c${commentID}`).removeClass("hidden");
            if(num != 0){
                loadChildComments(currComment, commentID);
            }
        }
        for(let i = 0; i<num; i++){
            $("#comments").append("</div>");
        }
        $("#comments").append("</div>");
    }
}

async function profile(userID){
    $(".postSet").removeAttr("id");
    $(".breadditSet").removeAttr("id");
    $(".userSet").removeAttr("id");
    $("#nav").removeClass("hidden");
    $("#notloggedin").addClass("hidden");
    $("#breadditPage").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#changeuser").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#homepage").addClass("hidden");
    $("#postpage").addClass("hidden");
    $("#profile").removeClass("hidden");
    $("#profileXtras").removeClass("hidden");
    let profile = await request_other_user(false, userID);
    let name = profile["name"];
    let karma = profile["karma"];
    $("#username").html(`u/${name}`);
    $("#usercrumbs").html(karma);
    let pfp = profile["pfp"];
    $('#profilepic').html(`<img src="${pfp}" id="pic">`);
    $("#userinfo").removeClass("blurred");
    let posts = profile["posts"];
    let comments = profile["comments"];
    console.log(posts);
    $("#breadditposts").html("");
    $("#posts").html("");
    $("#userposts").html("");
    $("#comments").html("");
    $("#usercomments").html("");
    let currPost="";
    let comment = "";
    for (postID in posts){
        currPost=posts[postID];
        $("#userposts").append(`<div class="hidden post card w-100 mb-3" id="p${postID}"></div>`);
        await formPost(postID, currPost["author"], currPost["authorid"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
        $(`#p${postID}`).removeClass("hidden");
    }
    for (commentID in comments){
        comment = comments[commentID];
        $("#usercomments").append(`<div class="hidden card w-100 mb-3 post" id="c${commentID}"></div>`);
        formProfileComment(commentID, comment["author"], comment["authorid"], comment["karma"], comment["body"], comment["path"]);
        $(`#c${commentID}`).removeClass("hidden");
    }
}

async function myProfile(){
    $(".postSet").removeAttr("id");
    $(".breadditSet").removeAttr("id");
    $(".userSet").removeAttr("id");
    $("#nav").removeClass("hidden");
    $("#notloggedin").addClass("hidden");
    $("#breadditPage").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#postpage").addClass("hidden");
    $("#homepage").addClass("hidden");
    $("#changeuser").removeClass("hidden");
    $("#profile").removeClass("hidden"); //show just profile and allow user to sign out
    $("#googlesignin").removeClass("hidden");
    $("#profileXtras").removeClass("hidden");
    let myProfile = await request_profile(false);
    console.log(myProfile);
    let name = myProfile["name"];
    let karma = myProfile["karma"];
    $("#username").html(`u/${name}`);
    $("#usercrumbs").html(karma);
    let pfp = myProfile["pfp"];
    $('#profilepic').html(`<img src="${pfp}" id="pic">`);
    $("#userinfo").removeClass("blurred");
    let myPosts = myProfile["posts"];
    let myComments = myProfile["comments"];
    console.log(myPosts);
    $("#breadditposts").html("");
    $("#posts").html("");
    $("#userposts").html("");
    $("#comments").html("");
    $("#usercomments").html("");
    let post="";
    let comment = "";
    for (postID in myPosts) {
        post = myPosts[postID];
        $("#userposts").append(`<div class="hidden card w-100 mb-3 post" id="p${postID}"></div>`);
        formProfilePost(postID, post["author"], post["authorid"], post["subreddit"], post["karma"], post["title"], post["body"], post["numOfComments"]);
        $(`#p${postID}`).removeClass("hidden");
    }
    for (commentID in myComments) {
        comment = myComments[commentID];
        $("#usercomments").append(`<div class="hidden card w-100 mb-3 post" id="c${commentID}"></div>`);
        formProfileComment(commentID, comment["author"], comment["authorid"], comment["karma"], comment["body"], comment["path"]);
        $(`#c${commentID}`).removeClass("hidden");
    }
}

async function postCreation(breaddit){
    $("#nav").removeClass("hidden");
    $("#notloggedin").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#profileXtras").addClass("hidden");
    $("#changeuser").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#homepage").addClass("hidden");
    $("#postpage").addClass("hidden");
    $("#breadditPage").addClass("hidden");
    $("#postBreaddit").html(breaddit);
    $("#newPost").removeClass("hidden");
    
}

async function breaddit(breaddit){
    $(".postSet").removeAttr("id");
    $(".breadditSet").removeAttr("id");
    $(".userSet").removeAttr("id");
    $("#nav").removeClass("hidden");
    $("#notloggedin").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#profileXtras").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#changeuser").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#homepage").addClass("hidden");
    $("#postpage").addClass("hidden");
    $("#breadditPage").removeClass("hidden");
    $("#breadditname").html(breaddit);
    let breadditHasPosts = await request_breaddit_hasPosts(false, breaddit);
    if (breadditHasPosts){
        let breadditPosts = await request_breaddit_posts(false, breaddit);
        console.log(breadditPosts);
        $("#posts").html("");
        $("#userposts").html("");
        $("#breadditposts").html("");
        let currPost="";
        for (postID in breadditPosts){
            currPost = breadditPosts[postID];
            $("#breadditposts").append(`<div class="hidden post card w-100 mb-3" id="p${postID}"></div>`);
            formPost(postID, currPost["author"], currPost["authorid"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
            $(`#p${postID}`).removeClass("hidden");
        }
    }
}

$("#change").click(async function(){ //allow user to change name, then profile page reloads
    let name = $("#myname").val();
    $("#name").html(`${name}`);
    $("#myname").val("");
    await change_name(name);
    myProfile();
});

$("#home").click(async function(){ //navigate to homepage
    home();
    history.pushState({
        page: "home"
    }, "Breaddit-home", null);
});

$("#userprofile").click(async function(){ //navigate to user's personal profile
    myProfile();
    history.pushState({
        page: "myProfile"
    }, "Breaddit-My Profile", null);
});

$("#commenttab").click(function() {
    $("#posttab").removeClass("active");
    $(this).addClass("active");
    $("#userposts").addClass("hidden");
    $("#usercomments").removeClass("hidden");
});

$("#posttab").click(function() {
    $("#commenttab").removeClass("active");
    $(this).addClass("active");
    $("#usercomments").addClass("hidden");
    $("#userposts").removeClass("hidden");
});

$("#createbreaddit").click(async function(){ //only admins can use to create breaddit
    let name = $("#breaddit").val();
    $("#breaddit").val("");
    curr_breaddit = name;
    await create_breaddit(name);
    breaddit(curr_breaddit);
    history.pushState({
        page: "breaddit",
        data: name
    }, `Breaddit-${name}`, null);
});

$("#createNewPost").click(function(){
    postCreation(curr_breaddit);
    history.pushState({
        page: "postCreation",
        data: curr_breaddit
    }, null, null);
});

$(".posts").on("click", ".postComments", async function(){
    const postID = $(this).attr("id");
    post(postID);
    history.pushState({
        page: "post",
        data: postID
    }, "Breaddit-post", null);
});

$("#comments").on("click", ".reply", async function(){
    let cid = $(this).attr("id");
    $(`#r${cid}`).html(`<a href="#" class="reply card-link text-muted float-left" id="s${cid}"><i class="fas fa-comment-alt"></i> Reply</a>`);
    $(`#r${cid}`).append(`<br>
        <textarea name="w${cid}" class="text-white form-control w-100 float-none mb-1" type="textarea" id="w${cid}" placeholder="Body"></textarea>
        <button type="button" class="btn text-white submitReply" id="${cid}">Submit</button>
    `);
});

$("#comments").on("click", ".submitReply", async function(){
    let cid = $(this).attr("id");
    let body = $(`#w${cid}`).val();
    let currComment = await request_comment(false, cid);
    let path = currComment["path"].split("/");
    let postID = path[0];
    let puid = $("#postInfo").children(".postAuthor").attr("id");
    await create_comment(body, `${currComment["path"]}/${cid}`, puid, curr_breaddit);
    $(`#r${cid}`).html(`<a href="#" class="reply card-link text-muted float-left" id="${cid}"><i class="fas fa-comment-alt"></i> Reply</a>`);
    post(postID);
});

$(".posts").on("click", ".postBreaddit", async function(){
    curr_breaddit = $(this).text();
    breaddit(curr_breaddit);
    history.pushState({
        page: "breaddit",
        data: curr_breaddit
    }, `Breaddit-${curr_breaddit}`, null);
});


$(".posts").on("click", ".postAuthor", async function(){
    let userID = $(this).attr("id");
    profile(userID);
    history.pushState({
        page: "profile",
        data: userID
    }, "Breaddit-profile", null);
});

$(".comments").on("click", ".postAuthor", async function(){
    let userID = $(this).attr("id");
    profile(userID);
    history.pushState({
        page: "profile",
        data: userID
    }, "Breaddit-profile", null);
});

$("#submitNewPost").click(async function(){
    let title = $("#postTitle").val();
    console.log(title);
    $("#postTitle").val("");
    let body = $("#postBody").val();
    console.log(body);
    $("#postBody").val("");
    await create_post(title, body, curr_breaddit);
    breaddit(curr_breaddit);
    history.pushState({
        page: "breaddit",
        data: curr_breaddit
    }, `Breaddit-${curr_breaddit}`, null);
});

$(".submitNewComment").click(async function(){
    let body = $("#writtenComment").val();
    $("#writtenComment").val("");
    let postID = $(this).attr("id");
    let puid = $("#postInfo").children(".postAuthor").attr("id");
    let breaddit = $(`#p${postID}`).children(".breaddit").attr("id");
    console.log(breaddit);
    await create_comment(body, postID, puid, breaddit);
    post(postID);
});

$("#usercomments").on("click", ".commentDelete", async function(){
    console.log('delete comment');
    let cid =  $(this).attr("id").slice(1);
    let path = $(`#c${cid}`).children(".path").attr("id");
    await delete_comment(cid, path);
    myProfile();
});

$("#userposts").on("click", ".postDelete", async function(){
    console.log('delete post');
    let pid =  $(this).attr("id").slice(1);
    let breaddit = $(`#p${pid}`).children(".breaddit").attr("id");
    await delete_post(pid, breaddit);
    myProfile();
});

$(".posts").on("click", ".voteup", async function(){
    console.log('vote up');
    $(this).children(".up").toggleClass("voted");
    let pid = $(this).children(".up").attr("id").slice(1);
    let breaddit = $(`#p${pid}`).children(".breaddit").attr("id");
    console.log(breaddit);
    let userid = $(`#p${pid}`).find(".user").attr("id").slice(1);
    console.log(userid);
    await vote_post(pid, true, breaddit, userid);
    home();
    history.pushState({
        page: "home"
    }, "Breaddit-home", null);
});

$(".posts").on("click", ".votedown", async function(){
    console.log('vote down');
    $(this).children(".down").toggleClass("voted");
    let pid = $(this).children(".down").attr("id").slice(1);
    let breaddit = $(`#p${pid}`).children(".breaddit").attr("id");
    console.log(breaddit);
    let userid = $(`#p${pid}`).find(".user").attr("id").slice(1);
    console.log(userid);
    await vote_post(pid, false, breaddit, userid);
    home();
    history.pushState({
        page: "home"
    }, "Breaddit-home", null);
});

$(".comments").on("click", ".voteup", async function(){
    console.log('vote up');
    $(this).children(".up").toggleClass("voted");
    let cid = $(this).children(".up").attr("id").slice(1);
    let path = $(`#c${cid}`).children(".path:first").attr("id");
    let comment = await request_comment(false, cid);
    console.log(cid);
    console.log(comment["authorid"]);
    await vote_comment(cid, true, path, comment["authorid"]);
    let ids = path.split("/");
    post(ids[0]);
});

$(".comments").on("click", ".votedown", async function(){
    console.log('vote down');
    $(this).children(".down").toggleClass("voted");
    let cid = $(this).children(".down").attr("id").slice(1);
    let path = $(`#c${cid}`).children(".path:first").attr("id");
    let comment = await request_comment(false, cid);
    console.log(cid);
    console.log(comment["authorid"]);
    await vote_comment(cid, false, path, comment["authorid"]);
    let ids = path.split("/");
    post(ids[0]);
});
