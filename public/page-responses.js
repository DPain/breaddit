/*document.querySelector('#test').addEventListener("click", () => {
    request(true)
}, false);
document.querySelector('#testfalse').addEventListener("click", () => {
    request(false)
}, false);
*/
/*global $*/
let curr_breaddit="";
let curr_uid="";
$("#join").click(async function(){ //allow user to change name, then homepage loads up
    var name = $("#myname").val();
    $("#name").html(`${name}`);
    $("#nav").removeClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#notloggedin").addClass("hidden");
    $("#homepage").removeClass("hidden"); //switch to actual homepage
    await change_name(name);
    //load homepage
});

$("#home").click(function(){ //navigate to homepage
    $("#breadditPage").addClass("hidden");
    $("#profile").addClass("hidden");
    $("#newPost").addClass("hidden");
    $("#googlesignin").addClass("hidden");
    $("#homepage").removeClass("hidden");
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
        
    var myProfile = await request_profile(false);
    console.log(myProfile);
    var name = myProfile["name"];
    var karma = myProfile["karma"];
    console.log(name);
    $("#username").html(`u/${name}`);
    $("#usercrumbs").html(`${karma}`);
    $("#userinfo").removeClass("blurred");
    var myPosts = await request_user_posts(false);
    console.log(myPosts);
});

$("#createbreaddit").click(async function(){ //only admins can use to create breaddit
    var name = $("#breaddit").val();
    curr_breaddit = name;
    var check = await create_breaddit(name);
    if(check != null){
        $("#profile").addClass("hidden");
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