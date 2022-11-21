$(() => {
  var canvas = document.getElementById("twitterCanvas");
  var canvasContext = canvas.getContext("2d");
  canvasContext.font = "bold 30px Arial";
  canvasContext.textAlign = "center";
  canvasContext.fillText(
    "Twitter Posts:",
    canvas.width / 2,
    canvas.height / 2
  );

  const form = document.getElementById("form-twitter");
  const formInput = document.getElementById("twitter");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = formInput.value;
    $.ajax({
      type: "POST",
      url: `http://localhost:8088/twitter`,
      data: {
        text: text, 
      },
      success: function (data) {
        $("#twitter").val('');
      },
      error: function () {
        alert("Post uploading faild");
      }
    });
  });
});
