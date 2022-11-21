// const socket = io("http://localhost:8088");
$(() => {
    navSetCategories();
    displayCategories()
    $(".nav_admin").click(navigate);
    $("#categories").click(displayCategories);
    $("#products").click(fetchCategories);
    $("#users").click(showUsers);
    $("#addCategory").on('keypress',function(e) {
        if(e.which == 13) {
            const id = $(this).val().trim();
            $.ajax({
                type: "POST",
                url: `http://localhost:8088/categories/${id}`,
                success: function () {
                    $("#addCategory").val("");
                    displayCategories
                },
                statusCode: {
                    400: function (res) {
                        alert(res.responseText);
                    },
                    500: function () { alert("Failed adding category, try again later") }
                }
            });
        }
    });

});


function deleteProduct() {
    const [placeholder, id] = $(this).attr("id").split("_");
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8088/products/${id}`,
        success: function () {
            fetchCategories();
        },
        error: function () { alert("Failed deleting product, try again later") }
    });
    socket.emit("updateOrDelete");
}

function uploadImg(id) {
    $(".uploadImgForm").attr("action", `http://localhost:8088/products/uploadImg/${id}`);

    $("#uploadFile").click(function (e) {
        if ($('#file')[0].files.length === 0) {
            e.preventDefault();
            alert("File is empty");
            emitUpdate()
        }
    });
}

function updateProduct() {
    const [placeholder, id] = $(this).attr("id").split("_");
    const name = $(`#EditproductName${id}`).val().trim();
    const color = $(`#EditColor${id}`).val().trim();
    const price = $(`#EditPrice${id}`).val().trim();
    const description = $(`#EditDescription${id}`).val().trim();
    const isAvailable = $(`#EditIsAvailable${id}`).is(":checked");

    if (notOnlyLettersAndNumbers(name)) {
        $(".edit_product_msg_placeholder").text("Name must be only words or numbers");
        return;
    }

    if (notOnlyLetters(color)) {
        $(".edit_product_msg_placeholder").text("Color must be only words");
        return;
    }

    if (notOnlyNumbers(price)) {
        $(".edit_product_msg_placeholder").text("Price must be only numbers");
        return;
    }

    if (notDescription(description)) {
        $(".edit_product_msg_placeholder").text("Description must be only words or numbers");
        return;
    }


    $.ajax({
        type: "PUT",
        url: `http://localhost:8088/products/${id}`,
        data: {
            name: name,
            color: color,
            price: price,
            description: description,
            isAvailable: isAvailable
        },
        success: function () {
            $(".edit_product_msg_placeholder").text("Updated successfully");
            console.log(id);
            socket.emit("updateOrDelete");
        },
        error: function () { $(".edit_product_msg_placeholder").text("Failed updating, try again later"); }
    })
}

function fetchAndExpandProduct() {
    const productId = $(this).attr("id");
    if ($(`#productDetails_${productId}`).hasClass('show')) {
        $(`#productDetails_${productId}`).collapse('hide');
    } else {
        $.ajax({
            type: "GET",
            url: `http://localhost:8088/products/product/${productId}`,
            success: function (product) {
                const productDetails = $(`#productDetails_${productId}`).html("");
                let productDisplayTemplate = $("#productDisplayTemplate").html();
                let editProductTemplate = $("#createOrEditProductModalTemplate").html();
                for (const key in product) {
                    productDisplayTemplate = productDisplayTemplate.replaceAll(`{${key}}`, product[key]);
                    editProductTemplate = editProductTemplate.replaceAll(`{${key}}`, product[key]);
                }
                editProductTemplate = editProductTemplate.replaceAll("{createOrEdit}", "Edit");
                productDetails.append(productDisplayTemplate);
                productDetails.append(editProductTemplate);

                if(product["isAvailable"])
                    $(`#EditIsAvailable${product["_id"]}`).attr("checked", true);

                $(`#delete_${productId}`).click(deleteProduct);
                $(`#edit_${productId}`).click(function () {
                    $(`#EditProductModal_${productId}`).modal('show');
                });
                $(`#close_${productId}`).click(function () {
                    $(`#EditProductModal_${productId}`).modal('hide');
                    fetchCategories();
                });
                $(`#send_${productId}`).click(updateProduct);
                uploadImg(productId);
                $(`#productDetails_${productId}`).collapse('show');
            }
        })
    }
}

