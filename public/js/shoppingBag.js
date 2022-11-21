$(() => {
  let totalPrice;
  $(document).on("click", ".delete_icon_button", function (e) {
    const productToDelete = $(this).attr("id");
    deleteProduct(productToDelete);
  });

  function deleteProduct(productToDelete) {
    $.ajax({
      url: `http://localhost:8088/shoppingBag/deleteProduct?productToDelete=${productToDelete}`,
    }).done(function (result) {
      const productsAfterDelete = result.products;
      const totalPrice = result.totalPrice;
      $("#products_container").html("");
      $("#payNow_div").html("");
      $("#emptyBag_div").html("");
      $("#total_price_container").html("");
      let productsTemplate;
      let emptyTemplate = $("#emptyTemplate").html();
      let payNowTemplate = $("#payNowTemplate").html();
      let totalPriceTemplate = $("#totalPriceTemplate").html();
      if (productsAfterDelete.length == 0) {
        $("#emptyBag_div").append(emptyTemplate);
        return;
      }
      for (let i = 0; i < productsAfterDelete.length; i++) {
        productsTemplate = $("#productsTemplate").html();
        const product = productsAfterDelete[i];
        for (const key in product) {
          if (key == "isAvailable" && product[key] == false) {
            productsTemplate = productsTemplate.replaceAll(
              "{soldout}",
              "Sold Out! Delete from shopping cart before paying"
            );
            productsTemplate = productsTemplate.replaceAll(
              "{soldoutLabelClass}",
              "sold_out_label"
            );

          }
          if (key == "isAvailable" && product[key] == true) {
            productsTemplate = productsTemplate.replaceAll("{soldout}", "");
            productsTemplate = productsTemplate.replaceAll(
              "{soldoutLabelClass}",
              ""
            );
          }

          productsTemplate = productsTemplate.replaceAll(
            "{" + key + "}",
            product[key]
          );
        }
        $("#products_container").append(productsTemplate);
      }
      payNowTemplate = payNowTemplate.replaceAll("{totalPrice}", totalPrice);
      totalPriceTemplate = totalPriceTemplate.replaceAll("{totalPrice}", totalPrice);
      $("#payNow_div").append(payNowTemplate);
      $("#total_price_container").append(totalPriceTemplate);
    });
  };


  $(document).on("click", "#pay_now_button", function (e) {
    const soldOuts = document.querySelectorAll(".sold_out_label");
    const productsInBag = document.querySelectorAll(".shopping-bag-item");
    if (soldOuts.length == productsInBag.length) {
      document.querySelectorAll(".sold_out_label").forEach((el) => {
        const item = el.closest(".shopping-bag-item");
        console.log(item.dataset);
        const productId = item.dataset.productId;
        console.log(productId);
        deleteProduct(productId);
      })
      window.location.reload();
    }
    else {
      document.querySelectorAll(".sold_out_label").forEach((el) => {
        const item = el.closest(".shopping-bag-item");
        console.log(item.dataset);
        const productId = item.dataset.productId;
        console.log(productId);
        deleteProduct(productId);
      });
    }
    addCreditCardNumberValidations("card_number");
    addCVVValidations("card_cvv");
    addExpirationDateValidations("card_exp_date");
  });



  // payment
  function addCreditCardNumberValidations(id) {
    const cardInput = document.getElementById(id);

    var cardnumber_mask = new IMask(cardInput, {
      mask: [
        {
          mask: "0000 000000 00000",
          regex: "^3[47]\\d{0,13}",
          cardtype: "american express",
        },
        {
          mask: "0000 0000 0000 0000",
          regex: "^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}",
          cardtype: "discover",
        },
        {
          mask: "0000 000000 0000",
          regex: "^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}",
          cardtype: "diners",
        },
        {
          mask: "0000 0000 0000 0000",
          regex: "^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}",
          cardtype: "mastercard",
        },
        {
          mask: "0000 0000 0000 0000",
          regex: "^4\\d{0,15}",
          cardtype: "visa",
        },
      ],
    });
  }
  function addCVVValidations(id) {
    const cvvInput = document.getElementById(id);
    var cvv_mask = new IMask(cvvInput, {
      mask: "000",
    });
  }
  function addExpirationDateValidations(id) {
    const dateInput = document.getElementById(id);
    var expirationdate_mask = new IMask(dateInput, {
      mask: "MM{/}YY",
      blocks: {
        YY: {
          mask: IMask.MaskedRange,
          from: 23,
          to: 99,
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
        },
      },
    });
  }
  function notOnlyLetters(value) {
    return value && !/^[A-Za-z ]+$/.test(value);
  }
  function notOnlyNumbers(value) {
    return value && !/^[0-9]+$/.test(value);
  }
  function cardTypeFitToCardNumber(cardType, cardNumber) {
    switch (cardType) {
      case "Visa":
        if (cardNumber.length !== 19) return "Invalid Visa card number!";
        else return "";
      case "Mastercard":
        if (cardNumber.length !== 19) return "Invalid Mastercard card number!";
        else return "";
      case "American Express":
        if (cardNumber.length !== 18)
          return "Invalid American Express card number!";
        else return "";
      case "Discover":
        if (cardNumber.length !== 19) return "Invalid Discover card number!";
        else return "";
      case "Diners":
        if (cardNumber.length !== 16) return "Invalid Diners card number!";
        else return "";
    }
  }
  function addCreditCard() {
    const cardType = $("#card_type").val();
    const cardNumber = $("#card_number").val().trim();
    const cardCvv = $("#card_cvv").val().trim();
    const expirationDate = $("#card_exp_date").val().trim();
    const fullName = $("#card_owner_full_name").val().trim();
    const id = $("#card_owner_id").val().trim();
    const cardTypeFitToCardNumberMsg = cardTypeFitToCardNumber(
      cardType,
      cardNumber
    );

    if (cardTypeFitToCardNumberMsg != "") {
      $("#validation_message_label").text(cardTypeFitToCardNumberMsg);
      return false;
    }
    if (cardCvv.length != 3) {
      $("#validation_message_label").text("Card CVV must contain 3 numbers!");
      return false;
    }
    if (expirationDate.length != 5) {
      $("#validation_message_label").text("Invalid expiration date!");
      return false;
    }
    if (notOnlyLetters(fullName) || fullName.length < 5) {
      $("#validation_message_label").text("Invalid full name!");
      return false;
    }
    if (notOnlyNumbers(id) || id.length != 9) {
      $("#validation_message_label").text("Invalid id!");
      return false;
    } else {
      return true;
    }
  }
  // socketio
  // btn inside the payment modal
  $(document).on("click", "#pay-btn", function () {
    if (addCreditCard()) {
      emitPurchse("purchase");
      $("#pay-btn").attr("type", "submit");
    }

  });
});
