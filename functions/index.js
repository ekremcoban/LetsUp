const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config());
const db = admin.firestore();

exports.usersUpdate=functions.firestore.document('Users/{id}').onUpdate(async event => {
    const id = event.after.get('id');

    const user = await db.collection('Users')
    .where('id', '==', id)
    .get();

    const activities = await db.collection('Activities')
    .where('owner.id', '==', id)
    .get();

    activities.docs.map(activity => {
        let activityTemp = activity.data();
        activityTemp.owner = user.docs[0].data();

        db.collection('Activities')
        .doc(activity.id)
        .set(activityTemp)
        .then(() => {
            console.log('Activity', ' Update');
          })
          .catch((e) => {
            console.log('Activity', ' Update error: ', e);
          });
    })
});

// Aktiviteye uye oldugunda, uyelikten ciktiginda
exports.memberNotifications=functions.firestore.document('Members/{id}').onWrite(async event => {
    const id = event.after.get('activityId');
    const ownerName = event.after.get('ownerName');
    const memberName = event.after.get('memberName');
    const ownerToken = event.after.get('ownerToken');
    const memberToken = event.after.get('memberToken');
    const memberState = event.after.get('memberState');
    const ownerState = event.after.get('ownerState');
    const memberIsCanceled = event.after.get('memberIsCanceled');

    const activities = await db.collection('Activities')
    .where('id', '==', id)
    .get();

    const activityAddress = await db.collection('ActivityAddress')
    .where('time', '>=', new Date().getTime())
    .orderBy('time')
    .get()

    let message;

    if (ownerState && !memberState) {
        message = {
            data: {
                activityId: activities.docs[0].data().id
            },
            notification: {
                title: 'Someone Has Gone',
                body: `${memberName} left from ${activities.docs[0].data().name}`
            },
       }
       return admin.messaging().sendToDevice(ownerToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
        }).catch(e => {
            console.log('memberNotifications is error --> ')
        })
    }
    else if (memberIsCanceled == null) {
        message = {
            notification: {
                title: 'New Request',
                body: `${memberName} wants to join ${activities.docs[0].data().name}`
            },
       }
       return admin.messaging().sendToDevice(ownerToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
        }).catch(e => {
            console.log('memberNotifications is error --> ')
        })
    }
    else if (ownerState) {
        message = {
            notification: {
                title: 'Accepted You',
                body: `Approvaled you to join ${activities.docs[0].data().name}`
            },
       }
       return admin.messaging().sendToDevice(memberToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
        }).catch(e => {
            console.log('memberNotifications is error --> ')
        })
    }
    else if (!ownerState) {
        message = {
            notification: {
                title: 'Sorry For This',
                body: `Denied you to join ${activities.docs[0].data().name}`
            },
       }
       return admin.messaging().sendToDevice(memberToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
        }).catch(e => {
            console.log('memberNotifications is error --> ')
        })
    }
});

// Aktivite silindiginde
exports.activityNotifications=functions.firestore.document('Activities/{id}').onUpdate(async event => {
    const id = event.after.get('id');
    const name = event.after.get('name');
    const state = event.after.get('state');

    const message = {
        notification: {
            title: 'Sorry For This',
            body: `${name} was canceled`
        },
   }
        
    if (state == false) {
        const members = await db.collection('Members')
        .where('activityId', '==', id)
        .where('memberState', '==', true)
        .get();

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