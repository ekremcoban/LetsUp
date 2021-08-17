const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config());
const db = admin.firestore();

// Servis her 10 dk da 1 aktivitelerin ve adreslerinin baslangic zamanini kontrol eder. 2 saatten az kaldiya state false yapar.
exports.scheduledFunction = functions.pubsub.schedule('*/10 * * * *').onRun(async (context) => {
    db.collection('Timers').doc('Timer').set({time: admin.firestore.Timestamp.now()});

    const activeActivities = await db.collection('Activities')
    // .where('startTime', '<', admin.firestore.Timestamp.now().toMillis() + 7200000)
    .where('state', '==', true)
    .get();

    activeActivities.docs.forEach(async item => {
        if (item.data().startTime < admin.firestore.Timestamp.now().toMillis() + 7200000) {
            const inactiveActivity = item.data();
            inactiveActivity.state = false;

            db.collection('Activities')
            .doc(inactiveActivity.id)
            .set(inactiveActivity)
            .then(() => {
                console.log('activeActivities', ' Update');
            })
            .catch((e) => {
              console.log('activeActivities', ' Update error: ', e);
            });

            const address = await db.collection('ActivityAddress')
            .where('activityId', '==', inactiveActivity.id)
            .get();

            address.docs.forEach(item => {
                const inactiveAddress = item.data();
                inactiveAddress.state = false;

                db.collection('ActivityAddress')
                .doc(inactiveAddress.id)
                .set(inactiveAddress)
                .then(() => {
                    console.log('activeAddress', ' Update');
                })
                .catch((e) => {
                  console.log('activeAddress', ' Update error: ', e);
                });
            })
        }
    })

    return console.log('Timer çalıştı')
  });

