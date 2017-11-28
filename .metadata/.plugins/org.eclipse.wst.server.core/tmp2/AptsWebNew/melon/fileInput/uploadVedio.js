var policyText = {
    "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    "conditions": [
    ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
    ]
};

accessid= 'SuA9mxov14ySn8Gz';
accesskey= 'U1yXyrq8f3ADhkGPxNicnavMrKJfWb';
host = 'http://sunnbucket.oss-cn-shenzhen.aliyuncs.com';


var policyBase64 = Base64.encode(JSON.stringify(policyText))
message = policyBase64
var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true }) ;
var signature = Crypto.util.bytesToBase64(bytes);
var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',//上传插件初始化的顺序
	browse_button : 'selectVedio', //监听按钮ID，唯一
    //runtimes : 'flash',
	container: document.getElementById('VedioContainer'),//选择文件后盛放的地方
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
	unique_names :true,
    url : host,
	init: {
		//init后调用
		PostInit: function() {
			document.getElementById('ossVedio').innerHTML = '';
			document.getElementById('postVedio').onclick = function() {
				if(document.getElementById('ossVedio').innerHTML == ''){
					toastr.error("选择要上传的视频");
				}else{
					uploader.start();
				}
				return false;
			};
		},
		//文件加入上传队列后调用
		FilesAdded: function(up, files) {
			$('#ossVedio').empty();
			plupload.each(files, function(file) {
				document.getElementById('ossVedio').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
				+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
				+'</div>';
			});
		},
		//上传进度条改变时调用
		UploadProgress: function(up, file) {
			var d = document.getElementById(file.id);
			d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            
            var prog = d.getElementsByTagName('div')[0];
			var progBar = prog.getElementsByTagName('div')[0]
			progBar.style.width= 2*file.percent+'px';
			progBar.setAttribute('aria-valuenow', file.percent);
		},
		//文件上传成功后调用
		FileUploaded: function(up, file, info) {
            if (info.status >= 200 || info.status < 200)
            {	//获取四个参数，aiax传到后台;后台返回错误信息，删除OSS的文件、后台返回成功信息，显示成功信息
            	//流程id
            	var proId =$('#productProcessorInfoManage_Table').find(":checkbox:checked").val(); 
            	//文件名、文件类型（picture）、文件大小，缩略图（null）
            	var fileName = file.name;
            	var fileSize = file.size;
            	$.ajax({
            		url : '../resourceUrl/addUploadProcessorInfo.action',
            		dataType : "json",
            		cache : false,
            		async : false,
            		method : "POST",
            		data : {
            			'proId':proId,
            			'fileName':fileName,
            			'fileSize':fileSize,
            			'fileType':'vedio'
            		},
            		success : function(result) {
            			var sof = result.successOrFalse;
            			if (sof == "success") {
            				//上传成功后完善其他信息
            				var uploadUrl = result.extJson;
            				$('#OSSuploadVedioModal').modal('hide');
            				//把新生成的urlId赋值给隐藏变量
            				$('#uploadUrl').val(uploadUrl);
                        	toastr.success(result.meassage);
                        	$('#OssuploadImageId').attr("disabled","disabled");
                        	$('#uploadChangeBtn').attr("disabled","disabled");
            			} else if (sof == "false") {
            				//删除上传到OSS的图片
            				
            			}
            		}
            	});
            }
            else
            {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
            } 
		},
		//上传文件之间进行参数设置，主要对文件名进行唯一设置，保证不重复
		BeforeUpload:function(up, file) {
			file.name = file.target_name;
		    up.settings.multipart_params = {
		        'Filename': '${filename}', 
		        'key' : file.name,//上传文件名设置
				'policy': policyBase64,
		        'OSSAccessKeyId': accessid, 
		        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
				'signature': signature,
		    };
		},
		//上传错误时调用
		Error: function(up, err) {
			document.getElementById('VedioContainer').appendChild(document.createTextNode("\nError xml:" + err.response));
		}
	}
});

uploader.init();
