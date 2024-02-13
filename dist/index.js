function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import { exec, spawnSync } from "child_process";
import { promisify } from "util";
import inquirer from "inquirer";
var environmentList = [
    "production",
    "staging",
    "test-1",
    "test-2",
    "test-3",
    "test-4",
    "test-tm",
    "test-seo",
    "qa",
    "design"
];
var versionList = [
    "major",
    "minor",
    "patch"
];
var DeploymentType;
(function(DeploymentType) {
    DeploymentType["Production"] = "production";
    DeploymentType["Development"] = "development";
})(DeploymentType || (DeploymentType = {}));
// eslint-disable-next-line no-console
var echo = console.log;
var green = "\x1b[32m";
var noColor = "\x1b[0m";
var execute = promisify(exec);
var toFirstUpperCase = function(str) {
    return str.replace(/^\S/, function($1) {
        return $1.toUpperCase();
    });
};
var getBranchName = function() {
    var _ref = _async_to_generator(function() {
        var stdout;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        execute("git branch --show-current")
                    ];
                case 1:
                    stdout = _state.sent().stdout;
                    return [
                        2,
                        stdout.replace(/\n/gi, "").trim()
                    ];
            }
        });
    });
    return function getBranchName() {
        return _ref.apply(this, arguments);
    };
}();
var runWorkflow = function(deploymentTarget, branch, inputs) {
    echo();
    var inputArray = Object.entries(inputs).flatMap(function(param) {
        var _param = _sliced_to_array(param, 2), key = _param[0], value = _param[1];
        return [
            "-f",
            "".concat(key, "=").concat(value)
        ];
    });
    return spawnSync("gh", [
        "workflow",
        "run",
        "Deployment to ".concat(deploymentTarget),
        "--ref",
        branch
    ].concat(_to_consumable_array(inputArray)), {
        stdio: "inherit"
    });
};
// main
_async_to_generator(function() {
    var currentBranch, _ref, environment, version, branch;
    return _ts_generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    getBranchName()
                ];
            case 1:
                currentBranch = _state.sent();
                return [
                    4,
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "environment",
                            message: "환경을 선택해주세요.",
                            choices: environmentList
                        },
                        {
                            type: "list",
                            name: "version",
                            message: "버전을 선택해주세요.",
                            default: "patch",
                            choices: versionList,
                            when: function(param) {
                                var environment = param.environment;
                                return environment === "production";
                            }
                        },
                        {
                            type: "search-list",
                            name: "branch",
                            message: "브랜치를 선택해주세요.(검색 가능)",
                            default: currentBranch,
                            choices: function() {
                                echo(currentBranch);
                                echo("> 브랜치 목록 최신화 하는 중...");
                                echo();
                                spawnSync("git", [
                                    "fetch",
                                    "origin"
                                ]);
                                var remoteBranch = spawnSync("git", [
                                    "branch",
                                    "-r"
                                ], {
                                    encoding: "utf8"
                                }).stdout.split("\n").map(function(b) {
                                    return b.trim().replace("origin/", "");
                                });
                                return [
                                    currentBranch
                                ].concat(_to_consumable_array(remoteBranch));
                            }()
                        }
                    ])
                ];
            case 2:
                _ref = _state.sent(), environment = _ref.environment, version = _ref.version, branch = _ref.branch;
                if (environment === "production") {
                    if (version) {
                        runWorkflow("production", currentBranch, {
                            VERSION: version
                        });
                        echo();
                        echo("> 프로덕션 ".concat(green).concat(toFirstUpperCase(version), " ").concat(noColor, "업데이트를 시작합니다."));
                        echo("> 배포 브랜치: ".concat(green).concat(currentBranch));
                    }
                    return [
                        2
                    ];
                }
                runWorkflow("development", currentBranch, {
                    environment: environment
                });
                echo();
                echo("> ".concat(green).concat(toFirstUpperCase(environment), " ").concat(noColor, "환경 배포를 시작합니다."));
                echo("> 배포 브랜치: ".concat(green).concat(currentBranch));
                return [
                    2
                ];
        }
    });
})();

