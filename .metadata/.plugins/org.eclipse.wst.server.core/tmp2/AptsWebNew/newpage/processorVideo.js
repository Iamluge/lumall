var videoData = {};

var myPlayer;

$(document).ready(function() {
	myPlayer = videojs("my_video_1");
});
/**
 * 加载视频数据
 */
function videoInfo() {
	var proId = request.QueryString("proId");
	var index = request.QueryString("index");
	$.ajax({
		url : '../resourceUrl/findResourceOSSUrl.action',
		method : "POST",
		dataType : "json",
		cache : false,
		async : false,
		data : {
			'proId' : proId,
			'resourceType' : 'vedio'
		},
		success : function(result) {
			videoData = result[index];
			$('#vedioProcessor').text(videoData.processorInfo.title);
			$('#vedioTitle').text(videoData.title);
			$('#vedioDescription').text(videoData.description);
			$('#vedioUploadDate').text(videoData.uploadDate.replace("T", " "));
			$('#vedioMp4Src').attr("src",videoData.urlContext);
			$('#vedioWebmSrc').attr("src",videoData.urlContext);
			myPlayer.src(videoData.urlContext);
		}
	});
}

/**
 * 获取页面间传递的参数
 */
var request = {
	QueryString : function(val) {
		var uri = window.location.search;
		var re = new RegExp("" + val + "=([^&?]*)", "ig");
		return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1))
				: null);
	}
}