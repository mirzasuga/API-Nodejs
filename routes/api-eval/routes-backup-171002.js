var md5 = require('md5');

module.exports = function(api,passport,config,db,logger){

    api.post("/test-login-2", function(req, res) {
        if(req.body && req.body.email && req.body.password){
            var email = req.body.email;
            var password = req.body.password;

            db.driver.getFromEmail({email:email},function(rows){
                if(rows[0] !== undefined){
                    res.send(rows[0]);
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

    api.post("/test-coordinate",function(req, res) {

        var insert_fields = req.body;
        insert_fields.server_timestamp = Math.floor(Date.now() / 1000);
        //:latitude, :longitude, :device_timestamp, :campaign_id, :driver_id, :server_timestamp, :app_version, :vehicle_id
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
                    logger.verbose("success insert coordinate: ");
                });
            }else{
                res.send("1");
                logger.warn('test-coordinate missing required: vehicle_id or driver_id '+JSON.stringify(req.body));
            }
        }else{
            res.send("1");
            logger.warn("test-coordinate missing required: "+config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)+' '+JSON.stringify(req.body));
        }
    });

    api.post("/test-insert-evaluation",function(req, res) {

        var insert_fields = req.body;
        insert_fields.created_on = Math.floor(Date.now() / 1000);
        //:campaign_id, :driver_id, :status,:km_odometer,:odometer,:back_window,:front_car,:left_car,:right_car,:start_date,:end_date,:created_on
        var RequiredKeys = [
            'odometer',
            'km_odometer',
            'back_window',
            'front_car',
            'left_car',
            'right_car',
            'start_date',
            'end_date'
        ];
        var RequiredOnceKeys = ['driver_id','campaign_id'];

        if(!config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)){
            if(!config.helper.validateObjectKeysRequiredOnce(insert_fields,RequiredOnceKeys)){

                var defaults = {
                    driver_id: 0,
                    campaign_id: 0,
                    status :0
                };
                insert_fields = config.helper.setDefaults(insert_fields,defaults);

                //insert database
                db.driver.insertEvaluation(insert_fields,function(result){
                    res.send("0");
                    logger.verbose("success insert evaluation: ");
                });
            }else{
                res.send("1");
                logger.warn('test-coordinate missing required: campaign_id or driver_id '+JSON.stringify(req.body));
            }
        }else{
            res.send("1");
            logger.warn("test-coordinate missing required: "+config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)+' '+JSON.stringify(req.body));
        }
    });

    api.post("/test-update-evaluation",function(req, res) {

        var insert_fields = req.body;
        insert_fields.created_on = Math.floor(Date.now() / 1000);
        //:campaign_id, :driver_id, :status,:km_odometer,:odometer,:back_window,:front_car,:left_car,:right_car,:start_date,:end_date,:created_on
        var RequiredKeys = [
            'odometer',
            'km_odometer',
            'back_window',
            'front_car',
            'left_car',
            'right_car',
            'start_date',
            'end_date'
        ];
        var RequiredOnceKeys = ['driver_id','campaign_id'];

        if(!config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)){
            if(!config.helper.validateObjectKeysRequiredOnce(insert_fields,RequiredOnceKeys)){

                var defaults = {
                    driver_id: 0,
                    campaign_id: 0,
                    status :0
                };
                insert_fields = config.helper.setDefaults(insert_fields,defaults);

                //insert database
                db.driver.updateEvaluation(insert_fields,function(result){
                    res.send("0");
                    logger.verbose("success insert evaluation: ");
                });
            }else{
                res.send("1");
                logger.warn('test-coordinate missing required: campaign_id or driver_id '+JSON.stringify(req.body));
            }
        }else{
            res.send("1");
            logger.warn("test-coordinate missing required: "+config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)+' '+JSON.stringify(req.body));
        }
    });

    api.post("/test-error-log",function(req, res) {

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
                logger.verbose("success insert error_log");
            });
        }else{
            res.send("1");
            logger.warn("test-error-log missing required: "+config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)+' '+JSON.stringify(req.body));
        }
    });

    api.post("/test-get-home-data",function(req, res) {
        db.driver.getHomeData(req.body,function(result){
            if(result[0] !== undefined){
                var ret = result[0].distance_today+";"+result[0].distance_week+";"+result[0].distance_month+";"+result[0].duration;
                res.send(ret);
                logger.verbose("success get home data");
            }else{
                res.send("1");
                logger.warn("test-get-home-data undefined: "+JSON.stringify(req.body));
            }
        });
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

    api.post("/test-get-temp-campaign",function(req, res) {
        db.driver.getTempCampaignDetail(req.body,function(result){
            if(result[0] !== undefined){
                res.send(result[0]);
                logger.verbose("success temp campaign");
            }else{
                res.send("1");
                logger.warn("test-get-temp-campaign undefined: "+JSON.stringify(req.body));
            }
        });
    });

    api.post("/test-get-evaluation", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id',
            'campaign_id'
        ];
        logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.evaluation.getEvaluation(req.body, function (result) {
                res.json(result[0]);
            });
        } else {
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-contract", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id',
            'campaign_id'
        ];
        logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.getContract(req.body, function (result) {
                res.json(result[0]);
            });
        } else {
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-update-profile", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id',
            'name',
            'email',
            'mobile_number',
            'account_number',
            'reg_number',
            'img_stnk',
            'img_vehicle',
            'img_sim',
            'img_tabungan'
        ];
        logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.callSpUpdateProfile(req.body, function (result) {
                res.json(result[0][0]);
            });
        } else {
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-permit-data", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id',
            'campaign_id'
        ];
        logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.callSpGetPermitData(req.body, function (result) {
                res.json(result[0][0]);
            });
        } else {
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-driver-profile", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id'
        ];
        logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.callSpGetDriverProfile(req.body, function (result) {
                res.json(result[0][0]);
            });
        } else {
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

};
