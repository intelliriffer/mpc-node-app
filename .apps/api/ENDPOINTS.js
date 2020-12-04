/**
 * URL ENDPOINTS FOR THE APP
 * 
 */

module.exports = [
    {
        NAME: "Home",
        PATH: "./api/endpoints/home.js",
        PARAM: "/",
        URL: "/",
        HIDDEN: false
    },

    {
        NAME: "Arp Manager",
        PATH: "./api/endpoints/arps.js",
        PARAM: "/arps",
        URL: "/arps",
        HIDDEN: false
    },
    {
        NAME: "Static Assets",
        PATH: "./api/endpoints/static.js",
        PARAM: "/static",
        URL: "/static",
        HIDDEN: true
    },
    {
        NAME: "Prog Builder",
        PATH: "./api/endpoints/pbuilder.js",
        PARAM: "/pbuilder",
        URL: "/pbuilder",
        HIDDEN: false
    },
    {
        NAME: "Projects",
        PATH: "./api/endpoints/projects.js",
        PARAM: "/projects",
        URL: "/projects",
        HIDDEN: false
    },
    {
        NAME: "Shell",
        PATH: "./api/endpoints/shell.js",
        PARAM: "/shell",
        URL: "/shell",
        HIDDEN: false
    },
];