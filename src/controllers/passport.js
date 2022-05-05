import ActiveDirectory from "activedirectory2";
import jsonwebtoken from "jsonwebtoken";

const authenticateUser = async (req, res) => {
    let { username, password } = req.body;

    const config = {
        url: process.env.LADAP_URL,
        baseDN: process.env.BASEDN,
    };

    const profileFetch = {
        url: process.env.LADAP_URL,
        baseDN: process.env.BASEDN,
        attributes: {
            user: ["memberOf", "displayName", "sAMAccountName"],
            // group: [],
        },
        includeMembership: ["all"],
        username,
        password,
    };

    let ad = new ActiveDirectory(config);
    let adProf = new ActiveDirectory(profileFetch);

    ad.authenticate(username, password, (err, auth) => {
        if (err) {
            console.warn(
                `Authentication Failed Check Your Credentials: ${JSON.stringify(err)}`
            );
            res.status(404).send(`
            <h1>The credentials you have entered is not correct please ensure they are correct</h1>
            <a href="/login">Login Page</a>
            `)
            return;
        }

        if (auth) {
            adProf.findUser(username, (err, user) => {
                if (err) {
                    console.warn(`${JSON.stringify(err)}`);
                    // console.log("ERROR: " + JSON.stringify(err));
                    return;
                }

                if (!user) {
                    console.warn(`Log-In Failed`);
                    return res
                        .status(404)
                        .send({ status: "Failure", message: "User not found." });
                } else console.info(`Log-In Success for ${user?.sAMAccountName}`);
                const token = createToken(user?.sAMAccountName)
                res.cookie('jwt', token, { httpOnly: true })
                res.status(201).send(user)
            });
        }
    });
};


const createToken = (sAMAccountName) => {
    return jsonwebtoken.sign({
        sAMAccountName
    }, process.env.JWT_SECRET, {
        expiresIn: "5h"
    })
}

export default authenticateUser;
