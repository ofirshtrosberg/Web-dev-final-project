$(() => {
  $(document).on("click", ".delete_icon_button", function () {
    const productToDelete = $(this).attr("id");
    $.ajax({
      url: `http://localhost:8088/wishList/deleteProduct?productToDelete=${productToDelete}`,
    }).done(function (result) {
      const productsAfterDelete = result.products;
      $("#products_container").html("");
      $("#emptyBag_div").html("");
      let emptyTemplate = $("#emptyTemplate").html();
      if (productsAfterDelete.length == 0) {
        $("#emptyBag_div").append(emptyTemplate);
        return;
      }
      for (let i = 0; i < productsAfterDelete.length; i++) {
        let productsTemplate = $("#productsTemplate").html();
        const product = productsAfterDelete[i];
        for (const key in product) {
          productsTemplate = productsTemplate.replaceAll(
            "{" + key + "}",
            product[key]
          );
          if (key == "isAvailable" && product[key] == false) {
            productsTemplate = productsTemplate.replaceAll(
              "{soldout}",
              "Sold Out!"
            );
          }
          if (key == "isAvailable" && product[key] == true) {
            productsTemplate = productsTemplate.replaceAll("{soldout}", "");
          }
        }
        $("#products_container").append(productsTemplate);
      }

    });
  });
  $(document).on("click", ".add_to_bag_buttton", function () {
    const productToAdd = $(this).attr("id");
    $.ajax({
      url: `http://localhost:8088/wishList/addProduct?productToAdd=${productToAdd}`,
    }).done(function (status) {
    });
  });
});
