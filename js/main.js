$(document).ready(function() {
  isAuth()
  // home()
  if (localStorage.getItem('token')) {
    home()
  }
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
    $('.title').hide()
    $('#content-detail').hide()
  }
}

function home() {
  $('.title').hide()
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
      $('.title').show()
      data.map(res => {
        $('#content').append(animeCard(res))
      })
      swal.close()
    })
    .catch(err => {
      swal.fire({
        title: `${err.response.data}`,
        showCloseButton: true
      })
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
  $('.title').hide()
  $('#content-section').hide()
  $('.title').show()
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
      $('#content-anime-detail').append(animeCardDetail(data))
      $('#content-anime-detail').show()
      swal.close()
    })
    .catch(err => {
      swal.fire({
        title: `${err.response.data}`,
        showCloseButton: true
      })
    })
}

function animeCardDetailKitsu(data) {
  const { attributes: res } = data
  return `
    <button class="btn btn-outline-primary btn-md" style="cursor: pointer; margin: 2rem 0; width: 10%" onclick="backToHome()">Back</button>
    <div class="col-md-12">
      <div class="card" style="min-width: 540px;">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img src="${res.posterImage.original}" class="card-img" alt="${res.titles.en}">
          </div>
          <div class="col-md-8">
            <div class="card-body" style="padding: 3rem">
              <h5 class="card-title">
                ${res.titles.en}
                <p class="card-text"><small class="text-muted">${res.titles.ja_jp}</small></p>
              </h5>
              <p class="card-text">${res.synopsis ? res.synopsis : ''}</p>
              <p class="card-text">Average Rating: ${res.averageRating ? res.averageRating : 'N/A'}</p>
              <p class="card-text">Start Date: ${res.startDate ? res.startDate : 'N/A'}</p>
              <p class="card-text">End Date: ${res.endDate ? res.endDate : 'N/A'}</p>
              <p class="card-text">Type: ${res.subtype ? res.subtype : 'N/A'}</p>
              <p class="card-text">Next Release: ${res.nextRelease ? res.nextRelease : 'N/A'}</p>
              <p class="card-text">Status: ${res.status ? res.status : 'N/A'}</p>
              <p class="card-text">User: ${res.userCount ? res.userCount : 'N/A'}</p>
              <p class="card-text">Favorites: ${res.favoritesCount ? res.favoritesCount : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-12" style="width:33vw;">
      <h1 class="border-bottom text-center">480p</h1>
      <div class="d-flex flex-column align-items-stretch" id="480p"></div>
    </div>
    <div class="col-12" style="width:33vw;">
      <h1 class="border-bottom text-center">720p</h1>
      <div class="d-flex flex-column align-items-stretch" id="720p"></div>
    </div>
    <div class="col-12" style="width:33vw;">
      <h1 class="border-bottom text-center">1080p</h1>
      <div class="d-flex flex-column align-items-stretch" id="1080p"></div>
    </div>
  `
}

