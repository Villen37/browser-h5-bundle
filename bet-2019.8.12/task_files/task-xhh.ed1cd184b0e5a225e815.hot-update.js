webpackHotUpdate("task-xhh",{

/***/ "./node_modules/babel-runtime/core-js/object/define-property.js":
false,

/***/ "./node_modules/babel-runtime/helpers/defineProperty.js":
false,

/***/ "./node_modules/core-js/library/fn/object/define-property.js":
false,

/***/ "./node_modules/core-js/library/modules/es6.object.define-property.js":
false,

/***/ "./src/task-xhh/index.js":
/*!*******************************!*\
  !*** ./src/task-xhh/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = __webpack_require__(/*! babel-runtime/helpers/extends */ "./node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _promise = __webpack_require__(/*! babel-runtime/core-js/promise */ "./node_modules/babel-runtime/core-js/promise.js");

var _promise2 = _interopRequireDefault(_promise);

var _util = __webpack_require__(/*! ../common/util */ "./src/common/util.js");

var _ua = __webpack_require__(/*! ../common/ua */ "./src/common/ua.js");

var _newsappProtocol = __webpack_require__(/*! ../common/newsapp-protocol */ "./src/common/newsapp-protocol/index.js");

var _newsappProtocol2 = _interopRequireDefault(_newsappProtocol);

__webpack_require__(/*! ./index.less */ "./src/task-xhh/index.less");

var _swiper441Min = __webpack_require__(/*! ../common/swiper/swiper-4.4.1.min.js */ "./src/common/swiper/swiper-4.4.1.min.js");

var _swiper441Min2 = _interopRequireDefault(_swiper441Min);

__webpack_require__(/*! ../common/swiper/swiper-4.4.1.min.css */ "./src/common/swiper/swiper-4.4.1.min.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = document.querySelector.bind(document);
var delegate = $(".js-delegate");
var taskTop = $(".js-delegate .task-top");

var PAGE = "task";
var fnum = Math.floor(Math.random() * 9 + 1); // 推荐接口的刷新次数
var header = null;
var isLogin = false;
var pushstatus = false;
var pushcount = 0;
var adsShow = {
    yes_ads: []
}; //sign:10 & box:12

var inReview = 0;
try {
    inReview = (0, _util.localParam)().search.inreview;
} catch (error) {
    console.log(error);
}
document.querySelector('.loading-model').style.display = "block";
delegate.style.display = "block";
/*NewsappAPI.accountInfo(headers => {
    if (headers && headers['User-tk']) {
        header = headers;
        isLogin = true;
    }else if(!window.localStorage.getItem('taskFirst')){ //首次进入
        showToast('签到可领取58金币',4000);
        window.localStorage.setItem('taskFirst',true);
    }
    getApi();
});
NewsappAPI.pushstatus(data => {
    pushstatus = data.status==1 ? true : false;
    pushcount = data.count;
    console.log(pushstatus+'=='+pushcount);
})
NewsappAPI.exploreUserinfo(data => {
    data ? $('.wekeup-name').innerText = data.nickname : '';
});

// 隐藏工具栏
NewsappAPI.ui.button(" ");*/
getApi();
function getApi() {
    /*fetchSignbox();*/
    fetchTasklist();

    //徒弟唤醒回流
    var param_wakeup = (0, _util.localParam)().search.wakeup;
    if (isLogin && param_wakeup) {
        wakeupBack(param_wakeup);
    }
}

function fetchSignbox() {
    (0, _util.ajax)({
        // url: '/mock/signbox.json',
        url: _util.localHost + "/lite/api/signBox",
        dataType: "json",
        headers: header,
        success: successFn,
        error: function error() {
            (0, _util.showToast)("服务异常");
        }
    });
}

function fetchTasklist() {
    console.log('---tiem1');

    (0, _util.ajax)({
        // url: '/mock/task.json',
        url: "http://39.100.43.169:8091/api/v1/app/activity/list",
        dataType: "jsonp",
        data: {
            userid: 0,
            type: '123'
        },
        headers: header,
        success: renderTaskList
    });
}

/**
 * 签到成功后的推荐列表
 * @param {刷新推荐列表的次数，如果每次刷新没更新fn会导致接口返回空数组} fn
 */
function recommendList(fn) {
    // 获取设备号
    _newsappProtocol2.default.device(function (info) {
        // 获取用户id
        _newsappProtocol2.default.exploreUserinfo(function (_info) {
            var info_u = info.u || '',
                ts = new Date().getTime();
            var devId = info_u,
                passport = _info.name,
                sign = '';

            var promise = new _promise2.default(function (resolve, reject) {
                _newsappProtocol2.default.encrypt(devId, function (encryText) {
                    devId = encryText;
                    //console.log(`devid:${encryText}`)
                    resolve();
                });
            });
            promise.then(function (resolve) {
                return new _promise2.default(function (resolve, reject) {
                    _newsappProtocol2.default.encrypt(passport, function (encryText) {
                        passport = encryText;
                        //console.log(`passport:${encryText}`)
                        resolve();
                    });
                });
            });
            promise.then(function (resolve) {
                _newsappProtocol2.default.encrypt({ info_u: info_u, ts: ts }, function (encryText) {
                    (0, _util.ajax)({
                        // url: `//test.bjrec.m.163.com/recommend/getSubDocPic?position=signTask&tid=T1348647909107&from=toutiao&fn=${fn || fnum}&offset=0&size=3&devId=${info.u || ''}&passport=${_info.name}`,
                        url: _util.localHost + "/recommend/getSubDocPic?position=signTask&tid=T1348647909107&from=toutiao&fn=" + (fn || fnum) + "&offset=0&size=2&devId=" + devId + "&encryption=1&version=" + version + "&passport=" + passport + "&sign=" + encryText + "&ts=" + ts,
                        dataType: "json",
                        headers: header,
                        success: recommendRender
                    });
                });
            });
        });
    });
}

// 签到开宝箱部分
function successFn(data) {
    if (data.code === 200) {
        taskTop.classList.remove("hide");
        var _data$info = data.info,
            signList = _data$info.signList,
            signCount = _data$info.signCount,
            signFlag = _data$info.signFlag,
            lastOpenTime = _data$info.lastOpenTime,
            time = _data$info.time;

        //宝箱

        var signClass = $('.sign-surprise-btn').classList;
        if (time - lastOpenTime < 3600000) {
            // 开奖倒计时
            var t = getRemainTime(time, lastOpenTime);
            var tf = function tf(i) {
                return "" + i;
            };
            var leftTime = tf(t.hours) + ":" + tf(t.minutes) + ":" + tf(t.seconds);
            setTimer(time, lastOpenTime); // 设置两小时间隔的开奖
            $(".js-time").innerHTML = leftTime;
            signClass.add('wait');
            signClass.remove('open');
        } else {
            signClass.add('open');
            signClass.remove('wait');
            adsShow.yes_ads.push('box');
        }
        //签到
        var countFlag = parseInt(signCount / 7);
        signCount = signCount % 7;
        //let goldCount = signCount >= 7 ? signList[6] : signList[signCount];
        var goldCount = 3;
        var signListHtml = '123' || signList.map(function (item, index) {
            // 初始状态
            var statusClass = "";
            var circleHtml = "+" + item;
            var statusText = index + 1 + 7 * countFlag + "\u5929";
            // 已领取
            if (index < signCount || signFlag && signCount == 0) {
                statusClass = "received";
                statusText = "已领取";
                goldCount = signList[signCount >= 7 ? 6 : signCount - 1];
            }
            // 可领取
            if (!signFlag && (index === signCount || signCount >= 7 && index === 6)) {
                statusClass = "active";
                statusText = "可领取";
                adsShow.yes_ads.push('sign');
            }
            var html = "\n      <div class=\"sign-progress-item " + statusClass + "\">\n        <div class=\"sign-circle\">\n          " + circleHtml + "\n        </div>\n        <div class=\"sign-status\">" + statusText + "</div>\n      </div>\n    ";
            return html;
        }).join("");
        // const goldCount = signCount >= 7 ? signList[6] : signList[signCount]
        $(".js-sign-wrap").innerHTML = "\n    <div class=\"sign-wrap\">\n      <div class=\"sign-wrap-fl hide\">\u5DF2\u8FDE\u7EED\u7B7E\u5230 " + signCount + " \u5929<span class=\"gold sign-gold\">+" + goldCount + "</span></div>\n      <div class=\"sign-wrap-fr js-sign" + (signFlag ? " received" : "") + "\" data-stat=\"task@doSign\">\u7B7E\u5230\u9886\u91D1\u5E01</div>\n    </div>\n    <div class=\"sign-progress\">\n      " + signListHtml + "\n    </div>\n  ";
    } else {
        (0, _util.showToast)(data.msg);
    }
}

// 任务列表
function renderTaskList(backData) {
    var dataBack = JSON.parse(backData);
    if (dataBack.code === 10000) {
        var data = dataBack.data;
        var rlist = data.rlist;
        console.log('rlist-----');
        console.log(rlist);
        var nlistFinish = 0; //新手完成
        var getHtml = function getHtml(list, text) {
            if (!list) return '';
            var html = list.map(function (item, index) {
                var name = item.name,
                    tip = item.tip,
                    desc = item.desc,
                    url = item.url,
                    button = item.button,
                    isCoin = item.isCoin,
                    total = item.total,
                    done = item.done,
                    code = item.code;

                if (text == 'nlist' && done == 1) {
                    nlistFinish++;
                }

                /*if(data.info.expireTime && data.info.expireTime > new Date().getTime()){
                    if((pushstatus || pushcount>0) && name=='开启推送'){
                        return '';
                    }
                    if(!pushstatus && pushcount==0 && code==5){ //code==5 阅读推送
                        return '';
                    }
                }else {
                    if(name=='开启推送'){
                        return '';
                    }
                }*/

                var coinHtml = desc ? "<span class=\"" + (+isCoin === 1 ? "yuan" : "gold") + "\">+" + desc + "</span>" : "";
                var buttonHtml = "";
                var local_href = '';
                var fenzi = done || 0,
                    fenmu = total || 1;
                if (name == '开启推送' && pushstatus) {
                    fenzi = 1;
                }
                // 判断任务是否有按钮
                if (button) {
                    // 判断任务是否完成
                    if (fenzi - fenmu >= 0) {
                        buttonHtml = "<span class=\"complated\">已完成</span>";
                        //fenzi=fenmu;
                    } else {
                        // 有些任务有按钮但未必是跳转链接
                        buttonHtml = "<div class=\"list-btn js-button\">" + button + "</div>";
                        /*buttonHtml = url
                         ? `<a class="list-btn js-button" href="${url}" data-stat="task@${text}@code${code}">${button}</a>`
                         : `<div class="list-btn js-button" data-stat="task@${text}@code${code}">${button}</div>`;*/
                    }
                }
                /*const fenzi2 = fenzi>999
                 ? (fenzi>9999 ? radixPoint(fenzi/10000)+'万' : radixPoint(fenzi/1000)+'千')
                 : fenzi;
                 const fenmu2 = fenmu>9999 ? radixPoint(fenmu/10000)+'万' : fenmu;*/

                var return_dom = "\n\t\t\t\t\t\t\t\t\t  <div class=\"task-info\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"task-nav-fl\">" + name + coinHtml + "</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"task-proportion " + (fenzi == fenmu ? 'task-finish' : '') + "\">\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"fl-l\"><span style=\"width:" + fenzi / fenmu * 100 + "%\"></span></div>\n\t\t\t\t\t\t\t\t\t\t\t<div class=\"fl-r\"><span>" + fenzi + "</span>/" + fenmu + "</div>\n\t\t\t\t\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t\t\t\t  <div class=\"\">\n\t\t\t\t\t\t\t\t\t\t  <div class=\"task-text\">" + tip + "</div>\n\t\t\t\t\t\t\t\t\t\t  <div class=\"task-nav-fr task-proportion \">\n\t\t\t\t\t\t\t\t\t\t  " + buttonHtml + "\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t\t\t\t";

                if (url && fenzi != fenmu) {
                    return "<a class=\"task-nav-item active\" href=\"" + url + "\" data-stat=\"task@" + text + "@code" + code + "\" data-btn=\"" + button + "\">\n\t\t\t\t\t\t\t\t\t" + return_dom + "\n\t\t\t\t\t\t\t\t</a>  \n\t\t\t\t\t\t\t\t";
                } else {
                    var look = code == 5 && fenzi != fenmu ? 'task-look' : '';
                    return "\n\t\t\t\t\t\t\t<div class=\"task-nav-item active " + look + "\" data-stat=\"task@" + text + "@code" + code + "\" data-btn=\"" + button + "\">\n\t\t\t\t\t\t\t\t" + return_dom + "\n\t\t\t\t\t\t\t</div>";
                }
            }).join("");
            var topText = "",
                topTime = '';
            if (text === "rlist") {
                topText = "日常任务";
            } else if (text === "flist") {
                topText = "分享任务";
            } else if (text === "nlist") {
                topText = "新手任务";
                topTime = "<div class=\"list-time list-time-" + text + "\"></div>";
            } else if (text === "blist") {
                topText = "基础任务";
                topTime = "<div class=\"list-time list-time-" + text + "\"></div>";
            } else {
                topText = "师徒任务";
            }
            if (topText === "师徒任务") return "";

            return "\n\t\t\t  <div class=\"novice\">\n\t\t\t\t<div class=\"list-top\">" + topText + "</div>\n\t\t\t\t" + topTime + "\n\t\t\t\t<div class=\"task-nav task-nav-" + text + "\">\n\t\t\t\t  " + html + "\n\t\t\t\t</div>\n\t\t\t  </div>\n\t\t\t";
        };

        // 低于3.7.1版本的安卓不显示新手任务
        var nlistStr = '';
        var listDom = "" + getHtml(rlist, "rlist");
        if (nlistFinish == 4) {
            //完成新手任务 改变位置
            $(".task-list").innerHTML = "" + listDom + nlistStr;
        } else {
            $(".task-list").innerHTML = "" + nlistStr + listDom;
        }
        $('.loading-model').classList.add('fade-out');
        setTimeout(function () {
            $('.loading-model').classList.add('hide');
            //看示例事件
            $('.task-look').onclick = function () {
                $(".m-modal").classList.add("sample");
            };
        }, 600);
        //$(".js-gold-text").textContent = qlist[1].instruction;

        //taskBanner

    } else {
        (0, _util.showToast)('renderTaskList');
    }
}

// 新闻推荐列表
function recommendRender(data) {
    var list = data.T1348647909107;
    $(".js-commend-list").classList.add("received");
    $('.f-refresh').classList.remove('sleep');
    var listHtml = list.slice(0, 2).map(function (item) {
        var imgsrc = item.imgsrc,
            title = item.title,
            replyCount = item.replyCount,
            docid = item.docid;

        return "\n      <a class=\"news-list-item\" href=\"newsapplite://doc/" + docid + "\">\n        <div class=\"f-cover\">\n          <img src=\"" + imgsrc + "\" alt=\"\">\n        </div>\n        <div class=\"list-fr\">\n          <div>" + title + "</div>\n          <div>\u8DDF\u8D34\u6570 " + replyCount + "</div>\n        </div>\n      </a>\n    ";
    }).join("");
    var newslist = $(".news-wrap .news-list");
    newslist.innerHTML = listHtml;
    newslist.style.background = "none";
}

/**
 * 获取剩余时间
 * @param {当前时间} currentTime
 * @param {上次开奖时间} lastTime
 * @param {间隔开奖时间值} intervalTime
 */
var getRemainTime = function getRemainTime(currentTime, lastTime) {
    var intervalTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3600000;

    var t = intervalTime - (currentTime - lastTime);
    var seconds = Math.floor(t / 1000 % 60),
        minutes = Math.floor(t / 1000 / 60 % 60),
        hours = Math.floor(t / (1000 * 60 * 60) % 24);
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return {
        total: t,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
};

/**
 * 设置定时器
 * @param {当前时间} currentTime
 * @param {上次开奖时间} lastTime
 * @param {间隔开奖时间值} intervalTime
 */
var setTimer = function setTimer(currentTime, lastTime) {
    var intervalTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3600000;

    return 0;
    var time = currentTime;
    var intervalTimer = setInterval(function () {
        // 得到剩余时间
        var remainTime = getRemainTime(time, lastTime, intervalTime);
        time += 1000;
        // 倒计时默认到2小时内
        if (remainTime.total <= intervalTime && remainTime.total > 0) {
            var tf = function tf(i) {
                return "" + i;
            };
            $(".js-time").textContent = tf(remainTime.hours) + ":" + tf(remainTime.minutes) + ":" + tf(remainTime.seconds);
        } else if (remainTime.total <= 0) {
            clearInterval(intervalTimer);
            // 倒计时结束
            $(".js-time").innerHTML = "";
            var signClass = $('.sign-surprise-btn').classList;
            signClass.add('open');
            signClass.remove('wait');
            adsShow.yes_ads.push('box');
            getAds();
        }
    }, 1000);
};

/**
 * 签到和开宝箱共用方法
 * @param {请求的接口地址} url
 * @param {成功回调} callback
 * @param {其他参数} other
 */
function middleware(url, callback) {
    var other = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    // 获取设备号
    _newsappProtocol2.default.device(function (info) {
        // 加密
        var data = {
            timestamp: new Date().getTime(),
            deviceid: info.u,
            udid: info.udid || ""
        };
        _newsappProtocol2.default.encrypt((0, _extends3.default)({}, data, other), function (encryText) {
            (0, _util.ajax)({
                method: "post",
                url: url,
                data: {
                    data: encodeURIComponent(encryText)
                },
                dataType: "json",
                headers: header,
                success: function success(d) {
                    callback && callback(d);
                }
            });
        });
    });
}

function login() {
    _newsappProtocol2.default.login(function (userinfo) {
        if (userinfo) {
            isLogin = true;
            _newsappProtocol2.default.accountInfo(function (headers) {
                header = headers;
                getApi(headers);
            });
        }
    });
}

// 绑定事件
{
    // 签到
    delegate.addEventListener("click", function (e) {
        var target = e.target;
        var classList = target.classList;
        /*recommendList()
         $('.m-modal').classList.add('sign')*/
        if (!target || !classList.contains("js-sign") || classList.contains("received")) {
            return;
        }
        if (!isLogin) {
            login();
        } else {
            setAdsHtml('sign');
            postSignbox(target);
        }
    }, false);

    // 打开宝箱
    delegate.addEventListener("click", function (e) {
        var target = e.target;
        if (!target || !target.classList.contains("open")) return;
        if (!isLogin) {
            login();
        } else {
            setAdsHtml('box');
            postOpenbox(target);
        }
    }, false);

    // 展开任务
    /*delegate.addEventListener(
     "click",
     e => {
     const target = e.target;
     if (!target || !target.classList.contains("list-arrow")) return;
     const classList = closest(target, ".task-nav-item").classList;
     if (!classList.contains("active")) {
     classList.add("active");
     } else {
     classList.remove("active");
     }
     },
     false
     );*/

    // 任务跳转
    delegate.addEventListener("click", function (e) {
        var target = e.target;
        var linkDom = (0, _util.closest)(target, "a.task-nav-item");
        if (!linkDom) {
            return;
        }
        if (!isLogin) {
            login();
            e.preventDefault();
        }
    }, false);

    // 关闭弹框
    delegate.addEventListener("click", function (e) {
        var target = e.target;
        if (!target || !(target.classList.contains("f-close") || target.classList.contains("f-comfirm"))) {
            return;
        }
        // 如果关闭的弹框是来自查看示例的，就不需要重新刷新个人中心的数据
        var class_list = $(".m-modal").classList,
            isRefresh = class_list.contains("sample") || class_list.contains('wakeup');
        // const openbox = $('.m-modal').classList.contains('golds')
        $(".m-modal").className = "m-modal";
        if (!isRefresh) {
            // 重新展示新的个人中心数据
            fetchSignbox();
        }
        var adsM = $('.ads-modal');
        adsM ? adsM.classList.remove('ads-modal') : '';
    }, false);
    // 打开分享
    /*delegate.addEventListener(
     "click",
     e => {
     const target = e.target;
     if (!target || !target.classList.contains("task-nav-item")) return;
     if (target.getAttribute('data-btn') === "去分享") {
     if (!isLogin) {
     login();
     }
     }
     },
     false
     );*/
    // 推荐新闻换一换功能
    delegate.addEventListener("click", function (e) {
        var target = e.target;
        if (!target || !target.classList.contains("f-refresh")) return;
        if (target.classList.contains('sleep')) return;
        $(".js-commend-list").classList.remove("received");
        target.classList.add('sleep');
        recommendList(fnum + 1);
        fnum++;
    }, false);

    // 点宝箱的分享
    delegate.addEventListener("click", function (e) {
        var target = e.target;
        if (!target || !target.classList.contains("js-golds-share")) return;
        // 分享链接为邀请徒弟的链接，需要inviteCode
        (0, _util.ajax)({
            url: _util.localHost + "/lite/api/invitecode/select",
            dataType: "json",
            headers: header,
            success: function success(data) {
                if (!data.code === 200) return;
                var inviteCode = data.info.inviteCode;

                // 设置分享配置

                var num = Math.floor(Math.random() * 100);
                var shareText = [{
                    wxTitle: "现在邀请2个好友看资讯，马上领11元",
                    wxText: "好友越多，奖励无限累加，更有精彩视频/资讯等着你",
                    wbText: "好友越多，奖励无限累加，更有精彩视频/资讯等着你"
                }, {
                    wxTitle: "现在邀请2个好友看资讯，马上领11元",
                    wxText: "\u6211\u6709" + num + "\u4E2A\u597D\u53CB\u5728\u7F51\u6613\u4E00\u8D77\u770B\u8D44\u8BAF\uFF0C\u4F60\u4E5F\u4E00\u8D77\u6765\uFF01",
                    wbText: "\u6211\u6709" + num + "\u4E2A\u597D\u53CB\u5728\u7F51\u6613\u4E00\u8D77\u770B\u8D44\u8BAF\uFF0C\u4F60\u4E5F\u4E00\u8D77\u6765\uFF01"
                }];
                var shareIndex = Math.floor(Math.random() * shareText.length);
                _newsappProtocol2.default.share.setShareData((0, _assign2.default)(shareText[shareIndex], {
                    wxUrl: _util.localPath + "/share.html?inviteCode=" + inviteCode,
                    wxImg: "https://static.ws.126.net/163/lite/app/3g-lite/img/newsapp.png",
                    wbImg: "https://static.ws.126.net/163/lite/app/3g-lite/img/newsapp.png",
                    shareDone: function shareDone() {
                        $(".m-modal").className = "m-modal";
                        // 分享再得金币
                        middleware(_util.localHost + "/lite/api/coin/add?type=share_box", function (d) {
                            var dd = typeof d === "string" ? JSON.parse(d) : d;
                            if (+dd.code !== 200) return;
                            (0, _util.showToast)("\u5206\u4EAB\u6210\u529F +" + (dd.info.coin || 20) + "\u91D1\u5E01");
                        }, { type: "share_box" });
                        // 重新展示新的个人中心数据
                        (0, _util.ajax)({
                            url: _util.localHost + "/lite/api/signBox",
                            dataType: "json",
                            headers: header,
                            success: successFn
                        });
                        (0, _util.handleAnalytics)(PAGE, "task@shareTreasure");
                        (0, _util.handleAntAnalysis)("task@shareTreasure");
                    }
                }));

                // 调起分享组件
                _newsappProtocol2.default.share.openShareMenu();
            },
            error: function error() {
                (0, _util.showToast)("服务异常");
            }
        });
    }, false);

    // 点击任务列表的非跳转按钮
    /*delegate.addEventListener(
     "click",
     e => {
     const target = e.target;
     if (!target || !target.classList.contains("task-nav-item")) return;
     if (target.getAttribute('data-btn') === "看示例") {
     $(".m-modal").classList.add("sample");
     }
     },
     false
     );*/
    // 点击任务列表的非跳转按钮
    delegate.addEventListener("click", function (e) {
        var target = e.target;
        if (!target || !target.classList.contains("sign-close")) return;
        $(".sign-surprise-btn").classList.add("hidden");
    }, false);

    // 点击统计,每个锚点上添加data-stat属性标志点击目标
    delegate.addEventListener("click", function (e) {
        var target = (0, _util.closest)(e.target, "[data-stat]");
        if (!target) return;
        var stat = target.dataset.stat;
        (0, _util.handleAnalytics)(PAGE, stat);
    }, false);

    // 阻止遮罩层滚动
    $(".m-modal").addEventListener("touchmove", function (e) {
        e.preventDefault();
    }, false);

    // 点击广告
    delegate.addEventListener("click", function (e) {
        var target = e.target;
        var linkDom = (0, _util.closest)(target, ".ad-body");
        if (linkDom) {
            //console.log(linkDom);
            var type = linkDom.getAttribute('data-type');
            tongjiAds(linkDom.getAttribute('data-id'), type, 'click', type + "\u5E7F\u544A\u70B9\u51FB", function () {
                window.open(linkDom.getAttribute('data-href'));
            });
        }
    }, false);
}

function postOpenbox(target) {
    target.dataset.open = 1;
    middleware(_util.localHost + "/lite/api/openBox", function (d) {
        var data = typeof d === "string" ? JSON.parse(d) : d;
        if (data.code === 200) {
            $(".js-open-gold").textContent = "+" + data.info.coin;
            $(".m-modal").classList.add("golds");
            _newsappProtocol2.default.openbox();
            $('.sign-surprise-btn').classList.add('open');
        } else {
            target.dataset.open = "";
            (0, _util.showToast)(data.msg);
        }
        //次数限制
        if (data.info.days && data.info.days >= 4) {
            $('.js-golds-share').innerText = '分享宝箱';
        }
    });
}

/*
 * 签到测试
 * */
/*getAds();
$(".js-open-gold").textContent = `11111`;
$(".m-modal").classList.add("golds");
$('.sign-surprise-btn').classList.add('open');
setTimeout(function () {
setAdsHtml('box')
},1000)
 setTimeout(function () {
$('.sign-tip').innerHTML = `<span class="coin-get js-sign-coin">45</span> <br>明日继续签到，领取更多金币`;
let signDom = `<span class="coin-get js-sign-coin coin-get-n">45</span>+<span class="coin-get js-sign-coin coin-get-n">45</span><small>(新人福利)</small><br>`;
$('.sign-tip').innerHTML = signDom;
recommendList()
$(".js-commend-list").classList.add("received");
$('.f-refresh').classList.remove('sleep');
$('.m-modal').classList.add('sign');
setAdsHtml('sign')
},1000)
 */

function postSignbox(target) {
    target.classList.add('received');
    middleware(_util.localHost + "/lite/api/sign", function (d) {
        var data = typeof d === 'string' ? JSON.parse(d) : d;
        if (data.code === 200) {
            // 哇塞！成功签到了, 改变任务页签到状态
            // classList.add('received')
            var currentSign = $('.sign-progress-item.active');
            currentSign.querySelector('.sign-status').textContent = '已领取';
            currentSign.className = 'sign-progress-item received';
            // 展示签到成功后的推荐新闻弹框
            if (data.info.boonCoin == 0) {
                // 大于1是新人  boonCunt
                $('.sign-tip').innerHTML = "<span class=\"coin-get js-sign-coin\">+" + data.info.coin + "</span> <p>\u660E\u65E5\u7EE7\u7EED\u7B7E\u5230\uFF0C\u9886\u53D6\u66F4\u591A\u91D1\u5E01</p>";
            } else {
                var signDom = "<span class=\"coin-get js-sign-coin coin-get-n\">" + data.info.coin + "</span>+<span class=\"coin-get js-sign-coin coin-get-n\">" + data.info.boonCoin + "</span><small>(\u65B0\u4EBA\u798F\u5229)</small>";
                if (!data.info.days || data.info.days < 3) {
                    signDom = signDom + "<p>\u660E\u65E5\u7B7E\u5230\uFF0C\u53EF\u7EE7\u7EED\u9886\u53D6\u65B0\u4EBA\u4E13\u4EAB" + data.info.boonCoin + "\u91D1\u5E01</p>";
                }
                $('.sign-tip').innerHTML = signDom;
            }
            if (!$('.ad-title')) {
                recommendList();
            }
            $('.m-modal').classList.add('sign');
            // 签到成功的统计
            (0, _util.handleAnalytics)(PAGE, 'task@signSuccess');
            (0, _util.handleAntAnalysis)('task@signSuccess');
        } else {
            target.classList.remove('received');
            (0, _util.showToast)(data.msg);
        }
    });
}

/*
 * 徒弟回流回来
 * @param code 回流回来携带的参数
 * */
function wakeupBack(code) {
    (0, _util.ajax)({
        url: _util.localHost + "/lite/api/apprentice/goback?code=" + code,
        dataType: "json",
        headers: header,
        success: function success(data) {
            if (data.code == 200) {
                //$('.wekeup-name').innerHTML = data.info.name;
                $('.wakeup-coin').innerHTML = "<span>+</span>" + data.info.coin;
                $(".m-modal").classList.add("wakeup");
            } else {
                (0, _util.showToast)(data.msg, 3000);
            }
            //window.localStorage.setItem('wakeup',new Date().getTime());
        },
        error: function error() {
            (0, _util.showToast)("服务异常");
        }
    });
}
/*新手倒计时*/
function countDown(dateMs) {
    var newDateMs = new Date().getTime();
    var ms = dateMs - newDateMs;
    if (ms < 1) {
        return '';
    }
    //计算出相差天数
    var days = Math.floor(ms / (24 * 3600 * 1000)) || 0;

    if (days > 9) return '';

    //计算出小时数
    var leave1 = ms % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000)) || 0;

    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000)) || 0;

    return "<span>" + days + "</span>\u5929<span>" + hours + "</span>\u65F6<span>" + minutes + "</span>\u5206";
}

