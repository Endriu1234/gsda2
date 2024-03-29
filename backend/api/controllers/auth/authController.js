const { authenticate } = require('ldap-authentication');
const jwt = require('jsonwebtoken');

module.exports.login = async (req, res) => {
    const retVal = {
        success: false,
        errorMessage: '',
        user: null,
        token: null,
        expiresIn: null
    };

    if (req.body.user && req.body.password) {
        const options = getLdapOptions(req.body.user, req.body.password);
        let user = null;

        try {
            user = await authenticate(options);
        }
        catch (error) {
            if (error && error.lde_message === 'Invalid Credentials')
                console.log(`LDAP returned "Invalid Credentials" for ${req.body.user}`);
            else
                console.log(error);
        }

        if (user) {
            retVal.token = jwt.sign({ user: user.sAMAccountName }, process.env.JWT_KEY, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            retVal.expiresIn = process.env.JWT_EXPIRES_IN;
            retVal.user = user.sAMAccountName;
            retVal.success = true;
        }
        else
            retVal.errorMessage = 'User not authorized';
    }
    else
        retVal.errorMessage = "User or Password not provided";

    return res.status(200).json(retVal);
}

function getLdapOptions(username, password) {
    return {
        ldapOpts: {
            url: process.env.LDAP_URL,
            tlsOptions: { rejectUnauthorized: false }
        },
        userDn: process.env.LDAP_USER_DN.replace('{{username}}', username),
        userSearchBase: process.env.LDAP_SEARCH_BASE,
        usernameAttribute: process.env.LDAP_USERNAME_ATTRIBUTE,
        searchFilter: process.env.LDAP_SEARCH_FILTER,
        username: username,
        userPassword: password
    };
}

module.exports.checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.authData = { user: decodedToken.user };
        next();
    }
    catch (error) {

        if (process.env.FAKE_USER) {
            req.authData = { user: process.env.FAKE_USER };
            next();
        }
        else
            res.status(401).json({ message: "You are not authenticated!" });
    }
}