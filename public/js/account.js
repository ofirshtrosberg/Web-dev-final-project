$( () => {

    $(".orders_container").hide();
    $(".credit_cards_container").hide();
    $(".contact_details_container").hide();

    $(".edit_info_login_container").hide();
    $("#edit_login_info,#display_login_info").click( function() {
        $(".edit_info_login_container,.display_info_login_container").toggle();
    });

    $(".edit_profile_pic_container").hide();
    $("#edit_profile_pic,#display_profile_pic").click(function() {
        $(".edit_profile_pic_container,.display_profile_pic_container").toggle();
    });

    $(".edit_profile_info_container").hide();
    $("#edit_profile_info,#display_profile_info").click(function() {
        $(".edit_profile_info_container,.display_profile_info_container").toggle();
    });

    $("#uploadFile").click(function(e) {
        if ($('#file')[0].files.length === 0) {
            e.preventDefault();
            alert("File is empty");
        }
    });

    $(".nav_account").click(handleNavAccount);

    $("#new_username").keyup(enableSaveUsernameButton);
    $("#new_pass").keyup(enableSavePasswordButton);

    $("#save_username_button").click(function() {
        $.ajax({
            type: 'PUT',
            url: "http://localhost:8088/users",
            data: {username: $("#new_username").val().trim()},
            success: function(data) {$("#username_msg_placeholder").text("Username updated successfully");},
            error: function(data) {$("#username_msg_placeholder").text("Failed updating username, try again later");}
        });
    });

    $("#save_password_button").click(function() {
        $.ajax({
            type: 'PUT',
            url: "http://localhost:8088/users",
            data: {password: $("#new_pass").val().trim()},
            success: function(data) {$("#password_msg_placeholder").text("Password updated successfully");},
            error: function(data) {$("#password_msg_placeholder").text("Failed updating password, try again later");}
        });
    });

    $("#save_profile_info_button").click(sendProfileInfo);

    $("#closeAccount").click(closeAccount);

    $("#contact_details").click(getAndRenderContactDetails);

    $("#save_contact").click(addContactDetails);

    $("#credit_cards").click(getAndRenderCreditCards);

    $("#orders").click(fetchAndRenderOrders);
    
}); 

function closeAccount() {
    if(confirm("Are you sure you want to close your account at Chic Et Unique?")) {
        $.ajax({
            type: "DELETE",
            url: "http://localhost:8088/accounts/deleteAccount",
            success: function(){
                window.location.href = "http://localhost:8088/";
            },
            error: function() {
                alert("Failed closing account, try again later");
            }
        })
    }
}

function setValidationOnCreditCardNumber(id) {
    new IMask($(`#${id}`), {
        mask: [
            {
                mask: '0000 000000 00000',
                regex: '^3[47]\\d{0,13}',
                cardtype: 'american express'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}',
                cardtype: 'discover'
            },
            {
                mask: '0000 000000 0000',
                regex: '^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}',
                cardtype: 'diners'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
                cardtype: 'mastercard'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^4\\d{0,15}',
                cardtype: 'visa'
            }
        ],
        dispatch: function (appended, dynamicMasked) {
            var number = (dynamicMasked.value + appended).replace(/\D/g, '');
    
            for (var i = 0; i < dynamicMasked.compiledMasks.length; i++) {
                let re = new RegExp(dynamicMasked.compiledMasks[i].regex);
                if (number.match(re) != null) {
                    return dynamicMasked.compiledMasks[i];
                }
            }
        }
    });
}

function addCVVValidations(id) {
    const cvvInput = document.getElementById(id);
    var cvv_mask = new IMask(cvvInput, {
        mask: '000',
    });
}

function addCreditCardNumberValidations(id) {
    const cardInput = document.getElementById(id);
    var cardnumber_mask = new IMask(cardInput, {
        mask: [
            {
                mask: '0000 000000 00000',
                regex: '^3[47]\\d{0,13}',
                cardtype: 'american express'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}',
                cardtype: 'discover'
            },
            {
                mask: '0000 000000 0000',
                regex: '^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}',
                cardtype: 'diners'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
                cardtype: 'mastercard'
            },
            {
                mask: '0000 0000 0000 0000',
                regex: '^4\\d{0,15}',
                cardtype: 'visa'
            },
        ]
    });
}

