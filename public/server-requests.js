//GET only
async function request_karma(bool) {
    console.log('karma requested');
    var test = {
        'vote': bool
    };
    let token = await firebase.auth().currentUser.getIdToken();

    let val = await fetch('https://us-central1-breaddit-885b4.cloudfunctions.net/api/karma/comment/-LrzMy3yhYJfR6mefUaN', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(test)
    }).then((resp) => resp.text()); // parses JSON response into native JavaScript objects 
    console.log(val);
}

async function request_profile(bool) {
    console.log('profile requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch('https://us-central1-breaddit-885b4.cloudfunctions.net/api/profile', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then((resp) => resp.json()); // parses JSON response into native JavaScript objects 
    console.log(val);
    return val;
}

async function request_user_posts(bool) {
    console.log('user posts requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let uid = await firebase.auth().currentUser.uid;
    let val = await fetch(`https://us-central1-breaddit-885b4.cloudfunctions.net/api/profile/${uid}/posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then((resp) => resp.text());
    console.log(val);
    return val;
}

async function request_all_posts(bool) {
    console.log('all posts requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch('https://us-central1-breaddit-885b4.cloudfunctions.net/api/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then((resp) => resp.text());
    console.log(val);
    return val;
}

//create
async function create_breaddit(name) {
    let params = {
        "name": name
    };
    console.log('create breaddit requested');
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch('https://us-central1-breaddit-885b4.cloudfunctions.net/api/subreddit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

async function create_post(title, body, subreddit) {
    let params = {
        "title": title,
        "body": body,
        "subreddit": subreddit
    };
    console.log('create post requested');
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch('https://us-central1-breaddit-885b4.cloudfunctions.net/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

//change data
async function change_name(name) {
    let params = {
        "name": name
    };
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch('https://us-central1-breaddit-885b4.cloudfunctions.net/api/profile/rename', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}


/*
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

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            document.getElementById('googlesignin').textContent = 'Sign out';
            $('#userprofile').html(`<img src="${user.photoURL}" id="pfp"> <span id="name"></span>`);
            $('#profilepic').html(`<img src="${user.photoURL}" id="pic">`)
            //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            // [END_EXCLUDE]
            $('#createuser').removeClass('hidden');
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('googlesignin').textContent = 'Sign in with Google';
            //document.getElementById('quickstart-account-details').textContent = 'null';
            //document.getElementById('quickstart-oauthtoken').textContent = 'null';
            $('#createuser').addClass("hidden");
            $("#profile").addClass("hidden");
            $("#newPost").addClass("hidden");
            $("#homepage").addClass("hidden");
            $("#breadditPage").addClass("hidden");
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