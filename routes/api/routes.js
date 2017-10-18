var md5 = require('md5');

module.exports = function(api,passport,config,db,logger){
    
    api.post("/test-login", function(req, res) {
        if(req.body && req.body.email && req.body.password){
            var email = req.body.email;
            var password = req.body.password;
            
            db.driver.getFromEmail({email:email},function(rows){
                if(rows[0] !== undefined){
                    var ret = rows[0].driver_id + ':' + rows[0].campaign_id + ':' + rows[0].gps_interval + ':' + rows[0].smallest_displacement;
                    res.send(ret);
                    logger.warn('api login success: '+email); 
                }else{
                    res.status(401).send("0");
                    logger.warn('api login failed: '+email);
                }
            });
        }else{
            logger.warn('missing email and password '+JSON.stringify(req.body));
            res.status(401).send("0");
        }
    });
    
    api.post(["/test-coordinate", "/test-error-log","/test-get-home-data"],function(req, res) {
        
        var insert_fields = JSON.parse(JSON.stringify(req.body));
        insert_fields.server_timestamp = Math.floor(Date.now() / 1000);
        
        var RequiredKeys = [
            'campaign_id',
            'latitude',
            'longitude',
            'device_timestamp',
            'app_version'
        ];
        var RequiredOnceKeys = ['driver_id','vehicle_id'];
        
        if(!config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)){
            if(!config.helper.validateObjectKeysRequiredOnce(insert_fields,RequiredOnceKeys)){
                
                var defaults = {
                    driver_id: 0,
                    vehicle_id: 0
                };
                insert_fields = config.helper.setDefaults(insert_fields,defaults);
                
                //insert database
                db.driver.insertCoordinate(insert_fields,function(result){
                    res.send("0");
                    logger.verbose("success insert coordinate (url:"+req.url+")"); 
                });
            }else{
                res.send("1");
                logger.warn('test-coordinate missing required: vehicle_id or driver_id '+JSON.stringify(req.body)+' url:('+req.url+")");
            }
        }else{
            var insert_fields = req.body;
            insert_fields.server_timestamp = Math.floor(Date.now() / 1000);

            var RequiredKeys = [
                'campaign_id',
                'driver_id',
                'network_operator',
                'phone_brand',
                'phone_model',
                'message',
                'timestamp'
            ];

            if(!config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)){

                //insert database
                db.driver.insertErrorLog(insert_fields,function(result){
                    res.send("0");
                    logger.verbose("success insert error_log (url:"+req.url+")"); 
                });
            }else{
                var RequiredKeys = [
                    'campaign_id',
                    'driver_id'
                ];
                if(!config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)){
                    db.driver.getHomeData(req.body,function(result){
                        if(result[0] !== undefined){
                            var ret = result[0].distance_today+";"+result[0].distance_week+";"+result[0].distance_month+";"+result[0].duration;
                            res.send(ret);
                            logger.verbose("success get home data"); 
                        }else{
                            res.send("1");
                            logger.info("test-get-home-data undefined: "+JSON.stringify(req.body));
                        }
                    });
                }else{
                    res.send("1");
                    logger.warn("missing required: "+config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)+' '+JSON.stringify(req.body)+' url:('+req.url+")");
                }
            }
        }
    });    
    
    api.post("/test-get-campaign-detail",function(req, res) {
        db.driver.getCampaignDetail(req.body,function(result){
            if(result[0] !== undefined){
                var ret = "description:"+result[0].description+";start date:"+result[0].start_date+";end date:"+result[0].end_date+";";
                res.send(ret);
                logger.verbose("success get home data"); 
            }else{
                res.send("1");
                logger.warn("test-get-campaign-detail undefined: "+JSON.stringify(req.body));
            }
        });
    });
    
};
