function rendering(path) {
  fs = require('fs');

	fs.readFile(path, function (error, text) {
    if (error != null) {
      alert('error : ' + error);
      return;
    }
    document.getElementById("content").innerHTML = marked(text.toString());

		Config = require('electron-config');
		config = new Config();
		
		config.set('CURRENT_FILE', path);
  });
}

// ファイルリストを取得。mdファイルのみ。
function updateFileListPain(dir) {
	fs = require('fs');
	path = require('path');

	if (dir.length == 0) retrun;
	fs.readdir(dir, function(err, files){
		if (err) throw err;
		var fileList = [];
		files.filter(function(file){
			target = dir + path.sep + file;
			console.log(target);
			return fs.statSync(target).isFile() && /.*\.md$/.test(target); //絞り込み
		}).forEach(function (file) {
				fileList.push(file);
		});

    // 画面に反映
		fileListHtml = "";
		for(fileName of fileList) {
			filePath = dir + path.sep + fileName;
			filePath = filePath.replace(/\\/g, "\\\\");
			console.log(filePath);
			fileListHtml += "<div class='files-item-div'>\n"
				+ "  <input type='radio' class='files-item-radio' name='filename' id='"+fileName+"' onclick='rendering(\""+filePath+"\")'><label for='"+fileName+"' class='files-item-label'>"+fileName+"</label>\n"
				+ "</div>\n";
		}

		document.getElementById('files').innerHTML = fileListHtml;
  });
}

function selectTargetDir() {
//	remote = require('electron').remote;
	Dialog = require('electron').remote.dialog;
	
	Dialog.showOpenDialog(null, {
		properties: ['openDirectory'],
		title: 'フォルダの選択',
		defaultPath: '.'
	}, function (folderNames) {
		Config = require('electron-config');
		config = new Config();
		console.log(folderNames);
		config.set('TARGET_DIR', folderNames[0]);
		document.getElementById('target-dir').innerHTML = folderNames[0];

		updateFileListPain(folderNames[0]);
	});
}

function init() {
	Config = require('electron-config');
  config = new Config();

	targetDir = new String(config.get('TARGET_DIR'));
  if (targetDir === "undefined") targetDir = "";

	if (targetDir.length > 0) {
		targetDir = "フォルダを選択してください";
	} else {
		updateFileListPain(tergetDir);	
	}
	document.getElementById('target-dir').innerHTML = targetDir;

	currentFile = config.get('CURRENT_FILE');
	if (currentFile !== undefined) {
		if (currentFile.trim.length > 0) {
			rendering(currentFile);
		}
	}
}