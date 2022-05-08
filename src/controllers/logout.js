const logOutUser = (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    });
    return res.redirect('/login');
}
export default logOutUser