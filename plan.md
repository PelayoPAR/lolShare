

Models: 

-- UserModel {
    _id:
    userName: unique
    email: unique
    password: min 8 char, 
    favorites: ["memeid1", "memeid2"...]
    role: [user, admin, premium, guest(viewer)]
    profile-pic: *** nice to have *** 
    <!-- with defaults -->
    subscribed: (to newsletter)
}

-- memeModel {
    _id:
    name: *** ??? ***
    path:
    likes: 
    comments: *** nice to have / messy? ***
}

-- Views {
    home
    login / register / subscribePremium
    user-main
    upload-meme
    meme-view
    newsletter *** nice to have ***
}