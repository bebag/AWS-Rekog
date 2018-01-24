angular.module('FirePlaceReKog',['webcam'])
    .factory('WebcamService', WebcamService)
    .controller('WebcamController', WebcamController);

WebcamService.$inject = [];

function WebcamService () {
    var webcam = {};
    webcam.isTurnOn = false;
    webcam.patData = null;
    var _video = null;
    var _stream = null;
    webcam.patOpts = {x: 0, y: 0, w: 25, h: 25};
    webcam.channel = {};
    webcam.webcamError = false;

    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);
        return ctx.getImageData(x, y, w, h);
    };

    var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
        webcam.snapshotData = imgBase64;
    };

    webcam.makeSnapshot = function() {
        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;

            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            var ctxPat = patCanvas.getContext('2d');

            var idata = getVideoData(webcam.patOpts.x, webcam.patOpts.y, webcam.patOpts.w, webcam.patOpts.h);
            ctxPat.putImageData(idata, 0, 0);

            sendSnapshotToServer(patCanvas.toDataURL());
            webcam.patData = idata;
            webcam.snapsuccess(webcam.snapshotData.substr(webcam.snapshotData.indexOf('base64,') + 'base64,'.length), 'image/png');
	    //            webcam.turnOff();
        }
    };

    webcam.onSuccess = function () {
        _video = webcam.channel.video;
        webcam.patOpts.w = _video.width;
        webcam.patOpts.h = _video.height;
        webcam.isTurnOn = true;
    };

    webcam.onStream = function (stream) {
        activeStream = stream;
        return activeStream;
    };

    webcam.downloadSnapshot = function downloadSnapshot(dataURL) {
        window.location.href = dataURL;
    };

    webcam.onError = function (err) {
        webcam.webcamError = err;
    };

    webcam.turnOff = function () {
        webcam.isTurnOn = false;
        if (activeStream && activeStream.getVideoTracks) {
            const checker = typeof activeStream.getVideoTracks === 'function';
            if (checker) {
                return activeStream.getVideoTracks()[0].stop();
            }
            return false;
        }
        return false;
    };

    var service = {
        webcam: webcam
    };
    return service;
};


WebcamController.$inject = ['WebcamService', '$http'];

function WebcamController (WebcamService, $http) {
    var self=this;
    var photo, fotoContentType, name="Your_Name";
    var showweb = true;
    var webcamOn = -1;
    var webcam = WebcamService.webcam;
    //override function for be call when capture is finalized
    webcam.snapsuccess = function(image, type) {
        self.photo = image;
        self.fotoContentType = type;
        self.webcamOn = 1;
    };

    function turnOffWebCam() {
        if(self.webcam && self.photo && self.webcam.isTurnOn===true) {
            self.webcam.turnOff();
            self.showweb = false;
            self.webcamOn = 0;
        }
    }

    function turnOnWebCam() {
	self.showweb=true;
        self.webcamOn = 1;
    }

    var formdata = new FormData();

    function register() {
	formdata.set('image', self.photo); 
	formdata.set('username', self.name);
        var request = {
            method: 'POST',
            url: '/snap-register',
	    transformRequest: angular.identity,
            data: formdata,
            headers: {
                'Content-Type': undefined
            }
        };

        // SEND THE FILES.
        $http(request);
    }

    angular.extend(this, {
	showweb: showweb,
	webcam: webcam,
        photo: photo,
        webcamOn: webcamOn,
        fotoContentType: fotoContentType,
        turnOffWebCam: turnOffWebCam,
	turnOnWebCam: turnOnWebCam,
	name: name,
	register: register
    });
}