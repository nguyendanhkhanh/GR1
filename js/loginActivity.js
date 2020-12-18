firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        if (user.emailVerified) {
            document.getElementById("user_div").style.display = "block";
            document.getElementById("login_div").style.display = "none";
            document.getElementById("resetPassword_div").style.display = "none";
            document.getElementById("signup_div").style.display = "none";
            doConnect();
        } else {

            user.sendEmailVerification().then(function () {
                window.alert("We have sent you a verification email, please verify your account!!");

            }).catch(function (error) {
                window.alert("please verify your account!!");
            });

            console.log("verificated:" + user.emailVerified);
            firebase.auth().signOut();
        }

    } else {
        // No user is signed in.
        signinLayout();
    }
});

function login() {
    let userEmail = document.getElementById("username").value;
    let userPassword = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).then(() => {
        doConnect();
    }).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;

        window.alert("Error: " + errorMessage);
        // ...
    });

}

function signup() {
    let userEmail = document.getElementById("signUpUsername").value;
    let userPassword = document.getElementById("signUpPassword").value;
    let signupCode = document.getElementById("signUpcode").value;

    let docRef = db.collection("user").doc(signupCode);

    docRef.get().then(function (doc) {
        if (doc.exists) {

            firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then(() => {

            }).catch(function (error) {
                // Handle Errors here.
                let errorMessage = error.message;

                window.alert("Error: " + errorMessage);
                // ...
            });


        } else {
            // doc.data() will be undefined in this case
            window.alert("User code does not match, Please retype user code");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

}

function sendResetEmail() {

    let userEmail = document.getElementById("fpusername").value;
    firebase.auth().sendPasswordResetEmail(userEmail).then(() => {
        window.alert('Password reset email sent, check your inbox.');
    }).catch(function (error) {
        // Handle Errors here.
        let errorMessage = error.message;

        window.alert("Error: " + errorMessage);
        // ...
    });

}

function logout() {
    disconnectMqtt();
    firebase.auth().signOut();

}

function forgotPassword() {
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("resetPassword_div").style.display = "block";
    document.getElementById("signup_div").style.display = "none";

}

function signupLayout() {

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("resetPassword_div").style.display = "none";
    document.getElementById("signup_div").style.display = "block";

}

function signinLayout() {

    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    document.getElementById("resetPassword_div").style.display = "none";
    document.getElementById("signup_div").style.display = "none";

}