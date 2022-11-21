$(() => {
  var menu_button_click_counter = 0;
  //under 975 the toggler appears
  //check of screen size when screen loads
  if ($(window).width() <= 975) {
    $("#search_bar").addClass("d-none");
    $("#menu_button").addClass("d-none");
  } else {
    $("#search_bar").removeClass("d-none");
    $("#menu_button").removeClass("d-none");
  }

  //check of screen size when resize occurs
  $(window).resize(function () {
    if ($(window).width() <= 975) {
      $("#search_bar").addClass("d-none");
      $("#menu_button").addClass("d-none");
      $("#menu_div").addClass("d-none");
      menu_button_click_counter = 0;

    } else {
      $("#search_bar").removeClass("d-none");
      $("#menu_button").removeClass("d-none");
    }
  });
  $("#menu_button").click(function () {
    menu_button_click_counter++;
    if (menu_button_click_counter % 2 == 1) {
      $("#menu_div").removeClass("d-none");
      $("#menu_div").addClass("d-block");
    }
    else {
      $("#menu_div").removeClass("d-block");
      $("#menu_div").addClass("d-none");
    }
  });
});

function isValue(optVal) {
  return (optVal.trim() != "") && (optVal.length >= 5)
}

$("#username_txt").keyup(enableDisableButton);
$("#pass_txt").keyup(enableDisableButton);
$("#username_txt_reg").keyup(enableDisableRegButton);
$("#pass_txt_reg").keyup(enableDisableRegButton);

function enableDisableButton() {
  //Reference the Button.
  const usrnameTxt = document.getElementById("username_txt");
  const passTxt = document.getElementById("pass_txt");
  var btnSubmit = document.getElementById("login_button");


  //Verify the TextBox value.
  if (isValue(usrnameTxt.value) && isValue(passTxt.value)) {
    //Enable the TextBox when TextBox has value.
    btnSubmit.disabled = false;
  } else {
    //Disable the TextBox when TextBox is empty.
    btnSubmit.disabled = true;
  }
};



function enableDisableRegButton() {
  //Reference the Button.
  const username = document.getElementById("username_txt_reg").value;
  const passTxt = document.getElementById("pass_txt_reg").value;
  const isChecked = $('#accept_terms_check').is(':checked');

  if (isValue(username)) {
    $.getJSON(`/users/getUser?username=${username.trim()}`, function (res) {
      if (!$.isEmptyObject(res)) {
        $("#register_errors").text("Username already exists");
        $("#register_button").attr("disabled", true);
      } else {
        if (isValue(passTxt) && isChecked) {
          $("#register_button").removeAttr("disabled");
          $("#register_errors").text("");
        } else {
          $("#register_button").attr("disabled", true);
        }
      }
    });
  } else {
    $("#register_errors").text("");
    $("#register_button").attr("disabled", true);
  }
};


$('.register_container').hide()
$('#switchToReg,#switchToLogin').click(function () {
  $('.login_container,.register_container').toggle();
});

$('#login_button').click(function (e) {
  e.preventDefault();
  var username = $('#username_txt').val();
  var password = $("#pass_txt").val();
  var login = $('#login_button').val();

  $.ajax(
    {
      type: 'POST',
      url: "/users/login",
      data: { login: login, username: username, password: password },
      statusCode: {
        401: function () {
          $("#login_errors").text('Username or password is wrong.');
        },
        200: function () {
          $(location).attr('href', '/?afterLogin=true');
        },
      }
    }).fail(function (jqXHR, textStatus) {
      $("#login_errors").text('Something went wrong, please try again later');
    });
});

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})


