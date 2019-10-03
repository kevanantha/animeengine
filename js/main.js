$(document).ready(function() {
  afterAuth()
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
    .then(({ data }) => {
      localStorage.setItem('token', data.token)
      afterAuth()
      Swal.fire({
        type: 'success',
        title: 'Logged in successfully',
        showConfirmButton: false,
        timer: 1500
      })
    })
    .catch(err => {
      swal.showValidationMessage(err)
    })
}

function signOut() {
  const auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut().then(function() {
    localStorage.removeItem('token')
    afterAuth()
    $('#email').val('')
    $('#password').val('')
    Swal.fire({
      type: 'success',
      title: 'Logged out successfully',
      showConfirmButton: false,
      timer: 1500
    })
  })
}

function afterAuth() {
  if (localStorage.getItem('token')) {
    $('.login').hide()
    $('.content').show()
    $('#formRegister').hide()
  } else {
    $('.login').show()
    $('.content').hide()
  }
}

$('#formRegister').on('submit', function(e) {
  e.preventDefault()
  swal.fire({
    title: 'Creating Account',
    onOpen: () => {
      swal.showLoading()
    }
  })
  axios({
    method: 'post',
    url: 'http://localhost:3000/users/register',
    data: {
      email: $('#emailRegis').val(),
      password: $('#passwordRegis').val(),
    }
  })
    .then((res) => {
      localStorage.setItem('token', res.data.token)
      afterAuth()
      swal.close()
      Swal.fire({
        type: 'success',
        title: 'Logged out successfully',
        showConfirmButton: false,
        timer: 1500
      })
    })
    .catch(err => {
      swal.showValidationMessage(err.message)
    })
})

$('#formLogin').on('submit', function(e) {
  e.preventDefault()
  swal.fire({
    title: 'Logging in',
    onOpen: () => {
      swal.showLoading()
    }
  })
  axios({
    method: 'post',
    url: 'http://localhost:3000/users/login',
    data: {
      email: $('#email').val(),
      password: $('#password').val(),
    }
  })
    .then((res) => {
      localStorage.setItem('token', res.data.token)
      afterAuth()
      swal.close()
    })
    .catch(err => {
      console.log(err)
    })
})

function signUpForm(){
  $('.login').hide()
  $('.register').css('display', 'block')
}
