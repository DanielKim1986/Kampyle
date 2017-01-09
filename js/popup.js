var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
var monthNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct","Nov", "Dec"];
function validate_email(value){
	with (value)
	{
		apos=value.indexOf("@");
		dotpos=value.lastIndexOf(".");
		if (apos<1||dotpos-apos<2){
				return false;
		}
		else {
				return true;
		}
	}
}
function convert_mili(d) {
    var n = d.getTime();
    return n;
}
function getURL(){
	chrome.tabs.getSelected(null, function(tab) {
		var tabId = tab.id;
		var tabUrl = tab.url;
		return tabUrl;
	});
}
function showOverview(){
	$('.loading').show();
	$('#logout').show();
	$('.wrapper-login').hide();
	$('.wrapper-overview').hide();
	var today = new Date();
	var priorDate = new Date(new Date().setDate(today.getDate()-30));
	var startDate = convert_mili(priorDate);
	var endDate = convert_mili(today);
	var cur_Url = getURL();
	$.ajax({
		type: "GET",
		url: "https://remoteqa1.kampyle.com/kma/api/feedback/count?endDate="+endDate+"&startDate="+startDate+"&filterUrl="+cur_Url,
		headers: {
			"Authorization": "Basic " + localStorage.getItem('token')
		},
		success: function (data, textStatus, jqXHR){
			$('.loading').hide();
			$('.wrapper-overview').show();
			$("#total-feedback").html(data['totalFeedback']);
		}
	});
	$.ajax({
		type: "GET",
		url: "https://remoteqa1.kampyle.com/kma/api/website/calculated/grade?endDate="+endDate+"&startDate="+startDate+"&filterUrl="+cur_Url,
		headers: {
			"Authorization": "Basic " + localStorage.getItem('token')
		},
		success: function (data, textStatus, jqXHR){
			$('.loading').hide();
			$('.wrapper-overview').show();
			$("#average-csat").html(data['grade']);
		}
	});
	$.ajax({
		type: "GET",
		url: "https://remoteqa1.kampyle.com/kma/api/website/calculated/nps?endDate="+endDate+"&startDate="+startDate+"&filterUrl="+cur_Url,
		headers: {
			"Authorization": "Basic " + localStorage.getItem('token')
		},
		success: function (data, textStatus, jqXHR){
			$('.loading').hide();
			$('.wrapper-overview').show();
			$("#promoter-score").html(data['nps']);
		}
	});
	$.ajax({
		type: "GET",
		url: "https://remoteqa1.kampyle.com/kma/api/reports/feedbackActivity?endDate="+endDate+"&startDate="+startDate+"&filterUrl="+cur_Url,
		headers: {
			"Authorization": "Basic " + localStorage.getItem('token')
		},
		success: function (data, textStatus, jqXHR){
			$('.loading').hide();
			$('.wrapper-overview').show();
			var feedback_value = [];
			var category = [];
			if(data){
				for(var i=2; i<=31; i++){
					feedback_value.push(data["allReports"]["feedbackActivity"]["reportSplineUnits"][0]["data"][i][1]);
					var date = new Date(data["allReports"]["feedbackActivity"]["reportSplineUnits"][0]["data"][i][0]);
					var day = date.getDate();
					var monthIndex = date.getMonth();
					category.push(monthNames[monthIndex]+" "+day);
				}
				$('#container').highcharts({
					chart: {
							type: 'column',
					},
					title:{
						text:''
					},
					legend: {
							enabled: false
					},
					xAxis: {
							categories: category
					},
					yAxis: {
						labels: {
									enabled: true
							},
							title: ''
					},
					plotOptions: {
							series: {
									pointWidth: 20
							}
					},
					series: [{
							name: 'Feedback',
							data: feedback_value
					}, ]
				});
			}
		}
	});
}
$( document ).ready(function(){
	if(localStorage.getItem("token")){
		showOverview();
	}else{
		$('.wrapper-login').show();
		$('.wrapper-overview').hide();
	}
	$('#logout i').click(function(){
		localStorage.removeItem('token');
		$('.loading').hide();
		$('.wrapper-overview').hide();
		$('.wrapper-login').show();
		$('#logout').hide();
	});
	$(".tabs-menu a").click(function(event) {
		event.preventDefault();
		$(this).parent().addClass("current");
		$(this).parent().siblings().removeClass("current");
		var tab = $(this).attr("href");
		$(".tab-content").not(tab).css("display", "none");
		$(tab).fadeIn();
	});
	$("#login").click(function(){
		if($('#mail').val().length==""){
			var yellow = $("#mail").addClass("yellow");
			setTimeout(function() {
				 yellow.removeClass("yellow");
			}, 2000);
		}else{
			if(!validate_email($("#mail").val())){
				var yellow = $("#mail").addClass("yellow");
				setTimeout(function() {
					 yellow.removeClass("yellow");
				}, 2000);
			}else{
				if($('#password').val().length==""){
					var yellow = $("#password").addClass("yellow");
					setTimeout(function() {
						 yellow.removeClass("yellow");
					}, 2000);
				}else{
					$.ajax({
							url : "https://remoteqa1.kampyle.com/kma/api/security/doLogin?username="+$('#mail').val()+"&password="+$('#password').val(),
							type: "GET",
							success: function(data, textStatus, jqXHR)
							{
								if(data["resultCode"]=="FAILURE"){
									$(".error-message").show();
									setTimeout(function() {
										$(".error-message").hide();
									}, 2000);
								}else if(data["resultCode"]=="SUCCESS"){
									localStorage.setItem('token',Base64.encode($('#mail').val()+':'+$('#password').val()))
									showOverview();
								}
							},
							error: function (jqXHR, textStatus, errorThrown)
							{
								$(".error-message").show();
								setTimeout(function() {
									$(".error-message").hide();
								}, 2000);
							}
					});
				}
			}
		}
	});
});

