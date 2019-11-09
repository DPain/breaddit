/*global $*/
let curr_breaddit="";

async function formPost(postID, authorID,  subreddit, karma, title, body) {
    var author = await request_username(false, authorID);
    $(`#${postID}`).html(`
        <div class="d-flex bd-highlight card-body">
            <div class="p-2 bd-highlight float-left" id="votes">
                <a class="voteup"><i class="fas fa-caret-up vote-arrow up" id="up"></i></a>
                <div id="votes">${karma}</div>
                <a class="votedown"><i class="fas fa-caret-down vote-arrow down" id=down"></i></a>
            </div>
            <div class="p-2 flex-grow-1 bd-highlight float-right">
                <h6 class="card-subtitle mb-2 text-muted text-left"><strong>b/${subreddit}</strong> • Posted by u/<a id=${authorID}>${author}</a></h6>
                <h5 class="card-title text-left">${title}</h5>
                <p class="card-text text-left">${body}</p>
            </div>
        </div>
    `);
}

$("#join").click(async function(){ //allow user to change name, then homepage loads up
    var name = $("#myname").val();
    $("#name").html(`${name}`);
    $("#nav").removeClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#notloggedin").addClass("hidden");
    $("#homepage").removeClass("hidden"); //switch to actual homepage
    await change_name(name);
    var allposts = await request_all_posts(false);
    console.log(allposts);
    var currPost = "";
    $("#posts").html("");
    for (postID in allposts) {
        currPost = allposts[postID];
        $("#posts").append(`<div class="blurred card w-100" id=${postID}></div>`);
        await formPost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"]);
        $(`#${postID}`).removeClass("blurred");
    }
    //load homepage
});

$("#home").click(async function(){ //navigate to homepage
    $("#breadditPage").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#profileXtras").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#homepage").removeClass("hidden");
    var allposts = await request_all_posts(false);
    console.log(allposts);
    var currPost = "";
    $("#posts").html("");
    for (postID in allposts) {
        currPost = allposts[postID];
        $("#posts").append(`<div class="blurred card w-100" id=${postID}></div>`);
        await formPost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"]);
        $(`#${postID}`).removeClass("blurred");
    }
    //load homepage
    //shows homepage content that only allows you to veiw new posts and create a new breaddit
    //function to GET all posts and display them each in #posts
});

$("#userprofile").click(async function(){ //navigate to user's personal profile
    $("#breadditPage").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#homepage").addClass("hidden");
    $("#profile").removeClass("hidden"); //show just profile and allow user to sign out
    $("#googlesignin").removeClass("hidden");
    $("#profileXtras").removeClass("hidden");
        
    var myProfile = await request_profile(false);
    console.log(myProfile);
    var name = myProfile["name"];
    var karma = myProfile["karma"];
    console.log(name);
    $("#username").html(`u/${name}`);
    $("#usercrumbs").html(`${karma}`);
    $("#userinfo").removeClass("blurred");
    var myPosts = Object.keys(JSON.parse(await request_user_posts(false)));
    console.log(myPosts);
    var currPost;
    $("#userposts").html("");
    myPosts.forEach(async function (postID, index) {
        currPost = await request_post(false, postID);
        $("#userposts").append(`<div class="blurred card w-100" id=${postID}></div>`);
        await formPost(postID, currPost["author"], currPost["subreddit"], currPost["karma"], currPost["title"], currPost["body"]);
        $(`#${postID}`).removeClass("blurred");
    });
});

$("#createbreaddit").click(async function(){ //only admins can use to create breaddit
    var name = $("#breaddit").val();
    curr_breaddit = name;
    var check = await create_breaddit(name);
    if(check != null){
        $("#profile").addClass("hidden");
        $("#profileXtras").addClass("hidden");
        $("#newPost").addClass("hidden");
        $("#googlesignin").addClass("hidden");
        $("#homepage").addClass("hidden");
        $("#breadditPage").removeClass("hidden");
          
        //var breaddit = await request_breaddit(false);
        //console.log(breaddit);
        //name = breaddit["name"];
         $("#breadditname").html(`${name}`);
    }
});

$("#createNewPost").click(function(){
    $("#breadditPage").addClass("hidden");
    $("#postBreaddit").html(curr_breaddit);
    $("#newPost").removeClass("hidden");
});

$("#submitNewPost").click(async function(){
    var title = $("#postTitle").val();
    console.log(title);
    var body = $("textarea").val();
    console.log(body);
    await create_post(title, body, curr_breaddit);
    $("#newPost").addClass("hidden");
    $("#homepage").removeClass("hidden");
    //load homepage
});

$(".voteup").click(async function(){ //vote up
    $(".up").toggleClass("voted");
});

$(".votedown").click(async function(){ //vote down
    $(".down").toggleClass("voted");
});