function addExpirationDateValidations(id) {
    const dateInput = document.getElementById(id);
    var expirationdate_mask = new IMask(dateInput, {
        mask: 'MM{/}YY',
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
        }
    });
}

function addCreditCard() {
    const cardType = $("#add_card_type").val();
    const cardNumber = $("#add_card_number").val().trim();
    const cardCvv = $("#add_card_cvv").val().trim();
    const expirationDate = $("#add_expiration_date").val().trim();
    const fullName = $("#add_owner_name").val().trim();
    const id = $("#add_owner_id").val().trim();

    if(notOnlyLetters(fullName)) {
        $("#add_credit_card_msg_placeholder").text("Full name can be only letters");
        return;
    }

    if(notOnlyNumbers(id) || !(id.length >= 9 && id.length <= 10 )) {
        $("#add_credit_card_msg_placeholder").text("Invalid owner ID number");
        return;
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:8088/creditCards",
        data: {
            cardType: cardType,
            cardNumber: cardNumber,
            cardCVV: cardCvv,
            cardExpirationDate: expirationDate,
            cardOwnerName: fullName,
            cardOwnerId: id
        },
        success: function(data){$("#add_credit_card_msg_placeholder").text("Card details saved successfully");},
        error: function(data){$("#add_credit_card_msg_placeholder").text("Failed saving card details, try again later");}
        });
}

function getAndRenderCreditCards() {
    $("#creditCardDetails").html("");
    $.ajax({
        type: "GET",
        url: "http://localhost:8088/creditCards",
        success: function(res) {
            if(!res.length) {
                let addCreditCardTemplate = $("#addCreditCardTemplate").html();
                $("#creditCardDetails").append(addCreditCardTemplate);
                $("#addCardButton").click(function() {
                    addCreditCardNumberValidations("add_card_number");
                    addCVVValidations("add_card_cvv");
                    addExpirationDateValidations("add_expiration_date");
                    $("#save_add_credit_card").click(addCreditCard);
                });
            } else {
                let creditCardTemplate = $("#creditCardTemplate").html();
                const creditCard = res[0];
                const cardNumber = creditCard.cardNumber.split(" ");
                const hiddenCardNumber = `${cardNumber[0]} **** **** ****`;
                const hiddenCardCvv = "***";
                for(const key in creditCard) {
                    creditCardTemplate = creditCardTemplate.replaceAll(`{${key}}`, creditCard[key]);
                }
                creditCardTemplate = creditCardTemplate.replaceAll("{hiddenCardNumber}", hiddenCardNumber);
                creditCardTemplate = creditCardTemplate.replaceAll("{hiddenCardCvv}", hiddenCardCvv);
                $("#creditCardDetails").append(creditCardTemplate)
                $(".edit_credit_card_container").hide();
                $(`#edit_${creditCard._id}`).click(switchDisplayToEditCreditCard);
                $(`#back_${creditCard._id}`).click(switchEditToDisplayCreditCard);
                $(`#delete_${creditCard._id}`).click(deleteCreditCard)
                $("#edit_card_type").val(creditCard.cardType).change();
                addCreditCardNumberValidations("edit_card_number");
                addCVVValidations("edit_card_cvv");
                addExpirationDateValidations("edit_expiration_date");
                $("#save_edit_credit_card").click(updateCreditCard);
            }
        }
    })
}

