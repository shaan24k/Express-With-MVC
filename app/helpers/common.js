module.exports = {

    failure_callback: function(res, data) {

        var scode = (!data[1]) ? 500 : 200;
        var code = (!data[1]) ? 500 : data[1];
        var message = (!data[0]) ? "Internal server error. Please try again later." : data[0];

        return res.status(scode).json({ status: code, error: message });
    },

    success_callback: function(res, rdata) {
        
        return res.json({ success: 200, data : rdata[0], message : rdata[1] });
    },

    parse_json: function(jsonStr, dValue) {
        var json;
        try {
            json = JSON.parse(jsonStr);
        } catch (e) {
            json = {};
            if (dValue) json = dValue;
        }
        return json;
    },
    parse_array: function(arrayStr, dValue) {
        var array;
        try {
            array = JSON.parse(arrayStr);
        } catch (e) {
            array = [];
            if (dValue) array = dValue;
        }
        return array;
    },

    checkVar : function(davr){

        if(davr==undefined || davr==null || davr==''){

            return true;
        }else{

            return false;
        }

    }
};