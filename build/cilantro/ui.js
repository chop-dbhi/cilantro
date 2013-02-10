
/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */
define('date',[],function() {
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};
Date.getMonthNumberFromName=function(name){var n=Date.CultureInfo.monthNames,m=Date.CultureInfo.abbreviatedMonthNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.getDayNumberFromName=function(name){var n=Date.CultureInfo.dayNames,m=Date.CultureInfo.abbreviatedDayNames,o=Date.CultureInfo.shortestDayNames,s=name.toLowerCase();for(var i=0;i<n.length;i++){if(n[i].toLowerCase()==s||m[i].toLowerCase()==s){return i;}}
return-1;};Date.isLeapYear=function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0));};Date.getDaysInMonth=function(year,month){return[31,(Date.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month];};Date.getTimezoneOffset=function(s,dst){return(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];};Date.getTimezoneAbbreviation=function(offset,dst){var n=(dst||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,p;for(p in n){if(n[p]===offset){return p;}}
return null;};Date.prototype.clone=function(){return new Date(this.getTime());};Date.prototype.compareTo=function(date){if(isNaN(this)){throw new Error(this);}
if(date instanceof Date&&!isNaN(date)){return(this>date)?1:(this<date)?-1:0;}else{throw new TypeError(date);}};Date.prototype.equals=function(date){return(this.compareTo(date)===0);};Date.prototype.between=function(start,end){var t=this.getTime();return t>=start.getTime()&&t<=end.getTime();};Date.prototype.addMilliseconds=function(value){this.setMilliseconds(this.getMilliseconds()+value);return this;};Date.prototype.addSeconds=function(value){return this.addMilliseconds(value*1000);};Date.prototype.addMinutes=function(value){return this.addMilliseconds(value*60000);};Date.prototype.addHours=function(value){return this.addMilliseconds(value*3600000);};Date.prototype.addDays=function(value){return this.addMilliseconds(value*86400000);};Date.prototype.addWeeks=function(value){return this.addMilliseconds(value*604800000);};Date.prototype.addMonths=function(value){var n=this.getDate();this.setDate(1);this.setMonth(this.getMonth()+value);this.setDate(Math.min(n,this.getDaysInMonth()));return this;};Date.prototype.addYears=function(value){return this.addMonths(value*12);};Date.prototype.add=function(config){if(typeof config=="number"){this._orient=config;return this;}
var x=config;if(x.millisecond||x.milliseconds){this.addMilliseconds(x.millisecond||x.milliseconds);}
if(x.second||x.seconds){this.addSeconds(x.second||x.seconds);}
if(x.minute||x.minutes){this.addMinutes(x.minute||x.minutes);}
if(x.hour||x.hours){this.addHours(x.hour||x.hours);}
if(x.month||x.months){this.addMonths(x.month||x.months);}
if(x.year||x.years){this.addYears(x.year||x.years);}
if(x.day||x.days){this.addDays(x.day||x.days);}
return this;};Date._validate=function(value,min,max,name){if(typeof value!="number"){throw new TypeError(value+" is not a Number.");}else if(value<min||value>max){throw new RangeError(value+" is not a valid value for "+name+".");}
return true;};Date.validateMillisecond=function(n){return Date._validate(n,0,999,"milliseconds");};Date.validateSecond=function(n){return Date._validate(n,0,59,"seconds");};Date.validateMinute=function(n){return Date._validate(n,0,59,"minutes");};Date.validateHour=function(n){return Date._validate(n,0,23,"hours");};Date.validateDay=function(n,year,month){return Date._validate(n,1,Date.getDaysInMonth(year,month),"days");};Date.validateMonth=function(n){return Date._validate(n,0,11,"months");};Date.validateYear=function(n){return Date._validate(n,1,9999,"seconds");};Date.prototype.set=function(config){var x=config;if(!x.millisecond&&x.millisecond!==0){x.millisecond=-1;}
if(!x.second&&x.second!==0){x.second=-1;}
if(!x.minute&&x.minute!==0){x.minute=-1;}
if(!x.hour&&x.hour!==0){x.hour=-1;}
if(!x.day&&x.day!==0){x.day=-1;}
if(!x.month&&x.month!==0){x.month=-1;}
if(!x.year&&x.year!==0){x.year=-1;}
if(x.millisecond!=-1&&Date.validateMillisecond(x.millisecond)){this.addMilliseconds(x.millisecond-this.getMilliseconds());}
if(x.second!=-1&&Date.validateSecond(x.second)){this.addSeconds(x.second-this.getSeconds());}
if(x.minute!=-1&&Date.validateMinute(x.minute)){this.addMinutes(x.minute-this.getMinutes());}
if(x.hour!=-1&&Date.validateHour(x.hour)){this.addHours(x.hour-this.getHours());}
if(x.month!==-1&&Date.validateMonth(x.month)){this.addMonths(x.month-this.getMonth());}
if(x.year!=-1&&Date.validateYear(x.year)){this.addYears(x.year-this.getFullYear());}
if(x.day!=-1&&Date.validateDay(x.day,this.getFullYear(),this.getMonth())){this.addDays(x.day-this.getDate());}
if(x.timezone){this.setTimezone(x.timezone);}
if(x.timezoneOffset){this.setTimezoneOffset(x.timezoneOffset);}
return this;};Date.prototype.clearTime=function(){this.setHours(0);this.setMinutes(0);this.setSeconds(0);this.setMilliseconds(0);return this;};Date.prototype.isLeapYear=function(){var y=this.getFullYear();return(((y%4===0)&&(y%100!==0))||(y%400===0));};Date.prototype.isWeekday=function(){return!(this.is().sat()||this.is().sun());};Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth());};Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1});};Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()});};Date.prototype.moveToDayOfWeek=function(day,orient){var diff=(day-this.getDay()+7*(orient||+1))%7;return this.addDays((diff===0)?diff+=7*(orient||+1):diff);};Date.prototype.moveToMonth=function(month,orient){var diff=(month-this.getMonth()+12*(orient||+1))%12;return this.addMonths((diff===0)?diff+=12*(orient||+1):diff);};Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000);};Date.prototype.getWeekOfYear=function(firstDayOfWeek){var y=this.getFullYear(),m=this.getMonth(),d=this.getDate();var dow=firstDayOfWeek||Date.CultureInfo.firstDayOfWeek;var offset=7+1-new Date(y,0,1).getDay();if(offset==8){offset=1;}
var daynum=((Date.UTC(y,m,d,0,0,0)-Date.UTC(y,0,1,0,0,0))/86400000)+1;var w=Math.floor((daynum-offset+7)/7);if(w===dow){y--;var prevOffset=7+1-new Date(y,0,1).getDay();if(prevOffset==2||prevOffset==8){w=53;}else{w=52;}}
return w;};Date.prototype.isDST=function(){console.log('isDST');return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D";};Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST());};Date.prototype.setTimezoneOffset=function(s){var here=this.getTimezoneOffset(),there=Number(s)*-6/10;this.addMinutes(there-here);return this;};Date.prototype.setTimezone=function(s){return this.setTimezoneOffset(Date.getTimezoneOffset(s));};Date.prototype.getUTCOffset=function(){var n=this.getTimezoneOffset()*-10/6,r;if(n<0){r=(n-10000).toString();return r[0]+r.substr(2);}else{r=(n+10000).toString();return"+"+r.substr(1);}};Date.prototype.getDayName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()];};Date.prototype.getMonthName=function(abbrev){return abbrev?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()];};Date.prototype._toString=Date.prototype.toString;Date.prototype.toString=function(format){var self=this;var p=function p(s){return(s.toString().length==1)?"0"+s:s;};return format?format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(format){switch(format){case"hh":return p(self.getHours()<13?self.getHours():(self.getHours()-12));case"h":return self.getHours()<13?self.getHours():(self.getHours()-12);case"HH":return p(self.getHours());case"H":return self.getHours();case"mm":return p(self.getMinutes());case"m":return self.getMinutes();case"ss":return p(self.getSeconds());case"s":return self.getSeconds();case"yyyy":return self.getFullYear();case"yy":return self.getFullYear().toString().substring(2,4);case"dddd":return self.getDayName();case"ddd":return self.getDayName(true);case"dd":return p(self.getDate());case"d":return self.getDate().toString();case"MMMM":return self.getMonthName();case"MMM":return self.getMonthName(true);case"MM":return p((self.getMonth()+1));case"M":return self.getMonth()+1;case"t":return self.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);case"tt":return self.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;case"zzz":case"zz":case"z":return"";}}):this._toString();};
Date.now=function(){return new Date();};Date.today=function(){return Date.now().clearTime();};Date.prototype._orient=+1;Date.prototype.next=function(){this._orient=+1;return this;};Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;return this;};Date.prototype._is=false;Date.prototype.is=function(){this._is=true;return this;};Number.prototype._dateElement="day";Number.prototype.fromNow=function(){var c={};c[this._dateElement]=this;return Date.now().add(c);};Number.prototype.ago=function(){var c={};c[this._dateElement]=this*-1;return Date.now().add(c);};(function(){var $D=Date.prototype,$N=Number.prototype;var dx=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),mx=("january february march april may june july august september october november december").split(/\s/),px=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),de;var df=function(n){return function(){if(this._is){this._is=false;return this.getDay()==n;}
return this.moveToDayOfWeek(n,this._orient);};};for(var i=0;i<dx.length;i++){$D[dx[i]]=$D[dx[i].substring(0,3)]=df(i);}
var mf=function(n){return function(){if(this._is){this._is=false;return this.getMonth()===n;}
return this.moveToMonth(n,this._orient);};};for(var j=0;j<mx.length;j++){$D[mx[j]]=$D[mx[j].substring(0,3)]=mf(j);}
var ef=function(j){return function(){if(j.substring(j.length-1)!="s"){j+="s";}
return this["add"+j](this._orient);};};var nf=function(n){return function(){this._dateElement=n;return this;};};for(var k=0;k<px.length;k++){de=px[k].toLowerCase();$D[de]=$D[de+"s"]=ef(px[k]);$N[de]=$N[de+"s"]=nf(de);}}());Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ");};Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern);};Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern);};Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern);};Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern);};Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};
(function(){Date.Parsing={Exception:function(s){this.message="Parse error at '"+s.substring(0,10)+" ...'";}};var $P=Date.Parsing;var _=$P.Operators={rtoken:function(r){return function(s){var mx=s.match(r);if(mx){return([mx[0],s.substring(mx[0].length)]);}else{throw new $P.Exception(s);}};},token:function(s){return function(s){return _.rtoken(new RegExp("^\s*"+s+"\s*"))(s);};},stoken:function(s){return _.rtoken(new RegExp("^"+s));},until:function(p){return function(s){var qx=[],rx=null;while(s.length){try{rx=p.call(this,s);}catch(e){qx.push(rx[0]);s=rx[1];continue;}
break;}
return[qx,s];};},many:function(p){return function(s){var rx=[],r=null;while(s.length){try{r=p.call(this,s);}catch(e){return[rx,s];}
rx.push(r[0]);s=r[1];}
return[rx,s];};},optional:function(p){return function(s){var r=null;try{r=p.call(this,s);}catch(e){return[null,s];}
return[r[0],r[1]];};},not:function(p){return function(s){try{p.call(this,s);}catch(e){return[null,s];}
throw new $P.Exception(s);};},ignore:function(p){return p?function(s){var r=null;r=p.call(this,s);return[null,r[1]];}:null;},product:function(){var px=arguments[0],qx=Array.prototype.slice.call(arguments,1),rx=[];for(var i=0;i<px.length;i++){rx.push(_.each(px[i],qx));}
return rx;},cache:function(rule){var cache={},r=null;return function(s){try{r=cache[s]=(cache[s]||rule.call(this,s));}catch(e){r=cache[s]=e;}
if(r instanceof $P.Exception){throw r;}else{return r;}};},any:function(){var px=arguments;return function(s){var r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){r=null;}
if(r){return r;}}
throw new $P.Exception(s);};},each:function(){var px=arguments;return function(s){var rx=[],r=null;for(var i=0;i<px.length;i++){if(px[i]==null){continue;}
try{r=(px[i].call(this,s));}catch(e){throw new $P.Exception(s);}
rx.push(r[0]);s=r[1];}
return[rx,s];};},all:function(){var px=arguments,_=_;return _.each(_.optional(px));},sequence:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;if(px.length==1){return px[0];}
return function(s){var r=null,q=null;var rx=[];for(var i=0;i<px.length;i++){try{r=px[i].call(this,s);}catch(e){break;}
rx.push(r[0]);try{q=d.call(this,r[1]);}catch(ex){q=null;break;}
s=q[1];}
if(!r){throw new $P.Exception(s);}
if(q){throw new $P.Exception(q[1]);}
if(c){try{r=c.call(this,r[1]);}catch(ey){throw new $P.Exception(r[1]);}}
return[rx,(r?r[1]:s)];};},between:function(d1,p,d2){d2=d2||d1;var _fn=_.each(_.ignore(d1),p,_.ignore(d2));return function(s){var rx=_fn.call(this,s);return[[rx[0][0],r[0][2]],rx[1]];};},list:function(p,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return(p instanceof Array?_.each(_.product(p.slice(0,-1),_.ignore(d)),p.slice(-1),_.ignore(c)):_.each(_.many(_.each(p,_.ignore(d))),px,_.ignore(c)));},set:function(px,d,c){d=d||_.rtoken(/^\s*/);c=c||null;return function(s){var r=null,p=null,q=null,rx=null,best=[[],s],last=false;for(var i=0;i<px.length;i++){q=null;p=null;r=null;last=(px.length==1);try{r=px[i].call(this,s);}catch(e){continue;}
rx=[[r[0]],r[1]];if(r[1].length>0&&!last){try{q=d.call(this,r[1]);}catch(ex){last=true;}}else{last=true;}
if(!last&&q[1].length===0){last=true;}
if(!last){var qx=[];for(var j=0;j<px.length;j++){if(i!=j){qx.push(px[j]);}}
p=_.set(qx,d).call(this,q[1]);if(p[0].length>0){rx[0]=rx[0].concat(p[0]);rx[1]=p[1];}}
if(rx[1].length<best[1].length){best=rx;}
if(best[1].length===0){break;}}
if(best[0].length===0){return best;}
if(c){try{q=c.call(this,best[1]);}catch(ey){throw new $P.Exception(best[1]);}
best[1]=q[1];}
return best;};},forward:function(gr,fname){return function(s){return gr[fname].call(this,s);};},replace:function(rule,repl){return function(s){var r=rule.call(this,s);return[repl,r[1]];};},process:function(rule,fn){return function(s){var r=rule.call(this,s);return[fn.call(this,r[0]),r[1]];};},min:function(min,rule){return function(s){var rx=rule.call(this,s);if(rx[0].length<min){throw new $P.Exception(s);}
return rx;};}};var _generator=function(op){return function(){var args=null,rx=[];if(arguments.length>1){args=Array.prototype.slice.call(arguments);}else if(arguments[0]instanceof Array){args=arguments[0];}
if(args){for(var i=0,px=args.shift();i<px.length;i++){args.unshift(px[i]);rx.push(op.apply(null,args));args.shift();return rx;}}else{return op.apply(null,arguments);}};};var gx="optional not ignore cache".split(/\s/);for(var i=0;i<gx.length;i++){_[gx[i]]=_generator(_[gx[i]]);}
var _vector=function(op){return function(){if(arguments[0]instanceof Array){return op.apply(null,arguments[0]);}else{return op.apply(null,arguments);}};};var vx="each any all".split(/\s/);for(var j=0;j<vx.length;j++){_[vx[j]]=_vector(_[vx[j]]);}}());(function(){var flattenAndCompact=function(ax){var rx=[];for(var i=0;i<ax.length;i++){if(ax[i]instanceof Array){rx=rx.concat(flattenAndCompact(ax[i]));}else{if(ax[i]){rx.push(ax[i]);}}}
return rx;};Date.Grammar={};Date.Translator={hour:function(s){return function(){this.hour=Number(s);};},minute:function(s){return function(){this.minute=Number(s);};},second:function(s){return function(){this.second=Number(s);};},meridian:function(s){return function(){this.meridian=s.slice(0,1).toLowerCase();};},timezone:function(s){return function(){var n=s.replace(/[^\d\+\-]/g,"");if(n.length){this.timezoneOffset=Number(n);}else{this.timezone=s.toLowerCase();}};},day:function(x){var s=x[0];return function(){this.day=Number(s.match(/\d+/)[0]);};},month:function(s){return function(){this.month=((s.length==3)?Date.getMonthNumberFromName(s):(Number(s)-1));};},year:function(s){return function(){var n=Number(s);this.year=((s.length>2)?n:(n+(((n+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)));};},rday:function(s){return function(){switch(s){case"yesterday":this.days=-1;break;case"tomorrow":this.days=1;break;case"today":this.days=0;break;case"now":this.days=0;this.now=true;break;}};},finishExact:function(x){x=(x instanceof Array)?x:[x];var now=new Date();this.year=now.getFullYear();this.month=now.getMonth();this.day=1;this.hour=0;this.minute=0;this.second=0;for(var i=0;i<x.length;i++){if(x[i]){x[i].call(this);}}
this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.");}
var r=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);if(this.timezone){r.set({timezone:this.timezone});}else if(this.timezoneOffset){r.set({timezoneOffset:this.timezoneOffset});}
return r;},finish:function(x){x=(x instanceof Array)?flattenAndCompact(x):[x];if(x.length===0){return null;}
for(var i=0;i<x.length;i++){if(typeof x[i]=="function"){x[i].call(this);}}
if(this.now){return new Date();}
var today=Date.today();var method=null;var expression=!!(this.days!=null||this.orient||this.operator);if(expression){var gap,mod,orient;orient=((this.orient=="past"||this.operator=="subtract")?-1:1);if(this.weekday){this.unit="day";gap=(Date.getDayNumberFromName(this.weekday)-today.getDay());mod=7;this.days=gap?((gap+(orient*mod))%mod):(orient*mod);}
if(this.month){this.unit="month";gap=(this.month-today.getMonth());mod=12;this.months=gap?((gap+(orient*mod))%mod):(orient*mod);this.month=null;}
if(!this.unit){this.unit="day";}
if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1;}
if(this.unit=="week"){this.unit="day";this.value=this.value*7;}
this[this.unit+"s"]=this.value*orient;}
return today.add(this);}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour;}
if(this.weekday&&!this.day){this.day=(today.addDays((Date.getDayNumberFromName(this.weekday)-today.getDay()))).getDate();}
if(this.month&&!this.day){this.day=1;}
return today.set(this);}}};var _=Date.Parsing.Operators,g=Date.Grammar,t=Date.Translator,_fn;g.datePartDelimiter=_.rtoken(/^([\s\-\.\,\/\x27]+)/);g.timePartDelimiter=_.stoken(":");g.whiteSpace=_.rtoken(/^\s*/);g.generalDelimiter=_.rtoken(/^(([\s\,]|at|on)+)/);var _C={};g.ctoken=function(keys){var fn=_C[keys];if(!fn){var c=Date.CultureInfo.regexPatterns;var kx=keys.split(/\s+/),px=[];for(var i=0;i<kx.length;i++){px.push(_.replace(_.rtoken(c[kx[i]]),kx[i]));}
fn=_C[keys]=_.any.apply(null,px);}
return fn;};g.ctoken2=function(key){return _.rtoken(Date.CultureInfo.regexPatterns[key]);};g.h=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),t.hour));g.hh=_.cache(_.process(_.rtoken(/^(0[0-9]|1[0-2])/),t.hour));g.H=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),t.hour));g.HH=_.cache(_.process(_.rtoken(/^([0-1][0-9]|2[0-3])/),t.hour));g.m=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.minute));g.mm=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.minute));g.s=_.cache(_.process(_.rtoken(/^([0-5][0-9]|[0-9])/),t.second));g.ss=_.cache(_.process(_.rtoken(/^[0-5][0-9]/),t.second));g.hms=_.cache(_.sequence([g.H,g.mm,g.ss],g.timePartDelimiter));g.t=_.cache(_.process(g.ctoken2("shortMeridian"),t.meridian));g.tt=_.cache(_.process(g.ctoken2("longMeridian"),t.meridian));g.z=_.cache(_.process(_.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),t.timezone));g.zz=_.cache(_.process(_.rtoken(/^(\+|\-)\s*\d\d\d\d/),t.timezone));g.zzz=_.cache(_.process(g.ctoken2("timezone"),t.timezone));g.timeSuffix=_.each(_.ignore(g.whiteSpace),_.set([g.tt,g.zzz]));g.time=_.each(_.optional(_.ignore(_.stoken("T"))),g.hms,g.timeSuffix);g.d=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1]|\d)/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.dd=_.cache(_.process(_.each(_.rtoken(/^([0-2]\d|3[0-1])/),_.optional(g.ctoken2("ordinalSuffix"))),t.day));g.ddd=g.dddd=_.cache(_.process(g.ctoken("sun mon tue wed thu fri sat"),function(s){return function(){this.weekday=s;};}));g.M=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d|\d)/),t.month));g.MM=_.cache(_.process(_.rtoken(/^(1[0-2]|0\d)/),t.month));g.MMM=g.MMMM=_.cache(_.process(g.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),t.month));g.y=_.cache(_.process(_.rtoken(/^(\d\d?)/),t.year));g.yy=_.cache(_.process(_.rtoken(/^(\d\d)/),t.year));g.yyy=_.cache(_.process(_.rtoken(/^(\d\d?\d?\d?)/),t.year));g.yyyy=_.cache(_.process(_.rtoken(/^(\d\d\d\d)/),t.year));_fn=function(){return _.each(_.any.apply(null,arguments),_.not(g.ctoken2("timeContext")));};g.day=_fn(g.d,g.dd);g.month=_fn(g.M,g.MMM);g.year=_fn(g.yyyy,g.yy);g.orientation=_.process(g.ctoken("past future"),function(s){return function(){this.orient=s;};});g.operator=_.process(g.ctoken("add subtract"),function(s){return function(){this.operator=s;};});g.rday=_.process(g.ctoken("yesterday tomorrow today now"),t.rday);g.unit=_.process(g.ctoken("minute hour day week month year"),function(s){return function(){this.unit=s;};});g.value=_.process(_.rtoken(/^\d\d?(st|nd|rd|th)?/),function(s){return function(){this.value=s.replace(/\D/g,"");};});g.expression=_.set([g.rday,g.operator,g.value,g.unit,g.orientation,g.ddd,g.MMM]);_fn=function(){return _.set(arguments,g.datePartDelimiter);};g.mdy=_fn(g.ddd,g.month,g.day,g.year);g.ymd=_fn(g.ddd,g.year,g.month,g.day);g.dmy=_fn(g.ddd,g.day,g.month,g.year);g.date=function(s){return((g[Date.CultureInfo.dateElementOrder]||g.mdy).call(this,s));};g.format=_.process(_.many(_.any(_.process(_.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(fmt){if(g[fmt]){return g[fmt];}else{throw Date.Parsing.Exception(fmt);}}),_.process(_.rtoken(/^[^dMyhHmstz]+/),function(s){return _.ignore(_.stoken(s));}))),function(rules){return _.process(_.each.apply(null,rules),t.finishExact);});var _F={};var _get=function(f){return _F[f]=(_F[f]||g.format(f)[0]);};g.formats=function(fx){if(fx instanceof Array){var rx=[];for(var i=0;i<fx.length;i++){rx.push(_get(fx[i]));}
return _.any.apply(null,rx);}else{return _get(fx);}};g._formats=g.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);g._start=_.process(_.set([g.date,g.time,g.expression],g.generalDelimiter,g.whiteSpace),t.finish);g.start=function(s){try{var r=g._formats.call({},s);if(r[1].length===0){return r;}}catch(e){}
return g._start.call({},s);};}());Date._parse=Date.parse;Date.parse=function(s){var r=null;if(!s){return null;}
try{r=Date.Grammar.start.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};Date.getParseFunction=function(fx){var fn=Date.Grammar.formats(fx);return function(s){var r=null;try{r=fn.call({},s);}catch(e){return null;}
return((r[1].length===0)?r[0]:null);};};Date.parseExact=function(s,fx){return Date.getParseFunction(fx)(s);};
});

// Generated by CoffeeScript 1.4.0

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    return define('inputio',['jquery'], function(jQuery) {
      return root.InputIO = factory(jQuery);
    });
  } else {
    return root.InputIO = factory(root.jQuery);
  }
})(this, function(jQuery) {
  var check, checkers, coerce, coerceDate, coercers, dateJSInstalled, get, getType, isArray, isBoolean, isDate, isNaN, isNumber, isString, set;
  isArray = $.isArray;
  isNumber = function(obj) {
    return $.type(obj) === 'number';
  };
  isNaN = function(obj) {
    return isNumber(obj) && obj !== +obj;
  };
  isBoolean = function(obj) {
    return $.type(obj) === 'boolean';
  };
  isString = function(obj) {
    return $.type(obj) === 'string';
  };
  isDate = function(obj) {
    return $.type(obj) === 'date';
  };
  dateJSInstalled = Date.CultureInfo != null;
  getType = function($el) {
    return $el.attr('data-type') || $el.attr('type');
  };
  get = function(selector) {
    var $e, $el, e, multi, value, _i, _len;
    multi = false;
    $el = $(selector).not(':disabled');
    if ($el.is('input[type=checkbox]') && $el.length > 1) {
      multi = true;
    }
    if ($el.is('input[type=radio],input[type=checkbox]')) {
      $el = $el.filter(':checked');
    }
    if ($el.is('select[multiple]')) {
      multi = true;
      value = coerce($el.val(), getType($el));
    } else if (multi || $el.length > 1) {
      multi = true;
      value = [];
      for (_i = 0, _len = $el.length; _i < _len; _i++) {
        e = $el[_i];
        $e = $(e);
        value.push(coerce($e.val(), getType($e)));
      }
    } else {
      value = coerce($el.val(), getType($el));
    }
    if (!(value != null) || value === '') {
      value = multi ? [] : null;
    }
    return value;
  };
  set = function(selector, value) {
    var $el, i, multi, x, _i, _len;
    multi = false;
    $el = $(selector);
    if ($el.is('select[multiple],input[type=radio],input[type=checkbox]')) {
      multi = true;
    }
    if (!multi && $el.length > 1) {
      if (!isArray(value)) {
        value = [value];
      }
      for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
        x = value[i];
        $($el[i]).val(x);
      }
      return;
    }
    if (multi && !isArray(value)) {
      value = [value];
    } else if (!multi && isArray(value)) {
      value = value[0];
    }
    $el.val(value);
  };
  coerceDate = function(v) {
    if (!dateJSInstalled) {
      throw new Error('date.js must be installed to properly dates');
    }
    return Date.parse(v);
  };
  coercers = {
    boolean: function(v) {
      return Boolean(v);
    },
    number: function(v) {
      return parseFloat(v);
    },
    string: function(v) {
      return v.toString();
    },
    date: coerceDate,
    datetime: coerceDate,
    time: coerceDate
  };
  coerce = function(value, type) {
    var cleaned, x;
    if (!(value != null)) {
      return null;
    }
    if (isArray(value)) {
      cleaned = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          x = value[_i];
          _results.push(coerce(x, type));
        }
        return _results;
      })();
      value = cleaned.length ? cleaned : null;
    } else if (coercers[type] != null) {
      value = coercers[type](value);
    }
    if (value === '' || isNaN(value)) {
      return null;
    } else {
      return value;
    }
  };
  checkers = {
    boolean: isBoolean,
    number: isNumber,
    string: isString,
    date: isDate,
    datetime: isDate,
    time: isDate
  };
  check = function(value, type) {
    if (checkers[type] != null) {
      return checkers[type](value);
    } else {
      return true;
    }
  };
  return {
    get: get,
    set: set,
    coerce: coerce,
    coercers: coercers,
    check: check,
    checkers: checkers
  };
});

 define('plugins/backbone-marionette',['../jquery', '../underscore', '../backbone'], function($, _, Backbone) {

 // Backbone.Marionette, v1.0.0-rc6
 // Copyright (c)2013 Derick Bailey, Muted Solutions, LLC.
 // Distributed under MIT license
 // http://github.com/marionettejs/backbone.marionette


/*!
 * Includes BabySitter
 * https://github.com/marionettejs/backbone.babysitter/
 *
 * Includes Wreqr
 * https://github.com/marionettejs/backbone.wreqr/
 */


// Backbone.BabySitter, v0.0.4
// Copyright (c)2012 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
// http://github.com/marionettejs/backbone.babysitter
// Backbone.ChildViewContainer
// ---------------------------
//
// Provide a container to store, retrieve and
// shut down child views.

Backbone.ChildViewContainer = (function(Backbone, _){
  
  // Container Constructor
  // ---------------------

  var Container = function(initialViews){
    this._views = {};
    this._indexByModel = {};
    this._indexByCollection = {};
    this._indexByCustom = {};
    this._updateLength();

    this._addInitialViews(initialViews);
  };

  // Container Methods
  // -----------------

  _.extend(Container.prototype, {

    // Add a view to this container. Stores the view
    // by `cid` and makes it searchable by the model
    // and/or collection of the view. Optionally specify
    // a custom key to store an retrieve the view.
    add: function(view, customIndex){
      var viewCid = view.cid;

      // store the view
      this._views[viewCid] = view;

      // index it by model
      if (view.model){
        this._indexByModel[view.model.cid] = viewCid;
      }

      // index it by collection
      if (view.collection){
        this._indexByCollection[view.collection.cid] = viewCid;
      }

      // index by custom
      if (customIndex){
        this._indexByCustom[customIndex] = viewCid;
      }

      this._updateLength();
    },

    // Find a view by the model that was attached to
    // it. Uses the model's `cid` to find it, and
    // retrieves the view by it's `cid` from the result
    findByModel: function(model){
      var viewCid = this._indexByModel[model.cid];
      return this.findByCid(viewCid);
    },

    // Find a view by the collection that was attached to
    // it. Uses the collection's `cid` to find it, and
    // retrieves the view by it's `cid` from the result
    findByCollection: function(col){
      var viewCid = this._indexByCollection[col.cid];
      return this.findByCid(viewCid);
    },

    // Find a view by a custom indexer.
    findByCustom: function(index){
      var viewCid = this._indexByCustom[index];
      return this.findByCid(viewCid);
    },

    // Find by index. This is not guaranteed to be a
    // stable index.
    findByIndex: function(index){
      return _.values(this._views)[index];
    },

    // retrieve a view by it's `cid` directly
    findByCid: function(cid){
      return this._views[cid];
    },

    // Remove a view
    remove: function(view){
      var viewCid = view.cid;

      // delete model index
      if (view.model){
        delete this._indexByModel[view.model.cid];
      }

      // delete collection index
      if (view.collection){
        delete this._indexByCollection[view.collection.cid];
      }

      // delete custom index
      var cust;

      for (var key in this._indexByCustom){
        if (this._indexByCustom.hasOwnProperty(key)){
          if (this._indexByCustom[key] === viewCid){
            cust = key;
            break;
          }
        }
      }

      if (cust){
        delete this._indexByCustom[cust];
      }

      // remove the view from the container
      delete this._views[viewCid];

      // update the length
      this._updateLength();
    },

    // Call a method on every view in the container,
    // passing parameters to the call method one at a
    // time, like `function.call`.
    call: function(method, args){
      args = Array.prototype.slice.call(arguments, 1);
      this.apply(method, args);
    },

    // Apply a method on every view in the container,
    // passing parameters to the call method one at a
    // time, like `function.apply`.
    apply: function(method, args){
      var view;

      // fix for IE < 9
      args = args || [];

      _.each(this._views, function(view, key){
        if (_.isFunction(view[method])){
          view[method].apply(view, args);
        }
      });

    },

    // Update the `.length` attribute on this container
    _updateLength: function(){
      this.length = _.size(this._views);
    },

    // set up an initial list of views
    _addInitialViews: function(views){
      if (!views){ return; }

      var view, i,
          length = views.length;

      for (i=0; i<length; i++){
        view = views[i];
        this.add(view);
      }
    }
  });

  // Borrowing this code from Backbone.Collection:
  // http://backbonejs.org/docs/backbone.html#section-106
  //
  // Mix in methods from Underscore, for iteration, and other
  // collection related features.
  var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter', 
    'select', 'reject', 'every', 'all', 'some', 'any', 'include', 
    'contains', 'invoke', 'toArray', 'first', 'initial', 'rest', 
    'last', 'without', 'isEmpty', 'pluck'];

  _.each(methods, function(method) {
    Container.prototype[method] = function() {
      var views = _.values(this._views);
      var args = [views].concat(_.toArray(arguments));
      return _[method].apply(_, args);
    };
  });

  // return the public API
  return Container;
})(Backbone, _);

// Backbone.Wreqr, v0.1.1
// Copyright (c)2013 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
// http://github.com/marionettejs/backbone.wreqr
Backbone.Wreqr = (function(Backbone, Marionette, _){
  
  var Wreqr = {};

  // Handlers
  // --------
  // A registry of functions to call, given a name
  
  Wreqr.Handlers = (function(Backbone, _){
    
    
    // Constructor
    // -----------
  
    var Handlers = function(){
      this._handlers = {};
    };
  
    Handlers.extend = Backbone.Model.extend;
  
    // Instance Members
    // ----------------
  
    _.extend(Handlers.prototype, {
  
      // Add a handler for the given name, with an
      // optional context to run the handler within
      addHandler: function(name, handler, context){
        var config = {
          callback: handler,
          context: context
        };
  
        this._handlers[name] = config;
      },
  
      // Get the currently registered handler for
      // the specified name. Throws an exception if
      // no handler is found.
      getHandler: function(name){
        var config = this._handlers[name];
  
        if (!config){
          throw new Error("Handler not found for '" + name + "'");
        }
  
        return function(){
          var args = Array.prototype.slice.apply(arguments);
          return config.callback.apply(config.context, args);
        };
      },
  
      // Remove a handler for the specified name
      removeHandler: function(name){
        delete this._handlers[name];
      },
  
      // Remove all handlers from this registry
      removeAllHandlers: function(){
        this._handlers = {};
      }
    });
  
    return Handlers;
  })(Backbone, _);
  
  // Wreqr.Commands
  // --------------
  //
  // A simple command pattern implementation. Register a command
  // handler and execute it.
  Wreqr.Commands = (function(Wreqr){
    
  
    return Wreqr.Handlers.extend({
      execute: function(){
        var name = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
  
        this.getHandler(name).apply(this, args);
      }
    });
  
  })(Wreqr);
  
  // Wreqr.RequestResponse
  // ---------------------
  //
  // A simple request/response implementation. Register a
  // request handler, and return a response from it
  Wreqr.RequestResponse = (function(Wreqr){
    
  
    return Wreqr.Handlers.extend({
      request: function(){
        var name = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
  
        return this.getHandler(name).apply(this, args);
      }
    });
  
  })(Wreqr);
  
  // Event Aggregator
  // ----------------
  // A pub-sub object that can be used to decouple various parts
  // of an application through event-driven architecture.
  
  Wreqr.EventAggregator = (function(Backbone, _){
    
    var EA = function(){};
  
    // Copy the `extend` function used by Backbone's classes
    EA.extend = Backbone.Model.extend;
  
    // Copy the basic Backbone.Events on to the event aggregator
    _.extend(EA.prototype, Backbone.Events);
  
    return EA;
  })(Backbone, _);
  

  return Wreqr;
})(Backbone, Backbone.Marionette, _);

var Marionette = (function(Backbone, _, $){
  

  var Marionette = {};
  Backbone.Marionette = Marionette;

// Helpers
// -------

// For slicing `arguments` in functions
var slice = Array.prototype.slice;

// Marionette.extend
// -----------------

// Borrow the Backbone `extend` method so we can use it as needed
Marionette.extend = Backbone.Model.extend;

// Marionette.getOption
// --------------------

// Retrieve an object, function or other value from a target
// object or it's `options`, with `options` taking precedence.
Marionette.getOption = function(target, optionName){
  if (!target || !optionName){ return; }
  var value;

  if (target.options && (optionName in target.options) && (target.options[optionName] !== undefined)){
    value = target.options[optionName];
  } else {
    value = target[optionName];
  }

  return value;
};

// Mairionette.createObject
// ------------------------

// A wrapper / shim for `Object.create`. Uses native `Object.create`
// if available, otherwise shims it in place for Marionette to use.
Marionette.createObject = (function(){
  var createObject;
  
  // Define this once, and just replace the .prototype on it as needed,
  // to improve performance in older / less optimized JS engines
  function F() {}


  // Check for existing native / shimmed Object.create
  if (typeof Object.create === "function"){

    // found native/shim, so use it
    createObject = Object.create;

  } else {

    // An implementation of the Boodman/Crockford delegation 
    // w/ Cornford optimization, as suggested by @unscriptable
    // https://gist.github.com/3959151

    // native/shim not found, so shim it ourself
    createObject = function (o) {

      // set the prototype of the function
      // so we will get `o` as the prototype
      // of the new object instance
      F.prototype = o;

      // create a new object that inherits from
      // the `o` parameter
      var child = new F();
      
      // clean up just in case o is really large
      F.prototype = null; 

      // send it back
      return child;
    };

  }

  return createObject;
})();

// Trigger an event and a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method. 
//
// `this.triggerMethod("foo:bar") will trigger the "foo:bar" event and
// call the "onFooBar" method.
Marionette.triggerMethod = function(){
  var args = Array.prototype.slice.apply(arguments);
  var eventName = args[0];
  var segments = eventName.split(":");
  var segment, capLetter, methodName = "on";

  for (var i = 0; i < segments.length; i++){
    segment = segments[i];
    capLetter = segment.charAt(0).toUpperCase();
    methodName += capLetter + segment.slice(1);
  }

  this.trigger.apply(this, args);

  if (_.isFunction(this[methodName])){
    args.shift();
    return this[methodName].apply(this, args);
  }
};

// DOMRefresh
// ----------
//
// Monitor a view's state, and after it has been rendered and shown
// in the DOM, trigger a "dom:refresh" event every time it is
// re-rendered.

Marionette.MonitorDOMRefresh = (function(){
  // track when the view has been rendered
  function handleShow(view){
    view._isShown = true;
    triggerDOMRefresh(view);
  }

  // track when the view has been shown in the DOM,
  // using a Marionette.Region (or by other means of triggering "show")
  function handleRender(view){
    view._isRendered = true;
    triggerDOMRefresh(view);
  }

  // Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
  function triggerDOMRefresh(view){
    if (view._isShown && view._isRendered){
      if (_.isFunction(view.triggerMethod)){
        view.triggerMethod("dom:refresh");
      }
    }
  }

  // Export public API
  return function(view){
    view.listenTo(view, "show", function(){
      handleShow(view);
    });

    view.listenTo(view, "render", function(){
      handleRender(view);
    });
  };
})();


// Marionette.bindEntityEvents & unbindEntityEvents
// ---------------------------
//
// These methods are used to bind/unbind a backbone "entity" (collection/model) 
// to methods on a target object. 
//
// The first paremter, `target`, must have a `listenTo` method from the
// EventBinder object.
//
// The second parameter is the entity (Backbone.Model or Backbone.Collection)
// to bind the events from.
//
// The third parameter is a hash of { "event:name": "eventHandler" }
// configuration. Multiple handlers can be separated by a space. A
// function can be supplied instead of a string handler name. 

(function(Marionette){
  

  // Bind the event to handlers specified as a string of
  // handler names on the target object
  function bindFromStrings(target, entity, evt, methods){
    var methodNames = methods.split(/\s+/);

    _.each(methodNames,function(methodName) {

      var method = target[methodName];
      if(!method) {
        throw new Error("Method '"+ methodName +"' was configured as an event handler, but does not exist.");
      }

      target.listenTo(entity, evt, method, target);
    });
  }

  // Bind the event to a supplied callback function
  function bindToFunction(target, entity, evt, method){
      target.listenTo(entity, evt, method, target);
  }

  // Bind the event to handlers specified as a string of
  // handler names on the target object
  function unbindFromStrings(target, entity, evt, methods){
    var methodNames = methods.split(/\s+/);

    _.each(methodNames,function(methodName) {
      var method = target[method];
      target.stopListening(entity, evt, method, target);
    });
  }

  // Bind the event to a supplied callback function
  function unbindToFunction(target, entity, evt, method){
      target.stopListening(entity, evt, method, target);
  }

  
  // generic looping function
  function iterateEvents(target, entity, bindings, functionCallback, stringCallback){
    if (!entity || !bindings) { return; }

    // allow the bindings to be a function
    if (_.isFunction(bindings)){
      bindings = bindings.call(target);
    }

    // iterate the bindings and bind them
    _.each(bindings, function(methods, evt){

      // allow for a function as the handler, 
      // or a list of event names as a string
      if (_.isFunction(methods)){
        functionCallback(target, entity, evt, methods);
      } else {
        stringCallback(target, entity, evt, methods);
      }

    });
  }
 
  // Export Public API
  Marionette.bindEntityEvents = function(target, entity, bindings){
    iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
  };

  Marionette.unbindEntityEvents = function(target, entity, bindings){
    iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
  };

})(Marionette);

  
// Callbacks
// ---------

// A simple way of managing a collection of callbacks
// and executing them at a later point in time, using jQuery's
// `Deferred` object.
Marionette.Callbacks = function(){
  this._deferred = $.Deferred();
  this._callbacks = [];
};

_.extend(Marionette.Callbacks.prototype, {

  // Add a callback to be executed. Callbacks added here are
  // guaranteed to execute, even if they are added after the 
  // `run` method is called.
  add: function(callback, contextOverride){
    this._callbacks.push({cb: callback, ctx: contextOverride});

    this._deferred.done(function(context, options){
      if (contextOverride){ context = contextOverride; }
      callback.call(context, options);
    });
  },

  // Run all registered callbacks with the context specified. 
  // Additional callbacks can be added after this has been run 
  // and they will still be executed.
  run: function(options, context){
    this._deferred.resolve(context, options);
  },

  // Resets the list of callbacks to be run, allowing the same list
  // to be run multiple times - whenever the `run` method is called.
  reset: function(){
    var that = this;
    var callbacks = this._callbacks;
    this._deferred = $.Deferred();
    this._callbacks = [];
    _.each(callbacks, function(cb){
      that.add(cb.cb, cb.ctx);
    });
  }
});


// Marionette Controller
// ---------------------
//
// A multi-purpose object to use as a controller for
// modules and routers, and as a mediator for workflow
// and coordination of other objects, views, and more.
Marionette.Controller = function(options){
  this.triggerMethod = Marionette.triggerMethod;
  this.options = options || {};

  if (_.isFunction(this.initialize)){
    this.initialize(this.options);
  }
};

Marionette.Controller.extend = Marionette.extend;

// Controller Methods
// --------------

// Ensure it can trigger events with Backbone.Events
_.extend(Marionette.Controller.prototype, Backbone.Events, {
  close: function(){
    this.stopListening();
    this.triggerMethod("close");
    this.unbind();
  }
});

// Region 
// ------
//
// Manage the visual regions of your composite application. See
// http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/

Marionette.Region = function(options){
  this.options = options || {};

  this.el = Marionette.getOption(this, "el");

  if (!this.el){
    var err = new Error("An 'el' must be specified for a region.");
    err.name = "NoElError";
    throw err;
  }

  if (this.initialize){
    var args = Array.prototype.slice.apply(arguments);
    this.initialize.apply(this, args);
  }
};


// Region Type methods
// -------------------

_.extend(Marionette.Region, {

  // Build an instance of a region by passing in a configuration object
  // and a default region type to use if none is specified in the config.
  //
  // The config object should either be a string as a jQuery DOM selector,
  // a Region type directly, or an object literal that specifies both
  // a selector and regionType:
  //
  // ```js
  // {
  //   selector: "#foo",
  //   regionType: MyCustomRegion
  // }
  // ```
  //
  buildRegion: function(regionConfig, defaultRegionType){
    var regionIsString = (typeof regionConfig === "string");
    var regionSelectorIsString = (typeof regionConfig.selector === "string");
    var regionTypeIsUndefined = (typeof regionConfig.regionType === "undefined");
    var regionIsType = (typeof regionConfig === "function");

    if (!regionIsType && !regionIsString && !regionSelectorIsString) {
      throw new Error("Region must be specified as a Region type, a selector string or an object with selector property");
    }

    var selector, RegionType;
   
    // get the selector for the region
    
    if (regionIsString) {
      selector = regionConfig;
    } 

    if (regionConfig.selector) {
      selector = regionConfig.selector;
    }

    // get the type for the region
    
    if (regionIsType){
      RegionType = regionConfig;
    }

    if (!regionIsType && regionTypeIsUndefined) {
      RegionType = defaultRegionType;
    }

    if (regionConfig.regionType) {
      RegionType = regionConfig.regionType;
    }
    
    // build the region instance

    var regionManager = new RegionType({
      el: selector
    });

    return regionManager;
  }

});

// Region Instance Methods
// -----------------------

_.extend(Marionette.Region.prototype, Backbone.Events, {

  // Displays a backbone view instance inside of the region.
  // Handles calling the `render` method for you. Reads content
  // directly from the `el` attribute. Also calls an optional
  // `onShow` and `close` method on your view, just after showing
  // or just before closing the view, respectively.
  show: function(view){

    this.ensureEl();
    this.close();

    view.render();
    this.open(view);

    Marionette.triggerMethod.call(view, "show");
    Marionette.triggerMethod.call(this, "show", view);

    this.currentView = view;
  },

  ensureEl: function(){
    if (!this.$el || this.$el.length === 0){
      this.$el = this.getEl(this.el);
    }
  },

  // Override this method to change how the region finds the
  // DOM element that it manages. Return a jQuery selector object.
  getEl: function(selector){
    return $(selector);
  },

  // Override this method to change how the new view is
  // appended to the `$el` that the region is managing
  open: function(view){
    this.$el.empty().append(view.el);
  },

  // Close the current view, if there is one. If there is no
  // current view, it does nothing and returns immediately.
  close: function(){
    var view = this.currentView;
    if (!view || view.isClosed){ return; }

    if (view.close) { view.close(); }
    Marionette.triggerMethod.call(this, "close");

    delete this.currentView;
  },

  // Attach an existing view to the region. This 
  // will not call `render` or `onShow` for the new view, 
  // and will not replace the current HTML for the `el`
  // of the region.
  attachView: function(view){
    this.currentView = view;
  },

  // Reset the region by closing any existing view and
  // clearing out the cached `$el`. The next time a view
  // is shown via this region, the region will re-query the
  // DOM for the region's `el`.
  reset: function(){
    this.close();
    delete this.$el;
  }
});

// Copy the `extend` function used by Backbone's classes
Marionette.Region.extend = Marionette.extend;


// Template Cache
// --------------

// Manage templates stored in `<script>` blocks,
// caching them for faster access.
Marionette.TemplateCache = function(templateId){
  this.templateId = templateId;
};

// TemplateCache object-level methods. Manage the template
// caches from these method calls instead of creating 
// your own TemplateCache instances
_.extend(Marionette.TemplateCache, {
  templateCaches: {},

  // Get the specified template by id. Either
  // retrieves the cached version, or loads it
  // from the DOM.
  get: function(templateId){
    var that = this;
    var cachedTemplate = this.templateCaches[templateId];

    if (!cachedTemplate){
      cachedTemplate = new Marionette.TemplateCache(templateId);
      this.templateCaches[templateId] = cachedTemplate;
    }

    return cachedTemplate.load();
  },

  // Clear templates from the cache. If no arguments
  // are specified, clears all templates:
  // `clear()`
  //
  // If arguments are specified, clears each of the 
  // specified templates from the cache:
  // `clear("#t1", "#t2", "...")`
  clear: function(){
    var i;
    var args = Array.prototype.slice.apply(arguments);
    var length = args.length;

    if (length > 0){
      for(i=0; i<length; i++){
        delete this.templateCaches[args[i]];
      }
    } else {
      this.templateCaches = {};
    }
  }
});

// TemplateCache instance methods, allowing each
// template cache object to manage it's own state
// and know whether or not it has been loaded
_.extend(Marionette.TemplateCache.prototype, {

  // Internal method to load the template
  load: function(){
    var that = this;

    // Guard clause to prevent loading this template more than once
    if (this.compiledTemplate){
      return this.compiledTemplate;
    }

    // Load the template and compile it
    var template = this.loadTemplate(this.templateId);
    this.compiledTemplate = this.compileTemplate(template);

    return this.compiledTemplate;
  },

  // Load a template from the DOM, by default. Override
  // this method to provide your own template retrieval
  // For asynchronous loading with AMD/RequireJS, consider
  // using a template-loader plugin as described here: 
  // https://github.com/marionettejs/backbone.marionette/wiki/Using-marionette-with-requirejs
  loadTemplate: function(templateId){
    var template = $(templateId).html();

    if (!template || template.length === 0){
      var msg = "Could not find template: '" + templateId + "'";
      var err = new Error(msg);
      err.name = "NoTemplateError";
      throw err;
    }

    return template;
  },

  // Pre-compile the template before caching it. Override
  // this method if you do not need to pre-compile a template
  // (JST / RequireJS for example) or if you want to change
  // the template engine used (Handebars, etc).
  compileTemplate: function(rawTemplate){
    return _.template(rawTemplate);
  }
});


// Renderer
// --------

// Render a template with data by passing in the template
// selector and the data to render.
Marionette.Renderer = {

  // Render a template with data. The `template` parameter is
  // passed to the `TemplateCache` object to retrieve the
  // template function. Override this method to provide your own
  // custom rendering and template handling for all of Marionette.
  render: function(template, data){
    var templateFunc = typeof template === 'function' ? template : Marionette.TemplateCache.get(template);
    var html = templateFunc(data);
    return html;
  }
};



// Marionette.View
// ---------------

// The core view type that other Marionette views extend from.
Marionette.View = Backbone.View.extend({

  constructor: function(){
    _.bindAll(this, "render");

    var args = Array.prototype.slice.apply(arguments);
    Backbone.View.prototype.constructor.apply(this, args);

    Marionette.MonitorDOMRefresh(this);
    this.listenTo(this, "show", this.onShowCalled, this);
  },

  // import the "triggerMethod" to trigger events with corresponding
  // methods if the method exists 
  triggerMethod: Marionette.triggerMethod,

  // Get the template for this view
  // instance. You can set a `template` attribute in the view
  // definition or pass a `template: "whatever"` parameter in
  // to the constructor options.
  getTemplate: function(){
    return Marionette.getOption(this, "template");
  },

  // Mix in template helper methods. Looks for a
  // `templateHelpers` attribute, which can either be an
  // object literal, or a function that returns an object
  // literal. All methods and attributes from this object
  // are copies to the object passed in.
  mixinTemplateHelpers: function(target){
    target = target || {};
    var templateHelpers = this.templateHelpers;
    if (_.isFunction(templateHelpers)){
      templateHelpers = templateHelpers.call(this);
    }
    return _.extend(target, templateHelpers);
  },

  // Configure `triggers` to forward DOM events to view
  // events. `triggers: {"click .foo": "do:foo"}`
  configureTriggers: function(){
    if (!this.triggers) { return; }

    var that = this;
    var triggerEvents = {};

    // Allow `triggers` to be configured as a function
    var triggers = _.result(this, "triggers");

    // Configure the triggers, prevent default
    // action and stop propagation of DOM events
    _.each(triggers, function(value, key){

      // build the event handler function for the DOM event
      triggerEvents[key] = function(e){

        // stop the event in it's tracks
        if (e && e.preventDefault){ e.preventDefault(); }
        if (e && e.stopPropagation){ e.stopPropagation(); }

        // buil the args for the event
        var args = {
          view: this,
          model: this.model,
          collection: this.collection
        };

        // trigger the event
        that.triggerMethod(value, args);
      };

    });

    return triggerEvents;
  },

  // Overriding Backbone.View's delegateEvents to handle 
  // the `triggers`, `modelEvents`, and `collectionEvents` configuration
  delegateEvents: function(events){
    this._delegateDOMEvents(events);
    Marionette.bindEntityEvents(this, this.model, Marionette.getOption(this, "modelEvents"));
    Marionette.bindEntityEvents(this, this.collection, Marionette.getOption(this, "collectionEvents"));
  },

  // internal method to delegate DOM events and triggers
  _delegateDOMEvents: function(events){
    events = events || this.events;
    if (_.isFunction(events)){ events = events.call(this); }

    var combinedEvents = {};
    var triggers = this.configureTriggers();
    _.extend(combinedEvents, events, triggers);

    Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
  },

  // Overriding Backbone.View's undelegateEvents to handle unbinding
  // the `triggers`, `modelEvents`, and `collectionEvents` config
  undelegateEvents: function(){
    var args = Array.prototype.slice.call(arguments);
    Backbone.View.prototype.undelegateEvents.apply(this, args);

    Marionette.unbindEntityEvents(this, this.model, Marionette.getOption(this, "modelEvents"));
    Marionette.unbindEntityEvents(this, this.collection, Marionette.getOption(this, "collectionEvents"));
  },

  // Internal method, handles the `show` event.
  onShowCalled: function(){},

  // Default `close` implementation, for removing a view from the
  // DOM and unbinding it. Regions will call this method
  // for you. You can specify an `onClose` method in your view to
  // add custom code that is called after the view is closed.
  close: function(){
    if (this.isClosed) { return; }

    // allow the close to be stopped by returning `false`
    // from the `onBeforeClose` method
    var shouldClose = this.triggerMethod("before:close");
    if (shouldClose === false){
      return;
    }

    // mark as closed before doing the actual close, to
    // prevent infinite loops within "close" event handlers
    // that are trying to close other views
    this.isClosed = true;
    this.triggerMethod("close");

    this.remove();
  },

  // This method binds the elements specified in the "ui" hash inside the view's code with
  // the associated jQuery selectors.
  bindUIElements: function(){
    if (!this.ui) { return; }

    var that = this;

    if (!this.uiBindings) {
      // We want to store the ui hash in uiBindings, since afterwards the values in the ui hash
      // will be overridden with jQuery selectors.
      this.uiBindings = _.result(this, "ui");
    }

    // refreshing the associated selectors since they should point to the newly rendered elements.
    this.ui = {};
    _.each(_.keys(this.uiBindings), function(key) {
      var selector = that.uiBindings[key];
      that.ui[key] = that.$(selector);
    });
  }
});

// Item View
// ---------

// A single item view implementation that contains code for rendering
// with underscore.js templates, serializing the view's model or collection,
// and calling several methods on extended views, such as `onRender`.
Marionette.ItemView =  Marionette.View.extend({
  constructor: function(){
    var args = Array.prototype.slice.apply(arguments);
    Marionette.View.prototype.constructor.apply(this, args);
  },

  // Serialize the model or collection for the view. If a model is
  // found, `.toJSON()` is called. If a collection is found, `.toJSON()`
  // is also called, but is used to populate an `items` array in the
  // resulting data. If both are found, defaults to the model.
  // You can override the `serializeData` method in your own view
  // definition, to provide custom serialization for your view's data.
  serializeData: function(){
    var data = {};

    if (this.model) {
      data = this.model.toJSON();
    }
    else if (this.collection) {
      data = { items: this.collection.toJSON() };
    }

    return data;
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  render: function(){
    this.isClosed = false;

    this.triggerMethod("before:render", this);
    this.triggerMethod("item:before:render", this);

    var data = this.serializeData();
    data = this.mixinTemplateHelpers(data);

    var template = this.getTemplate();
    var html = Marionette.Renderer.render(template, data);
    this.$el.html(html);
    this.bindUIElements();

    this.triggerMethod("render", this);
    this.triggerMethod("item:rendered", this);

    return this;
  },

  // Override the default close event to add a few
  // more events that are triggered.
  close: function(){
    if (this.isClosed){ return; }

    this.triggerMethod('item:before:close');

    var args = Array.prototype.slice.apply(arguments);
    Marionette.View.prototype.close.apply(this, args);

    this.triggerMethod('item:closed');
  }
});

// Collection View
// ---------------

// A view that iterates over a Backbone.Collection
// and renders an individual ItemView for each model.
Marionette.CollectionView = Marionette.View.extend({
  // used as the prefix for item view events
  // that are forwarded through the collectionview
  itemViewEventPrefix: "itemview",

  // constructor
  constructor: function(options){
    this._initChildViewStorage();

    var args = Array.prototype.slice.apply(arguments);
    Marionette.View.prototype.constructor.apply(this, args);

    this._initialEvents();
  },

  // Configured the initial events that the collection view
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  _initialEvents: function(){
    if (this.collection){
      this.listenTo(this.collection, "add", this.addChildView, this);
      this.listenTo(this.collection, "remove", this.removeItemView, this);
      this.listenTo(this.collection, "reset", this.render, this);
    }
  },

  // Handle a child item added to the collection
  addChildView: function(item, collection, options){
    this.closeEmptyView();
    var ItemView = this.getItemView(item);
    var index = this.collection.indexOf(item);
    this.addItemView(item, ItemView, index);
  },

  // Override from `Marionette.View` to guarantee the `onShow` method
  // of child views is called.
  onShowCalled: function(){
    this.children.each(function(child){
      Marionette.triggerMethod.call(child, "show");
    });
  },

  // Internal method to trigger the before render callbacks
  // and events
  triggerBeforeRender: function(){
    this.triggerMethod("before:render", this);
    this.triggerMethod("collection:before:render", this);
  },

  // Internal method to trigger the rendered callbacks and
  // events
  triggerRendered: function(){
    this.triggerMethod("render", this);
    this.triggerMethod("collection:rendered", this);
  },

  // Render the collection of items. Override this method to
  // provide your own implementation of a render function for
  // the collection view.
  render: function(){
    this.isClosed = false;
    this.triggerBeforeRender();
    this._renderChildren();
    this.triggerRendered();
    return this;
  },

  // Internal method. Separated so that CompositeView can have
  // more control over events being triggered, around the rendering
  // process
  _renderChildren: function(){
    this.closeEmptyView();
    this.closeChildren();

    if (this.collection && this.collection.length > 0) {
      this.showCollection();
    } else {
      this.showEmptyView();
    }
  },

  // Internal method to loop through each item in the
  // collection view and show it
  showCollection: function(){
    var that = this;
    var ItemView;
    this.collection.each(function(item, index){
      ItemView = that.getItemView(item);
      that.addItemView(item, ItemView, index);
    });
  },

  // Internal method to show an empty view in place of
  // a collection of item views, when the collection is
  // empty
  showEmptyView: function(){
    var EmptyView = Marionette.getOption(this, "emptyView");

    if (EmptyView && !this._showingEmptyView){
      this._showingEmptyView = true;
      var model = new Backbone.Model();
      this.addItemView(model, EmptyView, 0);
    }
  },

  // Internal method to close an existing emptyView instance
  // if one exists. Called when a collection view has been
  // rendered empty, and then an item is added to the collection.
  closeEmptyView: function(){
    if (this._showingEmptyView){
      this.closeChildren();
      delete this._showingEmptyView;
    }
  },

  // Retrieve the itemView type, either from `this.options.itemView`
  // or from the `itemView` in the object definition. The "options"
  // takes precedence.
  getItemView: function(item){
    var itemView = Marionette.getOption(this, "itemView");

    if (!itemView){
      var err = new Error("An `itemView` must be specified");
      err.name = "NoItemViewError";
      throw err;
    }

    return itemView;
  },

  // Render the child item's view and add it to the
  // HTML for the collection view.
  addItemView: function(item, ItemView, index){
    var that = this;

    // get the itemViewOptions if any were specified
    var itemViewOptions = Marionette.getOption(this, "itemViewOptions");
    if (_.isFunction(itemViewOptions)){
      itemViewOptions = itemViewOptions.call(this, item);
    }

    // build the view 
    var view = this.buildItemView(item, ItemView, itemViewOptions);
    
    // set up the child view event forwarding
    this.addChildViewEventForwarding(view);

    // this view is about to be added
    this.triggerMethod("before:item:added", view);

    // Store the child view itself so we can properly
    // remove and/or close it later
    this.children.add(view);

    // Render it and show it
    this.renderItemView(view, index);

    // call the "show" method if the collection view
    // has already been shown
    if (this._isShown){
      Marionette.triggerMethod.call(view, "show");
    }

    // this view was added
    this.triggerMethod("after:item:added", view);
  },

  // Set up the child view event forwarding. Uses an "itemview:"
  // prefix in front of all forwarded events.
  addChildViewEventForwarding: function(view){
    var prefix = Marionette.getOption(this, "itemViewEventPrefix");

    // Forward all child item view events through the parent,
    // prepending "itemview:" to the event name
    this.listenTo(view, "all", function(){
      var args = slice.call(arguments);
      args[0] = prefix + ":" + args[0];
      args.splice(1, 0, view);

      Marionette.triggerMethod.apply(this, args);
    }, this);
  },

  // render the item view
  renderItemView: function(view, index) {
    view.render();
    this.appendHtml(this, view, index);
  },

  // Build an `itemView` for every model in the collection.
  buildItemView: function(item, ItemViewType, itemViewOptions){
    var options = _.extend({model: item}, itemViewOptions);
    var view = new ItemViewType(options);
    return view;
  },

  // get the child view by item it holds, and remove it
  removeItemView: function(item){
    var view = this.children.findByModel(item);
    this.removeChildView(view);
    this.checkEmpty();
  },

  // Remove the child view and close it
  removeChildView: function(view){

    // shut down the child view properly,
    // including events that the collection has from it
    if (view){
      this.stopListening(view);

      if (view.close){
        view.close();
      }

      this.children.remove(view);
    }

    this.triggerMethod("item:removed", view);
  },

  // helper to show the empty view if the collection is empty
  checkEmpty: function() {
    // check if we're empty now, and if we are, show the
    // empty view
    if (!this.collection || this.collection.length === 0){
      this.showEmptyView();
    }
  },

  // Append the HTML to the collection's `el`.
  // Override this method to do something other
  // then `.append`.
  appendHtml: function(collectionView, itemView, index){
    collectionView.$el.append(itemView.el);
  },

  // Internal method to set up the `children` object for
  // storing all of the child views
  _initChildViewStorage: function(){
    this.children = new Backbone.ChildViewContainer();
  },

  // Handle cleanup and other closing needs for
  // the collection of views.
  close: function(){
    if (this.isClosed){ return; }

    this.triggerMethod("collection:before:close");
    this.closeChildren();
    this.triggerMethod("collection:closed");

    var args = Array.prototype.slice.apply(arguments);
    Marionette.View.prototype.close.apply(this, args);
  },

  // Close the child views that this collection view
  // is holding on to, if any
  closeChildren: function(){
    this.children.each(function(child){
      this.removeChildView(child);
    }, this);
    this.checkEmpty();
  }
});


// Composite View
// --------------

// Used for rendering a branch-leaf, hierarchical structure.
// Extends directly from CollectionView and also renders an
// an item view as `modelView`, for the top leaf
Marionette.CompositeView = Marionette.CollectionView.extend({
  constructor: function(options){
    var args = Array.prototype.slice.apply(arguments);
    Marionette.CollectionView.apply(this, args);

    this.itemView = this.getItemView();
  },

  // Configured the initial events that the composite view
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  _initialEvents: function(){
    if (this.collection){
      this.listenTo(this.collection, "add", this.addChildView, this);
      this.listenTo(this.collection, "remove", this.removeItemView, this);
      this.listenTo(this.collection, "reset", this._renderChildren, this);
    }
  },

  // Retrieve the `itemView` to be used when rendering each of
  // the items in the collection. The default is to return
  // `this.itemView` or Marionette.CompositeView if no `itemView`
  // has been defined
  getItemView: function(item){
    var itemView = Marionette.getOption(this, "itemView") || this.constructor;

    if (!itemView){
      var err = new Error("An `itemView` must be specified");
      err.name = "NoItemViewError";
      throw err;
    }

    return itemView;
  },

  // Serialize the collection for the view. 
  // You can override the `serializeData` method in your own view
  // definition, to provide custom serialization for your view's data.
  serializeData: function(){
    var data = {};

    if (this.model){
      data = this.model.toJSON();
    }

    return data;
  },

  // Renders the model once, and the collection once. Calling
  // this again will tell the model's view to re-render itself
  // but the collection will not re-render.
  render: function(){
    this.isClosed = false;
    this.resetItemViewContainer();

    this.triggerBeforeRender();
    var html = this.renderModel();
    this.$el.html(html);
    // the ui bindings is done here and not at the end of render since they 
    // will not be available until after the model is rendered, but should be
    // available before the collection is rendered.
    this.bindUIElements();
    this.triggerMethod("composite:model:rendered");

    this._renderChildren();

    this.triggerMethod("composite:rendered");
    this.triggerRendered();
    return this;
  },

  _renderChildren: function(){
    Marionette.CollectionView.prototype._renderChildren.call(this);
    this.triggerMethod("composite:collection:rendered");
  },

  // Render the collection for the composite view
  renderCollection: function(){
    var args = Array.prototype.slice.apply(arguments);
    Marionette.CollectionView.prototype.render.apply(this, args);

  },

  // Render an individual model, if we have one, as
  // part of a composite view (branch / leaf). For example:
  // a treeview.
  renderModel: function(){
    var data = {};
    data = this.serializeData();
    data = this.mixinTemplateHelpers(data);

    var template = this.getTemplate();
    return Marionette.Renderer.render(template, data);
  },

  // Appends the `el` of itemView instances to the specified
  // `itemViewContainer` (a jQuery selector). Override this method to
  // provide custom logic of how the child item view instances have their
  // HTML appended to the composite view instance.
  appendHtml: function(cv, iv){
    var $container = this.getItemViewContainer(cv);
    $container.append(iv.el);
  },

  // Internal method to ensure an `$itemViewContainer` exists, for the
  // `appendHtml` method to use.
  getItemViewContainer: function(containerView){
    if ("$itemViewContainer" in containerView){
      return containerView.$itemViewContainer;
    }

    var container;
    if (containerView.itemViewContainer){

      var selector = _.result(containerView, "itemViewContainer");
      container = containerView.$(selector);
      if (container.length <= 0) {
        var err = new Error("The specified `itemViewContainer` was not found: " + containerView.itemViewContainer);
        err.name = "ItemViewContainerMissingError";
        throw err;
      }

    } else {
      container = containerView.$el;
    }

    containerView.$itemViewContainer = container;
    return container;
  },

  // Internal method to reset the `$itemViewContainer` on render
  resetItemViewContainer: function(){
    if (this.$itemViewContainer){
      delete this.$itemViewContainer;
    }
  }
});


// Layout
// ------

// Used for managing application layouts, nested layouts and
// multiple regions within an application or sub-application.
//
// A specialized view type that renders an area of HTML and then
// attaches `Region` instances to the specified `regions`.
// Used for composite view management and sub-application areas.
Marionette.Layout = Marionette.ItemView.extend({
  regionType: Marionette.Region,
  
  // Ensure the regions are avialable when the `initialize` method
  // is called.
  constructor: function () {
    this._firstRender = true;
    this.initializeRegions();

    var args = Array.prototype.slice.apply(arguments);
    Marionette.ItemView.apply(this, args);
  },

  // Layout's render will use the existing region objects the
  // first time it is called. Subsequent calls will close the
  // views that the regions are showing and then reset the `el`
  // for the regions to the newly rendered DOM elements.
  render: function(){

    if (this._firstRender){
      // if this is the first render, don't do anything to
      // reset the regions
      this._firstRender = false;
    } else {
      // If this is not the first render call, then we need to 
      // re-initializing the `el` for each region
      this.closeRegions();
      this.reInitializeRegions();
    }

    var args = Array.prototype.slice.apply(arguments);
    var result = Marionette.ItemView.prototype.render.apply(this, args);

    return result;
  },

  // Handle closing regions, and then close the view itself.
  close: function () {
    if (this.isClosed){ return; }

    this.closeRegions();
    this.destroyRegions();

    var args = Array.prototype.slice.apply(arguments);
    Marionette.ItemView.prototype.close.apply(this, args);
  },

  // Initialize the regions that have been defined in a
  // `regions` attribute on this layout. The key of the
  // hash becomes an attribute on the layout object directly.
  // For example: `regions: { menu: ".menu-container" }`
  // will product a `layout.menu` object which is a region
  // that controls the `.menu-container` DOM element.
  initializeRegions: function () {
    if (!this.regionManagers){
      this.regionManagers = {};
    }

    var that = this;
    var regions = this.regions || {};
    _.each(regions, function (region, name) {

      var regionManager = Marionette.Region.buildRegion(region, that.regionType);
      regionManager.getEl = function(selector){
        return that.$(selector);
      };

      that.regionManagers[name] = regionManager;
      that[name] = regionManager;
    });

  },

  // Re-initialize all of the regions by updating the `el` that
  // they point to
  reInitializeRegions: function(){
    if (this.regionManagers && _.size(this.regionManagers)===0){
      this.initializeRegions();
    } else {
      _.each(this.regionManagers, function(region){
        region.reset();
      });
    }
  },

  // Close all of the regions that have been opened by
  // this layout. This method is called when the layout
  // itself is closed.
  closeRegions: function () {
    var that = this;
    _.each(this.regionManagers, function (manager, name) {
      manager.close();
    });
  },

  // Destroys all of the regions by removing references
  // from the Layout
  destroyRegions: function(){
    var that = this;
    _.each(this.regionManagers, function (manager, name) {
      delete that[name];
    });
    this.regionManagers = {};
  }
});



// AppRouter
// ---------

// Reduce the boilerplate code of handling route events
// and then calling a single method on another object.
// Have your routers configured to call the method on
// your object, directly.
//
// Configure an AppRouter with `appRoutes`.
//
// App routers can only take one `controller` object. 
// It is recommended that you divide your controller
// objects in to smaller peices of related functionality
// and have multiple routers / controllers, instead of
// just one giant router and controller.
//
// You can also add standard routes to an AppRouter.

Marionette.AppRouter = Backbone.Router.extend({

  constructor: function(options){
    var args = Array.prototype.slice.apply(arguments);
    Backbone.Router.prototype.constructor.apply(this, args);

    this.options = options;

    if (this.appRoutes){
      var controller = Marionette.getOption(this, "controller");
      this.processAppRoutes(controller, this.appRoutes);
    }
  },

  // Internal method to process the `appRoutes` for the
  // router, and turn them in to routes that trigger the
  // specified method on the specified `controller`.
  processAppRoutes: function(controller, appRoutes){
    var method, methodName;
    var route, routesLength, i;
    var routes = [];
    var router = this;

    for(route in appRoutes){
      if (appRoutes.hasOwnProperty(route)){
        routes.unshift([route, appRoutes[route]]);
      }
    }

    routesLength = routes.length;
    for (i = 0; i < routesLength; i++){
      route = routes[i][0];
      methodName = routes[i][1];
      method = controller[methodName];

      if (!method){
        var msg = "Method '" + methodName + "' was not found on the controller";
        var err = new Error(msg);
        err.name = "NoMethodError";
        throw err;
      }

      method = _.bind(method, controller);
      router.route(route, methodName, method);
    }
  }
});


// Application
// -----------

// Contain and manage the composite application as a whole.
// Stores and starts up `Region` objects, includes an
// event aggregator as `app.vent`
Marionette.Application = function(options){
  this.initCallbacks = new Marionette.Callbacks();
  this.vent = new Backbone.Wreqr.EventAggregator();
  this.commands = new Backbone.Wreqr.Commands();
  this.reqres = new Backbone.Wreqr.RequestResponse();
  this.submodules = {};

  _.extend(this, options);

  this.triggerMethod = Marionette.triggerMethod;
};

_.extend(Marionette.Application.prototype, Backbone.Events, {
  // Command execution, facilitated by Backbone.Wreqr.Commands
  execute: function(){
    var args = Array.prototype.slice.apply(arguments);
    this.commands.execute.apply(this.commands, args);
  },

  // Request/response, facilitated by Backbone.Wreqr.RequestResponse
  request: function(){
    var args = Array.prototype.slice.apply(arguments);
    return this.reqres.request.apply(this.reqres, args);
  },

  // Add an initializer that is either run at when the `start`
  // method is called, or run immediately if added after `start`
  // has already been called.
  addInitializer: function(initializer){
    this.initCallbacks.add(initializer);
  },

  // kick off all of the application's processes.
  // initializes all of the regions that have been added
  // to the app, and runs all of the initializer functions
  start: function(options){
    this.triggerMethod("initialize:before", options);
    this.initCallbacks.run(options, this);
    this.triggerMethod("initialize:after", options);

    this.triggerMethod("start", options);
  },

  // Add regions to your app. 
  // Accepts a hash of named strings or Region objects
  // addRegions({something: "#someRegion"})
  // addRegions{{something: Region.extend({el: "#someRegion"}) });
  addRegions: function(regions){
    var that = this;
    _.each(regions, function (region, name) {
      var regionManager = Marionette.Region.buildRegion(region, Marionette.Region);
      that[name] = regionManager;
    });
  },

  // Removes a region from your app.
  // Accepts the regions name
  // removeRegion('myRegion')
  removeRegion: function(region) {
    this[region].close();
    delete this[region];
  },

  // Create a module, attached to the application
  module: function(moduleNames, moduleDefinition){
    // slice the args, and add this application object as the
    // first argument of the array
    var args = slice.call(arguments);
    args.unshift(this);

    // see the Marionette.Module object for more information
    return Marionette.Module.create.apply(Marionette.Module, args);
  }
});

// Copy the `extend` function used by Backbone's classes
Marionette.Application.extend = Marionette.extend;

// Module
// ------

// A simple module system, used to create privacy and encapsulation in
// Marionette applications
Marionette.Module = function(moduleName, app){
  this.moduleName = moduleName;

  // store sub-modules
  this.submodules = {};

  this._setupInitializersAndFinalizers();

  // store the configuration for this module
  this.app = app;
  this.startWithParent = true;

  this.triggerMethod = Marionette.triggerMethod;
};

// Extend the Module prototype with events / listenTo, so that the module
// can be used as an event aggregator or pub/sub.
_.extend(Marionette.Module.prototype, Backbone.Events, {

  // Initializer for a specific module. Initializers are run when the
  // module's `start` method is called.
  addInitializer: function(callback){
    this._initializerCallbacks.add(callback);
  },

  // Finalizers are run when a module is stopped. They are used to teardown
  // and finalize any variables, references, events and other code that the
  // module had set up.
  addFinalizer: function(callback){
    this._finalizerCallbacks.add(callback);
  },

  // Start the module, and run all of it's initializers
  start: function(options){
    // Prevent re-starting a module that is already started
    if (this._isInitialized){ return; }

    // start the sub-modules (depth-first hierarchy)
    _.each(this.submodules, function(mod){
      // check to see if we should start the sub-module with this parent
      var startWithParent = true;
      startWithParent = mod.startWithParent;

      // start the sub-module
      if (startWithParent){
        mod.start(options);
      }
    });

    // run the callbacks to "start" the current module
    this.triggerMethod("before:start", options);

    this._initializerCallbacks.run(options, this);
    this._isInitialized = true;

    this.triggerMethod("start", options);
  },

  // Stop this module by running its finalizers and then stop all of
  // the sub-modules for this module
  stop: function(){
    // if we are not initialized, don't bother finalizing
    if (!this._isInitialized){ return; }
    this._isInitialized = false;

    Marionette.triggerMethod.call(this, "before:stop");

    // stop the sub-modules; depth-first, to make sure the
    // sub-modules are stopped / finalized before parents
    _.each(this.submodules, function(mod){ mod.stop(); });

    // run the finalizers
    this._finalizerCallbacks.run(undefined,this);

    // reset the initializers and finalizers
    this._initializerCallbacks.reset();
    this._finalizerCallbacks.reset();

    Marionette.triggerMethod.call(this, "stop");
  },

  // Configure the module with a definition function and any custom args
  // that are to be passed in to the definition function
  addDefinition: function(moduleDefinition, customArgs){
    this._runModuleDefinition(moduleDefinition, customArgs);
  },

  // Internal method: run the module definition function with the correct
  // arguments
  _runModuleDefinition: function(definition, customArgs){
    if (!definition){ return; }

    // build the correct list of arguments for the module definition
    var args = _.flatten([
      this,
      this.app,
      Backbone,
      Marionette,
      $, _,
      customArgs
    ]);

    definition.apply(this, args);
  },

  // Internal method: set up new copies of initializers and finalizers.
  // Calling this method will wipe out all existing initializers and
  // finalizers.
  _setupInitializersAndFinalizers: function(){
    this._initializerCallbacks = new Marionette.Callbacks();
    this._finalizerCallbacks = new Marionette.Callbacks();
  }
});

// Type methods to create modules
_.extend(Marionette.Module, {

  // Create a module, hanging off the app parameter as the parent object.
  create: function(app, moduleNames, moduleDefinition){
    var that = this;
    var module = app;

    // get the custom args passed in after the module definition and
    // get rid of the module name and definition function
    var customArgs = slice.apply(arguments);
    customArgs.splice(0, 3);

    // split the module names and get the length
    moduleNames = moduleNames.split(".");
    var length = moduleNames.length;

    // store the module definition for the last module in the chain
    var moduleDefinitions = [];
    moduleDefinitions[length-1] = moduleDefinition;

    // Loop through all the parts of the module definition
    _.each(moduleNames, function(moduleName, i){
      var parentModule = module;
      module = that._getModule(parentModule, moduleName, app);
      that._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
    });

    // Return the last module in the definition chain
    return module;
  },

  _getModule: function(parentModule, moduleName, app, def, args){
    // Get an existing module of this name if we have one
    var module = parentModule[moduleName];

    if (!module){
      // Create a new module if we don't have one
      module = new Marionette.Module(moduleName, app);
      parentModule[moduleName] = module;
      // store the module on the parent
      parentModule.submodules[moduleName] = module;
    }

    return module;
  },

  _addModuleDefinition: function(parentModule, module, def, args){
    var fn; 
    var startWithParent;

    if (_.isFunction(def)){
      // if a function is supplied for the module definition
      fn = def;
      startWithParent = true;

    } else if (_.isObject(def)){
      // if an object is supplied
      fn = def.define;
      startWithParent = def.startWithParent;
      
    } else {
      // if nothing is supplied
      startWithParent = true;
    }

    // add module definition if needed
    if (fn){
      module.addDefinition(fn, args);
    }

    // `and` the two together, ensuring a single `false` will prevent it
    // from starting with the parent
    var tmp = module.startWithParent;
    module.startWithParent = module.startWithParent && startWithParent;

    // setup auto-start if needed
    if (module.startWithParent && !module.startWithParentIsConfigured){

      // only configure this once
      module.startWithParentIsConfigured = true;

      // add the module initializer config
      parentModule.addInitializer(function(options){
        if (module.startWithParent){
          module.start(options);
        }
      });

    }

  }
});



  return Marionette;
})(Backbone, _, $ || window.jQuery || window.Zepto || window.ender);
return Marionette;
});

// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS

/**
 * @license Highcharts JS v2.3.3 (2012-10-04)
 *
 * (c) 2009-2011 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */

// JSLint options:
/*global Highcharts, document, window, navigator, setInterval, clearInterval, clearTimeout, setTimeout, location, jQuery, $, console */

define('highcharts',[],function () {
// encapsulated variables
var UNDEFINED,
	doc = document,
	win = window,
	math = Math,
	mathRound = math.round,
	mathFloor = math.floor,
	mathCeil = math.ceil,
	mathMax = math.max,
	mathMin = math.min,
	mathAbs = math.abs,
	mathCos = math.cos,
	mathSin = math.sin,
	mathPI = math.PI,
	deg2rad = mathPI * 2 / 360,


	// some variables
	userAgent = navigator.userAgent,
	isOpera = win.opera,
	isIE = /msie/i.test(userAgent) && !isOpera,
	docMode8 = doc.documentMode === 8,
	isWebKit = /AppleWebKit/.test(userAgent),
	isFirefox = /Firefox/.test(userAgent),
	SVG_NS = 'http://www.w3.org/2000/svg',
	hasSVG = !!doc.createElementNS && !!doc.createElementNS(SVG_NS, 'svg').createSVGRect,
	hasBidiBug = isFirefox && parseInt(userAgent.split('Firefox/')[1], 10) < 4, // issue #38
	useCanVG = !hasSVG && !isIE && !!doc.createElement('canvas').getContext,
	Renderer,
	hasTouch = doc.documentElement.ontouchstart !== UNDEFINED,
	symbolSizes = {},
	idCounter = 0,
	garbageBin,
	defaultOptions,
	dateFormat, // function
	globalAnimation,
	pathAnim,
	timeUnits,
	noop = function () {},

	// some constants for frequently used strings
	DIV = 'div',
	ABSOLUTE = 'absolute',
	RELATIVE = 'relative',
	HIDDEN = 'hidden',
	PREFIX = 'highcharts-',
	VISIBLE = 'visible',
	PX = 'px',
	NONE = 'none',
	M = 'M',
	L = 'L',
	/*
	 * Empirical lowest possible opacities for TRACKER_FILL
	 * IE6: 0.002
	 * IE7: 0.002
	 * IE8: 0.002
	 * IE9: 0.00000000001 (unlimited)
	 * FF: 0.00000000001 (unlimited)
	 * Chrome: 0.000001
	 * Safari: 0.000001
	 * Opera: 0.00000000001 (unlimited)
	 */
	TRACKER_FILL = 'rgba(192,192,192,' + (hasSVG ? 0.000001 : 0.002) + ')', // invisible but clickable
	//TRACKER_FILL = 'rgba(192,192,192,0.5)',
	NORMAL_STATE = '',
	HOVER_STATE = 'hover',
	SELECT_STATE = 'select',
	MILLISECOND = 'millisecond',
	SECOND = 'second',
	MINUTE = 'minute',
	HOUR = 'hour',
	DAY = 'day',
	WEEK = 'week',
	MONTH = 'month',
	YEAR = 'year',

	// constants for attributes
	FILL = 'fill',
	LINEAR_GRADIENT = 'linearGradient',
	STOPS = 'stops',
	STROKE = 'stroke',
	STROKE_WIDTH = 'stroke-width',

	// time methods, changed based on whether or not UTC is used
	makeTime,
	getMinutes,
	getHours,
	getDay,
	getDate,
	getMonth,
	getFullYear,
	setMinutes,
	setHours,
	setDate,
	setMonth,
	setFullYear,


	// lookup over the types and the associated classes
	seriesTypes = {};

// The Highcharts namespace
win.Highcharts = {};

/**
 * Extend an object with the members of another
 * @param {Object} a The object to be extended
 * @param {Object} b The object to add to the first one
 */
function extend(a, b) {
	var n;
	if (!a) {
		a = {};
	}
	for (n in b) {
		a[n] = b[n];
	}
	return a;
}

/**
 * Take an array and turn into a hash with even number arguments as keys and odd numbers as
 * values. Allows creating constants for commonly used style properties, attributes etc.
 * Avoid it in performance critical situations like looping
 */
function hash() {
	var i = 0,
		args = arguments,
		length = args.length,
		obj = {};
	for (; i < length; i++) {
		obj[args[i++]] = args[i];
	}
	return obj;
}

/**
 * Shortcut for parseInt
 * @param {Object} s
 * @param {Number} mag Magnitude
 */
function pInt(s, mag) {
	return parseInt(s, mag || 10);
}

/**
 * Check for string
 * @param {Object} s
 */
function isString(s) {
	return typeof s === 'string';
}

/**
 * Check for object
 * @param {Object} obj
 */
function isObject(obj) {
	return typeof obj === 'object';
}

/**
 * Check for array
 * @param {Object} obj
 */
function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

/**
 * Check for number
 * @param {Object} n
 */
function isNumber(n) {
	return typeof n === 'number';
}

function log2lin(num) {
	return math.log(num) / math.LN10;
}
function lin2log(num) {
	return math.pow(10, num);
}

/**
 * Remove last occurence of an item from an array
 * @param {Array} arr
 * @param {Mixed} item
 */
function erase(arr, item) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === item) {
			arr.splice(i, 1);
			break;
		}
	}
	//return arr;
}

/**
 * Returns true if the object is not null or undefined. Like MooTools' $.defined.
 * @param {Object} obj
 */
function defined(obj) {
	return obj !== UNDEFINED && obj !== null;
}

/**
 * Set or get an attribute or an object of attributes. Can't use jQuery attr because
 * it attempts to set expando properties on the SVG element, which is not allowed.
 *
 * @param {Object} elem The DOM element to receive the attribute(s)
 * @param {String|Object} prop The property or an abject of key-value pairs
 * @param {String} value The value if a single property is set
 */
function attr(elem, prop, value) {
	var key,
		setAttribute = 'setAttribute',
		ret;

	// if the prop is a string
	if (isString(prop)) {
		// set the value
		if (defined(value)) {

			elem[setAttribute](prop, value);

		// get the value
		} else if (elem && elem.getAttribute) { // elem not defined when printing pie demo...
			ret = elem.getAttribute(prop);
		}

	// else if prop is defined, it is a hash of key/value pairs
	} else if (defined(prop) && isObject(prop)) {
		for (key in prop) {
			elem[setAttribute](key, prop[key]);
		}
	}
	return ret;
}
/**
 * Check if an element is an array, and if not, make it into an array. Like
 * MooTools' $.splat.
 */
function splat(obj) {
	return isArray(obj) ? obj : [obj];
}


/**
 * Return the first value that is defined. Like MooTools' $.pick.
 */
function pick() {
	var args = arguments,
		i,
		arg,
		length = args.length;
	for (i = 0; i < length; i++) {
		arg = args[i];
		if (typeof arg !== 'undefined' && arg !== null) {
			return arg;
		}
	}
}

/**
 * Set CSS on a given element
 * @param {Object} el
 * @param {Object} styles Style object with camel case property names
 */
function css(el, styles) {
	if (isIE) {
		if (styles && styles.opacity !== UNDEFINED) {
			styles.filter = 'alpha(opacity=' + (styles.opacity * 100) + ')';
		}
	}
	extend(el.style, styles);
}

/**
 * Utility function to create element with attributes and styles
 * @param {Object} tag
 * @param {Object} attribs
 * @param {Object} styles
 * @param {Object} parent
 * @param {Object} nopad
 */
function createElement(tag, attribs, styles, parent, nopad) {
	var el = doc.createElement(tag);
	if (attribs) {
		extend(el, attribs);
	}
	if (nopad) {
		css(el, {padding: 0, border: NONE, margin: 0});
	}
	if (styles) {
		css(el, styles);
	}
	if (parent) {
		parent.appendChild(el);
	}
	return el;
}

/**
 * Extend a prototyped class by new members
 * @param {Object} parent
 * @param {Object} members
 */
function extendClass(parent, members) {
	var object = function () {};
	object.prototype = new parent();
	extend(object.prototype, members);
	return object;
}

/**
 * How many decimals are there in a number
 */
function getDecimals(number) {
	
	number = (number || 0).toString();
	
	return number.indexOf('.') > -1 ? 
		number.split('.')[1].length :
		0;
}

/**
 * Format a number and return a string based on input settings
 * @param {Number} number The input number to format
 * @param {Number} decimals The amount of decimals
 * @param {String} decPoint The decimal point, defaults to the one given in the lang options
 * @param {String} thousandsSep The thousands separator, defaults to the one given in the lang options
 */
function numberFormat(number, decimals, decPoint, thousandsSep) {
	var lang = defaultOptions.lang,
		// http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
		n = number,
		c = decimals === -1 ?
			getDecimals(number) :
			(isNaN(decimals = mathAbs(decimals)) ? 2 : decimals),
		d = decPoint === undefined ? lang.decimalPoint : decPoint,
		t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep,
		s = n < 0 ? "-" : "",
		i = String(pInt(n = mathAbs(+n || 0).toFixed(c))),
		j = i.length > 3 ? i.length % 3 : 0;

	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
		(c ? d + mathAbs(n - i).toFixed(c).slice(2) : "");
}

/**
 * Pad a string to a given length by adding 0 to the beginning
 * @param {Number} number
 * @param {Number} length
 */
function pad(number, length) {
	// Create an array of the remaining length +1 and join it with 0's
	return new Array((length || 2) + 1 - String(number).length).join(0) + number;
}

/**
 * Wrap a method with extended functionality, preserving the original function
 * @param {Object} obj The context object that the method belongs to 
 * @param {String} method The name of the method to extend
 * @param {Function} func A wrapper function callback. This function is called with the same arguments
 * as the original function, except that the original function is unshifted and passed as the first 
 * argument. 
 */
function wrap(obj, method, func) {
	var proceed = obj[method];
	obj[method] = function () {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(proceed);
		return func.apply(this, args);
	};
}

/**
 * Based on http://www.php.net/manual/en/function.strftime.php
 * @param {String} format
 * @param {Number} timestamp
 * @param {Boolean} capitalize
 */
dateFormat = function (format, timestamp, capitalize) {
	if (!defined(timestamp) || isNaN(timestamp)) {
		return 'Invalid date';
	}
	format = pick(format, '%Y-%m-%d %H:%M:%S');

	var date = new Date(timestamp),
		key, // used in for constuct below
		// get the basic time values
		hours = date[getHours](),
		day = date[getDay](),
		dayOfMonth = date[getDate](),
		month = date[getMonth](),
		fullYear = date[getFullYear](),
		lang = defaultOptions.lang,
		langWeekdays = lang.weekdays,
		/* // uncomment this and the 'W' format key below to enable week numbers
		weekNumber = function () {
			var clone = new Date(date.valueOf()),
				day = clone[getDay]() == 0 ? 7 : clone[getDay](),
				dayNumber;
			clone.setDate(clone[getDate]() + 4 - day);
			dayNumber = mathFloor((clone.getTime() - new Date(clone[getFullYear](), 0, 1, -6)) / 86400000);
			return 1 + mathFloor(dayNumber / 7);
		},
		*/

		// list all format keys
		replacements = {

			// Day
			'a': langWeekdays[day].substr(0, 3), // Short weekday, like 'Mon'
			'A': langWeekdays[day], // Long weekday, like 'Monday'
			'd': pad(dayOfMonth), // Two digit day of the month, 01 to 31
			'e': dayOfMonth, // Day of the month, 1 through 31

			// Week (none implemented)
			//'W': weekNumber(),

			// Month
			'b': lang.shortMonths[month], // Short month, like 'Jan'
			'B': lang.months[month], // Long month, like 'January'
			'm': pad(month + 1), // Two digit month number, 01 through 12

			// Year
			'y': fullYear.toString().substr(2, 2), // Two digits year, like 09 for 2009
			'Y': fullYear, // Four digits year, like 2009

			// Time
			'H': pad(hours), // Two digits hours in 24h format, 00 through 23
			'I': pad((hours % 12) || 12), // Two digits hours in 12h format, 00 through 11
			'l': (hours % 12) || 12, // Hours in 12h format, 1 through 12
			'M': pad(date[getMinutes]()), // Two digits minutes, 00 through 59
			'p': hours < 12 ? 'AM' : 'PM', // Upper case AM or PM
			'P': hours < 12 ? 'am' : 'pm', // Lower case AM or PM
			'S': pad(date.getSeconds()), // Two digits seconds, 00 through  59
			'L': pad(mathRound(timestamp % 1000), 3) // Milliseconds (naming from Ruby)
		};


	// do the replaces
	for (key in replacements) {
		format = format.replace('%' + key, replacements[key]);
	}

	// Optionally capitalize the string and return
	return capitalize ? format.substr(0, 1).toUpperCase() + format.substr(1) : format;
};

/**
 * Take an interval and normalize it to multiples of 1, 2, 2.5 and 5
 * @param {Number} interval
 * @param {Array} multiples
 * @param {Number} magnitude
 * @param {Object} options
 */
function normalizeTickInterval(interval, multiples, magnitude, options) {
	var normalized, i;

	// round to a tenfold of 1, 2, 2.5 or 5
	magnitude = pick(magnitude, 1);
	normalized = interval / magnitude;

	// multiples for a linear scale
	if (!multiples) {
		multiples = [1, 2, 2.5, 5, 10];

		// the allowDecimals option
		if (options && options.allowDecimals === false) {
			if (magnitude === 1) {
				multiples = [1, 2, 5, 10];
			} else if (magnitude <= 0.1) {
				multiples = [1 / magnitude];
			}
		}
	}

	// normalize the interval to the nearest multiple
	for (i = 0; i < multiples.length; i++) {
		interval = multiples[i];
		if (normalized <= (multiples[i] + (multiples[i + 1] || multiples[i])) / 2) {
			break;
		}
	}

	// multiply back to the correct magnitude
	interval *= magnitude;

	return interval;
}

/**
 * Get a normalized tick interval for dates. Returns a configuration object with
 * unit range (interval), count and name. Used to prepare data for getTimeTicks. 
 * Previously this logic was part of getTimeTicks, but as getTimeTicks now runs
 * of segments in stock charts, the normalizing logic was extracted in order to 
 * prevent it for running over again for each segment having the same interval. 
 * #662, #697.
 */
function normalizeTimeTickInterval(tickInterval, unitsOption) {
	var units = unitsOption || [[
				MILLISECOND, // unit name
				[1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
			], [
				SECOND,
				[1, 2, 5, 10, 15, 30]
			], [
				MINUTE,
				[1, 2, 5, 10, 15, 30]
			], [
				HOUR,
				[1, 2, 3, 4, 6, 8, 12]
			], [
				DAY,
				[1, 2]
			], [
				WEEK,
				[1, 2]
			], [
				MONTH,
				[1, 2, 3, 4, 6]
			], [
				YEAR,
				null
			]],
		unit = units[units.length - 1], // default unit is years
		interval = timeUnits[unit[0]],
		multiples = unit[1],
		count,
		i;
		
	// loop through the units to find the one that best fits the tickInterval
	for (i = 0; i < units.length; i++) {
		unit = units[i];
		interval = timeUnits[unit[0]];
		multiples = unit[1];


		if (units[i + 1]) {
			// lessThan is in the middle between the highest multiple and the next unit.
			var lessThan = (interval * multiples[multiples.length - 1] +
						timeUnits[units[i + 1][0]]) / 2;

			// break and keep the current unit
			if (tickInterval <= lessThan) {
				break;
			}
		}
	}

	// prevent 2.5 years intervals, though 25, 250 etc. are allowed
	if (interval === timeUnits[YEAR] && tickInterval < 5 * interval) {
		multiples = [1, 2, 5];
	}
	
	// prevent 2.5 years intervals, though 25, 250 etc. are allowed
	if (interval === timeUnits[YEAR] && tickInterval < 5 * interval) {
		multiples = [1, 2, 5];
	}

	// get the count
	count = normalizeTickInterval(tickInterval / interval, multiples);
	
	return {
		unitRange: interval,
		count: count,
		unitName: unit[0]
	};
}

/**
 * Set the tick positions to a time unit that makes sense, for example
 * on the first of each month or on every Monday. Return an array
 * with the time positions. Used in datetime axes as well as for grouping
 * data on a datetime axis.
 *
 * @param {Object} normalizedInterval The interval in axis values (ms) and the count
 * @param {Number} min The minimum in axis values
 * @param {Number} max The maximum in axis values
 * @param {Number} startOfWeek
 */
function getTimeTicks(normalizedInterval, min, max, startOfWeek) {
	var tickPositions = [],
		i,
		higherRanks = {},
		useUTC = defaultOptions.global.useUTC,
		minYear, // used in months and years as a basis for Date.UTC()
		minDate = new Date(min),
		interval = normalizedInterval.unitRange,
		count = normalizedInterval.count;

	

	if (interval >= timeUnits[SECOND]) { // second
		minDate.setMilliseconds(0);
		minDate.setSeconds(interval >= timeUnits[MINUTE] ? 0 :
			count * mathFloor(minDate.getSeconds() / count));
	}

	if (interval >= timeUnits[MINUTE]) { // minute
		minDate[setMinutes](interval >= timeUnits[HOUR] ? 0 :
			count * mathFloor(minDate[getMinutes]() / count));
	}

	if (interval >= timeUnits[HOUR]) { // hour
		minDate[setHours](interval >= timeUnits[DAY] ? 0 :
			count * mathFloor(minDate[getHours]() / count));
	}

	if (interval >= timeUnits[DAY]) { // day
		minDate[setDate](interval >= timeUnits[MONTH] ? 1 :
			count * mathFloor(minDate[getDate]() / count));
	}

	if (interval >= timeUnits[MONTH]) { // month
		minDate[setMonth](interval >= timeUnits[YEAR] ? 0 :
			count * mathFloor(minDate[getMonth]() / count));
		minYear = minDate[getFullYear]();
	}

	if (interval >= timeUnits[YEAR]) { // year
		minYear -= minYear % count;
		minDate[setFullYear](minYear);
	}

	// week is a special case that runs outside the hierarchy
	if (interval === timeUnits[WEEK]) {
		// get start of current week, independent of count
		minDate[setDate](minDate[getDate]() - minDate[getDay]() +
			pick(startOfWeek, 1));
	}


	// get tick positions
	i = 1;
	minYear = minDate[getFullYear]();
	var time = minDate.getTime(),
		minMonth = minDate[getMonth](),
		minDateDate = minDate[getDate](),
		timezoneOffset = useUTC ? 
			0 : 
			(24 * 3600 * 1000 + minDate.getTimezoneOffset() * 60 * 1000) % (24 * 3600 * 1000); // #950

	// iterate and add tick positions at appropriate values
	while (time < max) {
		tickPositions.push(time);

		// if the interval is years, use Date.UTC to increase years
		if (interval === timeUnits[YEAR]) {
			time = makeTime(minYear + i * count, 0);

		// if the interval is months, use Date.UTC to increase months
		} else if (interval === timeUnits[MONTH]) {
			time = makeTime(minYear, minMonth + i * count);

		// if we're using global time, the interval is not fixed as it jumps
		// one hour at the DST crossover
		} else if (!useUTC && (interval === timeUnits[DAY] || interval === timeUnits[WEEK])) {
			time = makeTime(minYear, minMonth, minDateDate +
				i * count * (interval === timeUnits[DAY] ? 1 : 7));

		// else, the interval is fixed and we use simple addition
		} else {
			time += interval * count;
			
			// mark new days if the time is dividable by day
			if (interval <= timeUnits[HOUR] && time % timeUnits[DAY] === timezoneOffset) {
				higherRanks[time] = DAY;
			}
		}

		i++;
	}
	
	// push the last time
	tickPositions.push(time);

	// record information on the chosen unit - for dynamic label formatter
	tickPositions.info = extend(normalizedInterval, {
		higherRanks: higherRanks,
		totalRange: interval * count
	});

	return tickPositions;
}

/**
 * Helper class that contains variuos counters that are local to the chart.
 */
function ChartCounters() {
	this.color = 0;
	this.symbol = 0;
}

ChartCounters.prototype =  {
	/**
	 * Wraps the color counter if it reaches the specified length.
	 */
	wrapColor: function (length) {
		if (this.color >= length) {
			this.color = 0;
		}
	},

	/**
	 * Wraps the symbol counter if it reaches the specified length.
	 */
	wrapSymbol: function (length) {
		if (this.symbol >= length) {
			this.symbol = 0;
		}
	}
};


/**
 * Utility method that sorts an object array and keeping the order of equal items.
 * ECMA script standard does not specify the behaviour when items are equal.
 */
function stableSort(arr, sortFunction) {
	var length = arr.length,
		sortValue,
		i;

	// Add index to each item
	for (i = 0; i < length; i++) {
		arr[i].ss_i = i; // stable sort index
	}

	arr.sort(function (a, b) {
		sortValue = sortFunction(a, b);
		return sortValue === 0 ? a.ss_i - b.ss_i : sortValue;
	});

	// Remove index from items
	for (i = 0; i < length; i++) {
		delete arr[i].ss_i; // stable sort index
	}
}

/**
 * Non-recursive method to find the lowest member of an array. Math.min raises a maximum
 * call stack size exceeded error in Chrome when trying to apply more than 150.000 points. This
 * method is slightly slower, but safe.
 */
function arrayMin(data) {
	var i = data.length,
		min = data[0];

	while (i--) {
		if (data[i] < min) {
			min = data[i];
		}
	}
	return min;
}

/**
 * Non-recursive method to find the lowest member of an array. Math.min raises a maximum
 * call stack size exceeded error in Chrome when trying to apply more than 150.000 points. This
 * method is slightly slower, but safe.
 */
function arrayMax(data) {
	var i = data.length,
		max = data[0];

	while (i--) {
		if (data[i] > max) {
			max = data[i];
		}
	}
	return max;
}

/**
 * Utility method that destroys any SVGElement or VMLElement that are properties on the given object.
 * It loops all properties and invokes destroy if there is a destroy method. The property is
 * then delete'ed.
 * @param {Object} The object to destroy properties on
 * @param {Object} Exception, do not destroy this property, only delete it.
 */
function destroyObjectProperties(obj, except) {
	var n;
	for (n in obj) {
		// If the object is non-null and destroy is defined
		if (obj[n] && obj[n] !== except && obj[n].destroy) {
			// Invoke the destroy
			obj[n].destroy();
		}

		// Delete the property from the object.
		delete obj[n];
	}
}


/**
 * Discard an element by moving it to the bin and delete
 * @param {Object} The HTML node to discard
 */
function discardElement(element) {
	// create a garbage bin element, not part of the DOM
	if (!garbageBin) {
		garbageBin = createElement(DIV);
	}

	// move the node and empty bin
	if (element) {
		garbageBin.appendChild(element);
	}
	garbageBin.innerHTML = '';
}

/**
 * Provide error messages for debugging, with links to online explanation 
 */
function error(code, stop) {
	var msg = 'Highcharts error #' + code + ': www.highcharts.com/errors/' + code;
	if (stop) {
		throw msg;
	} else if (win.console) {
		console.log(msg);
	}
}

/**
 * Fix JS round off float errors
 * @param {Number} num
 */
function correctFloat(num) {
	return parseFloat(
		num.toPrecision(14)
	);
}

/**
 * Set the global animation to either a given value, or fall back to the
 * given chart's animation option
 * @param {Object} animation
 * @param {Object} chart
 */
function setAnimation(animation, chart) {
	globalAnimation = pick(animation, chart.animation);
}

/**
 * The time unit lookup
 */
/*jslint white: true*/
timeUnits = hash(
	MILLISECOND, 1,
	SECOND, 1000,
	MINUTE, 60000,
	HOUR, 3600000,
	DAY, 24 * 3600000,
	WEEK, 7 * 24 * 3600000,
	MONTH, 30 * 24 * 3600000,
	YEAR, 31556952000
);
/*jslint white: false*/
/**
 * Path interpolation algorithm used across adapters
 */
pathAnim = {
	/**
	 * Prepare start and end values so that the path can be animated one to one
	 */
	init: function (elem, fromD, toD) {
		fromD = fromD || '';
		var shift = elem.shift,
			bezier = fromD.indexOf('C') > -1,
			numParams = bezier ? 7 : 3,
			endLength,
			slice,
			i,
			start = fromD.split(' '),
			end = [].concat(toD), // copy
			startBaseLine,
			endBaseLine,
			sixify = function (arr) { // in splines make move points have six parameters like bezier curves
				i = arr.length;
				while (i--) {
					if (arr[i] === M) {
						arr.splice(i + 1, 0, arr[i + 1], arr[i + 2], arr[i + 1], arr[i + 2]);
					}
				}
			};

		if (bezier) {
			sixify(start);
			sixify(end);
		}

		// pull out the base lines before padding
		if (elem.isArea) {
			startBaseLine = start.splice(start.length - 6, 6);
			endBaseLine = end.splice(end.length - 6, 6);
		}

		// if shifting points, prepend a dummy point to the end path
		if (shift <= end.length / numParams) {
			while (shift--) {
				end = [].concat(end).splice(0, numParams).concat(end);
			}
		}
		elem.shift = 0; // reset for following animations

		// copy and append last point until the length matches the end length
		if (start.length) {
			endLength = end.length;
			while (start.length < endLength) {

				//bezier && sixify(start);
				slice = [].concat(start).splice(start.length - numParams, numParams);
				if (bezier) { // disable first control point
					slice[numParams - 6] = slice[numParams - 2];
					slice[numParams - 5] = slice[numParams - 1];
				}
				start = start.concat(slice);
			}
		}

		if (startBaseLine) { // append the base lines for areas
			start = start.concat(startBaseLine);
			end = end.concat(endBaseLine);
		}
		return [start, end];
	},

	/**
	 * Interpolate each value of the path and return the array
	 */
	step: function (start, end, pos, complete) {
		var ret = [],
			i = start.length,
			startVal;

		if (pos === 1) { // land on the final path without adjustment points appended in the ends
			ret = complete;

		} else if (i === end.length && pos < 1) {
			while (i--) {
				startVal = parseFloat(start[i]);
				ret[i] =
					isNaN(startVal) ? // a letter instruction like M or L
						start[i] :
						pos * (parseFloat(end[i] - startVal)) + startVal;

			}
		} else { // if animation is finished or length not matching, land on right value
			ret = end;
		}
		return ret;
	}
};

(function ($) {
	/**
	 * The default HighchartsAdapter for jQuery
	 */
	win.HighchartsAdapter = win.HighchartsAdapter || ($ && {
		
		/**
		 * Initialize the adapter by applying some extensions to jQuery
		 */
		init: function (pathAnim) {
			
			// extend the animate function to allow SVG animations
			var Fx = $.fx,
				Step = Fx.step,
				dSetter,
				Tween = $.Tween,
				propHooks = Tween && Tween.propHooks;
			
			/*jslint unparam: true*//* allow unused param x in this function */
			$.extend($.easing, {
				easeOutQuad: function (x, t, b, c, d) {
					return -c * (t /= d) * (t - 2) + b;
				}
			});
			/*jslint unparam: false*/
		
		
			// extend some methods to check for elem.attr, which means it is a Highcharts SVG object
			$.each(['cur', '_default', 'width', 'height'], function (i, fn) {
				var obj = Step,
					base,
					elem;
					
				// Handle different parent objects
				if (fn === 'cur') {
					obj = Fx.prototype; // 'cur', the getter, relates to Fx.prototype
				
				} else if (fn === '_default' && Tween) { // jQuery 1.8 model
					obj = propHooks[fn];
					fn = 'set';
				}
		
				// Overwrite the method
				base = obj[fn];
				if (base) { // step.width and step.height don't exist in jQuery < 1.7
		
					// create the extended function replacement
					obj[fn] = function (fx) {
		
						// Fx.prototype.cur does not use fx argument
						fx = i ? fx : this;
		
						// shortcut
						elem = fx.elem;
		
						// Fx.prototype.cur returns the current value. The other ones are setters
						// and returning a value has no effect.
						return elem.attr ? // is SVG element wrapper
							elem.attr(fx.prop, fn === 'cur' ? UNDEFINED : fx.now) : // apply the SVG wrapper's method
							base.apply(this, arguments); // use jQuery's built-in method
					};
				}
			});
			
			
			// Define the setter function for d (path definitions)
			dSetter = function (fx) {
				var elem = fx.elem,
					ends;
		
				// Normally start and end should be set in state == 0, but sometimes,
				// for reasons unknown, this doesn't happen. Perhaps state == 0 is skipped
				// in these cases
				if (!fx.started) {
					ends = pathAnim.init(elem, elem.d, elem.toD);
					fx.start = ends[0];
					fx.end = ends[1];
					fx.started = true;
				}
		
		
				// interpolate each value of the path
				elem.attr('d', pathAnim.step(fx.start, fx.end, fx.pos, elem.toD));
			};
			
			// jQuery 1.8 style
			if (Tween) {
				propHooks.d = {
					set: dSetter
				};
			// pre 1.8
			} else {
				// animate paths
				Step.d = dSetter;
			}
			
			/**
			 * Utility for iterating over an array. Parameters are reversed compared to jQuery.
			 * @param {Array} arr
			 * @param {Function} fn
			 */
			this.each = Array.prototype.forEach ?
				function (arr, fn) { // modern browsers
					return Array.prototype.forEach.call(arr, fn);
					
				} : 
				function (arr, fn) { // legacy
					var i = 0, 
						len = arr.length;
					for (; i < len; i++) {
						if (fn.call(arr[i], arr[i], i, arr) === false) {
							return i;
						}
					}
				};
			
			// Register Highcharts as a jQuery plugin
			// TODO: MooTools and prototype as well?
			// TODO: StockChart
			/*$.fn.highcharts = function(options, callback) {
		        options.chart = merge(options.chart, { renderTo: this[0] });
		        this.chart = new Chart(options, callback);
		        return this;
		    };*/
		},
	
		/**
		 * Downloads a script and executes a callback when done.
		 * @param {String} scriptLocation
		 * @param {Function} callback
		 */
		getScript: $.getScript,
		
		/**
		 * Return the index of an item in an array, or -1 if not found
		 */
		inArray: $.inArray,
		
		/**
		 * A direct link to jQuery methods. MooTools and Prototype adapters must be implemented for each case of method.
		 * @param {Object} elem The HTML element
		 * @param {String} method Which method to run on the wrapped element
		 */
		adapterRun: function (elem, method) {
			return $(elem)[method]();
		},
	
		/**
		 * Filter an array
		 */
		grep: $.grep,
	
		/**
		 * Map an array
		 * @param {Array} arr
		 * @param {Function} fn
		 */
		map: function (arr, fn) {
			//return jQuery.map(arr, fn);
			var results = [],
				i = 0,
				len = arr.length;
			for (; i < len; i++) {
				results[i] = fn.call(arr[i], arr[i], i, arr);
			}
			return results;
	
		},
	
		/**
		 * Deep merge two objects and return a third object
		 */
		merge: function () {
			var args = arguments;
			return $.extend(true, null, args[0], args[1], args[2], args[3]);
		},
	
		/**
		 * Get the position of an element relative to the top left of the page
		 */
		offset: function (el) {
			return $(el).offset();
		},
	
		/**
		 * Add an event listener
		 * @param {Object} el A HTML element or custom object
		 * @param {String} event The event type
		 * @param {Function} fn The event handler
		 */
		addEvent: function (el, event, fn) {
			$(el).bind(event, fn);
		},
	
		/**
		 * Remove event added with addEvent
		 * @param {Object} el The object
		 * @param {String} eventType The event type. Leave blank to remove all events.
		 * @param {Function} handler The function to remove
		 */
		removeEvent: function (el, eventType, handler) {
			// workaround for jQuery issue with unbinding custom events:
			// http://forum.jQuery.com/topic/javascript-error-when-unbinding-a-custom-event-using-jQuery-1-4-2
			var func = doc.removeEventListener ? 'removeEventListener' : 'detachEvent';
			if (doc[func] && !el[func]) {
				el[func] = function () {};
			}
	
			$(el).unbind(eventType, handler);
		},
	
		/**
		 * Fire an event on a custom object
		 * @param {Object} el
		 * @param {String} type
		 * @param {Object} eventArguments
		 * @param {Function} defaultFunction
		 */
		fireEvent: function (el, type, eventArguments, defaultFunction) {
			var event = $.Event(type),
				detachedType = 'detached' + type,
				defaultPrevented;
	
			// Remove warnings in Chrome when accessing layerX and layerY. Although Highcharts
			// never uses these properties, Chrome includes them in the default click event and
			// raises the warning when they are copied over in the extend statement below.
			//
			// To avoid problems in IE (see #1010) where we cannot delete the properties and avoid
			// testing if they are there (warning in chrome) the only option is to test if running IE.
			if (!isIE && eventArguments) {
				delete eventArguments.layerX;
				delete eventArguments.layerY;
			}
	
			extend(event, eventArguments);
	
			// Prevent jQuery from triggering the object method that is named the
			// same as the event. For example, if the event is 'select', jQuery
			// attempts calling el.select and it goes into a loop.
			if (el[type]) {
				el[detachedType] = el[type];
				el[type] = null;
			}
	
			// Wrap preventDefault and stopPropagation in try/catch blocks in
			// order to prevent JS errors when cancelling events on non-DOM
			// objects. #615.
			/*jslint unparam: true*/
			$.each(['preventDefault', 'stopPropagation'], function (i, fn) {
				var base = event[fn];
				event[fn] = function () {
					try {
						base.call(event);
					} catch (e) {
						if (fn === 'preventDefault') {
							defaultPrevented = true;
						}
					}
				};
			});
			/*jslint unparam: false*/
	
			// trigger it
			$(el).trigger(event);
	
			// attach the method
			if (el[detachedType]) {
				el[type] = el[detachedType];
				el[detachedType] = null;
			}
	
			if (defaultFunction && !event.isDefaultPrevented() && !defaultPrevented) {
				defaultFunction(event);
			}
		},
		
		/**
		 * Extension method needed for MooTools
		 */
		washMouseEvent: function (e) {
			var ret = e.originalEvent || e;
			
			// computed by jQuery, needed by IE8
			if (ret.pageX === UNDEFINED) { // #1236
				ret.pageX = e.pageX;
				ret.pageY = e.pageY;
			}
			
			return ret;
		},
	
		/**
		 * Animate a HTML element or SVG element wrapper
		 * @param {Object} el
		 * @param {Object} params
		 * @param {Object} options jQuery-like animation options: duration, easing, callback
		 */
		animate: function (el, params, options) {
			var $el = $(el);
			if (params.d) {
				el.toD = params.d; // keep the array form for paths, used in $.fx.step.d
				params.d = 1; // because in jQuery, animating to an array has a different meaning
			}
	
			$el.stop();
			$el.animate(params, options);
	
		},
		/**
		 * Stop running animation
		 */
		stop: function (el) {
			$(el).stop();
		}
	});
}(win.jQuery));


// check for a custom HighchartsAdapter defined prior to this file
var globalAdapter = win.HighchartsAdapter,
	adapter = globalAdapter || {};
	
// Initialize the adapter
if (globalAdapter) {
	globalAdapter.init.call(globalAdapter, pathAnim);
}


	// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
	// and all the utility functions will be null. In that case they are populated by the
	// default adapters below.
var adapterRun = adapter.adapterRun,
	getScript = adapter.getScript,
	inArray = adapter.inArray,
	each = adapter.each,
	grep = adapter.grep,
	offset = adapter.offset,
	map = adapter.map,
	merge = adapter.merge,
	addEvent = adapter.addEvent,
	removeEvent = adapter.removeEvent,
	fireEvent = adapter.fireEvent,
	washMouseEvent = adapter.washMouseEvent,
	animate = adapter.animate,
	stop = adapter.stop;



/* ****************************************************************************
 * Handle the options                                                         *
 *****************************************************************************/
var

defaultLabelOptions = {
	enabled: true,
	// rotation: 0,
	align: 'center',
	x: 0,
	y: 15,
	/*formatter: function () {
		return this.value;
	},*/
	style: {
		color: '#666',
		fontSize: '11px',
		lineHeight: '14px'
	}
};

defaultOptions = {
	colors: ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
		'#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
	symbols: ['circle', 'diamond', 'square', 'triangle', 'triangle-down'],
	lang: {
		loading: 'Loading...',
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
				'August', 'September', 'October', 'November', 'December'],
		shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		decimalPoint: '.',
		numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'], // SI prefixes used in axis labels
		resetZoom: 'Reset zoom',
		resetZoomTitle: 'Reset zoom level 1:1',
		thousandsSep: ','
	},
	global: {
		useUTC: true,
		canvasToolsURL: 'http://code.highcharts.com/2.3.3/modules/canvas-tools.js',
		VMLRadialGradientURL: 'http://code.highcharts.com/2.3.3/gfx/vml-radial-gradient.png'
	},
	chart: {
		//animation: true,
		//alignTicks: false,
		//reflow: true,
		//className: null,
		//events: { load, selection },
		//margin: [null],
		//marginTop: null,
		//marginRight: null,
		//marginBottom: null,
		//marginLeft: null,
		borderColor: '#4572A7',
		//borderWidth: 0,
		borderRadius: 5,
		defaultSeriesType: 'line',
		ignoreHiddenSeries: true,
		//inverted: false,
		//shadow: false,
		spacingTop: 10,
		spacingRight: 10,
		spacingBottom: 15,
		spacingLeft: 10,
		style: {
			fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
			fontSize: '12px'
		},
		backgroundColor: '#FFFFFF',
		//plotBackgroundColor: null,
		plotBorderColor: '#C0C0C0',
		//plotBorderWidth: 0,
		//plotShadow: false,
		//zoomType: ''
		resetZoomButton: {
			theme: {
				zIndex: 20
			},
			position: {
				align: 'right',
				x: -10,
				//verticalAlign: 'top',
				y: 10
			}
			// relativeTo: 'plot'
		}
	},
	title: {
		text: 'Chart title',
		align: 'center',
		// floating: false,
		// margin: 15,
		// x: 0,
		// verticalAlign: 'top',
		y: 15,
		style: {
			color: '#3E576F',
			fontSize: '16px'
		}

	},
	subtitle: {
		text: '',
		align: 'center',
		// floating: false
		// x: 0,
		// verticalAlign: 'top',
		y: 30,
		style: {
			color: '#6D869F'
		}
	},

	plotOptions: {
		line: { // base series options
			allowPointSelect: false,
			showCheckbox: false,
			animation: {
				duration: 1000
			},
			//connectNulls: false,
			//cursor: 'default',
			//clip: true,
			//dashStyle: null,
			//enableMouseTracking: true,
			events: {},
			//legendIndex: 0,
			lineWidth: 2,
			shadow: true,
			// stacking: null,
			marker: {
				enabled: true,
				//symbol: null,
				lineWidth: 0,
				radius: 4,
				lineColor: '#FFFFFF',
				//fillColor: null,
				states: { // states for a single point
					hover: {
						enabled: true
						//radius: base + 2
					},
					select: {
						fillColor: '#FFFFFF',
						lineColor: '#000000',
						lineWidth: 2
					}
				}
			},
			point: {
				events: {}
			},
			dataLabels: merge(defaultLabelOptions, {
				enabled: false,
				formatter: function () {
					return this.y;
				},
				verticalAlign: 'bottom', // above singular point
				y: 0
				// backgroundColor: undefined,
				// borderColor: undefined,
				// borderRadius: undefined,
				// borderWidth: undefined,
				// padding: 3,
				// shadow: false
			}),
			cropThreshold: 300, // draw points outside the plot area when the number of points is less than this
			pointRange: 0,
			//pointStart: 0,
			//pointInterval: 1,
			showInLegend: true,
			states: { // states for the entire series
				hover: {
					//enabled: false,
					//lineWidth: base + 1,
					marker: {
						// lineWidth: base + 1,
						// radius: base + 1
					}
				},
				select: {
					marker: {}
				}
			},
			stickyTracking: true
			//tooltip: {
				//pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>'
				//valueDecimals: null,
				//xDateFormat: '%A, %b %e, %Y',
				//valuePrefix: '',
				//ySuffix: ''				
			//}
			// turboThreshold: 1000
			// zIndex: null
		}
	},
	labels: {
		//items: [],
		style: {
			//font: defaultFont,
			position: ABSOLUTE,
			color: '#3E576F'
		}
	},
	legend: {
		enabled: true,
		align: 'center',
		//floating: false,
		layout: 'horizontal',
		labelFormatter: function () {
			return this.name;
		},
		borderWidth: 1,
		borderColor: '#909090',
		borderRadius: 5,
		navigation: {
			// animation: true,
			activeColor: '#3E576F',
			// arrowSize: 12
			inactiveColor: '#CCC'
			// style: {} // text styles
		},
		// margin: 10,
		// reversed: false,
		shadow: false,
		// backgroundColor: null,
		/*style: {
			padding: '5px'
		},*/
		itemStyle: {
			cursor: 'pointer',
			color: '#3E576F',
			fontSize: '12px'
		},
		itemHoverStyle: {
			//cursor: 'pointer', removed as of #601
			color: '#000'
		},
		itemHiddenStyle: {
			color: '#CCC'
		},
		itemCheckboxStyle: {
			position: ABSOLUTE,
			width: '13px', // for IE precision
			height: '13px'
		},
		// itemWidth: undefined,
		symbolWidth: 16,
		symbolPadding: 5,
		verticalAlign: 'bottom',
		// width: undefined,
		x: 0,
		y: 0
	},

	loading: {
		// hideDuration: 100,
		labelStyle: {
			fontWeight: 'bold',
			position: RELATIVE,
			top: '1em'
		},
		// showDuration: 0,
		style: {
			position: ABSOLUTE,
			backgroundColor: 'white',
			opacity: 0.5,
			textAlign: 'center'
		}
	},

	tooltip: {
		enabled: true,
		//crosshairs: null,
		backgroundColor: 'rgba(255, 255, 255, .85)',
		borderWidth: 2,
		borderRadius: 5,
		dateTimeLabelFormats: { 
			millisecond: '%A, %b %e, %H:%M:%S.%L',
			second: '%A, %b %e, %H:%M:%S',
			minute: '%A, %b %e, %H:%M',
			hour: '%A, %b %e, %H:%M',
			day: '%A, %b %e, %Y',
			week: 'Week from %A, %b %e, %Y',
			month: '%B %Y',
			year: '%Y'
		},
		//formatter: defaultFormatter,
		headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
		pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
		shadow: true,
		shared: useCanVG,
		snap: hasTouch ? 25 : 10,
		style: {
			color: '#333333',
			fontSize: '12px',
			padding: '5px',
			whiteSpace: 'nowrap'
		}
		//xDateFormat: '%A, %b %e, %Y',
		//valueDecimals: null,
		//valuePrefix: '',
		//valueSuffix: ''
	},

	credits: {
		enabled: true,
		text: 'Highcharts.com',
		href: 'http://www.highcharts.com',
		position: {
			align: 'right',
			x: -10,
			verticalAlign: 'bottom',
			y: -5
		},
		style: {
			cursor: 'pointer',
			color: '#909090',
			fontSize: '10px'
		}
	}
};




// Series defaults
var defaultPlotOptions = defaultOptions.plotOptions,
	defaultSeriesOptions = defaultPlotOptions.line;

// set the default time methods
setTimeMethods();



/**
 * Set the time methods globally based on the useUTC option. Time method can be either
 * local time or UTC (default).
 */
function setTimeMethods() {
	var useUTC = defaultOptions.global.useUTC,
		GET = useUTC ? 'getUTC' : 'get',
		SET = useUTC ? 'setUTC' : 'set';

	makeTime = useUTC ? Date.UTC : function (year, month, date, hours, minutes, seconds) {
		return new Date(
			year,
			month,
			pick(date, 1),
			pick(hours, 0),
			pick(minutes, 0),
			pick(seconds, 0)
		).getTime();
	};
	getMinutes =  GET + 'Minutes';
	getHours =    GET + 'Hours';
	getDay =      GET + 'Day';
	getDate =     GET + 'Date';
	getMonth =    GET + 'Month';
	getFullYear = GET + 'FullYear';
	setMinutes =  SET + 'Minutes';
	setHours =    SET + 'Hours';
	setDate =     SET + 'Date';
	setMonth =    SET + 'Month';
	setFullYear = SET + 'FullYear';

}

/**
 * Merge the default options with custom options and return the new options structure
 * @param {Object} options The new custom options
 */
function setOptions(options) {
	
	// Pull out axis options and apply them to the respective default axis options 
	/*defaultXAxisOptions = merge(defaultXAxisOptions, options.xAxis);
	defaultYAxisOptions = merge(defaultYAxisOptions, options.yAxis);
	options.xAxis = options.yAxis = UNDEFINED;*/
	
	// Merge in the default options
	defaultOptions = merge(defaultOptions, options);
	
	// Apply UTC
	setTimeMethods();

	return defaultOptions;
}

/**
 * Get the updated default options. Merely exposing defaultOptions for outside modules
 * isn't enough because the setOptions method creates a new object.
 */
function getOptions() {
	return defaultOptions;
}



/**
 * Handle color operations. The object methods are chainable.
 * @param {String} input The input color in either rbga or hex format
 */
var Color = function (input) {
	// declare variables
	var rgba = [], result;

	/**
	 * Parse the input color to rgba array
	 * @param {String} input
	 */
	function init(input) {

		// rgba
		result = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(input);
		if (result) {
			rgba = [pInt(result[1]), pInt(result[2]), pInt(result[3]), parseFloat(result[4], 10)];
		} else { // hex
			result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(input);
			if (result) {
				rgba = [pInt(result[1], 16), pInt(result[2], 16), pInt(result[3], 16), 1];
			}
		}

	}
	/**
	 * Return the color a specified format
	 * @param {String} format
	 */
	function get(format) {
		var ret;

		// it's NaN if gradient colors on a column chart
		if (rgba && !isNaN(rgba[0])) {
			if (format === 'rgb') {
				ret = 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
			} else if (format === 'a') {
				ret = rgba[3];
			} else {
				ret = 'rgba(' + rgba.join(',') + ')';
			}
		} else {
			ret = input;
		}
		return ret;
	}

	/**
	 * Brighten the color
	 * @param {Number} alpha
	 */
	function brighten(alpha) {
		if (isNumber(alpha) && alpha !== 0) {
			var i;
			for (i = 0; i < 3; i++) {
				rgba[i] += pInt(alpha * 255);

				if (rgba[i] < 0) {
					rgba[i] = 0;
				}
				if (rgba[i] > 255) {
					rgba[i] = 255;
				}
			}
		}
		return this;
	}
	/**
	 * Set the color's opacity to a given alpha value
	 * @param {Number} alpha
	 */
	function setOpacity(alpha) {
		rgba[3] = alpha;
		return this;
	}

	// initialize: parse the input
	init(input);

	// public methods
	return {
		get: get,
		brighten: brighten,
		setOpacity: setOpacity
	};
};


/**
 * A wrapper object for SVG elements
 */
function SVGElement() {}

SVGElement.prototype = {
	/**
	 * Initialize the SVG renderer
	 * @param {Object} renderer
	 * @param {String} nodeName
	 */
	init: function (renderer, nodeName) {
		var wrapper = this;
		wrapper.element = nodeName === 'span' ?
			createElement(nodeName) :
			doc.createElementNS(SVG_NS, nodeName);
		wrapper.renderer = renderer;
		/**
		 * A collection of attribute setters. These methods, if defined, are called right before a certain
		 * attribute is set on an element wrapper. Returning false prevents the default attribute
		 * setter to run. Returning a value causes the default setter to set that value. Used in
		 * Renderer.label.
		 */
		wrapper.attrSetters = {};
	},
	/**
	 * Animate a given attribute
	 * @param {Object} params
	 * @param {Number} options The same options as in jQuery animation
	 * @param {Function} complete Function to perform at the end of animation
	 */
	animate: function (params, options, complete) {
		var animOptions = pick(options, globalAnimation, true);
		stop(this); // stop regardless of animation actually running, or reverting to .attr (#607)
		if (animOptions) {
			animOptions = merge(animOptions);
			if (complete) { // allows using a callback with the global animation without overwriting it
				animOptions.complete = complete;
			}
			animate(this, params, animOptions);
		} else {
			this.attr(params);
			if (complete) {
				complete();
			}
		}
	},
	/**
	 * Set or get a given attribute
	 * @param {Object|String} hash
	 * @param {Mixed|Undefined} val
	 */
	attr: function (hash, val) {
		var wrapper = this,
			key,
			value,
			result,
			i,
			child,
			element = wrapper.element,
			nodeName = element.nodeName.toLowerCase(), // Android2 requires lower for "text"
			renderer = wrapper.renderer,
			skipAttr,
			titleNode,
			attrSetters = wrapper.attrSetters,
			shadows = wrapper.shadows,
			hasSetSymbolSize,
			doTransform,
			ret = wrapper;

		// single key-value pair
		if (isString(hash) && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}

		// used as a getter: first argument is a string, second is undefined
		if (isString(hash)) {
			key = hash;
			if (nodeName === 'circle') {
				key = { x: 'cx', y: 'cy' }[key] || key;
			} else if (key === 'strokeWidth') {
				key = 'stroke-width';
			}
			ret = attr(element, key) || wrapper[key] || 0;

			if (key !== 'd' && key !== 'visibility') { // 'd' is string in animation step
				ret = parseFloat(ret);
			}

		// setter
		} else {

			for (key in hash) {
				skipAttr = false; // reset
				value = hash[key];

				// check for a specific attribute setter
				result = attrSetters[key] && attrSetters[key].call(wrapper, value, key);

				if (result !== false) {
					if (result !== UNDEFINED) {
						value = result; // the attribute setter has returned a new value to set
					}

					// paths
					if (key === 'd') {
						if (value && value.join) { // join path
							value = value.join(' ');
						}
						if (/(NaN| {2}|^$)/.test(value)) {
							value = 'M 0 0';
						}
						//wrapper.d = value; // shortcut for animations

					// update child tspans x values
					} else if (key === 'x' && nodeName === 'text') {
						for (i = 0; i < element.childNodes.length; i++) {
							child = element.childNodes[i];
							// if the x values are equal, the tspan represents a linebreak
							if (attr(child, 'x') === attr(element, 'x')) {
								//child.setAttribute('x', value);
								attr(child, 'x', value);
							}
						}

						if (wrapper.rotation) {
							attr(element, 'transform', 'rotate(' + wrapper.rotation + ' ' + value + ' ' +
								pInt(hash.y || attr(element, 'y')) + ')');
						}

					// apply gradients
					} else if (key === 'fill') {
						value = renderer.color(value, element, key);

					// circle x and y
					} else if (nodeName === 'circle' && (key === 'x' || key === 'y')) {
						key = { x: 'cx', y: 'cy' }[key] || key;

					// rectangle border radius
					} else if (nodeName === 'rect' && key === 'r') {
						attr(element, {
							rx: value,
							ry: value
						});
						skipAttr = true;

					// translation and text rotation
					} else if (key === 'translateX' || key === 'translateY' || key === 'rotation' || key === 'verticalAlign') {
						doTransform = true;
						skipAttr = true;

					// apply opacity as subnode (required by legacy WebKit and Batik)
					} else if (key === 'stroke') {
						value = renderer.color(value, element, key);

					// emulate VML's dashstyle implementation
					} else if (key === 'dashstyle') {
						key = 'stroke-dasharray';
						value = value && value.toLowerCase();
						if (value === 'solid') {
							value = NONE;
						} else if (value) {
							value = value
								.replace('shortdashdotdot', '3,1,1,1,1,1,')
								.replace('shortdashdot', '3,1,1,1')
								.replace('shortdot', '1,1,')
								.replace('shortdash', '3,1,')
								.replace('longdash', '8,3,')
								.replace(/dot/g, '1,3,')
								.replace('dash', '4,3,')
								.replace(/,$/, '')
								.split(','); // ending comma

							i = value.length;
							while (i--) {
								value[i] = pInt(value[i]) * hash['stroke-width'];
							}
							value = value.join(',');
						}

					// special
					} else if (key === 'isTracker') {
						wrapper[key] = value;

					// IE9/MooTools combo: MooTools returns objects instead of numbers and IE9 Beta 2
					// is unable to cast them. Test again with final IE9.
					} else if (key === 'width') {
						value = pInt(value);

					// Text alignment
					} else if (key === 'align') {
						key = 'text-anchor';
						value = { left: 'start', center: 'middle', right: 'end' }[value];

					// Title requires a subnode, #431
					} else if (key === 'title') {
						titleNode = element.getElementsByTagName('title')[0];
						if (!titleNode) {
							titleNode = doc.createElementNS(SVG_NS, 'title');
							element.appendChild(titleNode);
						}
						titleNode.textContent = value;
					}

					// jQuery animate changes case
					if (key === 'strokeWidth') {
						key = 'stroke-width';
					}

					// Chrome/Win < 6 bug (http://code.google.com/p/chromium/issues/detail?id=15461)
					if (isWebKit && key === 'stroke-width' && value === 0) {
						value = 0.000001;
					}

					// symbols
					if (wrapper.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(key)) {


						if (!hasSetSymbolSize) {
							wrapper.symbolAttr(hash);
							hasSetSymbolSize = true;
						}
						skipAttr = true;
					}

					// let the shadow follow the main element
					if (shadows && /^(width|height|visibility|x|y|d|transform)$/.test(key)) {
						i = shadows.length;
						while (i--) {
							attr(
								shadows[i], 
								key, 
								key === 'height' ? 
									mathMax(value - (shadows[i].cutHeight || 0), 0) :
									value
							);
						}
					}

					// validate heights
					if ((key === 'width' || key === 'height') && nodeName === 'rect' && value < 0) {
						value = 0;
					}

					// Record for animation and quick access without polling the DOM
					wrapper[key] = value;
					
					// Update transform
					if (doTransform) {
						wrapper.updateTransform();
					}


					if (key === 'text') {
						// Delete bBox memo when the text changes
						if (value !== wrapper.textStr) {
							delete wrapper.bBox;
						}
						wrapper.textStr = value;
						if (wrapper.added) {
							renderer.buildText(wrapper);
						}
					} else if (!skipAttr) {
						attr(element, key, value);
					}

				}

			}

		}
		
		return ret;
	},

	/**
	 * If one of the symbol size affecting parameters are changed,
	 * check all the others only once for each call to an element's
	 * .attr() method
	 * @param {Object} hash
	 */
	symbolAttr: function (hash) {
		var wrapper = this;

		each(['x', 'y', 'r', 'start', 'end', 'width', 'height', 'innerR', 'anchorX', 'anchorY'], function (key) {
			wrapper[key] = pick(hash[key], wrapper[key]);
		});

		wrapper.attr({
			d: wrapper.renderer.symbols[wrapper.symbolName](wrapper.x, wrapper.y, wrapper.width, wrapper.height, wrapper)
		});
	},

	/**
	 * Apply a clipping path to this object
	 * @param {String} id
	 */
	clip: function (clipRect) {
		return this.attr('clip-path', clipRect ? 'url(' + this.renderer.url + '#' + clipRect.id + ')' : NONE);
	},

	/**
	 * Calculate the coordinates needed for drawing a rectangle crisply and return the
	 * calculated attributes
	 * @param {Number} strokeWidth
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	crisp: function (strokeWidth, x, y, width, height) {

		var wrapper = this,
			key,
			attribs = {},
			values = {},
			normalizer;

		strokeWidth = strokeWidth || wrapper.strokeWidth || (wrapper.attr && wrapper.attr('stroke-width')) || 0;
		normalizer = mathRound(strokeWidth) % 2 / 2; // mathRound because strokeWidth can sometimes have roundoff errors

		// normalize for crisp edges
		values.x = mathFloor(x || wrapper.x || 0) + normalizer;
		values.y = mathFloor(y || wrapper.y || 0) + normalizer;
		values.width = mathFloor((width || wrapper.width || 0) - 2 * normalizer);
		values.height = mathFloor((height || wrapper.height || 0) - 2 * normalizer);
		values.strokeWidth = strokeWidth;

		for (key in values) {
			if (wrapper[key] !== values[key]) { // only set attribute if changed
				wrapper[key] = attribs[key] = values[key];
			}
		}

		return attribs;
	},

	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: function (styles) {
		/*jslint unparam: true*//* allow unused param a in the regexp function below */
		var elemWrapper = this,
			elem = elemWrapper.element,
			textWidth = styles && styles.width && elem.nodeName.toLowerCase() === 'text',
			n,
			serializedCss = '',
			hyphenate = function (a, b) { return '-' + b.toLowerCase(); };
		/*jslint unparam: false*/

		// convert legacy
		if (styles && styles.color) {
			styles.fill = styles.color;
		}

		// Merge the new styles with the old ones
		styles = extend(
			elemWrapper.styles,
			styles
		);

		// store object
		elemWrapper.styles = styles;
		
		
		// Don't handle line wrap on canvas
		if (useCanVG && textWidth) {
			delete styles.width;
		}
			
		// serialize and set style attribute
		if (isIE && !hasSVG) { // legacy IE doesn't support setting style attribute
			if (textWidth) {
				delete styles.width;
			}
			css(elemWrapper.element, styles);
		} else {
			for (n in styles) {
				serializedCss += n.replace(/([A-Z])/g, hyphenate) + ':' + styles[n] + ';';
			}
			elemWrapper.attr({
				style: serializedCss
			});
		}


		// re-build text
		if (textWidth && elemWrapper.added) {
			elemWrapper.renderer.buildText(elemWrapper);
		}

		return elemWrapper;
	},

	/**
	 * Add an event listener
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function (eventType, handler) {
		var fn = handler;
		// touch
		if (hasTouch && eventType === 'click') {
			eventType = 'touchstart';
			fn = function (e) {
				e.preventDefault();
				handler();
			};
		}
		// simplest possible event model for internal use
		this.element['on' + eventType] = fn;
		return this;
	},
	
	/**
	 * Set the coordinates needed to draw a consistent radial gradient across
	 * pie slices regardless of positioning inside the chart. The format is
	 * [centerX, centerY, diameter] in pixels.
	 */
	setRadialReference: function (coordinates) {
		this.element.radialReference = coordinates;
		return this;
	},

	/**
	 * Move an object and its children by x and y values
	 * @param {Number} x
	 * @param {Number} y
	 */
	translate: function (x, y) {
		return this.attr({
			translateX: x,
			translateY: y
		});
	},

	/**
	 * Invert a group, rotate and flip
	 */
	invert: function () {
		var wrapper = this;
		wrapper.inverted = true;
		wrapper.updateTransform();
		return wrapper;
	},

	/**
	 * Apply CSS to HTML elements. This is used in text within SVG rendering and
	 * by the VML renderer
	 */
	htmlCss: function (styles) {
		var wrapper = this,
			element = wrapper.element,
			textWidth = styles && element.tagName === 'SPAN' && styles.width;

		if (textWidth) {
			delete styles.width;
			wrapper.textWidth = textWidth;
			wrapper.updateTransform();
		}

		wrapper.styles = extend(wrapper.styles, styles);
		css(wrapper.element, styles);

		return wrapper;
	},



	/**
	 * VML and useHTML method for calculating the bounding box based on offsets
	 * @param {Boolean} refresh Whether to force a fresh value from the DOM or to
	 * use the cached value
	 *
	 * @return {Object} A hash containing values for x, y, width and height
	 */

	htmlGetBBox: function () {
		var wrapper = this,
			element = wrapper.element,
			bBox = wrapper.bBox;

		// faking getBBox in exported SVG in legacy IE
		if (!bBox) {
			// faking getBBox in exported SVG in legacy IE (is this a duplicate of the fix for #1079?)
			if (element.nodeName === 'text') {
				element.style.position = ABSOLUTE;
			}

			bBox = wrapper.bBox = {
				x: element.offsetLeft,
				y: element.offsetTop,
				width: element.offsetWidth,
				height: element.offsetHeight
			};
		}

		return bBox;
	},

	/**
	 * VML override private method to update elements based on internal
	 * properties based on SVG transform
	 */
	htmlUpdateTransform: function () {
		// aligning non added elements is expensive
		if (!this.added) {
			this.alignOnAdd = true;
			return;
		}

		var wrapper = this,
			renderer = wrapper.renderer,
			elem = wrapper.element,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			x = wrapper.x || 0,
			y = wrapper.y || 0,
			align = wrapper.textAlign || 'left',
			alignCorrection = { left: 0, center: 0.5, right: 1 }[align],
			nonLeft = align && align !== 'left',
			shadows = wrapper.shadows;

		// apply translate
		if (translateX || translateY) {
			css(elem, {
				marginLeft: translateX,
				marginTop: translateY
			});
			if (shadows) { // used in labels/tooltip
				each(shadows, function (shadow) {
					css(shadow, {
						marginLeft: translateX + 1,
						marginTop: translateY + 1
					});
				});
			}
		}

		// apply inversion
		if (wrapper.inverted) { // wrapper is a group
			each(elem.childNodes, function (child) {
				renderer.invertChild(child, elem);
			});
		}

		if (elem.tagName === 'SPAN') {

			var width, height,
				rotation = wrapper.rotation,
				baseline,
				radians = 0,
				costheta = 1,
				sintheta = 0,
				quad,
				textWidth = pInt(wrapper.textWidth),
				xCorr = wrapper.xCorr || 0,
				yCorr = wrapper.yCorr || 0,
				currentTextTransform = [rotation, align, elem.innerHTML, wrapper.textWidth].join(','),
				rotationStyle = {},
				cssTransformKey;

			if (currentTextTransform !== wrapper.cTT) { // do the calculations and DOM access only if properties changed

				if (defined(rotation)) {
					
					if (renderer.isSVG) { // #916
						cssTransformKey = isIE ? '-ms-transform' : isWebKit ? '-webkit-transform' : isFirefox ? 'MozTransform' : isOpera ? '-o-transform' : '';
						rotationStyle[cssTransformKey] = rotationStyle.transform = 'rotate(' + rotation + 'deg)';
						
					} else {
						radians = rotation * deg2rad; // deg to rad
						costheta = mathCos(radians);
						sintheta = mathSin(radians);
	
						// Adjust for alignment and rotation. Rotation of useHTML content is not yet implemented
						// but it can probably be implemented for Firefox 3.5+ on user request. FF3.5+
						// has support for CSS3 transform. The getBBox method also needs to be updated
						// to compensate for the rotation, like it currently does for SVG.
						// Test case: http://highcharts.com/tests/?file=text-rotation
						rotationStyle.filter = rotation ? ['progid:DXImageTransform.Microsoft.Matrix(M11=', costheta,
								', M12=', -sintheta, ', M21=', sintheta, ', M22=', costheta,
								', sizingMethod=\'auto expand\')'].join('') : NONE;
					}
					css(elem, rotationStyle);
				}

				width = pick(wrapper.elemWidth, elem.offsetWidth);
				height = pick(wrapper.elemHeight, elem.offsetHeight);

				// update textWidth
				if (width > textWidth && /[ \-]/.test(elem.innerText)) { // #983
					css(elem, {
						width: textWidth + PX,
						display: 'block',
						whiteSpace: 'normal'
					});
					width = textWidth;
				}

				// correct x and y
				baseline = renderer.fontMetrics(elem.style.fontSize).b;
				xCorr = costheta < 0 && -width;
				yCorr = sintheta < 0 && -height;

				// correct for baseline and corners spilling out after rotation
				quad = costheta * sintheta < 0;
				xCorr += sintheta * baseline * (quad ? 1 - alignCorrection : alignCorrection);
				yCorr -= costheta * baseline * (rotation ? (quad ? alignCorrection : 1 - alignCorrection) : 1);

				// correct for the length/height of the text
				if (nonLeft) {
					xCorr -= width * alignCorrection * (costheta < 0 ? -1 : 1);
					if (rotation) {
						yCorr -= height * alignCorrection * (sintheta < 0 ? -1 : 1);
					}
					css(elem, {
						textAlign: align
					});
				}

				// record correction
				wrapper.xCorr = xCorr;
				wrapper.yCorr = yCorr;
			}

			// apply position with correction
			css(elem, {
				left: (x + xCorr) + PX,
				top: (y + yCorr) + PX
			});

			// record current text transform
			wrapper.cTT = currentTextTransform;
		}
	},

	/**
	 * Private method to update the transform attribute based on internal
	 * properties
	 */
	updateTransform: function () {
		var wrapper = this,
			translateX = wrapper.translateX || 0,
			translateY = wrapper.translateY || 0,
			inverted = wrapper.inverted,
			rotation = wrapper.rotation,
			transform = [];

		// flipping affects translate as adjustment for flipping around the group's axis
		if (inverted) {
			translateX += wrapper.attr('width');
			translateY += wrapper.attr('height');
		}

		// apply translate
		if (translateX || translateY) {
			transform.push('translate(' + translateX + ',' + translateY + ')');
		}

		// apply rotation
		if (inverted) {
			transform.push('rotate(90) scale(-1,1)');
		} else if (rotation) { // text rotation
			transform.push('rotate(' + rotation + ' ' + (wrapper.x || 0) + ' ' + (wrapper.y || 0) + ')');
		}

		if (transform.length) {
			attr(wrapper.element, 'transform', transform.join(' '));
		}
	},
	/**
	 * Bring the element to the front
	 */
	toFront: function () {
		var element = this.element;
		element.parentNode.appendChild(element);
		return this;
	},


	/**
	 * Break down alignment options like align, verticalAlign, x and y
	 * to x and y relative to the chart.
	 *
	 * @param {Object} alignOptions
	 * @param {Boolean} alignByTranslate
	 * @param {Object} box The box to align to, needs a width and height
	 *
	 */
	align: function (alignOptions, alignByTranslate, box) {
		var elemWrapper = this;

		if (!alignOptions) { // called on resize
			alignOptions = elemWrapper.alignOptions;
			alignByTranslate = elemWrapper.alignByTranslate;
		} else { // first call on instanciate
			elemWrapper.alignOptions = alignOptions;
			elemWrapper.alignByTranslate = alignByTranslate;
			if (!box) { // boxes other than renderer handle this internally
				elemWrapper.renderer.alignedObjects.push(elemWrapper);
			}
		}

		box = pick(box, elemWrapper.renderer);

		var align = alignOptions.align,
			vAlign = alignOptions.verticalAlign,
			x = (box.x || 0) + (alignOptions.x || 0), // default: left align
			y = (box.y || 0) + (alignOptions.y || 0), // default: top align
			attribs = {};


		// align
		if (align === 'right' || align === 'center') {
			x += (box.width - (alignOptions.width || 0)) /
					{ right: 1, center: 2 }[align];
		}
		attribs[alignByTranslate ? 'translateX' : 'x'] = mathRound(x);


		// vertical align
		if (vAlign === 'bottom' || vAlign === 'middle') {
			y += (box.height - (alignOptions.height || 0)) /
					({ bottom: 1, middle: 2 }[vAlign] || 1);

		}
		attribs[alignByTranslate ? 'translateY' : 'y'] = mathRound(y);

		// animate only if already placed
		elemWrapper[elemWrapper.placed ? 'animate' : 'attr'](attribs);
		elemWrapper.placed = true;
		elemWrapper.alignAttr = attribs;

		return elemWrapper;
	},

	/**
	 * Get the bounding box (width, height, x and y) for the element
	 */
	getBBox: function () {
		var wrapper = this,
			bBox = wrapper.bBox,
			renderer = wrapper.renderer,
			width,
			height,
			rotation = wrapper.rotation,
			element = wrapper.element,
			styles = wrapper.styles,
			rad = rotation * deg2rad;

		if (!bBox) {
			// SVG elements
			if (element.namespaceURI === SVG_NS || renderer.forExport) {
				try { // Fails in Firefox if the container has display: none.
					
					bBox = element.getBBox ?
						// SVG: use extend because IE9 is not allowed to change width and height in case
						// of rotation (below)
						extend({}, element.getBBox()) :
						// Canvas renderer and legacy IE in export mode
						{
							width: element.offsetWidth,
							height: element.offsetHeight
						};
				} catch (e) {}
				
				// If the bBox is not set, the try-catch block above failed. The other condition
				// is for Opera that returns a width of -Infinity on hidden elements.
				if (!bBox || bBox.width < 0) {
					bBox = { width: 0, height: 0 };
				}
				
	
			// VML Renderer or useHTML within SVG
			} else {
				
				bBox = wrapper.htmlGetBBox();
				
			}
			
			// True SVG elements as well as HTML elements in modern browsers using the .useHTML option
			// need to compensated for rotation
			if (renderer.isSVG) {
				width = bBox.width;
				height = bBox.height;
	
				// Adjust for rotated text
				if (rotation) {
					bBox.width = mathAbs(height * mathSin(rad)) + mathAbs(width * mathCos(rad));
					bBox.height = mathAbs(height * mathCos(rad)) + mathAbs(width * mathSin(rad));
				}
			}
			
			// Workaround for wrong bounding box in IE9 and IE10 (#1101)
			if (isIE && styles && styles.fontSize === '11px' && height === 22.700000762939453) {
				bBox.height = 14;
			}
			
			wrapper.bBox = bBox;
		}
		return bBox;
	},

	/**
	 * Show the element
	 */
	show: function () {
		return this.attr({ visibility: VISIBLE });
	},

	/**
	 * Hide the element
	 */
	hide: function () {
		return this.attr({ visibility: HIDDEN });
	},
	
	/**
	 * Add the element
	 * @param {Object|Undefined} parent Can be an element, an element wrapper or undefined
	 *    to append the element to the renderer.box.
	 */
	add: function (parent) {

		var renderer = this.renderer,
			parentWrapper = parent || renderer,
			parentNode = parentWrapper.element || renderer.box,
			childNodes = parentNode.childNodes,
			element = this.element,
			zIndex = attr(element, 'zIndex'),
			otherElement,
			otherZIndex,
			i,
			inserted;
			
		if (parent) {
			this.parentGroup = parent;
		}

		// mark as inverted
		this.parentInverted = parent && parent.inverted;

		// build formatted text
		if (this.textStr !== undefined) {
			renderer.buildText(this);
		}

		// mark the container as having z indexed children
		if (zIndex) {
			parentWrapper.handleZ = true;
			zIndex = pInt(zIndex);
		}

		// insert according to this and other elements' zIndex
		if (parentWrapper.handleZ) { // this element or any of its siblings has a z index
			for (i = 0; i < childNodes.length; i++) {
				otherElement = childNodes[i];
				otherZIndex = attr(otherElement, 'zIndex');
				if (otherElement !== element && (
						// insert before the first element with a higher zIndex
						pInt(otherZIndex) > zIndex ||
						// if no zIndex given, insert before the first element with a zIndex
						(!defined(zIndex) && defined(otherZIndex))

						)) {
					parentNode.insertBefore(element, otherElement);
					inserted = true;
					break;
				}
			}
		}

		// default: append at the end
		if (!inserted) {
			parentNode.appendChild(element);
		}

		// mark as added
		this.added = true;

		// fire an event for internal hooks
		fireEvent(this, 'add');

		return this;
	},

	/**
	 * Removes a child either by removeChild or move to garbageBin.
	 * Issue 490; in VML removeChild results in Orphaned nodes according to sIEve, discardElement does not.
	 */
	safeRemoveChild: function (element) {
		var parentNode = element.parentNode;
		if (parentNode) {
			parentNode.removeChild(element);
		}
	},

	/**
	 * Destroy the element and element wrapper
	 */
	destroy: function () {
		var wrapper = this,
			element = wrapper.element || {},
			shadows = wrapper.shadows,
			key,
			i;

		// remove events
		element.onclick = element.onmouseout = element.onmouseover = element.onmousemove = null;
		stop(wrapper); // stop running animations

		if (wrapper.clipPath) {
			wrapper.clipPath = wrapper.clipPath.destroy();
		}

		// Destroy stops in case this is a gradient object
		if (wrapper.stops) {
			for (i = 0; i < wrapper.stops.length; i++) {
				wrapper.stops[i] = wrapper.stops[i].destroy();
			}
			wrapper.stops = null;
		}

		// remove element
		wrapper.safeRemoveChild(element);

		// destroy shadows
		if (shadows) {
			each(shadows, function (shadow) {
				wrapper.safeRemoveChild(shadow);
			});
		}

		// remove from alignObjects
		erase(wrapper.renderer.alignedObjects, wrapper);

		for (key in wrapper) {
			delete wrapper[key];
		}

		return null;
	},

	/**
	 * Empty a group element
	 */
	empty: function () {
		var element = this.element,
			childNodes = element.childNodes,
			i = childNodes.length;

		while (i--) {
			element.removeChild(childNodes[i]);
		}
	},

	/**
	 * Add a shadow to the element. Must be done after the element is added to the DOM
	 * @param {Boolean|Object} shadowOptions
	 */
	shadow: function (shadowOptions, group, cutOff) {
		var shadows = [],
			i,
			shadow,
			element = this.element,
			strokeWidth,
			shadowWidth,
			shadowElementOpacity,

			// compensate for inverted plot area
			transform;


		if (shadowOptions) {
			shadowWidth = pick(shadowOptions.width, 3);
			shadowElementOpacity = (shadowOptions.opacity || 0.15) / shadowWidth;
			transform = this.parentInverted ? 
				'(-1,-1)' : 
				'(' + pick(shadowOptions.offsetX, 1) + ', ' + pick(shadowOptions.offsetY, 1) + ')';
			for (i = 1; i <= shadowWidth; i++) {
				shadow = element.cloneNode(0);
				strokeWidth = (shadowWidth * 2) + 1 - (2 * i);
				attr(shadow, {
					'isShadow': 'true',
					'stroke': shadowOptions.color || 'black',
					'stroke-opacity': shadowElementOpacity * i,
					'stroke-width': strokeWidth,
					'transform': 'translate' + transform,
					'fill': NONE
				});
				if (cutOff) {
					attr(shadow, 'height', mathMax(attr(shadow, 'height') - strokeWidth, 0));
					shadow.cutHeight = strokeWidth;
				}

				if (group) {
					group.element.appendChild(shadow);
				} else {
					element.parentNode.insertBefore(shadow, element);
				}

				shadows.push(shadow);
			}

			this.shadows = shadows;
		}
		return this;

	}
};


/**
 * The default SVG renderer
 */
var SVGRenderer = function () {
	this.init.apply(this, arguments);
};
SVGRenderer.prototype = {
	Element: SVGElement,

	/**
	 * Initialize the SVGRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Boolean} forExport
	 */
	init: function (container, width, height, forExport) {
		var renderer = this,
			loc = location,
			boxWrapper;

		boxWrapper = renderer.createElement('svg')
			.attr({
				xmlns: SVG_NS,
				version: '1.1'
			});
		container.appendChild(boxWrapper.element);

		// object properties
		renderer.isSVG = true;
		renderer.box = boxWrapper.element;
		renderer.boxWrapper = boxWrapper;
		renderer.alignedObjects = [];
		
		// Page url used for internal references. #24, #672, #1070
		renderer.url = (isFirefox || isWebKit) && doc.getElementsByTagName('base').length ? 
			loc.href
				.replace(/#.*?$/, '') // remove the hash
				.replace(/([\('\)])/g, '\\$1') // escape parantheses and quotes
				.replace(/ /g, '%20') : // replace spaces (needed for Safari only)
			''; 
			
		renderer.defs = this.createElement('defs').add();
		renderer.forExport = forExport;
		renderer.gradients = {}; // Object where gradient SvgElements are stored

		renderer.setSize(width, height, false);



		// Issue 110 workaround:
		// In Firefox, if a div is positioned by percentage, its pixel position may land
		// between pixels. The container itself doesn't display this, but an SVG element
		// inside this container will be drawn at subpixel precision. In order to draw
		// sharp lines, this must be compensated for. This doesn't seem to work inside
		// iframes though (like in jsFiddle).
		var subPixelFix, rect;
		if (isFirefox && container.getBoundingClientRect) {
			renderer.subPixelFix = subPixelFix = function () {
				css(container, { left: 0, top: 0 });
				rect = container.getBoundingClientRect();
				css(container, {
					left: (mathCeil(rect.left) - rect.left) + PX,
					top: (mathCeil(rect.top) - rect.top) + PX
				});
			};

			// run the fix now
			subPixelFix();

			// run it on resize
			addEvent(win, 'resize', subPixelFix);
		}
	},

	/**
	 * Detect whether the renderer is hidden. This happens when one of the parent elements
	 * has display: none. #608.
	 */
	isHidden: function () {
		return !this.boxWrapper.getBBox().width;			
	},

	/**
	 * Destroys the renderer and its allocated members.
	 */
	destroy: function () {
		var renderer = this,
			rendererDefs = renderer.defs;
		renderer.box = null;
		renderer.boxWrapper = renderer.boxWrapper.destroy();

		// Call destroy on all gradient elements
		destroyObjectProperties(renderer.gradients || {});
		renderer.gradients = null;

		// Defs are null in VMLRenderer
		// Otherwise, destroy them here.
		if (rendererDefs) {
			renderer.defs = rendererDefs.destroy();
		}

		// Remove sub pixel fix handler
		// We need to check that there is a handler, otherwise all functions that are registered for event 'resize' are removed
		// See issue #982
		if (renderer.subPixelFix) {
			removeEvent(win, 'resize', renderer.subPixelFix);
		}

		renderer.alignedObjects = null;

		return null;
	},

	/**
	 * Create a wrapper for an SVG element
	 * @param {Object} nodeName
	 */
	createElement: function (nodeName) {
		var wrapper = new this.Element();
		wrapper.init(this, nodeName);
		return wrapper;
	},

	/**
	 * Dummy function for use in canvas renderer
	 */
	draw: function () {},

	/**
	 * Parse a simple HTML string into SVG tspans
	 *
	 * @param {Object} textNode The parent text SVG node
	 */
	buildText: function (wrapper) {
		var textNode = wrapper.element,
			lines = pick(wrapper.textStr, '').toString()
				.replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
				.replace(/<(i|em)>/g, '<span style="font-style:italic">')
				.replace(/<a/g, '<span')
				.replace(/<\/(b|strong|i|em|a)>/g, '</span>')
				.split(/<br.*?>/g),
			childNodes = textNode.childNodes,
			styleRegex = /style="([^"]+)"/,
			hrefRegex = /href="([^"]+)"/,
			parentX = attr(textNode, 'x'),
			textStyles = wrapper.styles,
			width = textStyles && textStyles.width && pInt(textStyles.width),
			textLineHeight = textStyles && textStyles.lineHeight,
			lastLine,
			GET_COMPUTED_STYLE = 'getComputedStyle',
			i = childNodes.length,
			linePositions = [];
		
		// Needed in IE9 because it doesn't report tspan's offsetHeight (#893)
		function getLineHeightByBBox(lineNo) {
			linePositions[lineNo] = textNode.getBBox ?
				textNode.getBBox().height :
				wrapper.renderer.fontMetrics(textNode.style.fontSize).h; // #990
			return mathRound(linePositions[lineNo] - (linePositions[lineNo - 1] || 0));
		}

		// remove old text
		while (i--) {
			textNode.removeChild(childNodes[i]);
		}

		if (width && !wrapper.added) {
			this.box.appendChild(textNode); // attach it to the DOM to read offset width
		}

		// remove empty line at end
		if (lines[lines.length - 1] === '') {
			lines.pop();
		}

		// build the lines
		each(lines, function (line, lineNo) {
			var spans, spanNo = 0, lineHeight;

			line = line.replace(/<span/g, '|||<span').replace(/<\/span>/g, '</span>|||');
			spans = line.split('|||');

			each(spans, function (span) {
				if (span !== '' || spans.length === 1) {
					var attributes = {},
						tspan = doc.createElementNS(SVG_NS, 'tspan'),
						spanStyle; // #390
					if (styleRegex.test(span)) {
						spanStyle = span.match(styleRegex)[1].replace(/(;| |^)color([ :])/, '$1fill$2');
						attr(tspan, 'style', spanStyle);
					}
					if (hrefRegex.test(span)) {
						attr(tspan, 'onclick', 'location.href=\"' + span.match(hrefRegex)[1] + '\"');
						css(tspan, { cursor: 'pointer' });
					}

					span = (span.replace(/<(.|\n)*?>/g, '') || ' ')
						.replace(/&lt;/g, '<')
						.replace(/&gt;/g, '>');

					// issue #38 workaround.
					/*if (reverse) {
						arr = [];
						i = span.length;
						while (i--) {
							arr.push(span.charAt(i));
						}
						span = arr.join('');
					}*/

					// add the text node
					tspan.appendChild(doc.createTextNode(span));

					if (!spanNo) { // first span in a line, align it to the left
						attributes.x = parentX;
					} else {
						// Firefox ignores spaces at the front or end of the tspan
						attributes.dx = 3; // space
					}

					// first span on subsequent line, add the line height
					if (!spanNo) {
						if (lineNo) {

							// allow getting the right offset height in exporting in IE
							if (!hasSVG && wrapper.renderer.forExport) {
								css(tspan, { display: 'block' });
							}

							// Webkit and opera sometimes return 'normal' as the line height. In that
							// case, webkit uses offsetHeight, while Opera falls back to 18
							lineHeight = win[GET_COMPUTED_STYLE] &&
								pInt(win[GET_COMPUTED_STYLE](lastLine, null).getPropertyValue('line-height'));

							if (!lineHeight || isNaN(lineHeight)) {
								lineHeight = textLineHeight || lastLine.offsetHeight || getLineHeightByBBox(lineNo) || 18;
							}
							attr(tspan, 'dy', lineHeight);
						}
						lastLine = tspan; // record for use in next line
					}

					// add attributes
					attr(tspan, attributes);

					// append it
					textNode.appendChild(tspan);

					spanNo++;

					// check width and apply soft breaks
					if (width) {
						var words = span.replace(/([^\^])-/g, '$1- ').split(' '), // #1273
							tooLong,
							actualWidth,
							rest = [];

						while (words.length || rest.length) {
							delete wrapper.bBox; // delete cache
							actualWidth = wrapper.getBBox().width;
							tooLong = actualWidth > width;
							if (!tooLong || words.length === 1) { // new line needed
								words = rest;
								rest = [];
								if (words.length) {
									tspan = doc.createElementNS(SVG_NS, 'tspan');
									attr(tspan, {
										dy: textLineHeight || 16,
										x: parentX
									});
									if (spanStyle) { // #390
										attr(tspan, 'style', spanStyle);
									}
									textNode.appendChild(tspan);

									if (actualWidth > width) { // a single word is pressing it out
										width = actualWidth;
									}
								}
							} else { // append to existing line tspan
								tspan.removeChild(tspan.firstChild);
								rest.unshift(words.pop());
							}
							if (words.length) {
								tspan.appendChild(doc.createTextNode(words.join(' ').replace(/- /g, '-')));
							}
						}
					}
				}
			});
		});
	},

	/**
	 * Create a button with preset states
	 * @param {String} text
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Function} callback
	 * @param {Object} normalState
	 * @param {Object} hoverState
	 * @param {Object} pressedState
	 */
	button: function (text, x, y, callback, normalState, hoverState, pressedState) {
		var label = this.label(text, x, y),
			curState = 0,
			stateOptions,
			stateStyle,
			normalStyle,
			hoverStyle,
			pressedStyle,
			STYLE = 'style',
			verticalGradient = { x1: 0, y1: 0, x2: 0, y2: 1 };

		// prepare the attributes
		/*jslint white: true*/
		normalState = merge(hash(
			STROKE_WIDTH, 1,
			STROKE, '#999',
			FILL, hash(
				LINEAR_GRADIENT, verticalGradient,
				STOPS, [
					[0, '#FFF'],
					[1, '#DDD']
				]
			),
			'r', 3,
			'padding', 3,
			STYLE, hash(
				'color', 'black'
			)
		), normalState);
		/*jslint white: false*/
		normalStyle = normalState[STYLE];
		delete normalState[STYLE];

		/*jslint white: true*/
		hoverState = merge(normalState, hash(
			STROKE, '#68A',
			FILL, hash(
				LINEAR_GRADIENT, verticalGradient,
				STOPS, [
					[0, '#FFF'],
					[1, '#ACF']
				]
			)
		), hoverState);
		/*jslint white: false*/
		hoverStyle = hoverState[STYLE];
		delete hoverState[STYLE];

		/*jslint white: true*/
		pressedState = merge(normalState, hash(
			STROKE, '#68A',
			FILL, hash(
				LINEAR_GRADIENT, verticalGradient,
				STOPS, [
					[0, '#9BD'],
					[1, '#CDF']
				]
			)
		), pressedState);
		/*jslint white: false*/
		pressedStyle = pressedState[STYLE];
		delete pressedState[STYLE];

		// add the events
		addEvent(label.element, 'mouseenter', function () {
			label.attr(hoverState)
				.css(hoverStyle);
		});
		addEvent(label.element, 'mouseleave', function () {
			stateOptions = [normalState, hoverState, pressedState][curState];
			stateStyle = [normalStyle, hoverStyle, pressedStyle][curState];
			label.attr(stateOptions)
				.css(stateStyle);
		});

		label.setState = function (state) {
			curState = state;
			if (!state) {
				label.attr(normalState)
					.css(normalStyle);
			} else if (state === 2) {
				label.attr(pressedState)
					.css(pressedStyle);
			}
		};

		return label
			.on('click', function () {
				callback.call(label);
			})
			.attr(normalState)
			.css(extend({ cursor: 'default' }, normalStyle));
	},

	/**
	 * Make a straight line crisper by not spilling out to neighbour pixels
	 * @param {Array} points
	 * @param {Number} width
	 */
	crispLine: function (points, width) {
		// points format: [M, 0, 0, L, 100, 0]
		// normalize to a crisp line
		if (points[1] === points[4]) {
			// Substract due to #1129. Now bottom and left axis gridlines behave the same.
			points[1] = points[4] = mathRound(points[1]) - (width % 2 / 2); 
		}
		if (points[2] === points[5]) {
			points[2] = points[5] = mathRound(points[2]) + (width % 2 / 2);
		}
		return points;
	},


	/**
	 * Draw a path
	 * @param {Array} path An SVG path in array form
	 */
	path: function (path) {
		var attr = {
			fill: NONE
		};
		if (isArray(path)) {
			attr.d = path;
		} else if (isObject(path)) { // attributes
			extend(attr, path);
		}
		return this.createElement('path').attr(attr);
	},

	/**
	 * Draw and return an SVG circle
	 * @param {Number} x The x position
	 * @param {Number} y The y position
	 * @param {Number} r The radius
	 */
	circle: function (x, y, r) {
		var attr = isObject(x) ?
			x :
			{
				x: x,
				y: y,
				r: r
			};

		return this.createElement('circle').attr(attr);
	},

	/**
	 * Draw and return an arc
	 * @param {Number} x X position
	 * @param {Number} y Y position
	 * @param {Number} r Radius
	 * @param {Number} innerR Inner radius like used in donut charts
	 * @param {Number} start Starting angle
	 * @param {Number} end Ending angle
	 */
	arc: function (x, y, r, innerR, start, end) {
		// arcs are defined as symbols for the ability to set
		// attributes in attr and animate

		if (isObject(x)) {
			y = x.y;
			r = x.r;
			innerR = x.innerR;
			start = x.start;
			end = x.end;
			x = x.x;
		}
		return this.symbol('arc', x || 0, y || 0, r || 0, r || 0, {
			innerR: innerR || 0,
			start: start || 0,
			end: end || 0
		});
	},
	
	/**
	 * Draw and return a rectangle
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Number} r Border corner radius
	 * @param {Number} strokeWidth A stroke width can be supplied to allow crisp drawing
	 */
	rect: function (x, y, width, height, r, strokeWidth) {
		
		r = isObject(x) ? x.r : r;
		
		var wrapper = this.createElement('rect').attr({
				rx: r,
				ry: r,
				fill: NONE
			});
		return wrapper.attr(
				isObject(x) ? 
					x : 
					// do not crispify when an object is passed in (as in column charts)
					wrapper.crisp(strokeWidth, x, y, mathMax(width, 0), mathMax(height, 0))
			);
	},

	/**
	 * Resize the box and re-align all aligned elements
	 * @param {Object} width
	 * @param {Object} height
	 * @param {Boolean} animate
	 *
	 */
	setSize: function (width, height, animate) {
		var renderer = this,
			alignedObjects = renderer.alignedObjects,
			i = alignedObjects.length;

		renderer.width = width;
		renderer.height = height;

		renderer.boxWrapper[pick(animate, true) ? 'animate' : 'attr']({
			width: width,
			height: height
		});

		while (i--) {
			alignedObjects[i].align();
		}
	},

	/**
	 * Create a group
	 * @param {String} name The group will be given a class name of 'highcharts-{name}'.
	 *     This can be used for styling and scripting.
	 */
	g: function (name) {
		var elem = this.createElement('g');
		return defined(name) ? elem.attr({ 'class': PREFIX + name }) : elem;
	},

	/**
	 * Display an image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function (src, x, y, width, height) {
		var attribs = {
				preserveAspectRatio: NONE
			},
			elemWrapper;

		// optional properties
		if (arguments.length > 1) {
			extend(attribs, {
				x: x,
				y: y,
				width: width,
				height: height
			});
		}

		elemWrapper = this.createElement('image').attr(attribs);

		// set the href in the xlink namespace
		if (elemWrapper.element.setAttributeNS) {
			elemWrapper.element.setAttributeNS('http://www.w3.org/1999/xlink',
				'href', src);
		} else {
			// could be exporting in IE
			// using href throws "not supported" in ie7 and under, requries regex shim to fix later
			elemWrapper.element.setAttribute('hc-svg-href', src);
	}

		return elemWrapper;
	},

	/**
	 * Draw a symbol out of pre-defined shape paths from the namespace 'symbol' object.
	 *
	 * @param {Object} symbol
	 * @param {Object} x
	 * @param {Object} y
	 * @param {Object} radius
	 * @param {Object} options
	 */
	symbol: function (symbol, x, y, width, height, options) {

		var obj,

			// get the symbol definition function
			symbolFn = this.symbols[symbol],

			// check if there's a path defined for this symbol
			path = symbolFn && symbolFn(
				mathRound(x),
				mathRound(y),
				width,
				height,
				options
			),

			imageRegex = /^url\((.*?)\)$/,
			imageSrc,
			imageSize,
			centerImage;

		if (path) {

			obj = this.path(path);
			// expando properties for use in animate and attr
			extend(obj, {
				symbolName: symbol,
				x: x,
				y: y,
				width: width,
				height: height
			});
			if (options) {
				extend(obj, options);
			}


		// image symbols
		} else if (imageRegex.test(symbol)) {

			// On image load, set the size and position
			centerImage = function (img, size) {
				img.attr({
					width: size[0],
					height: size[1]
				});

				if (!img.alignByTranslate) { // #185
					img.translate(
						-mathRound(size[0] / 2),
						-mathRound(size[1] / 2)
					);
				}
			};

			imageSrc = symbol.match(imageRegex)[1];
			imageSize = symbolSizes[imageSrc];

			// create the image synchronously, add attribs async
			obj = this.image(imageSrc)
				.attr({
					x: x,
					y: y
				});

			if (imageSize) {
				centerImage(obj, imageSize);
			} else {
				// initialize image to be 0 size so export will still function if there's no cached sizes
				obj.attr({ width: 0, height: 0 });

				// create a dummy JavaScript image to get the width and height
				createElement('img', {
					onload: function () {
						var img = this;

						centerImage(obj, symbolSizes[imageSrc] = [img.width, img.height]);
					},
					src: imageSrc
				});
			}
		}

		return obj;
	},

	/**
	 * An extendable collection of functions for defining symbol paths.
	 */
	symbols: {
		'circle': function (x, y, w, h) {
			var cpw = 0.166 * w;
			return [
				M, x + w / 2, y,
				'C', x + w + cpw, y, x + w + cpw, y + h, x + w / 2, y + h,
				'C', x - cpw, y + h, x - cpw, y, x + w / 2, y,
				'Z'
			];
		},

		'square': function (x, y, w, h) {
			return [
				M, x, y,
				L, x + w, y,
				x + w, y + h,
				x, y + h,
				'Z'
			];
		},

		'triangle': function (x, y, w, h) {
			return [
				M, x + w / 2, y,
				L, x + w, y + h,
				x, y + h,
				'Z'
			];
		},

		'triangle-down': function (x, y, w, h) {
			return [
				M, x, y,
				L, x + w, y,
				x + w / 2, y + h,
				'Z'
			];
		},
		'diamond': function (x, y, w, h) {
			return [
				M, x + w / 2, y,
				L, x + w, y + h / 2,
				x + w / 2, y + h,
				x, y + h / 2,
				'Z'
			];
		},
		'arc': function (x, y, w, h, options) {
			var start = options.start,
				radius = options.r || w || h,
				end = options.end - 0.000001, // to prevent cos and sin of start and end from becoming equal on 360 arcs
				innerRadius = options.innerR,
				open = options.open,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				longArc = options.end - start < mathPI ? 0 : 1;

			return [
				M,
				x + radius * cosStart,
				y + radius * sinStart,
				'A', // arcTo
				radius, // x radius
				radius, // y radius
				0, // slanting
				longArc, // long or short arc
				1, // clockwise
				x + radius * cosEnd,
				y + radius * sinEnd,
				open ? M : L,
				x + innerRadius * cosEnd,
				y + innerRadius * sinEnd,
				'A', // arcTo
				innerRadius, // x radius
				innerRadius, // y radius
				0, // slanting
				longArc, // long or short arc
				0, // clockwise
				x + innerRadius * cosStart,
				y + innerRadius * sinStart,

				open ? '' : 'Z' // close
			];
		}
	},

	/**
	 * Define a clipping rectangle
	 * @param {String} id
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {
		var wrapper,
			id = PREFIX + idCounter++,

			clipPath = this.createElement('clipPath').attr({
				id: id
			}).add(this.defs);

		wrapper = this.rect(x, y, width, height, 0).add(clipPath);
		wrapper.id = id;
		wrapper.clipPath = clipPath;

		return wrapper;
	},


	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object. Prior to Highstock, an array was used to define
	 * a linear gradient with pixel positions relative to the SVG. In newer versions
	 * we change the coordinates to apply relative to the shape, using coordinates
	 * 0-1 within the shape. To preserve backwards compatibility, linearGradient
	 * in this definition is an object of x1, y1, x2 and y2.
	 *
	 * @param {Object} color The color or config object
	 */
	color: function (color, elem, prop) {
		var renderer = this,
			colorObject,
			regexRgba = /^rgba/,
			gradName;
		
		// Apply linear or radial gradients
		if (color && color.linearGradient) {
			gradName = 'linearGradient';
		} else if (color && color.radialGradient) {
			gradName = 'radialGradient';
		}
		
		if (gradName) {
			var gradAttr = color[gradName],
				gradients = renderer.gradients,
				gradientObject,
				stopColor,
				stopOpacity,
				radialReference = elem.radialReference;
			
			// Check if a gradient object with the same config object is created within this renderer
			if (!gradAttr.id || !gradients[gradAttr.id]) {
				
				// Keep < 2.2 kompatibility
				if (isArray(gradAttr)) {
					color[gradName] = gradAttr = {
						x1: gradAttr[0],
						y1: gradAttr[1],
						x2: gradAttr[2],
						y2: gradAttr[3],
						gradientUnits: 'userSpaceOnUse'
					};				
				}
				
				// Correct the radial gradient for the radial reference system
				if (gradName === 'radialGradient' && radialReference && !defined(gradAttr.gradientUnits)) {
					extend(gradAttr, {
						cx: (radialReference[0] - radialReference[2] / 2) + gradAttr.cx * radialReference[2],
						cy: (radialReference[1] - radialReference[2] / 2) + gradAttr.cy * radialReference[2],
						r: gradAttr.r * radialReference[2],
						gradientUnits: 'userSpaceOnUse'
					});
				}

				// Set the id and create the element
				gradAttr.id = PREFIX + idCounter++;
				gradients[gradAttr.id] = gradientObject = renderer.createElement(gradName)
					.attr(gradAttr)
					.add(renderer.defs);
				
				
				// The gradient needs to keep a list of stops to be able to destroy them
				gradientObject.stops = [];
				each(color.stops, function (stop) {
					var stopObject;
					if (regexRgba.test(stop[1])) {
						colorObject = Color(stop[1]);
						stopColor = colorObject.get('rgb');
						stopOpacity = colorObject.get('a');
					} else {
						stopColor = stop[1];
						stopOpacity = 1;
					}
					stopObject = renderer.createElement('stop').attr({
						offset: stop[0],
						'stop-color': stopColor,
						'stop-opacity': stopOpacity
					}).add(gradientObject);

					// Add the stop element to the gradient
					gradientObject.stops.push(stopObject);
				});
			}

			// Return the reference to the gradient object
			return 'url(' + renderer.url + '#' + gradAttr.id + ')';
			
		// Webkit and Batik can't show rgba.
		} else if (regexRgba.test(color)) {
			colorObject = Color(color);
			attr(elem, prop + '-opacity', colorObject.get('a'));

			return colorObject.get('rgb');


		} else {
			// Remove the opacity attribute added above. Does not throw if the attribute is not there.
			elem.removeAttribute(prop + '-opacity');

			return color;
		}

	},


	/**
	 * Add text to the SVG object
	 * @param {String} str
	 * @param {Number} x Left position
	 * @param {Number} y Top position
	 * @param {Boolean} useHTML Use HTML to render the text
	 */
	text: function (str, x, y, useHTML) {

		// declare variables
		var renderer = this,
			defaultChartStyle = defaultOptions.chart.style,
			fakeSVG = useCanVG || (!hasSVG && renderer.forExport),
			wrapper;

		if (useHTML && !renderer.forExport) {
			return renderer.html(str, x, y);
		}

		x = mathRound(pick(x, 0));
		y = mathRound(pick(y, 0));

		wrapper = renderer.createElement('text')
			.attr({
				x: x,
				y: y,
				text: str
			})
			.css({
				fontFamily: defaultChartStyle.fontFamily,
				fontSize: defaultChartStyle.fontSize
			});
		
		// Prevent wrapping from creating false offsetWidths in export in legacy IE (#1079, #1063)	
		if (fakeSVG) {
			wrapper.css({
				position: ABSOLUTE
			});
		}

		wrapper.x = x;
		wrapper.y = y;
		return wrapper;
	},


	/**
	 * Create HTML text node. This is used by the VML renderer as well as the SVG
	 * renderer through the useHTML option.
	 *
	 * @param {String} str
	 * @param {Number} x
	 * @param {Number} y
	 */
	html: function (str, x, y) {
		var defaultChartStyle = defaultOptions.chart.style,
			wrapper = this.createElement('span'),
			attrSetters = wrapper.attrSetters,
			element = wrapper.element,
			renderer = wrapper.renderer;

		// Text setter
		attrSetters.text = function (value) {
			if (value !== element.innerHTML) {
				delete this.bBox;
			}
			element.innerHTML = value;
			return false;
		};

		// Various setters which rely on update transform
		attrSetters.x = attrSetters.y = attrSetters.align = function (value, key) {
			if (key === 'align') {
				key = 'textAlign'; // Do not overwrite the SVGElement.align method. Same as VML.
			}
			wrapper[key] = value;
			wrapper.htmlUpdateTransform();
			return false;
		};

		// Set the default attributes
		wrapper.attr({
				text: str,
				x: mathRound(x),
				y: mathRound(y)
			})
			.css({
				position: ABSOLUTE,
				whiteSpace: 'nowrap',
				fontFamily: defaultChartStyle.fontFamily,
				fontSize: defaultChartStyle.fontSize
			});

		// Use the HTML specific .css method
		wrapper.css = wrapper.htmlCss;

		// This is specific for HTML within SVG
		if (renderer.isSVG) {
			wrapper.add = function (svgGroupWrapper) {

				var htmlGroup,
					container = renderer.box.parentNode,
					parentGroup,
					parents = [];

				// Create a mock group to hold the HTML elements
				if (svgGroupWrapper) {
					htmlGroup = svgGroupWrapper.div;
					if (!htmlGroup) {
						
						// Read the parent chain into an array and read from top down
						parentGroup = svgGroupWrapper;
						while (parentGroup) {
						
							parents.push(parentGroup);
						
							// Move up to the next parent group
							parentGroup = parentGroup.parentGroup;
						}
						
						// Ensure dynamically updating position when any parent is translated
						each(parents.reverse(), function (parentGroup) {
							var htmlGroupStyle;
								
							// Create a HTML div and append it to the parent div to emulate 
							// the SVG group structure
							htmlGroup = parentGroup.div = parentGroup.div || createElement(DIV, {
								className: attr(parentGroup.element, 'class')
							}, {
								position: ABSOLUTE,
								left: (parentGroup.translateX || 0) + PX,
								top: (parentGroup.translateY || 0) + PX
							}, htmlGroup || container); // the top group is appended to container
							
							// Shortcut
							htmlGroupStyle = htmlGroup.style;
							
							// Set listeners to update the HTML div's position whenever the SVG group
							// position is changed
							extend(parentGroup.attrSetters, {
								translateX: function (value) {
									htmlGroupStyle.left = value + PX;
								},
								translateY: function (value) {
									htmlGroupStyle.top = value + PX;
								},
								visibility: function (value, key) {
									htmlGroupStyle[key] = value;
								}
							});
						});

					}
				} else {
					htmlGroup = container;
				}

				htmlGroup.appendChild(element);

				// Shared with VML:
				wrapper.added = true;
				if (wrapper.alignOnAdd) {
					wrapper.htmlUpdateTransform();
				}

				return wrapper;
			};
		}
		return wrapper;
	},

	/**
	 * Utility to return the baseline offset and total line height from the font size
	 */
	fontMetrics: function (fontSize) {
		fontSize = pInt(fontSize || 11);
		
		// Empirical values found by comparing font size and bounding box height.
		// Applies to the default font family. http://jsfiddle.net/highcharts/7xvn7/
		var lineHeight = fontSize < 24 ? fontSize + 4 : mathRound(fontSize * 1.2),
			baseline = mathRound(lineHeight * 0.8);
		
		return {
			h: lineHeight, 
			b: baseline
		};
	},

	/**
	 * Add a label, a text item that can hold a colored or gradient background
	 * as well as a border and shadow.
	 * @param {string} str
	 * @param {Number} x
	 * @param {Number} y
	 * @param {String} shape
	 * @param {Number} anchorX In case the shape has a pointer, like a flag, this is the
	 *    coordinates it should be pinned to
	 * @param {Number} anchorY
	 * @param {Boolean} baseline Whether to position the label relative to the text baseline,
	 *    like renderer.text, or to the upper border of the rectangle. 
	 * @param {String} className Class name for the group 
	 */
	label: function (str, x, y, shape, anchorX, anchorY, useHTML, baseline, className) {

		var renderer = this,
			wrapper = renderer.g(className),
			text = renderer.text('', 0, 0, useHTML)
				.attr({
					zIndex: 1
				}),
				//.add(wrapper),
			box,
			bBox,
			alignFactor = 0,
			padding = 3,
			width,
			height,
			wrapperX,
			wrapperY,
			crispAdjust = 0,
			deferredAttr = {},
			baselineOffset,
			attrSetters = wrapper.attrSetters;

		/**
		 * This function runs after the label is added to the DOM (when the bounding box is
		 * available), and after the text of the label is updated to detect the new bounding
		 * box and reflect it in the border box.
		 */
		function updateBoxSize() {
			var boxY,
				style = text.element.style;
				
			bBox = (width === undefined || height === undefined || wrapper.styles.textAlign) &&
				text.getBBox();
			wrapper.width = (width || bBox.width || 0) + 2 * padding;
			wrapper.height = (height || bBox.height || 0) + 2 * padding;
			
			// update the label-scoped y offset
			baselineOffset = padding + renderer.fontMetrics(style && style.fontSize).b;
			
			
			// create the border box if it is not already present
			if (!box) {
				boxY = baseline ? -baselineOffset : 0;
			
				wrapper.box = box = shape ?
					renderer.symbol(shape, -alignFactor * padding, boxY, wrapper.width, wrapper.height) :
					renderer.rect(-alignFactor * padding, boxY, wrapper.width, wrapper.height, 0, deferredAttr[STROKE_WIDTH]);
				box.add(wrapper);
			}

			// apply the box attributes
			box.attr(merge({
				width: wrapper.width,
				height: wrapper.height
			}, deferredAttr));
			deferredAttr = null;
		}

		/**
		 * This function runs after setting text or padding, but only if padding is changed
		 */
		function updateTextPadding() {
			var styles = wrapper.styles,
				textAlign = styles && styles.textAlign,
				x = padding * (1 - alignFactor),
				y;
			
			// determin y based on the baseline
			y = baseline ? 0 : baselineOffset;

			// compensate for alignment
			if (defined(width) && (textAlign === 'center' || textAlign === 'right')) {
				x += { center: 0.5, right: 1 }[textAlign] * (width - bBox.width);
			}

			// update if anything changed
			if (x !== text.x || y !== text.y) {
				text.attr({
					x: x,
					y: y
				});
			}

			// record current values
			text.x = x;
			text.y = y;
		}

		/**
		 * Set a box attribute, or defer it if the box is not yet created
		 * @param {Object} key
		 * @param {Object} value
		 */
		function boxAttr(key, value) {
			if (box) {
				box.attr(key, value);
			} else {
				deferredAttr[key] = value;
			}
		}

		function getSizeAfterAdd() {
			text.add(wrapper);
			wrapper.attr({
				text: str, // alignment is available now
				x: x,
				y: y
			});
			
			if (defined(anchorX)) {
				wrapper.attr({
					anchorX: anchorX,
					anchorY: anchorY
				});
			}
		}

		/**
		 * After the text element is added, get the desired size of the border box
		 * and add it before the text in the DOM.
		 */
		addEvent(wrapper, 'add', getSizeAfterAdd);

		/*
		 * Add specific attribute setters.
		 */

		// only change local variables
		attrSetters.width = function (value) {
			width = value;
			return false;
		};
		attrSetters.height = function (value) {
			height = value;
			return false;
		};
		attrSetters.padding = function (value) {
			if (defined(value) && value !== padding) {
				padding = value;
				updateTextPadding();
			}

			return false;
		};

		// change local variable and set attribue as well
		attrSetters.align = function (value) {
			alignFactor = { left: 0, center: 0.5, right: 1 }[value];
			return false; // prevent setting text-anchor on the group
		};
		
		// apply these to the box and the text alike
		attrSetters.text = function (value, key) {
			text.attr(key, value);
			updateBoxSize();
			updateTextPadding();
			return false;
		};

		// apply these to the box but not to the text
		attrSetters[STROKE_WIDTH] = function (value, key) {
			crispAdjust = value % 2 / 2;
			boxAttr(key, value);
			return false;
		};
		attrSetters.stroke = attrSetters.fill = attrSetters.r = function (value, key) {
			boxAttr(key, value);
			return false;
		};
		attrSetters.anchorX = function (value, key) {
			anchorX = value;
			boxAttr(key, value + crispAdjust - wrapperX);
			return false;
		};
		attrSetters.anchorY = function (value, key) {
			anchorY = value;
			boxAttr(key, value - wrapperY);
			return false;
		};
		
		// rename attributes
		attrSetters.x = function (value) {
			wrapper.x = value; // for animation getter
			value -= alignFactor * ((width || bBox.width) + padding);
			wrapperX = mathRound(value); 
			
			wrapper.attr('translateX', wrapperX);
			return false;
		};
		attrSetters.y = function (value) {
			wrapperY = wrapper.y = mathRound(value);
			wrapper.attr('translateY', value);
			return false;
		};

		// Redirect certain methods to either the box or the text
		var baseCss = wrapper.css;
		return extend(wrapper, {
			/**
			 * Pick up some properties and apply them to the text instead of the wrapper
			 */
			css: function (styles) {
				if (styles) {
					var textStyles = {};
					styles = merge({}, styles); // create a copy to avoid altering the original object (#537)
					each(['fontSize', 'fontWeight', 'fontFamily', 'color', 'lineHeight', 'width'], function (prop) {
						if (styles[prop] !== UNDEFINED) {
							textStyles[prop] = styles[prop];
							delete styles[prop];
						}
					});
					text.css(textStyles);
				}
				return baseCss.call(wrapper, styles);
			},
			/**
			 * Return the bounding box of the box, not the group
			 */
			getBBox: function () {
				return box.getBBox();
			},
			/**
			 * Apply the shadow to the box
			 */
			shadow: function (b) {
				box.shadow(b);
				return wrapper;
			},
			/**
			 * Destroy and release memory.
			 */
			destroy: function () {
				removeEvent(wrapper, 'add', getSizeAfterAdd);

				// Added by button implementation
				removeEvent(wrapper.element, 'mouseenter');
				removeEvent(wrapper.element, 'mouseleave');

				if (text) {
					text = text.destroy();
				}
				if (box) {
					box = box.destroy();
				}
				// Call base implementation to destroy the rest
				SVGElement.prototype.destroy.call(wrapper);
			}
		});
	}
}; // end SVGRenderer


// general renderer
Renderer = SVGRenderer;


/* ****************************************************************************
 *                                                                            *
 * START OF INTERNET EXPLORER <= 8 SPECIFIC CODE                              *
 *                                                                            *
 * For applications and websites that don't need IE support, like platform    *
 * targeted mobile apps and web apps, this code can be removed.               *
 *                                                                            *
 *****************************************************************************/

/**
 * @constructor
 */
var VMLRenderer;
if (!hasSVG && !useCanVG) {

/**
 * The VML element wrapper.
 */
var VMLElement = {

	/**
	 * Initialize a new VML element wrapper. It builds the markup as a string
	 * to minimize DOM traffic.
	 * @param {Object} renderer
	 * @param {Object} nodeName
	 */
	init: function (renderer, nodeName) {
		var wrapper = this,
			markup =  ['<', nodeName, ' filled="f" stroked="f"'],
			style = ['position: ', ABSOLUTE, ';'];

		// divs and shapes need size
		if (nodeName === 'shape' || nodeName === DIV) {
			style.push('left:0;top:0;width:1px;height:1px;');
		}
		if (docMode8) {
			style.push('visibility: ', nodeName === DIV ? HIDDEN : VISIBLE);
		}

		markup.push(' style="', style.join(''), '"/>');

		// create element with default attributes and style
		if (nodeName) {
			markup = nodeName === DIV || nodeName === 'span' || nodeName === 'img' ?
				markup.join('')
				: renderer.prepVML(markup);
			wrapper.element = createElement(markup);
		}

		wrapper.renderer = renderer;
		wrapper.attrSetters = {};
	},

	/**
	 * Add the node to the given parent
	 * @param {Object} parent
	 */
	add: function (parent) {
		var wrapper = this,
			renderer = wrapper.renderer,
			element = wrapper.element,
			box = renderer.box,
			inverted = parent && parent.inverted,

			// get the parent node
			parentNode = parent ?
				parent.element || parent :
				box;


		// if the parent group is inverted, apply inversion on all children
		if (inverted) { // only on groups
			renderer.invertChild(element, parentNode);
		}

		// append it
		parentNode.appendChild(element);

		// align text after adding to be able to read offset
		wrapper.added = true;
		if (wrapper.alignOnAdd && !wrapper.deferUpdateTransform) {
			wrapper.updateTransform();
		}

		// fire an event for internal hooks
		fireEvent(wrapper, 'add');

		return wrapper;
	},

	/**
	 * VML always uses htmlUpdateTransform
	 */
	updateTransform: SVGElement.prototype.htmlUpdateTransform,

	/**
	 * Get or set attributes
	 */
	attr: function (hash, val) {
		var wrapper = this,
			key,
			value,
			i,
			result,
			element = wrapper.element || {},
			elemStyle = element.style,
			nodeName = element.nodeName,
			renderer = wrapper.renderer,
			symbolName = wrapper.symbolName,
			hasSetSymbolSize,
			shadows = wrapper.shadows,
			skipAttr,
			attrSetters = wrapper.attrSetters,
			ret = wrapper;

		// single key-value pair
		if (isString(hash) && defined(val)) {
			key = hash;
			hash = {};
			hash[key] = val;
		}

		// used as a getter, val is undefined
		if (isString(hash)) {
			key = hash;
			if (key === 'strokeWidth' || key === 'stroke-width') {
				ret = wrapper.strokeweight;
			} else {
				ret = wrapper[key];
			}

		// setter
		} else {
			for (key in hash) {
				value = hash[key];
				skipAttr = false;

				// check for a specific attribute setter
				result = attrSetters[key] && attrSetters[key].call(wrapper, value, key);

				if (result !== false && value !== null) { // #620

					if (result !== UNDEFINED) {
						value = result; // the attribute setter has returned a new value to set
					}


					// prepare paths
					// symbols
					if (symbolName && /^(x|y|r|start|end|width|height|innerR|anchorX|anchorY)/.test(key)) {
						// if one of the symbol size affecting parameters are changed,
						// check all the others only once for each call to an element's
						// .attr() method
						if (!hasSetSymbolSize) {
							wrapper.symbolAttr(hash);

							hasSetSymbolSize = true;
						}
						skipAttr = true;

					} else if (key === 'd') {
						value = value || [];
						wrapper.d = value.join(' '); // used in getter for animation

						// convert paths
						i = value.length;
						var convertedPath = [];
						while (i--) {

							// Multiply by 10 to allow subpixel precision.
							// Substracting half a pixel seems to make the coordinates
							// align with SVG, but this hasn't been tested thoroughly
							if (isNumber(value[i])) {
								convertedPath[i] = mathRound(value[i] * 10) - 5;
							} else if (value[i] === 'Z') { // close the path
								convertedPath[i] = 'x';
							} else {
								convertedPath[i] = value[i];
							}

						}
						value = convertedPath.join(' ') || 'x';
						element.path = value;

						// update shadows
						if (shadows) {
							i = shadows.length;
							while (i--) {
								shadows[i].path = shadows[i].cutOff ? this.cutOffPath(value, shadows[i].cutOff) : value;
							}
						}
						skipAttr = true;

					// handle visibility
					} else if (key === 'visibility') {

						// let the shadow follow the main element
						if (shadows) {
							i = shadows.length;
							while (i--) {
								shadows[i].style[key] = value;
							}
						}
						
						// Instead of toggling the visibility CSS property, move the div out of the viewport. 
						// This works around #61 and #586							
						if (nodeName === 'DIV') {
							value = value === HIDDEN ? '-999em' : 0;
							key = 'top';
						}
						
						elemStyle[key] = value;	
						skipAttr = true;

					// directly mapped to css
					} else if (key === 'zIndex') {

						if (value) {
							elemStyle[key] = value;
						}
						skipAttr = true;

					// width and height
					} else if (key === 'width' || key === 'height') {
						
						value = mathMax(0, value); // don't set width or height below zero (#311)
						
						this[key] = value; // used in getter

						// clipping rectangle special
						if (wrapper.updateClipping) {
							wrapper[key] = value;
							wrapper.updateClipping();
						} else {
							// normal
							elemStyle[key] = value;
						}

						skipAttr = true;

					// x and y
					} else if (key === 'x' || key === 'y') {
						wrapper[key] = value; // used in getter
						elemStyle[{ x: 'left', y: 'top' }[key]] = value;

					// class name
					} else if (key === 'class') {
						// IE8 Standards mode has problems retrieving the className
						element.className = value;

					// stroke
					} else if (key === 'stroke') {

						value = renderer.color(value, element, key);

						key = 'strokecolor';

					// stroke width
					} else if (key === 'stroke-width' || key === 'strokeWidth') {
						element.stroked = value ? true : false;
						key = 'strokeweight';
						wrapper[key] = value; // used in getter, issue #113
						if (isNumber(value)) {
							value += PX;
						}

					// dashStyle
					} else if (key === 'dashstyle') {
						var strokeElem = element.getElementsByTagName('stroke')[0] ||
							createElement(renderer.prepVML(['<stroke/>']), null, null, element);
						strokeElem[key] = value || 'solid';
						wrapper.dashstyle = value; /* because changing stroke-width will change the dash length
							and cause an epileptic effect */
						skipAttr = true;

					// fill
					} else if (key === 'fill') {

						if (nodeName === 'SPAN') { // text color
							elemStyle.color = value;
						} else {
							element.filled = value !== NONE ? true : false;

							value = renderer.color(value, element, key, wrapper);

							key = 'fillcolor';
						}
						
					// rotation on VML elements
					} else if (nodeName === 'shape' && key === 'rotation') {
						wrapper[key] = value;
						// Correction for the 1x1 size of the shape container. Used in gauge needles.
						element.style.left = -mathRound(mathSin(value * deg2rad) + 1) + PX;
						element.style.top = mathRound(mathCos(value * deg2rad)) + PX;

					// translation for animation
					} else if (key === 'translateX' || key === 'translateY' || key === 'rotation') {
						wrapper[key] = value;
						wrapper.updateTransform();

						skipAttr = true;

					// text for rotated and non-rotated elements
					} else if (key === 'text') {
						this.bBox = null;
						element.innerHTML = value;
						skipAttr = true;
					}

					if (!skipAttr) {
						if (docMode8) { // IE8 setAttribute bug
							element[key] = value;
						} else {
							attr(element, key, value);
						}
					}

				}
			}
		}
		return ret;
	},

	/**
	 * Set the element's clipping to a predefined rectangle
	 *
	 * @param {String} id The id of the clip rectangle
	 */
	clip: function (clipRect) {
		var wrapper = this,
			clipMembers,
			element = wrapper.element,
			parentNode = element.parentNode,
			cssRet;

		if (clipRect) {
			clipMembers = clipRect.members;
			clipMembers.push(wrapper);
			wrapper.destroyClip = function () {
				erase(clipMembers, wrapper);
			};
			// Issue #863 workaround - related to #140, #61, #74
			if (parentNode && parentNode.className === 'highcharts-tracker' && !docMode8) {
				css(element, { visibility: HIDDEN });
			}
			cssRet = clipRect.getCSS(wrapper);
			
		} else {
			if (wrapper.destroyClip) {
				wrapper.destroyClip();
			}
			cssRet = { clip: docMode8 ? 'inherit' : 'rect(auto)' }; // #1214
		}
		
		return wrapper.css(cssRet);
			
	},

	/**
	 * Set styles for the element
	 * @param {Object} styles
	 */
	css: SVGElement.prototype.htmlCss,

	/**
	 * Removes a child either by removeChild or move to garbageBin.
	 * Issue 490; in VML removeChild results in Orphaned nodes according to sIEve, discardElement does not.
	 */
	safeRemoveChild: function (element) {
		// discardElement will detach the node from its parent before attaching it
		// to the garbage bin. Therefore it is important that the node is attached and have parent.
		if (element.parentNode) {
			discardElement(element);
		}
	},

	/**
	 * Extend element.destroy by removing it from the clip members array
	 */
	destroy: function () {
		if (this.destroyClip) {
			this.destroyClip();
		}

		return SVGElement.prototype.destroy.apply(this);
	},

	/**
	 * Remove all child nodes of a group, except the v:group element
	 */
	empty: function () {
		var element = this.element,
			childNodes = element.childNodes,
			i = childNodes.length,
			node;

		while (i--) {
			node = childNodes[i];
			node.parentNode.removeChild(node);
		}
	},

	/**
	 * Add an event listener. VML override for normalizing event parameters.
	 * @param {String} eventType
	 * @param {Function} handler
	 */
	on: function (eventType, handler) {
		// simplest possible event model for internal use
		this.element['on' + eventType] = function () {
			var evt = win.event;
			evt.target = evt.srcElement;
			handler(evt);
		};
		return this;
	},
	
	/**
	 * In stacked columns, cut off the shadows so that they don't overlap
	 */
	cutOffPath: function (path, length) {
		
		var len;
		
		path = path.split(/[ ,]/);
		len = path.length;
		
		if (len === 9 || len === 11) {
			path[len - 4] = path[len - 2] = pInt(path[len - 2]) - 10 * length;
		}
		return path.join(' ');		
	},

	/**
	 * Apply a drop shadow by copying elements and giving them different strokes
	 * @param {Boolean|Object} shadowOptions
	 */
	shadow: function (shadowOptions, group, cutOff) {
		var shadows = [],
			i,
			element = this.element,
			renderer = this.renderer,
			shadow,
			elemStyle = element.style,
			markup,
			path = element.path,
			strokeWidth,
			modifiedPath,
			shadowWidth,
			shadowElementOpacity;

		// some times empty paths are not strings
		if (path && typeof path.value !== 'string') {
			path = 'x';
		}
		modifiedPath = path;

		if (shadowOptions) {
			shadowWidth = pick(shadowOptions.width, 3);
			shadowElementOpacity = (shadowOptions.opacity || 0.15) / shadowWidth;
			for (i = 1; i <= 3; i++) {
				
				strokeWidth = (shadowWidth * 2) + 1 - (2 * i);
				
				// Cut off shadows for stacked column items
				if (cutOff) {
					modifiedPath = this.cutOffPath(path.value, strokeWidth + 0.5);
				}
				
				markup = ['<shape isShadow="true" strokeweight="', strokeWidth,
					'" filled="false" path="', modifiedPath,
					'" coordsize="10 10" style="', element.style.cssText, '" />'];
				
				shadow = createElement(renderer.prepVML(markup),
					null, {
						left: pInt(elemStyle.left) + pick(shadowOptions.offsetX, 1),
						top: pInt(elemStyle.top) + pick(shadowOptions.offsetY, 1)
					}
				);
				if (cutOff) {
					shadow.cutOff = strokeWidth + 1;
				}
				
				// apply the opacity
				markup = ['<stroke color="', shadowOptions.color || 'black', '" opacity="', shadowElementOpacity * i, '"/>'];
				createElement(renderer.prepVML(markup), null, null, shadow);


				// insert it
				if (group) {
					group.element.appendChild(shadow);
				} else {
					element.parentNode.insertBefore(shadow, element);
				}

				// record it
				shadows.push(shadow);

			}

			this.shadows = shadows;
		}
		return this;

	}
};
VMLElement = extendClass(SVGElement, VMLElement);

/**
 * The VML renderer
 */
var VMLRendererExtension = { // inherit SVGRenderer

	Element: VMLElement,
	isIE8: userAgent.indexOf('MSIE 8.0') > -1,


	/**
	 * Initialize the VMLRenderer
	 * @param {Object} container
	 * @param {Number} width
	 * @param {Number} height
	 */
	init: function (container, width, height) {
		var renderer = this,
			boxWrapper,
			box;

		renderer.alignedObjects = [];

		boxWrapper = renderer.createElement(DIV);
		box = boxWrapper.element;
		box.style.position = RELATIVE; // for freeform drawing using renderer directly
		container.appendChild(boxWrapper.element);


		// generate the containing box
		renderer.box = box;
		renderer.boxWrapper = boxWrapper;


		renderer.setSize(width, height, false);

		// The only way to make IE6 and IE7 print is to use a global namespace. However,
		// with IE8 the only way to make the dynamic shapes visible in screen and print mode
		// seems to be to add the xmlns attribute and the behaviour style inline.
		if (!doc.namespaces.hcv) {

			doc.namespaces.add('hcv', 'urn:schemas-microsoft-com:vml');

			// setup default css
			doc.createStyleSheet().cssText =
				'hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke' +
				'{ behavior:url(#default#VML); display: inline-block; } ';

		}
	},
	
	
	/**
	 * Detect whether the renderer is hidden. This happens when one of the parent elements
	 * has display: none
	 */
	isHidden: function () {
		return !this.box.offsetWidth;			
	},

	/**
	 * Define a clipping rectangle. In VML it is accomplished by storing the values
	 * for setting the CSS style to all associated members.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	clipRect: function (x, y, width, height) {

		// create a dummy element
		var clipRect = this.createElement(),
			isObj = isObject(x);
		
		// mimic a rectangle with its style object for automatic updating in attr
		return extend(clipRect, {
			members: [],
			left: isObj ? x.x : x,
			top: isObj ? x.y : y,
			width: isObj ? x.width : width,
			height: isObj ? x.height : height,
			getCSS: function (wrapper) {
				var inverted = wrapper.inverted,
					rect = this,
					top = rect.top,
					left = rect.left,
					right = left + rect.width,
					bottom = top + rect.height,
					ret = {
						clip: 'rect(' +
							mathRound(inverted ? left : top) + 'px,' +
							mathRound(inverted ? bottom : right) + 'px,' +
							mathRound(inverted ? right : bottom) + 'px,' +
							mathRound(inverted ? top : left) + 'px)'
					};

				// issue 74 workaround
				if (!inverted && docMode8 && wrapper.element.nodeName !== 'IMG') {
					extend(ret, {
						width: right + PX,
						height: bottom + PX
					});
				}
				
				return ret;
			},

			// used in attr and animation to update the clipping of all members
			updateClipping: function () {
				each(clipRect.members, function (member) {
					member.css(clipRect.getCSS(member));
				});
			}
		});

	},


	/**
	 * Take a color and return it if it's a string, make it a gradient if it's a
	 * gradient configuration object, and apply opacity.
	 *
	 * @param {Object} color The color or config object
	 */
	color: function (color, elem, prop, wrapper) {
		var renderer = this,
			colorObject,
			regexRgba = /^rgba/,
			markup,
			fillType,
			ret = NONE;

		// Check for linear or radial gradient
		if (color && color.linearGradient) {
			fillType = 'gradient';
		} else if (color && color.radialGradient) {
			fillType = 'pattern';
		}
		
		
		if (fillType) {

			var stopColor,
				stopOpacity,
				gradient = color.linearGradient || color.radialGradient,
				x1,
				y1, 
				x2,
				y2,
				opacity1,
				opacity2,
				color1,
				color2,
				fillAttr = '',
				stops = color.stops,
				firstStop,
				lastStop,
				colors = [],
				addFillNode = function () {
					// Add the fill subnode. When colors attribute is used, the meanings of opacity and o:opacity2
					// are reversed.
					markup = ['<fill colors="' + colors.join(',') + '" opacity="', opacity2, '" o:opacity2="', opacity1,
						'" type="', fillType, '" ', fillAttr, 'focus="100%" method="any" />'];
					createElement(renderer.prepVML(markup), null, null, elem);
				};
			
			// Extend from 0 to 1
			firstStop = stops[0];
			lastStop = stops[stops.length - 1];
			if (firstStop[0] > 0) {
				stops.unshift([
					0,
					firstStop[1]
				]);
			}
			if (lastStop[0] < 1) {
				stops.push([
					1,
					lastStop[1]
				]);
			}

			// Compute the stops
			each(stops, function (stop, i) {
				if (regexRgba.test(stop[1])) {
					colorObject = Color(stop[1]);
					stopColor = colorObject.get('rgb');
					stopOpacity = colorObject.get('a');
				} else {
					stopColor = stop[1];
					stopOpacity = 1;
				}
				
				// Build the color attribute
				colors.push((stop[0] * 100) + '% ' + stopColor); 

				// Only start and end opacities are allowed, so we use the first and the last
				if (!i) {
					opacity1 = stopOpacity;
					color2 = stopColor;
				} else {
					opacity2 = stopOpacity;
					color1 = stopColor;
				}
			});
			
			// Apply the gradient to fills only.
			if (prop === 'fill') {
				
				// Handle linear gradient angle
				if (fillType === 'gradient') {
					x1 = gradient.x1 || gradient[0] || 0;
					y1 = gradient.y1 || gradient[1] || 0;
					x2 = gradient.x2 || gradient[2] || 0;
					y2 = gradient.y2 || gradient[3] || 0;
					fillAttr = 'angle="' + (90  - math.atan(
						(y2 - y1) / // y vector
						(x2 - x1) // x vector
						) * 180 / mathPI) + '"';
						
					addFillNode();
					
				// Radial (circular) gradient
				} else { 
					
					var r = gradient.r,
						sizex = r * 2,
						sizey = r * 2,
						cx = gradient.cx,
						cy = gradient.cy,
						radialReference = elem.radialReference,
						bBox,
						applyRadialGradient = function () {
							if (radialReference) {
								bBox = wrapper.getBBox();
								cx += (radialReference[0] - bBox.x) / bBox.width - 0.5;
								cy += (radialReference[1] - bBox.y) / bBox.height - 0.5;
								sizex *= radialReference[2] / bBox.width;
								sizey *= radialReference[2] / bBox.height;							
							}
							fillAttr = 'src="' + defaultOptions.global.VMLRadialGradientURL + '" ' +
								'size="' + sizex + ',' + sizey + '" ' +
								'origin="0.5,0.5" ' +
								'position="' + cx + ',' + cy + '" ' +
								'color2="' + color2 + '" ';
							
							addFillNode();
						};
					
					// Apply radial gradient
					if (wrapper.added) {
						applyRadialGradient();
					} else {
						// We need to know the bounding box to get the size and position right
						addEvent(wrapper, 'add', applyRadialGradient);
					}
					
					// The fill element's color attribute is broken in IE8 standards mode, so we
					// need to set the parent shape's fillcolor attribute instead.
					ret = color1;
				}
			
			// Gradients are not supported for VML stroke, return the first color. #722.
			} else {
				ret = stopColor;
			}

		// if the color is an rgba color, split it and add a fill node
		// to hold the opacity component
		} else if (regexRgba.test(color) && elem.tagName !== 'IMG') {

			colorObject = Color(color);

			markup = ['<', prop, ' opacity="', colorObject.get('a'), '"/>'];
			createElement(this.prepVML(markup), null, null, elem);

			ret = colorObject.get('rgb');


		} else {
			var strokeNodes = elem.getElementsByTagName(prop);
			if (strokeNodes.length) {
				strokeNodes[0].opacity = 1;
			}
			ret = color;
		}

		return ret;
	},

	/**
	 * Take a VML string and prepare it for either IE8 or IE6/IE7.
	 * @param {Array} markup A string array of the VML markup to prepare
	 */
	prepVML: function (markup) {
		var vmlStyle = 'display:inline-block;behavior:url(#default#VML);',
			isIE8 = this.isIE8;

		markup = markup.join('');

		if (isIE8) { // add xmlns and style inline
			markup = markup.replace('/>', ' xmlns="urn:schemas-microsoft-com:vml" />');
			if (markup.indexOf('style="') === -1) {
				markup = markup.replace('/>', ' style="' + vmlStyle + '" />');
			} else {
				markup = markup.replace('style="', 'style="' + vmlStyle);
			}

		} else { // add namespace
			markup = markup.replace('<', '<hcv:');
		}

		return markup;
	},

	/**
	 * Create rotated and aligned text
	 * @param {String} str
	 * @param {Number} x
	 * @param {Number} y
	 */
	text: SVGRenderer.prototype.html,

	/**
	 * Create and return a path element
	 * @param {Array} path
	 */
	path: function (path) {
		var attr = {
			// subpixel precision down to 0.1 (width and height = 1px)
			coordsize: '10 10'
		};
		if (isArray(path)) {
			attr.d = path;
		} else if (isObject(path)) { // attributes
			extend(attr, path);
		}
		// create the shape
		return this.createElement('shape').attr(attr);
	},

	/**
	 * Create and return a circle element. In VML circles are implemented as
	 * shapes, which is faster than v:oval
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} r
	 */
	circle: function (x, y, r) {
		return this.symbol('circle').attr({ x: x - r, y: y - r, width: 2 * r, height: 2 * r });
	},

	/**
	 * Create a group using an outer div and an inner v:group to allow rotating
	 * and flipping. A simple v:group would have problems with positioning
	 * child HTML elements and CSS clip.
	 *
	 * @param {String} name The name of the group
	 */
	g: function (name) {
		var wrapper,
			attribs;

		// set the class name
		if (name) {
			attribs = { 'className': PREFIX + name, 'class': PREFIX + name };
		}

		// the div to hold HTML and clipping
		wrapper = this.createElement(DIV).attr(attribs);

		return wrapper;
	},

	/**
	 * VML override to create a regular HTML image
	 * @param {String} src
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	image: function (src, x, y, width, height) {
		var obj = this.createElement('img')
			.attr({ src: src });

		if (arguments.length > 1) {
			obj.attr({
				x: x,
				y: y,
				width: width,
				height: height
			});
		}
		return obj;
	},

	/**
	 * VML uses a shape for rect to overcome bugs and rotation problems
	 */
	rect: function (x, y, width, height, r, strokeWidth) {

		if (isObject(x)) {
			y = x.y;
			width = x.width;
			height = x.height;
			strokeWidth = x.strokeWidth;
			x = x.x;
		}
		var wrapper = this.symbol('rect');
		wrapper.r = r;

		return wrapper.attr(wrapper.crisp(strokeWidth, x, y, mathMax(width, 0), mathMax(height, 0)));
	},

	/**
	 * In the VML renderer, each child of an inverted div (group) is inverted
	 * @param {Object} element
	 * @param {Object} parentNode
	 */
	invertChild: function (element, parentNode) {
		var parentStyle = parentNode.style;
		css(element, {
			flip: 'x',
			left: pInt(parentStyle.width) - 1,
			top: pInt(parentStyle.height) - 1,
			rotation: -90
		});
	},

	/**
	 * Symbol definitions that override the parent SVG renderer's symbols
	 *
	 */
	symbols: {
		// VML specific arc function
		arc: function (x, y, w, h, options) {
			var start = options.start,
				end = options.end,
				radius = options.r || w || h,
				cosStart = mathCos(start),
				sinStart = mathSin(start),
				cosEnd = mathCos(end),
				sinEnd = mathSin(end),
				innerRadius = options.innerR,
				circleCorrection = 0.08 / radius, // #760
				innerCorrection = (innerRadius && 0.1 / innerRadius) || 0,
				ret;

			if (end - start === 0) { // no angle, don't show it.
				return ['x'];

			} else if (2 * mathPI - end + start < circleCorrection) { // full circle
				// empirical correction found by trying out the limits for different radii
				cosEnd = -circleCorrection;
			} else if (end - start < innerCorrection) { // issue #186, another mysterious VML arc problem
				cosEnd = mathCos(start + innerCorrection);
			}

			ret = [
				'wa', // clockwise arc to
				x - radius, // left
				y - radius, // top
				x + radius, // right
				y + radius, // bottom
				x + radius * cosStart, // start x
				y + radius * sinStart, // start y
				x + radius * cosEnd, // end x
				y + radius * sinEnd  // end y
			];

			if (options.open && !innerRadius) {
				ret.push(
					'e',
					M, 
					x,// - innerRadius, 
					y// - innerRadius
				);
			}

			ret.push(
				'at', // anti clockwise arc to
				x - innerRadius, // left
				y - innerRadius, // top
				x + innerRadius, // right
				y + innerRadius, // bottom
				x + innerRadius * cosEnd, // start x
				y + innerRadius * sinEnd, // start y
				x + innerRadius * cosStart, // end x
				y + innerRadius * sinStart, // end y
				'x', // finish path
				'e' // close
			);
			
			return ret;

		},
		// Add circle symbol path. This performs significantly faster than v:oval.
		circle: function (x, y, w, h) {

			return [
				'wa', // clockwisearcto
				x, // left
				y, // top
				x + w, // right
				y + h, // bottom
				x + w, // start x
				y + h / 2,     // start y
				x + w, // end x
				y + h / 2,     // end y
				//'x', // finish path
				'e' // close
			];
		},
		/**
		 * Add rectangle symbol path which eases rotation and omits arcsize problems
		 * compared to the built-in VML roundrect shape
		 *
		 * @param {Number} left Left position
		 * @param {Number} top Top position
		 * @param {Number} r Border radius
		 * @param {Object} options Width and height
		 */

		rect: function (left, top, width, height, options) {
			
			var right = left + width,
				bottom = top + height,
				ret,
				r;

			// No radius, return the more lightweight square
			if (!defined(options) || !options.r) {
				ret = SVGRenderer.prototype.symbols.square.apply(0, arguments);
				
			// Has radius add arcs for the corners
			} else {
			
				r = mathMin(options.r, width, height);
				ret = [
					M,
					left + r, top,
	
					L,
					right - r, top,
					'wa',
					right - 2 * r, top,
					right, top + 2 * r,
					right - r, top,
					right, top + r,
	
					L,
					right, bottom - r,
					'wa',
					right - 2 * r, bottom - 2 * r,
					right, bottom,
					right, bottom - r,
					right - r, bottom,
	
					L,
					left + r, bottom,
					'wa',
					left, bottom - 2 * r,
					left + 2 * r, bottom,
					left + r, bottom,
					left, bottom - r,
	
					L,
					left, top + r,
					'wa',
					left, top,
					left + 2 * r, top + 2 * r,
					left, top + r,
					left + r, top,
	
	
					'x',
					'e'
				];
			}
			return ret;
		}
	}
};
VMLRenderer = function () {
	this.init.apply(this, arguments);
};
VMLRenderer.prototype = merge(SVGRenderer.prototype, VMLRendererExtension);

	// general renderer
	Renderer = VMLRenderer;
}

/* ****************************************************************************
 *                                                                            *
 * END OF INTERNET EXPLORER <= 8 SPECIFIC CODE                                *
 *                                                                            *
 *****************************************************************************/
/* ****************************************************************************
 *                                                                            *
 * START OF ANDROID < 3 SPECIFIC CODE. THIS CAN BE REMOVED IF YOU'RE NOT      *
 * TARGETING THAT SYSTEM.                                                     *
 *                                                                            *
 *****************************************************************************/
var CanVGRenderer,
	CanVGController;

if (useCanVG) {
	/**
	 * The CanVGRenderer is empty from start to keep the source footprint small.
	 * When requested, the CanVGController downloads the rest of the source packaged
	 * together with the canvg library.
	 */
	CanVGRenderer = function () {
		// Override the global SVG namespace to fake SVG/HTML that accepts CSS
		SVG_NS = 'http://www.w3.org/1999/xhtml';
	};

	/**
	 * Start with an empty symbols object. This is needed when exporting is used (exporting.src.js will add a few symbols), but 
	 * the implementation from SvgRenderer will not be merged in until first render.
	 */
	CanVGRenderer.prototype.symbols = {};

	/**
	 * Handles on demand download of canvg rendering support.
	 */
	CanVGController = (function () {
		// List of renderering calls
		var deferredRenderCalls = [];

		/**
		 * When downloaded, we are ready to draw deferred charts.
		 */
		function drawDeferred() {
			var callLength = deferredRenderCalls.length,
				callIndex;

			// Draw all pending render calls
			for (callIndex = 0; callIndex < callLength; callIndex++) {
				deferredRenderCalls[callIndex]();
			}
			// Clear the list
			deferredRenderCalls = [];
		}

		return {
			push: function (func, scriptLocation) {
				// Only get the script once
				if (deferredRenderCalls.length === 0) {
					getScript(scriptLocation, drawDeferred);
				}
				// Register render call
				deferredRenderCalls.push(func);
			}
		};
	}());
} // end CanVGRenderer

/* ****************************************************************************
 *                                                                            *
 * END OF ANDROID < 3 SPECIFIC CODE                                           *
 *                                                                            *
 *****************************************************************************/

/**
 * General renderer
 */
Renderer = VMLRenderer || CanVGRenderer || SVGRenderer;
/**
 * The Tick class
 */
function Tick(axis, pos, type) {
	this.axis = axis;
	this.pos = pos;
	this.type = type || '';
	this.isNew = true;

	if (!type) {
		this.addLabel();
	}
}

Tick.prototype = {
	/**
	 * Write the tick label
	 */
	addLabel: function () {
		var tick = this,
			axis = tick.axis,
			options = axis.options,
			chart = axis.chart,
			horiz = axis.horiz,
			categories = axis.categories,
			pos = tick.pos,
			labelOptions = options.labels,
			str,
			tickPositions = axis.tickPositions,
			width = (categories && horiz && categories.length &&
				!labelOptions.step && !labelOptions.staggerLines &&
				!labelOptions.rotation &&
				chart.plotWidth / tickPositions.length) ||
				(!horiz && chart.plotWidth / 2),
			isFirst = pos === tickPositions[0],
			isLast = pos === tickPositions[tickPositions.length - 1],
			css,
			attr,
			value = categories && defined(categories[pos]) ? categories[pos] : pos,
			label = tick.label,
			tickPositionInfo = tickPositions.info,
			dateTimeLabelFormat;

		// Set the datetime label format. If a higher rank is set for this position, use that. If not,
		// use the general format.
		if (axis.isDatetimeAxis && tickPositionInfo) {
			dateTimeLabelFormat = options.dateTimeLabelFormats[tickPositionInfo.higherRanks[pos] || tickPositionInfo.unitName];
		}

		// set properties for access in render method
		tick.isFirst = isFirst;
		tick.isLast = isLast;

		// get the string
		str = axis.labelFormatter.call({
			axis: axis,
			chart: chart,
			isFirst: isFirst,
			isLast: isLast,
			dateTimeLabelFormat: dateTimeLabelFormat,
			value: axis.isLog ? correctFloat(lin2log(value)) : value
		});

		// prepare CSS
		css = width && { width: mathMax(1, mathRound(width - 2 * (labelOptions.padding || 10))) + PX };
		css = extend(css, labelOptions.style);

		// first call
		if (!defined(label)) {
			attr = {
				align: labelOptions.align
			};
			if (isNumber(labelOptions.rotation)) {
				attr.rotation = labelOptions.rotation;
			}			
			tick.label =
				defined(str) && labelOptions.enabled ?
					chart.renderer.text(
							str,
							0,
							0,
							labelOptions.useHTML
						)
						.attr(attr)
						// without position absolute, IE export sometimes is wrong
						.css(css)
						.add(axis.labelGroup) :
					null;

		// update
		} else if (label) {
			label.attr({
					text: str
				})
				.css(css);
		}
	},

	/**
	 * Get the offset height or width of the label
	 */
	getLabelSize: function () {
		var label = this.label,
			axis = this.axis;
		return label ?
			((this.labelBBox = label.getBBox()))[axis.horiz ? 'height' : 'width'] :
			0;
	},

	/**
	 * Find how far the labels extend to the right and left of the tick's x position. Used for anti-collision
	 * detection with overflow logic.
	 */
	getLabelSides: function () {
		var bBox = this.labelBBox, // assume getLabelSize has run at this point
			axis = this.axis,
			options = axis.options,
			labelOptions = options.labels,
			width = bBox.width,
			leftSide = width * { left: 0, center: 0.5, right: 1 }[labelOptions.align] - labelOptions.x;

		return [-leftSide, width - leftSide];
	},

	/**
	 * Handle the label overflow by adjusting the labels to the left and right edge, or
	 * hide them if they collide into the neighbour label.
	 */
	handleOverflow: function (index, xy) {
		var show = true,
			axis = this.axis,
			chart = axis.chart,
			isFirst = this.isFirst,
			isLast = this.isLast,
			x = xy.x,
			reversed = axis.reversed,
			tickPositions = axis.tickPositions;

		if (isFirst || isLast) {

			var sides = this.getLabelSides(),
				leftSide = sides[0],
				rightSide = sides[1],
				plotLeft = chart.plotLeft,
				plotRight = plotLeft + axis.len,
				neighbour = axis.ticks[tickPositions[index + (isFirst ? 1 : -1)]],
				neighbourEdge = neighbour && neighbour.label.xy && neighbour.label.xy.x + neighbour.getLabelSides()[isFirst ? 0 : 1];

			if ((isFirst && !reversed) || (isLast && reversed)) {
				// Is the label spilling out to the left of the plot area?
				if (x + leftSide < plotLeft) {

					// Align it to plot left
					x = plotLeft - leftSide;

					// Hide it if it now overlaps the neighbour label
					if (neighbour && x + rightSide > neighbourEdge) {
						show = false;
					}
				}

			} else {
				// Is the label spilling out to the right of the plot area?
				if (x + rightSide > plotRight) {

					// Align it to plot right
					x = plotRight - rightSide;

					// Hide it if it now overlaps the neighbour label
					if (neighbour && x + leftSide < neighbourEdge) {
						show = false;
					}

				}
			}

			// Set the modified x position of the label
			xy.x = x;
		}
		return show;
	},

	/**
	 * Get the x and y position for ticks and labels
	 */
	getPosition: function (horiz, pos, tickmarkOffset, old) {
		var axis = this.axis,
			chart = axis.chart,
			cHeight = (old && chart.oldChartHeight) || chart.chartHeight;
		
		return {
			x: horiz ?
				axis.translate(pos + tickmarkOffset, null, null, old) + axis.transB :
				axis.left + axis.offset + (axis.opposite ? ((old && chart.oldChartWidth) || chart.chartWidth) - axis.right - axis.left : 0),

			y: horiz ?
				cHeight - axis.bottom + axis.offset - (axis.opposite ? axis.height : 0) :
				cHeight - axis.translate(pos + tickmarkOffset, null, null, old) - axis.transB
		};
		
	},
	
	/**
	 * Get the x, y position of the tick label
	 */
	getLabelPosition: function (x, y, label, horiz, labelOptions, tickmarkOffset, index, step) {
		var axis = this.axis,
			transA = axis.transA,
			reversed = axis.reversed,
			staggerLines = axis.staggerLines;
			
		x = x + labelOptions.x - (tickmarkOffset && horiz ?
			tickmarkOffset * transA * (reversed ? -1 : 1) : 0);
		y = y + labelOptions.y - (tickmarkOffset && !horiz ?
			tickmarkOffset * transA * (reversed ? 1 : -1) : 0);
		
		// Vertically centered
		if (!defined(labelOptions.y)) {
			y += pInt(label.styles.lineHeight) * 0.9 - label.getBBox().height / 2;
		}
		
		// Correct for staggered labels
		if (staggerLines) {
			y += (index / (step || 1) % staggerLines) * 16;
		}
		
		return {
			x: x,
			y: y
		};
	},
	
	/**
	 * Extendible method to return the path of the marker
	 */
	getMarkPath: function (x, y, tickLength, tickWidth, horiz, renderer) {
		return renderer.crispLine([
				M,
				x,
				y,
				L,
				x + (horiz ? 0 : -tickLength),
				y + (horiz ? tickLength : 0)
			], tickWidth);
	},

	/**
	 * Put everything in place
	 *
	 * @param index {Number}
	 * @param old {Boolean} Use old coordinates to prepare an animation into new position
	 */
	render: function (index, old) {
		var tick = this,
			axis = tick.axis,
			options = axis.options,
			chart = axis.chart,
			renderer = chart.renderer,
			horiz = axis.horiz,
			type = tick.type,
			label = tick.label,
			pos = tick.pos,
			labelOptions = options.labels,
			gridLine = tick.gridLine,
			gridPrefix = type ? type + 'Grid' : 'grid',
			tickPrefix = type ? type + 'Tick' : 'tick',
			gridLineWidth = options[gridPrefix + 'LineWidth'],
			gridLineColor = options[gridPrefix + 'LineColor'],
			dashStyle = options[gridPrefix + 'LineDashStyle'],
			tickLength = options[tickPrefix + 'Length'],
			tickWidth = options[tickPrefix + 'Width'] || 0,
			tickColor = options[tickPrefix + 'Color'],
			tickPosition = options[tickPrefix + 'Position'],
			gridLinePath,
			mark = tick.mark,
			markPath,
			step = labelOptions.step,
			attribs,
			show = true,
			tickmarkOffset = axis.tickmarkOffset,
			xy = tick.getPosition(horiz, pos, tickmarkOffset, old),
			x = xy.x,
			y = xy.y,
			staggerLines = axis.staggerLines;
		
		// create the grid line
		if (gridLineWidth) {
			gridLinePath = axis.getPlotLinePath(pos + tickmarkOffset, gridLineWidth, old);

			if (gridLine === UNDEFINED) {
				attribs = {
					stroke: gridLineColor,
					'stroke-width': gridLineWidth
				};
				if (dashStyle) {
					attribs.dashstyle = dashStyle;
				}
				if (!type) {
					attribs.zIndex = 1;
				}
				tick.gridLine = gridLine =
					gridLineWidth ?
						renderer.path(gridLinePath)
							.attr(attribs).add(axis.gridGroup) :
						null;
			}

			// If the parameter 'old' is set, the current call will be followed
			// by another call, therefore do not do any animations this time
			if (!old && gridLine && gridLinePath) {
				gridLine[tick.isNew ? 'attr' : 'animate']({
					d: gridLinePath
				});
			}
		}

		// create the tick mark
		if (tickWidth && tickLength) {

			// negate the length
			if (tickPosition === 'inside') {
				tickLength = -tickLength;
			}
			if (axis.opposite) {
				tickLength = -tickLength;
			}

			markPath = tick.getMarkPath(x, y, tickLength, tickWidth, horiz, renderer);

			if (mark) { // updating
				mark.animate({
					d: markPath
				});
			} else { // first time
				tick.mark = renderer.path(
					markPath
				).attr({
					stroke: tickColor,
					'stroke-width': tickWidth
				}).add(axis.axisGroup);
			}
		}

		// the label is created on init - now move it into place
		if (label && !isNaN(x)) {
			label.xy = xy = tick.getLabelPosition(x, y, label, horiz, labelOptions, tickmarkOffset, index, step);

			// apply show first and show last
			if ((tick.isFirst && !pick(options.showFirstLabel, 1)) ||
					(tick.isLast && !pick(options.showLastLabel, 1))) {
				show = false;

			// Handle label overflow and show or hide accordingly
			} else if (!staggerLines && horiz && labelOptions.overflow === 'justify' && !tick.handleOverflow(index, xy)) {
				show = false;
			}

			// apply step
			if (step && index % step) {
				// show those indices dividable by step
				show = false;
			}

			// Set the new position, and show or hide
			if (show) {
				label[tick.isNew ? 'attr' : 'animate'](xy);
				label.show();
				tick.isNew = false;
			} else {
				label.hide();
			}
		}
	},

	/**
	 * Destructor for the tick prototype
	 */
	destroy: function () {
		destroyObjectProperties(this, this.axis);
	}
};

/**
 * The object wrapper for plot lines and plot bands
 * @param {Object} options
 */
function PlotLineOrBand(axis, options) {
	this.axis = axis;

	if (options) {
		this.options = options;
		this.id = options.id;
	}

	//plotLine.render()
	return this;
}

PlotLineOrBand.prototype = {
	
	/**
	 * Render the plot line or plot band. If it is already existing,
	 * move it.
	 */
	render: function () {
		var plotLine = this,
			axis = plotLine.axis,
			horiz = axis.horiz,
			halfPointRange = (axis.pointRange || 0) / 2,
			options = plotLine.options,
			optionsLabel = options.label,
			label = plotLine.label,
			width = options.width,
			to = options.to,
			from = options.from,
			isBand = defined(from) && defined(to),
			value = options.value,
			dashStyle = options.dashStyle,
			svgElem = plotLine.svgElem,
			path = [],
			addEvent,
			eventType,
			xs,
			ys,
			x,
			y,
			color = options.color,
			zIndex = options.zIndex,
			events = options.events,
			attribs,
			renderer = axis.chart.renderer;

		// logarithmic conversion
		if (axis.isLog) {
			from = log2lin(from);
			to = log2lin(to);
			value = log2lin(value);
		}

		// plot line
		if (width) {
			path = axis.getPlotLinePath(value, width);
			attribs = {
				stroke: color,
				'stroke-width': width
			};
			if (dashStyle) {
				attribs.dashstyle = dashStyle;
			}
		} else if (isBand) { // plot band
			
			// keep within plot area
			from = mathMax(from, axis.min - halfPointRange);
			to = mathMin(to, axis.max + halfPointRange);
			
			path = axis.getPlotBandPath(from, to, options);
			attribs = {
				fill: color
			};
			if (options.borderWidth) {
				attribs.stroke = options.borderColor;
				attribs['stroke-width'] = options.borderWidth;
			}
		} else {
			return;
		}
		// zIndex
		if (defined(zIndex)) {
			attribs.zIndex = zIndex;
		}

		// common for lines and bands
		if (svgElem) {
			if (path) {
				svgElem.animate({
					d: path
				}, null, svgElem.onGetPath);
			} else {
				svgElem.hide();
				svgElem.onGetPath = function () {
					svgElem.show();
				};
			}
		} else if (path && path.length) {
			plotLine.svgElem = svgElem = renderer.path(path)
				.attr(attribs).add();

			// events
			if (events) {
				addEvent = function (eventType) {
					svgElem.on(eventType, function (e) {
						events[eventType].apply(plotLine, [e]);
					});
				};
				for (eventType in events) {
					addEvent(eventType);
				}
			}
		}

		// the plot band/line label
		if (optionsLabel && defined(optionsLabel.text) && path && path.length && axis.width > 0 && axis.height > 0) {
			// apply defaults
			optionsLabel = merge({
				align: horiz && isBand && 'center',
				x: horiz ? !isBand && 4 : 10,
				verticalAlign : !horiz && isBand && 'middle',
				y: horiz ? isBand ? 16 : 10 : isBand ? 6 : -4,
				rotation: horiz && !isBand && 90
			}, optionsLabel);

			// add the SVG element
			if (!label) {
				plotLine.label = label = renderer.text(
						optionsLabel.text,
						0,
						0
					)
					.attr({
						align: optionsLabel.textAlign || optionsLabel.align,
						rotation: optionsLabel.rotation,
						zIndex: zIndex
					})
					.css(optionsLabel.style)
					.add();
			}

			// get the bounding box and align the label
			xs = [path[1], path[4], pick(path[6], path[1])];
			ys = [path[2], path[5], pick(path[7], path[2])];
			x = arrayMin(xs);
			y = arrayMin(ys);

			label.align(optionsLabel, false, {
				x: x,
				y: y,
				width: arrayMax(xs) - x,
				height: arrayMax(ys) - y
			});
			label.show();

		} else if (label) { // move out of sight
			label.hide();
		}

		// chainable
		return plotLine;
	},

	/**
	 * Remove the plot line or band
	 */
	destroy: function () {
		var plotLine = this,
			axis = plotLine.axis;

		// remove it from the lookup
		erase(axis.plotLinesAndBands, plotLine);

		destroyObjectProperties(plotLine, this.axis);
	}
};
/**
 * The class for stack items
 */
function StackItem(axis, options, isNegative, x, stackOption, stacking) {
	
	var inverted = axis.chart.inverted;

	this.axis = axis;

	// Tells if the stack is negative
	this.isNegative = isNegative;

	// Save the options to be able to style the label
	this.options = options;

	// Save the x value to be able to position the label later
	this.x = x;

	// Save the stack option on the series configuration object, and whether to treat it as percent
	this.stack = stackOption;
	this.percent = stacking === 'percent';

	// The align options and text align varies on whether the stack is negative and
	// if the chart is inverted or not.
	// First test the user supplied value, then use the dynamic.
	this.alignOptions = {
		align: options.align || (inverted ? (isNegative ? 'left' : 'right') : 'center'),
		verticalAlign: options.verticalAlign || (inverted ? 'middle' : (isNegative ? 'bottom' : 'top')),
		y: pick(options.y, inverted ? 4 : (isNegative ? 14 : -6)),
		x: pick(options.x, inverted ? (isNegative ? -6 : 6) : 0)
	};

	this.textAlign = options.textAlign || (inverted ? (isNegative ? 'right' : 'left') : 'center');
}

StackItem.prototype = {
	destroy: function () {
		destroyObjectProperties(this, this.axis);
	},

	/**
	 * Sets the total of this stack. Should be called when a serie is hidden or shown
	 * since that will affect the total of other stacks.
	 */
	setTotal: function (total) {
		this.total = total;
		this.cum = total;
	},

	/**
	 * Renders the stack total label and adds it to the stack label group.
	 */
	render: function (group) {
		var str = this.options.formatter.call(this);  // format the text in the label

		// Change the text to reflect the new total and set visibility to hidden in case the serie is hidden
		if (this.label) {
			this.label.attr({text: str, visibility: HIDDEN});
		// Create new label
		} else {
			this.label =
				this.axis.chart.renderer.text(str, 0, 0)		// dummy positions, actual position updated with setOffset method in columnseries
					.css(this.options.style)				// apply style
					.attr({
						align: this.textAlign,				// fix the text-anchor
						rotation: this.options.rotation,	// rotation
						visibility: HIDDEN					// hidden until setOffset is called
					})				
					.add(group);							// add to the labels-group
		}
	},

	/**
	 * Sets the offset that the stack has from the x value and repositions the label.
	 */
	setOffset: function (xOffset, xWidth) {
		var stackItem = this,
			axis = stackItem.axis,
			chart = axis.chart,
			inverted = chart.inverted,
			neg = this.isNegative,							// special treatment is needed for negative stacks
			y = axis.translate(this.percent ? 100 : this.total, 0, 0, 0, 1), // stack value translated mapped to chart coordinates
			yZero = axis.translate(0),						// stack origin
			h = mathAbs(y - yZero),							// stack height
			x = chart.xAxis[0].translate(this.x) + xOffset,	// stack x position
			plotHeight = chart.plotHeight,
			stackBox = {	// this is the box for the complete stack
				x: inverted ? (neg ? y : y - h) : x,
				y: inverted ? plotHeight - x - xWidth : (neg ? (plotHeight - y - h) : plotHeight - y),
				width: inverted ? h : xWidth,
				height: inverted ? xWidth : h
			},
			label = this.label,
			alignAttr;
		
		if (label) {
			label.align(this.alignOptions, null, stackBox);	// align the label to the box
				
			// Set visibility (#678)
			alignAttr = label.alignAttr;
			label.attr({ 
				visibility: this.options.crop === false || chart.isInsidePlot(alignAttr.x, alignAttr.y) ? 
					(hasSVG ? 'inherit' : VISIBLE) : 
					HIDDEN
			});
		}
	}
};
/**
 * Create a new axis object
 * @param {Object} chart
 * @param {Object} options
 */
function Axis() {
	this.init.apply(this, arguments);
}

Axis.prototype = {
	
	/**
	 * Default options for the X axis - the Y axis has extended defaults 
	 */
	defaultOptions: {
		// allowDecimals: null,
		// alternateGridColor: null,
		// categories: [],
		dateTimeLabelFormats: {
			millisecond: '%H:%M:%S.%L',
			second: '%H:%M:%S',
			minute: '%H:%M',
			hour: '%H:%M',
			day: '%e. %b',
			week: '%e. %b',
			month: '%b \'%y',
			year: '%Y'
		},
		endOnTick: false,
		gridLineColor: '#C0C0C0',
		// gridLineDashStyle: 'solid',
		// gridLineWidth: 0,
		// reversed: false,
	
		labels: defaultLabelOptions,
			// { step: null },
		lineColor: '#C0D0E0',
		lineWidth: 1,
		//linkedTo: null,
		//max: undefined,
		//min: undefined,
		minPadding: 0.01,
		maxPadding: 0.01,
		//minRange: null,
		minorGridLineColor: '#E0E0E0',
		// minorGridLineDashStyle: null,
		minorGridLineWidth: 1,
		minorTickColor: '#A0A0A0',
		//minorTickInterval: null,
		minorTickLength: 2,
		minorTickPosition: 'outside', // inside or outside
		//minorTickWidth: 0,
		//opposite: false,
		//offset: 0,
		//plotBands: [{
		//	events: {},
		//	zIndex: 1,
		//	labels: { align, x, verticalAlign, y, style, rotation, textAlign }
		//}],
		//plotLines: [{
		//	events: {}
		//  dashStyle: {}
		//	zIndex:
		//	labels: { align, x, verticalAlign, y, style, rotation, textAlign }
		//}],
		//reversed: false,
		// showFirstLabel: true,
		// showLastLabel: true,
		startOfWeek: 1,
		startOnTick: false,
		tickColor: '#C0D0E0',
		//tickInterval: null,
		tickLength: 5,
		tickmarkPlacement: 'between', // on or between
		tickPixelInterval: 100,
		tickPosition: 'outside',
		tickWidth: 1,
		title: {
			//text: null,
			align: 'middle', // low, middle or high
			//margin: 0 for horizontal, 10 for vertical axes,
			//rotation: 0,
			//side: 'outside',
			style: {
				color: '#6D869F',
				//font: defaultFont.replace('normal', 'bold')
				fontWeight: 'bold'
			}
			//x: 0,
			//y: 0
		},
		type: 'linear' // linear, logarithmic or datetime
	},
	
	/**
	 * This options set extends the defaultOptions for Y axes
	 */
	defaultYAxisOptions: {
		endOnTick: true,
		gridLineWidth: 1,
		tickPixelInterval: 72,
		showLastLabel: true,
		labels: {
			align: 'right',
			x: -8,
			y: 3
		},
		lineWidth: 0,
		maxPadding: 0.05,
		minPadding: 0.05,
		startOnTick: true,
		tickWidth: 0,
		title: {
			rotation: 270,
			text: 'Y-values'
		},
		stackLabels: {
			enabled: false,
			//align: dynamic,
			//y: dynamic,
			//x: dynamic,
			//verticalAlign: dynamic,
			//textAlign: dynamic,
			//rotation: 0,
			formatter: function () {
				return this.total;
			},
			style: defaultLabelOptions.style
		}
	},
	
	/**
	 * These options extend the defaultOptions for left axes
	 */
	defaultLeftAxisOptions: {
		labels: {
			align: 'right',
			x: -8,
			y: null
		},
		title: {
			rotation: 270
		}
	},
	
	/**
	 * These options extend the defaultOptions for right axes
	 */
	defaultRightAxisOptions: {
		labels: {
			align: 'left',
			x: 8,
			y: null
		},
		title: {
			rotation: 90
		}
	},
	
	/**
	 * These options extend the defaultOptions for bottom axes
	 */
	defaultBottomAxisOptions: {
		labels: {
			align: 'center',
			x: 0,
			y: 14
			// overflow: undefined,
			// staggerLines: null
		},
		title: {
			rotation: 0
		}
	},
	/**
	 * These options extend the defaultOptions for left axes
	 */
	defaultTopAxisOptions: {
		labels: {
			align: 'center',
			x: 0,
			y: -5
			// overflow: undefined
			// staggerLines: null
		},
		title: {
			rotation: 0
		}
	},
	
	/**
	 * Initialize the axis
	 */
	init: function (chart, userOptions) {
			
		
		var isXAxis = userOptions.isX,
			axis = this;
	
		// Flag, is the axis horizontal
		axis.horiz = chart.inverted ? !isXAxis : isXAxis;
		
		// Flag, isXAxis
		axis.isXAxis = isXAxis;
		axis.xOrY = isXAxis ? 'x' : 'y';
	
	
		axis.opposite = userOptions.opposite; // needed in setOptions
		axis.side = axis.horiz ?
				(axis.opposite ? 0 : 2) : // top : bottom
				(axis.opposite ? 1 : 3);  // right : left
	
		axis.setOptions(userOptions);
		
	
		var options = this.options,
			type = options.type,
			isDatetimeAxis = type === 'datetime';
	
		axis.labelFormatter = options.labels.formatter || axis.defaultLabelFormatter; // can be overwritten by dynamic format
	
	
		// Flag, stagger lines or not
		axis.staggerLines = axis.horiz && options.labels.staggerLines;
		axis.userOptions = userOptions;
	
		//axis.axisTitleMargin = UNDEFINED,// = options.title.margin,
		axis.minPixelPadding = 0;
		//axis.ignoreMinPadding = UNDEFINED; // can be set to true by a column or bar series
		//axis.ignoreMaxPadding = UNDEFINED;
	
		axis.chart = chart;
		axis.reversed = options.reversed;
	
		// Initial categories
		axis.categories = options.categories;
	
		// Elements
		//axis.axisGroup = UNDEFINED;
		//axis.gridGroup = UNDEFINED;
		//axis.axisTitle = UNDEFINED;
		//axis.axisLine = UNDEFINED;
	
		// Flag if type === logarithmic
		axis.isLog = type === 'logarithmic';
	
		// Flag, if axis is linked to another axis
		axis.isLinked = defined(options.linkedTo);
		// Linked axis.
		//axis.linkedParent = UNDEFINED;
	
		// Flag if type === datetime
		axis.isDatetimeAxis = isDatetimeAxis;
	
		// Flag if percentage mode
		//axis.usePercentage = UNDEFINED;
	
		
		// Tick positions
		//axis.tickPositions = UNDEFINED; // array containing predefined positions
		// Tick intervals
		//axis.tickInterval = UNDEFINED;
		//axis.minorTickInterval = UNDEFINED;
		
		axis.tickmarkOffset = (options.categories && options.tickmarkPlacement === 'between') ? 0.5 : 0;
	
		// Major ticks
		axis.ticks = {};
		// Minor ticks
		axis.minorTicks = {};
		//axis.tickAmount = UNDEFINED;
	
		// List of plotLines/Bands
		axis.plotLinesAndBands = [];
	
		// Alternate bands
		axis.alternateBands = {};
	
		// Axis metrics
		//axis.left = UNDEFINED;
		//axis.top = UNDEFINED;
		//axis.width = UNDEFINED;
		//axis.height = UNDEFINED;
		//axis.bottom = UNDEFINED;
		//axis.right = UNDEFINED;
		//axis.transA = UNDEFINED;
		//axis.transB = UNDEFINED;
		//axis.oldTransA = UNDEFINED;
		axis.len = 0;
		//axis.oldMin = UNDEFINED;
		//axis.oldMax = UNDEFINED;
		//axis.oldUserMin = UNDEFINED;
		//axis.oldUserMax = UNDEFINED;
		//axis.oldAxisLength = UNDEFINED;
		axis.minRange = axis.userMinRange = options.minRange || options.maxZoom;
		axis.range = options.range;
		axis.offset = options.offset || 0;
	
	
		// Dictionary for stacks
		axis.stacks = {};
	
		// Min and max in the data
		//axis.dataMin = UNDEFINED,
		//axis.dataMax = UNDEFINED,
	
		// The axis range
		axis.max = null;
		axis.min = null;
	
		// User set min and max
		//axis.userMin = UNDEFINED,
		//axis.userMax = UNDEFINED,

		// Run Axis
		
		var eventType,
			events = axis.options.events;

		// Register
		chart.axes.push(axis);
		chart[isXAxis ? 'xAxis' : 'yAxis'].push(axis);

		axis.series = []; // populated by Series

		// inverted charts have reversed xAxes as default
		if (chart.inverted && isXAxis && axis.reversed === UNDEFINED) {
			axis.reversed = true;
		}

		axis.removePlotBand = axis.removePlotBandOrLine;
		axis.removePlotLine = axis.removePlotBandOrLine;
		axis.addPlotBand = axis.addPlotBandOrLine;
		axis.addPlotLine = axis.addPlotBandOrLine;


		// register event listeners
		for (eventType in events) {
			addEvent(axis, eventType, events[eventType]);
		}

		// extend logarithmic axis
		if (axis.isLog) {
			axis.val2lin = log2lin;
			axis.lin2val = lin2log;
		}
	},
	
	/**
	 * Merge and set options
	 */
	setOptions: function (userOptions) {
		this.options = merge(
			this.defaultOptions,
			this.isXAxis ? {} : this.defaultYAxisOptions,
			[this.defaultTopAxisOptions, this.defaultRightAxisOptions,
				this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side],
			merge(
				defaultOptions[this.isXAxis ? 'xAxis' : 'yAxis'], // if set in setOptions (#1053)
				userOptions
			)
		);
	},
	
	
	/** 
	 * The default label formatter. The context is a special config object for the label.
	 */
	defaultLabelFormatter: function () {
		var axis = this.axis,
			value = this.value,
			categories = axis.categories, 
			dateTimeLabelFormat = this.dateTimeLabelFormat,
			numericSymbols = defaultOptions.lang.numericSymbols,
			i = numericSymbols && numericSymbols.length,
			multi,
			ret,
			
			// make sure the same symbol is added for all labels on a linear axis
			numericSymbolDetector = axis.isLog ? value : axis.tickInterval;

		if (categories) {
			ret = value;
		
		} else if (dateTimeLabelFormat) { // datetime axis
			ret = dateFormat(dateTimeLabelFormat, value);
		
		} else if (i && numericSymbolDetector >= 1000) {
			// Decide whether we should add a numeric symbol like k (thousands) or M (millions).
			// If we are to enable this in tooltip or other places as well, we can move this
			// logic to the numberFormatter and enable it by a parameter.
			while (i-- && ret === UNDEFINED) {
				multi = Math.pow(1000, i + 1);
				if (numericSymbolDetector >= multi && numericSymbols[i] !== null) {
					ret = numberFormat(value / multi, -1) + numericSymbols[i];
				}
			}
		}
		
		if (ret === UNDEFINED) {
			if (value >= 1000) { // add thousands separators
				ret = numberFormat(value, 0);

			} else { // small numbers
				ret = numberFormat(value, -1);
			}
		}
		
		return ret;
	},
	
	/**
	 * Get the minimum and maximum for the series of each axis
	 */
	getSeriesExtremes: function () {
		var axis = this,
			chart = axis.chart,
			stacks = axis.stacks,
			posStack = [],
			negStack = [],
			i;
		
		axis.hasVisibleSeries = false;

		// reset dataMin and dataMax in case we're redrawing
		axis.dataMin = axis.dataMax = null;

		// loop through this axis' series
		each(axis.series, function (series) {

			if (series.visible || !chart.options.chart.ignoreHiddenSeries) {

				var seriesOptions = series.options,
					stacking,
					posPointStack,
					negPointStack,
					stackKey,
					stackOption,
					negKey,
					xData,
					yData,
					x,
					y,
					threshold = seriesOptions.threshold,
					yDataLength,
					activeYData = [],
					activeCounter = 0;
					
				axis.hasVisibleSeries = true;	
					
				// Validate threshold in logarithmic axes
				if (axis.isLog && threshold <= 0) {
					threshold = seriesOptions.threshold = null;
				}

				// Get dataMin and dataMax for X axes
				if (axis.isXAxis) {
					xData = series.xData;
					if (xData.length) {
						axis.dataMin = mathMin(pick(axis.dataMin, xData[0]), arrayMin(xData));
						axis.dataMax = mathMax(pick(axis.dataMax, xData[0]), arrayMax(xData));
					}

				// Get dataMin and dataMax for Y axes, as well as handle stacking and processed data
				} else {
					var isNegative,
						pointStack,
						key,
						cropped = series.cropped,
						xExtremes = series.xAxis.getExtremes(),
						//findPointRange,
						//pointRange,
						j,
						hasModifyValue = !!series.modifyValue;


					// Handle stacking
					stacking = seriesOptions.stacking;
					axis.usePercentage = stacking === 'percent';

					// create a stack for this particular series type
					if (stacking) {
						stackOption = seriesOptions.stack;
						stackKey = series.type + pick(stackOption, '');
						negKey = '-' + stackKey;
						series.stackKey = stackKey; // used in translate

						posPointStack = posStack[stackKey] || []; // contains the total values for each x
						posStack[stackKey] = posPointStack;

						negPointStack = negStack[negKey] || [];
						negStack[negKey] = negPointStack;
					}
					if (axis.usePercentage) {
						axis.dataMin = 0;
						axis.dataMax = 99;
					}

					// processData can alter series.pointRange, so this goes after
					//findPointRange = series.pointRange === null;

					xData = series.processedXData;
					yData = series.processedYData;
					yDataLength = yData.length;

					// loop over the non-null y values and read them into a local array
					for (i = 0; i < yDataLength; i++) {
						x = xData[i];
						y = yData[i];
						
						// Read stacked values into a stack based on the x value,
						// the sign of y and the stack key. Stacking is also handled for null values (#739)
						if (stacking) {
							isNegative = y < threshold;
							pointStack = isNegative ? negPointStack : posPointStack;
							key = isNegative ? negKey : stackKey;

							y = pointStack[x] =
								defined(pointStack[x]) ?
									correctFloat(pointStack[x] + y) : 
									y;


							// add the series
							if (!stacks[key]) {
								stacks[key] = {};
							}

							// If the StackItem is there, just update the values,
							// if not, create one first
							if (!stacks[key][x]) {
								stacks[key][x] = new StackItem(axis, axis.options.stackLabels, isNegative, x, stackOption, stacking);
							}
							stacks[key][x].setTotal(y);
						}
						
						// Handle non null values
						if (y !== null && y !== UNDEFINED) {							

							// general hook, used for Highstock compare values feature
							if (hasModifyValue) {
								y = series.modifyValue(y);
							}

							// for points within the visible range, including the first point outside the
							// visible range, consider y extremes
							if (cropped || ((xData[i + 1] || x) >= xExtremes.min && (xData[i - 1] || x) <= xExtremes.max)) {

								j = y.length;
								if (j) { // array, like ohlc or range data
									while (j--) {
										if (y[j] !== null) {
											activeYData[activeCounter++] = y[j];
										}
									}
								} else {
									activeYData[activeCounter++] = y;
								}
							}
						}
					}

					// record the least unit distance
					/*if (findPointRange) {
						series.pointRange = pointRange || 1;
					}
					series.closestPointRange = pointRange;*/

					// Get the dataMin and dataMax so far. If percentage is used, the min and max are
					// always 0 and 100. If the length of activeYData is 0, continue with null values.
					if (!axis.usePercentage && activeYData.length) {
						axis.dataMin = mathMin(pick(axis.dataMin, activeYData[0]), arrayMin(activeYData));
						axis.dataMax = mathMax(pick(axis.dataMax, activeYData[0]), arrayMax(activeYData));
					}

					// Adjust to threshold
					if (defined(threshold)) {
						if (axis.dataMin >= threshold) {
							axis.dataMin = threshold;
							axis.ignoreMinPadding = true;
						} else if (axis.dataMax < threshold) {
							axis.dataMax = threshold;
							axis.ignoreMaxPadding = true;
						}
					}
				}
			}
		});
		
	},

	/**
	 * Translate from axis value to pixel position on the chart, or back
	 *
	 */
	translate: function (val, backwards, cvsCoord, old, handleLog, pointPlacementBetween) {
		var axis = this,
			axisLength = axis.len,
			sign = 1,
			cvsOffset = 0,
			localA = old ? axis.oldTransA : axis.transA,
			localMin = old ? axis.oldMin : axis.min,
			returnValue,
			postTranslate = axis.options.ordinal || (axis.isLog && handleLog);

		if (!localA) {
			localA = axis.transA;
		}

		if (cvsCoord) {
			sign *= -1; // canvas coordinates inverts the value
			cvsOffset = axisLength;
		}
		if (axis.reversed) { // reversed axis
			sign *= -1;
			cvsOffset -= sign * axisLength;
		}

		if (backwards) { // reverse translation
			if (axis.reversed) {
				val = axisLength - val;
			}
			returnValue = val / localA + localMin; // from chart pixel to value
			if (postTranslate) { // log and ordinal axes
				returnValue = axis.lin2val(returnValue);
			}

		} else { // normal translation, from axis value to pixel, relative to plot
			if (postTranslate) { // log and ordinal axes
				val = axis.val2lin(val);
			}

			returnValue = sign * (val - localMin) * localA + cvsOffset + (sign * axis.minPixelPadding) +
				(pointPlacementBetween ? localA * axis.pointRange / 2 : 0);
		}

		return returnValue;
	},

	/**
	 * Create the path for a plot line that goes from the given value on
	 * this axis, across the plot to the opposite side
	 * @param {Number} value
	 * @param {Number} lineWidth Used for calculation crisp line
	 * @param {Number] old Use old coordinates (for resizing and rescaling)
	 */
	getPlotLinePath: function (value, lineWidth, old) {
		var axis = this,
			chart = axis.chart,
			axisLeft = axis.left,
			axisTop = axis.top,
			x1,
			y1,
			x2,
			y2,
			translatedValue = axis.translate(value, null, null, old),
			cHeight = (old && chart.oldChartHeight) || chart.chartHeight,
			cWidth = (old && chart.oldChartWidth) || chart.chartWidth,
			skip,
			transB = axis.transB;

		x1 = x2 = mathRound(translatedValue + transB);
		y1 = y2 = mathRound(cHeight - translatedValue - transB);

		if (isNaN(translatedValue)) { // no min or max
			skip = true;

		} else if (axis.horiz) {
			y1 = axisTop;
			y2 = cHeight - axis.bottom;
			if (x1 < axisLeft || x1 > axisLeft + axis.width) {
				skip = true;
			}
		} else {
			x1 = axisLeft;
			x2 = cWidth - axis.right;

			if (y1 < axisTop || y1 > axisTop + axis.height) {
				skip = true;
			}
		}
		return skip ?
			null :
			chart.renderer.crispLine([M, x1, y1, L, x2, y2], lineWidth || 0);
	},
	
	/**
	 * Create the path for a plot band
	 */
	getPlotBandPath: function (from, to) {

		var toPath = this.getPlotLinePath(to),
			path = this.getPlotLinePath(from);
			
		if (path && toPath) {
			path.push(
				toPath[4],
				toPath[5],
				toPath[1],
				toPath[2]
			);
		} else { // outside the axis area
			path = null;
		}
		
		return path;
	},
	
	/**
	 * Set the tick positions of a linear axis to round values like whole tens or every five.
	 */
	getLinearTickPositions: function (tickInterval, min, max) {
		var pos,
			lastPos,
			roundedMin = correctFloat(mathFloor(min / tickInterval) * tickInterval),
			roundedMax = correctFloat(mathCeil(max / tickInterval) * tickInterval),
			tickPositions = [];

		// Populate the intermediate values
		pos = roundedMin;
		while (pos <= roundedMax) {

			// Place the tick on the rounded value
			tickPositions.push(pos);

			// Always add the raw tickInterval, not the corrected one.
			pos = correctFloat(pos + tickInterval);

			// If the interval is not big enough in the current min - max range to actually increase
			// the loop variable, we need to break out to prevent endless loop. Issue #619
			if (pos === lastPos) {
				break;
			}

			// Record the last value
			lastPos = pos;
		}
		return tickPositions;
	},
	
	/**
	 * Set the tick positions of a logarithmic axis
	 */
	getLogTickPositions: function (interval, min, max, minor) {
		var axis = this,
			options = axis.options,
			axisLength = axis.len;

		// Since we use this method for both major and minor ticks,
		// use a local variable and return the result
		var positions = []; 
		
		// Reset
		if (!minor) {
			axis._minorAutoInterval = null;
		}
		
		// First case: All ticks fall on whole logarithms: 1, 10, 100 etc.
		if (interval >= 0.5) {
			interval = mathRound(interval);
			positions = axis.getLinearTickPositions(interval, min, max);
			
		// Second case: We need intermediary ticks. For example 
		// 1, 2, 4, 6, 8, 10, 20, 40 etc. 
		} else if (interval >= 0.08) {
			var roundedMin = mathFloor(min),
				intermediate,
				i,
				j,
				len,
				pos,
				lastPos,
				break2;
				
			if (interval > 0.3) {
				intermediate = [1, 2, 4];
			} else if (interval > 0.15) { // 0.2 equals five minor ticks per 1, 10, 100 etc
				intermediate = [1, 2, 4, 6, 8];
			} else { // 0.1 equals ten minor ticks per 1, 10, 100 etc
				intermediate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			}
			
			for (i = roundedMin; i < max + 1 && !break2; i++) {
				len = intermediate.length;
				for (j = 0; j < len && !break2; j++) {
					pos = log2lin(lin2log(i) * intermediate[j]);
					
					if (pos > min) {
						positions.push(lastPos);
					}
					
					if (lastPos > max) {
						break2 = true;
					}
					lastPos = pos;
				}
			}
			
		// Third case: We are so deep in between whole logarithmic values that
		// we might as well handle the tick positions like a linear axis. For
		// example 1.01, 1.02, 1.03, 1.04.
		} else {
			var realMin = lin2log(min),
				realMax = lin2log(max),
				tickIntervalOption = options[minor ? 'minorTickInterval' : 'tickInterval'],
				filteredTickIntervalOption = tickIntervalOption === 'auto' ? null : tickIntervalOption,
				tickPixelIntervalOption = options.tickPixelInterval / (minor ? 5 : 1),
				totalPixelLength = minor ? axisLength / axis.tickPositions.length : axisLength;
			
			interval = pick(
				filteredTickIntervalOption,
				axis._minorAutoInterval,
				(realMax - realMin) * tickPixelIntervalOption / (totalPixelLength || 1)
			);
			
			interval = normalizeTickInterval(
				interval, 
				null, 
				math.pow(10, mathFloor(math.log(interval) / math.LN10))
			);
			
			positions = map(axis.getLinearTickPositions(
				interval, 
				realMin,
				realMax	
			), log2lin);
			
			if (!minor) {
				axis._minorAutoInterval = interval / 5;
			}
		}
		
		// Set the axis-level tickInterval variable 
		if (!minor) {
			axis.tickInterval = interval;
		}
		return positions;
	},

	/**
	 * Return the minor tick positions. For logarithmic axes, reuse the same logic
	 * as for major ticks.
	 */
	getMinorTickPositions: function () {
		var axis = this,
			tickPositions = axis.tickPositions,
			minorTickInterval = axis.minorTickInterval;

		var minorTickPositions = [],
			pos,
			i,
			len;
		
		if (axis.isLog) {
			len = tickPositions.length;
			for (i = 1; i < len; i++) {
				minorTickPositions = minorTickPositions.concat(
					axis.getLogTickPositions(minorTickInterval, tickPositions[i - 1], tickPositions[i], true)
				);	
			}
		
		} else {			
			for (pos = axis.min + (tickPositions[0] - axis.min) % minorTickInterval; pos <= axis.max; pos += minorTickInterval) {
				minorTickPositions.push(pos);	
			}
		}
		
		return minorTickPositions;
	},

	/**
	 * Adjust the min and max for the minimum range. Keep in mind that the series data is 
	 * not yet processed, so we don't have information on data cropping and grouping, or 
	 * updated axis.pointRange or series.pointRange. The data can't be processed until
	 * we have finally established min and max.
	 */
	adjustForMinRange: function () {
		var axis = this,
			options = axis.options,
			min = axis.min,
			max = axis.max,
			zoomOffset,
			spaceAvailable = axis.dataMax - axis.dataMin >= axis.minRange,
			closestDataRange,
			i,
			distance,
			xData,
			loopLength,
			minArgs,
			maxArgs;

		// Set the automatic minimum range based on the closest point distance
		if (axis.isXAxis && axis.minRange === UNDEFINED && !axis.isLog) {

			if (defined(options.min) || defined(options.max)) {
				axis.minRange = null; // don't do this again

			} else {

				// Find the closest distance between raw data points, as opposed to
				// closestPointRange that applies to processed points (cropped and grouped)
				each(axis.series, function (series) {
					xData = series.xData;
					loopLength = series.xIncrement ? 1 : xData.length - 1;
					for (i = loopLength; i > 0; i--) {
						distance = xData[i] - xData[i - 1];
						if (closestDataRange === UNDEFINED || distance < closestDataRange) {
							closestDataRange = distance;
						}
					}
				});
				axis.minRange = mathMin(closestDataRange * 5, axis.dataMax - axis.dataMin);
			}
		}

		// if minRange is exceeded, adjust
		if (max - min < axis.minRange) {
			var minRange = axis.minRange;
			zoomOffset = (minRange - max + min) / 2;

			// if min and max options have been set, don't go beyond it
			minArgs = [min - zoomOffset, pick(options.min, min - zoomOffset)];
			if (spaceAvailable) { // if space is available, stay within the data range
				minArgs[2] = axis.dataMin;
			}
			min = arrayMax(minArgs);

			maxArgs = [min + minRange, pick(options.max, min + minRange)];
			if (spaceAvailable) { // if space is availabe, stay within the data range
				maxArgs[2] = axis.dataMax;
			}

			max = arrayMin(maxArgs);

			// now if the max is adjusted, adjust the min back
			if (max - min < minRange) {
				minArgs[0] = max - minRange;
				minArgs[1] = pick(options.min, max - minRange);
				min = arrayMax(minArgs);
			}
		}
		
		// Record modified extremes
		axis.min = min;
		axis.max = max;
	},

	/**
	 * Update translation information
	 */
	setAxisTranslation: function () {
		var axis = this,
			range = axis.max - axis.min,
			pointRange = 0,
			closestPointRange,
			minPointOffset = 0,
			pointRangePadding = 0,
			linkedParent = axis.linkedParent,
			transA = axis.transA;

		// adjust translation for padding
		if (axis.isXAxis) {
			if (linkedParent) {
				minPointOffset = linkedParent.minPointOffset;
				pointRangePadding = linkedParent.pointRangePadding;
				
			} else {
				each(axis.series, function (series) {
					var seriesPointRange = series.pointRange,
						pointPlacement = series.options.pointPlacement,
						seriesClosestPointRange = series.closestPointRange;
						
					pointRange = mathMax(pointRange, seriesPointRange);
					
					// minPointOffset is the value padding to the left of the axis in order to make
					// room for points with a pointRange, typically columns. When the pointPlacement option
					// is 'between' or 'on', this padding does not apply.
					minPointOffset = mathMax(
						minPointOffset, 
						pointPlacement ? 0 : seriesPointRange / 2
					);
					
					// Determine the total padding needed to the length of the axis to make room for the 
					// pointRange. If the series' pointPlacement is 'on', no padding is added.
					pointRangePadding = mathMax(
						pointRangePadding,
						pointPlacement === 'on' ? 0 : seriesPointRange
					);

					// Set the closestPointRange
					if (!series.noSharedTooltip && defined(seriesClosestPointRange)) {
						closestPointRange = defined(closestPointRange) ?
							mathMin(closestPointRange, seriesClosestPointRange) :
							seriesClosestPointRange;
					}
				});
			}
			
			// Record minPointOffset and pointRangePadding
			axis.minPointOffset = minPointOffset;
			axis.pointRangePadding = pointRangePadding;

			// pointRange means the width reserved for each point, like in a column chart
			axis.pointRange = pointRange;

			// closestPointRange means the closest distance between points. In columns
			// it is mostly equal to pointRange, but in lines pointRange is 0 while closestPointRange
			// is some other value
			axis.closestPointRange = closestPointRange;
		}

		// secondary values
		axis.oldTransA = transA;
		//axis.translationSlope = axis.transA = transA = axis.len / ((range + (2 * minPointOffset)) || 1);
		axis.translationSlope = axis.transA = transA = axis.len / ((range + pointRangePadding) || 1);
		axis.transB = axis.horiz ? axis.left : axis.bottom; // translation addend
		axis.minPixelPadding = transA * minPointOffset;
	},

	/**
	 * Set the tick positions to round values and optionally extend the extremes
	 * to the nearest tick
	 */
	setTickPositions: function (secondPass) {
		var axis = this,
			chart = axis.chart,
			options = axis.options,
			isLog = axis.isLog,
			isDatetimeAxis = axis.isDatetimeAxis,
			isXAxis = axis.isXAxis,
			isLinked = axis.isLinked,
			tickPositioner = axis.options.tickPositioner,
			magnitude,
			maxPadding = options.maxPadding,
			minPadding = options.minPadding,
			length,
			linkedParentExtremes,
			tickIntervalOption = options.tickInterval,
			minTickIntervalOption = options.minTickInterval,
			tickPixelIntervalOption = options.tickPixelInterval,
			tickPositions,
			categories = axis.categories;

		// linked axis gets the extremes from the parent axis
		if (isLinked) {
			axis.linkedParent = chart[isXAxis ? 'xAxis' : 'yAxis'][options.linkedTo];
			linkedParentExtremes = axis.linkedParent.getExtremes();
			axis.min = pick(linkedParentExtremes.min, linkedParentExtremes.dataMin);
			axis.max = pick(linkedParentExtremes.max, linkedParentExtremes.dataMax);
			if (options.type !== axis.linkedParent.options.type) {
				error(11, 1); // Can't link axes of different type
			}
		} else { // initial min and max from the extreme data values
			axis.min = pick(axis.userMin, options.min, axis.dataMin);
			axis.max = pick(axis.userMax, options.max, axis.dataMax);
		}

		if (isLog) {
			if (!secondPass && mathMin(axis.min, pick(axis.dataMin, axis.min)) <= 0) { // #978
				error(10, 1); // Can't plot negative values on log axis
			}
			axis.min = correctFloat(log2lin(axis.min)); // correctFloat cures #934
			axis.max = correctFloat(log2lin(axis.max));
		}

		// handle zoomed range
		if (axis.range) {
			axis.userMin = axis.min = mathMax(axis.min, axis.max - axis.range); // #618
			axis.userMax = axis.max;
			if (secondPass) {
				axis.range = null;  // don't use it when running setExtremes
			}
		}

		// adjust min and max for the minimum range
		axis.adjustForMinRange();

		// pad the values to get clear of the chart's edges
		if (!categories && !axis.usePercentage && !isLinked && defined(axis.min) && defined(axis.max)) {
			length = (axis.max - axis.min) || 1;
			if (!defined(options.min) && !defined(axis.userMin) && minPadding && (axis.dataMin < 0 || !axis.ignoreMinPadding)) {
				axis.min -= length * minPadding;
			}
			if (!defined(options.max) && !defined(axis.userMax)  && maxPadding && (axis.dataMax > 0 || !axis.ignoreMaxPadding)) {
				axis.max += length * maxPadding;
			}
		}

		// get tickInterval
		if (axis.min === axis.max || axis.min === undefined || axis.max === undefined) {
			axis.tickInterval = 1;
		} else if (isLinked && !tickIntervalOption &&
				tickPixelIntervalOption === axis.linkedParent.options.tickPixelInterval) {
			axis.tickInterval = axis.linkedParent.tickInterval;
		} else {
			axis.tickInterval = pick(
				tickIntervalOption,
				categories ? // for categoried axis, 1 is default, for linear axis use tickPix
					1 :
					(axis.max - axis.min) * tickPixelIntervalOption / (axis.len || 1)
			);
		}

		// Now we're finished detecting min and max, crop and group series data. This
		// is in turn needed in order to find tick positions in ordinal axes. 
		if (isXAxis && !secondPass) {
			each(axis.series, function (series) {
				series.processData(axis.min !== axis.oldMin || axis.max !== axis.oldMax);
			});
		}

		// set the translation factor used in translate function
		axis.setAxisTranslation(secondPass);

		// hook for ordinal axes and radial axes
		if (axis.beforeSetTickPositions) {
			axis.beforeSetTickPositions();
		}
		
		// hook for extensions, used in Highstock ordinal axes
		if (axis.postProcessTickInterval) {
			axis.tickInterval = axis.postProcessTickInterval(axis.tickInterval);
		}
		
		// Before normalizing the tick interval, handle minimum tick interval. This applies only if tickInterval is not defined.
		if (!tickIntervalOption && axis.tickInterval < minTickIntervalOption) {
			axis.tickInterval = minTickIntervalOption;
		}

		// for linear axes, get magnitude and normalize the interval
		if (!isDatetimeAxis && !isLog) { // linear
			magnitude = math.pow(10, mathFloor(math.log(axis.tickInterval) / math.LN10));
			if (!tickIntervalOption) {
				axis.tickInterval = normalizeTickInterval(axis.tickInterval, null, magnitude, options);
			}
		}

		// get minorTickInterval
		axis.minorTickInterval = options.minorTickInterval === 'auto' && axis.tickInterval ?
				axis.tickInterval / 5 : options.minorTickInterval;

		// find the tick positions
		axis.tickPositions = tickPositions = options.tickPositions || (tickPositioner && tickPositioner.apply(axis, [axis.min, axis.max]));
		if (!tickPositions) {
			if (isDatetimeAxis) {
				tickPositions = (axis.getNonLinearTimeTicks || getTimeTicks)(
					normalizeTimeTickInterval(axis.tickInterval, options.units),
					axis.min,
					axis.max,
					options.startOfWeek,
					axis.ordinalPositions,
					axis.closestPointRange,
					true
				);
			} else if (isLog) {
				tickPositions = axis.getLogTickPositions(axis.tickInterval, axis.min, axis.max);
			} else {
				tickPositions = axis.getLinearTickPositions(axis.tickInterval, axis.min, axis.max);
			}
			axis.tickPositions = tickPositions;
		}

		if (!isLinked) {

			// reset min/max or remove extremes based on start/end on tick
			var roundedMin = tickPositions[0],
				roundedMax = tickPositions[tickPositions.length - 1],
				minPointOffset = axis.minPointOffset || 0;

			if (options.startOnTick) {
				axis.min = roundedMin;
			} else if (axis.min - minPointOffset > roundedMin) {
				tickPositions.shift();
			}

			if (options.endOnTick) {
				axis.max = roundedMax;
			} else if (axis.max + minPointOffset < roundedMax) {
				tickPositions.pop();
			}
			
		}
	},
	
	/**
	 * Set the max ticks of either the x and y axis collection
	 */
	setMaxTicks: function () {
		
		var chart = this.chart,
			maxTicks = chart.maxTicks,
			tickPositions = this.tickPositions,
			xOrY = this.xOrY;
		
		if (!maxTicks) { // first call, or maxTicks have been reset after a zoom operation
			maxTicks = {
				x: 0,
				y: 0
			};
		}

		if (!this.isLinked && !this.isDatetimeAxis && tickPositions.length > maxTicks[xOrY] && this.options.alignTicks !== false) {
			maxTicks[xOrY] = tickPositions.length;
		}
		chart.maxTicks = maxTicks;
	},

	/**
	 * When using multiple axes, adjust the number of ticks to match the highest
	 * number of ticks in that group
	 */
	adjustTickAmount: function () {
		var axis = this,
			chart = axis.chart,
			xOrY = axis.xOrY,
			tickPositions = axis.tickPositions,
			maxTicks = chart.maxTicks;

		if (maxTicks && maxTicks[xOrY] && !axis.isDatetimeAxis && !axis.categories && !axis.isLinked && axis.options.alignTicks !== false) { // only apply to linear scale
			var oldTickAmount = axis.tickAmount,
				calculatedTickAmount = tickPositions.length,
				tickAmount;

			// set the axis-level tickAmount to use below
			axis.tickAmount = tickAmount = maxTicks[xOrY];

			if (calculatedTickAmount < tickAmount) {
				while (tickPositions.length < tickAmount) {
					tickPositions.push(correctFloat(
						tickPositions[tickPositions.length - 1] + axis.tickInterval
					));
				}
				axis.transA *= (calculatedTickAmount - 1) / (tickAmount - 1);
				axis.max = tickPositions[tickPositions.length - 1];

			}
			if (defined(oldTickAmount) && tickAmount !== oldTickAmount) {
				axis.isDirty = true;
			}
		}
	},

	/**
	 * Set the scale based on data min and max, user set min and max or options
	 *
	 */
	setScale: function () {
		var axis = this,
			stacks = axis.stacks,
			type,
			i,
			isDirtyData,
			isDirtyAxisLength;

		axis.oldMin = axis.min;
		axis.oldMax = axis.max;
		axis.oldAxisLength = axis.len;

		// set the new axisLength
		axis.setAxisSize();
		//axisLength = horiz ? axisWidth : axisHeight;
		isDirtyAxisLength = axis.len !== axis.oldAxisLength;

		// is there new data?
		each(axis.series, function (series) {
			if (series.isDirtyData || series.isDirty ||
					series.xAxis.isDirty) { // when x axis is dirty, we need new data extremes for y as well
				isDirtyData = true;
			}
		});
		
		// do we really need to go through all this?
		if (isDirtyAxisLength || isDirtyData || axis.isLinked ||
			axis.userMin !== axis.oldUserMin || axis.userMax !== axis.oldUserMax) {

			// get data extremes if needed
			axis.getSeriesExtremes();

			// get fixed positions based on tickInterval
			axis.setTickPositions();

			// record old values to decide whether a rescale is necessary later on (#540)
			axis.oldUserMin = axis.userMin;
			axis.oldUserMax = axis.userMax;

			// Mark as dirty if it is not already set to dirty and extremes have changed. #595.
			if (!axis.isDirty) {
				axis.isDirty = isDirtyAxisLength || axis.min !== axis.oldMin || axis.max !== axis.oldMax;
			}
		}
		
		
		// reset stacks
		if (!axis.isXAxis) {
			for (type in stacks) {
				for (i in stacks[type]) {
					stacks[type][i].cum = stacks[type][i].total;
				}
			}
		}
		
		// Set the maximum tick amount
		axis.setMaxTicks();
	},

	/**
	 * Set the extremes and optionally redraw
	 * @param {Number} newMin
	 * @param {Number} newMax
	 * @param {Boolean} redraw
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 * @param {Object} eventArguments 
	 *
	 */
	setExtremes: function (newMin, newMax, redraw, animation, eventArguments) {
		var axis = this,
			chart = axis.chart;

		redraw = pick(redraw, true); // defaults to true

		// Extend the arguments with min and max
		eventArguments = extend(eventArguments, {
			min: newMin,
			max: newMax
		});

		// Fire the event
		fireEvent(axis, 'setExtremes', eventArguments, function () { // the default event handler

			axis.userMin = newMin;
			axis.userMax = newMax;

			// Mark for running afterSetExtremes
			axis.isDirtyExtremes = true;

			// redraw
			if (redraw) {
				chart.redraw(animation);
			}
		});
	},
	
	/**
	 * Overridable method for zooming chart. Pulled out in a separate method to allow overriding
	 * in stock charts.
	 */
	zoom: function (newMin, newMax) {
		this.setExtremes(newMin, newMax, false, UNDEFINED, { trigger: 'zoom' });
		return true;
	},
	
	/**
	 * Update the axis metrics
	 */
	setAxisSize: function () {
		var axis = this,
			chart = axis.chart,
			options = axis.options;

		var offsetLeft = options.offsetLeft || 0,
			offsetRight = options.offsetRight || 0;

		// basic values
		// expose to use in Series object and navigator
		axis.left = pick(options.left, chart.plotLeft + offsetLeft);
		axis.top = pick(options.top, chart.plotTop);
		axis.width = pick(options.width, chart.plotWidth - offsetLeft + offsetRight);
		axis.height = pick(options.height, chart.plotHeight);
		axis.bottom = chart.chartHeight - axis.height - axis.top;
		axis.right = chart.chartWidth - axis.width - axis.left;
		axis.len = mathMax(axis.horiz ? axis.width : axis.height, 0); // mathMax fixes #905
	},

	/**
	 * Get the actual axis extremes
	 */
	getExtremes: function () {
		var axis = this,
			isLog = axis.isLog;

		return {
			min: isLog ? correctFloat(lin2log(axis.min)) : axis.min,
			max: isLog ? correctFloat(lin2log(axis.max)) : axis.max,
			dataMin: axis.dataMin,
			dataMax: axis.dataMax,
			userMin: axis.userMin,
			userMax: axis.userMax
		};
	},

	/**
	 * Get the zero plane either based on zero or on the min or max value.
	 * Used in bar and area plots
	 */
	getThreshold: function (threshold) {
		var axis = this,
			isLog = axis.isLog;

		var realMin = isLog ? lin2log(axis.min) : axis.min,
			realMax = isLog ? lin2log(axis.max) : axis.max;
		
		if (realMin > threshold || threshold === null) {
			threshold = realMin;
		} else if (realMax < threshold) {
			threshold = realMax;
		}

		return axis.translate(threshold, 0, 1, 0, 1);
	},

	/**
	 * Add a plot band or plot line after render time
	 *
	 * @param options {Object} The plotBand or plotLine configuration object
	 */
	addPlotBandOrLine: function (options) {
		var obj = new PlotLineOrBand(this, options).render();
		this.plotLinesAndBands.push(obj);
		return obj;
	},

	/**
	 * Render the tick labels to a preliminary position to get their sizes
	 */
	getOffset: function () {
		var axis = this,
			chart = axis.chart,
			renderer = chart.renderer,
			options = axis.options,
			tickPositions = axis.tickPositions,
			ticks = axis.ticks,
			horiz = axis.horiz,
			side = axis.side,
			hasData,
			showAxis,
			titleOffset = 0,
			titleOffsetOption,
			titleMargin = 0,
			axisTitleOptions = options.title,
			labelOptions = options.labels,
			labelOffset = 0, // reset
			axisOffset = chart.axisOffset,
			directionFactor = [-1, 1, 1, -1][side],
			n;
			
			
		// For reuse in Axis.render
		axis.hasData = hasData = (axis.hasVisibleSeries || (defined(axis.min) && defined(axis.max) && !!tickPositions));
		axis.showAxis = showAxis = hasData || pick(options.showEmpty, true);
		
		
		// Create the axisGroup and gridGroup elements on first iteration
		if (!axis.axisGroup) {
			axis.gridGroup = renderer.g('grid')
				.attr({ zIndex: options.gridZIndex || 1 })
				.add();
			axis.axisGroup = renderer.g('axis')
				.attr({ zIndex: options.zIndex || 2 })
				.add();
			axis.labelGroup = renderer.g('axis-labels')
				.attr({ zIndex: labelOptions.zIndex || 7 })
				.add();
		}

		if (hasData || axis.isLinked) {
			each(tickPositions, function (pos) {
				if (!ticks[pos]) {
					ticks[pos] = new Tick(axis, pos);
				} else {
					ticks[pos].addLabel(); // update labels depending on tick interval
				}

			});

			each(tickPositions, function (pos) {
				// left side must be align: right and right side must have align: left for labels
				if (side === 0 || side === 2 || { 1: 'left', 3: 'right' }[side] === labelOptions.align) {

					// get the highest offset
					labelOffset = mathMax(
						ticks[pos].getLabelSize(),
						labelOffset
					);
				}

			});

			if (axis.staggerLines) {
				labelOffset += (axis.staggerLines - 1) * 16;
			}

		} else { // doesn't have data
			for (n in ticks) {
				ticks[n].destroy();
				delete ticks[n];
			}
		}

		if (axisTitleOptions && axisTitleOptions.text) {
			if (!axis.axisTitle) {
				axis.axisTitle = renderer.text(
					axisTitleOptions.text,
					0,
					0,
					axisTitleOptions.useHTML
				)
				.attr({
					zIndex: 7,
					rotation: axisTitleOptions.rotation || 0,
					align:
						axisTitleOptions.textAlign ||
						{ low: 'left', middle: 'center', high: 'right' }[axisTitleOptions.align]
				})
				.css(axisTitleOptions.style)
				.add(axis.axisGroup);
				axis.axisTitle.isNew = true;
			}

			if (showAxis) {
				titleOffset = axis.axisTitle.getBBox()[horiz ? 'height' : 'width'];
				titleMargin = pick(axisTitleOptions.margin, horiz ? 5 : 10);
				titleOffsetOption = axisTitleOptions.offset;
			}

			// hide or show the title depending on whether showEmpty is set
			axis.axisTitle[showAxis ? 'show' : 'hide']();
		}
		
		// handle automatic or user set offset
		axis.offset = directionFactor * pick(options.offset, axisOffset[side]);
		
		
		axis.axisTitleMargin =
			pick(titleOffsetOption,
				labelOffset + titleMargin +
				(side !== 2 && labelOffset && directionFactor * options.labels[horiz ? 'y' : 'x'])
			);

		axisOffset[side] = mathMax(
			axisOffset[side],
			axis.axisTitleMargin + titleOffset + directionFactor * axis.offset
		);

	},
	
	/**
	 * Get the path for the axis line
	 */
	getLinePath: function (lineWidth) {
		var chart = this.chart,
			opposite = this.opposite,
			offset = this.offset,
			horiz = this.horiz,
			lineLeft = this.left + (opposite ? this.width : 0) + offset,
			lineTop = chart.chartHeight - this.bottom - (opposite ? this.height : 0) + offset;
			
		this.lineTop = lineTop; // used by flag series

		return chart.renderer.crispLine([
				M,
				horiz ?
					this.left :
					lineLeft,
				horiz ?
					lineTop :
					this.top,
				L,
				horiz ?
					chart.chartWidth - this.right :
					lineLeft,
				horiz ?
					lineTop :
					chart.chartHeight - this.bottom
			], lineWidth);
	},
	
	/**
	 * Position the title
	 */
	getTitlePosition: function () {
		// compute anchor points for each of the title align options
		var horiz = this.horiz,
			axisLeft = this.left,
			axisTop = this.top,
			axisLength = this.len,
			axisTitleOptions = this.options.title,			
			margin = horiz ? axisLeft : axisTop,
			opposite = this.opposite,
			offset = this.offset,
			fontSize = pInt(axisTitleOptions.style.fontSize || 12),
			
			// the position in the length direction of the axis
			alongAxis = {
				low: margin + (horiz ? 0 : axisLength),
				middle: margin + axisLength / 2,
				high: margin + (horiz ? axisLength : 0)
			}[axisTitleOptions.align],
	
			// the position in the perpendicular direction of the axis
			offAxis = (horiz ? axisTop + this.height : axisLeft) +
				(horiz ? 1 : -1) * // horizontal axis reverses the margin
				(opposite ? -1 : 1) * // so does opposite axes
				this.axisTitleMargin +
				(this.side === 2 ? fontSize : 0);

		return {
			x: horiz ?
				alongAxis :
				offAxis + (opposite ? this.width : 0) + offset +
					(axisTitleOptions.x || 0), // x
			y: horiz ?
				offAxis - (opposite ? this.height : 0) + offset :
				alongAxis + (axisTitleOptions.y || 0) // y
		};
	},
	
	/**
	 * Render the axis
	 */
	render: function () {
		var axis = this,
			chart = axis.chart,
			renderer = chart.renderer,
			options = axis.options,
			isLog = axis.isLog,
			isLinked = axis.isLinked,
			tickPositions = axis.tickPositions,
			axisTitle = axis.axisTitle,
			stacks = axis.stacks,
			ticks = axis.ticks,
			minorTicks = axis.minorTicks,
			alternateBands = axis.alternateBands,
			stackLabelOptions = options.stackLabels,
			alternateGridColor = options.alternateGridColor,
			tickmarkOffset = axis.tickmarkOffset,
			lineWidth = options.lineWidth,
			linePath,
			hasRendered = chart.hasRendered,
			slideInTicks = hasRendered && defined(axis.oldMin) && !isNaN(axis.oldMin),
			hasData = axis.hasData,
			showAxis = axis.showAxis,
			from,
			to;

		// If the series has data draw the ticks. Else only the line and title
		if (hasData || isLinked) {

			// minor ticks
			if (axis.minorTickInterval && !axis.categories) {
				each(axis.getMinorTickPositions(), function (pos) {
					if (!minorTicks[pos]) {
						minorTicks[pos] = new Tick(axis, pos, 'minor');
					}

					// render new ticks in old position
					if (slideInTicks && minorTicks[pos].isNew) {
						minorTicks[pos].render(null, true);
					}


					minorTicks[pos].isActive = true;
					minorTicks[pos].render();
				});
			}

			// Major ticks. Pull out the first item and render it last so that
			// we can get the position of the neighbour label. #808.
			each(tickPositions.slice(1).concat([tickPositions[0]]), function (pos, i) {

				// Reorganize the indices
				i = (i === tickPositions.length - 1) ? 0 : i + 1;

				// linked axes need an extra check to find out if
				if (!isLinked || (pos >= axis.min && pos <= axis.max)) {

					if (!ticks[pos]) {
						ticks[pos] = new Tick(axis, pos);
					}

					// render new ticks in old position
					if (slideInTicks && ticks[pos].isNew) {
						ticks[pos].render(i, true);
					}

					ticks[pos].isActive = true;
					ticks[pos].render(i);
				}

			});

			// alternate grid color
			if (alternateGridColor) {
				each(tickPositions, function (pos, i) {
					if (i % 2 === 0 && pos < axis.max) {
						if (!alternateBands[pos]) {
							alternateBands[pos] = new PlotLineOrBand(axis);
						}
						from = pos + tickmarkOffset; // #949
						to = tickPositions[i + 1] !== UNDEFINED ? tickPositions[i + 1] + tickmarkOffset : axis.max;
						alternateBands[pos].options = {
							from: isLog ? lin2log(from) : from,
							to: isLog ? lin2log(to) : to,
							color: alternateGridColor
						};
						alternateBands[pos].render();
						alternateBands[pos].isActive = true;
					}
				});
			}

			// custom plot lines and bands
			if (!axis._addedPlotLB) { // only first time
				each((options.plotLines || []).concat(options.plotBands || []), function (plotLineOptions) {
					//plotLinesAndBands.push(new PlotLineOrBand(plotLineOptions).render());
					axis.addPlotBandOrLine(plotLineOptions);
				});
				axis._addedPlotLB = true;
			}

		} // end if hasData

		// remove inactive ticks
		each([ticks, minorTicks, alternateBands], function (coll) {
			var pos;
			for (pos in coll) {
				if (!coll[pos].isActive) {
					coll[pos].destroy();
					delete coll[pos];
				} else {
					coll[pos].isActive = false; // reset
				}
			}
		});

		// Static items. As the axis group is cleared on subsequent calls
		// to render, these items are added outside the group.
		// axis line
		if (lineWidth) {
			linePath = axis.getLinePath(lineWidth);
			if (!axis.axisLine) {
				axis.axisLine = renderer.path(linePath)
					.attr({
						stroke: options.lineColor,
						'stroke-width': lineWidth,
						zIndex: 7
					})
					.add(axis.axisGroup);
			} else {
				axis.axisLine.animate({ d: linePath });
			}

			// show or hide the line depending on options.showEmpty
			axis.axisLine[showAxis ? 'show' : 'hide']();
		}

		if (axisTitle && showAxis) {
			
			axisTitle[axisTitle.isNew ? 'attr' : 'animate'](
				axis.getTitlePosition()
			);
			axisTitle.isNew = false;
		}

		// Stacked totals:
		if (stackLabelOptions && stackLabelOptions.enabled) {
			var stackKey, oneStack, stackCategory,
				stackTotalGroup = axis.stackTotalGroup;

			// Create a separate group for the stack total labels
			if (!stackTotalGroup) {
				axis.stackTotalGroup = stackTotalGroup =
					renderer.g('stack-labels')
						.attr({
							visibility: VISIBLE,
							zIndex: 6
						})
						.add();
			}

			// plotLeft/Top will change when y axis gets wider so we need to translate the
			// stackTotalGroup at every render call. See bug #506 and #516
			stackTotalGroup.translate(chart.plotLeft, chart.plotTop);

			// Render each stack total
			for (stackKey in stacks) {
				oneStack = stacks[stackKey];
				for (stackCategory in oneStack) {
					oneStack[stackCategory].render(stackTotalGroup);
				}
			}
		}
		// End stacked totals

		axis.isDirty = false;
	},

	/**
	 * Remove a plot band or plot line from the chart by id
	 * @param {Object} id
	 */
	removePlotBandOrLine: function (id) {
		var plotLinesAndBands = this.plotLinesAndBands,
			i = plotLinesAndBands.length;
		while (i--) {
			if (plotLinesAndBands[i].id === id) {
				plotLinesAndBands[i].destroy();
			}
		}
	},

	/**
	 * Update the axis title by options
	 */
	setTitle: function (newTitleOptions, redraw) {
		var chart = this.chart,
			options = this.options,
			axisTitle = this.axisTitle;

		options.title = merge(options.title, newTitleOptions);

		this.axisTitle = axisTitle && axisTitle.destroy(); // #922
		this.isDirty = true;

		if (pick(redraw, true)) {
			chart.redraw();
		}
	},

	/**
	 * Redraw the axis to reflect changes in the data or axis extremes
	 */
	redraw: function () {
		var axis = this,
			chart = axis.chart;

		// hide tooltip and hover states
		if (chart.tracker.resetTracker) {
			chart.tracker.resetTracker(true);
		}

		// render the axis
		axis.render();

		// move plot lines and bands
		each(axis.plotLinesAndBands, function (plotLine) {
			plotLine.render();
		});

		// mark associated series as dirty and ready for redraw
		each(axis.series, function (series) {
			series.isDirty = true;
		});

	},

	/**
	 * Set new axis categories and optionally redraw
	 * @param {Array} newCategories
	 * @param {Boolean} doRedraw
	 */
	setCategories: function (newCategories, doRedraw) {
		var axis = this,
			chart = axis.chart;

		// set the categories
		axis.categories = axis.userOptions.categories = newCategories;

		// force reindexing tooltips
		each(axis.series, function (series) {
			series.translate();
			series.setTooltipPoints(true);
		});


		// optionally redraw
		axis.isDirty = true;

		if (pick(doRedraw, true)) {
			chart.redraw();
		}
	},

	/**
	 * Destroys an Axis instance.
	 */
	destroy: function () {
		var axis = this,
			stacks = axis.stacks,
			stackKey;

		// Remove the events
		removeEvent(axis);

		// Destroy each stack total
		for (stackKey in stacks) {
			destroyObjectProperties(stacks[stackKey]);

			stacks[stackKey] = null;
		}

		// Destroy collections
		each([axis.ticks, axis.minorTicks, axis.alternateBands, axis.plotLinesAndBands], function (coll) {
			destroyObjectProperties(coll);
		});

		// Destroy local variables
		each(['stackTotalGroup', 'axisLine', 'axisGroup', 'gridGroup', 'labelGroup', 'axisTitle'], function (prop) {
			if (axis[prop]) {
				axis[prop] = axis[prop].destroy();
			}
		});
	}

	
}; // end Axis

/**
 * The tooltip object
 * @param {Object} chart The chart instance
 * @param {Object} options Tooltip options
 */
function Tooltip(chart, options) {
	var borderWidth = options.borderWidth,
		style = options.style,
		padding = pInt(style.padding);

	// Save the chart and options
	this.chart = chart;
	this.options = options;

	// Keep track of the current series
	//this.currentSeries = UNDEFINED;

	// List of crosshairs
	this.crosshairs = [];

	// Current values of x and y when animating
	this.now = { x: 0, y: 0 };

	// The tooltip is initially hidden
	this.isHidden = true;

	// create the label
	this.label = chart.renderer.label('', 0, 0, options.shape, null, null, options.useHTML, null, 'tooltip')
		.attr({
			padding: padding,
			fill: options.backgroundColor,
			'stroke-width': borderWidth,
			r: options.borderRadius,
			zIndex: 8
		})
		.css(style)
		.css({ padding: 0 }) // Remove it from VML, the padding is applied as an attribute instead (#1117)
		.hide()
		.add();

	// When using canVG the shadow shows up as a gray circle
	// even if the tooltip is hidden.
	if (!useCanVG) {
		this.label.shadow(options.shadow);
	}

	// Public property for getting the shared state.
	this.shared = options.shared;
}

Tooltip.prototype = {
	/**
	 * Destroy the tooltip and its elements.
	 */
	destroy: function () {
		each(this.crosshairs, function (crosshair) {
			if (crosshair) {
				crosshair.destroy();
			}
		});

		// Destroy and clear local variables
		if (this.label) {
			this.label = this.label.destroy();
		}
	},

	/**
	 * Provide a soft movement for the tooltip
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @private
	 */
	move: function (x, y, anchorX, anchorY) {
		var tooltip = this,
			now = tooltip.now,
			animate = tooltip.options.animation !== false && !tooltip.isHidden;

		// get intermediate values for animation
		extend(now, {
			x: animate ? (2 * now.x + x) / 3 : x,
			y: animate ? (now.y + y) / 2 : y,
			anchorX: animate ? (2 * now.anchorX + anchorX) / 3 : anchorX,
			anchorY: animate ? (now.anchorY + anchorY) / 2 : anchorY
		});

		// move to the intermediate value
		tooltip.label.attr(now);

		
		// run on next tick of the mouse tracker
		if (animate && (mathAbs(x - now.x) > 1 || mathAbs(y - now.y) > 1)) {
		
			// never allow two timeouts
			clearTimeout(this.tooltipTimeout);
			
			// set the fixed interval ticking for the smooth tooltip
			this.tooltipTimeout = setTimeout(function () {
				// The interval function may still be running during destroy, so check that the chart is really there before calling.
				if (tooltip) {
					tooltip.move(x, y, anchorX, anchorY);
				}
			}, 32);
			
		}
	},

	/**
	 * Hide the tooltip
	 */
	hide: function () {
		if (!this.isHidden) {
			var hoverPoints = this.chart.hoverPoints;

			this.label.hide();

			// hide previous hoverPoints and set new
			if (hoverPoints) {
				each(hoverPoints, function (point) {
					point.setState();
				});
			}

			this.chart.hoverPoints = null;
			this.isHidden = true;
		}
	},

	/**
	 * Hide the crosshairs
	 */
	hideCrosshairs: function () {
		each(this.crosshairs, function (crosshair) {
			if (crosshair) {
				crosshair.hide();
			}
		});
	},
	
	/** 
	 * Extendable method to get the anchor position of the tooltip
	 * from a point or set of points
	 */
	getAnchor: function (points, mouseEvent) {
		var ret,
			chart = this.chart,
			inverted = chart.inverted,
			plotX = 0,
			plotY = 0,
			yAxis;
		
		points = splat(points);
		
		// Pie uses a special tooltipPos
		ret = points[0].tooltipPos;
		
		// When shared, use the average position
		if (!ret) {
			each(points, function (point) {
				yAxis = point.series.yAxis;
				plotX += point.plotX;
				plotY += (point.plotLow ? (point.plotLow + point.plotHigh) / 2 : point.plotY) +
					(!inverted && yAxis ? yAxis.top - chart.plotTop : 0); // #1151
			});
			
			plotX /= points.length;
			plotY /= points.length;
			
			ret = [
				inverted ? chart.plotWidth - plotY : plotX,
				this.shared && !inverted && points.length > 1 && mouseEvent ? 
					mouseEvent.chartY - chart.plotTop : // place shared tooltip next to the mouse (#424)
					inverted ? chart.plotHeight - plotX : plotY
			];
		}

		return map(ret, mathRound);
	},
	
	/**
	 * Place the tooltip in a chart without spilling over
	 * and not covering the point it self.
	 */
	getPosition: function (boxWidth, boxHeight, point) {
		
		// Set up the variables
		var chart = this.chart,
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			distance = pick(this.options.distance, 12),
			pointX = point.plotX,
			pointY = point.plotY,
			x = pointX + plotLeft + (chart.inverted ? distance : -boxWidth - distance),
			y = pointY - boxHeight + plotTop + 15, // 15 means the point is 15 pixels up from the bottom of the tooltip
			alignedRight;
	
		// It is too far to the left, adjust it
		if (x < 7) {
			x = plotLeft + mathMax(pointX, 0) + distance;
		}
	
		// Test to see if the tooltip is too far to the right,
		// if it is, move it back to be inside and then up to not cover the point.
		if ((x + boxWidth) > (plotLeft + plotWidth)) {
			x -= (x + boxWidth) - (plotLeft + plotWidth);
			y = pointY - boxHeight + plotTop - distance;
			alignedRight = true;
		}
	
		// If it is now above the plot area, align it to the top of the plot area
		if (y < plotTop + 5) {
			y = plotTop + 5;
	
			// If the tooltip is still covering the point, move it below instead
			if (alignedRight && pointY >= y && pointY <= (y + boxHeight)) {
				y = pointY + plotTop + distance; // below
			}
		} 
	
		// Now if the tooltip is below the chart, move it up. It's better to cover the
		// point than to disappear outside the chart. #834.
		if (y + boxHeight > plotTop + plotHeight) {
			y = mathMax(plotTop, plotTop + plotHeight - boxHeight - distance); // below
		}
	
		return {x: x, y: y};
	},

	/**
	 * Refresh the tooltip's text and position.
	 * @param {Object} point
	 */
	refresh: function (point, mouseEvent) {
		var tooltip = this,
			chart = tooltip.chart,
			label = tooltip.label,
			options = tooltip.options;

		/**
		 * In case no user defined formatter is given, this will be used
		 */
		function defaultFormatter() {
			var pThis = this,
				items = pThis.points || splat(pThis),
				series = items[0].series,
				s;

			// build the header
			s = [series.tooltipHeaderFormatter(items[0].key)];

			// build the values
			each(items, function (item) {
				series = item.series;
				s.push((series.tooltipFormatter && series.tooltipFormatter(item)) ||
					item.point.tooltipFormatter(series.tooltipOptions.pointFormat));
			});

			// footer
			s.push(options.footerFormat || '');

			return s.join('');
		}

		var x,
			y,
			show,
			anchor,
			textConfig = {},
			text,
			pointConfig = [],
			formatter = options.formatter || defaultFormatter,
			hoverPoints = chart.hoverPoints,
			placedTooltipPoint,
			borderColor,
			crosshairsOptions = options.crosshairs,
			shared = tooltip.shared,
			currentSeries;
			
		// get the reference point coordinates (pie charts use tooltipPos)
		anchor = tooltip.getAnchor(point, mouseEvent);
		x = anchor[0];
		y = anchor[1];

		// shared tooltip, array is sent over
		if (shared && !(point.series && point.series.noSharedTooltip)) {
			
			// hide previous hoverPoints and set new
			
			chart.hoverPoints = point;
			if (hoverPoints) {
				each(hoverPoints, function (point) {
					point.setState();
				});
			}

			each(point, function (item) {
				item.setState(HOVER_STATE);

				pointConfig.push(item.getLabelConfig());
			});

			textConfig = {
				x: point[0].category,
				y: point[0].y
			};
			textConfig.points = pointConfig;
			point = point[0];

		// single point tooltip
		} else {
			textConfig = point.getLabelConfig();
		}
		text = formatter.call(textConfig);

		// register the current series
		currentSeries = point.series;


		// For line type series, hide tooltip if the point falls outside the plot
		show = shared || !currentSeries.isCartesian || currentSeries.tooltipOutsidePlot || chart.isInsidePlot(x, y);

		// update the inner HTML
		if (text === false || !show) {
			this.hide();
		} else {

			// show it
			if (tooltip.isHidden) {
				label.show();
			}

			// update text
			label.attr({
				text: text
			});

			// set the stroke color of the box
			borderColor = options.borderColor || point.color || currentSeries.color || '#606060';
			label.attr({
				stroke: borderColor
			});

			placedTooltipPoint = (options.positioner || tooltip.getPosition).call(
				tooltip,
				label.width,
				label.height,
				{ plotX: x, plotY: y }
			);

			// do the move
			tooltip.move(
				mathRound(placedTooltipPoint.x), 
				mathRound(placedTooltipPoint.y), 
				x + chart.plotLeft, 
				y + chart.plotTop
			);
			
			
			tooltip.isHidden = false;
		}

		// crosshairs
		if (crosshairsOptions) {
			crosshairsOptions = splat(crosshairsOptions); // [x, y]

			var path,
				i = crosshairsOptions.length,
				attribs,
				axis;

			while (i--) {
				axis = point.series[i ? 'yAxis' : 'xAxis'];
				if (crosshairsOptions[i] && axis) {

					path = axis.getPlotLinePath(
						i ? pick(point.stackY, point.y) : point.x, // #814
						1
					);

					if (tooltip.crosshairs[i]) {
						tooltip.crosshairs[i].attr({ d: path, visibility: VISIBLE });
					} else {
						attribs = {
							'stroke-width': crosshairsOptions[i].width || 1,
							stroke: crosshairsOptions[i].color || '#C0C0C0',
							zIndex: crosshairsOptions[i].zIndex || 2
						};
						if (crosshairsOptions[i].dashStyle) {
							attribs.dashstyle = crosshairsOptions[i].dashStyle;
						}
						tooltip.crosshairs[i] = chart.renderer.path(path)
							.attr(attribs)
							.add();
					}
				}
			}
		}
		fireEvent(chart, 'tooltipRefresh', {
				text: text,
				x: x + chart.plotLeft,
				y: y + chart.plotTop,
				borderColor: borderColor
			});
	}
};
/**
 * The mouse tracker object
 * @param {Object} chart The Chart instance
 * @param {Object} options The root options object
 */
function MouseTracker(chart, options) {
	var zoomType = useCanVG ? '' : options.chart.zoomType;

	// Zoom status
	this.zoomX = /x/.test(zoomType);
	this.zoomY = /y/.test(zoomType);

	// Store reference to options
	this.options = options;

	// Reference to the chart
	this.chart = chart;

	// The interval id
	//this.tooltipTimeout = UNDEFINED;

	// The cached x hover position
	//this.hoverX = UNDEFINED;

	// The chart position
	//this.chartPosition = UNDEFINED;

	// The selection marker element
	//this.selectionMarker = UNDEFINED;

	// False or a value > 0 if a dragging operation
	//this.mouseDownX = UNDEFINED;
	//this.mouseDownY = UNDEFINED;
	this.init(chart, options.tooltip);
}

MouseTracker.prototype = {
	/**
	 * Add crossbrowser support for chartX and chartY
	 * @param {Object} e The event object in standard browsers
	 */
	normalizeMouseEvent: function (e) {
		var chartPosition,
			chartX,
			chartY,
			ePos;

		// common IE normalizing
		e = e || win.event;
		if (!e.target) {
			e.target = e.srcElement;
		}

		// Framework specific normalizing (#1165)
		e = washMouseEvent(e);
		
		// iOS
		ePos = e.touches ? e.touches.item(0) : e;

		// get mouse position
		this.chartPosition = chartPosition = offset(this.chart.container);

		// chartX and chartY
		if (ePos.pageX === UNDEFINED) { // IE < 9. #886.
			chartX = e.x;
			chartY = e.y;
		} else {
			chartX = ePos.pageX - chartPosition.left;
			chartY = ePos.pageY - chartPosition.top;
		}

		return extend(e, {
			chartX: mathRound(chartX),
			chartY: mathRound(chartY)
		});
	},

	/**
	 * Get the click position in terms of axis values.
	 *
	 * @param {Object} e A mouse event
	 */
	getMouseCoordinates: function (e) {
		var coordinates = {
				xAxis: [],
				yAxis: []
			},
			chart = this.chart;

		each(chart.axes, function (axis) {
			var isXAxis = axis.isXAxis,
				isHorizontal = chart.inverted ? !isXAxis : isXAxis;

			coordinates[isXAxis ? 'xAxis' : 'yAxis'].push({
				axis: axis,
				value: axis.translate(
					(isHorizontal ?
						e.chartX - chart.plotLeft :
						axis.top + axis.len - e.chartY) - axis.minPixelPadding, // #1051
					true
				)
			});
		});
		return coordinates;
	},
	
	/**
	 * Return the index in the tooltipPoints array, corresponding to pixel position in 
	 * the plot area.
	 */
	getIndex: function (e) {
		var chart = this.chart;
		return chart.inverted ? 
			chart.plotHeight + chart.plotTop - e.chartY : 
			e.chartX - chart.plotLeft;
	},

	/**
	 * With line type charts with a single tracker, get the point closest to the mouse
	 */
	onmousemove: function (e) {
		var mouseTracker = this,
			chart = mouseTracker.chart,
			series = chart.series,
			tooltip = chart.tooltip,
			point,
			points,
			hoverPoint = chart.hoverPoint,
			hoverSeries = chart.hoverSeries,
			i,
			j,
			distance = chart.chartWidth,
			index = mouseTracker.getIndex(e);

		// shared tooltip
		if (tooltip && mouseTracker.options.tooltip.shared && !(hoverSeries && hoverSeries.noSharedTooltip)) {
			points = [];

			// loop over all series and find the ones with points closest to the mouse
			i = series.length;
			for (j = 0; j < i; j++) {
				if (series[j].visible &&
						series[j].options.enableMouseTracking !== false &&
						!series[j].noSharedTooltip && series[j].tooltipPoints.length) {
					point = series[j].tooltipPoints[index];
					point._dist = mathAbs(index - point[series[j].xAxis.tooltipPosName || 'plotX']);
					distance = mathMin(distance, point._dist);
					points.push(point);
				}
			}
			// remove furthest points
			i = points.length;
			while (i--) {
				if (points[i]._dist > distance) {
					points.splice(i, 1);
				}
			}
			// refresh the tooltip if necessary
			if (points.length && (points[0].plotX !== mouseTracker.hoverX)) {
				tooltip.refresh(points, e);
				mouseTracker.hoverX = points[0].plotX;
			}
		}

		// separate tooltip and general mouse events
		if (hoverSeries && hoverSeries.tracker) { // only use for line-type series with common tracker

			// get the point
			point = hoverSeries.tooltipPoints[index];

			// a new point is hovered, refresh the tooltip
			if (point && point !== hoverPoint) {

				// trigger the events
				point.onMouseOver();

			}
		}
	},



	/**
	 * Reset the tracking by hiding the tooltip, the hover series state and the hover point
	 * 
	 * @param allowMove {Boolean} Instead of destroying the tooltip altogether, allow moving it if possible
	 */
	resetTracker: function (allowMove) {
		var mouseTracker = this,
			chart = mouseTracker.chart,
			hoverSeries = chart.hoverSeries,
			hoverPoint = chart.hoverPoint,
			tooltip = chart.tooltip,
			tooltipPoints = tooltip && tooltip.shared ? chart.hoverPoints : hoverPoint;
			
		// Narrow in allowMove
		allowMove = allowMove && tooltip && tooltipPoints;
			
		// Check if the points have moved outside the plot area, #1003
		if (allowMove && splat(tooltipPoints)[0].plotX === UNDEFINED) {
			allowMove = false;
		}	

		// Just move the tooltip, #349
		if (allowMove) {
			tooltip.refresh(tooltipPoints);

		// Full reset
		} else {

			if (hoverPoint) {
				hoverPoint.onMouseOut();
			}

			if (hoverSeries) {
				hoverSeries.onMouseOut();
			}

			if (tooltip) {
				tooltip.hide();
				tooltip.hideCrosshairs();
			}

			mouseTracker.hoverX = null;

		}
	},

	/**
	 * Set the JS events on the container element
	 */
	setDOMEvents: function () {
		var lastWasOutsidePlot = true,
			mouseTracker = this,
			chart = mouseTracker.chart,
			container = chart.container,
			hasDragged,
			zoomHor = (mouseTracker.zoomX && !chart.inverted) || (mouseTracker.zoomY && chart.inverted),
			zoomVert = (mouseTracker.zoomY && !chart.inverted) || (mouseTracker.zoomX && chart.inverted);

		/**
		 * Mouse up or outside the plot area
		 */
		function drop() {
			if (mouseTracker.selectionMarker) {
				var selectionData = {
						xAxis: [],
						yAxis: []
					},
					selectionBox = mouseTracker.selectionMarker.getBBox(),
					selectionLeft = selectionBox.x - chart.plotLeft,
					selectionTop = selectionBox.y - chart.plotTop,
					runZoom;

				// a selection has been made
				if (hasDragged) {

					// record each axis' min and max
					each(chart.axes, function (axis) {
						if (axis.options.zoomEnabled !== false) {
							var isXAxis = axis.isXAxis,
								isHorizontal = chart.inverted ? !isXAxis : isXAxis,
								selectionMin = axis.translate(
									isHorizontal ?
										selectionLeft :
										chart.plotHeight - selectionTop - selectionBox.height,
									true,
									0,
									0,
									1
								),
								selectionMax = axis.translate(
									(isHorizontal ?
											selectionLeft + selectionBox.width :
											chart.plotHeight - selectionTop) -  
										2 * axis.minPixelPadding, // #875
									true,
									0,
									0,
									1
								);

								if (!isNaN(selectionMin) && !isNaN(selectionMax)) { // #859
									selectionData[isXAxis ? 'xAxis' : 'yAxis'].push({
										axis: axis,
										min: mathMin(selectionMin, selectionMax), // for reversed axes,
										max: mathMax(selectionMin, selectionMax)
									});
									runZoom = true;
								}
						}
					});
					if (runZoom) {
						fireEvent(chart, 'selection', selectionData, function (args) { chart.zoom(args); });
					}

				}
				mouseTracker.selectionMarker = mouseTracker.selectionMarker.destroy();
			}

			if (chart) { // it may be destroyed on mouse up - #877
				css(container, { cursor: 'auto' });
				chart.cancelClick = hasDragged; // #370
				chart.mouseIsDown = hasDragged = false;
			}

			removeEvent(doc, hasTouch ? 'touchend' : 'mouseup', drop);
		}

		/**
		 * Special handler for mouse move that will hide the tooltip when the mouse leaves the plotarea.
		 */
		mouseTracker.hideTooltipOnMouseMove = function (e) {

			// Get e.pageX and e.pageY back in MooTools
			e = washMouseEvent(e);

			// If we're outside, hide the tooltip
			if (mouseTracker.chartPosition && chart.hoverSeries && chart.hoverSeries.isCartesian &&
				!chart.isInsidePlot(e.pageX - mouseTracker.chartPosition.left - chart.plotLeft,
				e.pageY - mouseTracker.chartPosition.top - chart.plotTop)) {
					mouseTracker.resetTracker();
			}
		};

		/**
		 * When mouse leaves the container, hide the tooltip.
		 */
		mouseTracker.hideTooltipOnMouseLeave = function () {
			mouseTracker.resetTracker();
			mouseTracker.chartPosition = null; // also reset the chart position, used in #149 fix
		};


		/*
		 * Record the starting position of a dragoperation
		 */
		container.onmousedown = function (e) {
			e = mouseTracker.normalizeMouseEvent(e);

			// issue #295, dragging not always working in Firefox
			if (!hasTouch && e.preventDefault) {
				e.preventDefault();
			}

			// record the start position
			chart.mouseIsDown = true;
			chart.cancelClick = false;
			chart.mouseDownX = mouseTracker.mouseDownX = e.chartX;
			mouseTracker.mouseDownY = e.chartY;

			addEvent(doc, hasTouch ? 'touchend' : 'mouseup', drop);
		};

		// The mousemove, touchmove and touchstart event handler
		var mouseMove = function (e) {
			// let the system handle multitouch operations like two finger scroll
			// and pinching
			if (e && e.touches && e.touches.length > 1) {
				return;
			}

			// normalize
			e = mouseTracker.normalizeMouseEvent(e);
			if (!hasTouch) { // not for touch devices
				e.returnValue = false;
			}

			var chartX = e.chartX,
				chartY = e.chartY,
				isOutsidePlot = !chart.isInsidePlot(chartX - chart.plotLeft, chartY - chart.plotTop);

			// on touch devices, only trigger click if a handler is defined
			if (hasTouch && e.type === 'touchstart') {
				if (attr(e.target, 'isTracker')) {
					if (!chart.runTrackerClick) {
						e.preventDefault();
					}
				} else if (!chart.runChartClick && !isOutsidePlot) {
					e.preventDefault();
				}
			}

			// cancel on mouse outside
			if (isOutsidePlot) {

				/*if (!lastWasOutsidePlot) {
					// reset the tracker
					resetTracker();
				}*/

				// drop the selection if any and reset mouseIsDown and hasDragged
				//drop();
				if (chartX < chart.plotLeft) {
					chartX = chart.plotLeft;
				} else if (chartX > chart.plotLeft + chart.plotWidth) {
					chartX = chart.plotLeft + chart.plotWidth;
				}

				if (chartY < chart.plotTop) {
					chartY = chart.plotTop;
				} else if (chartY > chart.plotTop + chart.plotHeight) {
					chartY = chart.plotTop + chart.plotHeight;
				}
			}

			if (chart.mouseIsDown && e.type !== 'touchstart') { // make selection

				// determine if the mouse has moved more than 10px
				hasDragged = Math.sqrt(
					Math.pow(mouseTracker.mouseDownX - chartX, 2) +
					Math.pow(mouseTracker.mouseDownY - chartY, 2)
				);
				if (hasDragged > 10) {
					var clickedInside = chart.isInsidePlot(mouseTracker.mouseDownX - chart.plotLeft, mouseTracker.mouseDownY - chart.plotTop);

					// make a selection
					if (chart.hasCartesianSeries && (mouseTracker.zoomX || mouseTracker.zoomY) && clickedInside) {
						if (!mouseTracker.selectionMarker) {
							mouseTracker.selectionMarker = chart.renderer.rect(
								chart.plotLeft,
								chart.plotTop,
								zoomHor ? 1 : chart.plotWidth,
								zoomVert ? 1 : chart.plotHeight,
								0
							)
							.attr({
								fill: mouseTracker.options.chart.selectionMarkerFill || 'rgba(69,114,167,0.25)',
								zIndex: 7
							})
							.add();
						}
					}

					// adjust the width of the selection marker
					if (mouseTracker.selectionMarker && zoomHor) {
						var xSize = chartX - mouseTracker.mouseDownX;
						mouseTracker.selectionMarker.attr({
							width: mathAbs(xSize),
							x: (xSize > 0 ? 0 : xSize) + mouseTracker.mouseDownX
						});
					}
					// adjust the height of the selection marker
					if (mouseTracker.selectionMarker && zoomVert) {
						var ySize = chartY - mouseTracker.mouseDownY;
						mouseTracker.selectionMarker.attr({
							height: mathAbs(ySize),
							y: (ySize > 0 ? 0 : ySize) + mouseTracker.mouseDownY
						});
					}

					// panning
					if (clickedInside && !mouseTracker.selectionMarker && mouseTracker.options.chart.panning) {
						chart.pan(chartX);
					}
				}

			} 
			
			// Show the tooltip and run mouse over events (#977)			
			if (!isOutsidePlot) {
				mouseTracker.onmousemove(e);
			}

			lastWasOutsidePlot = isOutsidePlot;

			// when outside plot, allow touch-drag by returning true
			return isOutsidePlot || !chart.hasCartesianSeries;
		};

		/*
		 * When the mouse enters the container, run mouseMove
		 */
		container.onmousemove = mouseMove;

		/*
		 * When the mouse leaves the container, hide the tracking (tooltip).
		 */
		addEvent(container, 'mouseleave', mouseTracker.hideTooltipOnMouseLeave);

		// issue #149 workaround
		// The mouseleave event above does not always fire. Whenever the mouse is moving
		// outside the plotarea, hide the tooltip
		addEvent(doc, 'mousemove', mouseTracker.hideTooltipOnMouseMove);

		container.ontouchstart = function (e) {
			// For touch devices, use touchmove to zoom
			if (mouseTracker.zoomX || mouseTracker.zoomY) {
				container.onmousedown(e);
			}
			// Show tooltip and prevent the lower mouse pseudo event
			mouseMove(e);
		};

		/*
		 * Allow dragging the finger over the chart to read the values on touch
		 * devices
		 */
		container.ontouchmove = mouseMove;

		/*
		 * Allow dragging the finger over the chart to read the values on touch
		 * devices
		 */
		container.ontouchend = function () {
			if (hasDragged) {
				mouseTracker.resetTracker();
			}
		};


		// MooTools 1.2.3 doesn't fire this in IE when using addEvent
		container.onclick = function (e) {
			var hoverPoint = chart.hoverPoint, 
				plotX,
				plotY;
			e = mouseTracker.normalizeMouseEvent(e);

			e.cancelBubble = true; // IE specific


			if (!chart.cancelClick) {
				// Detect clicks on trackers or tracker groups, #783
				if (hoverPoint && (attr(e.target, 'isTracker') || attr(e.target.parentNode, 'isTracker'))) {
					plotX = hoverPoint.plotX;
					plotY = hoverPoint.plotY;

					// add page position info
					extend(hoverPoint, {
						pageX: mouseTracker.chartPosition.left + chart.plotLeft +
							(chart.inverted ? chart.plotWidth - plotY : plotX),
						pageY: mouseTracker.chartPosition.top + chart.plotTop +
							(chart.inverted ? chart.plotHeight - plotX : plotY)
					});

					// the series click event
					fireEvent(hoverPoint.series, 'click', extend(e, {
						point: hoverPoint
					}));

					// the point click event
					hoverPoint.firePointEvent('click', e);

				} else {
					extend(e, mouseTracker.getMouseCoordinates(e));

					// fire a click event in the chart
					if (chart.isInsidePlot(e.chartX - chart.plotLeft, e.chartY - chart.plotTop)) {
						fireEvent(chart, 'click', e);
					}
				}


			}
		};

	},

	/**
	 * Destroys the MouseTracker object and disconnects DOM events.
	 */
	destroy: function () {
		var mouseTracker = this,
			chart = mouseTracker.chart,
			container = chart.container;

		// Destroy the tracker group element
		if (chart.trackerGroup) {
			chart.trackerGroup = chart.trackerGroup.destroy();
		}

		removeEvent(container, 'mouseleave', mouseTracker.hideTooltipOnMouseLeave);
		removeEvent(doc, 'mousemove', mouseTracker.hideTooltipOnMouseMove);
		container.onclick = container.onmousedown = container.onmousemove = container.ontouchstart = container.ontouchend = container.ontouchmove = null;

		// memory and CPU leak
		clearInterval(this.tooltipTimeout);
	},

	// Run MouseTracker
	init: function (chart, options) {
		if (!chart.trackerGroup) {
			chart.trackerGroup = chart.renderer.g('tracker')
				.attr({ zIndex: 9 })
				.add();
		}

		if (options.enabled) {
			chart.tooltip = new Tooltip(chart, options);
		}

		this.setDOMEvents();
	}
};
/**
 * The overview of the chart's series
 */
function Legend(chart) {

	this.init(chart);
}

Legend.prototype = {
	
	/**
	 * Initialize the legend
	 */
	init: function (chart) {
		var legend = this,
			options = legend.options = chart.options.legend;
	
		if (!options.enabled) {
			return;
		}
	
		var //style = options.style || {}, // deprecated
			itemStyle = options.itemStyle,
			padding = pick(options.padding, 8),
			itemMarginTop = options.itemMarginTop || 0;
	
		legend.baseline = pInt(itemStyle.fontSize) + 3 + itemMarginTop; // used in Series prototype
		legend.itemStyle = itemStyle;
		legend.itemHiddenStyle = merge(itemStyle, options.itemHiddenStyle);
		legend.itemMarginTop = itemMarginTop;
		legend.padding = padding;
		legend.initialItemX = padding;
		legend.initialItemY = padding - 5; // 5 is the number of pixels above the text
		legend.maxItemWidth = 0;
		legend.chart = chart;
		//legend.allItems = UNDEFINED;
		//legend.legendWidth = UNDEFINED;
		//legend.legendHeight = UNDEFINED;
		//legend.offsetWidth = UNDEFINED;
		legend.itemHeight = 0;
		legend.lastLineHeight = 0;
		//legend.itemX = UNDEFINED;
		//legend.itemY = UNDEFINED;
		//legend.lastItemY = UNDEFINED;
	
		// Elements
		//legend.group = UNDEFINED;
		//legend.box = UNDEFINED;

		// run legend
		legend.render();

		// move checkboxes
		addEvent(legend.chart, 'endResize', function () { legend.positionCheckboxes(); });

/*		// expose
		return {
			colorizeItem: colorizeItem,
			destroyItem: destroyItem,
			render: render,
			destroy: destroy,
			getLegendWidth: getLegendWidth,
			getLegendHeight: getLegendHeight
		};*/
	},

	/**
	 * Set the colors for the legend item
	 * @param {Object} item A Series or Point instance
	 * @param {Object} visible Dimmed or colored
	 */
	colorizeItem: function (item, visible) {
		var legend = this,
			options = legend.options,
			legendItem = item.legendItem,
			legendLine = item.legendLine,
			legendSymbol = item.legendSymbol,
			hiddenColor = legend.itemHiddenStyle.color,
			textColor = visible ? options.itemStyle.color : hiddenColor,
			symbolColor = visible ? item.color : hiddenColor,
			markerOptions = item.options && item.options.marker,
			symbolAttr = {
				stroke: symbolColor,
				fill: symbolColor
			},
			key,
			val;

		
		if (legendItem) {
			legendItem.css({ fill: textColor });
		}
		if (legendLine) {
			legendLine.attr({ stroke: symbolColor });
		}
		
		if (legendSymbol) {
			
			// Apply marker options
			if (markerOptions) {
				markerOptions = item.convertAttribs(markerOptions);
				for (key in markerOptions) {
					val = markerOptions[key];
					if (val !== UNDEFINED) {
						symbolAttr[key] = val;
					}
				}
			}

			legendSymbol.attr(symbolAttr);
		}
	},

	/**
	 * Position the legend item
	 * @param {Object} item A Series or Point instance
	 */
	positionItem: function (item) {
		var legend = this,
			options = legend.options,
			symbolPadding = options.symbolPadding,
			ltr = !options.rtl,
			legendItemPos = item._legendItemPos,
			itemX = legendItemPos[0],
			itemY = legendItemPos[1],
			checkbox = item.checkbox;

		if (item.legendGroup) {
			item.legendGroup.translate(
				ltr ? itemX : legend.legendWidth - itemX - 2 * symbolPadding - 4,
				itemY
			);
		}

		if (checkbox) {
			checkbox.x = itemX;
			checkbox.y = itemY;
		}
	},

	/**
	 * Destroy a single legend item
	 * @param {Object} item The series or point
	 */
	destroyItem: function (item) {
		var checkbox = item.checkbox;

		// destroy SVG elements
		each(['legendItem', 'legendLine', 'legendSymbol', 'legendGroup'], function (key) {
			if (item[key]) {
				item[key].destroy();
			}
		});

		if (checkbox) {
			discardElement(item.checkbox);
		}
	},

	/**
	 * Destroys the legend.
	 */
	destroy: function () {
		var legend = this,
			legendGroup = legend.group,
			box = legend.box;

		if (box) {
			legend.box = box.destroy();
		}

		if (legendGroup) {
			legend.group = legendGroup.destroy();
		}
	},

	/**
	 * Position the checkboxes after the width is determined
	 */
	positionCheckboxes: function () {
		var legend = this;

		each(legend.allItems, function (item) {
			var checkbox = item.checkbox,
				alignAttr = legend.group.alignAttr;
			if (checkbox) {
				css(checkbox, {
					left: (alignAttr.translateX + item.legendItemWidth + checkbox.x - 20) + PX,
					top: (alignAttr.translateY + checkbox.y + 3) + PX
				});
			}
		});
	},

	/**
	 * Render a single specific legend item
	 * @param {Object} item A series or point
	 */
	renderItem: function (item) {
		var legend = this,
			chart = legend.chart,
			renderer = chart.renderer,
			options = legend.options,
			horizontal = options.layout === 'horizontal',
			symbolWidth = options.symbolWidth,
			symbolPadding = options.symbolPadding,
			itemStyle = legend.itemStyle,
			itemHiddenStyle = legend.itemHiddenStyle,
			padding = legend.padding,
			ltr = !options.rtl,
			itemHeight,
			widthOption = options.width,
			itemMarginBottom = options.itemMarginBottom || 0,
			itemMarginTop = legend.itemMarginTop,
			initialItemX = legend.initialItemX,
			bBox,
			itemWidth,
			li = item.legendItem,
			series = item.series || item,
			itemOptions = series.options,
			showCheckbox = itemOptions.showCheckbox;

		if (!li) { // generate it once, later move it

			// Generate the group box
			// A group to hold the symbol and text. Text is to be appended in Legend class.
			item.legendGroup = renderer.g('legend-item')
				.attr({ zIndex: 1 })
				.add(legend.scrollGroup);

			// Draw the legend symbol inside the group box
			series.drawLegendSymbol(legend, item);

			// Generate the list item text and add it to the group
			item.legendItem = li = renderer.text(
					options.labelFormatter.call(item),
					ltr ? symbolWidth + symbolPadding : -symbolPadding,
					legend.baseline,
					options.useHTML
				)
				.css(merge(item.visible ? itemStyle : itemHiddenStyle)) // merge to prevent modifying original (#1021)
				.attr({
					align: ltr ? 'left' : 'right',
					zIndex: 2
				})
				.add(item.legendGroup);

			// Set the events on the item group
			item.legendGroup.on('mouseover', function () {
					item.setState(HOVER_STATE);
					li.css(legend.options.itemHoverStyle);
				})
				.on('mouseout', function () {
					li.css(item.visible ? itemStyle : itemHiddenStyle);
					item.setState();
				})
				.on('click', function (event) {
					var strLegendItemClick = 'legendItemClick',
						fnLegendItemClick = function () {
							item.setVisible();
						};
						
					// Pass over the click/touch event. #4.
					event = {
						browserEvent: event
					};

					// click the name or symbol
					if (item.firePointEvent) { // point
						item.firePointEvent(strLegendItemClick, event, fnLegendItemClick);
					} else {
						fireEvent(item, strLegendItemClick, event, fnLegendItemClick);
					}
				});

			// Colorize the items
			legend.colorizeItem(item, item.visible);

			// add the HTML checkbox on top
			if (itemOptions && showCheckbox) {
				item.checkbox = createElement('input', {
					type: 'checkbox',
					checked: item.selected,
					defaultChecked: item.selected // required by IE7
				}, options.itemCheckboxStyle, chart.container);

				addEvent(item.checkbox, 'click', function (event) {
					var target = event.target;
					fireEvent(item, 'checkboxClick', {
							checked: target.checked
						},
						function () {
							item.select();
						}
					);
				});
			}
		}

		// calculate the positions for the next line
		bBox = li.getBBox();

		itemWidth = item.legendItemWidth =
			options.itemWidth || symbolWidth + symbolPadding + bBox.width + padding +
			(showCheckbox ? 20 : 0);
		legend.itemHeight = itemHeight = bBox.height;

		// if the item exceeds the width, start a new line
		if (horizontal && legend.itemX - initialItemX + itemWidth >
				(widthOption || (chart.chartWidth - 2 * padding - initialItemX))) {
			legend.itemX = initialItemX;
			legend.itemY += itemMarginTop + legend.lastLineHeight + itemMarginBottom;
			legend.lastLineHeight = 0; // reset for next line
		}

		// If the item exceeds the height, start a new column
		/*if (!horizontal && legend.itemY + options.y + itemHeight > chart.chartHeight - spacingTop - spacingBottom) {
			legend.itemY = legend.initialItemY;
			legend.itemX += legend.maxItemWidth;
			legend.maxItemWidth = 0;
		}*/

		// Set the edge positions
		legend.maxItemWidth = mathMax(legend.maxItemWidth, itemWidth);
		legend.lastItemY = itemMarginTop + legend.itemY + itemMarginBottom;
		legend.lastLineHeight = mathMax(itemHeight, legend.lastLineHeight); // #915

		// cache the position of the newly generated or reordered items
		item._legendItemPos = [legend.itemX, legend.itemY];

		// advance
		if (horizontal) {
			legend.itemX += itemWidth;

		} else {
			legend.itemY += itemMarginTop + itemHeight + itemMarginBottom;
			legend.lastLineHeight = itemHeight;
		}

		// the width of the widest item
		legend.offsetWidth = widthOption || mathMax(
			horizontal ? legend.itemX - initialItemX : itemWidth,
			legend.offsetWidth
		);
	},

	/**
	 * Render the legend. This method can be called both before and after
	 * chart.render. If called after, it will only rearrange items instead
	 * of creating new ones.
	 */
	render: function () {
		var legend = this,
			chart = legend.chart,
			renderer = chart.renderer,
			legendGroup = legend.group,
			allItems,
			display,
			legendWidth,
			legendHeight,
			box = legend.box,
			options = legend.options,
			padding = legend.padding,
			legendBorderWidth = options.borderWidth,
			legendBackgroundColor = options.backgroundColor;

		legend.itemX = legend.initialItemX;
		legend.itemY = legend.initialItemY;
		legend.offsetWidth = 0;
		legend.lastItemY = 0;

		if (!legendGroup) {
			legend.group = legendGroup = renderer.g('legend')
				// #414, #759. Trackers will be drawn above the legend, but we have 
				// to sacrifice that because tooltips need to be above the legend
				// and trackers above tooltips
				.attr({ zIndex: 7 }) 
				.add();
			legend.contentGroup = renderer.g()
				.attr({ zIndex: 1 }) // above background
				.add(legendGroup);
			legend.scrollGroup = renderer.g()
				.add(legend.contentGroup);
			legend.clipRect = renderer.clipRect(0, 0, 9999, chart.chartHeight);
			legend.contentGroup.clip(legend.clipRect);
		}

		// add each series or point
		allItems = [];
		each(chart.series, function (serie) {
			var seriesOptions = serie.options;

			if (!seriesOptions.showInLegend) {
				return;
			}

			// use points or series for the legend item depending on legendType
			allItems = allItems.concat(
					serie.legendItems ||
					(seriesOptions.legendType === 'point' ?
							serie.data :
							serie)
			);
		});

		// sort by legendIndex
		stableSort(allItems, function (a, b) {
			return ((a.options && a.options.legendIndex) || 0) - ((b.options && b.options.legendIndex) || 0);
		});

		// reversed legend
		if (options.reversed) {
			allItems.reverse();
		}

		legend.allItems = allItems;
		legend.display = display = !!allItems.length;

		// render the items
		each(allItems, function (item) {
			legend.renderItem(item); 
		});

		// Draw the border
		legendWidth = options.width || legend.offsetWidth;
		legendHeight = legend.lastItemY + legend.lastLineHeight;
		
		
		legendHeight = legend.handleOverflow(legendHeight);

		if (legendBorderWidth || legendBackgroundColor) {
			legendWidth += padding;
			legendHeight += padding;

			if (!box) {
				legend.box = box = renderer.rect(
					0,
					0,
					legendWidth,
					legendHeight,
					options.borderRadius,
					legendBorderWidth || 0
				).attr({
					stroke: options.borderColor,
					'stroke-width': legendBorderWidth || 0,
					fill: legendBackgroundColor || NONE
				})
				.add(legendGroup)
				.shadow(options.shadow);
				box.isNew = true;

			} else if (legendWidth > 0 && legendHeight > 0) {
				box[box.isNew ? 'attr' : 'animate'](
					box.crisp(null, null, null, legendWidth, legendHeight)
				);
				box.isNew = false;
			}

			// hide the border if no items
			box[display ? 'show' : 'hide']();
		}
		
		legend.legendWidth = legendWidth;
		legend.legendHeight = legendHeight;

		// Now that the legend width and height are established, put the items in the 
		// final position
		each(allItems, function (item) {
			legend.positionItem(item);
		});

		// 1.x compatibility: positioning based on style
		/*var props = ['left', 'right', 'top', 'bottom'],
			prop,
			i = 4;
		while (i--) {
			prop = props[i];
			if (options.style[prop] && options.style[prop] !== 'auto') {
				options[i < 2 ? 'align' : 'verticalAlign'] = prop;
				options[i < 2 ? 'x' : 'y'] = pInt(options.style[prop]) * (i % 2 ? -1 : 1);
			}
		}*/

		if (display) {
			legendGroup.align(extend({
				width: legendWidth,
				height: legendHeight
			}, options), true, chart.spacingBox);
		}

		if (!chart.isResizing) {
			this.positionCheckboxes();
		}
	},
	
	/**
	 * Set up the overflow handling by adding navigation with up and down arrows below the
	 * legend.
	 */
	handleOverflow: function (legendHeight) {
		var legend = this,
			chart = this.chart,
			renderer = chart.renderer,
			pageCount,
			options = this.options,
			optionsY = options.y,
			alignTop = options.verticalAlign === 'top',
			spaceHeight = chart.spacingBox.height + (alignTop ? -optionsY : optionsY) - this.padding,
			maxHeight = options.maxHeight,
			clipHeight,
			clipRect = this.clipRect,
			navOptions = options.navigation,
			animation = pick(navOptions.animation, true),
			arrowSize = navOptions.arrowSize || 12,
			nav = this.nav;
			
		// Adjust the height
		if (options.layout === 'horizontal') {
			spaceHeight /= 2;
		}
		if (maxHeight) {
			spaceHeight = mathMin(spaceHeight, maxHeight);
		}
		
		// Reset the legend height and adjust the clipping rectangle
		if (legendHeight > spaceHeight) {
			
			this.clipHeight = clipHeight = spaceHeight - 20;
			this.pageCount = pageCount = mathCeil(legendHeight / clipHeight);
			this.currentPage = pick(this.currentPage, 1);
			this.fullHeight = legendHeight;
			
			clipRect.attr({
				height: clipHeight
			});
			
			// Add navigation elements
			if (!nav) {
				this.nav = nav = renderer.g().attr({ zIndex: 1 }).add(this.group);
				this.up = renderer.symbol('triangle', 0, 0, arrowSize, arrowSize)
					.on('click', function () {
						legend.scroll(-1, animation);
					})
					.add(nav);
				this.pager = renderer.text('', 15, 10)
					.css(navOptions.style)
					.add(nav);
				this.down = renderer.symbol('triangle-down', 0, 0, arrowSize, arrowSize)
					.on('click', function () {
						legend.scroll(1, animation);
					})
					.add(nav);
			}
			
			// Set initial position
			legend.scroll(0);
			
			legendHeight = spaceHeight;
			
		} else if (nav) {
			clipRect.attr({
				height: chart.chartHeight
			});
			nav.hide();
			this.scrollGroup.attr({
				translateY: 1
			});
		}
		
		return legendHeight;
	},
	
	/**
	 * Scroll the legend by a number of pages
	 * @param {Object} scrollBy
	 * @param {Object} animation
	 */
	scroll: function (scrollBy, animation) {
		var pageCount = this.pageCount,
			currentPage = this.currentPage + scrollBy,
			clipHeight = this.clipHeight,
			navOptions = this.options.navigation,
			activeColor = navOptions.activeColor,
			inactiveColor = navOptions.inactiveColor,
			pager = this.pager,
			padding = this.padding;
		
		// When resizing while looking at the last page
		if (currentPage > pageCount) {
			currentPage = pageCount;
		}
		
		if (currentPage > 0) {
			
			if (animation !== UNDEFINED) {
				setAnimation(animation, this.chart);
			}
			
			this.nav.attr({
				translateX: padding,
				translateY: clipHeight + 7,
				visibility: VISIBLE
			});
			this.up.attr({
					fill: currentPage === 1 ? inactiveColor : activeColor
				})
				.css({
					cursor: currentPage === 1 ? 'default' : 'pointer'
				});
			pager.attr({
				text: currentPage + '/' + this.pageCount
			});
			this.down.attr({
					x: 18 + this.pager.getBBox().width, // adjust to text width
					fill: currentPage === pageCount ? inactiveColor : activeColor
				})
				.css({
					cursor: currentPage === pageCount ? 'default' : 'pointer'
				});
			
			this.scrollGroup.animate({
				translateY: -mathMin(clipHeight * (currentPage - 1), this.fullHeight - clipHeight + padding) + 1
			});
			pager.attr({
				text: currentPage + '/' + pageCount
			});
			
			
			this.currentPage = currentPage;
		}
			
	}
	
};


/**
 * The chart class
 * @param {Object} options
 * @param {Function} callback Function to run when the chart has loaded
 */
function Chart(userOptions, callback) {
	// Handle regular options
	var options,
		seriesOptions = userOptions.series; // skip merging data points to increase performance
	userOptions.series = null;
	options = merge(defaultOptions, userOptions); // do the merge
	options.series = userOptions.series = seriesOptions; // set back the series data

	var optionsChart = options.chart,
		optionsMargin = optionsChart.margin,
		margin = isObject(optionsMargin) ?
			optionsMargin :
			[optionsMargin, optionsMargin, optionsMargin, optionsMargin];

	this.optionsMarginTop = pick(optionsChart.marginTop, margin[0]);
	this.optionsMarginRight = pick(optionsChart.marginRight, margin[1]);
	this.optionsMarginBottom = pick(optionsChart.marginBottom, margin[2]);
	this.optionsMarginLeft = pick(optionsChart.marginLeft, margin[3]);

	var chartEvents = optionsChart.events;

	this.runChartClick = chartEvents && !!chartEvents.click;
	this.callback = callback;
	this.isResizing = 0;
	this.options = options;
	//chartTitleOptions = UNDEFINED;
	//chartSubtitleOptions = UNDEFINED;

	this.axes = [];
	this.series = [];
	this.hasCartesianSeries = optionsChart.showAxes;
	//this.axisOffset = UNDEFINED;
	//this.maxTicks = UNDEFINED; // handle the greatest amount of ticks on grouped axes
	//this.inverted = UNDEFINED;
	//this.loadingShown = UNDEFINED;
	//this.container = UNDEFINED;
	//this.chartWidth = UNDEFINED;
	//this.chartHeight = UNDEFINED;
	//this.marginRight = UNDEFINED;
	//this.marginBottom = UNDEFINED;
	//this.containerWidth = UNDEFINED;
	//this.containerHeight = UNDEFINED;
	//this.oldChartWidth = UNDEFINED;
	//this.oldChartHeight = UNDEFINED;

	//this.renderTo = UNDEFINED;
	//this.renderToClone = UNDEFINED;
	//this.tracker = UNDEFINED;

	//this.spacingBox = UNDEFINED

	//this.legend = UNDEFINED;

	// Elements
	//this.chartBackground = UNDEFINED;
	//this.plotBackground = UNDEFINED;
	//this.plotBGImage = UNDEFINED;
	//this.plotBorder = UNDEFINED;
	//this.loadingDiv = UNDEFINED;
	//this.loadingSpan = UNDEFINED;

	this.init(chartEvents);
}

Chart.prototype = {

	/**
	 * Initialize an individual series, called internally before render time
	 */
	initSeries: function (options) {
		var chart = this,
			optionsChart = chart.options.chart,
			type = options.type || optionsChart.type || optionsChart.defaultSeriesType,
			series = new seriesTypes[type]();

		series.init(this, options);
		return series;
	},

	/**
	 * Add a series dynamically after  time
	 *
	 * @param {Object} options The config options
	 * @param {Boolean} redraw Whether to redraw the chart after adding. Defaults to true.
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 *
	 * @return {Object} series The newly created series object
	 */
	addSeries: function (options, redraw, animation) {
		var series,
			chart = this;

		if (options) {
			setAnimation(animation, chart);
			redraw = pick(redraw, true); // defaults to true

			fireEvent(chart, 'addSeries', { options: options }, function () {
				series = chart.initSeries(options);
				
				chart.isDirtyLegend = true; // the series array is out of sync with the display
				if (redraw) {
					chart.redraw();
				}
			});
		}

		return series;
	},

	/**
	 * Check whether a given point is within the plot area
	 *
	 * @param {Number} plotX Pixel x relative to the plot area
	 * @param {Number} plotY Pixel y relative to the plot area
	 * @param {Boolean} inverted Whether the chart is inverted
	 */
	isInsidePlot: function (plotX, plotY, inverted) {
		var x = inverted ? plotY : plotX,
			y = inverted ? plotX : plotY;
			
		return x >= 0 &&
			x <= this.plotWidth &&
			y >= 0 &&
			y <= this.plotHeight;
	},

	/**
	 * Adjust all axes tick amounts
	 */
	adjustTickAmounts: function () {
		if (this.options.chart.alignTicks !== false) {
			each(this.axes, function (axis) {
				axis.adjustTickAmount();
			});
		}
		this.maxTicks = null;
	},

	/**
	 * Redraw legend, axes or series based on updated data
	 *
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	redraw: function (animation) {
		var chart = this,
			axes = chart.axes,
			series = chart.series,
			tracker = chart.tracker,
			legend = chart.legend,
			redrawLegend = chart.isDirtyLegend,
			hasStackedSeries,
			isDirtyBox = chart.isDirtyBox, // todo: check if it has actually changed?
			seriesLength = series.length,
			i = seriesLength,
			serie,
			renderer = chart.renderer,
			isHiddenChart = renderer.isHidden(),
			afterRedraw = [];
			
		setAnimation(animation, chart);
		
		if (isHiddenChart) {
			chart.cloneRenderTo();
		}

		// link stacked series
		while (i--) {
			serie = series[i];
			if (serie.isDirty && serie.options.stacking) {
				hasStackedSeries = true;
				break;
			}
		}
		if (hasStackedSeries) { // mark others as dirty
			i = seriesLength;
			while (i--) {
				serie = series[i];
				if (serie.options.stacking) {
					serie.isDirty = true;
				}
			}
		}

		// handle updated data in the series
		each(series, function (serie) {
			if (serie.isDirty) { // prepare the data so axis can read it
				if (serie.options.legendType === 'point') {
					redrawLegend = true;
				}
			}
		});

		// handle added or removed series
		if (redrawLegend && legend.options.enabled) { // series or pie points are added or removed
			// draw legend graphics
			legend.render();

			chart.isDirtyLegend = false;
		}


		if (chart.hasCartesianSeries) {
			if (!chart.isResizing) {

				// reset maxTicks
				chart.maxTicks = null;

				// set axes scales
				each(axes, function (axis) {
					axis.setScale();
				});
			}
			chart.adjustTickAmounts();
			chart.getMargins();

			// redraw axes
			each(axes, function (axis) {
				
				// Fire 'afterSetExtremes' only if extremes are set
				if (axis.isDirtyExtremes) { // #821
					axis.isDirtyExtremes = false;
					afterRedraw.push(function () { // prevent a recursive call to chart.redraw() (#1119)
						fireEvent(axis, 'afterSetExtremes', axis.getExtremes()); // #747, #751
					});
				}
								
				if (axis.isDirty || isDirtyBox || hasStackedSeries) {
					axis.redraw();
					isDirtyBox = true; // #792
				}
			});


		}

		// the plot areas size has changed
		if (isDirtyBox) {
			chart.drawChartBox();
		}


		// redraw affected series
		each(series, function (serie) {
			if (serie.isDirty && serie.visible &&
					(!serie.isCartesian || serie.xAxis)) { // issue #153
				serie.redraw();
			}
		});


		// move tooltip or reset
		if (tracker && tracker.resetTracker) {
			tracker.resetTracker(true);
		}

		// redraw if canvas
		renderer.draw();

		// fire the event
		fireEvent(chart, 'redraw'); // jQuery breaks this when calling it from addEvent. Overwrites chart.redraw
		
		if (isHiddenChart) {
			chart.cloneRenderTo(true);
		}
		
		// Fire callbacks that are put on hold until after the redraw
		each(afterRedraw, function (callback) {
			callback.call();
		});
	},



	/**
	 * Dim the chart and show a loading text or symbol
	 * @param {String} str An optional text to show in the loading label instead of the default one
	 */
	showLoading: function (str) {
		var chart = this,
			options = chart.options,
			loadingDiv = chart.loadingDiv;

		var loadingOptions = options.loading;

		// create the layer at the first call
		if (!loadingDiv) {
			chart.loadingDiv = loadingDiv = createElement(DIV, {
				className: PREFIX + 'loading'
			}, extend(loadingOptions.style, {
				left: chart.plotLeft + PX,
				top: chart.plotTop + PX,
				width: chart.plotWidth + PX,
				height: chart.plotHeight + PX,
				zIndex: 10,
				display: NONE
			}), chart.container);

			chart.loadingSpan = createElement(
				'span',
				null,
				loadingOptions.labelStyle,
				loadingDiv
			);

		}

		// update text
		chart.loadingSpan.innerHTML = str || options.lang.loading;

		// show it
		if (!chart.loadingShown) {
			css(loadingDiv, { opacity: 0, display: '' });
			animate(loadingDiv, {
				opacity: loadingOptions.style.opacity
			}, {
				duration: loadingOptions.showDuration || 0
			});
			chart.loadingShown = true;
		}
	},

	/**
	 * Hide the loading layer
	 */
	hideLoading: function () {
		var options = this.options,
			loadingDiv = this.loadingDiv;

		if (loadingDiv) {
			animate(loadingDiv, {
				opacity: 0
			}, {
				duration: options.loading.hideDuration || 100,
				complete: function () {
					css(loadingDiv, { display: NONE });
				}
			});
		}
		this.loadingShown = false;
	},

	/**
	 * Get an axis, series or point object by id.
	 * @param id {String} The id as given in the configuration options
	 */
	get: function (id) {
		var chart = this,
			axes = chart.axes,
			series = chart.series;

		var i,
			j,
			points;

		// search axes
		for (i = 0; i < axes.length; i++) {
			if (axes[i].options.id === id) {
				return axes[i];
			}
		}

		// search series
		for (i = 0; i < series.length; i++) {
			if (series[i].options.id === id) {
				return series[i];
			}
		}

		// search points
		for (i = 0; i < series.length; i++) {
			points = series[i].points || [];
			for (j = 0; j < points.length; j++) {
				if (points[j].id === id) {
					return points[j];
				}
			}
		}
		return null;
	},

	/**
	 * Create the Axis instances based on the config options
	 */
	getAxes: function () {
		var chart = this,
			options = this.options;

		var xAxisOptions = options.xAxis || {},
			yAxisOptions = options.yAxis || {},
			optionsArray,
			axis;

		// make sure the options are arrays and add some members
		xAxisOptions = splat(xAxisOptions);
		each(xAxisOptions, function (axis, i) {
			axis.index = i;
			axis.isX = true;
		});

		yAxisOptions = splat(yAxisOptions);
		each(yAxisOptions, function (axis, i) {
			axis.index = i;
		});

		// concatenate all axis options into one array
		optionsArray = xAxisOptions.concat(yAxisOptions);

		each(optionsArray, function (axisOptions) {
			axis = new Axis(chart, axisOptions);
		});

		chart.adjustTickAmounts();
	},


	/**
	 * Get the currently selected points from all series
	 */
	getSelectedPoints: function () {
		var points = [];
		each(this.series, function (serie) {
			points = points.concat(grep(serie.points, function (point) {
				return point.selected;
			}));
		});
		return points;
	},

	/**
	 * Get the currently selected series
	 */
	getSelectedSeries: function () {
		return grep(this.series, function (serie) {
			return serie.selected;
		});
	},

	/**
	 * Display the zoom button
	 */
	showResetZoom: function () {
		var chart = this,
			lang = defaultOptions.lang,
			btnOptions = chart.options.chart.resetZoomButton,
			theme = btnOptions.theme,
			states = theme.states,
			alignTo = btnOptions.relativeTo === 'chart' ? null : 'plotBox';
			
		this.resetZoomButton = chart.renderer.button(lang.resetZoom, null, null, function () { chart.zoomOut(); }, theme, states && states.hover)
			.attr({
				align: btnOptions.position.align,
				title: lang.resetZoomTitle
			})
			.add()
			.align(btnOptions.position, false, chart[alignTo]);
		this.resetZoomButton.alignTo = alignTo;	
			
	},

	/**
	 * Zoom out to 1:1
	 */
	zoomOut: function () {
		var chart = this,
			resetZoomButton = chart.resetZoomButton;

		fireEvent(chart, 'selection', { resetSelection: true }, function () { chart.zoom(); });
		if (resetZoomButton) {
			chart.resetZoomButton = resetZoomButton.destroy();
		}
	},

	/**
	 * Zoom into a given portion of the chart given by axis coordinates
	 * @param {Object} event
	 */
	zoom: function (event) {
		var chart = this,
			hasZoomed;

		// if zoom is called with no arguments, reset the axes
		if (!event || event.resetSelection) {
			each(chart.axes, function (axis) {
				hasZoomed = axis.zoom();
			});
		} else { // else, zoom in on all axes
			each(event.xAxis.concat(event.yAxis), function (axisData) {
				var axis = axisData.axis;

				// don't zoom more than minRange
				if (chart.tracker[axis.isXAxis ? 'zoomX' : 'zoomY']) {
					hasZoomed = axis.zoom(axisData.min, axisData.max);
				}
			});
		}
		
		// Show the Reset zoom button
		if (!chart.resetZoomButton) {
			chart.showResetZoom();
		}
		

		// Redraw
		if (hasZoomed) {
			chart.redraw(
				pick(chart.options.chart.animation, chart.pointCount < 100) // animation
			);
		}
	},

	/**
	 * Pan the chart by dragging the mouse across the pane. This function is called
	 * on mouse move, and the distance to pan is computed from chartX compared to
	 * the first chartX position in the dragging operation.
	 */
	pan: function (chartX) {
		var chart = this;

		var xAxis = chart.xAxis[0],
			mouseDownX = chart.mouseDownX,
			halfPointRange = xAxis.pointRange / 2,
			extremes = xAxis.getExtremes(),
			newMin = xAxis.translate(mouseDownX - chartX, true) + halfPointRange,
			newMax = xAxis.translate(mouseDownX + chart.plotWidth - chartX, true) - halfPointRange,
			hoverPoints = chart.hoverPoints;

		// remove active points for shared tooltip
		if (hoverPoints) {
			each(hoverPoints, function (point) {
				point.setState();
			});
		}

		if (xAxis.series.length && newMin > mathMin(extremes.dataMin, extremes.min) && newMax < mathMax(extremes.dataMax, extremes.max)) {
			xAxis.setExtremes(newMin, newMax, true, false, { trigger: 'pan' });
		}

		chart.mouseDownX = chartX; // set new reference for next run
		css(chart.container, { cursor: 'move' });
	},

	/**
	 * Show the title and subtitle of the chart
	 *
	 * @param titleOptions {Object} New title options
	 * @param subtitleOptions {Object} New subtitle options
	 *
	 */
	setTitle: function (titleOptions, subtitleOptions) {
		var chart = this,
			options = chart.options,
			chartTitleOptions,
			chartSubtitleOptions;

		chart.chartTitleOptions = chartTitleOptions = merge(options.title, titleOptions);
		chart.chartSubtitleOptions = chartSubtitleOptions = merge(options.subtitle, subtitleOptions);

		// add title and subtitle
		each([
			['title', titleOptions, chartTitleOptions],
			['subtitle', subtitleOptions, chartSubtitleOptions]
		], function (arr) {
			var name = arr[0],
				title = chart[name],
				titleOptions = arr[1],
				chartTitleOptions = arr[2];

			if (title && titleOptions) {
				chart[name] = title = title.destroy(); // remove old
			}
			
			if (chartTitleOptions && chartTitleOptions.text && !title) {
				chart[name] = chart.renderer.text(
					chartTitleOptions.text,
					0,
					0,
					chartTitleOptions.useHTML
				)
				.attr({
					align: chartTitleOptions.align,
					'class': PREFIX + name,
					zIndex: chartTitleOptions.zIndex || 4
				})
				.css(chartTitleOptions.style)
				.add()
				.align(chartTitleOptions, false, chart.spacingBox);
			}
		});

	},

	/**
	 * Get chart width and height according to options and container size
	 */
	getChartSize: function () {
		var chart = this,
			optionsChart = chart.options.chart,
			renderTo = chart.renderToClone || chart.renderTo;

		// get inner width and height from jQuery (#824)
		chart.containerWidth = adapterRun(renderTo, 'width');
		chart.containerHeight = adapterRun(renderTo, 'height');
		
		chart.chartWidth = optionsChart.width || chart.containerWidth || 600;
		chart.chartHeight = optionsChart.height ||
			// the offsetHeight of an empty container is 0 in standard browsers, but 19 in IE7:
			(chart.containerHeight > 19 ? chart.containerHeight : 400);
	},

	/**
	 * Create a clone of the chart's renderTo div and place it outside the viewport to allow
	 * size computation on chart.render and chart.redraw
	 */
	cloneRenderTo: function (revert) {
		var clone = this.renderToClone,
			container = this.container;
		
		// Destroy the clone and bring the container back to the real renderTo div
		if (revert) {
			if (clone) {
				this.renderTo.appendChild(container);
				discardElement(clone);
				delete this.renderToClone;
			}
		
		// Set up the clone
		} else {
			if (container) {
				this.renderTo.removeChild(container); // do not clone this
			}
			this.renderToClone = clone = this.renderTo.cloneNode(0);
			css(clone, {
				position: ABSOLUTE,
				top: '-9999px',
				display: 'block' // #833
			});
			doc.body.appendChild(clone);
			if (container) {
				clone.appendChild(container);
			}
		}
	},

	/**
	 * Get the containing element, determine the size and create the inner container
	 * div to hold the chart
	 */
	getContainer: function () {
		var chart = this,
			container,
			optionsChart = chart.options.chart,
			chartWidth,
			chartHeight,
			renderTo,
			containerId;

		chart.renderTo = renderTo = optionsChart.renderTo;
		containerId = PREFIX + idCounter++;

		if (isString(renderTo)) {
			chart.renderTo = renderTo = doc.getElementById(renderTo);
		}
		
		// Display an error if the renderTo is wrong
		if (!renderTo) {
			error(13, true);
		}

		// remove previous chart
		renderTo.innerHTML = '';

		// If the container doesn't have an offsetWidth, it has or is a child of a node
		// that has display:none. We need to temporarily move it out to a visible
		// state to determine the size, else the legend and tooltips won't render
		// properly
		if (!renderTo.offsetWidth) {
			chart.cloneRenderTo();
		}

		// get the width and height
		chart.getChartSize();
		chartWidth = chart.chartWidth;
		chartHeight = chart.chartHeight;

		// create the inner container
		chart.container = container = createElement(DIV, {
				className: PREFIX + 'container' +
					(optionsChart.className ? ' ' + optionsChart.className : ''),
				id: containerId
			}, extend({
				position: RELATIVE,
				overflow: HIDDEN, // needed for context menu (avoid scrollbars) and
					// content overflow in IE
				width: chartWidth + PX,
				height: chartHeight + PX,
				textAlign: 'left',
				lineHeight: 'normal', // #427
				zIndex: 0 // #1072
			}, optionsChart.style),
			chart.renderToClone || renderTo
		);

		chart.renderer =
			optionsChart.forExport ? // force SVG, used for SVG export
				new SVGRenderer(container, chartWidth, chartHeight, true) :
				new Renderer(container, chartWidth, chartHeight);

		if (useCanVG) {
			// If we need canvg library, extend and configure the renderer
			// to get the tracker for translating mouse events
			chart.renderer.create(chart, container, chartWidth, chartHeight);
		}
	},

	/**
	 * Calculate margins by rendering axis labels in a preliminary position. Title,
	 * subtitle and legend have already been rendered at this stage, but will be
	 * moved into their final positions
	 */
	getMargins: function () {
		var chart = this,
			optionsChart = chart.options.chart,
			spacingTop = optionsChart.spacingTop,
			spacingRight = optionsChart.spacingRight,
			spacingBottom = optionsChart.spacingBottom,
			spacingLeft = optionsChart.spacingLeft,
			axisOffset,
			legend = chart.legend,
			optionsMarginTop = chart.optionsMarginTop,
			optionsMarginLeft = chart.optionsMarginLeft,
			optionsMarginRight = chart.optionsMarginRight,
			optionsMarginBottom = chart.optionsMarginBottom,
			chartTitleOptions = chart.chartTitleOptions,
			chartSubtitleOptions = chart.chartSubtitleOptions,
			legendOptions = chart.options.legend,
			legendMargin = pick(legendOptions.margin, 10),
			legendX = legendOptions.x,
			legendY = legendOptions.y,
			align = legendOptions.align,
			verticalAlign = legendOptions.verticalAlign,
			titleOffset;

		chart.resetMargins();
		axisOffset = chart.axisOffset;

		// adjust for title and subtitle
		if ((chart.title || chart.subtitle) && !defined(chart.optionsMarginTop)) {
			titleOffset = mathMax(
				(chart.title && !chartTitleOptions.floating && !chartTitleOptions.verticalAlign && chartTitleOptions.y) || 0,
				(chart.subtitle && !chartSubtitleOptions.floating && !chartSubtitleOptions.verticalAlign && chartSubtitleOptions.y) || 0
			);
			if (titleOffset) {
				chart.plotTop = mathMax(chart.plotTop, titleOffset + pick(chartTitleOptions.margin, 15) + spacingTop);
			}
		}
		// adjust for legend
		if (legend.display && !legendOptions.floating) {
			if (align === 'right') { // horizontal alignment handled first
				if (!defined(optionsMarginRight)) {
					chart.marginRight = mathMax(
						chart.marginRight,
						legend.legendWidth - legendX + legendMargin + spacingRight
					);
				}
			} else if (align === 'left') {
				if (!defined(optionsMarginLeft)) {
					chart.plotLeft = mathMax(
						chart.plotLeft,
						legend.legendWidth + legendX + legendMargin + spacingLeft
					);
				}

			} else if (verticalAlign === 'top') {
				if (!defined(optionsMarginTop)) {
					chart.plotTop = mathMax(
						chart.plotTop,
						legend.legendHeight + legendY + legendMargin + spacingTop
					);
				}

			} else if (verticalAlign === 'bottom') {
				if (!defined(optionsMarginBottom)) {
					chart.marginBottom = mathMax(
						chart.marginBottom,
						legend.legendHeight - legendY + legendMargin + spacingBottom
					);
				}
			}
		}

		// adjust for scroller
		if (chart.extraBottomMargin) {
			chart.marginBottom += chart.extraBottomMargin;
		}
		if (chart.extraTopMargin) {
			chart.plotTop += chart.extraTopMargin;
		}

		// pre-render axes to get labels offset width
		if (chart.hasCartesianSeries) {
			each(chart.axes, function (axis) {
				axis.getOffset();
			});
		}
		
		if (!defined(optionsMarginLeft)) {
			chart.plotLeft += axisOffset[3];
		}
		if (!defined(optionsMarginTop)) {
			chart.plotTop += axisOffset[0];
		}
		if (!defined(optionsMarginBottom)) {
			chart.marginBottom += axisOffset[2];
		}
		if (!defined(optionsMarginRight)) {
			chart.marginRight += axisOffset[1];
		}

		chart.setChartSize();

	},

	/**
	 * Add the event handlers necessary for auto resizing
	 *
	 */
	initReflow: function () {
		var chart = this,
			optionsChart = chart.options.chart,
			renderTo = chart.renderTo,
			reflowTimeout;
			
		function reflow(e) {
			var width = optionsChart.width || adapterRun(renderTo, 'width'),
				height = optionsChart.height || adapterRun(renderTo, 'height'),
				target = e ? e.target : win; // #805 - MooTools doesn't supply e
				
			// Width and height checks for display:none. Target is doc in IE8 and Opera,
			// win in Firefox, Chrome and IE9.
			if (width && height && (target === win || target === doc)) {
				
				if (width !== chart.containerWidth || height !== chart.containerHeight) {
					clearTimeout(reflowTimeout);
					chart.reflowTimeout = reflowTimeout = setTimeout(function () {
						if (chart.container) { // It may have been destroyed in the meantime (#1257)
							chart.resize(width, height, false);
						}
					}, 100);
				}
				chart.containerWidth = width;
				chart.containerHeight = height;
			}
		}
		addEvent(win, 'resize', reflow);
		addEvent(chart, 'destroy', function () {
			removeEvent(win, 'resize', reflow);
		});
	},

	/**
	 * Resize the chart to a given width and height
	 * @param {Number} width
	 * @param {Number} height
	 * @param {Object|Boolean} animation
	 */
	// TODO: This method is called setSize in the api
	resize: function (width, height, animation) {
		var chart = this,
			chartWidth,
			chartHeight,
			spacingBox,
			resetZoomButton = chart.resetZoomButton,
			chartTitle = chart.title,
			chartSubtitle = chart.subtitle,
			fireEndResize;

		// Handle the isResizing counter
		chart.isResizing += 1;
		fireEndResize = function () {
			if (chart) {
				fireEvent(chart, 'endResize', null, function () {
					chart.isResizing -= 1;
				});
			}
		};

		// set the animation for the current process
		setAnimation(animation, chart);

		chart.oldChartHeight = chart.chartHeight;
		chart.oldChartWidth = chart.chartWidth;
		if (defined(width)) {
			chart.chartWidth = chartWidth = mathRound(width);
		}
		if (defined(height)) {
			chart.chartHeight = chartHeight = mathRound(height);
		}

		css(chart.container, {
			width: chartWidth + PX,
			height: chartHeight + PX
		});
		chart.renderer.setSize(chartWidth, chartHeight, animation);

		// update axis lengths for more correct tick intervals:
		chart.plotWidth = chartWidth - chart.plotLeft - chart.marginRight;
		chart.plotHeight = chartHeight - chart.plotTop - chart.marginBottom;

		// handle axes
		chart.maxTicks = null;
		each(chart.axes, function (axis) {
			axis.isDirty = true;
			axis.setScale();
		});

		// make sure non-cartesian series are also handled
		each(chart.series, function (serie) {
			serie.isDirty = true;
		});

		chart.isDirtyLegend = true; // force legend redraw
		chart.isDirtyBox = true; // force redraw of plot and chart border

		chart.getMargins();

		// move titles
		spacingBox = chart.spacingBox;
		if (chartTitle) {
			chartTitle.align(null, null, spacingBox);
		}
		if (chartSubtitle) {
			chartSubtitle.align(null, null, spacingBox);
		}
		
		// Move resize button (#1115)
		if (resetZoomButton && resetZoomButton.align) {
			resetZoomButton.align(null, null, chart[resetZoomButton.alignTo]);
		}

		chart.redraw(animation);


		chart.oldChartHeight = null;
		fireEvent(chart, 'resize');

		// fire endResize and set isResizing back
		// If animation is disabled, fire without delay
		if (globalAnimation === false) {
			fireEndResize();
		} else { // else set a timeout with the animation duration
			setTimeout(fireEndResize, (globalAnimation && globalAnimation.duration) || 500);
		}
	},

	/**
	 * Set the public chart properties. This is done before and after the pre-render
	 * to determine margin sizes
	 */
	setChartSize: function () {
		var chart = this,
			inverted = chart.inverted,
			chartWidth = chart.chartWidth,
			chartHeight = chart.chartHeight,
			optionsChart = chart.options.chart,
			spacingTop = optionsChart.spacingTop,
			spacingRight = optionsChart.spacingRight,
			spacingBottom = optionsChart.spacingBottom,
			spacingLeft = optionsChart.spacingLeft,
			plotLeft,
			plotTop,
			plotWidth,
			plotHeight,
			plotBorderWidth;

		chart.plotLeft = plotLeft = mathRound(chart.plotLeft);
		chart.plotTop = plotTop = mathRound(chart.plotTop);
		chart.plotWidth = plotWidth = mathRound(chartWidth - plotLeft - chart.marginRight);
		chart.plotHeight = plotHeight = mathRound(chartHeight - plotTop - chart.marginBottom);

		chart.plotSizeX = inverted ? plotHeight : plotWidth;
		chart.plotSizeY = inverted ? plotWidth : plotHeight;
		
		chart.plotBorderWidth = plotBorderWidth = optionsChart.plotBorderWidth || 0;

		// Set boxes used for alignment
		chart.spacingBox = {
			x: spacingLeft,
			y: spacingTop,
			width: chartWidth - spacingLeft - spacingRight,
			height: chartHeight - spacingTop - spacingBottom
		};
		chart.plotBox = {
			x: plotLeft,
			y: plotTop,
			width: plotWidth,
			height: plotHeight
		};
		chart.clipBox = {
			x: plotBorderWidth / 2, 
			y: plotBorderWidth / 2, 
			width: chart.plotSizeX - plotBorderWidth, 
			height: chart.plotSizeY - plotBorderWidth
		};

		each(chart.axes, function (axis) {
			axis.setAxisSize();
			axis.setAxisTranslation();
		});
	},

	/**
	 * Initial margins before auto size margins are applied
	 */
	resetMargins: function () {
		var chart = this,
			optionsChart = chart.options.chart,
			spacingTop = optionsChart.spacingTop,
			spacingRight = optionsChart.spacingRight,
			spacingBottom = optionsChart.spacingBottom,
			spacingLeft = optionsChart.spacingLeft;

		chart.plotTop = pick(chart.optionsMarginTop, spacingTop);
		chart.marginRight = pick(chart.optionsMarginRight, spacingRight);
		chart.marginBottom = pick(chart.optionsMarginBottom, spacingBottom);
		chart.plotLeft = pick(chart.optionsMarginLeft, spacingLeft);
		chart.axisOffset = [0, 0, 0, 0]; // top, right, bottom, left
	},

	/**
	 * Draw the borders and backgrounds for chart and plot area
	 */
	drawChartBox: function () {
		var chart = this,
			optionsChart = chart.options.chart,
			renderer = chart.renderer,
			chartWidth = chart.chartWidth,
			chartHeight = chart.chartHeight,
			chartBackground = chart.chartBackground,
			plotBackground = chart.plotBackground,
			plotBorder = chart.plotBorder,
			plotBGImage = chart.plotBGImage,
			chartBorderWidth = optionsChart.borderWidth || 0,
			chartBackgroundColor = optionsChart.backgroundColor,
			plotBackgroundColor = optionsChart.plotBackgroundColor,
			plotBackgroundImage = optionsChart.plotBackgroundImage,
			plotBorderWidth = optionsChart.plotBorderWidth || 0,
			mgn,
			bgAttr,
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			plotBox = chart.plotBox,
			clipRect = chart.clipRect,
			clipBox = chart.clipBox;

		// Chart area
		mgn = chartBorderWidth + (optionsChart.shadow ? 8 : 0);

		if (chartBorderWidth || chartBackgroundColor) {
			if (!chartBackground) {
				
				bgAttr = {
					fill: chartBackgroundColor || NONE
				};
				if (chartBorderWidth) { // #980
					bgAttr.stroke = optionsChart.borderColor;
					bgAttr['stroke-width'] = chartBorderWidth;
				}
				chart.chartBackground = renderer.rect(mgn / 2, mgn / 2, chartWidth - mgn, chartHeight - mgn,
						optionsChart.borderRadius, chartBorderWidth)
					.attr(bgAttr)
					.add()
					.shadow(optionsChart.shadow);

			} else { // resize
				chartBackground.animate(
					chartBackground.crisp(null, null, null, chartWidth - mgn, chartHeight - mgn)
				);
			}
		}


		// Plot background
		if (plotBackgroundColor) {
			if (!plotBackground) {
				chart.plotBackground = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0)
					.attr({
						fill: plotBackgroundColor
					})
					.add()
					.shadow(optionsChart.plotShadow);
			} else {
				plotBackground.animate(plotBox);
			}
		}
		if (plotBackgroundImage) {
			if (!plotBGImage) {
				chart.plotBGImage = renderer.image(plotBackgroundImage, plotLeft, plotTop, plotWidth, plotHeight)
					.add();
			} else {
				plotBGImage.animate(plotBox);
			}
		}
		
		// Plot clip
		if (!clipRect) {
			chart.clipRect = renderer.clipRect(clipBox);
		} else {
			clipRect.animate({
				width: clipBox.width,
				height: clipBox.height
			});
		}

		// Plot area border
		if (plotBorderWidth) {
			if (!plotBorder) {
				chart.plotBorder = renderer.rect(plotLeft, plotTop, plotWidth, plotHeight, 0, plotBorderWidth)
					.attr({
						stroke: optionsChart.plotBorderColor,
						'stroke-width': plotBorderWidth,
						zIndex: 1
					})
					.add();
			} else {
				plotBorder.animate(
					plotBorder.crisp(null, plotLeft, plotTop, plotWidth, plotHeight)
				);
			}
		}

		// reset
		chart.isDirtyBox = false;
	},

	/**
	 * Detect whether a certain chart property is needed based on inspecting its options
	 * and series. This mainly applies to the chart.invert property, and in extensions to 
	 * the chart.angular and chart.polar properties.
	 */
	propFromSeries: function () {
		var chart = this,
			optionsChart = chart.options.chart,
			klass,
			seriesOptions = chart.options.series,
			i,
			value;
			
			
		each(['inverted', 'angular', 'polar'], function (key) {
			
			// The default series type's class
			klass = seriesTypes[optionsChart.type || optionsChart.defaultSeriesType];
			
			// Get the value from available chart-wide properties
			value = (
				chart[key] || // 1. it is set before
				optionsChart[key] || // 2. it is set in the options
				(klass && klass.prototype[key]) // 3. it's default series class requires it
			);
	
			// 4. Check if any the chart's series require it
			i = seriesOptions && seriesOptions.length;
			while (!value && i--) {
				klass = seriesTypes[seriesOptions[i].type];
				if (klass && klass.prototype[key]) {
					value = true;
				}
			}
	
			// Set the chart property
			chart[key] = value;	
		});
		
	},

	/**
	 * Render all graphics for the chart
	 */
	render: function () {
		var chart = this,
			axes = chart.axes,
			renderer = chart.renderer,
			options = chart.options;

		var labels = options.labels,
			credits = options.credits,
			creditsHref;

		// Title
		chart.setTitle();


		// Legend
		chart.legend = new Legend(chart);

		// Get margins by pre-rendering axes
		// set axes scales
		each(axes, function (axis) {
			axis.setScale();
		});
		chart.getMargins();

		chart.maxTicks = null; // reset for second pass
		each(axes, function (axis) {
			axis.setTickPositions(true); // update to reflect the new margins
			axis.setMaxTicks();
		});
		chart.adjustTickAmounts();
		chart.getMargins(); // second pass to check for new labels


		// Draw the borders and backgrounds
		chart.drawChartBox();		


		// Axes
		if (chart.hasCartesianSeries) {
			each(axes, function (axis) {
				axis.render();
			});
		}

		// The series
		if (!chart.seriesGroup) {
			chart.seriesGroup = renderer.g('series-group')
				.attr({ zIndex: 3 })
				.add();
		}
		each(chart.series, function (serie) {
			serie.translate();
			serie.setTooltipPoints();
			serie.render();
		});

		// Labels
		if (labels.items) {
			each(labels.items, function (label) {
				var style = extend(labels.style, label.style),
					x = pInt(style.left) + chart.plotLeft,
					y = pInt(style.top) + chart.plotTop + 12;

				// delete to prevent rewriting in IE
				delete style.left;
				delete style.top;

				renderer.text(
					label.html,
					x,
					y
				)
				.attr({ zIndex: 2 })
				.css(style)
				.add();

			});
		}

		// Credits
		if (credits.enabled && !chart.credits) {
			creditsHref = credits.href;
			chart.credits = renderer.text(
				credits.text,
				0,
				0
			)
			.on('click', function () {
				if (creditsHref) {
					location.href = creditsHref;
				}
			})
			.attr({
				align: credits.position.align,
				zIndex: 8
			})
			.css(credits.style)
			.add()
			.align(credits.position);
		}

		// Set flag
		chart.hasRendered = true;

	},

	/**
	 * Clean up memory usage
	 */
	destroy: function () {
		var chart = this,
			axes = chart.axes,
			series = chart.series,
			container = chart.container,
			i,
			parentNode = container && container.parentNode;

		// fire the chart.destoy event
		fireEvent(chart, 'destroy');

		// remove events
		removeEvent(chart);

		// ==== Destroy collections:
		// Destroy axes
		i = axes.length;
		while (i--) {
			axes[i] = axes[i].destroy();
		}

		// Destroy each series
		i = series.length;
		while (i--) {
			series[i] = series[i].destroy();
		}

		// ==== Destroy chart properties:
		each(['title', 'subtitle', 'chartBackground', 'plotBackground', 'plotBGImage', 'plotBorder', 'seriesGroup', 'clipRect', 'credits', 'tracker', 'scroller', 'rangeSelector', 'legend', 'resetZoomButton', 'tooltip', 'renderer'], function (name) {
			var prop = chart[name];

			if (prop && prop.destroy) {
				chart[name] = prop.destroy();
			}
		});

		// remove container and all SVG
		if (container) { // can break in IE when destroyed before finished loading
			container.innerHTML = '';
			removeEvent(container);
			if (parentNode) {
				discardElement(container);
			}

		}

		// clean it all up
		for (i in chart) {
			delete chart[i];
		}

	},

	/**
	 * Prepare for first rendering after all data are loaded
	 */
	firstRender: function () {
		var chart = this,
			options = chart.options,
			callback = chart.callback;

		// VML namespaces can't be added until after complete. Listening
		// for Perini's doScroll hack is not enough.
		var ONREADYSTATECHANGE = 'onreadystatechange',
		COMPLETE = 'complete';
		// Note: in spite of JSLint's complaints, win == win.top is required
		/*jslint eqeq: true*/
		if ((!hasSVG && (win == win.top && doc.readyState !== COMPLETE)) || (useCanVG && !win.canvg)) {
		/*jslint eqeq: false*/
			if (useCanVG) {
				// Delay rendering until canvg library is downloaded and ready
				CanVGController.push(function () { chart.firstRender(); }, options.global.canvasToolsURL);
			} else {
				doc.attachEvent(ONREADYSTATECHANGE, function () {
					doc.detachEvent(ONREADYSTATECHANGE, chart.firstRender);
					if (doc.readyState === COMPLETE) {
						chart.firstRender();
					}
				});
			}
			return;
		}

		// create the container
		chart.getContainer();

		// Run an early event after the container and renderer are established
		fireEvent(chart, 'init');

		// Initialize range selector for stock charts
		if (Highcharts.RangeSelector && options.rangeSelector.enabled) {
			chart.rangeSelector = new Highcharts.RangeSelector(chart);
		}

		chart.resetMargins();
		chart.setChartSize();

		// Set the common chart properties (mainly invert) from the given series
		chart.propFromSeries();

		// get axes
		chart.getAxes();

		// Initialize the series
		each(options.series || [], function (serieOptions) {
			chart.initSeries(serieOptions);
		});

		// Run an event where series and axes can be added
		//fireEvent(chart, 'beforeRender');

		// Initialize scroller for stock charts
		if (Highcharts.Scroller && (options.navigator.enabled || options.scrollbar.enabled)) {
			chart.scroller = new Highcharts.Scroller(chart);
		}

		// depends on inverted and on margins being set
		chart.tracker = new MouseTracker(chart, options);

		chart.render();

		// add canvas
		chart.renderer.draw();
		// run callbacks
		if (callback) {
			callback.apply(chart, [chart]);
		}
		each(chart.callbacks, function (fn) {
			fn.apply(chart, [chart]);
		});
		
		
		// If the chart was rendered outside the top container, put it back in
		chart.cloneRenderTo(true);

		fireEvent(chart, 'load');

	},

	init: function (chartEvents) {
		var chart = this,
			optionsChart = chart.options.chart,
			eventType;

		// Run chart

		// Set up auto resize
		if (optionsChart.reflow !== false) {
			addEvent(chart, 'load', chart.initReflow);
		}

		// Chart event handlers
		if (chartEvents) {
			for (eventType in chartEvents) {
				addEvent(chart, eventType, chartEvents[eventType]);
			}
		}

		chart.xAxis = [];
		chart.yAxis = [];

		// Expose methods and variables
		chart.animation = useCanVG ? false : pick(optionsChart.animation, true);
		chart.setSize = chart.resize;
		chart.pointCount = 0;
		chart.counters = new ChartCounters();
		/*
		if ($) $(function () {
			$container = $('#container');
			var origChartWidth,
				origChartHeight;
			if ($container) {
				$('<button>+</button>')
					.insertBefore($container)
					.click(function () {
						if (origChartWidth === UNDEFINED) {
							origChartWidth = chartWidth;
							origChartHeight = chartHeight;
						}
						chart.resize(chartWidth *= 1.1, chartHeight *= 1.1);
					});
				$('<button>-</button>')
					.insertBefore($container)
					.click(function () {
						if (origChartWidth === UNDEFINED) {
							origChartWidth = chartWidth;
							origChartHeight = chartHeight;
						}
						chart.resize(chartWidth *= 0.9, chartHeight *= 0.9);
					});
				$('<button>1:1</button>')
					.insertBefore($container)
					.click(function () {
						if (origChartWidth === UNDEFINED) {
							origChartWidth = chartWidth;
							origChartHeight = chartHeight;
						}
						chart.resize(origChartWidth, origChartHeight);
					});
			}
		})
		*/

		chart.firstRender();
	}
}; // end Chart

// Hook for exporting module
Chart.prototype.callbacks = [];
/**
 * The Point object and prototype. Inheritable and used as base for PiePoint
 */
var Point = function () {};
Point.prototype = {

	/**
	 * Initialize the point
	 * @param {Object} series The series object containing this point
	 * @param {Object} options The data in either number, array or object format
	 */
	init: function (series, options, x) {
		var point = this,
			counters = series.chart.counters,
			defaultColors;
		point.series = series;
		point.applyOptions(options, x);
		point.pointAttr = {};

		if (series.options.colorByPoint) {
			defaultColors = series.chart.options.colors;
			point.color = point.color || defaultColors[counters.color++];

			// loop back to zero
			counters.wrapColor(defaultColors.length);
		}

		series.chart.pointCount++;
		return point;
	},
	/**
	 * Apply the options containing the x and y data and possible some extra properties.
	 * This is called on point init or from point.update.
	 *
	 * @param {Object} options
	 */
	applyOptions: function (options, x) {
		var point = this,
			series = point.series,
			optionsType = typeof options;

		point.config = options;

		// onedimensional array input
		if (optionsType === 'number' || options === null) {
			point.y = options;
		} else if (typeof options[0] === 'number') { // two-dimentional array
			point.x = options[0];
			point.y = options[1];
		} else if (optionsType === 'object' && typeof options.length !== 'number') { // object input
			// copy options directly to point
			extend(point, options);
			point.options = options;
			
			// This is the fastest way to detect if there are individual point dataLabels that need 
			// to be considered in drawDataLabels. These can only occur in object configs.
			if (options.dataLabels) {
				series._hasPointLabels = true;
			}
			
			// Same approach as above for markers
			if (options.marker) {
				series._hasPointMarkers = true;
			}
		} else if (typeof options[0] === 'string') { // categorized data with name in first position
			point.name = options[0];
			point.y = options[1];
		}
		
		/*
		 * If no x is set by now, get auto incremented value. All points must have an
		 * x value, however the y value can be null to create a gap in the series
		 */
		// todo: skip this? It is only used in applyOptions, in translate it should not be used
		if (point.x === UNDEFINED) {
			point.x = x === UNDEFINED ? series.autoIncrement() : x;
		}
		
	},

	/**
	 * Destroy a point to clear memory. Its reference still stays in series.data.
	 */
	destroy: function () {
		var point = this,
			series = point.series,
			chart = series.chart,
			hoverPoints = chart.hoverPoints,
			prop;

		chart.pointCount--;

		if (hoverPoints) {
			point.setState();
			erase(hoverPoints, point);
			if (!hoverPoints.length) {
				chart.hoverPoints = null;
			}

		}
		if (point === chart.hoverPoint) {
			point.onMouseOut();
		}
		
		// remove all events
		if (point.graphic || point.dataLabel) { // removeEvent and destroyElements are performance expensive
			removeEvent(point);
			point.destroyElements();
		}

		if (point.legendItem) { // pies have legend items
			chart.legend.destroyItem(point);
		}

		for (prop in point) {
			point[prop] = null;
		}


	},

	/**
	 * Destroy SVG elements associated with the point
	 */
	destroyElements: function () {
		var point = this,
			props = ['graphic', 'tracker', 'dataLabel', 'group', 'connector', 'shadowGroup'],
			prop,
			i = 6;
		while (i--) {
			prop = props[i];
			if (point[prop]) {
				point[prop] = point[prop].destroy();
			}
		}
	},

	/**
	 * Return the configuration hash needed for the data label and tooltip formatters
	 */
	getLabelConfig: function () {
		var point = this;
		return {
			x: point.category,
			y: point.y,
			key: point.name || point.category,
			series: point.series,
			point: point,
			percentage: point.percentage,
			total: point.total || point.stackTotal
		};
	},

	/**
	 * Toggle the selection status of a point
	 * @param {Boolean} selected Whether to select or unselect the point.
	 * @param {Boolean} accumulate Whether to add to the previous selection. By default,
	 *     this happens if the control key (Cmd on Mac) was pressed during clicking.
	 */
	select: function (selected, accumulate) {
		var point = this,
			series = point.series,
			chart = series.chart;

		selected = pick(selected, !point.selected);

		// fire the event with the defalut handler
		point.firePointEvent(selected ? 'select' : 'unselect', { accumulate: accumulate }, function () {
			point.selected = selected;
			point.setState(selected && SELECT_STATE);

			// unselect all other points unless Ctrl or Cmd + click
			if (!accumulate) {
				each(chart.getSelectedPoints(), function (loopPoint) {
					if (loopPoint.selected && loopPoint !== point) {
						loopPoint.selected = false;
						loopPoint.setState(NORMAL_STATE);
						loopPoint.firePointEvent('unselect');
					}
				});
			}
		});
	},

	onMouseOver: function () {
		var point = this,
			series = point.series,
			chart = series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;

		// set normal state to previous series
		if (hoverPoint && hoverPoint !== point) {
			hoverPoint.onMouseOut();
		}

		// trigger the event
		point.firePointEvent('mouseOver');

		// update the tooltip
		if (tooltip && (!tooltip.shared || series.noSharedTooltip)) {
			tooltip.refresh(point);
		}

		// hover this
		point.setState(HOVER_STATE);
		chart.hoverPoint = point;
	},

	onMouseOut: function () {
		var chart = this.series.chart,
			hoverPoints = chart.hoverPoints;
		
		if (!hoverPoints || inArray(this, hoverPoints) === -1) { // #887
			this.firePointEvent('mouseOut');
	
			this.setState();
			chart.hoverPoint = null;
		}
	},

	/**
	 * Extendable method for formatting each point's tooltip line
	 *
	 * @return {String} A string to be concatenated in to the common tooltip text
	 */
	tooltipFormatter: function (pointFormat) {
		var point = this,
			series = point.series,
			seriesTooltipOptions = series.tooltipOptions,
			match = pointFormat.match(/\{(series|point)\.[a-zA-Z]+\}/g),
			splitter = /[{\.}]/,
			obj,
			key,
			replacement,
			repOptionKey,
			parts,
			prop,
			i,
			cfg = {
				y: 0, // 0: use 'value' for repOptionKey
				open: 0,
				high: 0,
				low: 0,
				close: 0,
				percentage: 1, // 1: use the self name for repOptionKey
				total: 1
			};
		
		// Backwards compatibility to y naming in early Highstock
		seriesTooltipOptions.valuePrefix = seriesTooltipOptions.valuePrefix || seriesTooltipOptions.yPrefix;
		seriesTooltipOptions.valueDecimals = seriesTooltipOptions.valueDecimals || seriesTooltipOptions.yDecimals;
		seriesTooltipOptions.valueSuffix = seriesTooltipOptions.valueSuffix || seriesTooltipOptions.ySuffix;

		// loop over the variables defined on the form {series.name}, {point.y} etc
		for (i in match) {
			key = match[i];
			if (isString(key) && key !== pointFormat) { // IE matches more than just the variables
				
				// Split it further into parts
				parts = (' ' + key).split(splitter); // add empty string because IE and the rest handles it differently
				obj = { 'point': point, 'series': series }[parts[1]];
				prop = parts[2];
				
				// Add some preformatting
				if (obj === point && cfg.hasOwnProperty(prop)) {
					repOptionKey = cfg[prop] ? prop : 'value';
					replacement = (seriesTooltipOptions[repOptionKey + 'Prefix'] || '') + 
						numberFormat(point[prop], pick(seriesTooltipOptions[repOptionKey + 'Decimals'], -1)) +
						(seriesTooltipOptions[repOptionKey + 'Suffix'] || '');
				
				// Automatic replacement
				} else {
					replacement = obj[prop];
				}
				
				pointFormat = pointFormat.replace(key, replacement);
			}
		}
		
		return pointFormat;
	},

	/**
	 * Update the point with new options (typically x/y data) and optionally redraw the series.
	 *
	 * @param {Object} options Point options as defined in the series.data array
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 *
	 */
	update: function (options, redraw, animation) {
		var point = this,
			series = point.series,
			graphic = point.graphic,
			i,
			data = series.data,
			dataLength = data.length,
			chart = series.chart;

		redraw = pick(redraw, true);

		// fire the event with a default handler of doing the update
		point.firePointEvent('update', { options: options }, function () {

			point.applyOptions(options);

			// update visuals
			if (isObject(options)) {
				series.getAttribs();
				if (graphic) {
					graphic.attr(point.pointAttr[series.state]);
				}
			}

			// record changes in the parallel arrays
			for (i = 0; i < dataLength; i++) {
				if (data[i] === point) {
					series.xData[i] = point.x;
					series.yData[i] = point.y;
					series.options.data[i] = options;
					break;
				}
			}

			// redraw
			series.isDirty = true;
			series.isDirtyData = true;
			if (redraw) {
				chart.redraw(animation);
			}
		});
	},

	/**
	 * Remove a point and optionally redraw the series and if necessary the axes
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	remove: function (redraw, animation) {
		var point = this,
			series = point.series,
			chart = series.chart,
			i,
			data = series.data,
			dataLength = data.length;

		setAnimation(animation, chart);
		redraw = pick(redraw, true);

		// fire the event with a default handler of removing the point
		point.firePointEvent('remove', null, function () {

			//erase(series.data, point);

			for (i = 0; i < dataLength; i++) {
				if (data[i] === point) {

					// splice all the parallel arrays
					data.splice(i, 1);
					series.options.data.splice(i, 1);
					series.xData.splice(i, 1);
					series.yData.splice(i, 1);
					break;
				}
			}

			point.destroy();


			// redraw
			series.isDirty = true;
			series.isDirtyData = true;
			if (redraw) {
				chart.redraw();
			}
		});


	},

	/**
	 * Fire an event on the Point object. Must not be renamed to fireEvent, as this
	 * causes a name clash in MooTools
	 * @param {String} eventType
	 * @param {Object} eventArgs Additional event arguments
	 * @param {Function} defaultFunction Default event handler
	 */
	firePointEvent: function (eventType, eventArgs, defaultFunction) {
		var point = this,
			series = this.series,
			seriesOptions = series.options;

		// load event handlers on demand to save time on mouseover/out
		if (seriesOptions.point.events[eventType] || (point.options && point.options.events && point.options.events[eventType])) {
			this.importEvents();
		}

		// add default handler if in selection mode
		if (eventType === 'click' && seriesOptions.allowPointSelect) {
			defaultFunction = function (event) {
				// Control key is for Windows, meta (= Cmd key) for Mac, Shift for Opera
				point.select(null, event.ctrlKey || event.metaKey || event.shiftKey);
			};
		}

		fireEvent(this, eventType, eventArgs, defaultFunction);
	},
	/**
	 * Import events from the series' and point's options. Only do it on
	 * demand, to save processing time on hovering.
	 */
	importEvents: function () {
		if (!this.hasImportedEvents) {
			var point = this,
				options = merge(point.series.options.point, point.options),
				events = options.events,
				eventType;

			point.events = events;

			for (eventType in events) {
				addEvent(point, eventType, events[eventType]);
			}
			this.hasImportedEvents = true;

		}
	},

	/**
	 * Set the point's state
	 * @param {String} state
	 */
	setState: function (state) {
		var point = this,
			plotX = point.plotX,
			plotY = point.plotY,
			series = point.series,
			stateOptions = series.options.states,
			markerOptions = defaultPlotOptions[series.type].marker && series.options.marker,
			normalDisabled = markerOptions && !markerOptions.enabled,
			markerStateOptions = markerOptions && markerOptions.states[state],
			stateDisabled = markerStateOptions && markerStateOptions.enabled === false,
			stateMarkerGraphic = series.stateMarkerGraphic,
			chart = series.chart,
			radius,
			pointAttr = point.pointAttr;

		state = state || NORMAL_STATE; // empty string

		if (
				// already has this state
				state === point.state ||
				// selected points don't respond to hover
				(point.selected && state !== SELECT_STATE) ||
				// series' state options is disabled
				(stateOptions[state] && stateOptions[state].enabled === false) ||
				// point marker's state options is disabled
				(state && (stateDisabled || (normalDisabled && !markerStateOptions.enabled)))

			) {
			return;
		}

		// apply hover styles to the existing point
		if (point.graphic) {
			radius = markerOptions && point.graphic.symbolName && pointAttr[state].r;
			point.graphic.attr(merge(
				pointAttr[state],
				radius ? { // new symbol attributes (#507, #612)
					x: plotX - radius,
					y: plotY - radius,
					width: 2 * radius,
					height: 2 * radius
				} : {}
			));
		} else {
			// if a graphic is not applied to each point in the normal state, create a shared
			// graphic for the hover state
			if (state && markerStateOptions) {
				radius = markerStateOptions.radius;
				if (!stateMarkerGraphic) { // add
					series.stateMarkerGraphic = stateMarkerGraphic = chart.renderer.symbol(
						series.symbol,
						plotX - radius,
						plotY - radius,
						2 * radius,
						2 * radius
					)
					.attr(pointAttr[state])
					.add(series.markerGroup);
				
				} else { // update
					stateMarkerGraphic.attr({ // #1054
						x: plotX - radius,
						y: plotY - radius
					});
				}
			}

			if (stateMarkerGraphic) {
				stateMarkerGraphic[state && chart.isInsidePlot(plotX, plotY) ? 'show' : 'hide']();
			}
		}

		point.state = state;
	}
};

/**
 * @classDescription The base function which all other series types inherit from. The data in the series is stored
 * in various arrays.
 *
 * - First, series.options.data contains all the original config options for
 * each point whether added by options or methods like series.addPoint.
 * - Next, series.data contains those values converted to points, but in case the series data length
 * exceeds the cropThreshold, or if the data is grouped, series.data doesn't contain all the points. It
 * only contains the points that have been created on demand.
 * - Then there's series.points that contains all currently visible point objects. In case of cropping,
 * the cropped-away points are not part of this array. The series.points array starts at series.cropStart
 * compared to series.data and series.options.data. If however the series data is grouped, these can't
 * be correlated one to one.
 * - series.xData and series.processedXData contain clean x values, equivalent to series.data and series.points.
 * - series.yData and series.processedYData contain clean x values, equivalent to series.data and series.points.
 *
 * @param {Object} chart
 * @param {Object} options
 */
var Series = function () {};

Series.prototype = {

	isCartesian: true,
	type: 'line',
	pointClass: Point,
	sorted: true, // requires the data to be sorted
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'lineColor',
		'stroke-width': 'lineWidth',
		fill: 'fillColor',
		r: 'radius'
	},
	init: function (chart, options) {
		var series = this,
			eventType,
			events;

		series.chart = chart;
		series.options = options = series.setOptions(options); // merge with plotOptions
		
		// bind the axes
		series.bindAxes();

		// set some variables
		extend(series, {
			name: options.name,
			state: NORMAL_STATE,
			pointAttr: {},
			visible: options.visible !== false, // true by default
			selected: options.selected === true // false by default
		});
		
		// special
		if (useCanVG) {
			options.animation = false;
		}

		// register event listeners
		events = options.events;
		for (eventType in events) {
			addEvent(series, eventType, events[eventType]);
		}
		if (
			(events && events.click) ||
			(options.point && options.point.events && options.point.events.click) ||
			options.allowPointSelect
		) {
			chart.runTrackerClick = true;
		}

		series.getColor();
		series.getSymbol();

		// set the data
		series.setData(options.data, false);
		
		// Mark cartesian
		if (series.isCartesian) {
			chart.hasCartesianSeries = true;
		}

		// Register it in the chart
		chart.series.push(series);
		
		// Sort series according to index option (#248, #1123)
		stableSort(chart.series, function (a, b) {
			return (a.options.index || 0) - (b.options.index || 0);
		});
		each(chart.series, function (series, i) {
			series.index = i;
			series.name = series.name || 'Series ' + (i + 1);
		});
	},
	
	/**
	 * Set the xAxis and yAxis properties of cartesian series, and register the series
	 * in the axis.series array
	 */
	bindAxes: function () {
		var series = this,
			seriesOptions = series.options,
			chart = series.chart,
			axisOptions;
			
		if (series.isCartesian) {
			
			each(['xAxis', 'yAxis'], function (AXIS) { // repeat for xAxis and yAxis
				
				each(chart[AXIS], function (axis) { // loop through the chart's axis objects
					
					axisOptions = axis.options;
					
					// apply if the series xAxis or yAxis option mathches the number of the 
					// axis, or if undefined, use the first axis
					if ((seriesOptions[AXIS] === axisOptions.index) ||
							(seriesOptions[AXIS] === UNDEFINED && axisOptions.index === 0)) {
						
						// register this series in the axis.series lookup
						axis.series.push(series);
						
						// set this series.xAxis or series.yAxis reference
						series[AXIS] = axis;
						
						// mark dirty for redraw
						axis.isDirty = true;
					}
				});
				
			});
		}
	},


	/**
	 * Return an auto incremented x value based on the pointStart and pointInterval options.
	 * This is only used if an x value is not given for the point that calls autoIncrement.
	 */
	autoIncrement: function () {
		var series = this,
			options = series.options,
			xIncrement = series.xIncrement;

		xIncrement = pick(xIncrement, options.pointStart, 0);

		series.pointInterval = pick(series.pointInterval, options.pointInterval, 1);

		series.xIncrement = xIncrement + series.pointInterval;
		return xIncrement;
	},

	/**
	 * Divide the series data into segments divided by null values.
	 */
	getSegments: function () {
		var series = this,
			lastNull = -1,
			segments = [],
			i,
			points = series.points,
			pointsLength = points.length;

		if (pointsLength) { // no action required for []
			
			// if connect nulls, just remove null points
			if (series.options.connectNulls) {
				i = pointsLength;
				while (i--) {
					if (points[i].y === null) {
						points.splice(i, 1);
					}
				}
				if (points.length) {
					segments = [points];
				}
				
			// else, split on null points
			} else {
				each(points, function (point, i) {
					if (point.y === null) {
						if (i > lastNull + 1) {
							segments.push(points.slice(lastNull + 1, i));
						}
						lastNull = i;
					} else if (i === pointsLength - 1) { // last value
						segments.push(points.slice(lastNull + 1, i + 1));
					}
				});
			}
		}
		
		// register it
		series.segments = segments;
	},
	/**
	 * Set the series options by merging from the options tree
	 * @param {Object} itemOptions
	 */
	setOptions: function (itemOptions) {
		var chart = this.chart,
			chartOptions = chart.options,
			plotOptions = chartOptions.plotOptions,
			typeOptions = plotOptions[this.type],
			data = itemOptions.data,
			options;

		itemOptions.data = null; // remove from merge to prevent looping over the data set

		options = merge(
			typeOptions,
			plotOptions.series,
			itemOptions
		);
		
		// Re-insert the data array to the options and the original config (#717)
		options.data = itemOptions.data = data;
		
		// the tooltip options are merged between global and series specific options
		this.tooltipOptions = merge(chartOptions.tooltip, options.tooltip);
		
		// Delte marker object if not allowed (#1125)
		if (typeOptions.marker === null) {
			delete options.marker;
		}
		
		return options;

	},
	/**
	 * Get the series' color
	 */
	getColor: function () {
		var options = this.options,
			defaultColors = this.chart.options.colors,
			counters = this.chart.counters;
		this.color = options.color ||
			(!options.colorByPoint && defaultColors[counters.color++]) || 'gray';
		counters.wrapColor(defaultColors.length);
	},
	/**
	 * Get the series' symbol
	 */
	getSymbol: function () {
		var series = this,
			seriesMarkerOption = series.options.marker,
			chart = series.chart,
			defaultSymbols = chart.options.symbols,
			counters = chart.counters;
		series.symbol = seriesMarkerOption.symbol || defaultSymbols[counters.symbol++];
		
		// don't substract radius in image symbols (#604)
		if (/^url/.test(series.symbol)) {
			seriesMarkerOption.radius = 0;
		}
		counters.wrapSymbol(defaultSymbols.length);
	},

	/**
	 * Get the series' symbol in the legend. This method should be overridable to create custom 
	 * symbols through Highcharts.seriesTypes[type].prototype.drawLegendSymbols.
	 * 
	 * @param {Object} legend The legend object
	 */
	drawLegendSymbol: function (legend) {
		
		var options = this.options,
			markerOptions = options.marker,
			radius,
			legendOptions = legend.options,
			legendSymbol,
			symbolWidth = legendOptions.symbolWidth,
			renderer = this.chart.renderer,
			legendItemGroup = this.legendGroup,
			baseline = legend.baseline,
			attr;
			
		// Draw the line
		if (options.lineWidth) {
			attr = {
				'stroke-width': options.lineWidth
			};
			if (options.dashStyle) {
				attr.dashstyle = options.dashStyle;
			}
			this.legendLine = renderer.path([
				M,
				0,
				baseline - 4,
				L,
				symbolWidth,
				baseline - 4
			])
			.attr(attr)
			.add(legendItemGroup);
		}
		
		// Draw the marker
		if (markerOptions && markerOptions.enabled) {
			radius = markerOptions.radius;
			this.legendSymbol = legendSymbol = renderer.symbol(
				this.symbol,
				(symbolWidth / 2) - radius,
				baseline - 4 - radius,
				2 * radius,
				2 * radius
			)
			.add(legendItemGroup);
		}
	},

	/**
	 * Add a point dynamically after chart load time
	 * @param {Object} options Point options as given in series.data
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean} shift If shift is true, a point is shifted off the start
	 *    of the series as one is appended to the end.
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */
	addPoint: function (options, redraw, shift, animation) {
		var series = this,
			data = series.data,
			graph = series.graph,
			area = series.area,
			chart = series.chart,
			xData = series.xData,
			yData = series.yData,
			currentShift = (graph && graph.shift) || 0,
			dataOptions = series.options.data,
			point,
			proto = series.pointClass.prototype;

		setAnimation(animation, chart);

		// Make graph animate sideways
		if (graph && shift) { 
			graph.shift = currentShift + 1;
		}
		if (area) {
			if (shift) { // #780
				area.shift = currentShift + 1;
			}
			area.isArea = true; // needed in animation, both with and without shift
		}
		
		// Optional redraw, defaults to true
		redraw = pick(redraw, true);

		// Get options and push the point to xData, yData and series.options. In series.generatePoints
		// the Point instance will be created on demand and pushed to the series.data array.
		point = { series: series };
		proto.applyOptions.apply(point, [options]);
		xData.push(point.x);
		yData.push(proto.toYData ? proto.toYData.call(point) : point.y);
		dataOptions.push(options);


		// Shift the first point off the parallel arrays
		// todo: consider series.removePoint(i) method
		if (shift) {
			if (data[0] && data[0].remove) {
				data[0].remove(false);
			} else {
				data.shift();
				xData.shift();
				yData.shift();
				dataOptions.shift();
			}
		}
		series.getAttribs();

		// redraw
		series.isDirty = true;
		series.isDirtyData = true;
		if (redraw) {
			chart.redraw();
		}
	},

	/**
	 * Replace the series data with a new set of data
	 * @param {Object} data
	 * @param {Object} redraw
	 */
	setData: function (data, redraw) {
		var series = this,
			oldData = series.points,
			options = series.options,
			initialColor = series.initialColor,
			chart = series.chart,
			firstPoint = null,
			xAxis = series.xAxis,
			i,
			pointProto = series.pointClass.prototype;

		// reset properties
		series.xIncrement = null;
		series.pointRange = xAxis && xAxis.categories ? 1 : options.pointRange;

		if (defined(initialColor)) { // reset colors for pie
			chart.counters.color = initialColor;
		}
		
		// parallel arrays
		var xData = [],
			yData = [],
			dataLength = data ? data.length : [],
			turboThreshold = options.turboThreshold || 1000,
			pt,
			pointArrayMap = series.pointArrayMap,
			valueCount = pointArrayMap && pointArrayMap.length;

		// In turbo mode, only one- or twodimensional arrays of numbers are allowed. The
		// first value is tested, and we assume that all the rest are defined the same
		// way. Although the 'for' loops are similar, they are repeated inside each
		// if-else conditional for max performance.
		if (dataLength > turboThreshold) {
			
			// find the first non-null point
			i = 0;
			while (firstPoint === null && i < dataLength) {
				firstPoint = data[i];
				i++;
			}
		
		
			if (isNumber(firstPoint)) { // assume all points are numbers
				var x = pick(options.pointStart, 0),
					pointInterval = pick(options.pointInterval, 1);

				for (i = 0; i < dataLength; i++) {
					xData[i] = x;
					yData[i] = data[i];
					x += pointInterval;
				}
				series.xIncrement = x;
			} else if (isArray(firstPoint)) { // assume all points are arrays
				if (valueCount) { // [x, low, high] or [x, o, h, l, c]
					for (i = 0; i < dataLength; i++) {
						pt = data[i];
						xData[i] = pt[0];
						yData[i] = pt.slice(1, valueCount + 1);
					}
				} else { // [x, y]
					for (i = 0; i < dataLength; i++) {
						pt = data[i];
						xData[i] = pt[0];
						yData[i] = pt[1];
					}
				}
			} /* else {
				error(12); // Highcharts expects configs to be numbers or arrays in turbo mode
			}*/
		} else {
			for (i = 0; i < dataLength; i++) {
				pt = { series: series };
				pointProto.applyOptions.apply(pt, [data[i]]);
				xData[i] = pt.x;
				yData[i] = pointProto.toYData ? pointProto.toYData.call(pt) : pt.y;
			}
		}

		// Forgetting to cast strings to numbers is a common caveat when handling CSV or JSON		
		if (isString(yData[0])) {
			error(14, true);
		} 

		series.data = [];
		series.options.data = data;
		series.xData = xData;
		series.yData = yData;

		// destroy old points
		i = (oldData && oldData.length) || 0;
		while (i--) {
			if (oldData[i] && oldData[i].destroy) {
				oldData[i].destroy();
			}
		}

		// reset minRange (#878)
		if (xAxis) {
			xAxis.minRange = xAxis.userMinRange;
		}

		// redraw
		series.isDirty = series.isDirtyData = chart.isDirtyBox = true;
		if (pick(redraw, true)) {
			chart.redraw(false);
		}
	},

	/**
	 * Remove a series and optionally redraw the chart
	 *
	 * @param {Boolean} redraw Whether to redraw the chart or wait for an explicit call
	 * @param {Boolean|Object} animation Whether to apply animation, and optionally animation
	 *    configuration
	 */

	remove: function (redraw, animation) {
		var series = this,
			chart = series.chart;
		redraw = pick(redraw, true);

		if (!series.isRemoving) {  /* prevent triggering native event in jQuery
				(calling the remove function from the remove event) */
			series.isRemoving = true;

			// fire the event with a default handler of removing the point
			fireEvent(series, 'remove', null, function () {


				// destroy elements
				series.destroy();


				// redraw
				chart.isDirtyLegend = chart.isDirtyBox = true;
				if (redraw) {
					chart.redraw(animation);
				}
			});

		}
		series.isRemoving = false;
	},

	/**
	 * Process the data by cropping away unused data points if the series is longer
	 * than the crop threshold. This saves computing time for lage series.
	 */
	processData: function (force) {
		var series = this,
			processedXData = series.xData, // copied during slice operation below
			processedYData = series.yData,
			dataLength = processedXData.length,
			cropStart = 0,
			cropEnd = dataLength,
			cropped,
			distance,
			closestPointRange,
			xAxis = series.xAxis,
			i, // loop variable
			options = series.options,
			cropThreshold = options.cropThreshold,
			isCartesian = series.isCartesian;

		// If the series data or axes haven't changed, don't go through this. Return false to pass
		// the message on to override methods like in data grouping. 
		if (isCartesian && !series.isDirty && !xAxis.isDirty && !series.yAxis.isDirty && !force) {
			return false;
		}

		// optionally filter out points outside the plot area
		if (isCartesian && series.sorted && (!cropThreshold || dataLength > cropThreshold || series.forceCrop)) {
			var extremes = xAxis.getExtremes(),
				min = extremes.min,
				max = extremes.max;

			// it's outside current extremes
			if (processedXData[dataLength - 1] < min || processedXData[0] > max) {
				processedXData = [];
				processedYData = [];
			
			// only crop if it's actually spilling out
			} else if (processedXData[0] < min || processedXData[dataLength - 1] > max) {

				// iterate up to find slice start
				for (i = 0; i < dataLength; i++) {
					if (processedXData[i] >= min) {
						cropStart = mathMax(0, i - 1);
						break;
					}
				}
				// proceed to find slice end
				for (; i < dataLength; i++) {
					if (processedXData[i] > max) {
						cropEnd = i + 1;
						break;
					}
					
				}
				processedXData = processedXData.slice(cropStart, cropEnd);
				processedYData = processedYData.slice(cropStart, cropEnd);
				cropped = true;
			}
		}
		
		
		// Find the closest distance between processed points
		for (i = processedXData.length - 1; i > 0; i--) {
			distance = processedXData[i] - processedXData[i - 1];
			if (distance > 0 && (closestPointRange === UNDEFINED || distance < closestPointRange)) {
				closestPointRange = distance;
			}
		}
		
		// Record the properties
		series.cropped = cropped; // undefined or true
		series.cropStart = cropStart;
		series.processedXData = processedXData;
		series.processedYData = processedYData;
		
		if (options.pointRange === null) { // null means auto, as for columns, candlesticks and OHLC
			series.pointRange = closestPointRange || 1;
		}
		series.closestPointRange = closestPointRange;
		
	},

	/**
	 * Generate the data point after the data has been processed by cropping away
	 * unused points and optionally grouped in Highcharts Stock.
	 */
	generatePoints: function () {
		var series = this,
			options = series.options,
			dataOptions = options.data,
			data = series.data,
			dataLength,
			processedXData = series.processedXData,
			processedYData = series.processedYData,
			pointClass = series.pointClass,
			processedDataLength = processedXData.length,
			cropStart = series.cropStart || 0,
			cursor,
			hasGroupedData = series.hasGroupedData,
			point,
			points = [],
			i;

		if (!data && !hasGroupedData) {
			var arr = [];
			arr.length = dataOptions.length;
			data = series.data = arr;
		}

		for (i = 0; i < processedDataLength; i++) {
			cursor = cropStart + i;
			if (!hasGroupedData) {
				if (data[cursor]) {
					point = data[cursor];
				} else if (dataOptions[cursor] !== UNDEFINED) { // #970
					data[cursor] = point = (new pointClass()).init(series, dataOptions[cursor], processedXData[i]);
				}
				points[i] = point;
			} else {
				// splat the y data in case of ohlc data array
				points[i] = (new pointClass()).init(series, [processedXData[i]].concat(splat(processedYData[i])));
			}
		}

		// Hide cropped-away points - this only runs when the number of points is above cropThreshold, or when
		// swithching view from non-grouped data to grouped data (#637)	
		if (data && (processedDataLength !== (dataLength = data.length) || hasGroupedData)) {
			for (i = 0; i < dataLength; i++) {
				if (i === cropStart && !hasGroupedData) { // when has grouped data, clear all points
					i += processedDataLength;
				}
				if (data[i]) {
					data[i].destroyElements();
					data[i].plotX = UNDEFINED; // #1003
				}
			}
		}

		series.data = data;
		series.points = points;
	},

	/**
	 * Translate data points from raw data values to chart specific positioning data
	 * needed later in drawPoints, drawGraph and drawTracker.
	 */
	translate: function () {
		if (!this.processedXData) { // hidden series
			this.processData();
		}
		this.generatePoints();
		var series = this,
			chart = series.chart,
			options = series.options,
			stacking = options.stacking,
			xAxis = series.xAxis,
			categories = xAxis.categories,
			yAxis = series.yAxis,
			points = series.points,
			dataLength = points.length,
			hasModifyValue = !!series.modifyValue,
			isBottomSeries,
			allStackSeries = yAxis.series,
			i = allStackSeries.length,
			placeBetween = options.pointPlacement === 'between';
			//nextSeriesDown;
			
		// Is it the last visible series?
		while (i--) {
			if (allStackSeries[i].visible) {
				if (allStackSeries[i] === series) { // #809
					isBottomSeries = true;
				}
				break;
			}
		}
		
		// Translate each point
		for (i = 0; i < dataLength; i++) {
			var point = points[i],
				xValue = point.x,
				yValue = point.y,
				yBottom = point.low,
				stack = yAxis.stacks[(yValue < options.threshold ? '-' : '') + series.stackKey],
				pointStack,
				pointStackTotal;
				
			// get the plotX translation
			//point.plotX = mathRound(xAxis.translate(xValue, 0, 0, 0, 1) * 10) / 10; // Math.round fixes #591
			point.plotX = xAxis.translate(xValue, 0, 0, 0, 1, placeBetween); // Math.round fixes #591

			// calculate the bottom y value for stacked series
			if (stacking && series.visible && stack && stack[xValue]) {
				pointStack = stack[xValue];
				pointStackTotal = pointStack.total;
				pointStack.cum = yBottom = pointStack.cum - yValue; // start from top
				yValue = yBottom + yValue;
				
				if (isBottomSeries) {
					yBottom = pick(options.threshold, yAxis.min);
				}
				
				if (yAxis.isLog && yBottom <= 0) { // #1200, #1232
					yBottom = null;
				}
				
				if (stacking === 'percent') {
					yBottom = pointStackTotal ? yBottom * 100 / pointStackTotal : 0;
					yValue = pointStackTotal ? yValue * 100 / pointStackTotal : 0;
				}

				point.percentage = pointStackTotal ? point.y * 100 / pointStackTotal : 0;
				point.total = point.stackTotal = pointStackTotal;
				point.stackY = yValue;
			}

			// Set translated yBottom or remove it
			point.yBottom = defined(yBottom) ? 
				yAxis.translate(yBottom, 0, 1, 0, 1) :
				null;
			
			// general hook, used for Highstock compare mode
			if (hasModifyValue) {
				yValue = series.modifyValue(yValue, point);
			}

			// Set the the plotY value, reset it for redraws
			point.plotY = (typeof yValue === 'number') ? 
				mathRound(yAxis.translate(yValue, 0, 1, 0, 1) * 10) / 10 : // Math.round fixes #591
				UNDEFINED;
			
			// set client related positions for mouse tracking
			point.clientX = chart.inverted ?
				chart.plotHeight - point.plotX :
				point.plotX; // for mouse tracking

			// some API data
			point.category = categories && categories[point.x] !== UNDEFINED ?
				categories[point.x] : point.x;


		}

		// now that we have the cropped data, build the segments
		series.getSegments();
	},
	/**
	 * Memoize tooltip texts and positions
	 */
	setTooltipPoints: function (renew) {
		var series = this,
			points = [],
			pointsLength,
			low,
			high,
			xAxis = series.xAxis,
			axisLength = xAxis ? (xAxis.tooltipLen || xAxis.len) : series.chart.plotSizeX, // tooltipLen and tooltipPosName used in polar
			plotX = (xAxis && xAxis.tooltipPosName) || 'plotX',
			point,
			i,
			tooltipPoints = []; // a lookup array for each pixel in the x dimension

		// don't waste resources if tracker is disabled
		if (series.options.enableMouseTracking === false) {
			return;
		}

		// renew
		if (renew) {
			series.tooltipPoints = null;
		}

		// concat segments to overcome null values
		each(series.segments || series.points, function (segment) {
			points = points.concat(segment);
		});

		// Reverse the points in case the X axis is reversed
		if (xAxis && xAxis.reversed) {
			points = points.reverse();
		}

		// Assign each pixel position to the nearest point
		pointsLength = points.length;
		for (i = 0; i < pointsLength; i++) {
			point = points[i];
			// Set this range's low to the last range's high plus one
			low = points[i - 1] ? high + 1 : 0;
			// Now find the new high
			high = points[i + 1] ?
				mathMax(0, mathFloor((point[plotX] + (points[i + 1] ? points[i + 1][plotX] : axisLength)) / 2)) :
				axisLength;

			while (low >= 0 && low <= high) {
				tooltipPoints[low++] = point;
			}
		}
		series.tooltipPoints = tooltipPoints;
	},

	/**
	 * Format the header of the tooltip
	 */
	tooltipHeaderFormatter: function (key) {
		var series = this,
			tooltipOptions = series.tooltipOptions,
			xDateFormat = tooltipOptions.xDateFormat,
			xAxis = series.xAxis,
			isDateTime = xAxis && xAxis.options.type === 'datetime',
			n;
			
		// Guess the best date format based on the closest point distance (#568)
		if (isDateTime && !xDateFormat) {
			for (n in timeUnits) {
				if (timeUnits[n] >= xAxis.closestPointRange) {
					xDateFormat = tooltipOptions.dateTimeLabelFormats[n];
					break;
				}	
			}		
		}
		
		return tooltipOptions.headerFormat
			.replace('{point.key}', isDateTime && isNumber(key) ? dateFormat(xDateFormat, key) :  key)
			.replace('{series.name}', series.name)
			.replace('{series.color}', series.color);
	},

	/**
	 * Series mouse over handler
	 */
	onMouseOver: function () {
		var series = this,
			chart = series.chart,
			hoverSeries = chart.hoverSeries;

		/*if (!hasTouch && chart.mouseIsDown) {
			return;
		}*/

		// set normal state to previous series
		if (hoverSeries && hoverSeries !== series) {
			hoverSeries.onMouseOut();
		}

		// trigger the event, but to save processing time,
		// only if defined
		if (series.options.events.mouseOver) {
			fireEvent(series, 'mouseOver');
		}

		// hover this
		series.setState(HOVER_STATE);
		chart.hoverSeries = series;
	},

	/**
	 * Series mouse out handler
	 */
	onMouseOut: function () {
		// trigger the event only if listeners exist
		var series = this,
			options = series.options,
			chart = series.chart,
			tooltip = chart.tooltip,
			hoverPoint = chart.hoverPoint;

		// trigger mouse out on the point, which must be in this series
		if (hoverPoint) {
			hoverPoint.onMouseOut();
		}

		// fire the mouse out event
		if (series && options.events.mouseOut) {
			fireEvent(series, 'mouseOut');
		}


		// hide the tooltip
		if (tooltip && !options.stickyTracking && !tooltip.shared) {
			tooltip.hide();
		}

		// set normal state
		series.setState();
		chart.hoverSeries = null;
	},

	/**
	 * Animate in the series
	 */
	animate: function (init) {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			clipRect,
			markerClipRect,
			animation = series.options.animation,
			clipBox = chart.clipBox,
			inverted = chart.inverted,
			sharedClipKey;

		// Animation option is set to true
		if (animation && !isObject(animation)) {
			animation = defaultPlotOptions[series.type].animation;
		}
		sharedClipKey = '_sharedClip' + animation.duration + animation.easing;

		// Initialize the animation. Set up the clipping rectangle.
		if (init) { 
			
			// If a clipping rectangle with the same properties is currently present in the chart, use that. 
			clipRect = chart[sharedClipKey];
			markerClipRect = chart[sharedClipKey + 'm'];
			if (!clipRect) {
				chart[sharedClipKey] = clipRect = renderer.clipRect(
					extend(clipBox, { width: 0 })
				);
				
				chart[sharedClipKey + 'm'] = markerClipRect = renderer.clipRect(
					-99, // include the width of the first marker
					inverted ? -chart.plotLeft : -chart.plotTop, 
					99,
					inverted ? chart.chartWidth : chart.chartHeight
				);
			}
			series.group.clip(clipRect);
			series.markerGroup.clip(markerClipRect);
			series.sharedClipKey = sharedClipKey;

		// Run the animation
		} else { 
			clipRect = chart[sharedClipKey];
			if (clipRect) {
				clipRect.animate({
					width: chart.plotSizeX
				}, animation);
				chart[sharedClipKey + 'm'].animate({
					width: chart.plotSizeX + 99
				}, animation);
			}

			// Delete this function to allow it only once
			series.animate = null;
			
			// Call the afterAnimate function on animation complete (but don't overwrite the animation.complete option
			// which should be available to the user).
			series.animationTimeout = setTimeout(function () {
				series.afterAnimate();
			}, animation.duration);
		}
	},
	
	/**
	 * This runs after animation to land on the final plot clipping
	 */
	afterAnimate: function () {
		var chart = this.chart,
			sharedClipKey = this.sharedClipKey,
			group = this.group;
			
		if (group && this.options.clip !== false) {
			group.clip(chart.clipRect);
			this.markerGroup.clip(); // no clip
		}
		
		// Remove the shared clipping rectancgle when all series are shown		
		setTimeout(function () {
			if (sharedClipKey && chart[sharedClipKey]) {
				chart[sharedClipKey] = chart[sharedClipKey].destroy();
				chart[sharedClipKey + 'm'] = chart[sharedClipKey + 'm'].destroy();
			}
		}, 100);
	},

	/**
	 * Draw the markers
	 */
	drawPoints: function () {
		var series = this,
			pointAttr,
			points = series.points,
			chart = series.chart,
			plotX,
			plotY,
			i,
			point,
			radius,
			symbol,
			isImage,
			graphic,
			options = series.options,
			seriesMarkerOptions = options.marker,
			pointMarkerOptions,
			enabled,
			isInside,
			markerGroup = series.markerGroup;

		if (seriesMarkerOptions.enabled || series._hasPointMarkers) {
			
			i = points.length;
			while (i--) {
				point = points[i];
				plotX = point.plotX;
				plotY = point.plotY;
				graphic = point.graphic;
				pointMarkerOptions = point.marker || {};
				enabled = (seriesMarkerOptions.enabled && pointMarkerOptions.enabled === UNDEFINED) || pointMarkerOptions.enabled;
				isInside = chart.isInsidePlot(plotX, plotY, chart.inverted);
				
				// only draw the point if y is defined
				if (enabled && plotY !== UNDEFINED && !isNaN(plotY)) {

					// shortcuts
					pointAttr = point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE];
					radius = pointAttr.r;
					symbol = pick(pointMarkerOptions.symbol, series.symbol);
					isImage = symbol.indexOf('url') === 0;

					if (graphic) { // update
						graphic
							.attr({ // Since the marker group isn't clipped, each individual marker must be toggled
								visibility: isInside ? (hasSVG ? 'inherit' : VISIBLE) : HIDDEN
							})
							.animate(extend({
								x: plotX - radius,
								y: plotY - radius
							}, graphic.symbolName ? { // don't apply to image symbols #507
								width: 2 * radius,
								height: 2 * radius
							} : {}));
					} else if (isInside && (radius > 0 || isImage)) {
						point.graphic = graphic = chart.renderer.symbol(
							symbol,
							plotX - radius,
							plotY - radius,
							2 * radius,
							2 * radius
						)
						.attr(pointAttr)
						.add(markerGroup);
					}
					
				} else if (graphic) {
					point.graphic = graphic.destroy(); // #1269
				}
			}
		}

	},

	/**
	 * Convert state properties from API naming conventions to SVG attributes
	 *
	 * @param {Object} options API options object
	 * @param {Object} base1 SVG attribute object to inherit from
	 * @param {Object} base2 Second level SVG attribute object to inherit from
	 */
	convertAttribs: function (options, base1, base2, base3) {
		var conversion = this.pointAttrToOptions,
			attr,
			option,
			obj = {};

		options = options || {};
		base1 = base1 || {};
		base2 = base2 || {};
		base3 = base3 || {};

		for (attr in conversion) {
			option = conversion[attr];
			obj[attr] = pick(options[option], base1[attr], base2[attr], base3[attr]);
		}
		return obj;
	},

	/**
	 * Get the state attributes. Each series type has its own set of attributes
	 * that are allowed to change on a point's state change. Series wide attributes are stored for
	 * all series, and additionally point specific attributes are stored for all
	 * points with individual marker options. If such options are not defined for the point,
	 * a reference to the series wide attributes is stored in point.pointAttr.
	 */
	getAttribs: function () {
		var series = this,
			normalOptions = defaultPlotOptions[series.type].marker ? series.options.marker : series.options,
			stateOptions = normalOptions.states,
			stateOptionsHover = stateOptions[HOVER_STATE],
			pointStateOptionsHover,
			seriesColor = series.color,
			normalDefaults = {
				stroke: seriesColor,
				fill: seriesColor
			},
			points = series.points || [], // #927
			i,
			point,
			seriesPointAttr = [],
			pointAttr,
			pointAttrToOptions = series.pointAttrToOptions,
			hasPointSpecificOptions,
			key;

		// series type specific modifications
		if (series.options.marker) { // line, spline, area, areaspline, scatter

			// if no hover radius is given, default to normal radius + 2
			stateOptionsHover.radius = stateOptionsHover.radius || normalOptions.radius + 2;
			stateOptionsHover.lineWidth = stateOptionsHover.lineWidth || normalOptions.lineWidth + 1;

		} else { // column, bar, pie

			// if no hover color is given, brighten the normal color
			stateOptionsHover.color = stateOptionsHover.color ||
				Color(stateOptionsHover.color || seriesColor)
					.brighten(stateOptionsHover.brightness).get();
		}

		// general point attributes for the series normal state
		seriesPointAttr[NORMAL_STATE] = series.convertAttribs(normalOptions, normalDefaults);

		// HOVER_STATE and SELECT_STATE states inherit from normal state except the default radius
		each([HOVER_STATE, SELECT_STATE], function (state) {
			seriesPointAttr[state] =
					series.convertAttribs(stateOptions[state], seriesPointAttr[NORMAL_STATE]);
		});

		// set it
		series.pointAttr = seriesPointAttr;


		// Generate the point-specific attribute collections if specific point
		// options are given. If not, create a referance to the series wide point
		// attributes
		i = points.length;
		while (i--) {
			point = points[i];
			normalOptions = (point.options && point.options.marker) || point.options;
			if (normalOptions && normalOptions.enabled === false) {
				normalOptions.radius = 0;
			}
			hasPointSpecificOptions = series.options.colorByPoint; // #868
			
			// check if the point has specific visual options
			if (point.options) {
				for (key in pointAttrToOptions) {
					if (defined(normalOptions[pointAttrToOptions[key]])) {
						hasPointSpecificOptions = true;
					}
				}
			}



			// a specific marker config object is defined for the individual point:
			// create it's own attribute collection
			if (hasPointSpecificOptions) {
				normalOptions = normalOptions || {};
				pointAttr = [];
				stateOptions = normalOptions.states || {}; // reassign for individual point
				pointStateOptionsHover = stateOptions[HOVER_STATE] = stateOptions[HOVER_STATE] || {};

				// Handle colors for column and pies
				if (!series.options.marker) { // column, bar, point
					// if no hover color is given, brighten the normal color
					pointStateOptionsHover.color =
						Color(pointStateOptionsHover.color || point.color)
							.brighten(pointStateOptionsHover.brightness ||
								stateOptionsHover.brightness).get();

				}

				// normal point state inherits series wide normal state
				pointAttr[NORMAL_STATE] = series.convertAttribs(extend({
					color: point.color // #868
				}, normalOptions), seriesPointAttr[NORMAL_STATE]);

				// inherit from point normal and series hover
				pointAttr[HOVER_STATE] = series.convertAttribs(
					stateOptions[HOVER_STATE],
					seriesPointAttr[HOVER_STATE],
					pointAttr[NORMAL_STATE]
				);
				// inherit from point normal and series hover
				pointAttr[SELECT_STATE] = series.convertAttribs(
					stateOptions[SELECT_STATE],
					seriesPointAttr[SELECT_STATE],
					pointAttr[NORMAL_STATE]
				);



			// no marker config object is created: copy a reference to the series-wide
			// attribute collection
			} else {
				pointAttr = seriesPointAttr;
			}

			point.pointAttr = pointAttr;

		}

	},


	/**
	 * Clear DOM objects and free up memory
	 */
	destroy: function () {
		var series = this,
			chart = series.chart,
			issue134 = /AppleWebKit\/533/.test(userAgent),
			destroy,
			i,
			data = series.data || [],
			point,
			prop,
			axis;

		// add event hook
		fireEvent(series, 'destroy');

		// remove all events
		removeEvent(series);
		
		// erase from axes
		each(['xAxis', 'yAxis'], function (AXIS) {
			axis = series[AXIS];
			if (axis) {
				erase(axis.series, series);
				axis.isDirty = true;
			}
		});

		// remove legend items
		if (series.legendItem) {
			series.chart.legend.destroyItem(series);
		}

		// destroy all points with their elements
		i = data.length;
		while (i--) {
			point = data[i];
			if (point && point.destroy) {
				point.destroy();
			}
		}
		series.points = null;

		// Clear the animation timeout if we are destroying the series during initial animation
		clearTimeout(series.animationTimeout);

		// destroy all SVGElements associated to the series
		each(['area', 'graph', 'dataLabelsGroup', 'group', 'markerGroup', 'tracker', 'trackerGroup'], function (prop) {
			if (series[prop]) {

				// issue 134 workaround
				destroy = issue134 && prop === 'group' ?
					'hide' :
					'destroy';

				series[prop][destroy]();
			}
		});

		// remove from hoverSeries
		if (chart.hoverSeries === series) {
			chart.hoverSeries = null;
		}
		erase(chart.series, series);

		// clear all members
		for (prop in series) {
			delete series[prop];
		}
	},

	/**
	 * Draw the data labels
	 */
	drawDataLabels: function () {
		
		var series = this,
			seriesOptions = series.options,
			options = seriesOptions.dataLabels,
			points = series.points,
			pointOptions,
			generalOptions,
			str,
			dataLabelsGroup;
		
		if (options.enabled || series._hasPointLabels) {
						
			// Process default alignment of data labels for columns
			if (series.dlProcessOptions) {
				series.dlProcessOptions(options);
			}

			// Create a separate group for the data labels to avoid rotation
			dataLabelsGroup = series.plotGroup(
				'dataLabelsGroup', 
				'data-labels', 
				series.visible ? VISIBLE : HIDDEN, 
				6
			);
			
			// Make the labels for each point
			generalOptions = options;
			each(points, function (point) {
				
				var enabled,
					dataLabel = point.dataLabel,
					attr,
					name,
					rotation,
					isNew = true;
				
				// Determine if each data label is enabled
				pointOptions = point.options && point.options.dataLabels;
				enabled = generalOptions.enabled || (pointOptions && pointOptions.enabled);
				
				
				// If the point is outside the plot area, destroy it. #678, #820
				if (dataLabel && !enabled) {
					point.dataLabel = dataLabel.destroy();
				
				// Individual labels are disabled if the are explicitly disabled 
				// in the point options, or if they fall outside the plot area.
				} else if (enabled) {
					
					rotation = options.rotation;
					
					// Create individual options structure that can be extended without 
					// affecting others
					options = merge(generalOptions, pointOptions);
				
					// Get the string
					str = options.formatter.call(point.getLabelConfig(), options);
					
					// Determine the color
					options.style.color = pick(options.color, options.style.color, series.color, 'black');
	
					
					// update existing label
					if (dataLabel) {
						// vertically centered
						dataLabel
							.attr({
								text: str
							});
						isNew = false;
					// create new label
					} else if (defined(str)) {
						attr = {
							//align: align,
							fill: options.backgroundColor,
							stroke: options.borderColor,
							'stroke-width': options.borderWidth,
							r: options.borderRadius || 0,
							rotation: rotation,
							padding: options.padding,
							zIndex: 1
						};
						// Remove unused attributes (#947)
						for (name in attr) {
							if (attr[name] === UNDEFINED) {
								delete attr[name];
							}
						}
						
						dataLabel = point.dataLabel = series.chart.renderer[rotation ? 'text' : 'label']( // labels don't support rotation
							str,
							0,
							-999,
							null,
							null,
							null,
							options.useHTML
						)
						.attr(attr)
						.css(options.style)
						.add(dataLabelsGroup)
						.shadow(options.shadow);
						
					}
					
					// Now the data label is created and placed at 0,0, so we need to align it
					if (dataLabel) {
						series.alignDataLabel(point, dataLabel, options, null, isNew);
					}
				}
			});
		}
	},
	
	/**
	 * Align each individual data label
	 */
	alignDataLabel: function (point, dataLabel, options, alignTo, isNew) {
		var chart = this.chart,
			inverted = chart.inverted,
			plotX = pick(point.plotX, -999),
			plotY = pick(point.plotY, -999),
			bBox = dataLabel.getBBox(),
			alignAttr; // the final position;
				
		// The alignment box is a singular point
		alignTo = extend({
			x: inverted ? chart.plotWidth - plotY : plotX,
			y: mathRound(inverted ? chart.plotHeight - plotX : plotY),
			width: 0,
			height: 0
		}, alignTo);
		
		// Add the text size for alignment calculation
		extend(options, {
			width: bBox.width,
			height: bBox.height
		});
		
		// Allow a hook for changing alignment in the last moment, then do the alignment
		if (options.rotation) { // Fancy box alignment isn't supported for rotated text
			alignAttr = {
				align: options.align,
				x: alignTo.x + options.x + alignTo.width / 2,
				y: alignTo.y + options.y + alignTo.height / 2
			};
			dataLabel[isNew ? 'attr' : 'animate'](alignAttr);
		} else {
			dataLabel.align(options, null, alignTo);
			alignAttr = dataLabel.alignAttr;
		}
		
		// Show or hide based on the final aligned position
		dataLabel.attr({
			visibility: options.crop === false || chart.isInsidePlot(alignAttr.x, alignAttr.y) || chart.isInsidePlot(plotX, plotY, inverted) ? 
				(hasSVG ? 'inherit' : VISIBLE) : 
				HIDDEN
		});
				
	},
	
	/**
	 * Return the graph path of a segment
	 */
	getSegmentPath: function (segment) {		
		var series = this,
			segmentPath = [];
		
		// build the segment line
		each(segment, function (point, i) {

			if (series.getPointSpline) { // generate the spline as defined in the SplineSeries object
				segmentPath.push.apply(segmentPath, series.getPointSpline(segment, point, i));

			} else {

				// moveTo or lineTo
				segmentPath.push(i ? L : M);

				// step line?
				if (i && series.options.step) {
					var lastPoint = segment[i - 1];
					segmentPath.push(
						point.plotX,
						lastPoint.plotY
					);
				}

				// normal line to next point
				segmentPath.push(
					point.plotX,
					point.plotY
				);
			}
		});
		
		return segmentPath;
	},

	/**
	 * Get the graph path
	 */
	getGraphPath: function () {
		var series = this,
			graphPath = [],
			segmentPath,
			singlePoints = []; // used in drawTracker

		// Divide into segments and build graph and area paths
		each(series.segments, function (segment) {
			
			segmentPath = series.getSegmentPath(segment);
			
			// add the segment to the graph, or a single point for tracking
			if (segment.length > 1) {
				graphPath = graphPath.concat(segmentPath);
			} else {
				singlePoints.push(segment[0]);
			}
		});

		// Record it for use in drawGraph and drawTracker, and return graphPath
		series.singlePoints = singlePoints;
		series.graphPath = graphPath;
		
		return graphPath;
		
	},
	
	/**
	 * Draw the actual graph
	 */
	drawGraph: function () {		
		var options = this.options,
			graph = this.graph,
			group = this.group,
			color = options.lineColor || this.color,
			lineWidth = options.lineWidth,
			dashStyle =  options.dashStyle,
			attribs,
			graphPath = this.getGraphPath();
			

		// draw the graph
		if (graph) {
			stop(graph); // cancel running animations, #459
			graph.animate({ d: graphPath });

		} else {
			if (lineWidth) {
				attribs = {
					stroke: color,
					'stroke-width': lineWidth,
					zIndex: 1 // #1069
				};
				if (dashStyle) {
					attribs.dashstyle = dashStyle;
				}

				this.graph = this.chart.renderer.path(graphPath)
					.attr(attribs).add(group).shadow(options.shadow);
			}
		}
	},

	/**
	 * Initialize and perform group inversion on series.group and series.trackerGroup
	 */
	invertGroups: function () {
		var series = this,
			chart = series.chart;
		
		// A fixed size is needed for inversion to work
		function setInvert() {			
			var size = {
				width: series.yAxis.len,
				height: series.xAxis.len
			};
			
			each(['group', 'trackerGroup', 'markerGroup'], function (groupName) {
				if (series[groupName]) {
					series[groupName].attr(size).invert();
				}
			});
		}

		addEvent(chart, 'resize', setInvert); // do it on resize
		addEvent(series, 'destroy', function () {
			removeEvent(chart, 'resize', setInvert);
		});

		// Do it now
		setInvert(); // do it now
		
		// On subsequent render and redraw, just do setInvert without setting up events again
		series.invertGroups = setInvert;
	},
	
	/**
	 * General abstraction for creating plot groups like series.group, series.trackerGroup, series.dataLabelsGroup and 
	 * series.markerGroup. On subsequent calls, the group will only be adjusted to the updated plot size.
	 */
	plotGroup: function (prop, name, visibility, zIndex, parent) {
		var group = this[prop],
			chart = this.chart,
			xAxis = this.xAxis,
			yAxis = this.yAxis;
		
		// Generate it on first call
		if (!group) {	
			this[prop] = group = chart.renderer.g(name)
				.attr({
					visibility: visibility,
					zIndex: zIndex || 0.1 // IE8 needs this
				})
				.add(parent);
		}
		// Place it on first and subsequent (redraw) calls
		group.translate(
			xAxis ? xAxis.left : chart.plotLeft, 
			yAxis ? yAxis.top : chart.plotTop
		);
		
		return group;
		
	},
	
	/**
	 * Render the graph and markers
	 */
	render: function () {
		var series = this,
			chart = series.chart,
			group,
			options = series.options,
			animation = options.animation,
			doAnimation = animation && !!series.animate,
			visibility = series.visible ? VISIBLE : HIDDEN,
			zIndex = options.zIndex,
			hasRendered = series.hasRendered,
			chartSeriesGroup = chart.seriesGroup;
		
		// the group
		group = series.plotGroup(
			'group', 
			'series', 
			visibility, 
			zIndex, 
			chartSeriesGroup
		);
		
		series.markerGroup = series.plotGroup(
			'markerGroup', 
			'markers', 
			visibility, 
			zIndex, 
			chartSeriesGroup
		);
		
		// initiate the animation
		if (doAnimation) {
			series.animate(true);
		}

		// cache attributes for shapes
		series.getAttribs();

		// SVGRenderer needs to know this before drawing elements (#1089)
		group.inverted = chart.inverted;
		
		// draw the graph if any
		if (series.drawGraph) {
			series.drawGraph();
		}

		// draw the points
		series.drawPoints();
		
		// draw the data labels
		series.drawDataLabels();


		// draw the mouse tracking area
		if (series.options.enableMouseTracking !== false) {
			series.drawTracker();
		}
		
		// Handle inverted series and tracker groups
		if (chart.inverted) {
			series.invertGroups();
		}
		
		// Initial clipping, must be defined after inverting groups for VML
		if (options.clip !== false && !series.sharedClipKey && !hasRendered) {
			group.clip(chart.clipRect);
			if (this.trackerGroup) {
				this.trackerGroup.clip(chart.clipRect);
			}
		}

		// Run the animation
		if (doAnimation) {
			series.animate();
		} else if (!hasRendered) {
			series.afterAnimate();
		}

		series.isDirty = series.isDirtyData = false; // means data is in accordance with what you see
		// (See #322) series.isDirty = series.isDirtyData = false; // means data is in accordance with what you see
		series.hasRendered = true;
	},
	
	/**
	 * Redraw the series after an update in the axes.
	 */
	redraw: function () {
		var series = this,
			chart = series.chart,
			wasDirtyData = series.isDirtyData, // cache it here as it is set to false in render, but used after
			group = series.group;

		// reposition on resize
		if (group) {
			if (chart.inverted) {
				group.attr({
					width: chart.plotWidth,
					height: chart.plotHeight
				});
			}

			group.animate({
				translateX: series.xAxis.left,
				translateY: series.yAxis.top
			});
		}

		series.translate();
		series.setTooltipPoints(true);

		series.render();
		if (wasDirtyData) {
			fireEvent(series, 'updatedData');
		}
	},

	/**
	 * Set the state of the graph
	 */
	setState: function (state) {
		var series = this,
			options = series.options,
			graph = series.graph,
			stateOptions = options.states,
			lineWidth = options.lineWidth;

		state = state || NORMAL_STATE;

		if (series.state !== state) {
			series.state = state;

			if (stateOptions[state] && stateOptions[state].enabled === false) {
				return;
			}

			if (state) {
				lineWidth = stateOptions[state].lineWidth || lineWidth + 1;
			}

			if (graph && !graph.dashstyle) { // hover is turned off for dashed lines in VML
				graph.attr({ // use attr because animate will cause any other animation on the graph to stop
					'stroke-width': lineWidth
				}, state ? 0 : 500);
			}
		}
	},

	/**
	 * Set the visibility of the graph
	 *
	 * @param vis {Boolean} True to show the series, false to hide. If UNDEFINED,
	 *        the visibility is toggled.
	 */
	setVisible: function (vis, redraw) {
		var series = this,
			chart = series.chart,
			legendItem = series.legendItem,
			seriesGroup = series.group,
			seriesTracker = series.tracker,
			dataLabelsGroup = series.dataLabelsGroup,
			markerGroup = series.markerGroup,
			showOrHide,
			i,
			points = series.points,
			point,
			ignoreHiddenSeries = chart.options.chart.ignoreHiddenSeries,
			oldVisibility = series.visible;

		// if called without an argument, toggle visibility
		series.visible = vis = vis === UNDEFINED ? !oldVisibility : vis;
		showOrHide = vis ? 'show' : 'hide';

		// show or hide series
		if (seriesGroup) { // pies don't have one
			seriesGroup[showOrHide]();
		}
		if (markerGroup) {
			markerGroup[showOrHide]();
		}

		// show or hide trackers
		if (seriesTracker) {
			seriesTracker[showOrHide]();
		} else if (points) {
			i = points.length;
			while (i--) {
				point = points[i];
				if (point.tracker) {
					point.tracker[showOrHide]();
				}
			}
		}


		if (dataLabelsGroup) {
			dataLabelsGroup[showOrHide]();
		}

		if (legendItem) {
			chart.legend.colorizeItem(series, vis);
		}


		// rescale or adapt to resized chart
		series.isDirty = true;
		// in a stack, all other series are affected
		if (series.options.stacking) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.options.stacking && otherSeries.visible) {
					otherSeries.isDirty = true;
				}
			});
		}

		if (ignoreHiddenSeries) {
			chart.isDirtyBox = true;
		}
		if (redraw !== false) {
			chart.redraw();
		}

		fireEvent(series, showOrHide);
	},

	/**
	 * Show the graph
	 */
	show: function () {
		this.setVisible(true);
	},

	/**
	 * Hide the graph
	 */
	hide: function () {
		this.setVisible(false);
	},


	/**
	 * Set the selected state of the graph
	 *
	 * @param selected {Boolean} True to select the series, false to unselect. If
	 *        UNDEFINED, the selection state is toggled.
	 */
	select: function (selected) {
		var series = this;
		// if called without an argument, toggle
		series.selected = selected = (selected === UNDEFINED) ? !series.selected : selected;

		if (series.checkbox) {
			series.checkbox.checked = selected;
		}

		fireEvent(series, selected ? 'select' : 'unselect');
	},

	/**
	 * Draw the tracker object that sits above all data labels and markers to
	 * track mouse events on the graph or points. For the line type charts
	 * the tracker uses the same graphPath, but with a greater stroke width
	 * for better control.
	 */
	drawTracker: function () {
		var series = this,
			options = series.options,
			trackByArea = options.trackByArea,
			trackerPath = [].concat(trackByArea ? series.areaPath : series.graphPath),
			trackerPathLength = trackerPath.length,
			chart = series.chart,
			renderer = chart.renderer,
			snap = chart.options.tooltip.snap,
			tracker = series.tracker,
			cursor = options.cursor,
			css = cursor && { cursor: cursor },
			singlePoints = series.singlePoints,
			trackerGroup = this.isCartesian && this.plotGroup('trackerGroup', null, VISIBLE, options.zIndex || 1, chart.trackerGroup),
			singlePoint,
			i;

		// Extend end points. A better way would be to use round linecaps,
		// but those are not clickable in VML.
		if (trackerPathLength && !trackByArea) {
			i = trackerPathLength + 1;
			while (i--) {
				if (trackerPath[i] === M) { // extend left side
					trackerPath.splice(i + 1, 0, trackerPath[i + 1] - snap, trackerPath[i + 2], L);
				}
				if ((i && trackerPath[i] === M) || i === trackerPathLength) { // extend right side
					trackerPath.splice(i, 0, L, trackerPath[i - 2] + snap, trackerPath[i - 1]);
				}
			}
		}

		// handle single points
		for (i = 0; i < singlePoints.length; i++) {
			singlePoint = singlePoints[i];
			trackerPath.push(M, singlePoint.plotX - snap, singlePoint.plotY,
				L, singlePoint.plotX + snap, singlePoint.plotY);
		}
		
		

		// draw the tracker
		if (tracker) {
			tracker.attr({ d: trackerPath });

		} else { // create
				
			series.tracker = renderer.path(trackerPath)
				.attr({
					isTracker: true,
					'stroke-linejoin': 'bevel',
					visibility: series.visible ? VISIBLE : HIDDEN,
					stroke: TRACKER_FILL,
					fill: trackByArea ? TRACKER_FILL : NONE,
					'stroke-width' : options.lineWidth + (trackByArea ? 0 : 2 * snap)
				})
				.on(hasTouch ? 'touchstart' : 'mouseover', function () {
					if (chart.hoverSeries !== series) {
						series.onMouseOver();
					}
				})
				.on('mouseout', function () {
					if (!options.stickyTracking) {
						series.onMouseOut();
					}
				})
				.css(css)
				.add(trackerGroup);
		}

	}

}; // end Series prototype


/**
 * LineSeries object
 */
var LineSeries = extendClass(Series);
seriesTypes.line = LineSeries;

/**
 * Set the default options for area
 */
defaultPlotOptions.area = merge(defaultSeriesOptions, {
	threshold: 0
	// trackByArea: false,
	// lineColor: null, // overrides color, but lets fillColor be unaltered
	// fillOpacity: 0.75,
	// fillColor: null
});

/**
 * AreaSeries object
 */
var AreaSeries = extendClass(Series, {
	type: 'area',
	
	/**
	 * Extend the base Series getSegmentPath method by adding the path for the area.
	 * This path is pushed to the series.areaPath property.
	 */
	getSegmentPath: function (segment) {
		
		var segmentPath = Series.prototype.getSegmentPath.call(this, segment), // call base method
			areaSegmentPath = [].concat(segmentPath), // work on a copy for the area path
			i,
			options = this.options,
			segLength = segmentPath.length;
		
		if (segLength === 3) { // for animation from 1 to two points
			areaSegmentPath.push(L, segmentPath[1], segmentPath[2]);
		}
		if (options.stacking && !this.closedStacks) {
			
			// Follow stack back. Todo: implement areaspline. A general solution could be to 
			// reverse the entire graphPath of the previous series, though may be hard with
			// splines and with series with different extremes
			for (i = segment.length - 1; i >= 0; i--) {
			
				// step line?
				if (i < segment.length - 1 && options.step) {
					areaSegmentPath.push(segment[i + 1].plotX, segment[i].yBottom);
				}
				
				areaSegmentPath.push(segment[i].plotX, segment[i].yBottom);
			}

		} else { // follow zero line back
			this.closeSegment(areaSegmentPath, segment);
		}
		this.areaPath = this.areaPath.concat(areaSegmentPath);
		
		return segmentPath;
	},
	
	/**
	 * Extendable method to close the segment path of an area. This is overridden in polar 
	 * charts.
	 */
	closeSegment: function (path, segment) {
		var translatedThreshold = this.yAxis.getThreshold(this.options.threshold);
		path.push(
			L,
			segment[segment.length - 1].plotX,
			translatedThreshold,
			L,
			segment[0].plotX,
			translatedThreshold
		);
	},
	
	/**
	 * Draw the graph and the underlying area. This method calls the Series base
	 * function and adds the area. The areaPath is calculated in the getSegmentPath
	 * method called from Series.prototype.drawGraph.
	 */
	drawGraph: function () {
		
		// Define or reset areaPath
		this.areaPath = [];
		
		// Call the base method
		Series.prototype.drawGraph.apply(this);
		
		// Define local variables
		var areaPath = this.areaPath,
			options = this.options,
			area = this.area;
		
		// Create or update the area
		if (area) { // update
			area.animate({ d: areaPath });

		} else { // create
			this.area = this.chart.renderer.path(areaPath)
				.attr({
					fill: pick(
						options.fillColor,
						Color(this.color).setOpacity(options.fillOpacity || 0.75).get()
					),
					zIndex: 0 // #1069
				}).add(this.group);
		}
	},
	
	/**
	 * Get the series' symbol in the legend
	 * 
	 * @param {Object} legend The legend object
	 * @param {Object} item The series (this) or point
	 */
	drawLegendSymbol: function (legend, item) {
		
		item.legendSymbol = this.chart.renderer.rect(
			0,
			legend.baseline - 11,
			legend.options.symbolWidth,
			12,
			2
		).attr({
			zIndex: 3
		}).add(item.legendGroup);		
		
	}
});

seriesTypes.area = AreaSeries;/**
 * Set the default options for spline
 */
defaultPlotOptions.spline = merge(defaultSeriesOptions);

/**
 * SplineSeries object
 */
var SplineSeries = extendClass(Series, {
	type: 'spline',

	/**
	 * Get the spline segment from a given point's previous neighbour to the given point
	 */
	getPointSpline: function (segment, point, i) {
		var smoothing = 1.5, // 1 means control points midway between points, 2 means 1/3 from the point, 3 is 1/4 etc
			denom = smoothing + 1,
			plotX = point.plotX,
			plotY = point.plotY,
			lastPoint = segment[i - 1],
			nextPoint = segment[i + 1],
			leftContX,
			leftContY,
			rightContX,
			rightContY,
			ret;

		// find control points
		if (lastPoint && nextPoint) {
		
			var lastX = lastPoint.plotX,
				lastY = lastPoint.plotY,
				nextX = nextPoint.plotX,
				nextY = nextPoint.plotY,
				correction;

			leftContX = (smoothing * plotX + lastX) / denom;
			leftContY = (smoothing * plotY + lastY) / denom;
			rightContX = (smoothing * plotX + nextX) / denom;
			rightContY = (smoothing * plotY + nextY) / denom;

			// have the two control points make a straight line through main point
			correction = ((rightContY - leftContY) * (rightContX - plotX)) /
				(rightContX - leftContX) + plotY - rightContY;

			leftContY += correction;
			rightContY += correction;

			// to prevent false extremes, check that control points are between
			// neighbouring points' y values
			if (leftContY > lastY && leftContY > plotY) {
				leftContY = mathMax(lastY, plotY);
				rightContY = 2 * plotY - leftContY; // mirror of left control point
			} else if (leftContY < lastY && leftContY < plotY) {
				leftContY = mathMin(lastY, plotY);
				rightContY = 2 * plotY - leftContY;
			}
			if (rightContY > nextY && rightContY > plotY) {
				rightContY = mathMax(nextY, plotY);
				leftContY = 2 * plotY - rightContY;
			} else if (rightContY < nextY && rightContY < plotY) {
				rightContY = mathMin(nextY, plotY);
				leftContY = 2 * plotY - rightContY;
			}

			// record for drawing in next point
			point.rightContX = rightContX;
			point.rightContY = rightContY;

		}
		
		// Visualize control points for debugging
		/*
		if (leftContX) {
			this.chart.renderer.circle(leftContX + this.chart.plotLeft, leftContY + this.chart.plotTop, 2)
				.attr({
					stroke: 'red',
					'stroke-width': 1,
					fill: 'none'
				})
				.add();
			this.chart.renderer.path(['M', leftContX + this.chart.plotLeft, leftContY + this.chart.plotTop,
				'L', plotX + this.chart.plotLeft, plotY + this.chart.plotTop])
				.attr({
					stroke: 'red',
					'stroke-width': 1
				})
				.add();
			this.chart.renderer.circle(rightContX + this.chart.plotLeft, rightContY + this.chart.plotTop, 2)
				.attr({
					stroke: 'green',
					'stroke-width': 1,
					fill: 'none'
				})
				.add();
			this.chart.renderer.path(['M', rightContX + this.chart.plotLeft, rightContY + this.chart.plotTop,
				'L', plotX + this.chart.plotLeft, plotY + this.chart.plotTop])
				.attr({
					stroke: 'green',
					'stroke-width': 1
				})
				.add();
		}
		// */

		// moveTo or lineTo
		if (!i) {
			ret = [M, plotX, plotY];
		} else { // curve from last point to this
			ret = [
				'C',
				lastPoint.rightContX || lastPoint.plotX,
				lastPoint.rightContY || lastPoint.plotY,
				leftContX || plotX,
				leftContY || plotY,
				plotX,
				plotY
			];
			lastPoint.rightContX = lastPoint.rightContY = null; // reset for updating series later
		}
		return ret;
	}
});
seriesTypes.spline = SplineSeries;

/**
 * Set the default options for areaspline
 */
defaultPlotOptions.areaspline = merge(defaultPlotOptions.area);

/**
 * AreaSplineSeries object
 */
var areaProto = AreaSeries.prototype,
	AreaSplineSeries = extendClass(SplineSeries, {
		type: 'areaspline',
		closedStacks: true, // instead of following the previous graph back, follow the threshold back
		
		// Mix in methods from the area series
		getSegmentPath: areaProto.getSegmentPath,
		closeSegment: areaProto.closeSegment,
		drawGraph: areaProto.drawGraph
	});
seriesTypes.areaspline = AreaSplineSeries;

/**
 * Set the default options for column
 */
defaultPlotOptions.column = merge(defaultSeriesOptions, {
	borderColor: '#FFFFFF',
	borderWidth: 1,
	borderRadius: 0,
	//colorByPoint: undefined,
	groupPadding: 0.2,
	//grouping: true,
	marker: null, // point options are specified in the base options
	pointPadding: 0.1,
	//pointWidth: null,
	minPointLength: 0,
	cropThreshold: 50, // when there are more points, they will not animate out of the chart on xAxis.setExtremes
	pointRange: null, // null means auto, meaning 1 in a categorized axis and least distance between points if not categories
	states: {
		hover: {
			brightness: 0.1,
			shadow: false
		},
		select: {
			color: '#C0C0C0',
			borderColor: '#000000',
			shadow: false
		}
	},
	dataLabels: {
		align: null, // auto
		verticalAlign: null, // auto
		y: null
	},
	threshold: 0
});

/**
 * ColumnSeries object
 */
var ColumnSeries = extendClass(Series, {
	type: 'column',
	tooltipOutsidePlot: true,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color',
		r: 'borderRadius'
	},
	
	/**
	 * Initialize the series
	 */
	init: function () {
		Series.prototype.init.apply(this, arguments);

		var series = this,
			chart = series.chart;

		// if the series is added dynamically, force redraw of other
		// series affected by a new column
		if (chart.hasRendered) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.type === series.type) {
					otherSeries.isDirty = true;
				}
			});
		}
	},

	/**
	 * Translate each point to the plot area coordinate system and find shape positions
	 */
	translate: function () {
		var series = this,
			chart = series.chart,
			options = series.options,
			stacking = options.stacking,
			borderWidth = options.borderWidth,
			columnCount = 0,
			xAxis = series.xAxis,
			reversedXAxis = xAxis.reversed,
			stackGroups = {},
			stackKey,
			columnIndex;

		Series.prototype.translate.apply(series);

		// Get the total number of column type series.
		// This is called on every series. Consider moving this logic to a
		// chart.orderStacks() function and call it on init, addSeries and removeSeries
		if (options.grouping === false) {
			columnCount = 1;
		
		} else {
			each(chart.series, function (otherSeries) {
				var otherOptions = otherSeries.options;
				if (otherSeries.type === series.type && otherSeries.visible &&
						series.options.group === otherOptions.group) { // used in Stock charts navigator series
					if (otherOptions.stacking) {
						stackKey = otherSeries.stackKey;
						if (stackGroups[stackKey] === UNDEFINED) {
							stackGroups[stackKey] = columnCount++;
						}
						columnIndex = stackGroups[stackKey];
					} else if (otherOptions.grouping !== false) { // #1162
						columnIndex = columnCount++;
					}
					otherSeries.columnIndex = columnIndex;
				}
			});
		}

		// calculate the width and position of each column based on
		// the number of column series in the plot, the groupPadding
		// and the pointPadding options
		var points = series.points,
			categoryWidth = mathAbs(xAxis.transA) * (xAxis.ordinalSlope || options.pointRange || xAxis.closestPointRange || 1),
			groupPadding = categoryWidth * options.groupPadding,
			groupWidth = categoryWidth - 2 * groupPadding,
			pointOffsetWidth = groupWidth / columnCount,
			optionPointWidth = options.pointWidth,
			pointPadding = defined(optionPointWidth) ? (pointOffsetWidth - optionPointWidth) / 2 :
				pointOffsetWidth * options.pointPadding,
			pointWidth = pick(optionPointWidth, pointOffsetWidth - 2 * pointPadding), // exact point width, used in polar charts
			barW = mathCeil(mathMax(pointWidth, 1 + 2 * borderWidth)), // rounded and postprocessed for border width
			colIndex = (reversedXAxis ? columnCount -
				series.columnIndex : series.columnIndex) || 0,
			pointXOffset = pointPadding + (groupPadding + colIndex *
				pointOffsetWidth - (categoryWidth / 2)) *
				(reversedXAxis ? -1 : 1),
			threshold = options.threshold,
			translatedThreshold = series.translatedThreshold = series.yAxis.getThreshold(threshold),
			minPointLength = pick(options.minPointLength, 5);

		// record the new values
		each(points, function (point) {
			var plotY = point.plotY,
				yBottom = pick(point.yBottom, translatedThreshold),
				barX = point.plotX + pointXOffset,
				barY = mathCeil(mathMin(plotY, yBottom)),
				barH = mathCeil(mathMax(plotY, yBottom) - barY),
				stack = series.yAxis.stacks[(point.y < 0 ? '-' : '') + series.stackKey],
				shapeArgs;

			// Record the offset'ed position and width of the bar to be able to align the stacking total correctly
			if (stacking && series.visible && stack && stack[point.x]) {
				stack[point.x].setOffset(pointXOffset, barW);
			}

			// handle options.minPointLength
			if (mathAbs(barH) < minPointLength) {
				if (minPointLength) {
					barH = minPointLength;
					barY =
						mathAbs(barY - translatedThreshold) > minPointLength ? // stacked
							yBottom - minPointLength : // keep position
							translatedThreshold - (plotY <= translatedThreshold ? minPointLength : 0);
				}
			}

			point.barX = barX;
			point.pointWidth = pointWidth;

			// create shape type and shape args that are reused in drawPoints and drawTracker
			point.shapeType = 'rect';
			point.shapeArgs = shapeArgs = chart.renderer.Element.prototype.crisp.call(0, borderWidth, barX, barY, barW, barH); 
			
			if (borderWidth % 2) { // correct for shorting in crisp method, visible in stacked columns with 1px border
				shapeArgs.y -= 1;
				shapeArgs.height += 1;
			}

			// make small columns responsive to mouse
			point.trackerArgs = mathAbs(barH) < 3 && merge(point.shapeArgs, {
				height: 6,
				y: barY - 3
			});
		});

	},

	getSymbol: noop,
	
	/**
	 * Use a solid rectangle like the area series types
	 */
	drawLegendSymbol: AreaSeries.prototype.drawLegendSymbol,
	
	
	/**
	 * Columns have no graph
	 */
	drawGraph: noop,

	/**
	 * Draw the columns. For bars, the series.group is rotated, so the same coordinates
	 * apply for columns and bars. This method is inherited by scatter series.
	 *
	 */
	drawPoints: function () {
		var series = this,
			options = series.options,
			renderer = series.chart.renderer,
			shapeArgs;


		// draw the columns
		each(series.points, function (point) {
			var plotY = point.plotY,
				graphic = point.graphic;
			if (plotY !== UNDEFINED && !isNaN(plotY) && point.y !== null) {
				shapeArgs = point.shapeArgs;
				if (graphic) { // update
					stop(graphic);
					graphic.animate(merge(shapeArgs));

				} else {
					point.graphic = graphic = renderer[point.shapeType](shapeArgs)
						.attr(point.pointAttr[point.selected ? SELECT_STATE : NORMAL_STATE])
						.add(series.group)
						.shadow(options.shadow, null, options.stacking && !options.borderRadius);
				}

			} else if (graphic) {
				point.graphic = graphic.destroy(); // #1269
			}
		});
	},
	/**
	 * Draw the individual tracker elements.
	 * This method is inherited by scatter and pie charts too.
	 */
	drawTracker: function () {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			shapeArgs,
			tracker,
			trackerLabel = +new Date(),
			options = series.options,
			cursor = options.cursor,
			css = cursor && { cursor: cursor },
			trackerGroup = series.isCartesian && series.plotGroup('trackerGroup', null, VISIBLE, options.zIndex || 1, chart.trackerGroup),
			rel,
			plotY,
			validPlotY;
			
		each(series.points, function (point) {
			tracker = point.tracker;
			shapeArgs = point.trackerArgs || point.shapeArgs;
			plotY = point.plotY;
			validPlotY = !series.isCartesian || (plotY !== UNDEFINED && !isNaN(plotY));
			delete shapeArgs.strokeWidth;
			if (point.y !== null && validPlotY) {
				if (tracker) {// update
					tracker.attr(shapeArgs);

				} else {
					point.tracker =
						renderer[point.shapeType](shapeArgs)
						.attr({
							isTracker: trackerLabel,
							fill: TRACKER_FILL,
							visibility: series.visible ? VISIBLE : HIDDEN
						})
						.on(hasTouch ? 'touchstart' : 'mouseover', function (event) {
							rel = event.relatedTarget || event.fromElement;
							if (chart.hoverSeries !== series && attr(rel, 'isTracker') !== trackerLabel) {
								series.onMouseOver();
							}
							point.onMouseOver();

						})
						.on('mouseout', function (event) {
							if (!options.stickyTracking) {
								rel = event.relatedTarget || event.toElement;
								if (attr(rel, 'isTracker') !== trackerLabel) {
									series.onMouseOut();
								}
							}
						})
						.css(css)
						.add(point.group || trackerGroup); // pies have point group - see issue #118
				}
			}
		});
	},
	
	/** 
	 * Override the basic data label alignment by adjusting for the position of the column
	 */
	alignDataLabel: function (point, dataLabel, options,  alignTo, isNew) {
		var chart = this.chart,
			inverted = chart.inverted,
			below = point.below || (point.plotY > (this.translatedThreshold || chart.plotSizeY)),
			inside = (this.options.stacking || options.inside); // draw it inside the box?
		
		// Align to the column itself, or the top of it
		if (point.shapeArgs) { // Area range uses this method but not alignTo
			alignTo = merge(point.shapeArgs);
			if (inverted) {
				alignTo = {
					x: chart.plotWidth - alignTo.y - alignTo.height,
					y: chart.plotHeight - alignTo.x - alignTo.width,
					width: alignTo.height,
					height: alignTo.width
				};
			}
				
			// Compute the alignment box
			if (!inside) {
				if (inverted) {
					alignTo.x += below ? 0 : alignTo.width;
					alignTo.width = 0;
				} else {
					alignTo.y += below ? alignTo.height : 0;
					alignTo.height = 0;
				}
			}
		}
		
		// When alignment is undefined (typically columns and bars), display the individual 
		// point below or above the point depending on the threshold
		options.align = pick(
			options.align, 
			!inverted || inside ? 'center' : below ? 'right' : 'left'
		);
		options.verticalAlign = pick(
			options.verticalAlign, 
			inverted || inside ? 'middle' : below ? 'top' : 'bottom'
		);
		
		// Call the parent method
		Series.prototype.alignDataLabel.call(this, point, dataLabel, options, alignTo, isNew);
	},


	/**
	 * Animate the column heights one by one from zero
	 * @param {Boolean} init Whether to initialize the animation or run it
	 */
	animate: function (init) {
		var series = this,
			points = series.points,
			options = series.options;

		if (!init) { // run the animation
			/*
			 * Note: Ideally the animation should be initialized by calling
			 * series.group.hide(), and then calling series.group.show()
			 * after the animation was started. But this rendered the shadows
			 * invisible in IE8 standards mode. If the columns flicker on large
			 * datasets, this is the cause.
			 */

			each(points, function (point) {
				var graphic = point.graphic,
					shapeArgs = point.shapeArgs,
					yAxis = series.yAxis,
					threshold = options.threshold;

				if (graphic) {
					// start values
					graphic.attr({
						height: 0,
						y: defined(threshold) ? 
							yAxis.getThreshold(threshold) :
							yAxis.translate(yAxis.getExtremes().min, 0, 1, 0, 1)
					});

					// animate
					graphic.animate({
						height: shapeArgs.height,
						y: shapeArgs.y
					}, options.animation);
				}
			});


			// delete this function to allow it only once
			series.animate = null;
		}

	},
	/**
	 * Remove this series from the chart
	 */
	remove: function () {
		var series = this,
			chart = series.chart;

		// column and bar series affects other series of the same type
		// as they are either stacked or grouped
		if (chart.hasRendered) {
			each(chart.series, function (otherSeries) {
				if (otherSeries.type === series.type) {
					otherSeries.isDirty = true;
				}
			});
		}

		Series.prototype.remove.apply(series, arguments);
	}
});
seriesTypes.column = ColumnSeries;
/**
 * Set the default options for bar
 */
defaultPlotOptions.bar = merge(defaultPlotOptions.column);
/**
 * The Bar series class
 */
var BarSeries = extendClass(ColumnSeries, {
	type: 'bar',
	inverted: true
});
seriesTypes.bar = BarSeries;

/**
 * Set the default options for scatter
 */
defaultPlotOptions.scatter = merge(defaultSeriesOptions, {
	lineWidth: 0,
	states: {
		hover: {
			lineWidth: 0
		}
	},
	tooltip: {
		headerFormat: '<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>',
		pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
	}
});

/**
 * The scatter series class
 */
var ScatterSeries = extendClass(Series, {
	type: 'scatter',
	sorted: false,
	/**
	 * Extend the base Series' translate method by adding shape type and
	 * arguments for the point trackers
	 */
	translate: function () {
		var series = this;

		Series.prototype.translate.apply(series);

		each(series.points, function (point) {
			point.shapeType = 'circle';
			point.shapeArgs = {
				x: point.plotX,
				y: point.plotY,
				r: series.chart.options.tooltip.snap
			};
		});
	},

	/**
	 * Add tracking event listener to the series group, so the point graphics
	 * themselves act as trackers
	 */
	drawTracker: function () {
		var series = this,
			cursor = series.options.cursor,
			css = cursor && { cursor: cursor },
			points = series.points,
			i = points.length,
			graphic;

		// Set an expando property for the point index, used below
		while (i--) {
			graphic = points[i].graphic;
			if (graphic) { // doesn't exist for null points
				graphic.element._i = i; 
			}
		}
		
		// Add the event listeners, we need to do this only once
		if (!series._hasTracking) {
			series.markerGroup
				.attr({
					isTracker: true
				})
				.on(hasTouch ? 'touchstart' : 'mouseover', function (e) {
					series.onMouseOver();
					if (e.target._i !== UNDEFINED) { // undefined on graph in scatterchart
						points[e.target._i].onMouseOver();
					}
				})
				.on('mouseout', function () {
					if (!series.options.stickyTracking) {
						series.onMouseOut();
					}
				})
				.css(css);
		} else {
			series._hasTracking = true;
		}
	}
});
seriesTypes.scatter = ScatterSeries;

/**
 * Set the default options for pie
 */
defaultPlotOptions.pie = merge(defaultSeriesOptions, {
	borderColor: '#FFFFFF',
	borderWidth: 1,
	center: ['50%', '50%'],
	colorByPoint: true, // always true for pies
	dataLabels: {
		// align: null,
		// connectorWidth: 1,
		// connectorColor: point.color,
		// connectorPadding: 5,
		distance: 30,
		enabled: true,
		formatter: function () {
			return this.point.name;
		}
		// softConnector: true,
		//y: 0
	},
	//innerSize: 0,
	legendType: 'point',
	marker: null, // point options are specified in the base options
	size: '75%',
	showInLegend: false,
	slicedOffset: 10,
	states: {
		hover: {
			brightness: 0.1,
			shadow: false
		}
	}
});

/**
 * Extended point object for pies
 */
var PiePoint = extendClass(Point, {
	/**
	 * Initiate the pie slice
	 */
	init: function () {

		Point.prototype.init.apply(this, arguments);

		var point = this,
			toggleSlice;

		//visible: options.visible !== false,
		extend(point, {
			visible: point.visible !== false,
			name: pick(point.name, 'Slice')
		});

		// add event listener for select
		toggleSlice = function () {
			point.slice();
		};
		addEvent(point, 'select', toggleSlice);
		addEvent(point, 'unselect', toggleSlice);

		return point;
	},

	/**
	 * Toggle the visibility of the pie slice
	 * @param {Boolean} vis Whether to show the slice or not. If undefined, the
	 *    visibility is toggled
	 */
	setVisible: function (vis) {
		var point = this,
			series = point.series,
			chart = series.chart,
			tracker = point.tracker,
			dataLabel = point.dataLabel,
			connector = point.connector,
			shadowGroup = point.shadowGroup,
			method;

		// if called without an argument, toggle visibility
		point.visible = vis = vis === UNDEFINED ? !point.visible : vis;

		method = vis ? 'show' : 'hide';

		point.group[method]();
		if (tracker) {
			tracker[method]();
		}
		if (dataLabel) {
			dataLabel[method]();
		}
		if (connector) {
			connector[method]();
		}
		if (shadowGroup) {
			shadowGroup[method]();
		}
		if (point.legendItem) {
			chart.legend.colorizeItem(point, vis);
		}
		
		// Handle ignore hidden slices
		if (!series.isDirty && series.options.ignoreHiddenPoint) {
			series.isDirty = true;
			chart.redraw();
		}
	},

	/**
	 * Set or toggle whether the slice is cut out from the pie
	 * @param {Boolean} sliced When undefined, the slice state is toggled
	 * @param {Boolean} redraw Whether to redraw the chart. True by default.
	 */
	slice: function (sliced, redraw, animation) {
		var point = this,
			series = point.series,
			chart = series.chart,
			slicedTranslation = point.slicedTranslation,
			translation;

		setAnimation(animation, chart);

		// redraw is true by default
		redraw = pick(redraw, true);

		// if called without an argument, toggle
		sliced = point.sliced = defined(sliced) ? sliced : !point.sliced;

		translation = {
			translateX: (sliced ? slicedTranslation[0] : chart.plotLeft),
			translateY: (sliced ? slicedTranslation[1] : chart.plotTop)
		};
		point.group.animate(translation);
		if (point.shadowGroup) {
			point.shadowGroup.animate(translation);
		}

	}
});

/**
 * The Pie series class
 */
var PieSeries = {
	type: 'pie',
	isCartesian: false,
	pointClass: PiePoint,
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'borderColor',
		'stroke-width': 'borderWidth',
		fill: 'color'
	},

	/**
	 * Pies have one color each point
	 */
	getColor: function () {
		// record first color for use in setData
		this.initialColor = this.chart.counters.color;
	},

	/**
	 * Animate the pies in
	 */
	animate: function () {
		var series = this,
			points = series.points;

		each(points, function (point) {
			var graphic = point.graphic,
				args = point.shapeArgs,
				up = -mathPI / 2;

			if (graphic) {
				// start values
				graphic.attr({
					r: 0,
					start: up,
					end: up
				});

				// animate
				graphic.animate({
					r: args.r,
					start: args.start,
					end: args.end
				}, series.options.animation);
			}
		});

		// delete this function to allow it only once
		series.animate = null;

	},

	/**
	 * Extend the basic setData method by running processData and generatePoints immediately,
	 * in order to access the points from the legend.
	 */
	setData: function (data, redraw) {
		Series.prototype.setData.call(this, data, false);
		this.processData();
		this.generatePoints();
		if (pick(redraw, true)) {
			this.chart.redraw();
		} 
	},
	
	/**
	 * Get the center of the pie based on the size and center options relative to the  
	 * plot area. Borrowed by the polar and gauge series types.
	 */
	getCenter: function () {
		
		var options = this.options,
			chart = this.chart,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			positions = options.center.concat([options.size, options.innerSize || 0]),
			smallestSize = mathMin(plotWidth, plotHeight),
			isPercent;			
		
		return map(positions, function (length, i) {

			isPercent = /%$/.test(length);
			return isPercent ?
				// i == 0: centerX, relative to width
				// i == 1: centerY, relative to height
				// i == 2: size, relative to smallestSize
				// i == 4: innerSize, relative to smallestSize
				[plotWidth, plotHeight, smallestSize, smallestSize][i] *
					pInt(length) / 100 :
				length;
		});
	},
	
	/**
	 * Do translation for pie slices
	 */
	translate: function () {
		this.generatePoints();
		
		var total = 0,
			series = this,
			cumulative = -0.25, // start at top
			precision = 1000, // issue #172
			options = series.options,
			slicedOffset = options.slicedOffset,
			connectorOffset = slicedOffset + options.borderWidth,
			positions,
			chart = series.chart,
			start,
			end,
			angle,
			points = series.points,
			circ = 2 * mathPI,
			fraction,
			radiusX, // the x component of the radius vector for a given point
			radiusY,
			labelDistance = options.dataLabels.distance,
			ignoreHiddenPoint = options.ignoreHiddenPoint,
			i,
			len = points.length,
			point;

		// get positions - either an integer or a percentage string must be given
		series.center = positions = series.getCenter();

		// utility for getting the x value from a given y, used for anticollision logic in data labels
		series.getX = function (y, left) {

			angle = math.asin((y - positions[1]) / (positions[2] / 2 + labelDistance));

			return positions[0] +
				(left ? -1 : 1) *
				(mathCos(angle) * (positions[2] / 2 + labelDistance));
		};

		// get the total sum
		for (i = 0; i < len; i++) {
			point = points[i];
			total += (ignoreHiddenPoint && !point.visible) ? 0 : point.y;
		}

		// Calculate the geometry for each point
		for (i = 0; i < len; i++) {
			
			point = points[i];
			
			// set start and end angle
			fraction = total ? point.y / total : 0;
			start = mathRound(cumulative * circ * precision) / precision;
			if (!ignoreHiddenPoint || point.visible) {
				cumulative += fraction;
			}
			end = mathRound(cumulative * circ * precision) / precision;

			// set the shape
			point.shapeType = 'arc';
			point.shapeArgs = {
				x: positions[0],
				y: positions[1],
				r: positions[2] / 2,
				innerR: positions[3] / 2,
				start: start,
				end: end
			};

			// center for the sliced out slice
			angle = (end + start) / 2;
			point.slicedTranslation = map([
				mathCos(angle) * slicedOffset + chart.plotLeft,
				mathSin(angle) * slicedOffset + chart.plotTop
			], mathRound);

			// set the anchor point for tooltips
			radiusX = mathCos(angle) * positions[2] / 2;
			radiusY = mathSin(angle) * positions[2] / 2;
			point.tooltipPos = [
				positions[0] + radiusX * 0.7,
				positions[1] + radiusY * 0.7
			];

			// set the anchor point for data labels
			point.labelPos = [
				positions[0] + radiusX + mathCos(angle) * labelDistance, // first break of connector
				positions[1] + radiusY + mathSin(angle) * labelDistance, // a/a
				positions[0] + radiusX + mathCos(angle) * connectorOffset, // second break, right outside pie
				positions[1] + radiusY + mathSin(angle) * connectorOffset, // a/a
				positions[0] + radiusX, // landing point for connector
				positions[1] + radiusY, // a/a
				labelDistance < 0 ? // alignment
					'center' :
					angle < circ / 4 ? 'left' : 'right', // alignment
				angle // center angle
			];
			
			// API properties
			point.percentage = fraction * 100;
			point.total = total;

		}


		this.setTooltipPoints();
	},

	/**
	 * Render the slices
	 */
	render: function () {
		var series = this;

		// cache attributes for shapes
		series.getAttribs();

		this.drawPoints();

		// draw the mouse tracking area
		if (series.options.enableMouseTracking !== false) {
			series.drawTracker();
		}

		this.drawDataLabels();

		if (series.options.animation && series.animate) {
			series.animate();
		}

		// (See #322) series.isDirty = series.isDirtyData = false; // means data is in accordance with what you see
		series.isDirty = false; // means data is in accordance with what you see
	},

	/**
	 * Draw the data points
	 */
	drawPoints: function () {
		var series = this,
			chart = series.chart,
			renderer = chart.renderer,
			groupTranslation,
			//center,
			graphic,
			group,
			shadow = series.options.shadow,
			shadowGroup,
			shapeArgs;

		// draw the slices
		each(series.points, function (point) {
			graphic = point.graphic;
			shapeArgs = point.shapeArgs;
			group = point.group;
			shadowGroup = point.shadowGroup;

			// put the shadow behind all points
			if (shadow && !shadowGroup) {
				shadowGroup = point.shadowGroup = renderer.g('shadow')
					.attr({ zIndex: 4 })
					.add();
			}

			// create the group the first time
			if (!group) {
				group = point.group = renderer.g('point')
					.attr({ zIndex: 5 })
					.add();
			}

			// if the point is sliced, use special translation, else use plot area traslation
			groupTranslation = point.sliced ? point.slicedTranslation : [chart.plotLeft, chart.plotTop];
			group.translate(groupTranslation[0], groupTranslation[1]);
			if (shadowGroup) {
				shadowGroup.translate(groupTranslation[0], groupTranslation[1]);
			}

			// draw the slice
			if (graphic) {
				graphic.animate(shapeArgs);
			} else {
				point.graphic = graphic = renderer.arc(shapeArgs)
					.setRadialReference(series.center)
					.attr(extend(
						point.pointAttr[NORMAL_STATE],
						{ 'stroke-linejoin': 'round' }
					))
					.add(point.group)
					.shadow(shadow, shadowGroup);
				
			}

			// detect point specific visibility
			if (point.visible === false) {
				point.setVisible(false);
			}

		});

	},

	/**
	 * Override the base drawDataLabels method by pie specific functionality
	 */
	drawDataLabels: function () {
		var series = this,
			data = series.data,
			point,
			chart = series.chart,
			options = series.options.dataLabels,
			connectorPadding = pick(options.connectorPadding, 10),
			connectorWidth = pick(options.connectorWidth, 1),
			connector,
			connectorPath,
			softConnector = pick(options.softConnector, true),
			distanceOption = options.distance,
			seriesCenter = series.center,
			radius = seriesCenter[2] / 2,
			centerY = seriesCenter[1],
			outside = distanceOption > 0,
			dataLabel,
			labelPos,
			labelHeight,
			halves = [// divide the points into right and left halves for anti collision
				[], // right
				[]  // left
			],
			x,
			y,
			visibility,
			rankArr,
			sort,
			i = 2,
			j;

		// get out if not enabled
		if (!options.enabled && !series._hasPointLabels) {
			return;
		}

		// run parent method
		Series.prototype.drawDataLabels.apply(series);

		// arrange points for detection collision
		each(data, function (point) {
			if (point.dataLabel) { // it may have been cancelled in the base method (#407)
				halves[
					point.labelPos[7] < mathPI / 2 ? 0 : 1
				].push(point);
			}
		});
		halves[1].reverse();

		// define the sorting algorithm
		sort = function (a, b) {
			return b.y - a.y;
		};

		// assume equal label heights
		labelHeight = halves[0][0] && halves[0][0].dataLabel && (halves[0][0].dataLabel.getBBox().height || 21); // 21 is for #968

		/* Loop over the points in each half, starting from the top and bottom
		 * of the pie to detect overlapping labels.
		 */
		while (i--) {

			var slots = [],
				slotsLength,
				usedSlots = [],
				points = halves[i],
				pos,
				length = points.length,
				slotIndex;

			// Only do anti-collision when we are outside the pie and have connectors (#856)
			if (distanceOption > 0) {
				
				// build the slots
				for (pos = centerY - radius - distanceOption; pos <= centerY + radius + distanceOption; pos += labelHeight) {
					slots.push(pos);
					// visualize the slot
					/*
					var slotX = series.getX(pos, i) + chart.plotLeft - (i ? 100 : 0),
						slotY = pos + chart.plotTop;
					if (!isNaN(slotX)) {
						chart.renderer.rect(slotX, slotY - 7, 100, labelHeight)
							.attr({
								'stroke-width': 1,
								stroke: 'silver'
							})
							.add();
						chart.renderer.text('Slot '+ (slots.length - 1), slotX, slotY + 4)
							.attr({
								fill: 'silver'
							}).add();
					}
					// */
				}
				slotsLength = slots.length;
	
				// if there are more values than available slots, remove lowest values
				if (length > slotsLength) {
					// create an array for sorting and ranking the points within each quarter
					rankArr = [].concat(points);
					rankArr.sort(sort);
					j = length;
					while (j--) {
						rankArr[j].rank = j;
					}
					j = length;
					while (j--) {
						if (points[j].rank >= slotsLength) {
							points.splice(j, 1);
						}
					}
					length = points.length;
				}
	
				// The label goes to the nearest open slot, but not closer to the edge than
				// the label's index.
				for (j = 0; j < length; j++) {
	
					point = points[j];
					labelPos = point.labelPos;
	
					var closest = 9999,
						distance,
						slotI;
	
					// find the closest slot index
					for (slotI = 0; slotI < slotsLength; slotI++) {
						distance = mathAbs(slots[slotI] - labelPos[1]);
						if (distance < closest) {
							closest = distance;
							slotIndex = slotI;
						}
					}
	
					// if that slot index is closer to the edges of the slots, move it
					// to the closest appropriate slot
					if (slotIndex < j && slots[j] !== null) { // cluster at the top
						slotIndex = j;
					} else if (slotsLength  < length - j + slotIndex && slots[j] !== null) { // cluster at the bottom
						slotIndex = slotsLength - length + j;
						while (slots[slotIndex] === null) { // make sure it is not taken
							slotIndex++;
						}
					} else {
						// Slot is taken, find next free slot below. In the next run, the next slice will find the
						// slot above these, because it is the closest one
						while (slots[slotIndex] === null) { // make sure it is not taken
							slotIndex++;
						}
					}
	
					usedSlots.push({ i: slotIndex, y: slots[slotIndex] });
					slots[slotIndex] = null; // mark as taken
				}
				// sort them in order to fill in from the top
				usedSlots.sort(sort);
			}

			// now the used slots are sorted, fill them up sequentially
			for (j = 0; j < length; j++) {
				
				var slot, naturalY;

				point = points[j];
				labelPos = point.labelPos;
				dataLabel = point.dataLabel;
				visibility = point.visible === false ? HIDDEN : VISIBLE;
				naturalY = labelPos[1];
				
				if (distanceOption > 0) {
					slot = usedSlots.pop();
					slotIndex = slot.i;

					// if the slot next to currrent slot is free, the y value is allowed
					// to fall back to the natural position
					y = slot.y;
					if ((naturalY > y && slots[slotIndex + 1] !== null) ||
							(naturalY < y &&  slots[slotIndex - 1] !== null)) {
						y = naturalY;
					}
					
				} else {
					y = naturalY;
				}

				// get the x - use the natural x position for first and last slot, to prevent the top
				// and botton slice connectors from touching each other on either side
				x = options.justify ? 
					seriesCenter[0] + (i ? -1 : 1) * (radius + distanceOption) :
					series.getX(slotIndex === 0 || slotIndex === slots.length - 1 ? naturalY : y, i);
				
				// move or place the data label
				dataLabel
					.attr({
						visibility: visibility,
						align: labelPos[6]
					})[dataLabel.moved ? 'animate' : 'attr']({
						x: x + options.x +
							({ left: connectorPadding, right: -connectorPadding }[labelPos[6]] || 0),
						y: y + options.y - 10 // 10 is for the baseline (label vs text)
					});
				dataLabel.moved = true;

				// draw the connector
				if (outside && connectorWidth) {
					connector = point.connector;

					connectorPath = softConnector ? [
						M,
						x + (labelPos[6] === 'left' ? 5 : -5), y, // end of the string at the label
						'C',
						x, y, // first break, next to the label
						2 * labelPos[2] - labelPos[4], 2 * labelPos[3] - labelPos[5],
						labelPos[2], labelPos[3], // second break
						L,
						labelPos[4], labelPos[5] // base
					] : [
						M,
						x + (labelPos[6] === 'left' ? 5 : -5), y, // end of the string at the label
						L,
						labelPos[2], labelPos[3], // second break
						L,
						labelPos[4], labelPos[5] // base
					];

					if (connector) {
						connector.animate({ d: connectorPath });
						connector.attr('visibility', visibility);

					} else {
						point.connector = connector = series.chart.renderer.path(connectorPath).attr({
							'stroke-width': connectorWidth,
							stroke: options.connectorColor || point.color || '#606060',
							visibility: visibility,
							zIndex: 3
						})
						.translate(chart.plotLeft, chart.plotTop)
						.add();
					}
				}
			}
		}
	},
	
	alignDataLabel: noop,

	/**
	 * Draw point specific tracker objects. Inherit directly from column series.
	 */
	drawTracker: ColumnSeries.prototype.drawTracker,

	/**
	 * Use a simple symbol from column prototype
	 */
	drawLegendSymbol: AreaSeries.prototype.drawLegendSymbol,

	/**
	 * Pies don't have point marker symbols
	 */
	getSymbol: function () {}

};
PieSeries = extendClass(Series, PieSeries);
seriesTypes.pie = PieSeries;


// global variables
extend(Highcharts, {
	
	// Constructors
	Axis: Axis,
	CanVGRenderer: CanVGRenderer,
	Chart: Chart,
	Color: Color,
	Legend: Legend,
	MouseTracker: MouseTracker,
	Point: Point,
	Tick: Tick,
	Tooltip: Tooltip,
	Renderer: Renderer,
	Series: Series,
	SVGRenderer: SVGRenderer,
	VMLRenderer: VMLRenderer,
	
	// Various
	dateFormat: dateFormat,
	pathAnim: pathAnim,
	getOptions: getOptions,
	hasBidiBug: hasBidiBug,
	numberFormat: numberFormat,
	seriesTypes: seriesTypes,
	setOptions: setOptions,
	addEvent: addEvent,
	removeEvent: removeEvent,
	createElement: createElement,
	discardElement: discardElement,
	css: css,
	each: each,
	extend: extend,
	map: map,
	merge: merge,
	pick: pick,
	splat: splat,
	extendClass: extendClass,
	pInt: pInt,
	wrap: wrap,
	svg: hasSVG,
	canvas: useCanVG,
	vml: !hasSVG && !useCanVG,
	product: 'Highcharts',
	version: '2.3.3'
});

return Highcharts;
});

// Generated by CoffeeScript 1.4.0

define('plugins/backbone-charts/options',[],function() {
  var defaults, sparkline;
  defaults = {
    chart: {
      style: {
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
      }
    },
    title: {
      text: '',
      align: 'right'
    },
    subtitle: {
      align: 'right'
    },
    exporting: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    tooltip: {
      snap: 1,
      useHTML: true,
      borderWidth: 1,
      borderRadius: 3
    },
    plotOptions: {
      series: {
        shadow: false,
        animation: {
          duration: 400
        }
      },
      area: {
        lineWidth: 1,
        shadow: false,
        stacking: 'normal',
        states: {
          hover: {
            lineWidth: 1
          }
        },
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true,
              radius: 5
            }
          }
        },
        fillOpacity: 0.1
      },
      areaspline: {
        lineWidth: 1,
        shadow: false,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        },
        fillOpacity: 0.1
      },
      bar: {
        borderWidth: 0,
        minPointLength: 2
      },
      column: {
        borderWidth: 0,
        minPointLength: 2
      },
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        showInLegend: true
      },
      scatter: {
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: false
            }
          }
        },
        states: {
          hover: {
            marker: {
              enabled: false
            }
          }
        }
      }
    }
  };
  sparkline = {
    chart: {
      defaultSeriesType: 'areaspline',
      margin: [0, 0, 0, 0]
    },
    title: {
      text: '',
      align: 'left',
      y: 0,
      x: 0,
      style: {
        fontSize: '8px',
        color: '#333333'
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    xAxis: {
      startOnTick: true,
      labels: {
        enabled: false
      }
    },
    yAxis: {
      endOnTick: false,
      labels: {
        enabled: false
      }
    },
    plotOptions: {
      series: {
        lineWidth: 1,
        shadow: false,
        states: {
          hover: {
            enabled: false
          }
        },
        marker: {
          enabled: false
        }
      },
      areaspline: {
        fillOpacity: 0.1
      },
      area: {
        fillOpacity: 0.1
      }
    }
  };
  return {
    defaults: defaults,
    sparkline: sparkline
  };
});

// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define('plugins/backbone-charts',['highcharts', 'underscore', 'backbone', './backbone-charts/options'], function(Highcharts, _, Backbone, chartOptions) {
  var AreaChart, AreaSplineChart, BarChart, Chart, ColumnChart, LineChart, OPTIONS_MAP, PieChart, ScatterChart, Sparkline, SplineChart;
  OPTIONS_MAP = {
    el: 'chart.renderTo',
    type: 'chart.type',
    height: 'chart.height',
    width: 'chart.width',
    labelFormatter: 'plotOptions.series.dataLabels.formatter',
    tooltipFormatter: 'tooltip.formatter',
    animate: 'plotOptions.series.animation',
    categories: 'xAxis.categories',
    title: 'title.text',
    subtitle: 'subtitle.text',
    xAxis: 'xAxis.title.text',
    yAxis: 'yAxis.title.text',
    stacking: 'plotOptions.series.stacking',
    legend: 'legend.enabled',
    suffix: 'tooltip.valueSuffix',
    prefix: 'tooltip.valuePrefix',
    series: 'series'
  };
  Chart = (function(_super) {

    __extends(Chart, _super);

    function Chart() {
      return Chart.__super__.constructor.apply(this, arguments);
    }

    Chart.prototype.className = 'chart';

    Chart.prototype.chartOptions = chartOptions.defaults;

    Chart.prototype.initialize = function(options) {
      var key, value;
      if (!(options.el != null)) {
        options.el = this.el;
      }
      this.chartOptions = $.extend(true, {}, this.chartOptions, options.options);
      for (key in options) {
        value = options[key];
        if (OPTIONS_MAP[key]) {
          this.setOption(OPTIONS_MAP[key], value);
        }
      }
    };

    Chart.prototype.setOption = function(key, value) {
      var last, options, tok, toks, _i, _len;
      options = this.chartOptions;
      toks = key.split('.');
      last = toks.pop();
      for (_i = 0, _len = toks.length; _i < _len; _i++) {
        tok = toks[_i];
        if (!(options[tok] != null)) {
          options[tok] = {};
        }
        options = options[tok];
      }
      return options[last] = value;
    };

    Chart.prototype.render = function() {
      if (this.chart) {
        this.chart.destroy();
      }
      if (this.model) {
        this.chartOptions.series = [$.extend(true, {}, this.model.toJSON())];
        if (this.model.categories) {
          this.setOption('xAxis.categories', this.model.categories);
        }
      } else if (this.collection) {
        if (this.collection instanceof Series) {
          this.chartOptions.series = [$.extend(true, {}, this.collection.toJSON())];
        } else {
          this.chartOptions.series = $.extend(true, [], this.collection.toJSON());
        }
        if (this.collection.categories) {
          this.setOption('xAxis.categories', this.collection.categories);
        }
      }
      this.chart = new Highcharts.Chart(this.chartOptions);
      return this.$el;
    };

    return Chart;

  })(Backbone.View);
  Chart.setDefaultOption = function(key, value) {
    var last, options, prev, prevTok, tok, toks, _i, _len;
    options = this.prototype.chartOptions = _.clone(this.prototype.chartOptions);
    toks = key.split('.');
    last = toks.pop();
    prev = null;
    prevTok = null;
    for (_i = 0, _len = toks.length; _i < _len; _i++) {
      tok = toks[_i];
      prev = options;
      if (prev[tok] != null) {
        options = _.clone(prev[tok]);
      } else {
        options = {};
      }
      prev[tok] = options;
    }
    return options[last] = value;
  };
  AreaChart = (function(_super) {

    __extends(AreaChart, _super);

    function AreaChart() {
      return AreaChart.__super__.constructor.apply(this, arguments);
    }

    return AreaChart;

  })(Chart);
  AreaChart.setDefaultOption('chart.type', 'area');
  AreaSplineChart = (function(_super) {

    __extends(AreaSplineChart, _super);

    function AreaSplineChart() {
      return AreaSplineChart.__super__.constructor.apply(this, arguments);
    }

    return AreaSplineChart;

  })(Chart);
  AreaSplineChart.setDefaultOption('chart.type', 'areaspline');
  BarChart = (function(_super) {

    __extends(BarChart, _super);

    function BarChart() {
      return BarChart.__super__.constructor.apply(this, arguments);
    }

    return BarChart;

  })(Chart);
  BarChart.setDefaultOption('chart.type', 'bar');
  ColumnChart = (function(_super) {

    __extends(ColumnChart, _super);

    function ColumnChart() {
      return ColumnChart.__super__.constructor.apply(this, arguments);
    }

    return ColumnChart;

  })(Chart);
  ColumnChart.setDefaultOption('chart.type', 'column');
  LineChart = (function(_super) {

    __extends(LineChart, _super);

    function LineChart() {
      return LineChart.__super__.constructor.apply(this, arguments);
    }

    return LineChart;

  })(Chart);
  LineChart.setDefaultOption('chart.type', 'line');
  PieChart = (function(_super) {

    __extends(PieChart, _super);

    function PieChart() {
      return PieChart.__super__.constructor.apply(this, arguments);
    }

    return PieChart;

  })(Chart);
  PieChart.setDefaultOption('chart.type', 'pie');
  PieChart.setDefaultOption('legend.enabled', true);
  ScatterChart = (function(_super) {

    __extends(ScatterChart, _super);

    function ScatterChart() {
      return ScatterChart.__super__.constructor.apply(this, arguments);
    }

    return ScatterChart;

  })(Chart);
  ScatterChart.setDefaultOption('chart.type', 'scatter');
  SplineChart = (function(_super) {

    __extends(SplineChart, _super);

    function SplineChart() {
      return SplineChart.__super__.constructor.apply(this, arguments);
    }

    return SplineChart;

  })(Chart);
  SplineChart.setDefaultOption('chart.type', 'spline');
  Sparkline = (function(_super) {

    __extends(Sparkline, _super);

    function Sparkline() {
      return Sparkline.__super__.constructor.apply(this, arguments);
    }

    Sparkline.prototype.className = 'sparkline';

    Sparkline.prototype.chartOptions = chartOptions.sparkline;

    return Sparkline;

  })(Chart);
  Backbone.Chart = Chart;
  Backbone.AreaChart = AreaChart;
  Backbone.AreaSplineChart = AreaSplineChart;
  Backbone.BarChart = BarChart;
  Backbone.ColumnChart = ColumnChart;
  Backbone.LineChart = LineChart;
  Backbone.PieChart = PieChart;
  Backbone.ScatterChart = ScatterChart;
  Backbone.SplineChart = SplineChart;
  Backbone.Sparkline = Sparkline;
});

/* ===================================================
 * bootstrap-transition.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


define('plugins/bootstrap',['../jquery'], function(jQuery) {
    !function ($) {

       // jshint ;_;


      /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
       * ======================================================= */

      $(function () {

        $.support.transition = (function () {

          var transitionEnd = (function () {

            var el = document.createElement('bootstrap')
              , transEndEventNames = {
                   'WebkitTransition' : 'webkitTransitionEnd'
                ,  'MozTransition'    : 'transitionend'
                ,  'OTransition'      : 'oTransitionEnd otransitionend'
                ,  'transition'       : 'transitionend'
                }
              , name

            for (name in transEndEventNames){
              if (el.style[name] !== undefined) {
                return transEndEventNames[name]
              }
            }

          }())

          return transitionEnd && {
            end: transitionEnd
          }

        })()

      })

    }(jQuery);/* ==========================================================
     * bootstrap-alert.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#alerts
     * ==========================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ========================================================== */


    !function ($) {

       // jshint ;_;


     /* ALERT CLASS DEFINITION
      * ====================== */

      var dismiss = '[data-dismiss="alert"]'
        , Alert = function (el) {
            $(el).on('click', dismiss, this.close)
          }

      Alert.prototype.close = function (e) {
        var $this = $(this)
          , selector = $this.attr('data-target')
          , $parent

        if (!selector) {
          selector = $this.attr('href')
          selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        $parent = $(selector)

        e && e.preventDefault()

        $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

        $parent.trigger(e = $.Event('close'))

        if (e.isDefaultPrevented()) return

        $parent.removeClass('in')

        function removeElement() {
          $parent
            .trigger('closed')
            .remove()
        }

        $.support.transition && $parent.hasClass('fade') ?
          $parent.on($.support.transition.end, removeElement) :
          removeElement()
      }


     /* ALERT PLUGIN DEFINITION
      * ======================= */

      var old = $.fn.alert

      $.fn.alert = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('alert')
          if (!data) $this.data('alert', (data = new Alert(this)))
          if (typeof option == 'string') data[option].call($this)
        })
      }

      $.fn.alert.Constructor = Alert


     /* ALERT NO CONFLICT
      * ================= */

      $.fn.alert.noConflict = function () {
        $.fn.alert = old
        return this
      }


     /* ALERT DATA-API
      * ============== */

      $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

    }(jQuery);/* ============================================================
     * bootstrap-button.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#buttons
     * ============================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ============================================================ */


    !function ($) {

       // jshint ;_;


     /* BUTTON PUBLIC CLASS DEFINITION
      * ============================== */

      var Button = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.button.defaults, options)
      }

      Button.prototype.setState = function (state) {
        var d = 'disabled'
          , $el = this.$element
          , data = $el.data()
          , val = $el.is('input') ? 'val' : 'html'

        state = state + 'Text'
        data.resetText || $el.data('resetText', $el[val]())

        $el[val](data[state] || this.options[state])

        // push to event loop to allow forms to submit
        setTimeout(function () {
          state == 'loadingText' ?
            $el.addClass(d).attr(d, d) :
            $el.removeClass(d).removeAttr(d)
        }, 0)
      }

      Button.prototype.toggle = function () {
        var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

        $parent && $parent
          .find('.active')
          .removeClass('active')

        this.$element.toggleClass('active')
      }


     /* BUTTON PLUGIN DEFINITION
      * ======================== */

      var old = $.fn.button

      $.fn.button = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('button')
            , options = typeof option == 'object' && option
          if (!data) $this.data('button', (data = new Button(this, options)))
          if (option == 'toggle') data.toggle()
          else if (option) data.setState(option)
        })
      }

      $.fn.button.defaults = {
        loadingText: 'loading...'
      }

      $.fn.button.Constructor = Button


     /* BUTTON NO CONFLICT
      * ================== */

      $.fn.button.noConflict = function () {
        $.fn.button = old
        return this
      }


     /* BUTTON DATA-API
      * =============== */

      $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
        var $btn = $(e.target)
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
        $btn.button('toggle')
      })

    }(jQuery);/* ==========================================================
     * bootstrap-carousel.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#carousel
     * ==========================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ========================================================== */


    !function ($) {

       // jshint ;_;


     /* CAROUSEL CLASS DEFINITION
      * ========================= */

      var Carousel = function (element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.options.pause == 'hover' && this.$element
          .on('mouseenter', $.proxy(this.pause, this))
          .on('mouseleave', $.proxy(this.cycle, this))
      }

      Carousel.prototype = {

        cycle: function (e) {
          if (!e) this.paused = false
          if (this.interval) clearInterval(this.interval);
          this.options.interval
            && !this.paused
            && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
          return this
        }

      , getActiveIndex: function () {
          this.$active = this.$element.find('.item.active')
          this.$items = this.$active.parent().children()
          return this.$items.index(this.$active)
        }

      , to: function (pos) {
          var activeIndex = this.getActiveIndex()
            , that = this

          if (pos > (this.$items.length - 1) || pos < 0) return

          if (this.sliding) {
            return this.$element.one('slid', function () {
              that.to(pos)
            })
          }

          if (activeIndex == pos) {
            return this.pause().cycle()
          }

          return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
        }

      , pause: function (e) {
          if (!e) this.paused = true
          if (this.$element.find('.next, .prev').length && $.support.transition.end) {
            this.$element.trigger($.support.transition.end)
            this.cycle()
          }
          clearInterval(this.interval)
          this.interval = null
          return this
        }

      , next: function () {
          if (this.sliding) return
          return this.slide('next')
        }

      , prev: function () {
          if (this.sliding) return
          return this.slide('prev')
        }

      , slide: function (type, next) {
          var $active = this.$element.find('.item.active')
            , $next = next || $active[type]()
            , isCycling = this.interval
            , direction = type == 'next' ? 'left' : 'right'
            , fallback  = type == 'next' ? 'first' : 'last'
            , that = this
            , e

          this.sliding = true

          isCycling && this.pause()

          $next = $next.length ? $next : this.$element.find('.item')[fallback]()

          e = $.Event('slide', {
            relatedTarget: $next[0]
          , direction: direction
          })

          if ($next.hasClass('active')) return

          if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            this.$element.one('slid', function () {
              var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
              $nextIndicator && $nextIndicator.addClass('active')
            })
          }

          if ($.support.transition && this.$element.hasClass('slide')) {
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            this.$element.one($.support.transition.end, function () {
              $next.removeClass([type, direction].join(' ')).addClass('active')
              $active.removeClass(['active', direction].join(' '))
              that.sliding = false
              setTimeout(function () { that.$element.trigger('slid') }, 0)
            })
          } else {
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger('slid')
          }

          isCycling && this.cycle()

          return this
        }

      }


     /* CAROUSEL PLUGIN DEFINITION
      * ========================== */

      var old = $.fn.carousel

      $.fn.carousel = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('carousel')
            , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
            , action = typeof option == 'string' ? option : options.slide
          if (!data) $this.data('carousel', (data = new Carousel(this, options)))
          if (typeof option == 'number') data.to(option)
          else if (action) data[action]()
          else if (options.interval) data.pause().cycle()
        })
      }

      $.fn.carousel.defaults = {
        interval: 5000
      , pause: 'hover'
      }

      $.fn.carousel.Constructor = Carousel


     /* CAROUSEL NO CONFLICT
      * ==================== */

      $.fn.carousel.noConflict = function () {
        $.fn.carousel = old
        return this
      }

     /* CAROUSEL DATA-API
      * ================= */

      $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
        var $this = $(this), href
          , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
          , options = $.extend({}, $target.data(), $this.data())
          , slideIndex

        $target.carousel(options)

        if (slideIndex = $this.attr('data-slide-to')) {
          $target.data('carousel').pause().to(slideIndex).cycle()
        }

        e.preventDefault()
      })

    }(jQuery);/* =============================================================
     * bootstrap-collapse.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#collapse
     * =============================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ============================================================ */


    !function ($) {

       // jshint ;_;


     /* COLLAPSE PUBLIC CLASS DEFINITION
      * ================================ */

      var Collapse = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.collapse.defaults, options)

        if (this.options.parent) {
          this.$parent = $(this.options.parent)
        }

        this.options.toggle && this.toggle()
      }

      Collapse.prototype = {

        constructor: Collapse

      , dimension: function () {
          var hasWidth = this.$element.hasClass('width')
          return hasWidth ? 'width' : 'height'
        }

      , show: function () {
          var dimension
            , scroll
            , actives
            , hasData

          if (this.transitioning || this.$element.hasClass('in')) return

          dimension = this.dimension()
          scroll = $.camelCase(['scroll', dimension].join('-'))
          actives = this.$parent && this.$parent.find('> .accordion-group > .in')

          if (actives && actives.length) {
            hasData = actives.data('collapse')
            if (hasData && hasData.transitioning) return
            actives.collapse('hide')
            hasData || actives.data('collapse', null)
          }

          this.$element[dimension](0)
          this.transition('addClass', $.Event('show'), 'shown')
          $.support.transition && this.$element[dimension](this.$element[0][scroll])
        }

      , hide: function () {
          var dimension
          if (this.transitioning || !this.$element.hasClass('in')) return
          dimension = this.dimension()
          this.reset(this.$element[dimension]())
          this.transition('removeClass', $.Event('hide'), 'hidden')
          this.$element[dimension](0)
        }

      , reset: function (size) {
          var dimension = this.dimension()

          this.$element
            .removeClass('collapse')
            [dimension](size || 'auto')
            [0].offsetWidth

          this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

          return this
        }

      , transition: function (method, startEvent, completeEvent) {
          var that = this
            , complete = function () {
                if (startEvent.type == 'show') that.reset()
                that.transitioning = 0
                that.$element.trigger(completeEvent)
              }

          this.$element.trigger(startEvent)

          if (startEvent.isDefaultPrevented()) return

          this.transitioning = 1

          this.$element[method]('in')

          $.support.transition && this.$element.hasClass('collapse') ?
            this.$element.one($.support.transition.end, complete) :
            complete()
        }

      , toggle: function () {
          this[this.$element.hasClass('in') ? 'hide' : 'show']()
        }

      }


     /* COLLAPSE PLUGIN DEFINITION
      * ========================== */

      var old = $.fn.collapse

      $.fn.collapse = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('collapse')
            , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
          if (!data) $this.data('collapse', (data = new Collapse(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      $.fn.collapse.defaults = {
        toggle: true
      }

      $.fn.collapse.Constructor = Collapse


     /* COLLAPSE NO CONFLICT
      * ==================== */

      $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
      }


     /* COLLAPSE DATA-API
      * ================= */

      $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
        var $this = $(this), href
          , target = $this.attr('data-target')
            || e.preventDefault()
            || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
          , option = $(target).data('collapse') ? 'toggle' : $this.data()
        $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
        $(target).collapse(option)
      })

    }(jQuery);/* ============================================================
     * bootstrap-dropdown.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#dropdowns
     * ============================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ============================================================ */


    !function ($) {

       // jshint ;_;


     /* DROPDOWN CLASS DEFINITION
      * ========================= */

      var toggle = '[data-toggle=dropdown]'
        , Dropdown = function (element) {
            var $el = $(element).on('click.dropdown.data-api', this.toggle)
            $('html').on('click.dropdown.data-api', function () {
              $el.parent().removeClass('open')
            })
          }

      Dropdown.prototype = {

        constructor: Dropdown

      , toggle: function (e) {
          var $this = $(this)
            , $parent
            , isActive

          if ($this.is('.disabled, :disabled')) return

          $parent = getParent($this)

          isActive = $parent.hasClass('open')

          clearMenus()

          if (!isActive) {
            $parent.toggleClass('open')
          }

          $this.focus()

          return false
        }

      , keydown: function (e) {
          var $this
            , $items
            , $active
            , $parent
            , isActive
            , index

          if (!/(38|40|27)/.test(e.keyCode)) return

          $this = $(this)

          e.preventDefault()
          e.stopPropagation()

          if ($this.is('.disabled, :disabled')) return

          $parent = getParent($this)

          isActive = $parent.hasClass('open')

          if (!isActive || (isActive && e.keyCode == 27)) {
            if (e.which == 27) $parent.find(toggle).focus()
            return $this.click()
          }

          $items = $('[role=menu] li:not(.divider):visible a', $parent)

          if (!$items.length) return

          index = $items.index($items.filter(':focus'))

          if (e.keyCode == 38 && index > 0) index--                                        // up
          if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
          if (!~index) index = 0

          $items
            .eq(index)
            .focus()
        }

      }

      function clearMenus() {
        $(toggle).each(function () {
          getParent($(this)).removeClass('open')
        })
      }

      function getParent($this) {
        var selector = $this.attr('data-target')
          , $parent

        if (!selector) {
          selector = $this.attr('href')
          selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
        }

        $parent = selector && $(selector)

        if (!$parent || !$parent.length) $parent = $this.parent()

        return $parent
      }


      /* DROPDOWN PLUGIN DEFINITION
       * ========================== */

      var old = $.fn.dropdown

      $.fn.dropdown = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('dropdown')
          if (!data) $this.data('dropdown', (data = new Dropdown(this)))
          if (typeof option == 'string') data[option].call($this)
        })
      }

      $.fn.dropdown.Constructor = Dropdown


     /* DROPDOWN NO CONFLICT
      * ==================== */

      $.fn.dropdown.noConflict = function () {
        $.fn.dropdown = old
        return this
      }


      /* APPLY TO STANDARD DROPDOWN ELEMENTS
       * =================================== */

      $(document)
        .on('click.dropdown.data-api', clearMenus)
        .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
        .on('.dropdown-menu', function (e) { e.stopPropagation() })
        .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
        .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

    }(jQuery);
    /* =========================================================
     * bootstrap-modal.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#modals
     * =========================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ========================================================= */


    !function ($) {

       // jshint ;_;


     /* MODAL CLASS DEFINITION
      * ====================== */

      var Modal = function (element, options) {
        this.options = options
        this.$element = $(element)
          .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
        this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
      }

      Modal.prototype = {

          constructor: Modal

        , toggle: function () {
            return this[!this.isShown ? 'show' : 'hide']()
          }

        , show: function () {
            var that = this
              , e = $.Event('show')

            this.$element.trigger(e)

            if (this.isShown || e.isDefaultPrevented()) return

            this.isShown = true

            this.escape()

            this.backdrop(function () {
              var transition = $.support.transition && that.$element.hasClass('fade')

              if (!that.$element.parent().length) {
                that.$element.appendTo(document.body) //don't move modals dom position
              }

              that.$element.show()

              if (transition) {
                that.$element[0].offsetWidth // force reflow
              }

              that.$element
                .addClass('in')
                .attr('aria-hidden', false)

              that.enforceFocus()

              transition ?
                that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
                that.$element.focus().trigger('shown')

            })
          }

        , hide: function (e) {
            e && e.preventDefault()

            var that = this

            e = $.Event('hide')

            this.$element.trigger(e)

            if (!this.isShown || e.isDefaultPrevented()) return

            this.isShown = false

            this.escape()

            $(document).off('focusin.modal')

            this.$element
              .removeClass('in')
              .attr('aria-hidden', true)

            $.support.transition && this.$element.hasClass('fade') ?
              this.hideWithTransition() :
              this.hideModal()
          }

        , enforceFocus: function () {
            var that = this
            $(document).on('focusin.modal', function (e) {
              if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
                that.$element.focus()
              }
            })
          }

        , escape: function () {
            var that = this
            if (this.isShown && this.options.keyboard) {
              this.$element.on('keyup.dismiss.modal', function ( e ) {
                e.which == 27 && that.hide()
              })
            } else if (!this.isShown) {
              this.$element.off('keyup.dismiss.modal')
            }
          }

        , hideWithTransition: function () {
            var that = this
              , timeout = setTimeout(function () {
                  that.$element.off($.support.transition.end)
                  that.hideModal()
                }, 500)

            this.$element.one($.support.transition.end, function () {
              clearTimeout(timeout)
              that.hideModal()
            })
          }

        , hideModal: function () {
            var that = this
            this.$element.hide()
            this.backdrop(function () {
              that.removeBackdrop()
              that.$element.trigger('hidden')
            })
          }

        , removeBackdrop: function () {
            this.$backdrop.remove()
            this.$backdrop = null
          }

        , backdrop: function (callback) {
            var that = this
              , animate = this.$element.hasClass('fade') ? 'fade' : ''

            if (this.isShown && this.options.backdrop) {
              var doAnimate = $.support.transition && animate

              this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .appendTo(document.body)

              this.$backdrop.click(
                this.options.backdrop == 'static' ?
                  $.proxy(this.$element[0].focus, this.$element[0])
                : $.proxy(this.hide, this)
              )

              if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

              this.$backdrop.addClass('in')

              if (!callback) return

              doAnimate ?
                this.$backdrop.one($.support.transition.end, callback) :
                callback()

            } else if (!this.isShown && this.$backdrop) {
              this.$backdrop.removeClass('in')

              $.support.transition && this.$element.hasClass('fade')?
                this.$backdrop.one($.support.transition.end, callback) :
                callback()

            } else if (callback) {
              callback()
            }
          }
      }


     /* MODAL PLUGIN DEFINITION
      * ======================= */

      var old = $.fn.modal

      $.fn.modal = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('modal')
            , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
          if (!data) $this.data('modal', (data = new Modal(this, options)))
          if (typeof option == 'string') data[option]()
          else if (options.show) data.show()
        })
      }

      $.fn.modal.defaults = {
          backdrop: true
        , keyboard: true
        , show: true
      }

      $.fn.modal.Constructor = Modal


     /* MODAL NO CONFLICT
      * ================= */

      $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
      }


     /* MODAL DATA-API
      * ============== */

      $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this)
          , href = $this.attr('href')
          , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
          , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

        e.preventDefault()

        $target
          .modal(option)
          .one('hide', function () {
            $this.focus()
          })
      })

    }(jQuery);
    /* ===========================================================
     * bootstrap-tooltip.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#tooltips
     * Inspired by the original jQuery.tipsy by Jason Frame
     * ===========================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ========================================================== */


    !function ($) {

       // jshint ;_;


     /* TOOLTIP PUBLIC CLASS DEFINITION
      * =============================== */

      var Tooltip = function (element, options) {
        this.init('tooltip', element, options)
      }

      Tooltip.prototype = {

        constructor: Tooltip

      , init: function (type, element, options) {
          var eventIn
            , eventOut
            , triggers
            , trigger
            , i

          this.type = type
          this.$element = $(element)
          this.options = this.getOptions(options)
          this.enabled = true

          triggers = this.options.trigger.split(' ')

          for (i = triggers.length; i--;) {
            trigger = triggers[i]
            if (trigger == 'click') {
              this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
              eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
              eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
              this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
              this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
          }

          this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle()
        }

      , getOptions: function (options) {
          options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

          if (options.delay && typeof options.delay == 'number') {
            options.delay = {
              show: options.delay
            , hide: options.delay
            }
          }

          return options
        }

      , enter: function (e) {
          var self = $(e.currentTarget)[this.type](this._options).data(this.type)

          if (!self.options.delay || !self.options.delay.show) return self.show()

          clearTimeout(this.timeout)
          self.hoverState = 'in'
          this.timeout = setTimeout(function() {
            if (self.hoverState == 'in') self.show()
          }, self.options.delay.show)
        }

      , leave: function (e) {
          var self = $(e.currentTarget)[this.type](this._options).data(this.type)

          if (this.timeout) clearTimeout(this.timeout)
          if (!self.options.delay || !self.options.delay.hide) return self.hide()

          self.hoverState = 'out'
          this.timeout = setTimeout(function() {
            if (self.hoverState == 'out') self.hide()
          }, self.options.delay.hide)
        }

      , show: function () {
          var $tip
            , pos
            , actualWidth
            , actualHeight
            , placement
            , tp
            , e = $.Event('show')

          if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            $tip = this.tip()
            this.setContent()

            if (this.options.animation) {
              $tip.addClass('fade')
            }

            placement = typeof this.options.placement == 'function' ?
              this.options.placement.call(this, $tip[0], this.$element[0]) :
              this.options.placement

            $tip
              .detach()
              .css({ top: 0, left: 0, display: 'block' })

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

            pos = this.getPosition()

            actualWidth = $tip[0].offsetWidth
            actualHeight = $tip[0].offsetHeight

            switch (placement) {
              case 'bottom':
                tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
                break
              case 'top':
                tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
                break
              case 'left':
                tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
                break
              case 'right':
                tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
                break
            }

            this.applyPlacement(tp, placement)
            this.$element.trigger('shown')
          }
        }

      , applyPlacement: function(offset, placement){
          var $tip = this.tip()
            , width = $tip[0].offsetWidth
            , height = $tip[0].offsetHeight
            , actualWidth
            , actualHeight
            , delta
            , replace

          $tip
            .offset(offset)
            .addClass(placement)
            .addClass('in')

          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight

          if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
            replace = true
          }

          if (placement == 'bottom' || placement == 'top') {
            delta = 0

            if (offset.left < 0){
              delta = offset.left * -2
              offset.left = 0
              $tip.offset(offset)
              actualWidth = $tip[0].offsetWidth
              actualHeight = $tip[0].offsetHeight
            }

            this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
          } else {
            this.replaceArrow(actualHeight - height, actualHeight, 'top')
          }

          if (replace) $tip.offset(offset)
        }

      , replaceArrow: function(delta, dimension, position){
          this
            .arrow()
            .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
        }

      , setContent: function () {
          var $tip = this.tip()
            , title = this.getTitle()

          $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
          $tip.removeClass('fade in top bottom left right')
        }

      , hide: function () {
          var that = this
            , $tip = this.tip()
            , e = $.Event('hide')

          this.$element.trigger(e)
          if (e.isDefaultPrevented()) return

          $tip.removeClass('in')

          function removeWithAnimation() {
            var timeout = setTimeout(function () {
              $tip.off($.support.transition.end).detach()
            }, 500)

            $tip.one($.support.transition.end, function () {
              clearTimeout(timeout)
              $tip.detach()
            })
          }

          $.support.transition && this.$tip.hasClass('fade') ?
            removeWithAnimation() :
            $tip.detach()

          this.$element.trigger('hidden')

          return this
        }

      , fixTitle: function () {
          var $e = this.$element
          if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
          }
        }

      , hasContent: function () {
          return this.getTitle()
        }

      , getPosition: function () {
          var el = this.$element[0]
          return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
            width: el.offsetWidth
          , height: el.offsetHeight
          }, this.$element.offset())
        }

      , getTitle: function () {
          var title
            , $e = this.$element
            , o = this.options

          title = $e.attr('data-original-title')
            || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

          return title
        }

      , tip: function () {
          return this.$tip = this.$tip || $(this.options.template)
        }

      , arrow: function(){
          return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
        }

      , validate: function () {
          if (!this.$element[0].parentNode) {
            this.hide()
            this.$element = null
            this.options = null
          }
        }

      , enable: function () {
          this.enabled = true
        }

      , disable: function () {
          this.enabled = false
        }

      , toggleEnabled: function () {
          this.enabled = !this.enabled
        }

      , toggle: function (e) {
          var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
          self.tip().hasClass('in') ? self.hide() : self.show()
        }

      , destroy: function () {
          this.hide().$element.off('.' + this.type).removeData(this.type)
        }

      }


     /* TOOLTIP PLUGIN DEFINITION
      * ========================= */

      var old = $.fn.tooltip

      $.fn.tooltip = function ( option ) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('tooltip')
            , options = typeof option == 'object' && option
          if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      $.fn.tooltip.Constructor = Tooltip

      $.fn.tooltip.defaults = {
        animation: true
      , placement: 'top'
      , selector: false
      , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
      , trigger: 'hover focus'
      , title: ''
      , delay: 0
      , html: false
      , container: false
      }


     /* TOOLTIP NO CONFLICT
      * =================== */

      $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
      }

    }(jQuery);
    /* ===========================================================
     * bootstrap-popover.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#popovers
     * ===========================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * =========================================================== */


    !function ($) {

       // jshint ;_;


     /* POPOVER PUBLIC CLASS DEFINITION
      * =============================== */

      var Popover = function (element, options) {
        this.init('popover', element, options)
      }


      /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
         ========================================== */

      Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

        constructor: Popover

      , setContent: function () {
          var $tip = this.tip()
            , title = this.getTitle()
            , content = this.getContent()

          $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
          $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

          $tip.removeClass('fade top bottom left right in')
        }

      , hasContent: function () {
          return this.getTitle() || this.getContent()
        }

      , getContent: function () {
          var content
            , $e = this.$element
            , o = this.options

          content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
            || $e.attr('data-content')

          return content
        }

      , tip: function () {
          if (!this.$tip) {
            this.$tip = $(this.options.template)
          }
          return this.$tip
        }

      , destroy: function () {
          this.hide().$element.off('.' + this.type).removeData(this.type)
        }

      })


     /* POPOVER PLUGIN DEFINITION
      * ======================= */

      var old = $.fn.popover

      $.fn.popover = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('popover')
            , options = typeof option == 'object' && option
          if (!data) $this.data('popover', (data = new Popover(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      $.fn.popover.Constructor = Popover

      $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
        placement: 'right'
      , trigger: 'click'
      , content: ''
      , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
      })


     /* POPOVER NO CONFLICT
      * =================== */

      $.fn.popover.noConflict = function () {
        $.fn.popover = old
        return this
      }

    }(jQuery);
    /* =============================================================
     * bootstrap-scrollspy.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#scrollspy
     * =============================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ============================================================== */


    !function ($) {

       // jshint ;_;


     /* SCROLLSPY CLASS DEFINITION
      * ========================== */

      function ScrollSpy(element, options) {
        var process = $.proxy(this.process, this)
          , $element = $(element).is('body') ? $(window) : $(element)
          , href
        this.options = $.extend({}, $.fn.scrollspy.defaults, options)
        this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
        this.selector = (this.options.target
          || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
          || '') + ' .nav li > a'
        this.$body = $('body')
        this.refresh()
        this.process()
      }

      ScrollSpy.prototype = {

          constructor: ScrollSpy

        , refresh: function () {
            var self = this
              , $targets

            this.offsets = $([])
            this.targets = $([])

            $targets = this.$body
              .find(this.selector)
              .map(function () {
                var $el = $(this)
                  , href = $el.data('target') || $el.attr('href')
                  , $href = /^#\w/.test(href) && $(href)
                return ( $href
                  && $href.length
                  && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
              })
              .sort(function (a, b) { return a[0] - b[0] })
              .each(function () {
                self.offsets.push(this[0])
                self.targets.push(this[1])
              })
          }

        , process: function () {
            var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
              , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
              , maxScroll = scrollHeight - this.$scrollElement.height()
              , offsets = this.offsets
              , targets = this.targets
              , activeTarget = this.activeTarget
              , i

            if (scrollTop >= maxScroll) {
              return activeTarget != (i = targets.last()[0])
                && this.activate ( i )
            }

            for (i = offsets.length; i--;) {
              activeTarget != targets[i]
                && scrollTop >= offsets[i]
                && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
                && this.activate( targets[i] )
            }
          }

        , activate: function (target) {
            var active
              , selector

            this.activeTarget = target

            $(this.selector)
              .parent('.active')
              .removeClass('active')

            selector = this.selector
              + '[data-target="' + target + '"],'
              + this.selector + '[href="' + target + '"]'

            active = $(selector)
              .parent('li')
              .addClass('active')

            if (active.parent('.dropdown-menu').length)  {
              active = active.closest('li.dropdown').addClass('active')
            }

            active.trigger('activate')
          }

      }


     /* SCROLLSPY PLUGIN DEFINITION
      * =========================== */

      var old = $.fn.scrollspy

      $.fn.scrollspy = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('scrollspy')
            , options = typeof option == 'object' && option
          if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      $.fn.scrollspy.Constructor = ScrollSpy

      $.fn.scrollspy.defaults = {
        offset: 10
      }


     /* SCROLLSPY NO CONFLICT
      * ===================== */

      $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
      }


     /* SCROLLSPY DATA-API
      * ================== */

      $(window).on('load', function () {
        $('[data-spy="scroll"]').each(function () {
          var $spy = $(this)
          $spy.scrollspy($spy.data())
        })
      })

    }(jQuery);/* ========================================================
     * bootstrap-tab.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#tabs
     * ========================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ======================================================== */


    !function ($) {

       // jshint ;_;


     /* TAB CLASS DEFINITION
      * ==================== */

      var Tab = function (element) {
        this.element = $(element)
      }

      Tab.prototype = {

        constructor: Tab

      , show: function () {
          var $this = this.element
            , $ul = $this.closest('ul:not(.dropdown-menu)')
            , selector = $this.attr('data-target')
            , previous
            , $target
            , e

          if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
          }

          if ( $this.parent('li').hasClass('active') ) return

          previous = $ul.find('.active:last a')[0]

          e = $.Event('show', {
            relatedTarget: previous
          })

          $this.trigger(e)

          if (e.isDefaultPrevented()) return

          $target = $(selector)

          this.activate($this.parent('li'), $ul)
          this.activate($target, $target.parent(), function () {
            $this.trigger({
              type: 'shown'
            , relatedTarget: previous
            })
          })
        }

      , activate: function ( element, container, callback) {
          var $active = container.find('> .active')
            , transition = callback
                && $.support.transition
                && $active.hasClass('fade')

          function next() {
            $active
              .removeClass('active')
              .find('> .dropdown-menu > .active')
              .removeClass('active')

            element.addClass('active')

            if (transition) {
              element[0].offsetWidth // reflow for transition
              element.addClass('in')
            } else {
              element.removeClass('fade')
            }

            if ( element.parent('.dropdown-menu') ) {
              element.closest('li.dropdown').addClass('active')
            }

            callback && callback()
          }

          transition ?
            $active.one($.support.transition.end, next) :
            next()

          $active.removeClass('in')
        }
      }


     /* TAB PLUGIN DEFINITION
      * ===================== */

      var old = $.fn.tab

      $.fn.tab = function ( option ) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('tab')
          if (!data) $this.data('tab', (data = new Tab(this)))
          if (typeof option == 'string') data[option]()
        })
      }

      $.fn.tab.Constructor = Tab


     /* TAB NO CONFLICT
      * =============== */

      $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
      }


     /* TAB DATA-API
      * ============ */

      $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
        e.preventDefault()
        $(this).tab('show')
      })

    }(jQuery);/* =============================================================
     * bootstrap-typeahead.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#typeahead
     * =============================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ============================================================ */


    !function($){

       // jshint ;_;


     /* TYPEAHEAD PUBLIC CLASS DEFINITION
      * ================================= */

      var Typeahead = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.typeahead.defaults, options)
        this.matcher = this.options.matcher || this.matcher
        this.sorter = this.options.sorter || this.sorter
        this.highlighter = this.options.highlighter || this.highlighter
        this.updater = this.options.updater || this.updater
        this.source = this.options.source
        this.$menu = $(this.options.menu)
        this.shown = false
        this.listen()
      }

      Typeahead.prototype = {

        constructor: Typeahead

      , select: function () {
          var val = this.$menu.find('.active').attr('data-value')
          this.$element
            .val(this.updater(val))
            .change()
          return this.hide()
        }

      , updater: function (item) {
          return item
        }

      , show: function () {
          var pos = $.extend({}, this.$element.position(), {
            height: this.$element[0].offsetHeight
          })

          this.$menu
            .insertAfter(this.$element)
            .css({
              top: pos.top + pos.height
            , left: pos.left
            })
            .show()

          this.shown = true
          return this
        }

      , hide: function () {
          this.$menu.hide()
          this.shown = false
          return this
        }

      , lookup: function (event) {
          var items

          this.query = this.$element.val()

          if (!this.query || this.query.length < this.options.minLength) {
            return this.shown ? this.hide() : this
          }

          items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

          return items ? this.process(items) : this
        }

      , process: function (items) {
          var that = this

          items = $.grep(items, function (item) {
            return that.matcher(item)
          })

          items = this.sorter(items)

          if (!items.length) {
            return this.shown ? this.hide() : this
          }

          return this.render(items.slice(0, this.options.items)).show()
        }

      , matcher: function (item) {
          return ~item.toLowerCase().indexOf(this.query.toLowerCase())
        }

      , sorter: function (items) {
          var beginswith = []
            , caseSensitive = []
            , caseInsensitive = []
            , item

          while (item = items.shift()) {
            if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
            else if (~item.indexOf(this.query)) caseSensitive.push(item)
            else caseInsensitive.push(item)
          }

          return beginswith.concat(caseSensitive, caseInsensitive)
        }

      , highlighter: function (item) {
          var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
          return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<strong>' + match + '</strong>'
          })
        }

      , render: function (items) {
          var that = this

          items = $(items).map(function (i, item) {
            i = $(that.options.item).attr('data-value', item)
            i.find('a').html(that.highlighter(item))
            return i[0]
          })

          items.first().addClass('active')
          this.$menu.html(items)
          return this
        }

      , next: function (event) {
          var active = this.$menu.find('.active').removeClass('active')
            , next = active.next()

          if (!next.length) {
            next = $(this.$menu.find('li')[0])
          }

          next.addClass('active')
        }

      , prev: function (event) {
          var active = this.$menu.find('.active').removeClass('active')
            , prev = active.prev()

          if (!prev.length) {
            prev = this.$menu.find('li').last()
          }

          prev.addClass('active')
        }

      , listen: function () {
          this.$element
            .on('focus',    $.proxy(this.focus, this))
            .on('blur',     $.proxy(this.blur, this))
            .on('keypress', $.proxy(this.keypress, this))
            .on('keyup',    $.proxy(this.keyup, this))

          if (this.eventSupported('keydown')) {
            this.$element.on('keydown', $.proxy(this.keydown, this))
          }

          this.$menu
            .on('click', $.proxy(this.click, this))
            .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
            .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
        }

      , eventSupported: function(eventName) {
          var isSupported = eventName in this.$element
          if (!isSupported) {
            this.$element.setAttribute(eventName, 'return;')
            isSupported = typeof this.$element[eventName] === 'function'
          }
          return isSupported
        }

      , move: function (e) {
          if (!this.shown) return

          switch(e.keyCode) {
            case 9: // tab
            case 13: // enter
            case 27: // escape
              e.preventDefault()
              break

            case 38: // up arrow
              e.preventDefault()
              this.prev()
              break

            case 40: // down arrow
              e.preventDefault()
              this.next()
              break
          }

          e.stopPropagation()
        }

      , keydown: function (e) {
          this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
          this.move(e)
        }

      , keypress: function (e) {
          if (this.suppressKeyPressRepeat) return
          this.move(e)
        }

      , keyup: function (e) {
          switch(e.keyCode) {
            case 40: // down arrow
            case 38: // up arrow
            case 16: // shift
            case 17: // ctrl
            case 18: // alt
              break

            case 9: // tab
            case 13: // enter
              if (!this.shown) return
              this.select()
              break

            case 27: // escape
              if (!this.shown) return
              this.hide()
              break

            default:
              this.lookup()
          }

          e.stopPropagation()
          e.preventDefault()
      }

      , focus: function (e) {
          this.focused = true
        }

      , blur: function (e) {
          this.focused = false
          if (!this.mousedover && this.shown) this.hide()
        }

      , click: function (e) {
          e.stopPropagation()
          e.preventDefault()
          this.select()
          this.$element.focus()
        }

      , mouseenter: function (e) {
          this.mousedover = true
          this.$menu.find('.active').removeClass('active')
          $(e.currentTarget).addClass('active')
        }

      , mouseleave: function (e) {
          this.mousedover = false
          if (!this.focused && this.shown) this.hide()
        }

      }


      /* TYPEAHEAD PLUGIN DEFINITION
       * =========================== */

      var old = $.fn.typeahead

      $.fn.typeahead = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('typeahead')
            , options = typeof option == 'object' && option
          if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      $.fn.typeahead.defaults = {
        source: []
      , items: 8
      , menu: '<ul class="typeahead dropdown-menu"></ul>'
      , item: '<li><a href="#"></a></li>'
      , minLength: 1
      }

      $.fn.typeahead.Constructor = Typeahead


     /* TYPEAHEAD NO CONFLICT
      * =================== */

      $.fn.typeahead.noConflict = function () {
        $.fn.typeahead = old
        return this
      }


     /* TYPEAHEAD DATA-API
      * ================== */

      $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
        var $this = $(this)
        if ($this.data('typeahead')) return
        $this.typeahead($this.data())
      })

    }(jQuery);
    /* ==========================================================
     * bootstrap-affix.js v2.3.0
     * http://twitter.github.com/bootstrap/javascript.html#affix
     * ==========================================================
     * Copyright 2012 Twitter, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     * ========================================================== */


    !function ($) {

       // jshint ;_;


     /* AFFIX CLASS DEFINITION
      * ====================== */

      var Affix = function (element, options) {
        this.options = $.extend({}, $.fn.affix.defaults, options)
        this.$window = $(window)
          .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
          .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
        this.$element = $(element)
        this.checkPosition()
      }

      Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return

        var scrollHeight = $(document).height()
          , scrollTop = this.$window.scrollTop()
          , position = this.$element.offset()
          , offset = this.options.offset
          , offsetBottom = offset.bottom
          , offsetTop = offset.top
          , reset = 'affix affix-top affix-bottom'
          , affix

        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top()
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

        affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
          false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
          'bottom' : offsetTop != null && scrollTop <= offsetTop ?
          'top'    : false

        if (this.affixed === affix) return

        this.affixed = affix
        this.unpin = affix == 'bottom' ? position.top - scrollTop : null

        this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
      }


     /* AFFIX PLUGIN DEFINITION
      * ======================= */

      var old = $.fn.affix

      $.fn.affix = function (option) {
        return this.each(function () {
          var $this = $(this)
            , data = $this.data('affix')
            , options = typeof option == 'object' && option
          if (!data) $this.data('affix', (data = new Affix(this, options)))
          if (typeof option == 'string') data[option]()
        })
      }

      $.fn.affix.Constructor = Affix

      $.fn.affix.defaults = {
        offset: 0
      }


     /* AFFIX NO CONFLICT
      * ================= */

      $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
      }


     /* AFFIX DATA-API
      * ============== */

      $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
          var $spy = $(this)
            , data = $spy.data()

          data.offset = data.offset || {}

          data.offsetBottom && (data.offset.bottom = data.offsetBottom)
          data.offsetTop && (data.offset.top = data.offsetTop)

          $spy.affix(data)
        })
      })


    }(jQuery);
});

define('plugins/bootstrap-typeselect',['jquery'], function($) {

    !function($) {

        

        var Typeselect = function(element, options) {

            // Initialize with typeahead
            this.$element = $(element).typeahead(options);
            this.options = $.extend({}, $.fn.typeselect.defaults, options);
            this.$target = $(this.options.target);

            var typeahead = this.$element.data('typeahead');

            // Override/extend typeahead methods
            this._process = $.proxy(typeahead.process, typeahead);
            typeahead.process = $.proxy(this.process, this);

            // Raw selected values
            this.selected = [];

            // Object of DOM items by value
            this.selectedItems = {};

            // Populate pre-selected values
            var preselected = this.options.selected || [];
            for (var i = 0; i < preselected.length; i++) {
                this.add(preselected[i]);
            }

            this.listen();
        };

        Typeselect.prototype = {

            constructor: Typeselect,

            listen: function() {
                this.$element
                    .on('keydown', $.proxy(this.keyup, this))
                    .on('change', $.proxy(this.change, this))

                this.$target
                    .on('click', '.close', $.proxy(this.click, this))

            },

            add: function(value) {
                // Do not add redundant values
                if (this.selectedItems[value]) return;
                this.selected.push(value);

                // Add the item to the target container
                var item = $(this.options.selectedItem)
                    .text(value)
                    .attr('data-value', value)
                    .append('<span class="close">&times;</span>');

                this.selectedItems[value] = item;

                // Add to the target container
                this.$target.append(item);
            },

            remove: function(value) {
                var item = this.selectedItems[value],
                    index = this.selected.indexOf(value);

                // Remove from the selected array
                if (index >= 0) this.selected.pop(index);
                // Remove element from cache
                delete this.selectedItems[value];
                // Remove element from DOM
                item.remove();
            },

            change: function() {
                var value = this.$element.val();
                this.add(value);
                // Clear the value of the input for the next
                this.$element.val('');
            },

            process: function(items) {
                var that = this;

                // Remove items that are already selected
                items = $.grep(items, function(item) {
                    return that.selectedItems[item] == null;
                });

                return this._process(items);
            },

            click: function(event) {
                event.preventDefault();
                this.remove($(event.target).parent().attr('data-value'));
            }
        }

        $.fn.typeselect = function(option) {
            return this.each(function() {
                var $this = $(this),
                   data = $this.data('typeselect'),
                   options = typeof option == 'object' && option;
                if (!data) $this.data('typeselect', (data = new Typeselect(this, options)));
                if (typeof option == 'string') data[option]();
            });
        };


        $.fn.typeselect.defaults = {
            selected: [],
            selectedItem: '<li></li>'
        };


        $.fn.typeselect.Constructor = Typeselect;


        /* TYPESELECT DATA-API
         * =================== */
        $(document).on('focus.typeselect.data-api', '[data-provide="typeselect"]', function(e) {
            var $this = $(this);
            if ($this.data('typeselect')) return;
            e.preventDefault();
            $this.typeselect($this.data());
        });

    }($);

});

/* =========================================================
 * bootstrap-datepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

define('plugins/bootstrap-datepicker',['jquery'], function($) {

    function UTCDate(){
        return new Date(Date.UTC.apply(Date, arguments));
    }
    function UTCToday(){
        var today = new Date();
        return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    }

    // Picker object

    var Datepicker = function(element, options) {
        var that = this;

        this.element = $(element);
        this.language = options.language||this.element.data('date-language')||"en";
        this.language = this.language in dates ? this.language : this.language.split('-')[0]; //Check if "de-DE" style date is available, if not language should fallback to 2 letter code eg "de"
        this.language = this.language in dates ? this.language : "en";
        this.isRTL = dates[this.language].rtl||false;
        this.format = DPGlobal.parseFormat(options.format||this.element.data('date-format')||dates[this.language].format||'mm/dd/yyyy');
        this.isInline = false;
        this.isInput = this.element.is('input');
        this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
        this.hasInput = this.component && this.element.find('input').length;
        if(this.component && this.component.length === 0)
            this.component = false;

        this._attachEvents();

        this.forceParse = true;
        if ('forceParse' in options) {
            this.forceParse = options.forceParse;
        } else if ('dateForceParse' in this.element.data()) {
            this.forceParse = this.element.data('date-force-parse');
        }


        this.picker = $(DPGlobal.template)
                            .appendTo(this.isInline ? this.element : 'body')
                            .on({
                                click: $.proxy(this.click, this),
                                mousedown: $.proxy(this.mousedown, this)
                            });

        if(this.isInline) {
            this.picker.addClass('datepicker-inline');
        } else {
            this.picker.addClass('datepicker-dropdown dropdown-menu');
        }
        if (this.isRTL){
            this.picker.addClass('datepicker-rtl');
            this.picker.find('.prev i, .next i')
                        .toggleClass('icon-arrow-left icon-arrow-right');
        }
        $(document).on('mousedown', function (e) {
            // Clicked outside the datepicker, hide it
            if ($(e.target).closest('.datepicker.datepicker-inline, .datepicker.datepicker-dropdown').length === 0) {
                that.hide();
            }
        });

        this.autoclose = false;
        if ('autoclose' in options) {
            this.autoclose = options.autoclose;
        } else if ('dateAutoclose' in this.element.data()) {
            this.autoclose = this.element.data('date-autoclose');
        }

        this.keyboardNavigation = true;
        if ('keyboardNavigation' in options) {
            this.keyboardNavigation = options.keyboardNavigation;
        } else if ('dateKeyboardNavigation' in this.element.data()) {
            this.keyboardNavigation = this.element.data('date-keyboard-navigation');
        }

        this.viewMode = this.startViewMode = 0;
        switch(options.startView || this.element.data('date-start-view')){
            case 2:
            case 'decade':
                this.viewMode = this.startViewMode = 2;
                break;
            case 1:
            case 'year':
                this.viewMode = this.startViewMode = 1;
                break;
        }

        this.todayBtn = (options.todayBtn||this.element.data('date-today-btn')||false);
        this.todayHighlight = (options.todayHighlight||this.element.data('date-today-highlight')||false);

        this.calendarWeeks = false;
        if ('calendarWeeks' in options) {
            this.calendarWeeks = options.calendarWeeks;
        } else if ('dateCalendarWeeks' in this.element.data()) {
            this.calendarWeeks = this.element.data('date-calendar-weeks');
        }
        if (this.calendarWeeks)
            this.picker.find('tfoot th.today')
                        .attr('colspan', function(i, val){
                            return parseInt(val) + 1;
                        });

        this.weekStart = ((options.weekStart||this.element.data('date-weekstart')||dates[this.language].weekStart||0) % 7);
        this.weekEnd = ((this.weekStart + 6) % 7);
        this.startDate = -Infinity;
        this.endDate = Infinity;
        this.daysOfWeekDisabled = [];
        this.setStartDate(options.startDate||this.element.data('date-startdate'));
        this.setEndDate(options.endDate||this.element.data('date-enddate'));
        this.setDaysOfWeekDisabled(options.daysOfWeekDisabled||this.element.data('date-days-of-week-disabled'));
        this.fillDow();
        this.fillMonths();
        this.update();
        this.showMode();

        if(this.isInline) {
            this.show();
        }
    };

    Datepicker.prototype = {
        constructor: Datepicker,

        _events: [],
        _attachEvents: function(){
            this._detachEvents();
            if (this.isInput) { // single input
                this._events = [
                    [this.element, {
                        focus: $.proxy(this.show, this),
                        keyup: $.proxy(this.update, this),
                        keydown: $.proxy(this.keydown, this)
                    }]
                ];
            }
            else if (this.component && this.hasInput){ // component: input + button
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.element.find('input'), {
                        focus: $.proxy(this.show, this),
                        keyup: $.proxy(this.update, this),
                        keydown: $.proxy(this.keydown, this)
                    }],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
                        else if (this.element.is('div')) {  // inline datepicker
                            this.isInline = true;
                        }
            else {
                this._events = [
                    [this.element, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
            for (var i=0, el, ev; i<this._events.length; i++){
                el = this._events[i][0];
                ev = this._events[i][1];
                el.on(ev);
            }
        },
        _detachEvents: function(){
            for (var i=0, el, ev; i<this._events.length; i++){
                el = this._events[i][0];
                ev = this._events[i][1];
                el.off(ev);
            }
            this._events = [];
        },

        show: function(e) {
            this.picker.show();
            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
            this.update();
            this.place();
            $(window).on('resize', $.proxy(this.place, this));
            if (e ) {
                e.stopPropagation();
                e.preventDefault();
            }
            this.element.trigger({
                type: 'show',
                date: this.date
            });
        },

        hide: function(e){
            if(this.isInline) return;
            if (!this.picker.is(':visible')) return;
            this.picker.hide();
            $(window).off('resize', this.place);
            this.viewMode = this.startViewMode;
            this.showMode();
            if (!this.isInput) {
                $(document).off('mousedown', this.hide);
            }

            if (
                this.forceParse &&
                (
                    this.isInput && this.element.val() ||
                    this.hasInput && this.element.find('input').val()
                )
            )
                this.setValue();
            this.element.trigger({
                type: 'hide',
                date: this.date
            });
        },

        remove: function() {
            this._detachEvents();
            this.picker.remove();
            delete this.element.data().datepicker;
        },

        getDate: function() {
            var d = this.getUTCDate();
            return new Date(d.getTime() + (d.getTimezoneOffset()*60000));
        },

        getUTCDate: function() {
            return this.date;
        },

        setDate: function(d) {
            this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset()*60000)));
        },

        setUTCDate: function(d) {
            this.date = d;
            this.setValue();
        },

        setValue: function() {
            var formatted = this.getFormattedDate();
            if (!this.isInput) {
                if (this.component){
                    this.element.find('input').val(formatted);
                }
                this.element.data('date', formatted);
            } else {
                this.element.val(formatted);
            }
        },

        getFormattedDate: function(format) {
            if (format === undefined)
                format = this.format;
            return DPGlobal.formatDate(this.date, format, this.language);
        },

        setStartDate: function(startDate){
            this.startDate = startDate||-Infinity;
            if (this.startDate !== -Infinity) {
                this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language);
            }
            this.update();
            this.updateNavArrows();
        },

        setEndDate: function(endDate){
            this.endDate = endDate||Infinity;
            if (this.endDate !== Infinity) {
                this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language);
            }
            this.update();
            this.updateNavArrows();
        },

        setDaysOfWeekDisabled: function(daysOfWeekDisabled){
            this.daysOfWeekDisabled = daysOfWeekDisabled||[];
            if (!$.isArray(this.daysOfWeekDisabled)) {
                this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
            }
            this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
                return parseInt(d, 10);
            });
            this.update();
            this.updateNavArrows();
        },

        place: function(){
                        if(this.isInline) return;
            var zIndex = parseInt(this.element.parents().filter(function() {
                            return $(this).css('z-index') != 'auto';
                        }).first().css('z-index'))+10;
            var offset = this.component ? this.component.offset() : this.element.offset();
            var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(true);
            this.picker.css({
                top: offset.top + height,
                left: offset.left,
                zIndex: zIndex
            });
        },

        update: function(){
            var date, fromArgs = false;
            if(arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
                date = arguments[0];
                fromArgs = true;
            } else {
                date = this.isInput ? this.element.val() : this.element.data('date') || this.element.find('input').val();
            }

            this.date = DPGlobal.parseDate(date, this.format, this.language);

            if(fromArgs) this.setValue();

            if (this.date < this.startDate) {
                this.viewDate = new Date(this.startDate);
            } else if (this.date > this.endDate) {
                this.viewDate = new Date(this.endDate);
            } else {
                this.viewDate = new Date(this.date);
            }
            this.fill();
        },

        fillDow: function(){
            var dowCnt = this.weekStart,
            html = '<tr>';
            if(this.calendarWeeks){
                var cell = '<th class="cw">&nbsp;</th>';
                html += cell;
                this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
            }
            while (dowCnt < this.weekStart + 7) {
                html += '<th class="dow">'+dates[this.language].daysMin[(dowCnt++)%7]+'</th>';
            }
            html += '</tr>';
            this.picker.find('.datepicker-days thead').append(html);
        },

        fillMonths: function(){
            var html = '',
            i = 0;
            while (i < 12) {
                html += '<span class="month">'+dates[this.language].monthsShort[i++]+'</span>';
            }
            this.picker.find('.datepicker-months td').html(html);
        },

        fill: function() {
            var d = new Date(this.viewDate),
                year = d.getUTCFullYear(),
                month = d.getUTCMonth(),
                startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
                startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity,
                endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
                endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity,
                currentDate = this.date && this.date.valueOf(),
                today = new Date();
            this.picker.find('.datepicker-days thead th.switch')
                        .text(dates[this.language].months[month]+' '+year);
            this.picker.find('tfoot th.today')
                        .text(dates[this.language].today)
                        .toggle(this.todayBtn !== false);
            this.updateNavArrows();
            this.fillMonths();
            var prevMonth = UTCDate(year, month-1, 28,0,0,0,0),
                day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
            prevMonth.setUTCDate(day);
            prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7)%7);
            var nextMonth = new Date(prevMonth);
            nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
            nextMonth = nextMonth.valueOf();
            var html = [];
            var clsName;
            while(prevMonth.valueOf() < nextMonth) {
                if (prevMonth.getUTCDay() == this.weekStart) {
                    html.push('<tr>');
                    if(this.calendarWeeks){
                        // ISO 8601: First week contains first thursday.
                        // ISO also states week starts on Monday, but we can be more abstract here.
                        var
                            // Start of current week: based on weekstart/current date
                            ws = new Date(+prevMonth + (this.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
                            // Thursday of this week
                            th = new Date(+ws + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
                            // First Thursday of year, year from thursday
                            yth = new Date(+(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
                            // Calendar week: ms between thursdays, div ms per day, div 7 days
                            calWeek =  (th - yth) / 864e5 / 7 + 1;
                        html.push('<td class="cw">'+ calWeek +'</td>');

                    }
                }
                clsName = '';
                if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
                    clsName += ' old';
                } else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
                    clsName += ' new';
                }
                // Compare internal UTC date with local today, not UTC today
                if (this.todayHighlight &&
                    prevMonth.getUTCFullYear() == today.getFullYear() &&
                    prevMonth.getUTCMonth() == today.getMonth() &&
                    prevMonth.getUTCDate() == today.getDate()) {
                    clsName += ' today';
                }
                if (currentDate && prevMonth.valueOf() == currentDate) {
                    clsName += ' active';
                }
                if (prevMonth.valueOf() < this.startDate || prevMonth.valueOf() > this.endDate ||
                    $.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
                    clsName += ' disabled';
                }
                html.push('<td class="day'+clsName+'">'+prevMonth.getUTCDate() + '</td>');
                if (prevMonth.getUTCDay() == this.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
            }
            this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
            var currentYear = this.date && this.date.getUTCFullYear();

            var months = this.picker.find('.datepicker-months')
                        .find('th:eq(1)')
                            .text(year)
                            .end()
                        .find('span').removeClass('active');
            if (currentYear && currentYear == year) {
                months.eq(this.date.getUTCMonth()).addClass('active');
            }
            if (year < startYear || year > endYear) {
                months.addClass('disabled');
            }
            if (year == startYear) {
                months.slice(0, startMonth).addClass('disabled');
            }
            if (year == endYear) {
                months.slice(endMonth+1).addClass('disabled');
            }

            html = '';
            year = parseInt(year/10, 10) * 10;
            var yearCont = this.picker.find('.datepicker-years')
                                .find('th:eq(1)')
                                    .text(year + '-' + (year + 9))
                                    .end()
                                .find('td');
            year -= 1;
            for (var i = -1; i < 11; i++) {
                html += '<span class="year'+(i == -1 || i == 10 ? ' old' : '')+(currentYear == year ? ' active' : '')+(year < startYear || year > endYear ? ' disabled' : '')+'">'+year+'</span>';
                year += 1;
            }
            yearCont.html(html);
        },

        updateNavArrows: function() {
            var d = new Date(this.viewDate),
                year = d.getUTCFullYear(),
                month = d.getUTCMonth();
            switch (this.viewMode) {
                case 0:
                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() && month <= this.startDate.getUTCMonth()) {
                        this.picker.find('.prev').css({visibility: 'hidden'});
                    } else {
                        this.picker.find('.prev').css({visibility: 'visible'});
                    }
                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() && month >= this.endDate.getUTCMonth()) {
                        this.picker.find('.next').css({visibility: 'hidden'});
                    } else {
                        this.picker.find('.next').css({visibility: 'visible'});
                    }
                    break;
                case 1:
                case 2:
                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
                        this.picker.find('.prev').css({visibility: 'hidden'});
                    } else {
                        this.picker.find('.prev').css({visibility: 'visible'});
                    }
                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
                        this.picker.find('.next').css({visibility: 'hidden'});
                    } else {
                        this.picker.find('.next').css({visibility: 'visible'});
                    }
                    break;
            }
        },

        click: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target).closest('span, td, th');
            if (target.length == 1) {
                switch(target[0].nodeName.toLowerCase()) {
                    case 'th':
                        switch(target[0].className) {
                            case 'switch':
                                this.showMode(1);
                                break;
                            case 'prev':
                            case 'next':
                                var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
                                switch(this.viewMode){
                                    case 0:
                                        this.viewDate = this.moveMonth(this.viewDate, dir);
                                        break;
                                    case 1:
                                    case 2:
                                        this.viewDate = this.moveYear(this.viewDate, dir);
                                        break;
                                }
                                this.fill();
                                break;
                            case 'today':
                                var date = new Date();
                                date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

                                this.showMode(-2);
                                var which = this.todayBtn == 'linked' ? null : 'view';
                                this._setDate(date, which);
                                break;
                        }
                        break;
                    case 'span':
                        if (!target.is('.disabled')) {
                            this.viewDate.setUTCDate(1);
                            if (target.is('.month')) {
                                var month = target.parent().find('span').index(target);
                                this.viewDate.setUTCMonth(month);
                                this.element.trigger({
                                    type: 'changeMonth',
                                    date: this.viewDate
                                });
                            } else {
                                var year = parseInt(target.text(), 10)||0;
                                this.viewDate.setUTCFullYear(year);
                                this.element.trigger({
                                    type: 'changeYear',
                                    date: this.viewDate
                                });
                            }
                            this.showMode(-1);
                            this.fill();
                        }
                        break;
                    case 'td':
                        if (target.is('.day') && !target.is('.disabled')){
                            var day = parseInt(target.text(), 10)||1;
                            var year = this.viewDate.getUTCFullYear(),
                                month = this.viewDate.getUTCMonth();
                            if (target.is('.old')) {
                                if (month === 0) {
                                    month = 11;
                                    year -= 1;
                                } else {
                                    month -= 1;
                                }
                            } else if (target.is('.new')) {
                                if (month == 11) {
                                    month = 0;
                                    year += 1;
                                } else {
                                    month += 1;
                                }
                            }
                            this._setDate(UTCDate(year, month, day,0,0,0,0));
                        }
                        break;
                }
            }
        },

        _setDate: function(date, which){
            if (!which || which == 'date')
                this.date = date;
            if (!which || which  == 'view')
                this.viewDate = date;
            this.fill();
            this.setValue();
            this.element.trigger({
                type: 'changeDate',
                date: this.date
            });
            var element;
            if (this.isInput) {
                element = this.element;
            } else if (this.component){
                element = this.element.find('input');
            }
            if (element) {
                element.change();
                if (this.autoclose && (!which || which == 'date')) {
                    this.hide();
                }
            }
        },

        moveMonth: function(date, dir){
            if (!dir) return date;
            var new_date = new Date(date.valueOf()),
                day = new_date.getUTCDate(),
                month = new_date.getUTCMonth(),
                mag = Math.abs(dir),
                new_month, test;
            dir = dir > 0 ? 1 : -1;
            if (mag == 1){
                test = dir == -1
                    // If going back one month, make sure month is not current month
                    // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
                    ? function(){ return new_date.getUTCMonth() == month; }
                    // If going forward one month, make sure month is as expected
                    // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
                    : function(){ return new_date.getUTCMonth() != new_month; };
                new_month = month + dir;
                new_date.setUTCMonth(new_month);
                // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
                if (new_month < 0 || new_month > 11)
                    new_month = (new_month + 12) % 12;
            } else {
                // For magnitudes >1, move one month at a time...
                for (var i=0; i<mag; i++)
                    // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
                    new_date = this.moveMonth(new_date, dir);
                // ...then reset the day, keeping it in the new month
                new_month = new_date.getUTCMonth();
                new_date.setUTCDate(day);
                test = function(){ return new_month != new_date.getUTCMonth(); };
            }
            // Common date-resetting loop -- if date is beyond end of month, make it
            // end of month
            while (test()){
                new_date.setUTCDate(--day);
                new_date.setUTCMonth(new_month);
            }
            return new_date;
        },

        moveYear: function(date, dir){
            return this.moveMonth(date, dir*12);
        },

        dateWithinRange: function(date){
            return date >= this.startDate && date <= this.endDate;
        },

        keydown: function(e){
            if (this.picker.is(':not(:visible)')){
                if (e.keyCode == 27) // allow escape to hide and re-show picker
                    this.show();
                return;
            }
            var dateChanged = false,
                dir, day, month,
                newDate, newViewDate;
            switch(e.keyCode){
                case 27: // escape
                    this.hide();
                    e.preventDefault();
                    break;
                case 37: // left
                case 39: // right
                    if (!this.keyboardNavigation) break;
                    dir = e.keyCode == 37 ? -1 : 1;
                    if (e.ctrlKey){
                        newDate = this.moveYear(this.date, dir);
                        newViewDate = this.moveYear(this.viewDate, dir);
                    } else if (e.shiftKey){
                        newDate = this.moveMonth(this.date, dir);
                        newViewDate = this.moveMonth(this.viewDate, dir);
                    } else {
                        newDate = new Date(this.date);
                        newDate.setUTCDate(this.date.getUTCDate() + dir);
                        newViewDate = new Date(this.viewDate);
                        newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir);
                    }
                    if (this.dateWithinRange(newDate)){
                        this.date = newDate;
                        this.viewDate = newViewDate;
                        this.setValue();
                        this.update();
                        e.preventDefault();
                        dateChanged = true;
                    }
                    break;
                case 38: // up
                case 40: // down
                    if (!this.keyboardNavigation) break;
                    dir = e.keyCode == 38 ? -1 : 1;
                    if (e.ctrlKey){
                        newDate = this.moveYear(this.date, dir);
                        newViewDate = this.moveYear(this.viewDate, dir);
                    } else if (e.shiftKey){
                        newDate = this.moveMonth(this.date, dir);
                        newViewDate = this.moveMonth(this.viewDate, dir);
                    } else {
                        newDate = new Date(this.date);
                        newDate.setUTCDate(this.date.getUTCDate() + dir * 7);
                        newViewDate = new Date(this.viewDate);
                        newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir * 7);
                    }
                    if (this.dateWithinRange(newDate)){
                        this.date = newDate;
                        this.viewDate = newViewDate;
                        this.setValue();
                        this.update();
                        e.preventDefault();
                        dateChanged = true;
                    }
                    break;
                case 13: // enter
                    this.hide();
                    e.preventDefault();
                    break;
                case 9: // tab
                    this.hide();
                    break;
            }
            if (dateChanged){
                this.element.trigger({
                    type: 'changeDate',
                    date: this.date
                });
                var element;
                if (this.isInput) {
                    element = this.element;
                } else if (this.component){
                    element = this.element.find('input');
                }
                if (element) {
                    element.change();
                }
            }
        },

        showMode: function(dir) {
            if (dir) {
                this.viewMode = Math.max(0, Math.min(2, this.viewMode + dir));
            }
            /*
                vitalets: fixing bug of very special conditions:
                jquery 1.7.1 + webkit + show inline datepicker in bootstrap popover.
                Method show() does not set display css correctly and datepicker is not shown.
                Changed to .css('display', 'block') solve the problem.
                See https://github.com/vitalets/x-editable/issues/37

                In jquery 1.7.2+ everything works fine.
            */
            //this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
            this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
            this.updateNavArrows();
        }
    };

    $.fn.datepicker = function ( option ) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function () {
            var $this = $(this),
                data = $this.data('datepicker'),
                options = typeof option == 'object' && option;
            if (!data) {
                $this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults,options))));
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }
        });
    };

    $.fn.datepicker.defaults = {
    };
    $.fn.datepicker.Constructor = Datepicker;
    var dates = $.fn.datepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today"
        }
    };

    var DPGlobal = {
        modes: [
            {
                clsName: 'days',
                navFnc: 'Month',
                navStep: 1
            },
            {
                clsName: 'months',
                navFnc: 'FullYear',
                navStep: 1
            },
            {
                clsName: 'years',
                navFnc: 'FullYear',
                navStep: 10
        }],
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        },
        getDaysInMonth: function (year, month) {
            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },
        validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
        nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
        parseFormat: function(format){
            // IE treats \0 as a string end in inputs (truncating the value),
            // so it's a bad format delimiter, anyway
            var separators = format.replace(this.validParts, '\0').split('\0'),
                parts = format.match(this.validParts);
            if (!separators || !separators.length || !parts || parts.length === 0){
                throw new Error("Invalid date format.");
            }
            return {separators: separators, parts: parts};
        },
        parseDate: function(date, format, language) {
            if (date instanceof Date) return date;
            if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
                var part_re = /([\-+]\d+)([dmwy])/,
                    parts = date.match(/([\-+]\d+)([dmwy])/g),
                    part, dir;
                date = new Date();
                for (var i=0; i<parts.length; i++) {
                    part = part_re.exec(parts[i]);
                    dir = parseInt(part[1]);
                    switch(part[2]){
                        case 'd':
                            date.setUTCDate(date.getUTCDate() + dir);
                            break;
                        case 'm':
                            date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
                            break;
                        case 'w':
                            date.setUTCDate(date.getUTCDate() + dir * 7);
                            break;
                        case 'y':
                            date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
                            break;
                    }
                }
                return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
            }
            var parts = date && date.match(this.nonpunctuation) || [],
                date = new Date(),
                parsed = {},
                setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
                setters_map = {
                    yyyy: function(d,v){ return d.setUTCFullYear(v); },
                    yy: function(d,v){ return d.setUTCFullYear(2000+v); },
                    m: function(d,v){
                        v -= 1;
                        while (v<0) v += 12;
                        v %= 12;
                        d.setUTCMonth(v);
                        while (d.getUTCMonth() != v)
                            d.setUTCDate(d.getUTCDate()-1);
                        return d;
                    },
                    d: function(d,v){ return d.setUTCDate(v); }
                },
                val, filtered, part;
            setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
            setters_map['dd'] = setters_map['d'];
            date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            var fparts = format.parts.slice();
            // Remove noop parts
            if (parts.length != fparts.length) {
                fparts = $(fparts).filter(function(i,p){
                    return $.inArray(p, setters_order) !== -1;
                }).toArray();
            }
            // Process remainder
            if (parts.length == fparts.length) {
                for (var i=0, cnt = fparts.length; i < cnt; i++) {
                    val = parseInt(parts[i], 10);
                    part = fparts[i];
                    if (isNaN(val)) {
                        switch(part) {
                            case 'MM':
                                filtered = $(dates[language].months).filter(function(){
                                    var m = this.slice(0, parts[i].length),
                                        p = parts[i].slice(0, m.length);
                                    return m == p;
                                });
                                val = $.inArray(filtered[0], dates[language].months) + 1;
                                break;
                            case 'M':
                                filtered = $(dates[language].monthsShort).filter(function(){
                                    var m = this.slice(0, parts[i].length),
                                        p = parts[i].slice(0, m.length);
                                    return m == p;
                                });
                                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                                break;
                        }
                    }
                    parsed[part] = val;
                }
                for (var i=0, s; i<setters_order.length; i++){
                    s = setters_order[i];
                    if (s in parsed && !isNaN(parsed[s]))
                        setters_map[s](date, parsed[s]);
                }
            }
            return date;
        },
        formatDate: function(date, format, language){
            var val = {
                d: date.getUTCDate(),
                D: dates[language].daysShort[date.getUTCDay()],
                DD: dates[language].days[date.getUTCDay()],
                m: date.getUTCMonth() + 1,
                M: dates[language].monthsShort[date.getUTCMonth()],
                MM: dates[language].months[date.getUTCMonth()],
                yy: date.getUTCFullYear().toString().substring(2),
                yyyy: date.getUTCFullYear()
            };
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
            var date = [],
                seps = $.extend([], format.separators);
            for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                if (seps.length)
                    date.push(seps.shift());
                date.push(val[format.parts[i]]);
            }
            return date.join('');
        },
        headTemplate: '<thead>'+
                            '<tr>'+
                                '<th class="prev"><i class="icon-arrow-left"/></th>'+
                                '<th colspan="5" class="switch"></th>'+
                                '<th class="next"><i class="icon-arrow-right"/></th>'+
                            '</tr>'+
                        '</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'
    };
    DPGlobal.template = '<div class="datepicker">'+
                            '<div class="datepicker-days">'+
                                '<table class=" table-condensed">'+
                                    DPGlobal.headTemplate+
                                    '<tbody></tbody>'+
                                    DPGlobal.footTemplate+
                                '</table>'+
                            '</div>'+
                            '<div class="datepicker-months">'+
                                '<table class="table-condensed">'+
                                    DPGlobal.headTemplate+
                                    DPGlobal.contTemplate+
                                    DPGlobal.footTemplate+
                                '</table>'+
                            '</div>'+
                            '<div class="datepicker-years">'+
                                '<table class="table-condensed">'+
                                    DPGlobal.headTemplate+
                                    DPGlobal.contTemplate+
                                    DPGlobal.footTemplate+
                                '</table>'+
                            '</div>'+
                        '</div>';

    $.fn.datepicker.DPGlobal = DPGlobal;

});

/*! jQuery UI - v1.10.0 - 2013-02-06
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.sortable.js, jquery.ui.datepicker.js
* Copyright (c) 2013 jQuery Foundation and other contributors Licensed MIT */

define('plugins/jquery-ui',['../jquery'], function(jQuery) {
    (function( $, undefined ) {

    var uuid = 0,
        runiqueId = /^ui-id-\d+$/;

    // prevent duplicate loading
    // this is only a problem because we proxy existing functions
    // and we don't want to double proxy them
    $.ui = $.ui || {};
    if ( $.ui.version ) {
        return;
    }

    $.extend( $.ui, {
        version: "1.10.0",

        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    });

    // plugins
    $.fn.extend({
        _focus: $.fn.focus,
        focus: function( delay, fn ) {
            return typeof delay === "number" ?
                this.each(function() {
                    var elem = this;
                    setTimeout(function() {
                        $( elem ).focus();
                        if ( fn ) {
                            fn.call( elem );
                        }
                    }, delay );
                }) :
                this._focus.apply( this, arguments );
        },

        scrollParent: function() {
            var scrollParent;
            if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
                scrollParent = this.parents().filter(function() {
                    return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
                }).eq(0);
            } else {
                scrollParent = this.parents().filter(function() {
                    return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
                }).eq(0);
            }

            return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
        },

        zIndex: function( zIndex ) {
            if ( zIndex !== undefined ) {
                return this.css( "zIndex", zIndex );
            }

            if ( this.length ) {
                var elem = $( this[ 0 ] ), position, value;
                while ( elem.length && elem[ 0 ] !== document ) {
                    // Ignore z-index if position is set to a value where z-index is ignored by the browser
                    // This makes behavior of this function consistent across browsers
                    // WebKit always returns auto if the element is positioned
                    position = elem.css( "position" );
                    if ( position === "absolute" || position === "relative" || position === "fixed" ) {
                        // IE returns 0 when zIndex is not specified
                        // other browsers return a string
                        // we ignore the case of nested elements with an explicit value of 0
                        // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                        value = parseInt( elem.css( "zIndex" ), 10 );
                        if ( !isNaN( value ) && value !== 0 ) {
                            return value;
                        }
                    }
                    elem = elem.parent();
                }
            }

            return 0;
        },

        uniqueId: function() {
            return this.each(function() {
                if ( !this.id ) {
                    this.id = "ui-id-" + (++uuid);
                }
            });
        },

        removeUniqueId: function() {
            return this.each(function() {
                if ( runiqueId.test( this.id ) ) {
                    $( this ).removeAttr( "id" );
                }
            });
        }
    });

    // selectors
    function focusable( element, isTabIndexNotNaN ) {
        var map, mapName, img,
            nodeName = element.nodeName.toLowerCase();
        if ( "area" === nodeName ) {
            map = element.parentNode;
            mapName = map.name;
            if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
                return false;
            }
            img = $( "img[usemap=#" + mapName + "]" )[0];
            return !!img && visible( img );
        }
        return ( /input|select|textarea|button|object/.test( nodeName ) ?
            !element.disabled :
            "a" === nodeName ?
                element.href || isTabIndexNotNaN :
                isTabIndexNotNaN) &&
            // the element and all of its ancestors must be visible
            visible( element );
    }

    function visible( element ) {
        return $.expr.filters.visible( element ) &&
            !$( element ).parents().addBack().filter(function() {
                return $.css( this, "visibility" ) === "hidden";
            }).length;
    }

    $.extend( $.expr[ ":" ], {
        data: $.expr.createPseudo ?
            $.expr.createPseudo(function( dataName ) {
                return function( elem ) {
                    return !!$.data( elem, dataName );
                };
            }) :
            // support: jQuery <1.8
            function( elem, i, match ) {
                return !!$.data( elem, match[ 3 ] );
            },

        focusable: function( element ) {
            return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
        },

        tabbable: function( element ) {
            var tabIndex = $.attr( element, "tabindex" ),
                isTabIndexNaN = isNaN( tabIndex );
            return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
        }
    });

    // support: jQuery <1.8
    if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
        $.each( [ "Width", "Height" ], function( i, name ) {
            var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
                type = name.toLowerCase(),
                orig = {
                    innerWidth: $.fn.innerWidth,
                    innerHeight: $.fn.innerHeight,
                    outerWidth: $.fn.outerWidth,
                    outerHeight: $.fn.outerHeight
                };

            function reduce( elem, size, border, margin ) {
                $.each( side, function() {
                    size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
                    if ( border ) {
                        size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
                    }
                    if ( margin ) {
                        size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
                    }
                });
                return size;
            }

            $.fn[ "inner" + name ] = function( size ) {
                if ( size === undefined ) {
                    return orig[ "inner" + name ].call( this );
                }

                return this.each(function() {
                    $( this ).css( type, reduce( this, size ) + "px" );
                });
            };

            $.fn[ "outer" + name] = function( size, margin ) {
                if ( typeof size !== "number" ) {
                    return orig[ "outer" + name ].call( this, size );
                }

                return this.each(function() {
                    $( this).css( type, reduce( this, size, true, margin ) + "px" );
                });
            };
        });
    }

    // support: jQuery <1.8
    if ( !$.fn.addBack ) {
        $.fn.addBack = function( selector ) {
            return this.add( selector == null ?
                this.prevObject : this.prevObject.filter( selector )
            );
        };
    }

    // support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
    if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
        $.fn.removeData = (function( removeData ) {
            return function( key ) {
                if ( arguments.length ) {
                    return removeData.call( this, $.camelCase( key ) );
                } else {
                    return removeData.call( this );
                }
            };
        })( $.fn.removeData );
    }





    // deprecated
    $.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

    $.support.selectstart = "onselectstart" in document.createElement( "div" );
    $.fn.extend({
        disableSelection: function() {
            return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
                ".ui-disableSelection", function( event ) {
                    event.preventDefault();
                });
        },

        enableSelection: function() {
            return this.unbind( ".ui-disableSelection" );
        }
    });

    $.extend( $.ui, {
        // $.ui.plugin is deprecated.  Use the proxy pattern instead.
        plugin: {
            add: function( module, option, set ) {
                var i,
                    proto = $.ui[ module ].prototype;
                for ( i in set ) {
                    proto.plugins[ i ] = proto.plugins[ i ] || [];
                    proto.plugins[ i ].push( [ option, set[ i ] ] );
                }
            },
            call: function( instance, name, args ) {
                var i,
                    set = instance.plugins[ name ];
                if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
                    return;
                }

                for ( i = 0; i < set.length; i++ ) {
                    if ( instance.options[ set[ i ][ 0 ] ] ) {
                        set[ i ][ 1 ].apply( instance.element, args );
                    }
                }
            }
        },

        // only used by resizable
        hasScroll: function( el, a ) {

            //If overflow is hidden, the element might have extra content, but the user wants to hide it
            if ( $( el ).css( "overflow" ) === "hidden") {
                return false;
            }

            var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
                has = false;

            if ( el[ scroll ] > 0 ) {
                return true;
            }

            // TODO: determine which cases actually cause this to happen
            // if the element doesn't have the scroll set, see if it's possible to
            // set the scroll
            el[ scroll ] = 1;
            has = ( el[ scroll ] > 0 );
            el[ scroll ] = 0;
            return has;
        }
    });

    })( jQuery );
    (function( $, undefined ) {

    var uuid = 0,
        slice = Array.prototype.slice,
        _cleanData = $.cleanData;
    $.cleanData = function( elems ) {
        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            try {
                $( elem ).triggerHandler( "remove" );
            // http://bugs.jquery.com/ticket/8235
            } catch( e ) {}
        }
        _cleanData( elems );
    };

    $.widget = function( name, base, prototype ) {
        var fullName, existingConstructor, constructor, basePrototype,
            // proxiedPrototype allows the provided prototype to remain unmodified
            // so that it can be used as a mixin for multiple widgets (#8876)
            proxiedPrototype = {},
            namespace = name.split( "." )[ 0 ];

        name = name.split( "." )[ 1 ];
        fullName = namespace + "-" + name;

        if ( !prototype ) {
            prototype = base;
            base = $.Widget;
        }

        // create selector for plugin
        $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
            return !!$.data( elem, fullName );
        };

        $[ namespace ] = $[ namespace ] || {};
        existingConstructor = $[ namespace ][ name ];
        constructor = $[ namespace ][ name ] = function( options, element ) {
            // allow instantiation without "new" keyword
            if ( !this._createWidget ) {
                return new constructor( options, element );
            }

            // allow instantiation without initializing for simple inheritance
            // must use "new" keyword (the code above always passes args)
            if ( arguments.length ) {
                this._createWidget( options, element );
            }
        };
        // extend with the existing constructor to carry over any static properties
        $.extend( constructor, existingConstructor, {
            version: prototype.version,
            // copy the object used to create the prototype in case we need to
            // redefine the widget later
            _proto: $.extend( {}, prototype ),
            // track widgets that inherit from this widget in case this widget is
            // redefined after a widget inherits from it
            _childConstructors: []
        });

        basePrototype = new base();
        // we need to make the options hash a property directly on the new instance
        // otherwise we'll modify the options hash on the prototype that we're
        // inheriting from
        basePrototype.options = $.widget.extend( {}, basePrototype.options );
        $.each( prototype, function( prop, value ) {
            if ( !$.isFunction( value ) ) {
                proxiedPrototype[ prop ] = value;
                return;
            }
            proxiedPrototype[ prop ] = (function() {
                var _super = function() {
                        return base.prototype[ prop ].apply( this, arguments );
                    },
                    _superApply = function( args ) {
                        return base.prototype[ prop ].apply( this, args );
                    };
                return function() {
                    var __super = this._super,
                        __superApply = this._superApply,
                        returnValue;

                    this._super = _super;
                    this._superApply = _superApply;

                    returnValue = value.apply( this, arguments );

                    this._super = __super;
                    this._superApply = __superApply;

                    return returnValue;
                };
            })();
        });
        constructor.prototype = $.widget.extend( basePrototype, {
            // TODO: remove support for widgetEventPrefix
            // always use the name + a colon as the prefix, e.g., draggable:start
            // don't prefix for widgets that aren't DOM-based
            widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        });

        // If this widget is being redefined then we need to find all widgets that
        // are inheriting from it and redefine all of them so that they inherit from
        // the new version of this widget. We're essentially trying to replace one
        // level in the prototype chain.
        if ( existingConstructor ) {
            $.each( existingConstructor._childConstructors, function( i, child ) {
                var childPrototype = child.prototype;

                // redefine the child widget using the same prototype that was
                // originally used, but inherit from the new version of the base
                $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
            });
            // remove the list of existing child constructors from the old constructor
            // so the old child constructors can be garbage collected
            delete existingConstructor._childConstructors;
        } else {
            base._childConstructors.push( constructor );
        }

        $.widget.bridge( name, constructor );
    };

    $.widget.extend = function( target ) {
        var input = slice.call( arguments, 1 ),
            inputIndex = 0,
            inputLength = input.length,
            key,
            value;
        for ( ; inputIndex < inputLength; inputIndex++ ) {
            for ( key in input[ inputIndex ] ) {
                value = input[ inputIndex ][ key ];
                if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
                    // Clone objects
                    if ( $.isPlainObject( value ) ) {
                        target[ key ] = $.isPlainObject( target[ key ] ) ?
                            $.widget.extend( {}, target[ key ], value ) :
                            // Don't extend strings, arrays, etc. with objects
                            $.widget.extend( {}, value );
                    // Copy everything else by reference
                    } else {
                        target[ key ] = value;
                    }
                }
            }
        }
        return target;
    };

    $.widget.bridge = function( name, object ) {
        var fullName = object.prototype.widgetFullName || name;
        $.fn[ name ] = function( options ) {
            var isMethodCall = typeof options === "string",
                args = slice.call( arguments, 1 ),
                returnValue = this;

            // allow multiple hashes to be passed on init
            options = !isMethodCall && args.length ?
                $.widget.extend.apply( null, [ options ].concat(args) ) :
                options;

            if ( isMethodCall ) {
                this.each(function() {
                    var methodValue,
                        instance = $.data( this, fullName );
                    if ( !instance ) {
                        return $.error( "cannot call methods on " + name + " prior to initialization; " +
                            "attempted to call method '" + options + "'" );
                    }
                    if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
                        return $.error( "no such method '" + options + "' for " + name + " widget instance" );
                    }
                    methodValue = instance[ options ].apply( instance, args );
                    if ( methodValue !== instance && methodValue !== undefined ) {
                        returnValue = methodValue && methodValue.jquery ?
                            returnValue.pushStack( methodValue.get() ) :
                            methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function() {
                    var instance = $.data( this, fullName );
                    if ( instance ) {
                        instance.option( options || {} )._init();
                    } else {
                        $.data( this, fullName, new object( options, this ) );
                    }
                });
            }

            return returnValue;
        };
    };

    $.Widget = function( /* options, element */ ) {};
    $.Widget._childConstructors = [];

    $.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: false,

            // callbacks
            create: null
        },
        _createWidget: function( options, element ) {
            element = $( element || this.defaultElement || this )[ 0 ];
            this.element = $( element );
            this.uuid = uuid++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.options = $.widget.extend( {},
                this.options,
                this._getCreateOptions(),
                options );

            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();

            if ( element !== this ) {
                $.data( element, this.widgetFullName, this );
                this._on( true, this.element, {
                    remove: function( event ) {
                        if ( event.target === element ) {
                            this.destroy();
                        }
                    }
                });
                this.document = $( element.style ?
                    // element within the document
                    element.ownerDocument :
                    // element is window or document
                    element.document || element );
                this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
            }

            this._create();
            this._trigger( "create", null, this._getCreateEventData() );
            this._init();
        },
        _getCreateOptions: $.noop,
        _getCreateEventData: $.noop,
        _create: $.noop,
        _init: $.noop,

        destroy: function() {
            this._destroy();
            // we can probably remove the unbind calls in 2.0
            // all event bindings should go through this._on()
            this.element
                .unbind( this.eventNamespace )
                // 1.9 BC for #7810
                // TODO remove dual storage
                .removeData( this.widgetName )
                .removeData( this.widgetFullName )
                // support: jquery <1.6.3
                // http://bugs.jquery.com/ticket/9413
                .removeData( $.camelCase( this.widgetFullName ) );
            this.widget()
                .unbind( this.eventNamespace )
                .removeAttr( "aria-disabled" )
                .removeClass(
                    this.widgetFullName + "-disabled " +
                    "ui-state-disabled" );

            // clean up events and states
            this.bindings.unbind( this.eventNamespace );
            this.hoverable.removeClass( "ui-state-hover" );
            this.focusable.removeClass( "ui-state-focus" );
        },
        _destroy: $.noop,

        widget: function() {
            return this.element;
        },

        option: function( key, value ) {
            var options = key,
                parts,
                curOption,
                i;

            if ( arguments.length === 0 ) {
                // don't return a reference to the internal hash
                return $.widget.extend( {}, this.options );
            }

            if ( typeof key === "string" ) {
                // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                options = {};
                parts = key.split( "." );
                key = parts.shift();
                if ( parts.length ) {
                    curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
                    for ( i = 0; i < parts.length - 1; i++ ) {
                        curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                        curOption = curOption[ parts[ i ] ];
                    }
                    key = parts.pop();
                    if ( value === undefined ) {
                        return curOption[ key ] === undefined ? null : curOption[ key ];
                    }
                    curOption[ key ] = value;
                } else {
                    if ( value === undefined ) {
                        return this.options[ key ] === undefined ? null : this.options[ key ];
                    }
                    options[ key ] = value;
                }
            }

            this._setOptions( options );

            return this;
        },
        _setOptions: function( options ) {
            var key;

            for ( key in options ) {
                this._setOption( key, options[ key ] );
            }

            return this;
        },
        _setOption: function( key, value ) {
            this.options[ key ] = value;

            if ( key === "disabled" ) {
                this.widget()
                    .toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
                    .attr( "aria-disabled", value );
                this.hoverable.removeClass( "ui-state-hover" );
                this.focusable.removeClass( "ui-state-focus" );
            }

            return this;
        },

        enable: function() {
            return this._setOption( "disabled", false );
        },
        disable: function() {
            return this._setOption( "disabled", true );
        },

        _on: function( suppressDisabledCheck, element, handlers ) {
            var delegateElement,
                instance = this;

            // no suppressDisabledCheck flag, shuffle arguments
            if ( typeof suppressDisabledCheck !== "boolean" ) {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false;
            }

            // no element argument, shuffle and use this.element
            if ( !handlers ) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget();
            } else {
                // accept selectors, DOM elements
                element = delegateElement = $( element );
                this.bindings = this.bindings.add( element );
            }

            $.each( handlers, function( event, handler ) {
                function handlerProxy() {
                    // allow widgets to customize the disabled handling
                    // - disabled as an array instead of boolean
                    // - disabled class as method for disabling individual parts
                    if ( !suppressDisabledCheck &&
                            ( instance.options.disabled === true ||
                                $( this ).hasClass( "ui-state-disabled" ) ) ) {
                        return;
                    }
                    return ( typeof handler === "string" ? instance[ handler ] : handler )
                        .apply( instance, arguments );
                }

                // copy the guid so direct unbinding works
                if ( typeof handler !== "string" ) {
                    handlerProxy.guid = handler.guid =
                        handler.guid || handlerProxy.guid || $.guid++;
                }

                var match = event.match( /^(\w+)\s*(.*)$/ ),
                    eventName = match[1] + instance.eventNamespace,
                    selector = match[2];
                if ( selector ) {
                    delegateElement.delegate( selector, eventName, handlerProxy );
                } else {
                    element.bind( eventName, handlerProxy );
                }
            });
        },

        _off: function( element, eventName ) {
            eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
            element.unbind( eventName ).undelegate( eventName );
        },

        _delay: function( handler, delay ) {
            function handlerProxy() {
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                    .apply( instance, arguments );
            }
            var instance = this;
            return setTimeout( handlerProxy, delay || 0 );
        },

        _hoverable: function( element ) {
            this.hoverable = this.hoverable.add( element );
            this._on( element, {
                mouseenter: function( event ) {
                    $( event.currentTarget ).addClass( "ui-state-hover" );
                },
                mouseleave: function( event ) {
                    $( event.currentTarget ).removeClass( "ui-state-hover" );
                }
            });
        },

        _focusable: function( element ) {
            this.focusable = this.focusable.add( element );
            this._on( element, {
                focusin: function( event ) {
                    $( event.currentTarget ).addClass( "ui-state-focus" );
                },
                focusout: function( event ) {
                    $( event.currentTarget ).removeClass( "ui-state-focus" );
                }
            });
        },

        _trigger: function( type, event, data ) {
            var prop, orig,
                callback = this.options[ type ];

            data = data || {};
            event = $.Event( event );
            event.type = ( type === this.widgetEventPrefix ?
                type :
                this.widgetEventPrefix + type ).toLowerCase();
            // the original event may come from any element
            // so we need to reset the target on the new event
            event.target = this.element[ 0 ];

            // copy original event properties over to the new event
            orig = event.originalEvent;
            if ( orig ) {
                for ( prop in orig ) {
                    if ( !( prop in event ) ) {
                        event[ prop ] = orig[ prop ];
                    }
                }
            }

            this.element.trigger( event, data );
            return !( $.isFunction( callback ) &&
                callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
                event.isDefaultPrevented() );
        }
    };

    $.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
        $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
            if ( typeof options === "string" ) {
                options = { effect: options };
            }
            var hasOptions,
                effectName = !options ?
                    method :
                    options === true || typeof options === "number" ?
                        defaultEffect :
                        options.effect || defaultEffect;
            options = options || {};
            if ( typeof options === "number" ) {
                options = { duration: options };
            }
            hasOptions = !$.isEmptyObject( options );
            options.complete = callback;
            if ( options.delay ) {
                element.delay( options.delay );
            }
            if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
                element[ method ]( options );
            } else if ( effectName !== method && element[ effectName ] ) {
                element[ effectName ]( options.duration, options.easing, callback );
            } else {
                element.queue(function( next ) {
                    $( this )[ method ]();
                    if ( callback ) {
                        callback.call( element[ 0 ] );
                    }
                    next();
                });
            }
        };
    });

    })( jQuery );
    (function( $, undefined ) {

    var mouseHandled = false;
    $( document ).mouseup( function() {
        mouseHandled = false;
    });

    $.widget("ui.mouse", {
        version: "1.10.0",
        options: {
            cancel: "input,textarea,button,select,option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function() {
            var that = this;

            this.element
                .bind("mousedown."+this.widgetName, function(event) {
                    return that._mouseDown(event);
                })
                .bind("click."+this.widgetName, function(event) {
                    if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                        $.removeData(event.target, that.widgetName + ".preventClickEvent");
                        event.stopImmediatePropagation();
                        return false;
                    }
                });

            this.started = false;
        },

        // TODO: make sure destroying one instance of mouse doesn't mess with
        // other instances of mouse
        _mouseDestroy: function() {
            this.element.unbind("."+this.widgetName);
            if ( this._mouseMoveDelegate ) {
                $(document)
                    .unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
                    .unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
            }
        },

        _mouseDown: function(event) {
            // don't let more than one widget handle mouseStart
            if( mouseHandled ) { return; }

            // we may have missed mouseup (out of window)
            (this._mouseStarted && this._mouseUp(event));

            this._mouseDownEvent = event;

            var that = this,
                btnIsLeft = (event.which === 1),
                // event.target.nodeName works around a bug in IE 8 with
                // disabled inputs (#7620)
                elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
            if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
                return true;
            }

            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet) {
                this._mouseDelayTimer = setTimeout(function() {
                    that.mouseDelayMet = true;
                }, this.options.delay);
            }

            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = (this._mouseStart(event) !== false);
                if (!this._mouseStarted) {
                    event.preventDefault();
                    return true;
                }
            }

            // Click event may never have fired (Gecko & Opera)
            if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
                $.removeData(event.target, this.widgetName + ".preventClickEvent");
            }

            // these delegates are required to keep context
            this._mouseMoveDelegate = function(event) {
                return that._mouseMove(event);
            };
            this._mouseUpDelegate = function(event) {
                return that._mouseUp(event);
            };
            $(document)
                .bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
                .bind("mouseup."+this.widgetName, this._mouseUpDelegate);

            event.preventDefault();

            mouseHandled = true;
            return true;
        },

        _mouseMove: function(event) {
            // IE mouseup check - mouseup happened when mouse was out of window
            if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
                return this._mouseUp(event);
            }

            if (this._mouseStarted) {
                this._mouseDrag(event);
                return event.preventDefault();
            }

            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted =
                    (this._mouseStart(this._mouseDownEvent, event) !== false);
                (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
            }

            return !this._mouseStarted;
        },

        _mouseUp: function(event) {
            $(document)
                .unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
                .unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

            if (this._mouseStarted) {
                this._mouseStarted = false;

                if (event.target === this._mouseDownEvent.target) {
                    $.data(event.target, this.widgetName + ".preventClickEvent", true);
                }

                this._mouseStop(event);
            }

            return false;
        },

        _mouseDistanceMet: function(event) {
            return (Math.max(
                    Math.abs(this._mouseDownEvent.pageX - event.pageX),
                    Math.abs(this._mouseDownEvent.pageY - event.pageY)
                ) >= this.options.distance
            );
        },

        _mouseDelayMet: function(/* event */) {
            return this.mouseDelayMet;
        },

        // These are placeholder methods, to be overriden by extending plugin
        _mouseStart: function(/* event */) {},
        _mouseDrag: function(/* event */) {},
        _mouseStop: function(/* event */) {},
        _mouseCapture: function(/* event */) { return true; }
    });

    })(jQuery);
    (function( $, undefined ) {

    /*jshint loopfunc: true */

    function isOverAxis( x, reference, size ) {
        return ( x > reference ) && ( x < ( reference + size ) );
    }

    $.widget("ui.sortable", $.ui.mouse, {
        version: "1.10.0",
        widgetEventPrefix: "sort",
        ready: false,
        options: {
            appendTo: "parent",
            axis: false,
            connectWith: false,
            containment: false,
            cursor: "auto",
            cursorAt: false,
            dropOnEmpty: true,
            forcePlaceholderSize: false,
            forceHelperSize: false,
            grid: false,
            handle: false,
            helper: "original",
            items: "> *",
            opacity: false,
            placeholder: false,
            revert: false,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1000,

            // callbacks
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
        },
        _create: function() {

            var o = this.options;
            this.containerCache = {};
            this.element.addClass("ui-sortable");

            //Get the items
            this.refresh();

            //Let's determine if the items are being displayed horizontally
            this.floating = this.items.length ? o.axis === "x" || (/left|right/).test(this.items[0].item.css("float")) || (/inline|table-cell/).test(this.items[0].item.css("display")) : false;

            //Let's determine the parent's offset
            this.offset = this.element.offset();

            //Initialize mouse events for interaction
            this._mouseInit();

            //We're ready to go
            this.ready = true;

        },

        _destroy: function() {
            this.element
                .removeClass("ui-sortable ui-sortable-disabled");
            this._mouseDestroy();

            for ( var i = this.items.length - 1; i >= 0; i-- ) {
                this.items[i].item.removeData(this.widgetName + "-item");
            }

            return this;
        },

        _setOption: function(key, value){
            if ( key === "disabled" ) {
                this.options[ key ] = value;

                this.widget().toggleClass( "ui-sortable-disabled", !!value );
            } else {
                // Don't call widget base _setOption for disable as it adds ui-state-disabled class
                $.Widget.prototype._setOption.apply(this, arguments);
            }
        },

        _mouseCapture: function(event, overrideHandle) {
            var currentItem = null,
                validHandle = false,
                that = this;

            if (this.reverting) {
                return false;
            }

            if(this.options.disabled || this.options.type === "static") {
                return false;
            }

            //We have to refresh the items data once first
            this._refreshItems(event);

            //Find out if the clicked node (or one of its parents) is a actual item in this.items
            $(event.target).parents().each(function() {
                if($.data(this, that.widgetName + "-item") === that) {
                    currentItem = $(this);
                    return false;
                }
            });
            if($.data(event.target, that.widgetName + "-item") === that) {
                currentItem = $(event.target);
            }

            if(!currentItem) {
                return false;
            }
            if(this.options.handle && !overrideHandle) {
                $(this.options.handle, currentItem).find("*").addBack().each(function() {
                    if(this === event.target) {
                        validHandle = true;
                    }
                });
                if(!validHandle) {
                    return false;
                }
            }

            this.currentItem = currentItem;
            this._removeCurrentsFromItems();
            return true;

        },

        _mouseStart: function(event, overrideHandle, noActivation) {

            var i,
                o = this.options;

            this.currentContainer = this;

            //We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
            this.refreshPositions();

            //Create and append the visible helper
            this.helper = this._createHelper(event);

            //Cache the helper size
            this._cacheHelperProportions();

            /*
             * - Position generation -
             * This block generates everything position related - it's the core of draggables.
             */

            //Cache the margins of the original element
            this._cacheMargins();

            //Get the next scrolling parent
            this.scrollParent = this.helper.scrollParent();

            //The element's absolute position on the page minus margins
            this.offset = this.currentItem.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };

            $.extend(this.offset, {
                click: { //Where the click happened, relative to the element
                    left: event.pageX - this.offset.left,
                    top: event.pageY - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
            });

            // Only after we got the offset, we can change the helper's position to absolute
            // TODO: Still need to figure out a way to make relative sorting possible
            this.helper.css("position", "absolute");
            this.cssPosition = this.helper.css("position");

            //Generate the original position
            this.originalPosition = this._generatePosition(event);
            this.originalPageX = event.pageX;
            this.originalPageY = event.pageY;

            //Adjust the mouse offset relative to the helper if "cursorAt" is supplied
            (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

            //Cache the former DOM position
            this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

            //If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
            if(this.helper[0] !== this.currentItem[0]) {
                this.currentItem.hide();
            }

            //Create the placeholder
            this._createPlaceholder();

            //Set a containment if given in the options
            if(o.containment) {
                this._setContainment();
            }

            if(o.cursor) { // cursor option
                if ($("body").css("cursor")) {
                    this._storedCursor = $("body").css("cursor");
                }
                $("body").css("cursor", o.cursor);
            }

            if(o.opacity) { // opacity option
                if (this.helper.css("opacity")) {
                    this._storedOpacity = this.helper.css("opacity");
                }
                this.helper.css("opacity", o.opacity);
            }

            if(o.zIndex) { // zIndex option
                if (this.helper.css("zIndex")) {
                    this._storedZIndex = this.helper.css("zIndex");
                }
                this.helper.css("zIndex", o.zIndex);
            }

            //Prepare scrolling
            if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {
                this.overflowOffset = this.scrollParent.offset();
            }

            //Call callbacks
            this._trigger("start", event, this._uiHash());

            //Recache the helper size
            if(!this._preserveHelperProportions) {
                this._cacheHelperProportions();
            }


            //Post "activate" events to possible containers
            if( !noActivation ) {
                for ( i = this.containers.length - 1; i >= 0; i-- ) {
                    this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
                }
            }

            //Prepare possible droppables
            if($.ui.ddmanager) {
                $.ui.ddmanager.current = this;
            }

            if ($.ui.ddmanager && !o.dropBehaviour) {
                $.ui.ddmanager.prepareOffsets(this, event);
            }

            this.dragging = true;

            this.helper.addClass("ui-sortable-helper");
            this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
            return true;

        },

        _mouseDrag: function(event) {
            var i, item, itemElement, intersection,
                o = this.options,
                scrolled = false;

            //Compute the helpers position
            this.position = this._generatePosition(event);
            this.positionAbs = this._convertPositionTo("absolute");

            if (!this.lastPositionAbs) {
                this.lastPositionAbs = this.positionAbs;
            }

            //Do scrolling
            if(this.options.scroll) {
                if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {

                    if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
                        this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
                    } else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
                        this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
                    }

                    if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
                        this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
                    } else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
                        this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
                    }

                } else {

                    if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
                    } else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
                    }

                    if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
                    } else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
                        scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
                    }

                }

                if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
                    $.ui.ddmanager.prepareOffsets(this, event);
                }
            }

            //Regenerate the absolute position used for position checks
            this.positionAbs = this._convertPositionTo("absolute");

            //Set the helper position
            if(!this.options.axis || this.options.axis !== "y") {
                this.helper[0].style.left = this.position.left+"px";
            }
            if(!this.options.axis || this.options.axis !== "x") {
                this.helper[0].style.top = this.position.top+"px";
            }

            //Rearrange
            for (i = this.items.length - 1; i >= 0; i--) {

                //Cache variables and intersection, continue if no intersection
                item = this.items[i];
                itemElement = item.item[0];
                intersection = this._intersectsWithPointer(item);
                if (!intersection) {
                    continue;
                }

                // Only put the placeholder inside the current Container, skip all
                // items form other containers. This works because when moving
                // an item from one container to another the
                // currentContainer is switched before the placeholder is moved.
                //
                // Without this moving items in "sub-sortables" can cause the placeholder to jitter
                // beetween the outer and inner container.
                if (item.instance !== this.currentContainer) {
                    continue;
                }

                // cannot intersect with itself
                // no useless actions that have been done before
                // no action if the item moved is the parent of the item checked
                if (itemElement !== this.currentItem[0] &&
                    this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
                    !$.contains(this.placeholder[0], itemElement) &&
                    (this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
                ) {

                    this.direction = intersection === 1 ? "down" : "up";

                    if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
                        this._rearrange(event, item);
                    } else {
                        break;
                    }

                    this._trigger("change", event, this._uiHash());
                    break;
                }
            }

            //Post events to containers
            this._contactContainers(event);

            //Interconnect with droppables
            if($.ui.ddmanager) {
                $.ui.ddmanager.drag(this, event);
            }

            //Call callbacks
            this._trigger("sort", event, this._uiHash());

            this.lastPositionAbs = this.positionAbs;
            return false;

        },

        _mouseStop: function(event, noPropagation) {

            if(!event) {
                return;
            }

            //If we are using droppables, inform the manager about the drop
            if ($.ui.ddmanager && !this.options.dropBehaviour) {
                $.ui.ddmanager.drop(this, event);
            }

            if(this.options.revert) {
                var that = this,
                    cur = this.placeholder.offset();

                this.reverting = true;

                $(this.helper).animate({
                    left: cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft),
                    top: cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop)
                }, parseInt(this.options.revert, 10) || 500, function() {
                    that._clear(event);
                });
            } else {
                this._clear(event, noPropagation);
            }

            return false;

        },

        cancel: function() {

            if(this.dragging) {

                this._mouseUp({ target: null });

                if(this.options.helper === "original") {
                    this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
                } else {
                    this.currentItem.show();
                }

                //Post deactivating events to containers
                for (var i = this.containers.length - 1; i >= 0; i--){
                    this.containers[i]._trigger("deactivate", null, this._uiHash(this));
                    if(this.containers[i].containerCache.over) {
                        this.containers[i]._trigger("out", null, this._uiHash(this));
                        this.containers[i].containerCache.over = 0;
                    }
                }

            }

            if (this.placeholder) {
                //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
                if(this.placeholder[0].parentNode) {
                    this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
                }
                if(this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
                    this.helper.remove();
                }

                $.extend(this, {
                    helper: null,
                    dragging: false,
                    reverting: false,
                    _noFinalSort: null
                });

                if(this.domPosition.prev) {
                    $(this.domPosition.prev).after(this.currentItem);
                } else {
                    $(this.domPosition.parent).prepend(this.currentItem);
                }
            }

            return this;

        },

        serialize: function(o) {

            var items = this._getItemsAsjQuery(o && o.connected),
                str = [];
            o = o || {};

            $(items).each(function() {
                var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
                if (res) {
                    str.push((o.key || res[1]+"[]")+"="+(o.key && o.expression ? res[1] : res[2]));
                }
            });

            if(!str.length && o.key) {
                str.push(o.key + "=");
            }

            return str.join("&");

        },

        toArray: function(o) {

            var items = this._getItemsAsjQuery(o && o.connected),
                ret = [];

            o = o || {};

            items.each(function() { ret.push($(o.item || this).attr(o.attribute || "id") || ""); });
            return ret;

        },

        /* Be careful with the following core functions */
        _intersectsWith: function(item) {

            var x1 = this.positionAbs.left,
                x2 = x1 + this.helperProportions.width,
                y1 = this.positionAbs.top,
                y2 = y1 + this.helperProportions.height,
                l = item.left,
                r = l + item.width,
                t = item.top,
                b = t + item.height,
                dyClick = this.offset.click.top,
                dxClick = this.offset.click.left,
                isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

            if ( this.options.tolerance === "pointer" ||
                this.options.forcePointerForContainers ||
                (this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
            ) {
                return isOverElement;
            } else {

                return (l < x1 + (this.helperProportions.width / 2) && // Right Half
                    x2 - (this.helperProportions.width / 2) < r && // Left Half
                    t < y1 + (this.helperProportions.height / 2) && // Bottom Half
                    y2 - (this.helperProportions.height / 2) < b ); // Top Half

            }
        },

        _intersectsWithPointer: function(item) {

            var isOverElementHeight = (this.options.axis === "x") || isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
                isOverElementWidth = (this.options.axis === "y") || isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
                isOverElement = isOverElementHeight && isOverElementWidth,
                verticalDirection = this._getDragVerticalDirection(),
                horizontalDirection = this._getDragHorizontalDirection();

            if (!isOverElement) {
                return false;
            }

            return this.floating ?
                ( ((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1 )
                : ( verticalDirection && (verticalDirection === "down" ? 2 : 1) );

        },

        _intersectsWithSides: function(item) {

            var isOverBottomHalf = isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
                isOverRightHalf = isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
                verticalDirection = this._getDragVerticalDirection(),
                horizontalDirection = this._getDragHorizontalDirection();

            if (this.floating && horizontalDirection) {
                return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
            } else {
                return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
            }

        },

        _getDragVerticalDirection: function() {
            var delta = this.positionAbs.top - this.lastPositionAbs.top;
            return delta !== 0 && (delta > 0 ? "down" : "up");
        },

        _getDragHorizontalDirection: function() {
            var delta = this.positionAbs.left - this.lastPositionAbs.left;
            return delta !== 0 && (delta > 0 ? "right" : "left");
        },

        refresh: function(event) {
            this._refreshItems(event);
            this.refreshPositions();
            return this;
        },

        _connectWith: function() {
            var options = this.options;
            return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
        },

        _getItemsAsjQuery: function(connected) {

            var i, j, cur, inst,
                items = [],
                queries = [],
                connectWith = this._connectWith();

            if(connectWith && connected) {
                for (i = connectWith.length - 1; i >= 0; i--){
                    cur = $(connectWith[i]);
                    for ( j = cur.length - 1; j >= 0; j--){
                        inst = $.data(cur[j], this.widgetFullName);
                        if(inst && inst !== this && !inst.options.disabled) {
                            queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
                        }
                    }
                }
            }

            queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

            for (i = queries.length - 1; i >= 0; i--){
                queries[i][0].each(function() {
                    items.push(this);
                });
            }

            return $(items);

        },

        _removeCurrentsFromItems: function() {

            var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

            this.items = $.grep(this.items, function (item) {
                for (var j=0; j < list.length; j++) {
                    if(list[j] === item.item[0]) {
                        return false;
                    }
                }
                return true;
            });

        },

        _refreshItems: function(event) {

            this.items = [];
            this.containers = [this];

            var i, j, cur, inst, targetData, _queries, item, queriesLength,
                items = this.items,
                queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
                connectWith = this._connectWith();

            if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
                for (i = connectWith.length - 1; i >= 0; i--){
                    cur = $(connectWith[i]);
                    for (j = cur.length - 1; j >= 0; j--){
                        inst = $.data(cur[j], this.widgetFullName);
                        if(inst && inst !== this && !inst.options.disabled) {
                            queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
                            this.containers.push(inst);
                        }
                    }
                }
            }

            for (i = queries.length - 1; i >= 0; i--) {
                targetData = queries[i][1];
                _queries = queries[i][0];

                for (j=0, queriesLength = _queries.length; j < queriesLength; j++) {
                    item = $(_queries[j]);

                    item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

                    items.push({
                        item: item,
                        instance: targetData,
                        width: 0, height: 0,
                        left: 0, top: 0
                    });
                }
            }

        },

        refreshPositions: function(fast) {

            //This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
            if(this.offsetParent && this.helper) {
                this.offset.parent = this._getParentOffset();
            }

            var i, item, t, p;

            for (i = this.items.length - 1; i >= 0; i--){
                item = this.items[i];

                //We ignore calculating positions of all connected containers when we're not over them
                if(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
                    continue;
                }

                t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

                if (!fast) {
                    item.width = t.outerWidth();
                    item.height = t.outerHeight();
                }

                p = t.offset();
                item.left = p.left;
                item.top = p.top;
            }

            if(this.options.custom && this.options.custom.refreshContainers) {
                this.options.custom.refreshContainers.call(this);
            } else {
                for (i = this.containers.length - 1; i >= 0; i--){
                    p = this.containers[i].element.offset();
                    this.containers[i].containerCache.left = p.left;
                    this.containers[i].containerCache.top = p.top;
                    this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
                    this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
                }
            }

            return this;
        },

        _createPlaceholder: function(that) {
            that = that || this;
            var className,
                o = that.options;

            if(!o.placeholder || o.placeholder.constructor === String) {
                className = o.placeholder;
                o.placeholder = {
                    element: function() {

                        var el = $(document.createElement(that.currentItem[0].nodeName))
                            .addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
                            .removeClass("ui-sortable-helper")[0];

                        if(!className) {
                            el.style.visibility = "hidden";
                        }

                        return el;
                    },
                    update: function(container, p) {

                        // 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
                        // 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
                        if(className && !o.forcePlaceholderSize) {
                            return;
                        }

                        //If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
                        if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop")||0, 10) - parseInt(that.currentItem.css("paddingBottom")||0, 10)); }
                        if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft")||0, 10) - parseInt(that.currentItem.css("paddingRight")||0, 10)); }
                    }
                };
            }

            //Create the placeholder
            that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

            //Append it after the actual current item
            that.currentItem.after(that.placeholder);

            //Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
            o.placeholder.update(that, that.placeholder);

        },

        _contactContainers: function(event) {
            var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, base, cur, nearBottom,
                innermostContainer = null,
                innermostIndex = null;

            // get innermost container that intersects with item
            for (i = this.containers.length - 1; i >= 0; i--) {

                // never consider a container that's located within the item itself
                if($.contains(this.currentItem[0], this.containers[i].element[0])) {
                    continue;
                }

                if(this._intersectsWith(this.containers[i].containerCache)) {

                    // if we've already found a container and it's more "inner" than this, then continue
                    if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
                        continue;
                    }

                    innermostContainer = this.containers[i];
                    innermostIndex = i;

                } else {
                    // container doesn't intersect. trigger "out" event if necessary
                    if(this.containers[i].containerCache.over) {
                        this.containers[i]._trigger("out", event, this._uiHash(this));
                        this.containers[i].containerCache.over = 0;
                    }
                }

            }

            // if no intersecting containers found, return
            if(!innermostContainer) {
                return;
            }

            // move the item into the container if it's not there already
            if(this.containers.length === 1) {
                this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                this.containers[innermostIndex].containerCache.over = 1;
            } else {

                //When entering a new container, we will find the item with the least distance and append our item near it
                dist = 10000;
                itemWithLeastDistance = null;
                posProperty = this.containers[innermostIndex].floating ? "left" : "top";
                sizeProperty = this.containers[innermostIndex].floating ? "width" : "height";
                base = this.positionAbs[posProperty] + this.offset.click[posProperty];
                for (j = this.items.length - 1; j >= 0; j--) {
                    if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
                        continue;
                    }
                    if(this.items[j].item[0] === this.currentItem[0]) {
                        continue;
                    }
                    cur = this.items[j].item.offset()[posProperty];
                    nearBottom = false;
                    if(Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)){
                        nearBottom = true;
                        cur += this.items[j][sizeProperty];
                    }

                    if(Math.abs(cur - base) < dist) {
                        dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j];
                        this.direction = nearBottom ? "up": "down";
                    }
                }

                //Check if dropOnEmpty is enabled
                if(!itemWithLeastDistance && !this.options.dropOnEmpty) {
                    return;
                }

                this.currentContainer = this.containers[innermostIndex];
                itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
                this._trigger("change", event, this._uiHash());
                this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));

                //Update the placeholder
                this.options.placeholder.update(this.currentContainer, this.placeholder);

                this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                this.containers[innermostIndex].containerCache.over = 1;
            }


        },

        _createHelper: function(event) {

            var o = this.options,
                helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

            //Add the helper to the DOM if that didn't happen already
            if(!helper.parents("body").length) {
                $(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
            }

            if(helper[0] === this.currentItem[0]) {
                this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
            }

            if(!helper[0].style.width || o.forceHelperSize) {
                helper.width(this.currentItem.width());
            }
            if(!helper[0].style.height || o.forceHelperSize) {
                helper.height(this.currentItem.height());
            }

            return helper;

        },

        _adjustOffsetFromHelper: function(obj) {
            if (typeof obj === "string") {
                obj = obj.split(" ");
            }
            if ($.isArray(obj)) {
                obj = {left: +obj[0], top: +obj[1] || 0};
            }
            if ("left" in obj) {
                this.offset.click.left = obj.left + this.margins.left;
            }
            if ("right" in obj) {
                this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
            }
            if ("top" in obj) {
                this.offset.click.top = obj.top + this.margins.top;
            }
            if ("bottom" in obj) {
                this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
            }
        },

        _getParentOffset: function() {


            //Get the offsetParent and cache its position
            this.offsetParent = this.helper.offsetParent();
            var po = this.offsetParent.offset();

            // This is a special case where we need to modify a offset calculated on start, since the following happened:
            // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
            // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
            //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
            if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
                po.left += this.scrollParent.scrollLeft();
                po.top += this.scrollParent.scrollTop();
            }

            // This needs to be actually done for all browsers, since pageX/pageY includes this information
            // with an ugly IE fix
            if( this.offsetParent[0] === document.body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
                po = { top: 0, left: 0 };
            }

            return {
                top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
                left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
            };

        },

        _getRelativeOffset: function() {

            if(this.cssPosition === "relative") {
                var p = this.currentItem.position();
                return {
                    top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
                    left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
                };
            } else {
                return { top: 0, left: 0 };
            }

        },

        _cacheMargins: function() {
            this.margins = {
                left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
                top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
            };
        },

        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: this.helper.outerWidth(),
                height: this.helper.outerHeight()
            };
        },

        _setContainment: function() {

            var ce, co, over,
                o = this.options;
            if(o.containment === "parent") {
                o.containment = this.helper[0].parentNode;
            }
            if(o.containment === "document" || o.containment === "window") {
                this.containment = [
                    0 - this.offset.relative.left - this.offset.parent.left,
                    0 - this.offset.relative.top - this.offset.parent.top,
                    $(o.containment === "document" ? document : window).width() - this.helperProportions.width - this.margins.left,
                    ($(o.containment === "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
                ];
            }

            if(!(/^(document|window|parent)$/).test(o.containment)) {
                ce = $(o.containment)[0];
                co = $(o.containment).offset();
                over = ($(ce).css("overflow") !== "hidden");

                this.containment = [
                    co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
                    co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
                    co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
                    co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
                ];
            }

        },

        _convertPositionTo: function(d, pos) {

            if(!pos) {
                pos = this.position;
            }
            var mod = d === "absolute" ? 1 : -1,
                scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
                scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

            return {
                top: (
                    pos.top	+																// The absolute mouse position
                    this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.parent.top * mod -											// The offsetParent's offset without borders (offset + border)
                    ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
                ),
                left: (
                    pos.left +																// The absolute mouse position
                    this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
                    ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
                )
            };

        },

        _generatePosition: function(event) {

            var top, left,
                o = this.options,
                pageX = event.pageX,
                pageY = event.pageY,
                scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

            // This is another very weird special case that only happens for relative elements:
            // 1. If the css position is relative
            // 2. and the scroll parent is the document or similar to the offset parent
            // we have to refresh the relative offset during the scroll so there are no jumps
            if(this.cssPosition === "relative" && !(this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0])) {
                this.offset.relative = this._getRelativeOffset();
            }

            /*
             * - Position constraining -
             * Constrain the position to a mix of grid, containment.
             */

            if(this.originalPosition) { //If we are not dragging yet, we won't check for options

                if(this.containment) {
                    if(event.pageX - this.offset.click.left < this.containment[0]) {
                        pageX = this.containment[0] + this.offset.click.left;
                    }
                    if(event.pageY - this.offset.click.top < this.containment[1]) {
                        pageY = this.containment[1] + this.offset.click.top;
                    }
                    if(event.pageX - this.offset.click.left > this.containment[2]) {
                        pageX = this.containment[2] + this.offset.click.left;
                    }
                    if(event.pageY - this.offset.click.top > this.containment[3]) {
                        pageY = this.containment[3] + this.offset.click.top;
                    }
                }

                if(o.grid) {
                    top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
                    pageY = this.containment ? ( (top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

                    left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
                    pageX = this.containment ? ( (left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
                }

            }

            return {
                top: (
                    pageY -																// The absolute mouse position
                    this.offset.click.top -													// Click offset (relative to the element)
                    this.offset.relative.top	-											// Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
                    ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
                ),
                left: (
                    pageX -																// The absolute mouse position
                    this.offset.click.left -												// Click offset (relative to the element)
                    this.offset.relative.left	-											// Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
                    ( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
                )
            };

        },

        _rearrange: function(event, i, a, hardRefresh) {

            a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

            //Various things done here to improve the performance:
            // 1. we create a setTimeout, that calls refreshPositions
            // 2. on the instance, we have a counter variable, that get's higher after every append
            // 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
            // 4. this lets only the last addition to the timeout stack through
            this.counter = this.counter ? ++this.counter : 1;
            var counter = this.counter;

            this._delay(function() {
                if(counter === this.counter) {
                    this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
                }
            });

        },

        _clear: function(event, noPropagation) {

            this.reverting = false;
            // We delay all events that have to be triggered to after the point where the placeholder has been removed and
            // everything else normalized again
            var i,
                delayedTriggers = [];

            // We first have to update the dom position of the actual currentItem
            // Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
            if(!this._noFinalSort && this.currentItem.parent().length) {
                this.placeholder.before(this.currentItem);
            }
            this._noFinalSort = null;

            if(this.helper[0] === this.currentItem[0]) {
                for(i in this._storedCSS) {
                    if(this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
                        this._storedCSS[i] = "";
                    }
                }
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
            } else {
                this.currentItem.show();
            }

            if(this.fromOutside && !noPropagation) {
                delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
            }
            if((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
                delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
            }

            // Check if the items Container has Changed and trigger appropriate
            // events.
            if (this !== this.currentContainer) {
                if(!noPropagation) {
                    delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
                    delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
                    delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
                }
            }


            //Post events to containers
            for (i = this.containers.length - 1; i >= 0; i--){
                if(!noPropagation) {
                    delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
                }
                if(this.containers[i].containerCache.over) {
                    delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
                    this.containers[i].containerCache.over = 0;
                }
            }

            //Do what was originally in plugins
            if(this._storedCursor) {
                $("body").css("cursor", this._storedCursor);
            }
            if(this._storedOpacity) {
                this.helper.css("opacity", this._storedOpacity);
            }
            if(this._storedZIndex) {
                this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
            }

            this.dragging = false;
            if(this.cancelHelperRemoval) {
                if(!noPropagation) {
                    this._trigger("beforeStop", event, this._uiHash());
                    for (i=0; i < delayedTriggers.length; i++) {
                        delayedTriggers[i].call(this, event);
                    } //Trigger all delayed events
                    this._trigger("stop", event, this._uiHash());
                }

                this.fromOutside = false;
                return false;
            }

            if(!noPropagation) {
                this._trigger("beforeStop", event, this._uiHash());
            }

            //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
            this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

            if(this.helper[0] !== this.currentItem[0]) {
                this.helper.remove();
            }
            this.helper = null;

            if(!noPropagation) {
                for (i=0; i < delayedTriggers.length; i++) {
                    delayedTriggers[i].call(this, event);
                } //Trigger all delayed events
                this._trigger("stop", event, this._uiHash());
            }

            this.fromOutside = false;
            return true;

        },

        _trigger: function() {
            if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
                this.cancel();
            }
        },

        _uiHash: function(_inst) {
            var inst = _inst || this;
            return {
                helper: inst.helper,
                placeholder: inst.placeholder || $([]),
                position: inst.position,
                originalPosition: inst.originalPosition,
                offset: inst.positionAbs,
                item: inst.currentItem,
                sender: _inst ? _inst.element : null
            };
        }

    });

    })(jQuery);
    (function( $, undefined ) {

    $.extend($.ui, { datepicker: { version: "1.10.0" } });

    var PROP_NAME = "datepicker",
        dpuuid = new Date().getTime(),
        instActive;

    /* Date picker manager.
       Use the singleton instance of this class, $.datepicker, to interact with the date picker.
       Settings for (groups of) date pickers are maintained in an instance object,
       allowing multiple different settings on the same page. */

    function Datepicker() {
        this._curInst = null; // The current instance in use
        this._keyEvent = false; // If the last event was a key event
        this._disabledInputs = []; // List of date picker inputs that have been disabled
        this._datepickerShowing = false; // True if the popup picker is showing , false if not
        this._inDialog = false; // True if showing within a "dialog", false if not
        this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
        this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
        this._appendClass = "ui-datepicker-append"; // The name of the append marker class
        this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
        this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
        this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
        this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
        this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
        this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
        this.regional = []; // Available regional settings, indexed by language code
        this.regional[""] = { // Default regional settings
            closeText: "Done", // Display text for close link
            prevText: "Prev", // Display text for previous month link
            nextText: "Next", // Display text for next month link
            currentText: "Today", // Display text for current month link
            monthNames: ["January","February","March","April","May","June",
                "July","August","September","October","November","December"], // Names of months for drop-down and formatting
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
            dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
            weekHeader: "Wk", // Column header for week of the year
            dateFormat: "mm/dd/yy", // See format options on parseDate
            firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
            isRTL: false, // True if right-to-left language, false if left-to-right
            showMonthAfterYear: false, // True if the year select precedes month, false for month then year
            yearSuffix: "" // Additional text to append to the year in the month headers
        };
        this._defaults = { // Global defaults for all the date picker instances
            showOn: "focus", // "focus" for popup on focus,
                // "button" for trigger button, or "both" for either
            showAnim: "fadeIn", // Name of jQuery animation for popup
            showOptions: {}, // Options for enhanced animations
            defaultDate: null, // Used when field is blank: actual date,
                // +/-number for offset from today, null for today
            appendText: "", // Display text following the input box, e.g. showing the format
            buttonText: "...", // Text for trigger button
            buttonImage: "", // URL for trigger button image
            buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
            hideIfNoPrevNext: false, // True to hide next/previous month links
                // if not applicable, false to just disable them
            navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
            gotoCurrent: false, // True if today link goes back to current selection instead
            changeMonth: false, // True if month can be selected directly, false if only prev/next
            changeYear: false, // True if year can be selected directly, false if only prev/next
            yearRange: "c-10:c+10", // Range of years to display in drop-down,
                // either relative to today's year (-nn:+nn), relative to currently displayed year
                // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
            showOtherMonths: false, // True to show dates in other months, false to leave blank
            selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
            showWeek: false, // True to show week of the year, false to not show it
            calculateWeek: this.iso8601Week, // How to calculate the week of the year,
                // takes a Date and returns the number of the week for it
            shortYearCutoff: "+10", // Short year values < this are in the current century,
                // > this are in the previous century,
                // string value starting with "+" for current year + value
            minDate: null, // The earliest selectable date, or null for no limit
            maxDate: null, // The latest selectable date, or null for no limit
            duration: "fast", // Duration of display/closure
            beforeShowDay: null, // Function that takes a date and returns an array with
                // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
                // [2] = cell title (optional), e.g. $.datepicker.noWeekends
            beforeShow: null, // Function that takes an input field and
                // returns a set of custom settings for the date picker
            onSelect: null, // Define a callback function when a date is selected
            onChangeMonthYear: null, // Define a callback function when the month or year is changed
            onClose: null, // Define a callback function when the datepicker is closed
            numberOfMonths: 1, // Number of months to show at a time
            showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
            stepMonths: 1, // Number of months to step back/forward
            stepBigMonths: 12, // Number of months to step back/forward for the big links
            altField: "", // Selector for an alternate field to store selected dates into
            altFormat: "", // The date format to use for the alternate field
            constrainInput: true, // The input is constrained by the current date format
            showButtonPanel: false, // True to show button panel, false to not show it
            autoSize: false, // True to size the input for the date format, false to leave as is
            disabled: false // The initial disabled state
        };
        $.extend(this._defaults, this.regional[""]);
        this.dpDiv = bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
    }

    $.extend(Datepicker.prototype, {
        /* Class name added to elements to indicate already configured with a date picker. */
        markerClassName: "hasDatepicker",

        //Keep track of the maximum number of rows displayed (see #7043)
        maxRows: 4,

        // TODO rename to "widget" when switching to widget factory
        _widgetDatepicker: function() {
            return this.dpDiv;
        },

        /* Override the default settings for all instances of the date picker.
         * @param  settings  object - the new settings to use as defaults (anonymous object)
         * @return the manager object
         */
        setDefaults: function(settings) {
            extendRemove(this._defaults, settings || {});
            return this;
        },

        /* Attach the date picker to a jQuery selection.
         * @param  target	element - the target input field or division or span
         * @param  settings  object - the new settings to use for this date picker instance (anonymous)
         */
        _attachDatepicker: function(target, settings) {
            var nodeName, inline, inst;
            nodeName = target.nodeName.toLowerCase();
            inline = (nodeName === "div" || nodeName === "span");
            if (!target.id) {
                this.uuid += 1;
                target.id = "dp" + this.uuid;
            }
            inst = this._newInst($(target), inline);
            inst.settings = $.extend({}, settings || {});
            if (nodeName === "input") {
                this._connectDatepicker(target, inst);
            } else if (inline) {
                this._inlineDatepicker(target, inst);
            }
        },

        /* Create a new instance object. */
        _newInst: function(target, inline) {
            var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
            return {id: id, input: target, // associated target
                selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
                drawMonth: 0, drawYear: 0, // month being drawn
                inline: inline, // is datepicker inline or not
                dpDiv: (!inline ? this.dpDiv : // presentation div
                bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
        },

        /* Attach the date picker to an input field. */
        _connectDatepicker: function(target, inst) {
            var input = $(target);
            inst.append = $([]);
            inst.trigger = $([]);
            if (input.hasClass(this.markerClassName)) {
                return;
            }
            this._attachments(input, inst);
            input.addClass(this.markerClassName).keydown(this._doKeyDown).
                keypress(this._doKeyPress).keyup(this._doKeyUp);
            this._autoSize(inst);
            $.data(target, PROP_NAME, inst);
            //If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
            if( inst.settings.disabled ) {
                this._disableDatepicker( target );
            }
        },

        /* Make attachments based on settings. */
        _attachments: function(input, inst) {
            var showOn, buttonText, buttonImage,
                appendText = this._get(inst, "appendText"),
                isRTL = this._get(inst, "isRTL");

            if (inst.append) {
                inst.append.remove();
            }
            if (appendText) {
                inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
                input[isRTL ? "before" : "after"](inst.append);
            }

            input.unbind("focus", this._showDatepicker);

            if (inst.trigger) {
                inst.trigger.remove();
            }

            showOn = this._get(inst, "showOn");
            if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
                input.focus(this._showDatepicker);
            }
            if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
                buttonText = this._get(inst, "buttonText");
                buttonImage = this._get(inst, "buttonImage");
                inst.trigger = $(this._get(inst, "buttonImageOnly") ?
                    $("<img/>").addClass(this._triggerClass).
                        attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
                    $("<button type='button'></button>").addClass(this._triggerClass).
                        html(!buttonImage ? buttonText : $("<img/>").attr(
                        { src:buttonImage, alt:buttonText, title:buttonText })));
                input[isRTL ? "before" : "after"](inst.trigger);
                inst.trigger.click(function() {
                    if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
                        $.datepicker._hideDatepicker();
                    } else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
                        $.datepicker._hideDatepicker();
                        $.datepicker._showDatepicker(input[0]);
                    } else {
                        $.datepicker._showDatepicker(input[0]);
                    }
                    return false;
                });
            }
        },

        /* Apply the maximum length for the date format. */
        _autoSize: function(inst) {
            if (this._get(inst, "autoSize") && !inst.inline) {
                var findMax, max, maxI, i,
                    date = new Date(2009, 12 - 1, 20), // Ensure double digits
                    dateFormat = this._get(inst, "dateFormat");

                if (dateFormat.match(/[DM]/)) {
                    findMax = function(names) {
                        max = 0;
                        maxI = 0;
                        for (i = 0; i < names.length; i++) {
                            if (names[i].length > max) {
                                max = names[i].length;
                                maxI = i;
                            }
                        }
                        return maxI;
                    };
                    date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
                        "monthNames" : "monthNamesShort"))));
                    date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
                        "dayNames" : "dayNamesShort"))) + 20 - date.getDay());
                }
                inst.input.attr("size", this._formatDate(inst, date).length);
            }
        },

        /* Attach an inline date picker to a div. */
        _inlineDatepicker: function(target, inst) {
            var divSpan = $(target);
            if (divSpan.hasClass(this.markerClassName)) {
                return;
            }
            divSpan.addClass(this.markerClassName).append(inst.dpDiv);
            $.data(target, PROP_NAME, inst);
            this._setDate(inst, this._getDefaultDate(inst), true);
            this._updateDatepicker(inst);
            this._updateAlternate(inst);
            //If disabled option is true, disable the datepicker before showing it (see ticket #5665)
            if( inst.settings.disabled ) {
                this._disableDatepicker( target );
            }
            // Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
            // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
            inst.dpDiv.css( "display", "block" );
        },

        /* Pop-up the date picker in a "dialog" box.
         * @param  input element - ignored
         * @param  date	string or Date - the initial date to display
         * @param  onSelect  function - the function to call when a date is selected
         * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
         * @param  pos int[2] - coordinates for the dialog's position within the screen or
         *					event - with x/y coordinates or
         *					leave empty for default (screen centre)
         * @return the manager object
         */
        _dialogDatepicker: function(input, date, onSelect, settings, pos) {
            var id, browserWidth, browserHeight, scrollX, scrollY,
                inst = this._dialogInst; // internal instance

            if (!inst) {
                this.uuid += 1;
                id = "dp" + this.uuid;
                this._dialogInput = $("<input type='text' id='" + id +
                    "' style='position: absolute; top: -100px; width: 0px;'/>");
                this._dialogInput.keydown(this._doKeyDown);
                $("body").append(this._dialogInput);
                inst = this._dialogInst = this._newInst(this._dialogInput, false);
                inst.settings = {};
                $.data(this._dialogInput[0], PROP_NAME, inst);
            }
            extendRemove(inst.settings, settings || {});
            date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
            this._dialogInput.val(date);

            this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
            if (!this._pos) {
                browserWidth = document.documentElement.clientWidth;
                browserHeight = document.documentElement.clientHeight;
                scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
                scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                this._pos = // should use actual width/height below
                    [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
            }

            // move input on screen for focus, but hidden behind dialog
            this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
            inst.settings.onSelect = onSelect;
            this._inDialog = true;
            this.dpDiv.addClass(this._dialogClass);
            this._showDatepicker(this._dialogInput[0]);
            if ($.blockUI) {
                $.blockUI(this.dpDiv);
            }
            $.data(this._dialogInput[0], PROP_NAME, inst);
            return this;
        },

        /* Detach a datepicker from its control.
         * @param  target	element - the target input field or division or span
         */
        _destroyDatepicker: function(target) {
            var nodeName,
                $target = $(target),
                inst = $.data(target, PROP_NAME);

            if (!$target.hasClass(this.markerClassName)) {
                return;
            }

            nodeName = target.nodeName.toLowerCase();
            $.removeData(target, PROP_NAME);
            if (nodeName === "input") {
                inst.append.remove();
                inst.trigger.remove();
                $target.removeClass(this.markerClassName).
                    unbind("focus", this._showDatepicker).
                    unbind("keydown", this._doKeyDown).
                    unbind("keypress", this._doKeyPress).
                    unbind("keyup", this._doKeyUp);
            } else if (nodeName === "div" || nodeName === "span") {
                $target.removeClass(this.markerClassName).empty();
            }
        },

        /* Enable the date picker to a jQuery selection.
         * @param  target	element - the target input field or division or span
         */
        _enableDatepicker: function(target) {
            var nodeName, inline,
                $target = $(target),
                inst = $.data(target, PROP_NAME);

            if (!$target.hasClass(this.markerClassName)) {
                return;
            }

            nodeName = target.nodeName.toLowerCase();
            if (nodeName === "input") {
                target.disabled = false;
                inst.trigger.filter("button").
                    each(function() { this.disabled = false; }).end().
                    filter("img").css({opacity: "1.0", cursor: ""});
            } else if (nodeName === "div" || nodeName === "span") {
                inline = $target.children("." + this._inlineClass);
                inline.children().removeClass("ui-state-disabled");
                inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                    prop("disabled", false);
            }
            this._disabledInputs = $.map(this._disabledInputs,
                function(value) { return (value === target ? null : value); }); // delete entry
        },

        /* Disable the date picker to a jQuery selection.
         * @param  target	element - the target input field or division or span
         */
        _disableDatepicker: function(target) {
            var nodeName, inline,
                $target = $(target),
                inst = $.data(target, PROP_NAME);

            if (!$target.hasClass(this.markerClassName)) {
                return;
            }

            nodeName = target.nodeName.toLowerCase();
            if (nodeName === "input") {
                target.disabled = true;
                inst.trigger.filter("button").
                    each(function() { this.disabled = true; }).end().
                    filter("img").css({opacity: "0.5", cursor: "default"});
            } else if (nodeName === "div" || nodeName === "span") {
                inline = $target.children("." + this._inlineClass);
                inline.children().addClass("ui-state-disabled");
                inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
                    prop("disabled", true);
            }
            this._disabledInputs = $.map(this._disabledInputs,
                function(value) { return (value === target ? null : value); }); // delete entry
            this._disabledInputs[this._disabledInputs.length] = target;
        },

        /* Is the first field in a jQuery collection disabled as a datepicker?
         * @param  target	element - the target input field or division or span
         * @return boolean - true if disabled, false if enabled
         */
        _isDisabledDatepicker: function(target) {
            if (!target) {
                return false;
            }
            for (var i = 0; i < this._disabledInputs.length; i++) {
                if (this._disabledInputs[i] === target) {
                    return true;
                }
            }
            return false;
        },

        /* Retrieve the instance data for the target control.
         * @param  target  element - the target input field or division or span
         * @return  object - the associated instance data
         * @throws  error if a jQuery problem getting data
         */
        _getInst: function(target) {
            try {
                return $.data(target, PROP_NAME);
            }
            catch (err) {
                throw "Missing instance data for this datepicker";
            }
        },

        /* Update or retrieve the settings for a date picker attached to an input field or division.
         * @param  target  element - the target input field or division or span
         * @param  name	object - the new settings to update or
         *				string - the name of the setting to change or retrieve,
         *				when retrieving also "all" for all instance settings or
         *				"defaults" for all global defaults
         * @param  value   any - the new value for the setting
         *				(omit if above is an object or to retrieve a value)
         */
        _optionDatepicker: function(target, name, value) {
            var settings, date, minDate, maxDate,
                inst = this._getInst(target);

            if (arguments.length === 2 && typeof name === "string") {
                return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
                    (inst ? (name === "all" ? $.extend({}, inst.settings) :
                    this._get(inst, name)) : null));
            }

            settings = name || {};
            if (typeof name === "string") {
                settings = {};
                settings[name] = value;
            }

            if (inst) {
                if (this._curInst === inst) {
                    this._hideDatepicker();
                }

                date = this._getDateDatepicker(target, true);
                minDate = this._getMinMaxDate(inst, "min");
                maxDate = this._getMinMaxDate(inst, "max");
                extendRemove(inst.settings, settings);
                // reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
                if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
                    inst.settings.minDate = this._formatDate(inst, minDate);
                }
                if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
                    inst.settings.maxDate = this._formatDate(inst, maxDate);
                }
                if ( "disabled" in settings ) {
                    if ( settings.disabled ) {
                        this._disableDatepicker(target);
                    } else {
                        this._enableDatepicker(target);
                    }
                }
                this._attachments($(target), inst);
                this._autoSize(inst);
                this._setDate(inst, date);
                this._updateAlternate(inst);
                this._updateDatepicker(inst);
            }
        },

        // change method deprecated
        _changeDatepicker: function(target, name, value) {
            this._optionDatepicker(target, name, value);
        },

        /* Redraw the date picker attached to an input field or division.
         * @param  target  element - the target input field or division or span
         */
        _refreshDatepicker: function(target) {
            var inst = this._getInst(target);
            if (inst) {
                this._updateDatepicker(inst);
            }
        },

        /* Set the dates for a jQuery selection.
         * @param  target element - the target input field or division or span
         * @param  date	Date - the new date
         */
        _setDateDatepicker: function(target, date) {
            var inst = this._getInst(target);
            if (inst) {
                this._setDate(inst, date);
                this._updateDatepicker(inst);
                this._updateAlternate(inst);
            }
        },

        /* Get the date(s) for the first entry in a jQuery selection.
         * @param  target element - the target input field or division or span
         * @param  noDefault boolean - true if no default date is to be used
         * @return Date - the current date
         */
        _getDateDatepicker: function(target, noDefault) {
            var inst = this._getInst(target);
            if (inst && !inst.inline) {
                this._setDateFromField(inst, noDefault);
            }
            return (inst ? this._getDate(inst) : null);
        },

        /* Handle keystrokes. */
        _doKeyDown: function(event) {
            var onSelect, dateStr, sel,
                inst = $.datepicker._getInst(event.target),
                handled = true,
                isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

            inst._keyEvent = true;
            if ($.datepicker._datepickerShowing) {
                switch (event.keyCode) {
                    case 9: $.datepicker._hideDatepicker();
                            handled = false;
                            break; // hide on tab out
                    case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
                                        $.datepicker._currentClass + ")", inst.dpDiv);
                            if (sel[0]) {
                                $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
                            }

                            onSelect = $.datepicker._get(inst, "onSelect");
                            if (onSelect) {
                                dateStr = $.datepicker._formatDate(inst);

                                // trigger custom callback
                                onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
                            } else {
                                $.datepicker._hideDatepicker();
                            }

                            return false; // don't submit the form
                    case 27: $.datepicker._hideDatepicker();
                            break; // hide on escape
                    case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                -$.datepicker._get(inst, "stepBigMonths") :
                                -$.datepicker._get(inst, "stepMonths")), "M");
                            break; // previous month/year on page up/+ ctrl
                    case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                +$.datepicker._get(inst, "stepBigMonths") :
                                +$.datepicker._get(inst, "stepMonths")), "M");
                            break; // next month/year on page down/+ ctrl
                    case 35: if (event.ctrlKey || event.metaKey) {
                                $.datepicker._clearDate(event.target);
                            }
                            handled = event.ctrlKey || event.metaKey;
                            break; // clear on ctrl or command +end
                    case 36: if (event.ctrlKey || event.metaKey) {
                                $.datepicker._gotoToday(event.target);
                            }
                            handled = event.ctrlKey || event.metaKey;
                            break; // current on ctrl or command +home
                    case 37: if (event.ctrlKey || event.metaKey) {
                                $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
                            }
                            handled = event.ctrlKey || event.metaKey;
                            // -1 day on ctrl or command +left
                            if (event.originalEvent.altKey) {
                                $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                    -$.datepicker._get(inst, "stepBigMonths") :
                                    -$.datepicker._get(inst, "stepMonths")), "M");
                            }
                            // next month/year on alt +left on Mac
                            break;
                    case 38: if (event.ctrlKey || event.metaKey) {
                                $.datepicker._adjustDate(event.target, -7, "D");
                            }
                            handled = event.ctrlKey || event.metaKey;
                            break; // -1 week on ctrl or command +up
                    case 39: if (event.ctrlKey || event.metaKey) {
                                $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
                            }
                            handled = event.ctrlKey || event.metaKey;
                            // +1 day on ctrl or command +right
                            if (event.originalEvent.altKey) {
                                $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                                    +$.datepicker._get(inst, "stepBigMonths") :
                                    +$.datepicker._get(inst, "stepMonths")), "M");
                            }
                            // next month/year on alt +right
                            break;
                    case 40: if (event.ctrlKey || event.metaKey) {
                                $.datepicker._adjustDate(event.target, +7, "D");
                            }
                            handled = event.ctrlKey || event.metaKey;
                            break; // +1 week on ctrl or command +down
                    default: handled = false;
                }
            } else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
                $.datepicker._showDatepicker(this);
            } else {
                handled = false;
            }

            if (handled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },

        /* Filter entered characters - based on date format. */
        _doKeyPress: function(event) {
            var chars, chr,
                inst = $.datepicker._getInst(event.target);

            if ($.datepicker._get(inst, "constrainInput")) {
                chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
                chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
                return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
            }
        },

        /* Synchronise manual entry and field/alternate field. */
        _doKeyUp: function(event) {
            var date,
                inst = $.datepicker._getInst(event.target);

            if (inst.input.val() !== inst.lastVal) {
                try {
                    date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                        (inst.input ? inst.input.val() : null),
                        $.datepicker._getFormatConfig(inst));

                    if (date) { // only if valid
                        $.datepicker._setDateFromField(inst);
                        $.datepicker._updateAlternate(inst);
                        $.datepicker._updateDatepicker(inst);
                    }
                }
                catch (err) {
                }
            }
            return true;
        },

        /* Pop-up the date picker for a given input field.
         * If false returned from beforeShow event handler do not show.
         * @param  input  element - the input field attached to the date picker or
         *					event - if triggered by focus
         */
        _showDatepicker: function(input) {
            input = input.target || input;
            if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
                input = $("input", input.parentNode)[0];
            }

            if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
                return;
            }

            var inst, beforeShow, beforeShowSettings, isFixed,
                offset, showAnim, duration;

            inst = $.datepicker._getInst(input);
            if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
                $.datepicker._curInst.dpDiv.stop(true, true);
                if ( inst && $.datepicker._datepickerShowing ) {
                    $.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
                }
            }

            beforeShow = $.datepicker._get(inst, "beforeShow");
            beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
            if(beforeShowSettings === false){
                return;
            }
            extendRemove(inst.settings, beforeShowSettings);

            inst.lastVal = null;
            $.datepicker._lastInput = input;
            $.datepicker._setDateFromField(inst);

            if ($.datepicker._inDialog) { // hide cursor
                input.value = "";
            }
            if (!$.datepicker._pos) { // position below input
                $.datepicker._pos = $.datepicker._findPos(input);
                $.datepicker._pos[1] += input.offsetHeight; // add the height
            }

            isFixed = false;
            $(input).parents().each(function() {
                isFixed |= $(this).css("position") === "fixed";
                return !isFixed;
            });

            offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
            $.datepicker._pos = null;
            //to avoid flashes on Firefox
            inst.dpDiv.empty();
            // determine sizing offscreen
            inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
            $.datepicker._updateDatepicker(inst);
            // fix width for dynamic number of date pickers
            // and adjust position before showing
            offset = $.datepicker._checkOffset(inst, offset, isFixed);
            inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
                "static" : (isFixed ? "fixed" : "absolute")), display: "none",
                left: offset.left + "px", top: offset.top + "px"});

            if (!inst.inline) {
                showAnim = $.datepicker._get(inst, "showAnim");
                duration = $.datepicker._get(inst, "duration");
                inst.dpDiv.zIndex($(input).zIndex()+1);
                $.datepicker._datepickerShowing = true;

                if ( $.effects && $.effects.effect[ showAnim ] ) {
                    inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
                } else {
                    inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
                }

                if (inst.input.is(":visible") && !inst.input.is(":disabled")) {
                    inst.input.focus();
                }
                $.datepicker._curInst = inst;
            }
        },

        /* Generate the date picker content. */
        _updateDatepicker: function(inst) {
            this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
            instActive = inst; // for delegate hover events
            inst.dpDiv.empty().append(this._generateHTML(inst));
            this._attachHandlers(inst);
            inst.dpDiv.find("." + this._dayOverClass + " a").mouseover();

            var origyearshtml,
                numMonths = this._getNumberOfMonths(inst),
                cols = numMonths[1],
                width = 17;

            inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
            if (cols > 1) {
                inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
            }
            inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
                "Class"]("ui-datepicker-multi");
            inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
                "Class"]("ui-datepicker-rtl");

            // #6694 - don't focus the input if it's already focused
            // this breaks the change event in IE
            if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && inst.input &&
                inst.input.is(":visible") && !inst.input.is(":disabled") && inst.input[0] !== document.activeElement) {
                inst.input.focus();
            }

            // deffered render of the years select (to avoid flashes on Firefox)
            if( inst.yearshtml ){
                origyearshtml = inst.yearshtml;
                setTimeout(function(){
                    //assure that inst.yearshtml didn't change.
                    if( origyearshtml === inst.yearshtml && inst.yearshtml ){
                        inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
                    }
                    origyearshtml = inst.yearshtml = null;
                }, 0);
            }
        },

        /* Retrieve the size of left and top borders for an element.
         * @param  elem  (jQuery object) the element of interest
         * @return  (number[2]) the left and top borders
         */
        _getBorders: function(elem) {
            var convert = function(value) {
                return {thin: 1, medium: 2, thick: 3}[value] || value;
            };
            return [parseFloat(convert(elem.css("border-left-width"))),
                parseFloat(convert(elem.css("border-top-width")))];
        },

        /* Check positioning to remain on screen. */
        _checkOffset: function(inst, offset, isFixed) {
            var dpWidth = inst.dpDiv.outerWidth(),
                dpHeight = inst.dpDiv.outerHeight(),
                inputWidth = inst.input ? inst.input.outerWidth() : 0,
                inputHeight = inst.input ? inst.input.outerHeight() : 0,
                viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
                viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

            offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
            offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
            offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

            // now check if datepicker is showing outside window viewport - move to a better place if so.
            offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
                Math.abs(offset.left + dpWidth - viewWidth) : 0);
            offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
                Math.abs(dpHeight + inputHeight) : 0);

            return offset;
        },

        /* Find an object's position on the screen. */
        _findPos: function(obj) {
            var position,
                inst = this._getInst(obj),
                isRTL = this._get(inst, "isRTL");

            while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
                obj = obj[isRTL ? "previousSibling" : "nextSibling"];
            }

            position = $(obj).offset();
            return [position.left, position.top];
        },

        /* Hide the date picker from view.
         * @param  input  element - the input field attached to the date picker
         */
        _hideDatepicker: function(input) {
            var showAnim, duration, postProcess, onClose,
                inst = this._curInst;

            if (!inst || (input && inst !== $.data(input, PROP_NAME))) {
                return;
            }

            if (this._datepickerShowing) {
                showAnim = this._get(inst, "showAnim");
                duration = this._get(inst, "duration");
                postProcess = function() {
                    $.datepicker._tidyDialog(inst);
                };

                // DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
                if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
                    inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
                } else {
                    inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
                        (showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
                }

                if (!showAnim) {
                    postProcess();
                }
                this._datepickerShowing = false;

                onClose = this._get(inst, "onClose");
                if (onClose) {
                    onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
                }

                this._lastInput = null;
                if (this._inDialog) {
                    this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
                    if ($.blockUI) {
                        $.unblockUI();
                        $("body").append(this.dpDiv);
                    }
                }
                this._inDialog = false;
            }
        },

        /* Tidy up after a dialog display. */
        _tidyDialog: function(inst) {
            inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
        },

        /* Close date picker if clicked elsewhere. */
        _checkExternalClick: function(event) {
            if (!$.datepicker._curInst) {
                return;
            }

            var $target = $(event.target),
                inst = $.datepicker._getInst($target[0]);

            if ( ( ( $target[0].id !== $.datepicker._mainDivId &&
                    $target.parents("#" + $.datepicker._mainDivId).length === 0 &&
                    !$target.hasClass($.datepicker.markerClassName) &&
                    !$target.closest("." + $.datepicker._triggerClass).length &&
                    $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
                ( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst ) ) {
                    $.datepicker._hideDatepicker();
            }
        },

        /* Adjust one of the date sub-fields. */
        _adjustDate: function(id, offset, period) {
            var target = $(id),
                inst = this._getInst(target[0]);

            if (this._isDisabledDatepicker(target[0])) {
                return;
            }
            this._adjustInstDate(inst, offset +
                (period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
                period);
            this._updateDatepicker(inst);
        },

        /* Action for current link. */
        _gotoToday: function(id) {
            var date,
                target = $(id),
                inst = this._getInst(target[0]);

            if (this._get(inst, "gotoCurrent") && inst.currentDay) {
                inst.selectedDay = inst.currentDay;
                inst.drawMonth = inst.selectedMonth = inst.currentMonth;
                inst.drawYear = inst.selectedYear = inst.currentYear;
            } else {
                date = new Date();
                inst.selectedDay = date.getDate();
                inst.drawMonth = inst.selectedMonth = date.getMonth();
                inst.drawYear = inst.selectedYear = date.getFullYear();
            }
            this._notifyChange(inst);
            this._adjustDate(target);
        },

        /* Action for selecting a new month/year. */
        _selectMonthYear: function(id, select, period) {
            var target = $(id),
                inst = this._getInst(target[0]);

            inst["selected" + (period === "M" ? "Month" : "Year")] =
            inst["draw" + (period === "M" ? "Month" : "Year")] =
                parseInt(select.options[select.selectedIndex].value,10);

            this._notifyChange(inst);
            this._adjustDate(target);
        },

        /* Action for selecting a day. */
        _selectDay: function(id, month, year, td) {
            var inst,
                target = $(id);

            if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
                return;
            }

            inst = this._getInst(target[0]);
            inst.selectedDay = inst.currentDay = $("a", td).html();
            inst.selectedMonth = inst.currentMonth = month;
            inst.selectedYear = inst.currentYear = year;
            this._selectDate(id, this._formatDate(inst,
                inst.currentDay, inst.currentMonth, inst.currentYear));
        },

        /* Erase the input field and hide the date picker. */
        _clearDate: function(id) {
            var target = $(id);
            this._selectDate(target, "");
        },

        /* Update the input field with the selected date. */
        _selectDate: function(id, dateStr) {
            var onSelect,
                target = $(id),
                inst = this._getInst(target[0]);

            dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
            if (inst.input) {
                inst.input.val(dateStr);
            }
            this._updateAlternate(inst);

            onSelect = this._get(inst, "onSelect");
            if (onSelect) {
                onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
            } else if (inst.input) {
                inst.input.trigger("change"); // fire the change event
            }

            if (inst.inline){
                this._updateDatepicker(inst);
            } else {
                this._hideDatepicker();
                this._lastInput = inst.input[0];
                if (typeof(inst.input[0]) !== "object") {
                    inst.input.focus(); // restore focus
                }
                this._lastInput = null;
            }
        },

        /* Update any alternate field to synchronise with the main field. */
        _updateAlternate: function(inst) {
            var altFormat, date, dateStr,
                altField = this._get(inst, "altField");

            if (altField) { // update alternate field too
                altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
                date = this._getDate(inst);
                dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
                $(altField).each(function() { $(this).val(dateStr); });
            }
        },

        /* Set as beforeShowDay function to prevent selection of weekends.
         * @param  date  Date - the date to customise
         * @return [boolean, string] - is this date selectable?, what is its CSS class?
         */
        noWeekends: function(date) {
            var day = date.getDay();
            return [(day > 0 && day < 6), ""];
        },

        /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
         * @param  date  Date - the date to get the week for
         * @return  number - the number of the week within the year that contains this date
         */
        iso8601Week: function(date) {
            var time,
                checkDate = new Date(date.getTime());

            // Find Thursday of this week starting on Monday
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

            time = checkDate.getTime();
            checkDate.setMonth(0); // Compare with Jan 1
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
        },

        /* Parse a string value into a date object.
         * See formatDate below for the possible formats.
         *
         * @param  format string - the expected format of the date
         * @param  value string - the date in the above format
         * @param  settings Object - attributes include:
         *					shortYearCutoff  number - the cutoff year for determining the century (optional)
         *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
         *					dayNames		string[7] - names of the days from Sunday (optional)
         *					monthNamesShort string[12] - abbreviated names of the months (optional)
         *					monthNames		string[12] - names of the months (optional)
         * @return  Date - the extracted date value or null if value is blank
         */
        parseDate: function (format, value, settings) {
            if (format == null || value == null) {
                throw "Invalid arguments";
            }

            value = (typeof value === "object" ? value.toString() : value + "");
            if (value === "") {
                return null;
            }

            var iFormat, dim, extra,
                iValue = 0,
                shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
                shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
                    new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
                dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
                dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
                monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
                monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
                year = -1,
                month = -1,
                day = -1,
                doy = -1,
                literal = false,
                date,
                // Check whether a format character is doubled
                lookAhead = function(match) {
                    var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                    if (matches) {
                        iFormat++;
                    }
                    return matches;
                },
                // Extract a number from the string value
                getNumber = function(match) {
                    var isDoubled = lookAhead(match),
                        size = (match === "@" ? 14 : (match === "!" ? 20 :
                        (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
                        digits = new RegExp("^\\d{1," + size + "}"),
                        num = value.substring(iValue).match(digits);
                    if (!num) {
                        throw "Missing number at position " + iValue;
                    }
                    iValue += num[0].length;
                    return parseInt(num[0], 10);
                },
                // Extract a name from the string value and convert to an index
                getName = function(match, shortNames, longNames) {
                    var index = -1,
                        names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
                            return [ [k, v] ];
                        }).sort(function (a, b) {
                            return -(a[1].length - b[1].length);
                        });

                    $.each(names, function (i, pair) {
                        var name = pair[1];
                        if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                            index = pair[0];
                            iValue += name.length;
                            return false;
                        }
                    });
                    if (index !== -1) {
                        return index + 1;
                    } else {
                        throw "Unknown name at position " + iValue;
                    }
                },
                // Confirm that a literal character matches the string value
                checkLiteral = function() {
                    if (value.charAt(iValue) !== format.charAt(iFormat)) {
                        throw "Unexpected literal at position " + iValue;
                    }
                    iValue++;
                };

            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        checkLiteral();
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "d":
                            day = getNumber("d");
                            break;
                        case "D":
                            getName("D", dayNamesShort, dayNames);
                            break;
                        case "o":
                            doy = getNumber("o");
                            break;
                        case "m":
                            month = getNumber("m");
                            break;
                        case "M":
                            month = getName("M", monthNamesShort, monthNames);
                            break;
                        case "y":
                            year = getNumber("y");
                            break;
                        case "@":
                            date = new Date(getNumber("@"));
                            year = date.getFullYear();
                            month = date.getMonth() + 1;
                            day = date.getDate();
                            break;
                        case "!":
                            date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
                            year = date.getFullYear();
                            month = date.getMonth() + 1;
                            day = date.getDate();
                            break;
                        case "'":
                            if (lookAhead("'")){
                                checkLiteral();
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            checkLiteral();
                    }
                }
            }

            if (iValue < value.length){
                extra = value.substr(iValue);
                if (!/^\s+/.test(extra)) {
                    throw "Extra/unparsed characters found in date: " + extra;
                }
            }

            if (year === -1) {
                year = new Date().getFullYear();
            } else if (year < 100) {
                year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                    (year <= shortYearCutoff ? 0 : -100);
            }

            if (doy > -1) {
                month = 1;
                day = doy;
                do {
                    dim = this._getDaysInMonth(year, month - 1);
                    if (day <= dim) {
                        break;
                    }
                    month++;
                    day -= dim;
                } while (true);
            }

            date = this._daylightSavingAdjust(new Date(year, month - 1, day));
            if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
                throw "Invalid date"; // E.g. 31/02/00
            }
            return date;
        },

        /* Standard date formats. */
        ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y", // RFC 822
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd", // ISO 8601

        _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
            Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

        /* Format a date object into a string value.
         * The format can be combinations of the following:
         * d  - day of month (no leading zero)
         * dd - day of month (two digit)
         * o  - day of year (no leading zeros)
         * oo - day of year (three digit)
         * D  - day name short
         * DD - day name long
         * m  - month of year (no leading zero)
         * mm - month of year (two digit)
         * M  - month name short
         * MM - month name long
         * y  - year (two digit)
         * yy - year (four digit)
         * @ - Unix timestamp (ms since 01/01/1970)
         * ! - Windows ticks (100ns since 01/01/0001)
         * "..." - literal text
         * '' - single quote
         *
         * @param  format string - the desired format of the date
         * @param  date Date - the date value to format
         * @param  settings Object - attributes include:
         *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
         *					dayNames		string[7] - names of the days from Sunday (optional)
         *					monthNamesShort string[12] - abbreviated names of the months (optional)
         *					monthNames		string[12] - names of the months (optional)
         * @return  string - the date in the above format
         */
        formatDate: function (format, date, settings) {
            if (!date) {
                return "";
            }

            var iFormat,
                dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
                dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
                monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
                monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
                // Check whether a format character is doubled
                lookAhead = function(match) {
                    var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                    if (matches) {
                        iFormat++;
                    }
                    return matches;
                },
                // Format a number, with leading zero if necessary
                formatNumber = function(match, value, len) {
                    var num = "" + value;
                    if (lookAhead(match)) {
                        while (num.length < len) {
                            num = "0" + num;
                        }
                    }
                    return num;
                },
                // Format a name, short or long as requested
                formatName = function(match, value, shortNames, longNames) {
                    return (lookAhead(match) ? longNames[value] : shortNames[value]);
                },
                output = "",
                literal = false;

            if (date) {
                for (iFormat = 0; iFormat < format.length; iFormat++) {
                    if (literal) {
                        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                            literal = false;
                        } else {
                            output += format.charAt(iFormat);
                        }
                    } else {
                        switch (format.charAt(iFormat)) {
                            case "d":
                                output += formatNumber("d", date.getDate(), 2);
                                break;
                            case "D":
                                output += formatName("D", date.getDay(), dayNamesShort, dayNames);
                                break;
                            case "o":
                                output += formatNumber("o",
                                    Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                                break;
                            case "m":
                                output += formatNumber("m", date.getMonth() + 1, 2);
                                break;
                            case "M":
                                output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
                                break;
                            case "y":
                                output += (lookAhead("y") ? date.getFullYear() :
                                    (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
                                break;
                            case "@":
                                output += date.getTime();
                                break;
                            case "!":
                                output += date.getTime() * 10000 + this._ticksTo1970;
                                break;
                            case "'":
                                if (lookAhead("'")) {
                                    output += "'";
                                } else {
                                    literal = true;
                                }
                                break;
                            default:
                                output += format.charAt(iFormat);
                        }
                    }
                }
            }
            return output;
        },

        /* Extract all possible characters from the date format. */
        _possibleChars: function (format) {
            var iFormat,
                chars = "",
                literal = false,
                // Check whether a format character is doubled
                lookAhead = function(match) {
                    var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                    if (matches) {
                        iFormat++;
                    }
                    return matches;
                };

            for (iFormat = 0; iFormat < format.length; iFormat++) {
                if (literal) {
                    if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                        literal = false;
                    } else {
                        chars += format.charAt(iFormat);
                    }
                } else {
                    switch (format.charAt(iFormat)) {
                        case "d": case "m": case "y": case "@":
                            chars += "0123456789";
                            break;
                        case "D": case "M":
                            return null; // Accept anything
                        case "'":
                            if (lookAhead("'")) {
                                chars += "'";
                            } else {
                                literal = true;
                            }
                            break;
                        default:
                            chars += format.charAt(iFormat);
                    }
                }
            }
            return chars;
        },

        /* Get a setting value, defaulting if necessary. */
        _get: function(inst, name) {
            return inst.settings[name] !== undefined ?
                inst.settings[name] : this._defaults[name];
        },

        /* Parse existing date and initialise date picker. */
        _setDateFromField: function(inst, noDefault) {
            if (inst.input.val() === inst.lastVal) {
                return;
            }

            var dateFormat = this._get(inst, "dateFormat"),
                dates = inst.lastVal = inst.input ? inst.input.val() : null,
                defaultDate = this._getDefaultDate(inst),
                date = defaultDate,
                settings = this._getFormatConfig(inst);

            try {
                date = this.parseDate(dateFormat, dates, settings) || defaultDate;
            } catch (event) {
                dates = (noDefault ? "" : dates);
            }
            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            inst.currentDay = (dates ? date.getDate() : 0);
            inst.currentMonth = (dates ? date.getMonth() : 0);
            inst.currentYear = (dates ? date.getFullYear() : 0);
            this._adjustInstDate(inst);
        },

        /* Retrieve the default date shown on opening. */
        _getDefaultDate: function(inst) {
            return this._restrictMinMax(inst,
                this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
        },

        /* A date may be specified as an exact value or a relative one. */
        _determineDate: function(inst, date, defaultDate) {
            var offsetNumeric = function(offset) {
                    var date = new Date();
                    date.setDate(date.getDate() + offset);
                    return date;
                },
                offsetString = function(offset) {
                    try {
                        return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
                            offset, $.datepicker._getFormatConfig(inst));
                    }
                    catch (e) {
                        // Ignore
                    }

                    var date = (offset.toLowerCase().match(/^c/) ?
                        $.datepicker._getDate(inst) : null) || new Date(),
                        year = date.getFullYear(),
                        month = date.getMonth(),
                        day = date.getDate(),
                        pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                        matches = pattern.exec(offset);

                    while (matches) {
                        switch (matches[2] || "d") {
                            case "d" : case "D" :
                                day += parseInt(matches[1],10); break;
                            case "w" : case "W" :
                                day += parseInt(matches[1],10) * 7; break;
                            case "m" : case "M" :
                                month += parseInt(matches[1],10);
                                day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                                break;
                            case "y": case "Y" :
                                year += parseInt(matches[1],10);
                                day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
                                break;
                        }
                        matches = pattern.exec(offset);
                    }
                    return new Date(year, month, day);
                },
                newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
                    (typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

            newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
            if (newDate) {
                newDate.setHours(0);
                newDate.setMinutes(0);
                newDate.setSeconds(0);
                newDate.setMilliseconds(0);
            }
            return this._daylightSavingAdjust(newDate);
        },

        /* Handle switch to/from daylight saving.
         * Hours may be non-zero on daylight saving cut-over:
         * > 12 when midnight changeover, but then cannot generate
         * midnight datetime, so jump to 1AM, otherwise reset.
         * @param  date  (Date) the date to check
         * @return  (Date) the corrected date
         */
        _daylightSavingAdjust: function(date) {
            if (!date) {
                return null;
            }
            date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
            return date;
        },

        /* Set the date(s) directly. */
        _setDate: function(inst, date, noChange) {
            var clear = !date,
                origMonth = inst.selectedMonth,
                origYear = inst.selectedYear,
                newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

            inst.selectedDay = inst.currentDay = newDate.getDate();
            inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
            inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
            if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
                this._notifyChange(inst);
            }
            this._adjustInstDate(inst);
            if (inst.input) {
                inst.input.val(clear ? "" : this._formatDate(inst));
            }
        },

        /* Retrieve the date(s) directly. */
        _getDate: function(inst) {
            var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
                this._daylightSavingAdjust(new Date(
                inst.currentYear, inst.currentMonth, inst.currentDay)));
                return startDate;
        },

        /* Attach the onxxx handlers.  These are declared statically so
         * they work with static code transformers like Caja.
         */
        _attachHandlers: function(inst) {
            var stepMonths = this._get(inst, "stepMonths"),
                id = "#" + inst.id.replace( /\\\\/g, "\\" );
            inst.dpDiv.find("[data-handler]").map(function () {
                var handler = {
                    prev: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._adjustDate(id, -stepMonths, "M");
                    },
                    next: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._adjustDate(id, +stepMonths, "M");
                    },
                    hide: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._hideDatepicker();
                    },
                    today: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._gotoToday(id);
                    },
                    selectDay: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
                        return false;
                    },
                    selectMonth: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(id, this, "M");
                        return false;
                    },
                    selectYear: function () {
                        window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(id, this, "Y");
                        return false;
                    }
                };
                $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
            });
        },

        /* Generate the HTML for the current state of the date picker. */
        _generateHTML: function(inst) {
            var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
                controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
                monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
                selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
                cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
                printDate, dRow, tbody, daySettings, otherMonth, unselectable,
                tempDate = new Date(),
                today = this._daylightSavingAdjust(
                    new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
                isRTL = this._get(inst, "isRTL"),
                showButtonPanel = this._get(inst, "showButtonPanel"),
                hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
                navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
                numMonths = this._getNumberOfMonths(inst),
                showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
                stepMonths = this._get(inst, "stepMonths"),
                isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
                currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
                    new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
                minDate = this._getMinMaxDate(inst, "min"),
                maxDate = this._getMinMaxDate(inst, "max"),
                drawMonth = inst.drawMonth - showCurrentAtPos,
                drawYear = inst.drawYear;

            if (drawMonth < 0) {
                drawMonth += 12;
                drawYear--;
            }
            if (maxDate) {
                maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
                    maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
                maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
                while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
                    drawMonth--;
                    if (drawMonth < 0) {
                        drawMonth = 11;
                        drawYear--;
                    }
                }
            }
            inst.drawMonth = drawMonth;
            inst.drawYear = drawYear;

            prevText = this._get(inst, "prevText");
            prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
                this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
                this._getFormatConfig(inst)));

            prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
                "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
                " title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
                (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+ prevText +"'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

            nextText = this._get(inst, "nextText");
            nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
                this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
                this._getFormatConfig(inst)));

            next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
                "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
                " title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
                (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+ nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

            currentText = this._get(inst, "currentText");
            gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
            currentText = (!navigationAsDateFormat ? currentText :
                this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

            controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
                this._get(inst, "closeText") + "</button>" : "");

            buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
                (this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
                ">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

            firstDay = parseInt(this._get(inst, "firstDay"),10);
            firstDay = (isNaN(firstDay) ? 0 : firstDay);

            showWeek = this._get(inst, "showWeek");
            dayNames = this._get(inst, "dayNames");
            dayNamesMin = this._get(inst, "dayNamesMin");
            monthNames = this._get(inst, "monthNames");
            monthNamesShort = this._get(inst, "monthNamesShort");
            beforeShowDay = this._get(inst, "beforeShowDay");
            showOtherMonths = this._get(inst, "showOtherMonths");
            selectOtherMonths = this._get(inst, "selectOtherMonths");
            defaultDate = this._getDefaultDate(inst);
            html = "";
            dow;
            for (row = 0; row < numMonths[0]; row++) {
                group = "";
                this.maxRows = 4;
                for (col = 0; col < numMonths[1]; col++) {
                    selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
                    cornerClass = " ui-corner-all";
                    calender = "";
                    if (isMultiMonth) {
                        calender += "<div class='ui-datepicker-group";
                        if (numMonths[1] > 1) {
                            switch (col) {
                                case 0: calender += " ui-datepicker-group-first";
                                    cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
                                case numMonths[1]-1: calender += " ui-datepicker-group-last";
                                    cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
                                default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
                            }
                        }
                        calender += "'>";
                    }
                    calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
                        (/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
                        (/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
                        this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
                        row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
                        "</div><table class='ui-datepicker-calendar'><thead>" +
                        "<tr>";
                    thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
                    for (dow = 0; dow < 7; dow++) { // days of the week
                        day = (dow + firstDay) % 7;
                        thead += "<th" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
                            "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
                    }
                    calender += thead + "</tr></thead><tbody>";
                    daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
                    if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
                        inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
                    }
                    leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
                    curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
                    numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
                    this.maxRows = numRows;
                    printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
                    for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
                        calender += "<tr>";
                        tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
                            this._get(inst, "calculateWeek")(printDate) + "</td>");
                        for (dow = 0; dow < 7; dow++) { // create date picker days
                            daySettings = (beforeShowDay ?
                                beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
                            otherMonth = (printDate.getMonth() !== drawMonth);
                            unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
                                (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                            tbody += "<td class='" +
                                ((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
                                (otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
                                ((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
                                (defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
                                // or defaultDate is current printedDate and defaultDate is selectedDate
                                " " + this._dayOverClass : "") + // highlight selected day
                                (unselectable ? " " + this._unselectableClass + " ui-state-disabled": "") +  // highlight unselectable days
                                (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
                                (printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
                                (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
                                ((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2] + "'" : "") + // cell title
                                (unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
                                (otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
                                (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
                                (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                                (printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
                                (otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
                                "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
                            printDate.setDate(printDate.getDate() + 1);
                            printDate = this._daylightSavingAdjust(printDate);
                        }
                        calender += tbody + "</tr>";
                    }
                    drawMonth++;
                    if (drawMonth > 11) {
                        drawMonth = 0;
                        drawYear++;
                    }
                    calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
                                ((numMonths[0] > 0 && col === numMonths[1]-1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
                    group += calender;
                }
                html += group;
            }
            html += buttonPanel;
            inst._keyEvent = false;
            return html;
        },

        /* Generate the month and year header. */
        _generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
                secondary, monthNames, monthNamesShort) {

            var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
                changeMonth = this._get(inst, "changeMonth"),
                changeYear = this._get(inst, "changeYear"),
                showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
                html = "<div class='ui-datepicker-title'>",
                monthHtml = "";

            // month selection
            if (secondary || !changeMonth) {
                monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
            } else {
                inMinYear = (minDate && minDate.getFullYear() === drawYear);
                inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
                monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
                for ( month = 0; month < 12; month++) {
                    if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
                        monthHtml += "<option value='" + month + "'" +
                            (month === drawMonth ? " selected='selected'" : "") +
                            ">" + monthNamesShort[month] + "</option>";
                    }
                }
                monthHtml += "</select>";
            }

            if (!showMonthAfterYear) {
                html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
            }

            // year selection
            if ( !inst.yearshtml ) {
                inst.yearshtml = "";
                if (secondary || !changeYear) {
                    html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
                } else {
                    // determine range of years to display
                    years = this._get(inst, "yearRange").split(":");
                    thisYear = new Date().getFullYear();
                    determineYear = function(value) {
                        var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
                            (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
                            parseInt(value, 10)));
                        return (isNaN(year) ? thisYear : year);
                    };
                    year = determineYear(years[0]);
                    endYear = Math.max(year, determineYear(years[1] || ""));
                    year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
                    endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
                    inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
                    for (; year <= endYear; year++) {
                        inst.yearshtml += "<option value='" + year + "'" +
                            (year === drawYear ? " selected='selected'" : "") +
                            ">" + year + "</option>";
                    }
                    inst.yearshtml += "</select>";

                    html += inst.yearshtml;
                    inst.yearshtml = null;
                }
            }

            html += this._get(inst, "yearSuffix");
            if (showMonthAfterYear) {
                html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
            }
            html += "</div>"; // Close datepicker_header
            return html;
        },

        /* Adjust one of the date sub-fields. */
        _adjustInstDate: function(inst, offset, period) {
            var year = inst.drawYear + (period === "Y" ? offset : 0),
                month = inst.drawMonth + (period === "M" ? offset : 0),
                day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
                date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

            inst.selectedDay = date.getDate();
            inst.drawMonth = inst.selectedMonth = date.getMonth();
            inst.drawYear = inst.selectedYear = date.getFullYear();
            if (period === "M" || period === "Y") {
                this._notifyChange(inst);
            }
        },

        /* Ensure a date is within any min/max bounds. */
        _restrictMinMax: function(inst, date) {
            var minDate = this._getMinMaxDate(inst, "min"),
                maxDate = this._getMinMaxDate(inst, "max"),
                newDate = (minDate && date < minDate ? minDate : date);
            return (maxDate && newDate > maxDate ? maxDate : newDate);
        },

        /* Notify change of month/year. */
        _notifyChange: function(inst) {
            var onChange = this._get(inst, "onChangeMonthYear");
            if (onChange) {
                onChange.apply((inst.input ? inst.input[0] : null),
                    [inst.selectedYear, inst.selectedMonth + 1, inst]);
            }
        },

        /* Determine the number of months to show. */
        _getNumberOfMonths: function(inst) {
            var numMonths = this._get(inst, "numberOfMonths");
            return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
        },

        /* Determine the current maximum date - ensure no time components are set. */
        _getMinMaxDate: function(inst, minMax) {
            return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
        },

        /* Find the number of days in a given month. */
        _getDaysInMonth: function(year, month) {
            return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
        },

        /* Find the day of the week of the first of a month. */
        _getFirstDayOfMonth: function(year, month) {
            return new Date(year, month, 1).getDay();
        },

        /* Determines if we should allow a "next/prev" month display change. */
        _canAdjustMonth: function(inst, offset, curYear, curMonth) {
            var numMonths = this._getNumberOfMonths(inst),
                date = this._daylightSavingAdjust(new Date(curYear,
                curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

            if (offset < 0) {
                date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
            }
            return this._isInRange(inst, date);
        },

        /* Is the given date in the accepted range? */
        _isInRange: function(inst, date) {
            var yearSplit, currentYear,
                minDate = this._getMinMaxDate(inst, "min"),
                maxDate = this._getMinMaxDate(inst, "max"),
                minYear = null,
                maxYear = null,
                years = this._get(inst, "yearRange");
                if (years){
                    yearSplit = years.split(":");
                    currentYear = new Date().getFullYear();
                    minYear = parseInt(yearSplit[0], 10) + currentYear;
                    maxYear = parseInt(yearSplit[1], 10) + currentYear;
                }

            return ((!minDate || date.getTime() >= minDate.getTime()) &&
                (!maxDate || date.getTime() <= maxDate.getTime()) &&
                (!minYear || date.getFullYear() >= minYear) &&
                (!maxYear || date.getFullYear() <= maxYear));
        },

        /* Provide the configuration settings for formatting/parsing. */
        _getFormatConfig: function(inst) {
            var shortYearCutoff = this._get(inst, "shortYearCutoff");
            shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
                new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
            return {shortYearCutoff: shortYearCutoff,
                dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
                monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
        },

        /* Format the given date for display. */
        _formatDate: function(inst, day, month, year) {
            if (!day) {
                inst.currentDay = inst.selectedDay;
                inst.currentMonth = inst.selectedMonth;
                inst.currentYear = inst.selectedYear;
            }
            var date = (day ? (typeof day === "object" ? day :
                this._daylightSavingAdjust(new Date(year, month, day))) :
                this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
            return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
        }
    });

    /*
     * Bind hover events for datepicker elements.
     * Done via delegate so the binding only occurs once in the lifetime of the parent div.
     * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
     */
    function bindHover(dpDiv) {
        var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
        return dpDiv.delegate(selector, "mouseout", function() {
                $(this).removeClass("ui-state-hover");
                if (this.className.indexOf("ui-datepicker-prev") !== -1) {
                    $(this).removeClass("ui-datepicker-prev-hover");
                }
                if (this.className.indexOf("ui-datepicker-next") !== -1) {
                    $(this).removeClass("ui-datepicker-next-hover");
                }
            })
            .delegate(selector, "mouseover", function(){
                if (!$.datepicker._isDisabledDatepicker( instActive.inline ? dpDiv.parent()[0] : instActive.input[0])) {
                    $(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
                    $(this).addClass("ui-state-hover");
                    if (this.className.indexOf("ui-datepicker-prev") !== -1) {
                        $(this).addClass("ui-datepicker-prev-hover");
                    }
                    if (this.className.indexOf("ui-datepicker-next") !== -1) {
                        $(this).addClass("ui-datepicker-next-hover");
                    }
                }
            });
    }

    /* jQuery extend now ignores nulls! */
    function extendRemove(target, props) {
        $.extend(target, props);
        for (var name in props) {
            if (props[name] == null) {
                target[name] = props[name];
            }
        }
        return target;
    }

    /* Invoke the datepicker functionality.
       @param  options  string - a command, optionally followed by additional parameters or
                        Object - settings for attaching new datepicker functionality
       @return  jQuery object */
    $.fn.datepicker = function(options){

        /* Verify an empty collection wasn't passed - Fixes #6976 */
        if ( !this.length ) {
            return this;
        }

        /* Initialise the date picker. */
        if (!$.datepicker.initialized) {
            $(document).mousedown($.datepicker._checkExternalClick);
            $.datepicker.initialized = true;
        }

        /* Append datepicker main container to body if not exist. */
        if ($("#"+$.datepicker._mainDivId).length === 0) {
            $("body").append($.datepicker.dpDiv);
        }

        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
            return $.datepicker["_" + options + "Datepicker"].
                apply($.datepicker, [this[0]].concat(otherArgs));
        }
        if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
            return $.datepicker["_" + options + "Datepicker"].
                apply($.datepicker, [this[0]].concat(otherArgs));
        }
        return this.each(function() {
            typeof options === "string" ?
                $.datepicker["_" + options + "Datepicker"].
                    apply($.datepicker, [this].concat(otherArgs)) :
                $.datepicker._attachDatepicker(this, options);
        });
    };

    $.datepicker = new Datepicker(); // singleton instance
    $.datepicker.initialized = false;
    $.datepicker.uuid = new Date().getTime();
    $.datepicker.version = "1.10.0";

    // Workaround for #4055
    // Add another global to avoid noConflict issues with inline event handlers
    window["DP_jQuery_" + dpuuid] = $;

    })(jQuery);
});

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
define('plugins/jquery-easing',['../jquery'], function(jQuery) {
    // t: current time, b: begInnIng value, c: change In value, d: duration
    jQuery.easing['jswing'] = jQuery.easing['swing'];

    jQuery.extend( jQuery.easing,
    {
        def: 'easeOutQuad',
        swing: function (x, t, b, c, d) {
            //alert(jQuery.easing.default);
            return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
        },
        easeInQuad: function (x, t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOutQuad: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },
        easeOutQuart: function (x, t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158; 
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        easeInBounce: function (x, t, b, c, d) {
            return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        easeInOutBounce: function (x, t, b, c, d) {
            if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
            return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
    });
});

// Generated by CoffeeScript 1.4.0

define('plugins/jquery-panels',['jquery'], function($) {
  /*
      jQuery plugin for an side-panel which can open and close on the
      left or right edge of the document.
  
      Methods are invoked by passing the method name as a string in the
      constructor method, e.g. `$(...).panel('open')`.
  
      Methods:
        `open` - Opens the panel
        `close` - Closes the panel
        'toggle` - Toggles the panel open/close state
  
      CSS classes:
        `.panel` - base class for panel container
        `.panel-toggle` - edge toggle on the panel itself which is kept
            exposed while in a closed state
        `.panel-right` - positions the panel on the right edge of the document
        `.panel-left` - positions the panel on the left edge of the document
        `.closed` - start the panel in a closed state
  
      HTML markup:
        <div class="panel panel-left closed">
            <div class="panel-toggle"></div>
            <div class="panel-content">
                ...
            </div>
        </div>
  */

  var Panel;
  Panel = function(element) {
    var css, toggle,
      _this = this;
    this.element = $(element);
    this.slideWidth = this.element.width();
    if ((toggle = this.element.children('.panel-toggle'))[0]) {
      toggle.on('click', function() {
        return _this.element.panel('toggle');
      });
      this.slideWidth -= toggle.width();
    }
    this.state = 1;
    if (this.element.hasClass('panel-right')) {
      this.side = 'right';
    } else {
      this.side = 'left';
    }
    if (this.element.hasClass('closed')) {
      this.state = 0;
      (css = {})[this.side] = -this.slideWidth;
      this.element.css(css).show();
    }
    return this;
  };
  Panel.prototype = {
    constructor: Panel,
    open: function() {
      var attrs;
      if (!this.state) {
        this.state = 1;
        (attrs = {})[this.side] = 0;
        return this.element.animate(attrs, 300).removeClass('closed');
      }
    },
    close: function() {
      var attrs;
      if (this.state) {
        this.state = 0;
        (attrs = {})[this.side] = -this.slideWidth;
        return this.element.animate(attrs, 300).addClass('closed');
      }
    },
    toggle: function() {
      if (this.state) {
        return this.close();
      } else {
        return this.open();
      }
    }
  };
  $.fn.panel = function(option) {
    return this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data('panel');
      if (!data) {
        $this.data('panel', (data = new Panel(this)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };
  $.fn.panel.Constructor = Panel;
  return $(function() {
    $('.panel').panel();
    return $('[data-toggle*=panel]').each(function() {
      var toggle;
      return (toggle = $(this)).on('click', function() {
        var panel;
        if (toggle.data('target')) {
          panel = $(toggle.data('target'));
        } else {
          panel = toggle.parent();
        }
        return panel.panel('toggle');
      });
    });
  });
});

// Generated by CoffeeScript 1.4.0

define('plugins/jquery-scroller',['jquery', 'underscore'], function($, _) {
  /*
      jQuery plugin for triggering a scroll event once a certain threshold is
      reached. A use case of this is the "infinite" scrolling element in which
      data is being populated in the element on-demand.
  
      Options:
        `container` - The container element that this element is scrolling
        relative to. Default is window
  
        `threshold` - Percent scrolled from the top of the element which triggers
          the event. Once this thresholder has been reached the `reset` method
          must be called to reset this state.
  
        `autofill` - For cases where each trigger event appends to this element
        (e.g. infinite scroll), this option will trigger the `scroller` event
        until this element's is greater than the container height.
  
        `resize` - Adds an event handler to trigger a reset when the window is
        resized.
  
        `trigger` - A single handler to fire when the `scroller` event fires.
        This can be bound directly to the element as a normal, but having it
        as an option keeps the code tidier.
  
      Methods are invoked by passing the method name as a string in the
      constructor method, e.g. `$(...).scroller('reset')`.
  
      Methods:
        `reset` - Resets the pre-calculated aboslute dimensions and thresholds.
          Use this when the element size changes.
  */

  var Scroller, defaultOptions;
  defaultOptions = {
    container: window,
    threshold: 0.75,
    autofill: false,
    resize: true,
    trigger: null
  };
  Scroller = function(element, options) {
    var _this = this;
    this.element = $(element);
    this.options = options;
    this.container = $(options.container);
    if (options.resize) {
      $(window).on('resize', _.debounce(function() {
        return _this.reset();
      }, 100));
    }
    this.container.on('scroll', _.debounce(function() {
      var scrollTop, threshold;
      scrollTop = _this.container.scrollTop();
      threshold = (_this.element.height() - _this.container.height()) * _this.options.threshold;
      if (!_this.reached && scrollTop >= threshold) {
        _this.reached = true;
        return _this.element.trigger('scroller');
      }
    }, 100));
    if (options.trigger) {
      this.element.on('scroller', options.trigger);
    }
    return this;
  };
  Scroller.prototype = {
    constructor: Scroller,
    reset: function() {
      this.reached = false;
      if (this.options.autofill && (this.element.height() - this.container.height()) < 0) {
        this.element.trigger('scroller');
      }
      return this;
    }
  };
  $.fn.scroller = function(option) {
    var options;
    if ($.isPlainObject(option)) {
      options = $.extend({}, defaultOptions, option);
    } else {
      options = $.extend({}, defaultOptions);
    }
    return this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data('scroller');
      if (!data) {
        $this.data('scroller', (data = new Scroller($this, options)));
      }
      if (typeof option === 'string') {
        return data[option]();
      }
    });
  };
  return $.fn.scroller.Constructor = Scroller;
});

// Generated by CoffeeScript 1.4.0
var __slice = [].slice;

define('cilantro/ui/core',['../core', 'date', 'inputio', 'plugins/backbone-marionette', 'plugins/backbone-charts', 'plugins/bootstrap', 'plugins/bootstrap-typeselect', 'plugins/bootstrap-datepicker', 'plugins/jquery-ui', 'plugins/jquery-easing', 'plugins/jquery-panels', 'plugins/jquery-scroller'], function(c) {
  var _constructor;
  c.Marionette = Backbone.Marionette;
  c.Marionette.View.prototype.publish = c.publish;
  c.Marionette.View.prototype.unsubscribe = c.unsubscribe;
  c.Marionette.View.prototype.subscribe = function(channel, handler, once) {
    var channels, _base, _ref;
    if (!(this._channels != null)) {
      this._channels = {};
    }
    if (!once) {
      channels = (_ref = (_base = this._channels)[channel]) != null ? _ref : _base[channel] = [];
      channels.push(handler);
    }
    c.subscribe(channel, handler, once);
  };
  c.Marionette.View.prototype.onClose = function() {
    var channel, handler, handlers, _i, _len, _ref;
    if (!(this._channels != null)) {
      return;
    }
    _ref = this._channels;
    for (channel in _ref) {
      handlers = _ref[channel];
      for (_i = 0, _len = handlers.length; _i < _len; _i++) {
        handler = handlers[_i];
        this.unsubscribe(channel, handler);
      }
    }
  };
  c.Marionette.View.prototype.bindSubscribers = function() {
    var channel, handler, method, _ref, _results;
    if (!(this.subscribers != null)) {
      return;
    }
    _ref = this.subscribers;
    _results = [];
    for (channel in _ref) {
      method = _ref[channel];
      if (!((handler = this[method]) != null)) {
        throw new Error("" + method + " not a method");
      }
      _results.push(this.subscribe(channel, handler));
    }
    return _results;
  };
  _constructor = c.Marionette.View.prototype.constructor;
  c.Marionette.View.prototype.constructor = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _constructor.call(this, args);
    return this.bindSubscribers();
  };
  return c;
});

// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define('cilantro/ui/views/concept/search',['../../core'], function(c) {
  var ConceptSearch;
  ConceptSearch = (function(_super) {

    __extends(ConceptSearch, _super);

    function ConceptSearch() {
      return ConceptSearch.__super__.constructor.apply(this, arguments);
    }

    ConceptSearch.prototype.className = 'concept-search';

    return ConceptSearch;

  })(c.Marionette.ItemView);
  return {
    ConceptSearch: ConceptSearch
  };
});

// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define('cilantro/ui/views/concept/item',['../../core'], function(c) {
  var Concept;
  Concept = (function(_super) {

    __extends(Concept, _super);

    function Concept() {
      return Concept.__super__.constructor.apply(this, arguments);
    }

    Concept.prototype.className = 'concept';

    return Concept;

  })(c.Marionette.ItemView);
  return {
    Concept: Concept
  };
});

// Generated by CoffeeScript 1.4.0
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define('cilantro/ui/views/concept/index',['../../core', './item'], function(c, items) {
  var ConceptIndex, ConceptIndexItem;
  ConceptIndexItem = (function(_super) {

    __extends(ConceptIndexItem, _super);

    function ConceptIndexItem() {
      this.inactivate = __bind(this.inactivate, this);

      this.activate = __bind(this.activate, this);
      return ConceptIndexItem.__super__.constructor.apply(this, arguments);
    }

    ConceptIndexItem.prototype.tagName = 'li';

    ConceptIndexItem.prototype.template = '<a href=#>{{ name }}</a>';

    ConceptIndexItem.prototype.events = {
      'click a': 'click'
    };

    ConceptIndexItem.prototype.subscribers = {
      'conceptform/active': 'activate',
      'conceptform/inactive': 'inactivate'
    };

    ConceptIndexItem.prototype.click = function(event) {
      event.preventDefault();
      return c.publish('concept/active', this.model.id);
    };

    ConceptIndexItem.prototype.activate = function(id) {
      if (id === this.model.id) {
        return this.$el.addClass('active');
      } else {
        return this.$el.removeClass('active');
      }
    };

    ConceptIndexItem.prototype.inactivate = function(id) {
      if (id === this.model.id) {
        return this.$el.removeClass('active');
      }
    };

    return ConceptIndexItem;

  })(items.Concept);
  ConceptIndex = (function(_super) {

    __extends(ConceptIndex, _super);

    function ConceptIndex() {
      return ConceptIndex.__super__.constructor.apply(this, arguments);
    }

    ConceptIndex.prototype.tagName = 'ul';

    ConceptIndex.prototype.className = 'concept-index';

    ConceptIndex.prototype.itemView = ConceptIndexItem;

    return ConceptIndex;

  })(c.Marionette.CollectionView);
  return {
    ConceptIndex: ConceptIndex,
    ConceptIndexItem: ConceptIndexItem
  };
  /*
      id: 'data-filters-accordian'
  
      className: 'accordian'
  
      events:
          'click .accordian-toggle': 'toggleCaret'
  
      groupTemplate: c._.template '
          <div class=accordian-group>
              <div class=accordian-heading>
                  <a class=accordian-toggle data-toggle=collapse href="#category-{{ id }}">{{ name }}</a>
                  <b class="caret closed"></b>
              </div>
              <div id="category-{{ id }}" class="accordian-body collapse">
                  <ul class="nav nav-list"></ul>
              </div>
          </div> 
      '
  
      initialize: ->
          @$el.addClass 'loading'
  
          @collection.when =>
              @$el.removeClass 'loading'
              @render()
              @collection.each (model, i) ->
                  if model.get 'queryview'
                      new QueryView model: model
  
      render: ->
          tree = categories: []
  
          for model in @collection.models
              if not model.get 'queryview' then continue
              attrs = model.attributes
  
              cat = null
              sub = id: null
  
              if attrs.category
                  if attrs.category.parent
                      cat = attrs.category.parent
                      sub = attrs.category
                  else
                      cat = attrs.category
                  
              if not (subtree = tree[cat.id])
                  tree.categories.push cat
                  subtree = tree[cat.id] = categories: []
              if not (models = subtree[sub.id])
                  if sub.id then subtree.categories.push sub
                  models = subtree[sub.id] = []
  
              # Models will be sorted relative to their groups later
              models.push model
  
  
          # Build the DOM tree
          cats = c._.sortBy tree.categories, 'order'
          if tree[null] then cats.push null
  
          # Process each category in the tree
          for cat in cats
              if not cat
                  cat = id: null, name: 'Other'
  
              $group = c.dom @groupTemplate cat
              @$el.append $group
              $list = $group.find '.accordian-body ul'
  
              subtree = tree[cat.id]
              subcats = c._.sortBy subtree.categories, 'order'
              if subtree[null] then subcats.push null
  
              # Process each category in the subtree
              for sub in subcats
                  if sub
                      id = sub.id
                      name = sub.name
                  else
                      id = null
                      name = 'Other'
  
                  # Add section header in group list
                  $list.append "<li class=nav-header>#{ name }</li>"
                  $list.append "<li class=divider>#{ name }</li>"
  
                  models = subtree[id]
  
                  for model in models
                      view = new ConceptItemView model: model
                      $list.append view.render()
  
              if subcats.length is 1
                  $list.find('.nav-header').remove()
                  $list.find('.divider').remove()
                  
          # Single category items, hide the only group
          # heading for simplicity
          if cats.length is 1
              $group.find('.accordian-heading').remove()
              $group.find('.accordian-body').removeClass('collapse')
  
          return @$el
  
      toggleCaret: (event) ->
          target = c.dom(event.target)
          target.siblings('.caret').toggleClass('closed')
  */

});

// Generated by CoffeeScript 1.4.0
var __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define('cilantro/ui/views/concept',['../core', './concept/search', './concept/item', './concept/index'], function() {
  var ConceptForm, ConceptWorkspace, c, mods, _ref;
  c = arguments[0], mods = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  ConceptWorkspace = (function(_super) {

    __extends(ConceptWorkspace, _super);

    function ConceptWorkspace() {
      return ConceptWorkspace.__super__.constructor.apply(this, arguments);
    }

    ConceptWorkspace.prototype.className = 'concept-workspace';

    return ConceptWorkspace;

  })(c.Marionette.CollectionView);
  ConceptForm = (function(_super) {

    __extends(ConceptForm, _super);

    function ConceptForm() {
      return ConceptForm.__super__.constructor.apply(this, arguments);
    }

    ConceptForm.prototype.className = 'concept-form';

    return ConceptForm;

  })(c.Marionette.ItemView);
  return (_ref = c._).extend.apply(_ref, [{
    ConceptWorkspace: ConceptWorkspace,
    ConceptForm: ConceptForm
  }].concat(__slice.call(mods)));
});

// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define('cilantro/ui/views/field',['../core'], function(c) {
  var FieldContainer, FieldControl, FieldStats;
  FieldContainer = (function(_super) {

    __extends(FieldContainer, _super);

    function FieldContainer() {
      return FieldContainer.__super__.constructor.apply(this, arguments);
    }

    FieldContainer.prototype.className = 'field-container';

    return FieldContainer;

  })(c.Marionette.ItemView);
  FieldStats = (function(_super) {

    __extends(FieldStats, _super);

    function FieldStats() {
      return FieldStats.__super__.constructor.apply(this, arguments);
    }

    FieldStats.prototype.className = 'field-stats';

    return FieldStats;

  })(c.Marionette.ItemView);
  FieldControl = (function(_super) {

    __extends(FieldControl, _super);

    function FieldControl() {
      return FieldControl.__super__.constructor.apply(this, arguments);
    }

    FieldControl.prototype.className = 'field-control';

    return FieldControl;

  })(c.Marionette.ItemView);
  return {
    FieldContainer: FieldContainer,
    FieldStats: FieldStats,
    FieldControl: FieldControl
  };
});

// Generated by CoffeeScript 1.4.0
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define('cilantro/ui/views/filter',['../core'], function(c) {
  var Filter, NamedFilter;
  Filter = (function(_super) {

    __extends(Filter, _super);

    function Filter() {
      return Filter.__super__.constructor.apply(this, arguments);
    }

    Filter.prototype.className = 'filter';

    return Filter;

  })(c.Marionette.ItemView);
  NamedFilter = (function(_super) {

    __extends(NamedFilter, _super);

    function NamedFilter() {
      return NamedFilter.__super__.constructor.apply(this, arguments);
    }

    NamedFilter.prototype.className = 'named-filter';

    NamedFilter.prototype.itemView = Filter;

    return NamedFilter;

  })(c.Marionette.CollectionView);
  return {
    NamedFilter: NamedFilter,
    Filter: Filter
  };
});

// Generated by CoffeeScript 1.4.0
var __slice = [].slice;

define('cilantro/ui/views',['underscore', './views/concept', './views/field', './views/filter'], function() {
  var mods, _;
  _ = arguments[0], mods = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  return _.extend.apply(_, [{}].concat(__slice.call(mods)));
});

// Generated by CoffeeScript 1.4.0

define('cilantro/ui/regions',['./core'], function() {});

// Generated by CoffeeScript 1.4.0

define('cilantro/ui/layouts',['./core'], function() {});

// Generated by CoffeeScript 1.4.0

define('cilantro/ui',['./core', './ui/views', './ui/regions', './ui/layouts'], function(c, views, regions, layouts) {
  c.ui = {
    views: views,
    regions: regions,
    layouts: layouts
  };
  return c;
});