function updateCreditCard() {
    const creditCardId = $(this).parents(".edit_credit_card_container").attr("id");
    const cardType = $("#edit_card_type").val();
    const cardNumber = $("#edit_card_number").val().trim();
    const cardCvv = $("#edit_card_cvv").val().trim();
    const expirationDate = $("#edit_expiration_date").val().trim();
    const fullName = $("#edit_owner_name").val().trim();
    const id = $("#edit_owner_id").val().trim();

    if(notOnlyLetters(fullName)) {
        $("#edit_credit_card_msg_placeholder").text("Full name can be only letters");
        return;
    }

    if(notOnlyNumbers(id) || !(id.length >= 9 && id.length <= 10 )) {
        $("#edit_credit_card_msg_placeholder").text("Invalid owner ID number");
        return;
    }

    $.ajax({
        type: "PUT",
        url: `http://localhost:8088/creditCards/${creditCardId}`,
        data: {
            cardType: cardType,
            cardNumber: cardNumber,
            cardCVV: cardCvv,
            cardExpirationDate: expirationDate,
            cardOwnerName: fullName,
            cardOwnerId: id
        },
        success: function(data){$("#edit_credit_card_msg_placeholder").text("Card details saved successfully");},
        error: function(data){$("#edit_credit_card_msg_placeholder").text("Failed saving card details, try again later");}
        });
}

function deleteCreditCard() {
    const [placeholder, id] = $(this).attr("id").split("_");
    if(confirm("Are you sure you want to delete saved credit card details?") == true) {
        $.ajax({
            type: "DELETE",
            url: `http://localhost:8088/creditCards/${id}`,
            success: function(data){getAndRenderCreditCards();},
            error: function(data){alert("Failed deleteing credit card, try again later")}
        });
    }
}

function getAndRenderContactDetails() {
    $("#allContactDetails").html("");
    $.ajax({
        type: "GET",
        url: "http://localhost:8088/contactDetails",
        success: function(res) {
            if(res.length == 0) {
                let messagesTemplate = $("#messagesTemplate").html().replaceAll("{msg}", "You don't have any contact details at the moment");
                $("#allContactDetails").append(messagesTemplate);
            } else {
            for(let i=0; i < res.length; i++) {
                let contactDetailsTemplate = $("#contactDetailsTemplate").html();
                const currContactDetails = res[i];
                const [phoneNumberPrefix, phoneNumberSuffix] = currContactDetails.phoneNumber.split("-");
                const [street, restAddress, city, zip] = currContactDetails.address.split(",");
                for(const key in currContactDetails) {
                    contactDetailsTemplate = contactDetailsTemplate.replaceAll(`{${key}}`, currContactDetails[key]);
                }
                contactDetailsTemplate = contactDetailsTemplate.replaceAll("{phoneNumberSuffix}", phoneNumberSuffix);
                contactDetailsTemplate = contactDetailsTemplate.replaceAll("{street}", street);
                contactDetailsTemplate = contactDetailsTemplate.replaceAll("{restAddress}", restAddress);
                contactDetailsTemplate = contactDetailsTemplate.replaceAll("{city}", city);
                contactDetailsTemplate = contactDetailsTemplate.replaceAll("{zip}", zip);
                $("#allContactDetails").append(contactDetailsTemplate);
                $(`#phonePrefix_${currContactDetails._id}`).val(phoneNumberPrefix).change();
                $(".edit_contact_details_container").hide();
                $(`#edit_${currContactDetails._id}`).click(switchDisplayToEditContactDetails);
                $(`#back_${currContactDetails._id}`).click(switchEditToDisplayContactDetails);
                $(`#delete_${currContactDetails._id}`).click(deleteContactDetails);
                $(".save_edit_contact").click(updateContactDetails);
            }}
        },
        error: function() {
            let messagesTemplate = $("#messagesTemplate").html().replaceAll("{msg}", "Oops, something went wrong, try again later");
            $("#allContactDetails").append(messagesTemplate);
        }
    });
}

function deleteContactDetails() {
    const [placeholder, id] = $(this).attr("id").split("_");
    if(confirm("Are you sure you want to delete this contact detail?") == true) {
        $.ajax({
            type: "DELETE",
            url: `http://localhost:8088/contactDetails/${id}`,
            success: function(data){getAndRenderContactDetails();},
            error: function(data){alert("Failed deleteing contact details, try again later")}
        });
    }
}

function switchEditToDisplayCreditCard() {
    const editContainerId = $(this).parents(".edit_credit_card_container").attr("id");
    const displayContainerId = `display_${editContainerId}`;
    $(`#${displayContainerId},#${editContainerId}`).toggle();
}

