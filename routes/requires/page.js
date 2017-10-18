module.exports = {
    render: function(req,res,page,params){
        if(!params){
            res.render(page,{ 
                csrfToken: req.csrfToken(), 
                message_danger: req.flash('danger'),
                message_warning: req.flash('warning'), 
                message_info: req.flash('info'),
                message_success: req.flash('success'),
            }); 
        }else{
            res.render(page,mergeJSON({ 
                csrfToken: req.csrfToken(), 
                message_danger: req.flash('danger'), 
                message_warning: req.flash('warning'), 
                message_info: req.flash('info'),
                message_success: req.flash('success'),
            },params
            )); 
        }
    },
    redirect: function(res,location){
        res.writeHead(302, {Location: location} ); //redirect to location
        res.end();
    }
};

function mergeJSON(source1,source2){
    var mergedJSON = Object.create(source2);
    for (var attrname in source1) {
        if(mergedJSON.hasOwnProperty(attrname)) {
            if ( source1[attrname]!==null && source1[attrname].constructor===Object ) {
                mergedJSON[attrname] = mergeJSON(source1[attrname], mergedJSON[attrname]);
            } 
        } else {
            mergedJSON[attrname] = source1[attrname];
        }
    }
    return mergedJSON;
}