// Profil guncellendiginde
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
exports.memberNotifications=functions.firestore.document('Members/{id}').onWrite(async (event) => {
    const id = event.after.get('id');
    const activityId = event.after.get('activityId');
    const ownerName = event.after.get('ownerName');
    const memberEmail = event.after.get('memberEmail');
    const memberName = event.after.get('memberName');
    const ownerToken = event.after.get('ownerToken');
    const memberToken = event.after.get('memberToken');
    const ownerEmail = event.after.get('ownerEmail');
    const afterMemberState = event.after.get('memberState');
    const beforeMemberState = event.before.get('memberState');
    const afterOwnerState = event.after.get('ownerState');
    const beforeOwnerState = event.before.get('ownerState');
    const memberIsCanceled = event.after.get('memberIsCanceled');
    const afterMemberJoin = event.after.get('memberJoin');
    const afterOwnerJoin = event.after.get('ownerJoin');

    const activities = await db.collection('Activities')
    .where('id', '==', activityId)
    .get();

    // const activityAddress = await db.collection('ActivityAddress')
    // .where('time', '>=', new Date().getTime())
    // .orderBy('time')
    // .get()

    let message;
    let collectionRef = await db.collection('Notifications').doc();

    const isThere = await db.collection('Notifications')
    .where('activityId', '==', activityId)
    .where('fromWho', '==', memberEmail)
    .where('isActive', '==', true)
    .where('type', '==', 0)
    .get();


    if (isThere.docs.length > 0) {
        let inactiveNotification = isThere.docs[0].data();
        inactiveNotification.isActive = false;
        
        await db.collection('Notifications')
        .doc(inactiveNotification.id)
        .set(inactiveNotification)
    };

    // Memberdan uyelik istegi owner onaylamadi ya da reddetmedi daha
    if (memberIsCanceled == null && afterMemberState && afterOwnerState == null
        && afterMemberJoin == null && afterOwnerJoin == null) {
        message = {
            notification: {
                title: 'A New Request',
                body: `${memberName} wants to join ${activities.docs[0].data().name}`
            },
        }

        await db.collection('Notifications')
        .doc(collectionRef.id)
        .set({
            id: collectionRef.id,
            membersId: id,
            activityId: activityId,
            title: message.notification.title,
            body: message.notification.body,
            branch: activities.docs[0].data().type,
            fromWho: memberEmail,
            toWho: ownerEmail,
            state: true,
            isRead: false,
            isActive: true,
            type: 0,
            createdTime: new Date().getTime()
        });

        return admin.messaging().sendToDevice(ownerToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
        }).catch(e => {
            console.log('memberNotifications is error --> ')
        })
    }

    // Ownerdan cevap gelmeden iptal etti
    else if (memberIsCanceled == null && !afterMemberState && afterOwnerState == null
        && afterMemberJoin == null && afterOwnerJoin == null) {
        message = {
            notification: {
                title: 'Request Was Withdrawn',
                body: `${memberName} was withdrawn ${activities.docs[0].data().name}`
            },
       }

       db.collection('Notifications')
       .doc(collectionRef.id)
       .set({
           id: collectionRef.id,
           activityId: id,
           title: message.notification.title,
           body: message.notification.body,
           branch: activities.docs[0].data().type,
           fromWho: memberEmail,
           toWho: ownerEmail,
           state: true,
           isRead: false,
           isActive: true,
           type: 1,
           createdTime: new Date().getTime()
       });

       return admin.messaging().sendToDevice(ownerToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
        }).catch(e => {
            console.log('memberNotifications is error --> ')
        })
    }

    // Member uyelik icin ownerdan onay aldiktan sonra giderse
    else if (afterOwnerState && !afterMemberState
        && afterMemberJoin == null && afterOwnerJoin == null) {
        message = {
            data: {
                activityId: activities.docs[0].data().id
            },
            notification: {
                title: 'Someone Has Gone',
                body: `${memberName} left from ${activities.docs[0].data().name}`
            },
       }

       db.collection('Notifications')
       .doc(collectionRef.id)
       .set({
           id: collectionRef.id,
           activityId: id,
           title: message.notification.title,
           body: message.notification.body,
           branch: activities.docs[0].data().type,
           fromWho: memberEmail,
           toWho: ownerEmail,
           state: true,
           isRead: false,
           isActive: true,
           tyep: 2,
           createdTime: new Date().getTime()
       });

       return admin.messaging().sendToDevice(ownerToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
        }).catch(e => {
            console.log('memberNotifications is error --> ')
        })
    }

    // Member ownerdan onayli iken geri donerse
    else if (afterOwnerState && (beforeMemberState !== afterMemberState) && afterMemberState
        && afterMemberJoin == null && afterOwnerJoin == null) {
        message = {
            data: {
                activityId: activities.docs[0].data().id
            },
            notification: {
                title: 'Someone Came Back',
                body: `${memberName} came back to ${activities.docs[0].data().name}`
            },
       }

       db.collection('Notifications')
       .doc(collectionRef.id)
       .set({
           id: collectionRef.id,
           activityId: id,
           title: message.notification.title,
           body: message.notification.body,
           branch: activities.docs[0].data().type,
           fromWho: memberEmail,
           toWho: ownerEmail,
           state: true,
           isRead: false,
           isActive: true,
           tyep: 3,
           createdTime: new Date().getTime()
       });

       return admin.messaging().sendToDevice(ownerToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
        }).catch(e => {
            console.log('memberNotifications is error --> ')
        })
    }
    
    // Owner memberi reddettiginde
    else if (!afterOwnerState && afterMemberJoin == null && afterOwnerJoin == null) {
        message = {
            notification: {
                title: 'Sorry For This',
                body: `Denied you to join ${activities.docs[0].data().name}`
            },
       }

       db.collection('Notifications')
       .doc(collectionRef.id)
       .set({
           id: collectionRef.id,
           activityId: id,
           title: message.notification.title,
           body: message.notification.body,
           branch: activities.docs[0].data().type,
           fromWho: ownerEmail,
           toWho: memberEmail,
           state: true,
           isRead: false,
           isActive: true,
           type: 4,
           createdTime: new Date().getTime()
       });

       const isThere = await db.collection('Notifications')
       .where('activityId', '==', activityId)
       .where('fromWho', '==', memberEmail)
       .get();
   
   
       if (isThere.docs.length > 0) {
           let inactiveNotification = isThere.docs[0].data();
           inactiveNotification.isActive = false;
           
           await db.collection('Notifications')
           .doc(inactiveNotification.id)
           .set(inactiveNotification)
       };

       return admin.messaging().sendToDevice(memberToken, message).then(res => {
        console.log('memberNotifications is succeess --> ', ownerName, memberName)
        }).catch(e => {
            console.log('memberNotifications is error --> ')
        })
    }

    // Owner memberi onayladiginda
    else if (afterOwnerState && afterMemberJoin == null && afterOwnerJoin == null) {
        message = {
            notification: {
                title: 'Accepted You',
                body: `Approvaled you to join ${activities.docs[0].data().name}`
            },
       }

       db.collection('Notifications')
       .doc(collectionRef.id)
       .set({
           id: collectionRef.id,
           activityId: id,
           title: message.notification.title,
           body: message.notification.body,
           branch: activities.docs[0].data().type,
           fromWho: ownerEmail,
           toWho: memberEmail,
           state: true,
           isRead: false,
           isActive: true,
           type: 5,
           createdTime: new Date().getTime()
       });

       const isThere = await db.collection('Notifications')
       .where('activityId', '==', activityId)
       .where('fromWho', '==', memberEmail)
       .get();
   
   
       if (isThere.docs.length > 0) {
           let inactiveNotification = isThere.docs[0].data();
           inactiveNotification.isActive = false;
           
           await db.collection('Notifications')
           .doc(inactiveNotification.id)
           .set(inactiveNotification)
       };

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
    const type = event.after.get('type');

    let collectionRef = await db.collection('Notifications').doc();

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
            db.collection('Notifications')
            .doc(collectionRef.id)
            .set({
                id: collectionRef.id,
                activityId: id,
                title: message.notification.title,
                body: message.notification.body,
                branch: type,
                fromWho: member.data().ownerEmail,
                toWho: member.data().memberEmail,
                state: true,
                isActive: true,
                type: 6,
                createdTime: new Date().getTime()
            });
            
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