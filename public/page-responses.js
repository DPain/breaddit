/*global $*/
let curr_breaddit="";

async function formPost(postID, authorID,  subreddit, karma, title, body, numOfComments) {
    let author = await request_username(false, authorID);
    $(`#p${postID}`).html(`
        <div class="d-flex bd-highlight card-body">
            <div class="p-2 bd-highlight float-left" id="votes">
                <a class="voteup"><i class="fas fa-caret-up vote-arrow up" id="u${postID}"></i></a>
                <div>${karma}</div>
                <a class="votedown"><i class="fas fa-caret-down vote-arrow down" id="d${postID}"></i></a>
            </div>
            <div class="p-2 flex-grow-1 bd-highlight float-right">
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

async function formComment(commentID, authorID, karma, body) {
    let author = await request_username(false, authorID);
    $(`#c${commentID}`).html(`
        <div class="d-flex bd-highlight card-body">
            <div class="p-2 bd-highlight float-left" id="votes">
                <a class="voteup"><i class="fas fa-caret-up vote-arrow up" id="u${commentID}"></i></a>
                <br>
                <a class="votedown"><i class="fas fa-caret-down vote-arrow down" id="d${commentID}"></i></a>
            </div>
            <div class="p-2 flex-grow-1 bd-highlight float-right">
                <h6 class="card-subtitle mb-2 text-muted text-left"><strong><a href="#" class="postAuthor" id="${authorID}">${author}</a></strong> • <a href="#" class="commentCrumbs text-muted">${karma} points</a></h6>
                <p class="card-text text-left">${body}</p>
            </div>
        </div>
        <div class="card-body" id="r${commentID}">
            <a href="#" class="reply card-link text-muted float-left" id="${commentID}"><i class="fas fa-comment-alt"></i> Reply</a>
        </div>
    `);
}

async function formProfilePost(postID, authorID,  subreddit, karma, title, body, numOfComments) {
    let author = await request_username(false, authorID);
    $(`#p${postID}`).html(`
        <div class="d-flex bd-highlight card-body">
            <div class="p-2 bd-highlight float-left" id="votes">
                <a class="voteup"><i class="fas fa-caret-up vote-arrow up" id="u${postID}"></i></a>
                <div>${karma}</div>
                <a class="votedown"><i class="fas fa-caret-down vote-arrow down" id="d${postID}"></i></a>
            </div>
            <div class="p-2 flex-grow-1 bd-highlight float-right">
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

async function loadChildComments(cid){
    let parentComment = await request_comment(false, cid);
    let replies = Object.keys(parentComment["replies"]);
    console.log(replies);
    replies.forEach(async function (commentID, index){
        console.log(commentID);
        let childComment = await request_comment(false, commentID);
        $(`#c${cid}`).append(`<div class="hidden post card w-100 comment pl-2 border-white border-top-0 border-bottom-0 border-right-0" id="c${commentID}">`);
        await formComment(commentID, childComment["author"], childComment["karma"], childComment["body"]);
        $(`#c${commentID}`).removeClass("hidden");
        if(childComment["numOfReplies"] != 0){
            loadChildComments(commentID);
        }
    });
    return true;
}

$("#join").click(async function(){ //allow user to change name, then homepage loads up
    let name = $("#myname").val();
    $("#name").html(`${name}`);
    $("#nav").removeClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#notloggedin").addClass("hidden");
    $("#homepage").removeClass("hidden"); //switch to actual homepage
    await change_name(name);
    let allposts = await request_all_posts(false);
    console.log(allposts);
    let currPost = "";
    $("#userposts").html("");
    $("#posts").html("");
    $("#breadditposts").html("");
    for (postID in allposts) {
        currPost = allposts[postID];
        $("#posts").append(`<div class="hidden card w-100 mb-3 post" id="p${postID}"></div>`);
        await formPost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
        $(`#p${postID}`).removeClass("hidden");
    }
});

$("#home").click(async function(){ //navigate to homepage
    $("#breadditPage").addClass("hidden");
    $("#postpage").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#profileXtras").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#homepage").removeClass("hidden");
    let allposts = await request_all_posts(false);
    console.log(allposts);
    let currPost = "";
    $("#userposts").html("");
    $("#posts").html("");
    $("#breadditposts").html("");
    for (postID in allposts) {
        currPost = allposts[postID];
        $("#posts").append(`<div class="hidden card w-100 mb-3 post" id="p${postID}"></div>`);
        await formPost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
        $(`#p${postID}`).removeClass("hidden");
    }
});

$("#userprofile").click(async function(){ //navigate to user's personal profile
    $("#breadditPage").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#postpage").addClass("hidden");
    $("#homepage").addClass("hidden");
    $("#profile").removeClass("hidden"); //show just profile and allow user to sign out
    $("#googlesignin").removeClass("hidden");
    $("#profileXtras").removeClass("hidden");
    let myProfile = await request_profile(false);
    console.log(myProfile);
    let name = myProfile["name"];
    let karma = myProfile["karma"];
    $("#username").html(`u/${name}`);
    $("#usercrumbs").html(karma);
    $("#userinfo").removeClass("blurred");
    let myPosts = Object.keys(myProfile["posts"]);
    console.log(myPosts);
    let currPost;
    $("#breadditposts").html("");
    $("#posts").html("");
    $("#userposts").html("");
    myPosts.forEach(async function (postID, index) {
        currPost = await request_post(false, postID);
        $("#userposts").append(`<div class="hidden card w-100 mb-3 post" id="p${postID}"></div>`);
        await formProfilePost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
        $(`#p${postID}`).removeClass("hidden");
    });
});

$("#createbreaddit").click(async function(){ //only admins can use to create breaddit
    let name = $("#breaddit").val();
    curr_breaddit = name;
    await create_breaddit(name);
    $("#homepage").addClass("hidden");
    $("#breadditPage").removeClass("hidden");
    $("#breadditname").html(`${name}`);
    let breadditHasPosts = await request_breaddit_hasPosts(false, curr_breaddit);
    if (breadditHasPosts){
        let breadditPosts = Object.keys(await request_breaddit_posts(false, curr_breaddit));
        console.log(breadditPosts);
        let currPost;
        $("#posts").html("");
        $("#userposts").html("");
        $("#breadditposts").html("");
        breadditPosts.forEach(async function (postID, index) {
            currPost = await request_post(false, postID);
            $("#breadditposts").append(`<div class="hidden card w-100 mb-3 post" id="p${postID}"></div>`);
            await formProfilePost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
            $(`#p${postID}`).removeClass("hidden");
        });
    }
});

$("#createNewPost").click(function(){
    $("#breadditPage").addClass("hidden");
    $("#postBreaddit").html(curr_breaddit);
    $("#newPost").removeClass("hidden");
});

$(".posts").on("click", ".postComments", async function(){
    const postID = $(this).attr("id");
    $("#profile").addClass("hidden");
    $("#profileXtras").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#homepage").addClass("hidden");
    $("#breadditPage").addClass("hidden");
    $("#postpage").removeClass("hidden");
    $("#posts").html("");
    $("#userposts").html("");
    $("#breadditposts").html("");
    $("#comments").html("");
    const post = await request_post(false, postID);
    const authorID = post["author"];
    const author = await request_username(false, authorID);
    $("#crumbs").text(post["karma"]);
    $("#title").text(post["title"]);
    $("#body").text(post["body"]);
    $("#postInfo").html(`<strong class="text-white">b/<a href="#" class="postBreaddit text-white">${post["subreddit"]}</a></strong> • Posted by u/<a href="#" class="postAuthor text-muted" id="${authorID}">${author}</a>`);
    $("#totalComments").text(post["numOfComments"]);
    $(".submitNewComment").attr("id", postID);
    let num = post["numOfComments"];
    let comments = Object.keys(post["comments"]);
    console.log(post["comments"]);
    $("#comments").html("");
    if(num != 0){
        comments.forEach(async function (cid, index){
            let currComment = await request_comment(false, cid);
            num = currComment["numOfReplies"];
            $("#comments").append(`<div class="hidden post card w-100 comment pl-2 border-white border-top-0 border-bottom-0 border-right-0" id="c${cid}">`);
            await formComment(cid, currComment["author"], currComment["karma"], currComment["body"]);
            $(`#c${cid}`).removeClass("hidden");
            if(num != 0){
                loadChildComments(cid);
            }
        });
    }
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
    await create_reply(body, cid);
    let currComment = await request_comment(false, cid);
    let num = currComment["numOfReplies"]+1;
    await update_comment(num, cid);
    $(`#r${cid}`).html(`<a href="#" class="reply card-link text-muted float-left" id="${cid}"><i class="fas fa-comment-alt"></i> Reply</a>`);
    if(num != 0){
        loadChildComments(cid);
    }
});

$(".posts").on("click", ".postBreaddit", async function(){
    curr_breaddit = $(this).text();
    $("#homepage").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#profileXtras").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#breadditPage").removeClass("hidden");
    $("#breadditname").html(curr_breaddit);
    let breadditHasPosts = await request_breaddit_hasPosts(false, curr_breaddit);
    if (breadditHasPosts){
        let breadditPosts = Object.keys(await request_breaddit_posts(false, curr_breaddit));
        console.log(breadditPosts);
        let currPost;
        $("#posts").html("");
        $("#userposts").html("");
        $("#breadditposts").html("");
        breadditPosts.forEach(async function (postID, index) {
            currPost = await request_post(false, postID);
            $("#breadditposts").append(`<div class="hidden post card w-100 mb-3" id="p${postID}"></div>`);
            await formPost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
            $(`#p${postID}`).removeClass("hidden");
        });
    }
});


$(".posts").on("click", ".postAuthor", async function(){
    $("#homepage").addClass("hidden");
    $("#breadditPage").addClass(hidden);
    $("#profile").removeClass("hidden");
    $("#profileXtras").removeClass("hidden");
    let userID = $(this).attr("id");
    let profile = await request_other_user(false, userID);
    let name = profile["name"];
    let karma = profile["karma"];
    $("#username").html(`u/${name}`);
    $("#usercrumbs").html(karma);
    $("#userinfo").removeClass("blurred");
    let posts = Object.keys(profile["posts"]);
    console.log(posts);
    let currPost;
    $("#breadditposts").html("");
    $("#posts").html("");
    $("#userposts").html("");
    posts.forEach(async function (postID, index) {
        currPost = await request_post(false, postID);
        $("#userposts").append(`<div class="hidden post card w-100 mb-3" id="p${postID}"></div>`);
        await formPost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
        $(`#p${postID}`).removeClass("hidden");
    });
});

$("#submitNewPost").click(async function(){
    let title = $("#postTitle").val();
    console.log(title);
    let body = $("#postBody").val();
    console.log(body);
    await create_post(title, body, curr_breaddit);
    $("#newPost").addClass("hidden");
    $("#homepage").removeClass("hidden");
    let allposts = await request_all_posts(false);
    console.log(allposts);
    let currPost = "";
    $("#userposts").html("");
    $("#posts").html("");
    $("#breadditPosts").html("");
    for (postID in allposts) {
        currPost = allposts[postID];
        $("#posts").append(`<div class="hidden card w-100 pb-1" id="p${postID}"></div>`);
        await formPost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"], currPost["numOfComments"]);
        $(`#p${postID}`).removeClass("hidden");
    }
});

$(".submitNewComment").click(async function(){
    let body = $("#writtenComment").val();
    let postID = $(this).attr("id");
    console.log(body);
    await create_comment(body, postID);
    let post= await request_post(false, postID);
    $("#comments").html("");
    $("#totalComments").text(post["numOfComments"]);
    let num = post["numOfComments"];
    let comments = Object.keys(post["comments"]);
    console.log(post["comments"]);
    $("#comments").html("");
    if(num != 0){
        comments.forEach(async function (cid, index){
            let currComment = await request_comment(false, cid);
            num = currComment["numOfReplies"];
            $("#comments").append(`<div class="hidden post card w-100 comment pl-2 border-white border-top-0 border-bottom-0 border-right-0" id="c${cid}">`);
            await formComment(cid, currComment["author"], currComment["karma"], currComment["body"]);
            $(`#c${cid}`).removeClass("hidden");
            if(num != 0){
                loadChildComments(cid);
            }
        });
    }
});

$(".posts").on("click", ".voteup", async function(){
    $(this).children(".up").toggleClass("voted");
});

$(".posts").on("click", ".votedown", async function(){
    $(this).children(".down").toggleClass("voted");
});