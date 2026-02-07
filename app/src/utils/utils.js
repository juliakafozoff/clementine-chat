import validator from 'validator';
import moment from "moment";
import axios from "axios";

const getUrlVars = url => {
    var vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

export default class {
    static isValidEmail = email => validator.isEmail(email)
    static rodalSmallVertical = () => {
        return {width: '25%', height: '80%', overflow: 'auto'};
    }
    static rodalSmallHorizontal = () => {
        return {width: '50%', height: '55%', overflow: 'auto'};
    }
    static rodalBig = () => {
        return {width: '80%', height: '80%', overflow: 'auto'};
    }

    static getUrlParam = (url, parameter, defaultvalue) => {
        let urlparameter = defaultvalue;
        if (url.indexOf(parameter) > -1) {
            urlparameter = getUrlVars(url)[parameter];
        }
        return urlparameter;
    }

    static bytesToSize = bytes => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    static monthYearFormat = date => moment(date).format('MMM YYYY')
    static dayMonthYearFormat = date => moment(date).format('DD MMM YYYY')
    static getIp = async () => {
        const ipResponse = await axios.get(`https://api.ipify.org/?format=json`);
        const ip = ipResponse && ipResponse.data && ipResponse.data.ip || '';
        return ip;
    }
}