function fetchProductsByCatgory() {
    const id = $(this).attr("id");
    $('.arrowIcon', this)
        .toggleClass('fa-circle-chevron-right')
        .toggleClass('fa-circle-chevron-down');

    if ($(`#${id}Products`).hasClass('show')) {
        $(`#${id}Products`).collapse('hide');
    } else {
        $.ajax({
            type: "GET",
            url: `http://localhost:8088/products/getProductsNames/${id.toLowerCase()}`,
            success: function (products) {
                const categoryListItem = $(`#${id}Products`).html("");
                for (let i = 0; i < products.length; i++) {
                    let listItemProductTemplate = $("#listItemProductTemplate").html();
                    listItemProductTemplate = listItemProductTemplate.replaceAll("{name}", products[i].name);
                    listItemProductTemplate = listItemProductTemplate.replaceAll("{_id}", products[i]._id);
                    categoryListItem.append(listItemProductTemplate);
                    $(`#${products[i]._id}`).click(fetchAndExpandProduct);
                }
                $(`#${id}Products`).collapse('show');

            }
        });
    }
}

function addProduct() {
    const [placeholder, category] = $(this).attr("id").split("_");

    const name = $(`#CreateproductName${category}`).val().trim();
    const color = $(`#CreateColor${category}`).val().trim();
    const price = $(`#CreatePrice${category}`).val().trim();
    const description = $(`#CreateDescription${category}`).val().trim();
    const isAvailable = $(`#CreateIsAvailable${category}`).is(":checked");

    if (notOnlyLettersAndNumbers(name)) {
        $(".edit_product_msg_placeholder").text("Name must be only words or numbers");
        return;
    }

    if (notOnlyLetters(color)) {
        $(".edit_product_msg_placeholder").text("Color must be only words");
        return;
    }

    if (notOnlyNumbers(price)) {
        $(".edit_product_msg_placeholder").text("Price must be only numbers");
        return;
    }

    if (notDescription(description)) {
        $(".edit_product_msg_placeholder").text("Description must be only words or numbers");
        return;
    }

    $.ajax({
        type: "POST",
        url: "http://localhost:8088/products/product",
        data: {
            name: name,
            price: price,
            category: category.toLowerCase(),
            color: color,
            description: description,
            isAvailable: isAvailable
        },
        success: function (data) {
            $(".edit_product_msg_placeholder").text("Created successfully");
            $(".uploadImageContainer").show();
            uploadImg(data.id);
        },
        error: function () { $(".edit_product_msg_placeholder").text("Failed Creating, try again later"); }
    })
}

function notDescription(value) {
    return (value && !(/^[0-9A-Za-z-%,.:! ]+$/).test(value));
}

function createAddProductModal(category) {
    let createProductModalTemplate = $("#createOrEditProductModalTemplate").html();
    createProductModalTemplate = createProductModalTemplate.replaceAll("{createOrEdit}", "Create");
    createProductModalTemplate = createProductModalTemplate.replaceAll("{name}", " ");
    createProductModalTemplate = createProductModalTemplate.replaceAll("{color}", " ");
    createProductModalTemplate = createProductModalTemplate.replaceAll("{price}", " ");
    createProductModalTemplate = createProductModalTemplate.replaceAll("{description}", " ");
    createProductModalTemplate = createProductModalTemplate.replaceAll("{_id}", category)
    $("body").append(createProductModalTemplate);
    $(`#send_${category}`).click(addProduct);
    $(".uploadImageContainer").hide();
    $(`#close_${category}`).click(function () {
        $(`#CreateProductModal_${category}`).modal('hide');
        fetchCategories();
    });
}

function openMatchingModal() {
    const [placeholder, category] = $(this).attr("id").split("_");
    $(`#CreateProductModal_${category}`).modal('show');
}

function deleteCategory() {
    const [placeholder, category] = $(this).attr("id").split("_");
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8088/categories/${category}`,
        success: function(){displayCategories()},
        error: function () { alert("Failed deleteing category, try again later"); }
    });
}

function updateIsAdmin() {
    const [placeholder, id] = $(this).attr("id").split("_");
    const isAdmin = $(this).is(":checked");
    const role = (isAdmin) ? "admin" : "user";
    if(confirm("Are you sure you want to change this user's role?"))
        $.ajax({
            type: "PUT",
            url: `http://localhost:8088/users/role/${id}`,
            data: {role: role},
            success: showUsers,
            error: function(){alert("Failed updating user's role, try again later");}
        });
}

