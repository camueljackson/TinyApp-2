# TinyApp-2 Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

![Login page](https://github.com/camueljackson/TinyApp-2/blob/master/loginPage.png?raw=true)
![Page showing shortened URL and long URL, available for edit.](https://github.com/camueljackson/TinyApp-2/blob/master/URLShowPage.png?raw=true)

![URLs database once URLs have been entered. Available delete or update.](https://github.com/camueljackson/TinyApp-2/blob/master/URLDatabase.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-parser

*alternative project: - cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.


Note:  a version of the server is available which uses cookie-session instead of cookie-parser. The cookie-session version does not keep track of cookies at this time, but further work will result in the cookie-session being fully implemented.
