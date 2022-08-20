Models:

-- UserModel {
\_id:
username: unique
email: unique
password: min 8 char,
favorites: ["memeid1", "memeid2"...]
role: [user, admin, premium, guest(viewer)]
profile-pic: **_ nice to have _**

<!-- with defaults -->

subscribed: (to newsletter)
}

-- memeModel {
\_id:
name: **_ ??? _**
path:
likes:
comments: **_ nice to have / messy? _**
}

-- Views {
home
login / register / subscribePremium
user-main
upload-meme
meme-view
newsletter **_ nice to have _**
}

-- API {
https://github.com/arifszn/reddit-image-fetcher

        https://npm.io/package/reddit-image-fetcher

        https://github.com/arifszn/reddit-image-fetcher

        https://arifszn.com/reddit-image-fetcher/docs/usage


    command:
     npm i reddit-image-fetcher

}

auth login

get
post

api calls
filtered api calls
not case sensitive
search

Asem:
change subreddit fetch meme side bar and nav bar

Pelayo:
login and registration hbs and the thingy (auth routes)