/*
 保留一位小数点
 @param num 数字
 @param point 默认为1
 */
function radixPoint(num) {
    var point = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var p = point * 10;
    return parseInt(num * p) / p; //保留两位、三位小数 同理
}

/*
 * 拖动
 * @param dom div的id
 * */
function pointerMove(dom) {
    var aimDom = document.getElementById(dom);
    var getStyle = function getStyle(obj, attr) {
        if (obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj, false)[attr];
        }
    };
    var dragStart = function dragStart(e) {
        this.isdrag = true;
        this.tempX = parseInt(getStyle(aimDom, 'left'));
        this.tempY = parseInt(getStyle(aimDom, 'top'));
        this.x = e.touches[0].pageX;
        this.y = e.touches[0].pageY;
    };

    var dragMove = function dragMove(e) {
        if (this.isdrag) {
            var curX = this.tempX + e.touches[0].pageX - this.x;
            var curY = this.tempY + e.touches[0].pageY - this.y;
            //边界判断
            curX = curX < 0 ? 0 : curX;
            curY = curY < 0 ? 0 : curY;
            curX = curX < document.documentElement.clientWidth - 80 ? curX : document.documentElement.clientWidth - 80;
            curY = curY < document.documentElement.clientHeight - 80 ? curY : document.documentElement.clientHeight - 80;

            aimDom.style.left = curX + 'px';
            aimDom.style.top = curY + 'px';
            //aimDom.style.transform ='translate('+curX+'px, '+(curY-this.y)+'px)';

            //禁止浏览器默认事件
            e.preventDefault();
        }
    };

    var dragEnd = function dragEnd() {
        this.isdrag = false;
    };

    this.isdrag = true;
    this.tempX = 0;
    this.x = parseInt(getStyle(aimDom, 'left'));
    this.tempY = 0;
    this.y = parseInt(getStyle(aimDom, 'top'));

    window.onload = function () {
        aimDom.addEventListener("touchstart", dragStart);
        aimDom.addEventListener("touchmove", dragMove);
        aimDom.addEventListener("touchend", dragEnd);
    };
}

