if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://Niccie:Qwerty@1234@ds233970.mlab.com:33970/noteapp'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/notesdb-dev'
  }
}