function switchDisplayToEditCreditCard() {
    const displayContainerId = $(this).parents(".display_credit_card_container").attr("id");
    const editContainerIdArray = displayContainerId.split("_");
    const editContainerId = editContainerIdArray[1];
    $(`#${displayContainerId},#${editContainerId}`).toggle();
}

function switchDisplayToEditContactDetails() {
    const displayContainerId = $(this).parents(".display_contact_details_container").attr("id");
    const editContainerIdArray = displayContainerId.split("_");
    const editContainerId = editContainerIdArray[1];
    $(`#${displayContainerId},#${editContainerId}`).toggle();
}

function switchEditToDisplayContactDetails() {
    const editContainerId = $(this).parents(".edit_contact_details_container").attr("id");
    const displayContainerId = `display_${editContainerId}`;
    $(`#${displayContainerId},#${editContainerId}`).toggle();
}

function updateContactDetails() {
    const parentDiv = $(this).parents(".edit_contact_details_container");
    const description = parentDiv.find(".description_edit").val().trim();
    const phonePrefix = parentDiv.find(".phone_prefix_edit").val();
    const phoneNumber = parentDiv.find(".phone_number_edit").val().trim();
    const street = parentDiv.find(".street_edit").val().trim();
    const restAddress = parentDiv.find(".rest_address_edit").val().trim();
    const city = parentDiv.find(".city_edit").val().trim();
    const zip = parentDiv.find(".zip_edit").val().trim();

    if(notOnlyLetters(description)) {
        parentDiv.find("#edit_contact_details_msg_placeholder").text("Description must contain only letter");
        return;
    }

    if(notOnlyNumbers(phoneNumber) || phoneNumber.length != 7){
        parentDiv.find("#edit_contact_details_msg_placeholder").text("Invalid phone number");
        return;
    }

    if(notOnlyLettersAndNumbers(street) || notOnlyLetters(city) || notOnlyLettersAndNumbers(restAddress) || notOnlyNumbers(zip) || zip.length != 7) {
        parentDiv.find("#edit_contact_details_msg_placeholder").text("Invalid address");
        return;
    }

    const fullPhoneNumber = [phonePrefix, phoneNumber].join('-');
    const fullAddress = [street, restAddress, city, zip].join(',');

    const contactObj = {
        description: description,
        phoneNumber: fullPhoneNumber,
        address: fullAddress
    }

    const contactDetailsId = parentDiv.attr("id");

    $.ajax({
        type: 'PUT',
        url: `http://localhost:8088/contactDetails/${contactDetailsId}`,
        data: contactObj,
        success: getAndRenderContactDetails,
        error: function(data) {$("#edit_toast").text("Faild updating, try again later").toast('show');}
    });

}

function addContactDetails() {
    const description = $("#description_input").val().trim();
    const phonePrefix = $("#phone_prefix").val();
    const phoneNumber = $("#phone_number_input").val().trim();
    const street = $("#street_input").val().trim();
    const restAddress = $("#rest_address_input").val().trim();
    const city = $("#city_input").val().trim();
    const zip = $("#zip_input").val().trim();

    if(notOnlyLetters(description)) {
        $("#contact_details_msg_placeholder").text("Description must contain only letters");
        return;
    }

    if(notOnlyNumbers(phoneNumber) || phoneNumber.length != 7){
        $("#contact_details_msg_placeholder").text("Invalid phone number");
        return;
    }

    if(notOnlyLettersAndNumbers(street) || notOnlyLetters(city) || notOnlyLettersAndNumbers(restAddress) || notOnlyNumbers(zip) || zip.length != 7) {
        $("#contact_details_msg_placeholder").text("Invalid address");
        return;
    }

    const fullPhoneNumber = [phonePrefix, phoneNumber].join('-');
    const fullAddress = [street, restAddress, city, zip].join(',');

    const contactObj = {
        description: description,
        phoneNumber: fullPhoneNumber,
        address: fullAddress
    }

    $.ajax({
        type: 'POST',
        url: "http://localhost:8088/contactDetails",
        data: contactObj,
        success: function(data) {
            $("#contact_details_msg_placeholder").text("Contact details saved successfully");
            getAndRenderContactDetails();
        },
        error: function(data) {$("#contact_details_msg_placeholder").text("Failed adding contact details, try again later");}
    });


}

