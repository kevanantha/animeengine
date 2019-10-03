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
  localStorage.removeItem('token')
  afterAuth()
  $('#email').val('')
  $('#password').val('')
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
    })
    .catch(err => {
      console.log(err)
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