function detailKitsu(id) {
  $('.title').hide()
  $('#content-section').hide()
  swal.fire({
    title: 'Fecthing Detail',
    onOpen: () => {
      swal.showLoading()
    }
  })

  let title

  axios({
    method: 'get',
    url: `http://localhost:3000/kitsu/anime/${id}`,
    data: { id }
  })
    .then(({ data }) => {
      title = data.attributes.canonicalTitle
      $('.title').show()
      $('#content-anime-detail').append(animeCardDetailKitsu(data))
      $('#content-anime-detail').show()
      swal.close()
      return axios({
        method: 'get',
        url: `http://localhost:3000/pantsu/?q=${title}&resolution=480p`
      })
    })
    .then(({ data }) => {
      if (!data.length) {
        $('#480p').append(`
          <div class="alert alert-dark text-center">
            NO DATA
          </div>
        `)
      } else {
        data.forEach(el => {
          let { name, magnet, seeders, leechers } = el
          name = name.replace('[HorribleSubs] ', "")
            .replace(/\s\[\d*p\]/g, "")

          $('#480p').append(`
            <div class="row align-items-center pl-3">
            <i class="col-1 fas fa-folder"></i>
            <a href="${magnet}" class="col-7">${name}</a>
            <div class="col-1 d-flex justify-content-between align-items-center">
              <span class="text-primary mr-4 col-8">Seeders</span>
              <i class="fas fa-arrow-up text-primary col-2"></i>
              <span class="text-primary col-2">${seeders}</span>
              </div>
            <div class="col-1"></div>
            <div class="col-1 d-flex justify-content-between align-items-center">
              <span class="text-danger mr-4 col-8">Leechers</span>
              <i class="fas fa-arrow-down text-danger col-2"></i>
              <span class="text-danger col-2">${leechers}</span>
              </div>
            <div class="col-1"></div>
            </div>
        `)
        })
      }

      return axios({
        method: 'get',
        url: `http://localhost:3000/pantsu/?q=${title}&resolution=720p`
      })
    })
    .then(({ data }) => {
      if (!data.length) {
        $('#720p').append(`
          <div class="alert alert-dark text-center" role="alert">
            NO DATA
          </div>
        `)
      } else {
        data.forEach(el => {
          let { name, magnet, seeders, leechers } = el
          name = name.replace('[HorribleSubs] ', "")
            .replace(/\s\[\d*p\]/g, "")

          $('#720p').append(`
            <div class="row align-items-center pl-3">
              <i class="col-1 fas fa-folder"></i>
              <a href="${magnet}" class="col-7">${name}</a>
              <div class="col-1 d-flex justify-content-between align-items-center">
                <span class="text-primary mr-4 col-8">Seeders</span>
                <i class="fas fa-arrow-up text-primary col-2"></i>
                <span class="text-primary col-2">${seeders}</span>
                </div>
              <div class="col-1"></div>
              <div class="col-1 d-flex justify-content-between align-items-center">
                <span class="text-danger mr-4 col-8">Leechers</span>
                <i class="fas fa-arrow-down text-danger col-2"></i>
                <span class="text-danger col-2">${leechers}</span>
                </div>
              <div class="col-1"></div>
              </div>
          `)
      })
      }


      return axios({
        method: 'get',
        url: `http://localhost:3000/pantsu/?q=${title}&resolution=720p`
      })
    })
    .then(({ data }) => {
      if (!data.length) {
        $('#1080p').append(`
          <div class="alert alert-dark text-center" role="alert">
            NO DATA
          </div>
        `)
      } else {
        data.forEach(el => {
          let { name, magnet, seeders, leechers } = el
          name = name.replace('[HorribleSubs] ', "")
            .replace(/\s\[\d*p\]/g, "")

          $('#1080p').append(`
            <div class="row align-items-center pl-3">
            <i class="col-1 fas fa-folder"></i>
            <a href="${magnet}" class="col-7">${name}</a>
            <div class="col-1 d-flex justify-content-between align-items-center">
              <span class="text-primary mr-4 col-8">Seeders</span>
              <i class="fas fa-arrow-up text-primary col-2"></i>
              <span class="text-primary col-2">${seeders}</span>
              </div>
            <div class="col-1"></div>
            <div class="col-1 d-flex justify-content-between align-items-center">
              <span class="text-danger mr-4 col-8">Leechers</span>
              <i class="fas fa-arrow-down text-danger col-2"></i>
              <span class="text-danger col-2">${leechers}</span>
              </div>
            <div class="col-1"></div>
            </div>
        `)
        })
      }
    })
    .catch(err => {
      swal.fire({
        title: `${err.response.data}`,
        showCloseButton: true
      })
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
      swal.close()
      home()
    })
    .catch(err => {
      swal.fire({
        title: `${err.response.data}`,
        showCloseButton: true
      })
    })
}

function signOut() {
  const auth2 = gapi.auth2.getAuthInstance()
  auth2.signOut().then(function() {
    localStorage.removeItem('token')
    isAuth()
  })
  $('#email').val('')
  $('#password').val('')
  $('#content-anime-detail').empty()
  $('#content').empty()
  // $('#content').empty()
  Swal.fire({
    type: 'success',
    title: 'Logged out successfully',
    showConfirmButton: false,
    timer: 1500
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
      $('#emailRegis').val('')
      $('#passwordRegis').val('')
      localStorage.setItem('token', res.data.token)
      isAuth()
      swal.close()
      home()
    })
    .catch(err => {
      // err.response.data.join('\n')
      swal.fire({
        title: `${err.response.data.join('\n')}`,
        showCloseButton: true
      })
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
      home()
    })
    .catch(err => {
      swal.fire({
        title: `${err.response.data}`,
        showCloseButton: true
      })
    })
})

function searchAnime() {
  $('.title').hide()
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
    $('#search-anime').val('')
    data.forEach(el => $('#content').append(generateCard(el)))
    $('#content').show()
    Swal.close()
  }).catch(err => {
    swal.fire({
      title: `${err.response.data}`,
      showCloseButton: true
    })
  })
}

function generateCard(data) {
  const { attributes } = data
  return `
  <div class="col-lg-4 col-md-4 col-sm-6 my-3">
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
        <button class="btn btn-primary btn-block" onclick="detailKitsu(${data.id})">Detail</button>
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
  $('.title').hide()
  $('#content-anime-detail').empty()
  $('#content').empty()
  home()
  isAuth()
}
