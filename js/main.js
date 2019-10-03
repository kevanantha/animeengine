$(document).ready(function() {
  isAuth()
  axios({
    method: 'get',
    url: 'http://localhost:3000/home'
  })
    .then(({ data }) => {
      data.map(res => {
        $('#content').append(`
        <div class="col-md-6">
          <div class="card mb-3" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="${res.image_url}" class="card-img" alt="${res.title}">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">
                    <a href="${res.url}">${res.title}</a>
                  </h5>
                  <p class="card-text">${res.synopsis}</p>
                  <p class="card-text"><small class="text-muted">Start Date: ${res.start_date ? res.start_date : 'N/A'}</small></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-xl">Extra large modal</button>

        <div class="modal fade bd-example-modal-xl" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              ...
            </div>
          </div>
        </div>
        `)
      })
    })
    .catch(err => {
      swal.showValidationMessage(err.message)
    })
})

function isAuth() {
  if (localStorage.getItem('token')) {
    $('.login').hide()
    $('.register').hide()
    $('.content').show()
  } else {
    $('.login').show()
    $('.register').hide()
    $('.content').hide()
  }
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;

  swal.fire({
    title: 'Logging In',
    onOpen: () => {
      swal.showLoading()
    }
  })

  axios({
    method: 'post',
    url: 'http://localhost:3000/users/gsignin',
    data: {
      token: id_token
    }
  })
    .then(({ data }) => {
      localStorage.setItem('token', data.token)
      isAuth()
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
    isAuth()
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
      isAuth()
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
    title: 'Logging In',
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
      isAuth()
      swal.close()
    })
    .catch(err => {
      swal.showValidationMessage(err.message)
    })
})

function signUpForm() {
  $('.login').hide()
  $('.register').show()
}

function signInForm() {
  $('.login').show()
  $('.register').hide()
}
