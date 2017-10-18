var md5 = require('md5');

module.exports = function (api, passport, config, db, logger) {

    api.post("/campaign-list", function (req, res) {
        db.campaign.getIncomplete({}, function (result) {
            res.json(result);
        });
    });

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
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
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
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });


    api.get("/kontrak", function (req, res) {
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
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/surat-jalan", function (req, res) {
        var fields = req.body;
var m_names = new Array("Januari", "Februari", "Maret", 
"April", "Mei", "Juni", "Juli", "Agustus", "September", 
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
                    fields.img_string = result[0].plat;
                    fields.wrap_date = result[0].wrap_start_date;
	var d1=fields.start_date;
	var mulai = d1.getDate()+' '+m_names[d1.getMonth()]+' '+d1.getFullYear();
	var d2=fields.end_date;
	var selesai = d2.getDate()+' '+m_names[d2.getMonth()]+' '+d2.getFullYear();
	var d3=fields.wrap_date;
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
                    fields.img_string = '';
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
'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+'Pada hari ini, '+ hari +', tanggal '+ttd+','+' Kami yang bertanda tangan dibawah ini:'+'</span>'+'</p>'+
'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+
 '<table>'+
	 '<tr>'+'<td>'+'I.'+'</td>'+'<td width="30%">'+'Nama'+'</td>'+'<td width="5%">'+':'+'</td>'+'<td>'+ 'Garry Limanata'+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td>'+'Jabatan '+'</td>'+'<td>'+':'+'</td>'+'<td>'+'Director'+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td>'+'Alamat'+'</td>'+'<td>'+':'+'</td>'+'<td>'+'Jl.Letnan Suprapto 400'+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td>'+'</td>'+'<td>'+':'+'</td>'+'<td>'+'Cempaka Putih '+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td>'+'</td>'+'<td>'+':'+'</td>'+'<td>'+'Jakarta Pusat - 10510'+'</td>'+'</tr>'+
	 '<tr>'+'<td>'+'</td>'+'<td>'+'Telepon'+'</td>'+'<td>'+':'+'</td>'+'<td>'+'(021) 4269515 ext. 116 / CS 085810659800'+'</td>'+'</tr>'+
 '</table>'+
'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+'Dalam hal ini bertindak berdasarkan jabatannya tersebut untuk dan atas nama PT Paragon Pratama Teknologi'+'<br />'+'selanjutnya disebut PIHAK PERTAMA.'+'</span>'+'</p>'+
'<p class="Basic-Paragraph ParaOverride-1" style="text-align: left;">'+'<span class="CharOverride-1" style="font-family: aril, helvetica, sans-serif;">'+
'<table>'+
	'<tr>'+'<td>'+'II.'+'</td>'+'<td width="40%">'+'Nama'+'</td>'+'<td width="5%">'+':'+'</td>'+'<td>'+fields.first_name+' '+fields.last_name+'</td>'+'</tr>'+
	'<tr>'+'<td>'+'</td>'+'<td>'+'STNK Atas Nama'+'</td>'+'<td>'+':'+'</td>'+'<td>'+'[STNK]'+'</td>'+'</tr>'+
	'<tr>'+'<td>'+'</td>'+'<td>'+'Jenis Kendaraan'+'</td>'+'<td>'+':'+'</td>'+'<td>'+fields.model+'</td>'+'</tr>'+
	'<tr>'+'<td>'+'</td>'+'<td>'+'Nomor Polisi'+'</td>'+'<td>'+':'+'</td>'+'<td>'+fields.img_string+'</td>'+'</tr>'+
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
            res.json({error: 'missing field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/get-driver", function (req, res) {
        var fields = req.body;

        var RequiredKeys = [
            'reg_number', 'antrian', 'campaign_id'
        ];

        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.tempGetByLicense(fields, function (result1) {
                if (result1[0] === undefined) {
                    db.driver.getFromLicensePlate(fields, function (result) {
                        if (result[0] !== undefined) {
                            fields.driver_id = result[0].driver_id;
                            fields.status = 'migrasi';
                            fields.old_campaign_id = result[0].campaign_id;
                            fields.old_campaign_name = result[0].campaign_name;
                            fields.first_name = result[0].first_name;
                            fields.last_name = result[0].last_name;
                            fields.email = result[0].email;
                            fields.mobile_number = result[0].mobile_number;
                            fields.city = result[0].city;
                            fields.model = result[0].brand_name !== null ? (result[0].brand_name + " " + result[0].model) : result[0].brand_name;
                            fields.color = result[0].color;
                            fields.make_year = result[0].make_year;
                            fields.img_string = result[0].plat;
                        } else {
                            fields.driver_id = 0;
                            fields.status = 'incomplete';
                            fields.old_campaign_id = 0;
                            fields.old_campaign_name = '';
                            fields.first_name = '';
                            fields.last_name = '';
                            fields.email = '';
                            fields.mobile_number = '';
                            fields.city = '';
                            fields.model = '';
                            fields.color = '';
                            fields.make_year = 0;
                            fields.img_string = '';
                        }
                        db.driver.tempInsert(fields, function (result2) {
                            fields.temp_driver_id = result2.insertId;
                            res.json(fields);
                        });
                    });
                }else{
                    fields.driver_id = result1[0].driver_id;
                    fields.status = result1[0].status;
                    fields.old_campaign_id = result1[0].old_campaign_id;
                    fields.old_campaign_name = result1[0].old_campaign_name;
                    fields.first_name = result1[0].first_name;
                    fields.last_name = result1[0].last_name;
                    fields.email = result1[0].email;
                    fields.mobile_number = result1[0].mobile_number;
                    fields.city = result1[0].city;
                    fields.model = result1[0].model;
                    fields.color = result1[0].color;
                    fields.make_year = result1[0].make_year;
                    fields.img_string = result1[0].img_string;
                    res.json(fields);
                }
            });
        } else {
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/set-driver", function (req, res) {
        var fields = req.body;

        var RequiredKeys = [
            'temp_driver_id',
        ];

        var RequiredKeys2 = [
            'first_name', 'last_name', 'email', 'mobile_number', 'city', 'model', 'color', 'make_year', 'img_string', 'campaign_id'
        ];

        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.tempGet(fields, function (result1) {
                if (result1[0] === undefined) {
                    res.json({error: 'temp driver with id not found: ' + fields.temp_driver_id});
                    logger.warn('temp driver with id not found: ' + fields.temp_driver_id);
                } else {
                    //update driver
                    if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys2)) {
                        db.driver.getFromEmailUP(req.body, function (result2) {
                            if (result2[0] !== undefined) {
                                res.json({error: 'email already exist'});
                                logger.verbose('email already exist: ' + JSON.stringify(req.body));
                            } else {
                                //update temp_driver
                                db.driver.tempUpdate(fields, function (update) {
                                    var record = fields;
                                    //insert into user_profile, vehicle, campaign_request
                                    res.json(req.body.driver_id);
                                });
                            }
                        });
                    } else {
                        res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys2)});
                        logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys2));
                    }
                }
            });
        } else {
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

    api.post("/test-get-home-data-target",function(req, res) {
        db.driver.getHomeDataTarget(req.body,function(result){
            if(result[0] !== undefined){
                var ret = "sisa KM : " + result[0].sisakm + "; Sisa Hari : " + result[0].sisahari;

                res.send(ret);
                logger.warn("success get home data target " + ret);

            }else{
                res.send("Data bulan ini belum masuk");
                logger.warn("test-get-home-data-target undefined: "+JSON.stringify(req.body));
            }
        });
    });

    api.post("/assign-driver", function (req, res) {
        var fields = req.body;

        var RequiredKeys = [
            'temp_driver_id',
        ];
        
        var setComplete = function(temp_id){
            db.driver.tempSetComplete({temp_id:temp_id}, function (result1) {
                res.json(1);
            });
        };

        if (!config.helper.validateObjectKeysRequired(fields, RequiredKeys)) {
            db.driver.tempGet(fields, function (result1) {
                if (result1[0] === undefined) {
                    res.json({error: 'temp driver with id not found: ' + fields.temp_driver_id});
                    logger.warn('temp driver with id not found: ' + fields.temp_driver_id);
                } else if (result1[0].status === 'migrasi') {
                    //old driver
                    var record = result1[0];
                    //update campaign_request
                    db.driver.getCampaignRequest(record, function (requests) {
                        if (requests[0] !== undefined) {
                            db.driver.updateCampaignRequest(record, function (requests) {
                                setComplete(fields.temp_driver_id);
                            });
                        } else {
                            db.driver.insertCampaignRequest(record, function (requests) {
                                setComplete(fields.temp_driver_id);
                            });
                        }
                    });
                } else if (result1[0].status === 'incomplete'){
                    //new driver
                    //insert into user_profile, vehicle, campaign_request
                    var record = result1[0];
                    db.driver.insert(record, function (inserted_driver) {
                        record.driver_id = inserted_driver.insertId;
                        db.driver.insertVehicle(record, function (inserted_vehicle) {
                            db.driver.insertCampaignRequest(record, function (inserted_vehicle) {
                                setComplete(fields.temp_driver_id);
                            });
                        });
                    });
                } else {
                    res.json({error: 'unknown temp driver status: ' + fields.temp_driver_id + ' '+ result1[0].status});
                    logger.warn('unknown temp driver status: ' + fields.temp_driver_id + ' '+ result1[0].status);
                }
            });
        } else {
            res.json({error: 'missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys)});
            logger.warn('missing required field: ' + config.helper.validateObjectKeysRequired(fields, RequiredKeys));
        }

    });

};
