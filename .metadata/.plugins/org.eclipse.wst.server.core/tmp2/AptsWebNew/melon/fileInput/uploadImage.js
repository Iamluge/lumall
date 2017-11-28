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
var uploaderImage = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',//上传插件初始化的顺序
	browse_button : 'selectfiles', //监听按钮ID，唯一
    //runtimes : 'flash',
	container: document.getElementById('container'),//选择文件后盛放的地方
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
	unique_names :true,
    url : host,
	init: {
		//init后调用
		PostInit: function() {
			document.getElementById('ossfile').innerHTML = '';
			document.getElementById('postfiles').onclick = function() {
				if(document.getElementById('ossfile').innerHTML == ''){
					toastr.error("选择要上传的图片");
				}else{
					uploaderImage.start();
				}
				return false;
			};
		},
		//文件加入上传队列后调用
		FilesAdded: function(up, files) {
			$('#ossfile').empty();
			$('#loadImage').attr('src','');
			plupload.each(files, function(file) {
				document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
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
            //alert(info.status)
			//=======加载图片=======
			previewImage(file,showImage);
			//=========加载结束===============
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
            			'fileType':'picture'
            		},
            		success : function(result) {
            			var sof = result.successOrFalse;
            			if (sof == "success") {
            				//上传成功后完善其他信息
            				var uploadUrl = result.extJson;
            				$('#OSSuploadModal').modal('hide');
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
			console.info(err.response);
			document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
		}
	}
});

uploaderImage.init();



/**
 * 预览图片方法
 * @param file
 * @param callback
 */
function previewImage(file, callback) {//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
    if (!file || !/image\//.test(file.type)) return; //确保文件是图片
    if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
        var fr = new mOxie.FileReader();
        fr.onload = function () {
            callback(fr.result);
            fr.destroy();
            fr = null;
        }
        fr.readAsDataURL(file.getSource());
    } else {
        var preloader = new mOxie.Image();
        preloader.onload = function () {
            //preloader.downsize(300, 300);//先压缩一下要预览的图片,宽300，高300
            var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
            callback && callback(imgsrc); //callback传入的参数为预览图片的url
            preloader.destroy();
            preloader = null;
        };
        preloader.load(file.getSource());
    }
}

/**
 * 预览图片回调函数
 */
function showImage(imgsrc){
	$('#loadImage').attr('src',imgsrc);
}