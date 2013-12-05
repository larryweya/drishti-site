"use strict";angular.module("drishtiSiteApp",["ngCookies"]).constant("AUTH_URL","https://drishti.modilabs.org/authenticate-user").constant("REPORT_DATASET","0f07189134224f089a1a53e0aa5fb19c").config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/indicators-month/:indicator",{templateUrl:"views/indicators-month.html",controller:"IndicatorMonthCtrl"}).when("/indicators-cumulative/:indicator",{templateUrl:"views/indicators-cumulative.html",controller:"IndicatorCumulativeCtrl"}).when("/registers",{templateUrl:"views/registers.html",controller:"PrintRegisterCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$location","$window","Authentication",function(a,b,c,d){a.$on("$locationChangeStart",function(e,f){d.isAuthenticated()||null!==f.match(/\/login/)||(b.path("/login"),a.$$phase?c.location="#/login":a.$apply())}),a.$on("$locationChangeSuccess",function(){})}]),angular.module("drishtiSiteApp").value("ReportsDefinitions",{fp:{name:"Family Planning Services",services:["IUD","CONDOM","OCP","MALE_STERILIZATION","FEMALE_STERILIZATION"]},anc:{name:"ANC Services",services:["EARLY_ANC_REGISTRATIONS","ANC_REGISTRATIONS","SUB_TT","TT1","TT2","TTB","ANC4"]},"pregnancy-outcomes":{name:"Pregnancy Outcomes",services:["LIVE_BIRTH","STILL_BIRTH","EARLY_ABORTIONS","LATE_ABORTIONS","SPONTANEOUS_ABORTION","DELIVERY","INSTITUTIONAL_DELIVERY","D_HOM","D_SC","D_PHC","D_CHC","D_SDH","D_DH","D_PRI"]},pnc:{name:"PNC Services",services:["PNC3"]},mortality:{name:"Mortality",services:["ENM","NM","LNM","INFANT_MORTALITY","CHILD_MORTALITY","MMA","MMD","MMP","MM"]},"child-services":{name:"Child Services",services:["DPT3_OR_OPV3","DPT_BOOSTER_OR_OPV_BOOSTER","DPT_BOOSTER2","HEP","OPV","MEASLES","BCG","LBW","BF_POST_BIRTH","WEIGHED_AT_BIRTH","VIT_A_1","VIT_A_2"]}}).service("Authentication",["$cookieStore","BasicAuth",function(a,b){return{authenticate:function(a,c){b.setCredentials(a,c)},isAuthenticated:function(){return!!a.get("authdata")}}}]).service("BasicAuth",["Base64","$cookieStore","$http",function(a,b,c){return c.defaults.headers.common.Authorization="Basic "+b.get("authdata"),{setCredentials:function(d,e){var f=a.encode(d+":"+e);c.defaults.headers.common.Authorization="Basic "+f,b.put("authdata",f)},clearCredentials:function(){document.execCommand("ClearAuthenticationCache"),b.remove("authdata"),c.defaults.headers.common.Authorization="Basic "}}}]).service("Base64",function(){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";return{encode:function(b){var c,d,e,f,g,h="",i="",j="",k=0;do c=b.charCodeAt(k++),d=b.charCodeAt(k++),i=b.charCodeAt(k++),e=c>>2,f=(3&c)<<4|d>>4,g=(15&d)<<2|i>>6,j=63&i,isNaN(d)?g=j=64:isNaN(i)&&(j=64),h=h+a.charAt(e)+a.charAt(f)+a.charAt(g)+a.charAt(j),c=d=i="",e=f=g=j="";while(k<b.length);return h},decode:function(b){var c,d,e,f,g,h="",i="",j="",k=0,l=/[^A-Za-z0-9\+\/\=]/g;l.exec(b)&&alert("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\nExpect errors in decoding."),b=b.replace(/[^A-Za-z0-9\+\/\=]/g,"");do e=a.indexOf(b.charAt(k++)),f=a.indexOf(b.charAt(k++)),g=a.indexOf(b.charAt(k++)),j=a.indexOf(b.charAt(k++)),c=e<<2|f>>4,d=(15&f)<<4|g>>2,i=(3&g)<<6|j,h+=String.fromCharCode(c),64!=g&&(h+=String.fromCharCode(d)),64!=j&&(h+=String.fromCharCode(i)),c=d=i="",e=f=g=j="";while(k<b.length);return h}}}).service("BambooAPI",["$q","$rootScope",function(a,b){var c=function(a){b.$$phase?a():b.$apply(a)};return{queryInfo:function(b){var d=a.defer(),e=new bamboo.Dataset({id:b});return e.query_info(function(a){c(function(){d.resolve(a)})}),d.promise},querySummary:function(b,d,e){var f=a.defer(),g=new bamboo.Dataset({id:b});return g.summary(d,e,function(a){c(function(){f.resolve(a)})}),f.promise},queryCalculations:function(b){var d=a.defer(),e=new bamboo.Dataset({id:b});return e.query_calculations(function(a){c(function(){d.resolve(a)})}),d.promise},addCalculation:function(b,d,e){var f=a.defer(),g=new bamboo.Dataset({id:b});return g.add_calculation(d,e,function(a){c(function(){f.resolve(a)})}),f.promise},removeCalculation:function(a,b){var c=new bamboo.Dataset({id:a});c.remove_calculation(b)}}}]),angular.module("drishtiSiteApp").service("FPPrintRegisterService",function(){var a=function(a){var b={iudUsers:[],condomUsers:[],ocpUsers:[],maleSterilizationUsers:[],femaleSterilizationUsers:[]};return a.forEach(function(a){a.wifeAge=Math.floor((new Date-new Date(Date.parse(a.wifeDOB)))/1e3/60/60/24/365),a.husbandAge=Math.floor((new Date-new Date(Date.parse(a.husbandDOB)))/1e3/60/60/24/365),"iud"===a.fpDetails.method?b.iudUsers.push(a):"condom"===a.fpDetails.method?b.condomUsers.push(a):"ocp"===a.fpDetails.method?b.ocpUsers.push(a):"male_sterilization"===a.fpDetails.method?b.maleSterilizationUsers.push(a):"female_sterilization"===a.fpDetails.method&&b.femaleSterilizationUsers.push(a)}),b};return{fpUsers:function(b){return a(b)}}}),angular.module("drishtiSiteApp").controller("LoginCtrl",["$scope","$location","$http","$window","Authentication",function(a,b,c,d,e){a.loginUser=function(){"c"===a.username&&"1"===a.password&&(e.authenticate(a.username,a.password),b.path("#/"),a.$$phase?d.location="#/":a.$apply())}}]).controller("MainCtrl",["$scope",function(){}]).controller("IndicatorMonthCtrl",["$scope","$routeParams","ReportsDefinitions","BambooAPI","REPORT_DATASET",function(a,b,c,d,e){a.indicator=b.indicator;var f=c[a.indicator],g=d.querySummary(e,{indicator:1},"service_provider");a.services_provided=f.services,g.then(function(b){a.service_providers=Object.keys(b.service_provider),a.data=b.service_provider,a.data.totals={service_providers:{},services_provided:{},all:0},a.service_providers.forEach(function(c){var d=0,e=b.service_provider[c].indicator.summary;a.services_provided.forEach(function(a){d+=e[a]||0}),a.data.totals.service_providers[c]=d});var c=0;a.services_provided.forEach(function(d){var e=0;a.service_providers.forEach(function(a){e+=b.service_provider[a].indicator.summary[d]||0}),a.data.totals.services_provided[d]=e,c+=e}),a.data.totals.all=c})}]).controller("IndicatorCumulativeCtrl",["$scope","$routeParams","ReportsDefinitions","BambooAPI","REPORT_DATASET",function(a,b){a.indicator=b.indicator}]),angular.module("drishtiSiteApp").controller("PrintRegisterCtrl",["$scope","FPPrintRegisterService",function(a,b){var c=[{registrationDate:"2013-01-01",ecNumber:"1",wifeName:"Maanu",husbandName:"Putta",village:"Bherya",wifeDOB:"1987-09-17",husbandDOB:"1985-12-20",caste:"c_others",religion:"hindu",wifeEducationLevel:"graduate",husbandEducationLevel:"graduate",lmp:"2012-12-15",upt:"-ve",maleChildren:"0",femaleChildren:"0",fpDetails:{method:"condom",details:{refillDates:["2012-04-03","2012-05-05","","2012-07-07","2012-08-15","","","2012-11-20","","","",""],remarks:"Need to supply Condom to this couple"}}},{registrationDate:"2013-02-01",ecNumber:"12",wifeName:"Pavani",husbandName:"Pavan",village:"T Narasipura",wifeDOB:"1990-01-14",husbandDOB:"1986-08-13",caste:"c_others",religion:"hindu",wifeEducationLevel:"graduate",husbandEducationLevel:"graduate",lmp:"2013-01-27",upt:"-ve",maleChildren:"0",femaleChildren:"0",fpDetails:{method:"condom",details:{refillDates:["2012-04-19","2012-05-04","2012-06-05","2012-07-06","","2012-09-20","","2012-10-10","","","2013-02-01","2013-03-17"],remarks:"Have to meet them during village visit next week"}}},{registrationDate:"2013-02-26",ecNumber:"12",wifeName:"Ahalya",husbandName:"Pandu",village:"Bannur",wifeDOB:"1988-03-11",husbandDOB:"1985-07-11",caste:"sc",religion:"hindu",wifeEducationLevel:"illeterate",husbandEducationLevel:"puc",lmp:"2013-02-10",upt:"-ve",maleChildren:"1",femaleChildren:"0",fpDetails:{method:"condom",details:{refillDates:["2012-04-01","2012-05-06","2012-06-02","2012-07-15","2012-08-11","","2012-10-22","2012-11-01","2012-12-20","","2013-2-01","2013-02-17"]}}},{registrationDate:"2013-03-02",ecNumber:"2",wifeName:"Rani",husbandName:"Raja",village:"Keelanapura",wifeDOB:"1984-08-01",husbandDOB:"1983-01-01",caste:"sc",religion:"hindu",wifeEducationLevel:"illiterate",husbandEducationLevel:"illiterate",lmp:"",upt:"-ve",maleChildren:"0",femaleChildren:"1",fpDetails:{method:"iud",details:{iudDateOfInsertion:"2013-04-01",iudPlaceOfInsertion:"phc",iudInserterName:"bhagya",remarks:"Have to meet them during village visit next week"}}},{registrationDate:"2013-04-01",ecNumber:"245",wifeName:"baby",husbandName:"Anthony",village:"bherya",wifeDOB:"1982-06-01",husbandDOB:"1978-08-01",caste:"c_others",religion:"christian",wifeEducationLevel:"graduate",husbandEducationLevel:"post graduate",lmp:"2013-02-01",upt:"-ve",maleChildren:"1",femaleChildren:"1",fpDetails:{method:"iud",details:{iudDateOfInsertion:"2012-03-01",iudPlaceOfInsertion:"subcenter",iudInserterName:"Dr Rangachari",remarks:"Follow up in 2 months"}}},{registrationDate:"2013-04-10",ecNumber:"25",wifeName:"Fathima",husbandName:"Abdullaha",village:"bherya",wifeDOB:"1985-02-23",husbandDOB:"1977-12-28",caste:"",religion:"muslim",wifeEducationLevel:"illeterate",husbandEducationLevel:"sslc",lmp:"2013-03-18",upt:"-ve",maleChildren:"0",femaleChildren:"1",fpDetails:{method:"iud",details:{iudDateOfInsertion:"2013-02-23",iudPlaceOfInsertion:"district hospital",iudInserterName:"LHV Latha",remarks:"Follow up in 1 months"}}},{registrationDate:"2013-02-01",ecNumber:"34",wifeName:"Gayathri",husbandName:"Raju",village:"Gauribidanur",wifeDOB:"1980-01-03",husbandDOB:"1975-04-02",caste:"sc",religion:"hindu",wifeEducationLevel:"illiterate",husbandEducationLevel:"illiterate",lmp:"",upt:"-ve",maleChildren:"1",femaleChildren:"1",fpDetails:{method:"ocp",details:{refillDates:["2012-04-23","2012-05-26","2012-06-15","2012-07-10","2012-08-22","2012-09-19","2012-10-24","2012-11-05","2012-12-24","2013-01-24","2013-02-26","2013-03-17"]}}},{registrationDate:"2013-01-04",ecNumber:"233",wifeName:"Shashi",husbandName:"Anand",village:"Arishinadalli",wifeDOB:"1990-01-03",husbandDOB:"1980-04-02",caste:"brahmin",religion:"hindu",wifeEducationLevel:"graduate",husbandEducationLevel:"graduate",lmp:"2013-07-24",upt:"-ve",maleChildren:"1",femaleChildren:"0",fpDetails:{method:"ocp",details:{refillDates:["2012-04-22","2012-05-12","2012-06-14","2012-07-04","2012-08-06","2012-09-14","2012-10-04","2012-11-15","2012-12-31","2012-01-20","2012-02-16","2012-03-27"]}}},{registrationDate:"2013-02-04",ecNumber:"15",wifeName:"Rama",husbandName:"Alok",village:"Bychapura",wifeDOB:"1983-01-03",husbandDOB:"1980-04-02",caste:"st",religion:"hindu",wifeEducationLevel:"graduate",husbandEducationLevel:"illiterate",lmp:"2013-06-22",upt:"+ve",maleChildren:"1",femaleChildren:"0",fpDetails:{method:"ocp",details:{refillDates:["2012-04-22","2012-05-12","","","","","","","","","",""]}}},{registrationDate:"2013-04-02",ecNumber:"54",wifeName:"Fiza",husbandName:"Farooq",village:"Dammatmari",wifeDOB:"1982-01-01",husbandDOB:"1981-01-02",caste:"",religion:"muslim",wifeEducationLevel:"graduate",husbandEducationLevel:"graduate",lmp:"",upt:"",maleChildren:"1",femaleChildren:"1",fpDetails:{method:"male_sterilization",details:{doctorName:"krishna murthy",typeOfSterilization:"nsv",sterilizationDate:"2013-05-01",followupVisitDates:["2013-05-06","2013-05-10","2013-06-10"],remarks:""}}},{registrationDate:"2013-05-12",ecNumber:"543",wifeName:"Rangamma",husbandName:"Chandru",village:"Bychapura",wifeDOB:"1986-03-01",husbandDOB:"1984-03-04",caste:"",religion:"jain",wifeEducationLevel:"",husbandEducationLevel:"",lmp:"",upt:"",maleChildren:"1",femaleChildren:"0",fpDetails:{method:"female_sterilization",details:{doctorName:"bhyrappa",typeOfSterilization:"",sterilizationDate:"2013-06-02",followupVisitDates:["2013-06-06","2013-06-10","2013-07-10"],remarks:""}}}];a.date=new Date,a.fpUsers=b.fpUsers(c)}]);