/*global RTCPeerConnection,console*/
var webrtc = {
    pcConstraint: null,
    dataContstraint: null,
    sendChannel: null,
    receiveChannel: null,
    localConnection: null,
    remoteConnection: null,

    createConnection: function () {
        'use strict';
        var servers = null;
        webrtc.pcConstraint = null;
        webrtc.dataConstraint = null;
        window.localConnection = webrtc.localConnection = new RTCPeerConnection(servers, webrtc.pcConstraint);
        webrtc.sendChannel = webrtc.localConnection.createDataChannel('sendDataChannel', webrtc.dataConstraint);

        webrtc.localConnection.onicecandidate = function (e) {
            webrtc.onIceCandidate(webrtc.localConnection, e);
        };

        webrtc.sendChannel.onopen = webrtc.onSendChannelStateChange;
        webrtc.sendChannel.onclose = webrtc.onSendChannelStateChange;

        window.remoteConnection = webrtc.remoteConnection = new RTCPeerConnection(servers, webrtc.pcConstraint);
        webrtc.remoteConnection.onicecandidate = function (e) {
            webrtc.onIceCandidate(webrtc.remoteConnection, e);
        };
        webrtc.remoteConnection.ondatachannel = webrtc.receiveChannelCallback;

        webrtc.localConnection.createOffer().then(
            function (desc) {
                webrtc.localConnection.setLocalDescription(desc);
                console.info('localConnection.createOffer.success');
                webrtc.remoteConnection.setRemoteDescription(desc);
                webrtc.remoteConnection.createAnswer().then(
                    function (desc) {
                        webrtc.remoteConnection.setLocalDescription(desc);
                        console.info('remoteConnection.createAnswer.success');
                        webrtc.localConnection.setRemoteDescription(desc);
                    },
                    function (err) {
                        console.error('remoteConnection.createAnswer.failed');
                    }
                );
            },
            function (err) {
                console.error('localConnection.createOffer.failed');
            }
        );
    },
    getOtherPc: function (pc) {
        'use strict';
        return (pc === webrtc.localConnection) ? webrtc.remoteConnection : webrtc.localConnection;
    },
    getName: function (pc) {
        'use strict';
        return (pc === webrtc.localConnection) ? 'localConnection' : 'remoteConnection';
    },
    receiveChannelCallback: function (event) {
        'use strict';
        webrtc.receiveChannel = event.channel;
        webrtc.receiveChannel.onmessage = function (event) {
            console.info(event.data);
        };
        webrtc.receiveChannel.onopen = webrtc.onReceiveChannelStateChange;
        webrtc.receiveChannel.onclose = webrtc.onReceiveChannelStateChange;
    },
    onIceCandidate: function (pc, event) {
        'use strict';
        webrtc.getOtherPc(pc).addIceCandidate(event.candidate).then(
            function () {
                console.info('addIceCandidate.success');
            },
            function (err) {
                console.error('addIceCandidate.failed: ' + err);
            }
        );
        console.info(webrtc.getName(pc) + ' ' + (event.candidate ? event.candidate.candidate : '(null)'));
    },
    onSendChannelStateChange: function () {
        'use strict';
        var readyState = webrtc.sendChannel.readyState;
        if (readyState === 'open') {
            console.info('sendChannelState.ready');
        } else {
            console.warn('sendChannelState.notready');
        }
    },
    onReceiveChannelStateChange: function () {
        'use strict';
        var readyState = webrtc.receiveChannel.readyState;
        if (readyState === 'open') {
            console.info('receiveChannel.ready');
        } else {
            console.warn('receiveChannel.notready');
        }
    }
};
