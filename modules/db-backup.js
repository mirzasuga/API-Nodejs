module.exports = function(config,logger){
    
    var mysql = require('mysql');
    
    var connect = function(cb){
        var conn = mysql.createConnection(config.db); 
        conn.config.queryFormat = function (query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function (txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };
        conn.connect(function(err){
            if(!err) {
                cb(conn);
            } else {
                logger.error('error connecting database');
            }
        });
    };
    
    var statement = function(query,params,cb){
        connect(function(conn){
            conn.query(query, params, function(err, rows, fields) {
                conn.end();
                if (!err){
                    cb(rows);
                }else{
                    logger.error(err);
                }
            });
        });
    };
    
    var insertMany= function(query,values,cb){
        connect(function(conn){
            conn.query(query, [values], function(err, result) {
                conn.end();
                if (!err){
                    cb(result);
                }else{
                    logger.error(err);
                }
            });
        });
    };
    
    var functions = {
        driver:{
            getFromEmail:function(params,cb){
                var query = 'select * from vw_driver_campaign where email_id = :email';
                statement(query,params,cb);
            },
            getFromID:function(params,cb){
                var query = 'select * from user_profile where id = :id';
                statement(query,params,cb);
            },
            insertCoordinate(params,cb){
                var query = "INSERT INTO `user_coordinate` \
                (`latitude`, `longitude`, `device_timestamp`, `campaign_id`, `driver_id`, `server_timestamp`, `app_version`, `vehicle_id`)\
                VALUES (:latitude, :longitude, :device_timestamp, :campaign_id, :driver_id, :server_timestamp, :app_version, :vehicle_id);";
                statement(query,params,cb);
            },
            insertErrorLog(params,cb){
                var query = "INSERT INTO `error_log` \
                (`campaign_id`, `driver_id`, `network_operator`, `phone_brand`, `phone_model`, `message`, `timestamp`)\
                VALUES (:campaign_id, :driver_id, :network_operator, :phone_brand, :phone_model, :message, :timestamp);";
                statement(query,params,cb);
            },
            getHomeData(params,cb){
                var query = "select * from vw_driver_campaign_home where driver_id = :driver_id and campaign_id = :campaign_id;";
                statement(query,params,cb);
            },
            getCampaignDetail(params,cb){
                var query = "select * from ⁠⁠⁠vw_campaign_detail where id = :campaign_id;";
                statement(query,params,cb);
            },
            getFromLicensePlate:function(params,cb){
                var query = 'select *,up.email_id as email,ifnull(c.campaign_name,"") as campaign_name, ifnull(c.id,0) as campaign_id, up.id as driver_id \
                        from stick_earn.user_profile up \
                        inner join stick_earn.vehicle v on up.id = v.fk_user_id \
                        left join stick_earn.campaign_request cr on cr.driver_id = up.id  \
                        left join stick_earn.campaign c on c.id = cr.campaign_id\
                        where v.reg_number = :reg_number';
                statement(query,params,cb);
            },
            tempInsert:function(params,cb){
                var query = "INSERT INTO stick_earn.`api_driver_temp` VALUES (NULL, :driver_id, :reg_number, :old_campaign_name, :old_campaign_id, :campaign_id, :status, :antrian, :first_name, :last_name, :email, :mobile_number, :city, :model, :color, :make_year, :img_string);";
                statement(query,params,cb);
            },
            tempUpdate:function(params,cb){
                var query = "update stick_earn.`api_driver_temp` set first_name=:first_name, last_name=:last_name, email=:email, mobile_number=:mobile_number, city=:city, \
                    model=:model, color=:color, make_year=:make_year, img_string=:img_string, campaign_id=:campaign_id where id=:temp_driver_id";
                statement(query,params,cb);
            },
            tempSetComplete:function(params,cb){
                var query = "UPDATE stick_earn.api_driver_temp temp \
                    LEFT JOIN stick_earn.campaign c ON temp.campaign_id = c.id \
                    SET temp.old_campaign_name = ifnull(c.campaign_name,''), temp.status = 'complete' \
                    WHERE temp.id = :temp_id;";
                statement(query,params,cb);
            },
            tempGet:function(params,cb){
                var query = "select * from stick_earn.`api_driver_temp` where id = :temp_driver_id;";
                statement(query,params,cb);
            },
            tempGetByCampaign:function(params,cb){
                var query = "select * from stick_earn.`api_driver_temp` where campaign_id = :campaign_id;";
                statement(query,params,cb);
            },
            tempGetByLicense:function(params,cb){
                var query = "select * from stick_earn.`api_driver_temp` where reg_number = :reg_number;";
                statement(query,params,cb);
            },
            getCampaignRequest:function(params,cb){
                var query = "select * from stick_earn.campaign_request where driver_id=:driver_id and campaign_id = :campaign_id";
                statement(query,params,cb);
            },
            insertCampaignRequest:function(params,cb){
                var query = "INSERT INTO stick_earn.campaign_request (id, campaign_id, driver_id, status, created_date, updated_date) values (null, :campaign_id, :driver_id, 'approved', CURTIME(), CURTIME()) ";
                statement(query,params,cb);
            },
            updateCampaignRequest:function(params,cb){
                var query = "update stick_earn.campaign_request set status = 'approved', created_date = CURTIME(), updated_date  = CURTIME() where driver_id=:driver_id and campaign_id = :campaign_id";
                statement(query,params,cb);
            },
            insertVehicle:function(params,cb){
                var query = "INSERT INTO stick_earn.`vehicle` (`id`, `fk_user_id`, `reg_number`, `model`,`color`,`make_year`,`plat`) VALUES (NULL, :driver_id, :reg_number, :model, :color, :make_year, :img_string);";
                statement(query,params,cb);
            },
            updateVehicle:function(params,cb){
                var query = "update stick_earn.`vehicle` set model=:model, color=:color, make_year=:make_year, plat=:img_string where fk_user_id=:driver_id";
                statement(query,params,cb);
            },
            insert:function(params,cb){
                var query = "INSERT INTO stick_earn.`user_profile` \
                    (`id`, `first_name`, `last_name`, `email_id`, `mobile_number`, `password`, `verification_hash`, `is_email_verified`, `date_of_birth`, `access_token`, `is_qualified`, `is_active`, `image_url`, `created_date`, `updated_date`, `gender`, `miles_month`, `where_did_you_hear`, `city`, `most_driven_area`, `driver_company`, `code`, `pref_wrap_type`) \n\
                    VALUES \
                    (NULL, :first_name, :last_name, :email, :mobile_number, '5f4dcc3b5aa765d61d8327deb882cf99', NULL, '0', NULL, NULL, '0', '1', NULL, NULL, NULL, '', '', '', :city, '', '', '', '');"
                statement(query,params,cb);
            },
            update:function(params,cb){
                var query = "update stick_earn.`user_profile` set first_name=:first_name, last_name=:last_name, email_id=:email, mobile_number=:mobile_number, city=:city where id=:driver_id";
                statement(query,params,cb);
            },
            getFromEmailUP:function(params,cb){
                var query = 'select * from stick_earn.user_profile where email_id = :email';
                statement(query,params,cb);
            },
        },
        campaign:{
            getIncomplete:function(params,cb){
                var query = 'select id, campaign_name from stick_earn.campaign where status in ("pending","approved","wrapped","active")';
                statement(query,params,cb);
            },
        }
    };
    
    return functions;

};