function notOnlyLettersAndNumbers(value) {
    return (value && !(/^[0-9A-Za-z-% ]+$/).test(value));
}

function notOnlyNumbers(value) {
    return (value && !(/^[0-9]+$/).test(value));
}

function handleNavAccount() {
    const id = $(this).attr('id');
    $(".chosen_nav_link").removeClass("chosen_nav_link");
    $(this).addClass("chosen_nav_link");

    switch(id) {
        case 'information':
            $(".information_container").show();
            $(".orders_container").hide();
            $(".credit_cards_container").hide();
            $(".contact_details_container").hide();
            $("#addContactDetailForm").hide();
            break;
        case 'orders':
            $(".information_container").hide();
            $(".orders_container").show();
            $(".credit_cards_container").hide();
            $(".contact_details_container").hide();
            $("#addContactDetailForm").hide();
            break;
        case 'credit_cards':
            $(".information_container").hide();
            $(".orders_container").hide();
            $(".credit_cards_container").show();
            $(".contact_details_container").hide();
            $("#addContactDetailForm").hide();
            break;
        case 'contact_details':
            $(".information_container").hide();
            $(".orders_container").hide();
            $(".credit_cards_container").hide();
            $(".contact_details_container").show();
            break;
        default:
            $(".information_container").hide();
            $(".orders_container").hide();
            $(".credit_cards_container").hide();
            $(".contact_details_container").hide();
            $("#addContactDetailForm").hide();

    }
}

function notOnlyLetters(value) {
    return (value && !(/^[A-Za-z- ]+$/).test(value));
}


function sendProfileInfo() {
    const email = $("#email_input").val().trim();
    const firstName = $("#firstname_input").val().trim();
    const gender = $("input[name='gender']:checked").val();
    const birthDate = $("#birth_date_input").val();

    if(email && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        $("#profile_info_msg_placeholder").text("You entered invalid email");
        return;
    }

    if(notOnlyLetters(firstName)) {
        $("#profile_info_msg_placeholder").text("First name must contain only letters");
        return;
    }

    const updateObj = { 
        email: email,
        firstName: firstName,
        dateOfBirth: birthDate,
        gender: gender
    };
    Object.keys(updateObj).forEach(key => (updateObj[key] === undefined || updateObj[key] =="")?delete updateObj[key]: {});

    $.ajax({
        type: 'PUT',
        url: "http://localhost:8088/accounts/account",
        data: updateObj,
        success: function(data) {$("#profile_info_msg_placeholder").text("Updated successfully");},
        error: function(data) {$("#profile_info_msg_placeholder").text("Failed updating, try again later");}
    });


}

function enableSaveUsernameButton() {
    const username = $(this).val().trim();
    if(username.length >= 5) {
        $.getJSON(`http://localhost:8088/users/getUser?username=${username}`, function(res) {
            if(!$.isEmptyObject(res)) {
                $("#username_msg_placeholder").text("Username already exists");
            } else {
                $("#username_msg_placeholder").text("");
                $("#save_username_button").removeAttr("disabled");
            }
        });
    }
}

function enableSavePasswordButton() {
    const password = $(this).val().trim();
    if(password.length >= 5) {
        $("#save_password_button").removeAttr("disabled");
    }
}

function fetchAndRenderOrders() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8088/orders",
        success: function(orders) {
            if(orders.length == 0) {
                $("#ordersMsg").text("You don't have orders at the moment, it's time to start buying :)")
            } else {
                const ordersTable = $("#ordersTableBody").html("");
                for(let i=0; i < orders; i++) {
                    let orderRowTemplate = $("#ordersRowTemplate").html();
                    const currentOrder = orders[i];
                    for(const key in currentOrder) {
                        orderRowTemplate = orderRowTemplate.replaceAll(`{${key}}`, currentOrder[key]);
                    }
                    orderRowTemplate = orderRowTemplate.replaceAll("{i}", i+1);
                    ordersTable.append(orderRowTemplate);
            }
            }
        },
        error: function() {
            $("#ordersMsg").text("Failed getting your orders details, try again later.")
        }
        }
    )
}