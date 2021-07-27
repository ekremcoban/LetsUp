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

// Aktiviteye uye oldugunda
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

    return admin.messaging().sendToDevice(ownerToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
    }).catch(e => {
        console.log('memberNotifications is error --> ')
    })
});

// Aktivite silindiginde
exports.activityNotifications=functions.firestore.document('Activities/{id}').onUpdate(async event => {
    const id = event.after.get('id');
    const name = event.after.get('name');
    const state = event.after.get('state');

    const message = {
        notification: {
            title: 'Info',
            body: `${name} was canceled`
        },
   }
        
    if (state == false) {
        const members = await db.collection('Members')
        .where('activityId', '==', id)
        .where('memberState', '==', true)
        .get();

        // await admin.messaging().sendToDevice(members.docs[0].data().memberToken, message).then(res => {
        //     console.log('activitiesNotifications is succeess 1', name)
        // }).catch(e => {
        //     console.log('activitiesNotifications is error 1', e)
        // })

        members.docs.map(async member => {
            await admin.messaging().sendToDevice(member.data().memberToken, message).then(res => {
                console.log('activitiesNotifications is succeess --> ', name)
            }).catch(e => {
                console.log('activitiesNotifications is error --> ', e)
            })
        })
    }
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