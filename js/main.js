$(document).ready(function() {
  isAuth()
  home()
})

function isAuth() {
  if (localStorage.getItem('token')) {
    $('.login').hide()
    $('.register').hide()
    $('.content').show()
    $('.search-anime').show()
  } else {
    $('.search-anime').hide()
    $('.login').show()
    $('.register').hide()
    $('.content').hide()
    $('#content-detail').hide()
  }
}

function home() {
  swal.fire({
    title: 'Fecthing Anime',
    onOpen: () => {
      swal.showLoading()
    }
  })
  axios({
    method: 'get',
    url: 'http://localhost:3000/home'
  })
    .then(({ data }) => {
      swal.close()
      data.map(res => {
        $('#content').append(animeCard(res))
      })
    })
    .catch(err => {
      swal.showValidationMessage(err.message)
    })
}

function animeCard(res) {
  return `
    <div class="col-md-6">
      <div class="card mb-3" style="max-width: 540px;padding:5px;">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img src="${res.image_url}" class="card-img" alt="${res.title}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">
                <a href="${res.url}">${res.title}</a>
                <p class="card-text"><small class="text-muted">${res.title_japanese}</small></p>
              </h5>
              <p class="card-text">${res.synopsis ? res.synopsis : ''}</p>
              <p class="card-text"><small class="text-muted">Start Date: ${res.start_date ? res.start_date : 'N/A'}</small></p>
              <button style="width:25%;position:absolute;bottom:10px;" class="btn btn-sm btn-primary btn-block" onclick="detail(${res.mal_id})">Detail</button>
            </div>
            </div>
        </div>
      </div>
    </div>
  `
}

function animeCardDetail(res) {
  return `
  <div class="col-md-12">
  <button class="btn btn-outline-primary btn-md" style="cursor: pointer; margin: 2rem 0;width:10%" onclick="backToHome()">Back</button>
    <div class="card" style="min-width: 540px;padding:10px;">
      <div class="row no-gutters">
        <div class="col-md-4">
          <img src="${res.image_url}" class="card-img" alt="${res.title}">
        </div>
        <div class="col-md-8">
          <div class="card-body" style="padding: 3rem; padding-top:2px">
            <h5 class="card-title">
              <a href="${res.url}"><h2>${res.title}</h2></a>
              <p class="card-text"><small class="text-muted">${res.title_japanese}</small></p>
            </h5><br>
            <p class="card-text">${res.synopsis ? res.synopsis : ''}</p>
            <p class="card-text">Type: ${res.type ? res.type : ''}</p>
            <p class="card-text">Status: ${res.status ? res.status : ''}</p>
            <p class="card-text">Duration: ${res.duration ? res.duration : ''}</p>
            <p class="card-text">Rating: ${res.rating ? res.rating : ''}</p>
            <p class="card-text">Genres: ${res.genres.map(genre => genre.name)}</p>
            <p class="card-text">Opening Themes: ${res.opening_themes.length ? res.opening_themes.map(opening => opening.name) : 'N/A'}</p>
            <p class="card-text">Ending Themes: ${res.ending_themes.length ? res.ending_themes.map(ending => ending.name) : 'N/A'}</p>
            <p class="card-text"><small class="text-muted">Start Date: ${res.start_date ? res.start_date : 'N/A'}</small></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
}

function detail(id) {
  $('#content-section').hide()
  swal.fire({
    title: 'Fecthing Detail',
    onOpen: () => {
      swal.showLoading()
    }
  })
  axios({
    method: 'get',
    url: `http://localhost:3000/home/detail/${id}`,
    data: { id }
  })
    .then(({ data }) => {
      $('#content-section').hide()
      $('#content-anime-detail').append(animeCardDetail(data))
      $('#content-anime-detail').show()
      swal.close()
    })
    .catch(err => {
      console.log(err)
    })
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

function searchAnime() {
  $('#content-section').hide()
  $('#content').empty()
  Swal.fire({
    title: "Fetching Anime",
    onOpen() {
      Swal.showLoading()
    }
  })

  axios({
    method: 'get',
    url: `http://localhost:3000/kitsu/?q=${$('#search-anime').val()}`
  }).then(({ data }) => {
    $('#content').empty()
    data.map(el => $('#content').append(generateCard(el)))
    Swal.close()
  }).catch(err => {
    console.log(err)
    Swal.fire({
      type: 'error',
      title: 'Something went wrong',
      text: err
    })
  })
}

        function generateCard(data) {
          console.log(data)
            const { attributes } = data
            return `
            <div class="col-lg-2 col-md-4 col-sm-6 my-3">
                <div class="card d-flex flex-column justify-content-between" style="height: 80vh">
                    <div>
                        <img src="${attributes.posterImage.medium}" class="card-img-top"
                            alt="${attributes.slug}">
                        <div class="card-body">
                            <h5 class="card-title">${attributes.canonicalTitle}</h5>
                            <p class="card-text">${attributes.titles.ja_jp}</p>
                            <p class="card-text">Rating: ${!attributes.averageRating ? "No Rating" : attributes.ageRating}</p>
                            <p class="card-text">Status: ${attributes.status}</p>
                            <p class="card-text">Age Rating: ${!attributes.ageRating ? "Not Rated Yet" : attributes.ageRating}</p>
                        </div>
                    </div>
                    <div class="mb-3 px-5">
                        <button class="btn btn-primary btn-block">Detail</button>
                    </div>
                </div>
            </div>`
        }

function signUpForm() {
  $('.login').hide()
  $('.register').show()
}

function signInForm() {
  $('.login').show()
  $('.register').hide()
}

function backToHome() {
  $('#content-anime-detail').empty()
  $('#content').show()
  isAuth()
}