//new pointerMove('signBox');


//test log
function appApiLog(content) {
    if (_newsappProtocol2.default.log) {
        _newsappProtocol2.default.log(content);
    }
}
//appApiLog('tast starting')

/*
 * 添加广告
 * @param container 父级节点
 * @param arr  广告列表
 * */
function setAdsHtml(type) {
    if (adsShow[type] && adsShow[type] != '') {
        var adsDate = adsShow[type];
        $("." + type + "-modal").classList.add('ads-modal');
        var adBody = $("." + type + "-modal .ad-body");
        adBody.setAttribute('data-id', adsDate.id);
        var adsDom = "<div class=\"ad-title\">" + adsDate.title + "</div> <div class=\"ad-img\">";

        if (adsDate.imgUrl) {
            adsDom += "<img src=\"" + adsDate.imgUrl + "\">";
        }
        if (adsDate.imgUrls) {
            var l = adsDate.imgUrls.length;
            adBody.classList.add("ad-img-" + l);
            adsDate.imgUrls.map(function (item) {
                adsDom += "<img src=\"" + item + "\">";
            });
        }
        adsDom += "</div>";

        if (true) {
            adsDom += "<span class=\"ad-icon\">\u5E7F\u544A</span>";
        }
        if (adsDate.source) {
            adsDom += "<span class=\"ad-source\">" + adsDate.source + "</span>";
        }
        adsDom += "<div class=\"ad-jump\">\u67E5\u770B\u8BE6\u60C5</div>";
        adBody.innerHTML = adsDom;
        adBody.setAttribute('data-href', adsDate.link);
        adBody.setAttribute('data-type', type);
        adsShow[type] = '';
        //数据埋点 广告展示
        tongjiAds(adsDate.id, type, 'show', type + "\u5E7F\u544A\u5C55\u793A");
    }
}
/*
 * 获取广告
 * @param type [ box  sign]
 * */
