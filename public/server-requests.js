//GET only
async function request_karma(bool) {
    console.log('karma requested');
    var test = {
        'vote': bool
    };
    let token = await firebase.auth().currentUser.getIdToken();

    let val = await fetch('https://us-central1-breaddit-1ce34.cloudfunctions.net/api/karma/comment/-LrzMy3yhYJfR6mefUaN', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(test)
    }).then((resp) => resp.text()); // parses JSON response into native JavaScript objects 
    console.log(val);
}

async function request_username(bool, userID) {
    console.log('username requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/profile/${userID}/name`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    .then((resp) => resp.text()); // parses JSON response into native JavaScript objects 
    console.log(val);
    return val;
}

async function request_profile(bool) {
    console.log('profile requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch('https://us-central1-breaddit-1ce34.cloudfunctions.net/api/profile', {
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

async function request_post(bool, pid) {
    console.log('specific post requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/posts/${pid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    .then((resp) => resp.json());
    console.log(val);
    return val;
}

async function request_comment(bool, cid) {
    console.log('comment requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/comments/${cid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    .then((resp) => resp.json());
    console.log(val);
    return val;
}

async function request_other_user(bool, userID) {
    console.log('other user requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/profile/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    .then((resp) => resp.json());
    console.log(val);
    return val;
}

async function request_breaddit_hasPosts(bool, breaddit){
    console.log('breaddit hasPosts requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/subreddit/${breaddit}/hasPosts`, {
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

async function request_breaddit_posts(bool, breaddit){
    console.log('breaddit requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/subreddit/${breaddit}/posts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    .then((resp) => resp.json());
    console.log(val);
    return val;
}

async function request_all_posts(bool) {
    console.log('all posts requested');
    let token = await firebase.auth().currentUser.getIdToken();
    let val = await fetch('https://us-central1-breaddit-1ce34.cloudfunctions.net/api/posts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    .then((resp) => resp.json());
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
    const response = await fetch('https://us-central1-breaddit-1ce34.cloudfunctions.net/api/subreddit', {
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
        "name": $("#name").text(),
        "title": title,
        "body": body,
        "subreddit": subreddit
    };
    console.log('create post requested');
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch('https://us-central1-breaddit-1ce34.cloudfunctions.net/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

async function create_comment(body, path, puid, breaddit) {
    let params = {
        "body": body,
        "name": $("#name").text(),
        "path": path,
        "puid": puid,
        "breaddit": breaddit
    };
    console.log('create comment requested');
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/comments`, {
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
async function vote_post(pid, vote, breaddit, userid){
    let params = {
        "vote": vote,
        "breaddit": breaddit,
        "userid": userid
    };
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/karma/post/${pid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

async function vote_comment(cid, vote, path, userid){
    let params = {
        "vote": vote,
        "path": path,
        "userid": userid
    };
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/karma/comment/${cid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

async function change_name(name) {
    console.log('changed name')
    let params = {
        "name": name
    };
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch('https://us-central1-breaddit-1ce34.cloudfunctions.net/api/profile/rename', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

async function update_post(num, pid) {
    let params = {
        "num": num,
        "pid": pid
    };
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/posts/numChange`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

async function update_comment(num, cid) {
    let params = {
        "num": num,
        "cid": cid
    };
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/comments/numChange`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

async function add_pfp(pfp){
    let params = {
        "pfp": pfp
    };
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/profile/pfp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

//Delete content
async function delete_comment(cid, path){
    let params = {
        "path": path
    };
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/comments/${cid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}

async function delete_post(pid, breaddit){
    let params = {
        "breaddit": breaddit
    };
    let token = await firebase.auth().currentUser.getIdToken();
    const response = await fetch(`https://us-central1-breaddit-1ce34.cloudfunctions.net/api/posts/${pid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(params)
    });
    return await response;
}
