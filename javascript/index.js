// handle question-form submit
$('form#user-details').submit((event) => {
  event.preventDefault();
  sessionStorage.setItem('userEmail', $('form#user-details #email').val());
  window.location.href = 'pages/checker.html'
});
