const logOutUser = (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    });

    res.redirect('/');
}
export default logOutUser