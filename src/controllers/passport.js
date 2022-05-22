import ActiveDirectory from "activedirectory2";
import jsonwebtoken from "jsonwebtoken";
import dateTime from "../utils/dateTime.js";

const authenticateUser = async (req, res) => {
  // ["x-forwarded-for"] if its sitting in front of a proxy
  var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const authorizedStaff = [
    "NAZ",
    "MLR",
    "ADAM",
    "RCS",
    "THW",
    "RCK",
    "TEW",
    "JAC",
    "JNA",
    "RBG",
    "SAW",
    "NLA",
    "ELP",
    "JAV",
    "SOA",
    "SOG",
    "NIS",
    "HAF",
    "BNR",
    "BNS",
  ];

  let { username, password } = req.body;
  username = `${username}@bsk.edu.kw`;
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
      console.log("ad error", err);
      console.warn(`${dateTime()} * [USER: ${username}] * Log-In Failed `);
      return res.status(404).json({
        status: "Failure",
        message: "Please Check Your Credentials",
      });
    }

    if (auth) {
      adProf.findUser(username, (err, user) => {
        if (err) {
          console.warn(`${JSON.stringify(err)}`);
          return res.status(404).json({
            status: "Failure",
            message: "Please Check Your Credentials",
          });
        }

        if (!user) {
          console.warn(`${dateTime()} * [USER: ${username}] * Log-In Failed `);
          return res.status(404);
        } else console.info(`Log-In Success for ${user.sAMAccountName}`);

        if (authorizedStaff.includes(user.sAMAccountName)) {
          const token = createToken(user.sAMAccountName);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 4 * 60 * 60 * 1000,
          });
          res.status(201).json({
            status: "Success",
            user: user.displayName,
          });
        } else {
          res.status(401).json({
            status: "Failure",
            message: `StaffCode has not been Authorized.
                        Please Contact NAZ`,
          });
        }
      });
    }
  });
};

const createToken = (sAMAccountName) => {
  return jsonwebtoken.sign(
    {
      sAMAccountName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "4h",
    }
  );
};

export default authenticateUser;