function showUsers() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8088/users",
        success: function(users) {
            const usersTable = $("#usersTableBody").html("");
            for(let i=0; i < users.length; i++) {
                const currentUser = users[i];
                let usersTableRowTemplate = $("#usersTableRowTemplate").html();
                for(const key in currentUser) {
                    usersTableRowTemplate = usersTableRowTemplate.replaceAll(`{${key}}`, currentUser[key]);
                }
                const isAdmin = currentUser.role.includes("admin")?true:false;
                usersTableRowTemplate = usersTableRowTemplate.replaceAll("{isAdmin}", isAdmin);
                usersTableRowTemplate = usersTableRowTemplate.replaceAll("{i}", i+1);
                usersTable.append(usersTableRowTemplate);
                const [placeholder, current_admin_id] = $(".adminPanel").attr("id").split("_");
                if(isAdmin) {
                    $(`#isAdmin_${currentUser["_id"]}`).attr('checked', true);
                    if(current_admin_id == currentUser._id)
                        $(`#isAdmin_${currentUser["_id"]}`).attr("disabled", true);
                }
                $(`#isAdmin_${currentUser["_id"]}`).click(updateIsAdmin);
        }},
        error: function() {
            $("#users_msg").text("Failed getting users, try again later");
        }
    });
}

function displayCategories() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8088/categories",
        success: function (categories) {
            const categoryList = $(".displayCategoriesList").html("");
            for (let i = 0; i < categories.length; i++) {
                let itemTemplate = $("#displayCategoriesItemTemplate").html();
                itemTemplate = itemTemplate.replaceAll("{category}", categories[i]._id);
                categoryList.append(itemTemplate);
                $(`#delete_${categories[i]._id}`).click(deleteCategory);
            }

        }
    });
}

function fetchCategories() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8088/categories",
        success: function (categories) {
            const categoryList = $(".categoryList").html("");
            for (let i = 0; i < categories.length; i++) {
                let itemTemplate = $("#listItemCategoryTemplate").html();
                let createProductModalTemplate = $("#createOrEditProductModalTemplate").html();
                createProductModalTemplate = createProductModalTemplate.replaceAll("{createOrEdit}", "Create");
                createProductModalTemplate = createProductModalTemplate.replaceAll("{name}", " ");
                createProductModalTemplate = createProductModalTemplate.replaceAll("{color}", " ");
                createProductModalTemplate = createProductModalTemplate.replaceAll("{price}", " ");
                createProductModalTemplate = createProductModalTemplate.replaceAll("{description}", " ");
                createProductModalTemplate = createProductModalTemplate.replaceAll("{isAvailable}", "true");
                createProductModalTemplate = createProductModalTemplate.replaceAll("{_id}", categories[i]._id);
                itemTemplate = itemTemplate.replaceAll("{category}", categories[i]._id);
                categoryList.append(itemTemplate);
                categoryList.append(createProductModalTemplate);
                $(".uploadImageContainer").hide();
                $(`#close_${categories[i]._id}`).click(function () {
                    $(`#CreateProductModal_${categories[i]._id}`).modal('hide');
                    fetchCategories();
                });
                $(`#send_${categories[i]._id}`).click(addProduct);
            }
            $(`.categoryItem`).click(fetchProductsByCatgory);
            $(".addProduct").click(openMatchingModal);
        }
    })
}

function navSetSocialMedia() {
    $("#categoriesContainer").hide();
    $("#productsContainer").hide();
    $("#usersContainer").hide();
    $("#socialMediaContainer").show();
}

function navSetCategories() {
    $("#categoriesContainer").show();
    $("#productsContainer").hide();
    $("#usersContainer").hide();
    $("#socialMediaContainer").hide();
}

function navSetProducts() {
    $("#categoriesContainer").hide();
    $("#productsContainer").show();
    $("#usersContainer").hide();
    $("#socialMediaContainer").hide();
}

function navSetUsers() {
    $("#categoriesContainer").hide();
    $("#productsContainer").hide();
    $("#usersContainer").show();
    $("#socialMediaContainer").hide();
}

function navigate() {
    const elementId = $(this).attr("id");
    $(".chosen_nav_link").removeClass("chosen_nav_link");
    $(this).addClass("chosen_nav_link");

    switch (elementId) {
        case "categories":
            navSetCategories();
            break;
        case "products":
            navSetProducts();
            break;
        case "users":
            navSetUsers();
            break;
        case "socialMedia":
            navSetSocialMedia();
            break;
        default:
            navSetCategories();
            break;

    }
}
