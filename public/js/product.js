// must be global (module scope)
const redirectToProducts = () => {
  redirectTo(Urls.PRODUCTS)
};

$(() => {

  $(document).on("click", ".add_to_bag_buttton", function () {
    const productToAdd = $(this).attr("id");
    $.ajax({
      url: `http://localhost:8088/products/${productToAdd}/addToCart/${productToAdd}`,
    }).done(function (result) {

    });
  });

  $(document).on("click", ".add_to_wish_list_icon", function () {
    const productToAdd = $(this).attr("id");
    $.ajax({
      url: `http://localhost:8088/products/${productToAdd}/addToWishList/${productToAdd}`,
    }).done(function (result) {

    });
  });
});