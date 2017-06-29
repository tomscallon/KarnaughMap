System.config({
  "paths": {
    "*": "build/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js",
    "components:*": "build/react_components/*.js"
  }
});

System.config({
  "map": {
    "jquery": "github:components/jquery@^2.1.1",
    "react": "github:reactjs/react-bower@^0.11.2",
    "npm:http-server": "npm:http-server@^0.7.1",
    "npm:colors@0.6.2": {},
    "npm:opener@1.3.0": {},
    "npm:portfinder@0.2.1": {
      "mkdirp": "npm:mkdirp@0.0"
    },
    "npm:optimist@0.5.2": {
      "wordwrap": "npm:wordwrap@0.0"
    },
    "npm:mkdirp@0.0.7": {},
    "npm:wordwrap@0.0.2": {},
    "npm:ent@0.0.7": {
      "json": "github:systemjs/plugin-json@master"
    },
    "npm:inherits@2.0.1": {},
    "npm:mime@1.2.11": {},
    "npm:ieee754@1.1.4": {},
    "npm:pkginfo@0.2.3": {},
    "npm:union@0.3.8": {
      "pkginfo": "npm:pkginfo@0.2",
      "qs": "npm:qs@0.5"
    },
    "npm:base64-js@0.0.7": {},
    "npm:Base64@0.2.1": {},
    "npm:http-server@0.7.1": {
      "colors": "npm:colors@0.6",
      "optimist": "npm:optimist@0.5",
      "union": "npm:union@0.3",
      "ecstatic": "npm:ecstatic@0.4",
      "portfinder": "npm:portfinder@0.2",
      "opener": "npm:opener@1.3"
    },
    "npm:ecstatic@0.4.13": {
      "mime": "npm:mime@1.2",
      "ent": "npm:ent@0.0",
      "optimist": "npm:optimist@0"
    },
    "npm:qs@0.5.6": {},
    "github:jspm/nodelibs@0.0.3": {
      "Base64": "npm:Base64@0.2",
      "base64-js": "npm:base64-js@0.0",
      "ieee754": "npm:ieee754@^1.1.1",
      "inherits": "npm:inherits@^2.0.1",
      "json": "github:systemjs/plugin-json@master"
    }
  }
});

System.config({
  "versions": {
    "github:components/jquery": "2.1.1",
    "github:reactjs/react-bower": "0.11.2",
    "npm:http-server": "0.7.1",
    "npm:colors": "0.6.2",
    "npm:opener": "1.3.0",
    "npm:portfinder": "0.2.1",
    "npm:optimist": "0.5.2",
    "github:jspm/nodelibs": "0.0.3",
    "npm:union": "0.3.8",
    "npm:ecstatic": "0.4.13",
    "npm:mkdirp": "0.0.7",
    "npm:wordwrap": "0.0.2",
    "npm:pkginfo": "0.2.3",
    "npm:ent": "0.0.7",
    "npm:mime": "1.2.11",
    "npm:qs": "0.5.6",
    "npm:inherits": "2.0.1",
    "github:systemjs/plugin-json": "master",
    "npm:ieee754": "1.1.4",
    "npm:base64-js": "0.0.7",
    "npm:Base64": "0.2.1"
  }
});

