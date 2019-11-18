/**
 * Created by Villen on 19/7/1.
 */
'use strict'

// 做请求节流；
const requestUrlObj = {};
function deleteRequestUrl(url) {
    delete requestUrlObj[url];
}
//自定义 ajax 请求
export function ajax(option){
    const {
        baseUrl='',
        url,
        dataType = 'json',
        method = 'GET',
        headers,
        success,
        error,
        complete,
        resolve = function () {
        },
        reject = function () {
        }
    } = option;
    if(!url){
        throw new Error('Need for url');
    }
    if(requestUrlObj[url]) return;
    requestUrlObj[url] = url;
    let data = option.data || {};
    let requestUrl = `${baseUrl}${url}`;
    if(!!option.data && typeof option.data !== 'string'){
        data = Object.keys(option.data)
            .map(key => `${key}=${option.data[key]}`)
            .join('$');
    }else{
        data = option.data || '';
    }
    if(method.toUpperCase()==='GET'){
        requestUrl = data ? `${requestUrl}?${data}` : requestUrl
    }

    const request = new XMLHttpRequest();
    request.open(method, requestUrl, true);
    if(method.toUpperCase()=='POST'){
        request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    }
    if(headers){
        Object.keys(headers).forEach(item=>{
            request.setRequestHeader(item,headers[item]);
        })
    }
    request.onload = ()=>{
        if(request.status>=200 && request.status<400){
            let result = request.responseText;
            if(dataType.toUpperCase()==='JSON'){
                result = JSON.parse(request.responseText);
            }
            if(result.data){
                if(typeof success ==='function'){
                    success(result);
                    if(complete && typeof complete==='function') complete(result);
                }
                resolve(result)
            } else {
                if(result.code=== -1306 || result.code === 403){
                    if(complete && typeof complete==='function') complete(result);
                }
                handleError()
            }

        } else {
            handleError();
        }
        deleteRequestUrl(url);
    };
    if (method.toUpperCase() === "GET") {
        request.send(null);
    } else {
        request.send(data);
    }
    function handleError(er) {
        const msg = er || '网络异常';
        //toast({msg});
        reject(msg);
        if(error && typeof error==='function') error(msg);
        if(complete && typeof complete==='function') complete(msg);
    }
}

//定义请求的promise
export function fetchData (option){
    if(Promise){
        return new Promise(function (resolve,reject) {
            option.resolve = resolve;
            option.reject = reject;
            ajax(option);
        })
    } else {
        throw new Error('不支持Promise')
    }
}

//获取参数：参数对象
export function getParams(param,url) {
    let _url = url || location.href,
        search = location.search.substr(1); //获取url中"?"符后的字串
    if(search.indexOf('?from')>-1){ //微信分享问题
        search = _url.split('?')[2]
    }else{
        search = _url.split('?')[1] || search;
    }
    if(param && typeof param!='object'){
        var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
        var r = search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    let theRequest = new Object();
    if (search.indexOf("=") != -1) {
        let str = search,
        strs = str.split("&");
        for(let i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

//判断 浏览器类型
export const UA = navigator.userAgent;
export function getBrowserType(name) {
    if(name){
        var exp=new RegExp(name);
        return exp.exec(UA) ? true : false;
        //return UA.indexOf(name)>-1 ? true : false
    }
    if(UA.match(/micromessenger/i))
        return 'isWeixin'
    if(UA.match(/weibo/i))
        return 'isWeibo'
    if(UA.match(/yixin/i))
        return 'isYixin'
    if(UA.match(/qq/i))
        return 'isQQ'
    if(UA.match(/baidubrowser/i))
        return 'isBaidu'
    return 0;
}
//判断 系统类型
export function getSystemType() {
    let sys = '';
    if(UA.match(/android/ig) || UA.match(/Windows; U;/)){
        sys = 'isAndroid'
    }else if(UA.match(/iphone|ipod|ipad/ig)){
        sys = 'isIos'
    }
    if(sys=='isIos' && Number(ua.match(/OS\s(\d+)/i)[1]) > 8){
        sys = 'isIos9'
    }
    return sys;
}
export function getBS() {
    return [getSystemType(),getBrowserType()];
}
// 判断是否支持 webp
const canUseWebp = (() => {
    const elem = document.createElement("canvas");
    if (elem.getContext && elem.getContext("2d")) {
        // was able or not to get WebP representation
        return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    }
    return false;
})();

//动态引入JS
export function importJs(url, callback) {
    const script = document.createElement("script");
    script.src = url;
    script.charset = "utf-8";
    script.onload = () => {
        script.onload = script.onerror = null;
        script.parentNode.removeChild(script);
        typeof callback === "function" && callback(true);
    };
    script.onerror = () => {
        script.onload = script.onerror = null;
        script.parentNode.removeChild(script);
        typeof callback === "function" && callback(false);
    };
    document.head.appendChild(script);
}

//深拷贝
export function deepCopy(obj) {
    // Handle the 3 simple types, and null or undefined
    if (obj == null || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        let copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        let copy = [];
        for (let i = 0, len = obj.length; i < len; ++i) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        let copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}


// 获取cookies
export function getCookie(name) {
    const regexp = new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[-.+*]/g, "\\$&") +
        "\\s*\\=\\s*([^;]*).*$)|^.*$");
    return decodeURIComponent(document.cookie.replace(regexp, "$1")) || "";
}
// 设置cookie
export function setCookie(name,value,days=0.5) {
    var exp = new Date();
    exp.setTime(exp.getTime() + days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}


//获取app-version
export function getVersion(aimName) {
    return UA.match(/TopLine\/[\d.]+/gi)[0].match(/[\d.]+/gi)[0];
}

//打印log
export function printLog(obj,name) {
    let back={}, tip = name || 'log';
    back[name]=obj
    console.log(tip+': ----------')
    console.log(back);
}
//时间格式化
export function getDocDate(t,lengh=16) {
    let date = new Date(t);
    let y = date.getFullYear(),
        m = addZero(date.getMonth()+1),
        d = addZero(date.getDate()),
        h = addZero(date.getHours()),
        mm = addZero(date.getMinutes()),
        s = addZero(date.getSeconds());
    let result = y+'-'+ m+'-'+ d+' '+ h+':'+mm+':'+s;
    return result.substr(0,lengh);
}
function addZero(t) {
    return t<10 ? '0'+t : t;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
};

export function isVNode(node) {
    return typeof node === 'object' && hasOwn(node, 'componentOptions');
};

export function getFirstComponentChild(children) {
    return children && children.filter(c => c && c.tag)[0];
};