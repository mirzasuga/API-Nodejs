var md5 = require('md5');

module.exports = function(api,passport,config,db,logger){

//from-main.js
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
                res.status(401).send("api login failed");
                logger.warn('api login failed: '+email);
            }
        });
    }else{
        logger.warn('test-login missing email and password '+JSON.stringify(req.body));
        res.status(401).send("test-login missing email and password");
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
            res.send("test-coordinate missing required");
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
                        res.send("test-get-home-data undefined");
                        logger.info("test-get-home-data undefined: "+JSON.stringify(req.body));
                    }
                });
            }else{
                res.send("test-coordinate missing required");
                logger.warn("test-coordinate missing required: "+config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)+' '+JSON.stringify(req.body)+' url:('+req.url+")");
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
            res.send("test-get-campaign-detail undefined");
            logger.warn("test-get-campaign-detail undefined: "+JSON.stringify(req.body));
        }
    });
});
//from main.js
//from-reg

api.post("/status-active", function (req, res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id'
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.getStatusFromID(req.body, function (result) {
                res.json(result[0]);
                logger.verbose("success get driver" + res);

            });
        } else {
            res.json({error: 'status-active missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('status-active missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });



    api.post("/set-active", function (req, res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id'
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.update_active(req.body, function (result) {
                res.json(result);
                logger.verbose("success get home data target" + res);

            });
        } else {
            res.json({error: 'set-active missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('set-active missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });


    api.get("/kontrak/:campaign_id", function (req, res) {
       var campaign_id = req.params.campaign_id;
 	     var path = require("path");
        res.sendFile(path.join(__dirname + '/html/kontrak.html'));
    });


    api.post("/temp-driver-list", function (req, res) {
        var fields = req.body;
        var RequiredKeys = [
            'campaign_id'
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.tempGetByCampaign(req.body, function (result) {
                res.json(result);
                logger.verbose("success get home data target" + res);

            });
        } else {
            res.json({error: 'temp-driver-list missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('temp-driver-list missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/surat-jalan", function (req, res) {
        var fields = req.body;
	var m_names = new Array("Januari", "Februari", "Maret",
		"April","Mei", "Juni", "Juli", "Agustus", "September",
		"Oktober", "November", "Desember");
	var m_days = new Array("Minggu", "Senin", "Selasa",
		"Rabu", "Kamis", "Jumat", "Sabtu");
	var d = new Date();
	var tanggal = d.getDate()+' '+ m_names[d.getMonth()]+' '+d.getFullYear();

        var RequiredKeys = [
            'driver_id', 'campaign_id'
        ];

        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.getFromDriverId(fields, function (result) {
                        if (result[0] !== undefined) {
                    fields.driver_id = result[0].driver_id;
                    fields.campaign_id = result[0].campaign_id;
                    fields.campaign_name = result[0].campaign_name;
                    fields.start_date = result[0].start_date;
                    fields.end_date = result[0].end_date;
                    fields.first_name = result[0].first_name;
                    fields.last_name = result[0].last_name;
                    fields.email = result[0].email;
                    fields.mobile_number = result[0].mobile_number;
                    fields.city = result[0].city;
                    fields.model = result[0].brand_name !== null ? (result[0].brand_name + " " + result[0].model) : result[0].brand_name;
                    fields.color = result[0].color;
                    fields.make_year = result[0].make_year;
                    fields.reg_number = result[0].reg_number;
                    fields.wrap_date = result[0].wrap_start_date;
	var d1= (fields.start_date !== null ) ? fields.start_date : new Date();
	var mulai = d1.getDate()+' '+m_names[d1.getMonth()]+' '+d1.getFullYear();
	var d2= (fields.end_date !== null ) ? fields.end_date : new Date();
	var selesai = d2.getDate()+' '+m_names[d2.getMonth()]+' '+d2.getFullYear();
	var d3=(fields.wrap_date !== null ) ? fields.wrap_date : new Date();
	var ttd = d3.getDate()+' '+m_names[d3.getMonth()]+' '+d3.getFullYear();
	var hari = m_days[d3.getDay()];
                } else {
                    fields.driver_id = 0;
                    fields.campaign_id = 0;
                    fields.campaign_name = 'incomplete';
                    fields.start_date = '';
                    fields.end_date = '';
                    fields.first_name = '';
                    fields.last_name = '';
                    fields.email = '';
                    fields.mobile_number = '';
                    fields.city = '';
                    fields.model = '';
                    fields.color = '';
                    fields.make_year = '';
                    fields.reg_number = '';
                    fields.wrap_date = '';
	var d1=new Date();
	var mulai = d1.getDate()+' '+m_names[d1.getMonth()]+' '+d1.getFullYear();
	var d2=new Date();
	var selesai = d2.getDate()+' '+m_names[d2.getMonth()]+' '+d2.getFullYear();
	var d3=new Date();
	var ttd = d3.getDate()+' '+m_names[d3.getMonth()]+' '+d3.getFullYear();
	var hari = m_days[d3.getDay()];
	}

	var body ='<html>'+
	 '<head>'+
	 '<meta charset="utf-8" />'+
	 '<title>'+'surat_jalan'+'</title>'+
	 '<style type="text/css">'+

	 '</style>'+

	 '</head>'+
	 '<body id="surat_jalan" lang="en-US">'+
	 '<div id="_idContainer000" class="Basic-Text-Frame">'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span style="font-size: 14pt; font-family: aril, helvetica, sans-serif;text-align:center;">'+'<strong>'+'<span class="CharOverride-1" style="color: #4f2d84;">'+'Surat Jalan'+'</span>'+'</strong>'+'</span>'+'</p>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span style="font-size: 12pt; font-family: aril, helvetica, sans-serif;text-align:center;">'+'<strong>'+'<span class="CharOverride-1">'+'No.100000108/5/SE/PT/KBS-JKT/9/2017'+'</span>'+'</strong>'+'</span>'+'</p>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+'Pada hari ini, '+ hari +', tanggal '+ttd+','+' kami yang bertanda tangan di bawah ini:'+'</span>'+'</p>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+
	 '<table>'+
	 '<tr>'+'<td>'+'I.'+'</td>'+'<td width="30%">'+'Nama'+'</td>'+'<td width="5%">'+':'+'</td>'+'<td>'+ 'Garry Limanata'+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td>'+'Jabatan '+'</td>'+'<td>'+':'+'</td>'+'<td>'+'Director'+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td style="vertical-align:top">'+'Alamat'+'</td>'+'<td style="vertical-align:top">'+':'+'</td>'+'<td style="vertical-align:top">'+'Jl. Letjen. Suprapto 400'+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td>'+'</td>'+'<td>'+''+'</td>'+'<td>'+'Cempaka Putih '+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td>'+'</td>'+'<td>'+''+'</td>'+'<td>'+'Jakarta Pusat - 10510'+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td style="vertical-align:top">'+'Telepon'+'</td>'+'<td style="vertical-align:top">'+':'+'</td>'+'<td style="vertical-align:top">'+'(021) 4269515 ext. 116'+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td style="vertical-align:top">'+'CS'+'</td>'+'<td style="vertical-align:top">'+':'+'</td>'+'<td style="vertical-align:top">'+'085810659800'+'</td>'+'</tr>'+

	 '</table>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+'Dalam hal ini bertindak berdasarkan jabatannya tersebut untuk dan atas nama PT Paragon Pratama Teknologi'+'<br />'+'selanjutnya disebut PIHAK PERTAMA.'+'</span>'+'</p>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+
	'<table>'+
	'<tr>'+'<td>'+'II.'+'</td>'+'<td width="40%">'+'Nama'+'</td>'+'<td width="5%">'+':'+'</td>'+'<td>'+fields.first_name+' '+fields.last_name+'</td>'+'</tr>'+
	'<tr>'+'<td>'+'</td>'+'<td>'+'STNK'+'</td>'+'<td>'+':'+'</td>'+'<td>'+'[STNK]'+'</td>'+'</tr>'+
	'<tr>'+'<td>'+'</td>'+'<td>'+'Kendaraan'+'</td>'+'<td>'+':'+'</td>'+'<td>'+fields.model+'</td>'+'</tr>'+
	'<tr>'+'<td>'+'</td>'+'<td>'+'No.Polisi'+'</td>'+'<td>'+':'+'</td>'+'<td>'+fields.reg_number+'</td>'+'</tr>'+
	'<tr>'+'<td>'+'</td>'+'<td>'+'Email'+'</td>'+'<td>'+':'+'</td>'+'<td>'+fields.email+'</td>'+'</tr>'+
	'</table>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+'Dalam hal ini bertindak berdasarkan jabatannya tersebut untuk dan atas nama Pribadi '+'selanjutnya disebut PIHAK KEDUA.'+'</span>'+'</p>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+'PIHAK PERTAMA memberikan surat jalan kepada PIHAK KEDUA untuk membranding mobil dengan iklan <strong>'+ fields.campaign_name+' </strong>'+' terhitung sejak tanggal '+mulai+' sampai dengan tanggal '+selesai+'.</span>'+'</p>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+'Surat jalan ini ditanda tangani pada hari  '+hari+', tanggal '+ ttd +'</span>'+'</p>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+'PIHAK PERTAMA'+'<br />'+'PT Paragon Pratama Teknologi'+'</span>'+'</p>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+' '+'</span>'+'<br/></p>'+
		'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+'Garry Limanata'+'</span>'+'</p>'+
	'</div>'+
	'</body>'+
	'</html>'
	;

	res.writeHead(200, {
	  'Content-Length': Buffer.byteLength(body),
	  'Content-Type': 'text/html'
	});
	res.write(body);
	res.end();

            });
        } else {
            res.json({error: 'surat-jalan missing field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('surat-jalan missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });


//from-reg

    api.post("/test-login-2", function(req, res) {
        if(req.body && req.body.email && req.body.password){
            var email = req.body.email;
            var password = req.body.password;

            db.driver.getFromEmail({email:email},function(rows){
                if(rows[0] !== undefined){
                    res.send(rows[0]);
                    logger.warn('api login success: '+email);
                }else{
                    res.status(401).send('api login failed: '+email);
                    logger.warn('api login failed: '+email);
                }
            });
        }else{
            logger.warn('test-login-2 missing email and password '+JSON.stringify(req.body));
            res.status(401).send("test-login-2 missing email and password ");
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
                    res.status(401).send('api login failed: '+email);
                    logger.warn('api login failed: '+email);
                }
            });
        }else{
            logger.warn('test-login missing email and password '+JSON.stringify(req.body));
            res.status(401).send('test-login missing email and password ');
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
                res.send("test-coordinate missing required");
                logger.warn('test-coordinate missing required: vehicle_id or driver_id '+JSON.stringify(req.body));
            }
        }else{
            res.send("test-coordinate missing required");
            logger.warn("test-coordinate missing required: "+config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)+' '+JSON.stringify(req.body));
        }
    });

    api.post("/test-coordinate-temp",function(req, res) {

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
                db.driver.insertCoordinateTemp(insert_fields,function(result){
                    res.send("0");
                    logger.verbose("success insert coordinate: ");
                });
            }else{
                res.send("test-coordinate missing required");
                logger.warn('test-coordinate missing required: vehicle_id or driver_id '+JSON.stringify(req.body));
            }
        }else{
            res.send("test-coordinate missing required");
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
                res.send("test-insert-evaluation missing required");
                logger.warn('test-insert-evaluation missing required: campaign_id or driver_id '+JSON.stringify(req.body));
            }
        }else{
            res.send("test-insert-evaluation missing required");
            logger.warn("test-insert-evaluation missing required: "+config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)+' '+JSON.stringify(req.body));
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
                res.send("test-update-evaluation missing required");
                logger.warn('test-update-evaluation missing required: campaign_id or driver_id '+JSON.stringify(req.body));
            }
        }else{
            res.send("test-update-evaluation missing required");
            logger.warn("test-update-evaluation missing required: "+config.helper.validateObjectKeysRequired(insert_fields,RequiredKeys)+' '+JSON.stringify(req.body));
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
            res.send("test-error-log missing required");
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
                res.send("test-get-home-data undefined");
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
                res.send("test-get-campaign-detail undefined");
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
                res.send("test-get-temp-campaign undefined");
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
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.evaluation.getEvaluation(req.body, function (result) {
                res.json(result[0]);
            });
        } else {
            res.json({error: 'test-get-evaluation missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('test-get-evaluation missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-history-evaluation", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id',
            'campaign_id'
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.evaluation.getEvaluationHistory(req.body, function (result) {
                res.json(result[0]);
            });
        } else {
            res.json({error: 'test-get-history-evaluation missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('test-get-history-evaluation missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });


    api.post("/test-get-contract", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id',
            'campaign_id'
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.getContract(req.body, function (result) {
                res.json(result[0]);
            });
        } else {
            res.json({error: 'test-get-contract missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('test-get-contract missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-update-profile", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
        	'driver_id',
		      'reg_number',
		      'img_kendaraan',
		      'img_stnk',
		      'img_sim',
		      'img_tabungan',
		      'bank_acc_number',
		      'mobile_number',
          'bank_id',
          'vehicle_type_id'
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.callSpUpdateProfile(req.body, function (result) {
                res.json(result[0][0]);
            });
        } else {
            res.json({error: 'test-update-profile missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('test-update-profile missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-permit-data", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id',
            'campaign_id'
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.callSpGetPermitData(req.body, function (result) {
                res.json(result[0][0]);
            });
        } else {
            res.json({error: 'test-get-permit-data missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('test-get-permit-data missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-driver-profile", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'driver_id'
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.callSpGetDriverProfile(req.body, function (result) {
                res.json(result[0][0]);
            });
        } else {
            res.json({error: 'test-get-driver-profile missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('test-get-driver-profile missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-bank", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.callSpGetBank(req.body, function (result) {
                res.json(result[0]);
            });
        } else {
            res.json({error: 'test-get-bank missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('test-get-bank missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-vehicle", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.callSpGetVehicle(req.body, function (result) {
                res.json(result[0]);
            });
        } else {
            res.json({error: 'test-get-vehicle missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('test-get-vehicle missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-vehicle-type", function(req,res) {
        var fields = req.body;
        var RequiredKeys = [
            'vehicle_brand_id'
        ];
        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.callSpGetVehicleType(req.body, function (result) {
                res.json(result[0]);
            });
        } else {
            res.json({error: 'test-get-vehicle-type missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('test-get-vehicle-type missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

};
