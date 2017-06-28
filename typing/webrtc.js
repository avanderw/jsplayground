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
        webrtc.localConnection.onicecandidate = function (e) {
            webrtc.onIceCandidate(webrtc.localConnection, e);
        };

        webrtc.sendChannel = webrtc.localConnection.createDataChannel('sendDataChannel', webrtc.dataConstraint);
        webrtc.sendChannel.onopen = webrtc.onSendChannelStateChange;
        webrtc.sendChannel.onclose = webrtc.onSendChannelStateChange;

        window.remoteConnection = webrtc.remoteConnection = new RTCPeerConnection(servers, webrtc.pcConstraint);
        webrtc.remoteConnection.ondatachannel = webrtc.receiveChannelCallback;
        webrtc.remoteConnection.onicecandidate = function (e) {
            webrtc.onIceCandidate(webrtc.remoteConnection, e);
        };

        webrtc.localConnection.createOffer().then(
            function (offer) {
                webrtc.localConnection.setLocalDescription(offer);
                webrtc.remoteConnection.setRemoteDescription(offer);
                console.info('localConnection.createOffer.success');
                webrtc.remoteConnection.createAnswer().then(
                    function (answer) {
                        webrtc.remoteConnection.setLocalDescription(answer);
                        webrtc.localConnection.setRemoteDescription(answer);
                        console.info('remoteConnection.createAnswer.success');
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
            console.info('receiveChannel.onmessage: ' + event.data);
        };
        webrtc.receiveChannel.onopen = webrtc.onReceiveChannelStateChange;
        webrtc.receiveChannel.onclose = webrtc.onReceiveChannelStateChange;
    },
    disconnectPeers: function () {
        'use strict';
        webrtc.sendChannel.close();
        webrtc.receiveChannel.close();

        webrtc.localConnection.close();
        webrtc.remoteConnection.close();

        webrtc.sendChannel = null;
        webrtc.receiveChannel = null;
        webrtc.localConnection = null;
        webrtc.remoteConnection = null;
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
            webrtc.sendChannel.send("data");
        } else {
            console.warn('receiveChannel.notready');
        }
    }
};
