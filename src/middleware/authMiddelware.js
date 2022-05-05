import jsonwebtoken from "jsonwebtoken";

const requireAut = (req, res, next) => {

    const token = req.cookies.jwt
    //check if token exist and verified

    if (token) {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.redirect("/login")
            } else {
                next()
            }
        })
    } else {
        res.redirect("/login");
    }
}
export default requireAut