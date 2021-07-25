const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config());
const db = admin.firestore();



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// const createNotification = (noti => {
// return admin.firestore().collection('notifications').add(noti)
// .then(a => console.log('Sent'), noti) 
// })

// exports.members = functions.firestore.document('Members/{id}')
// .onWrite( event => {

//     const id = event.after.id;
//     // const notification = {
//     //     content:'Test 1',
//     //     user: 'Ekrem',
//     //     time: admin.firestore.FieldValue.serverTimestamp()
//     // }
//         var message = {
//         notification: {
//             title:'Test 1',
//             body: 'Ekrem',
//         },
//     };

//     const topis = "notification"

//     return admin.messaging().sendToTopic(topis, message).then(res => {
//         console.log('basarili', res);
//     }).catch(err => {
//         console('hata', err)
//     })
// })

exports.memberNotifications=functions.firestore.document('Members/{id}').onWrite(async event => {
    const ownerName = event.after.get('ownerName');
    const memberName = event.after.get('memberName');
    const ownerToken = event.after.get('ownerToken');

    const message = {
        notification: {
            title: 'New Request',
            body: `${memberName} sent a request`
        },
   }

   const token = 'ffG1NrKSRhCiFKCBh4mtOu:APA91bEdg3WE52gv5pcePSSUChrznt0ohAj5aTGSqIfWtjQukRknypiCDsgFVvTq9PVI7_vG_ca9kyoTWaBXwCAnh4RG2EPplIf2_LMI8_uvqF-sFXV98Ht7jWvKKX21JDAiE7_AOLcG';
 

    const topic = 'memberNotifications';

    return admin.messaging().sendToDevice(ownerToken, message).then(res => {
        console.log('memberNotifications is succeess', ownerName, memberName)
    }).catch(e => {
        console.log('memberNotifications is error')
    })
});




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// const createNotification = (noti => {
// return admin.firestore().collection('notifications').add(noti)
// .then(a => console.log('Sent'), doc) 
// })

// exports.members = functions.firestore.document('Members/{id}')
// .onCreate(async doc => {

//     var message = {
//         notification: {
//             title:'Test 1',
//             body: 'Ekrem',
//         },
//         topic: 'namelesscoder',
//     };

//     let response = await admin.messaging().send(message);
//     console.log(response);
// });

// exports.sendNotifications = functions.firestore.document('Members/{owner}').onWrite(async (event) => {
//     const owner = event.after.get('owner');
//     const userDoc = await admin.firestore().doc(`Users/${email}`).get();
//     const fcmToken = userDoc.get('fcm');

//     var message = {
//         otification: {
//             title: 'Baslik',
//             body: 'Test',
//         },
//         token: fcmToken,
//     }
//     let response = await admin.messaging().send(message);
//     console.log(response);
// });

// exports.sendNotifications = functions.firestore.document("/Members/{id}").onCreate( async (snapShot, context) => {
//     const {owner, member} = snapShot.data();

//     admin.messaging().sendToDevice(owner, {
//         notification: {
//             title: 'Test 1',
//             body: 'Iam here' 
//         },
//     });
// });