function getAds() {
    if (_newsappProtocol2.default.getads && adsShow.yes_ads.length > 0) {
        var type = adsShow.yes_ads.shift();
        _newsappProtocol2.default.getads(type, function (adsDate) {
            adsDate ? adsShow[type] = adsDate : '';
            getAds();
        });
    }
}

/*
 * 拼接广告dom（新）
 * @param type 广告类型
 * adsShow［广告数据］.ads-modal要加到.ad-body外层以显示
 * */
function adsToDom(type) {
    if (adsShow[type] && adsShow[type] != '') {
        var adsDate = adsShow[type];
        var adsDomList = [];
        if (!Array.isArray(adsDate)) {
            adsDate = [adsDate];
        }
        adsDate.map(function (adsItem, index) {
            var adsDom = '',
                adBodyClass = type + "-modal ad-body ad-" + adsItem.mode;
            adsDom += "<div class=\"ad-title\">" + adsItem.title + "</div> <div class=\"ad-img ad-img-1\">";
            if (adsItem.imgUrl) {
                adsDom += "<img src=\"" + adsItem.imgUrl + "\">";
            }
            if (adsItem.imgUrls) {
                var l = adsItem.imgUrls.length;
                adBodyClass += " ad-img-" + l;
                adsItem.imgUrls.map(function (item) {
                    adsDom += "<img src=\"" + item + "\">";
                });
            }
            adsDom += "</div>";
            if (true) {
                adsDom += "<span class=\"ad-icon\">\u5E7F\u544A</span>";
            }
            //adsItem.source  = '京东'
            if (adsItem.source) {
                adsDom += "<span class=\"ad-source\">" + adsItem.source + "</span>";
            }
            adsDom += "<div class=\"ad-jump\">\u67E5\u770B\u8BE6\u60C5</div>";
            adsDomList.push("<div class=\"" + adBodyClass + "\" data-href=\"" + adsItem.link + "\"  data-id=\"" + adsItem.id + "\" data-type=\"" + type + "\">" + adsDom + "</div>");
            //数据埋点 广告展示
            tongjiAds(adsItem.id, type, 'show', type + "\u5E7F\u544A\u5C55\u793A");
        });
        adsShow[type] = '';
        return adsDomList;
    }
}
/*
 * 新的获取广告的方法
 * 签到 和 宝箱 依旧采用上面的方法
 * @param param
 * @param fun
 * */
getAllAds();
function getAllAds(param, fun) {
    if (_newsappProtocol2.default.getallads) {
        var type = {
            "info": [param || {
                "type": "banner",
                "category": "banner",
                "location": ["15", "17"]
            }]
        };
        _newsappProtocol2.default.getallads(type, function (adsDate) {
            adsShow = adsDate ? (0, _assign2.default)(adsShow, adsDate) : adsShow;
            fun && fun();
        });
    }
}
/*
 * 广告埋点
 * @param
 * 	id   广告id
 * 	type 广告
 * 	eve ［click show］
 * 	word 描述
 *  fun  回调
 * */
function tongjiAds(id, type, eve, word, fun) {
    if (_newsappProtocol2.default.record) {
        var param = {
            "id": id,
            "eveType": eve,
            "eventId": type + "_" + eve,
            "value": word || "广告"
        };
        _newsappProtocol2.default.record(param, function (tongji) {
            //console.log(tongji)
            fun && fun();
        });
    }
}

/***/ })

})
//# sourceMappingURL=task-xhh.ed1cd184b0e5a225e815.hot-update.js.map