const User = require('../models/user');

/* USER PROFILE */
module.exports.profile = (req, res) =>
{
    User.findById(req.params.id, function (error, user)
    {
        if(error)
        {
            console.log('error in finding the user profile!');
            return;
        }
        var options =
        {
            user_name: "parikshit singh",
            title: "ComSpace Express",
            profile_user:user
        }
        return res.render('users_profile', options);
    })

}

/* USER SIGNUP */
module.exports.signUp = (req, res) =>
{
    if (req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    var options = {
        title: "ComSpace Express | Sign Up"
    }
    return res.render('user_sign_up', options);
}

/* USER SIGNIN */
module.exports.signIn = (req, res) =>
{
    if (req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    var options = {
        title: "ComSpace Express | Sign In"
    }
    return res.render('user_sign_in', options);
}

/* when we are calling this create function, we are supposing that currently we are on the sign up page. on which we actually are */
module.exports.create = (req, res) =>
{
    if (req.body.password != req.body.confirm_password)/* if the passwords do not match */
    {
        console.log('password does not match from the confirm password field.');
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }, (error, user) =>
    {
        console.log(user);
        if (error)
        {
            console.log('error in finding the user from the database!');
            return;
        }
        if (!user)
        {
            User.create(req.body, (error, user) =>
            {
                if (error)
                {
                    console.log('error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else
        {
            return res.redirect('back');
        }
    });
}

module.exports.create_session = (req, res) =>
{
    req.flash('success', 'Logged in Successfully!');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res)
{
    req.logout();
    req.flash('success', 'Logged out Successfully!');
    /* now i have added the flash message in the request. so now this message needs to be 
    transferred to the response, now either i can send it below as an object, but then
    what is the use? everytime i will be sending a separate context just for the flash
    message. so we dont need to do that. so lets create our own custom middleware. go to
    config and create a new file called middleware.js(this can be any name.) and proceed
    with it further. */
    return res.redirect('/');
}

module.exports.update=function(req, res)
{
    if(req.user.id==req.params.id)
    {
        /* only then update the credentials */
        User.findByIdAndUpdate(req.params.id, /* {name:req.body.name, email:req.body.email} */req.body, function(error, user)
        {
            if(error)
            {
                console.log('unable to find the user by id and update!');
                return;
            }
            return res.redirect('back');
        });
    }
    else
    {
        return res.status(401).send('Unauthorized')
    }
}