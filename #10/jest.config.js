export default {
    testMatch: ['**/specs/**/*.spec.js'],
    "transform": {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    "reporters": [
	"default",
	["jest-html-reporters", {
	    "publicPath": "./report-jest-html",
	    "filename": "report.html",
	    "pageTitle": "Test Report"
	}]
    ]
}
