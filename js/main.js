$(document).ready(function() {
  console.log('ready')
  // axios({
    
  // })
})

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  axios({
    method: 'post',
    url: 'http://localhost:3000/users/gsignin',
    data: {
      token: id_token
    }
  })
    .then((res) => {
      console.log(res)
    })
    .catch(err => {
      swal.showValidationMessage(err)
    })
}

function signOut() {
  const auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut().then(function() {
    console.log('User signed out.')
  })
}
