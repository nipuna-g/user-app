var push = {
    initNotification: function(){
        var socket = io.connect('http://nipuna.me:8080');

        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(push.successHandler, push.errorHandler,{"senderID":"746177160616","ecb":"push.onNotificationGCM"});
    },
    successHandler: function (result) {
        //alert('Callback Success! Result = '+result)
    },
    errorHandler: function (error) {
        //alert(error);
    },
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    socket.emit('userConnect', e.regid);
                    alert('registration id = '+e.regid);
                }
                break;

            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                alert('message = '+e.message+' msgcnt = '+e.msgcnt);
                break;

            case 'error':
                alert('GCM error = '+e.msg);
                break;

            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    }
}