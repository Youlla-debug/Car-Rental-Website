$(document).ready(function() {
    $(".details").hide();

    $(".toggle-checkbox").on("change", function() {
        var $detailsRow = $(this).closest("tr").next("tr.details");
        if ($(this).is(":checked")) {
            $detailsRow.show();
        } else {
            $detailsRow.hide();
        }
    });
    

    var proceedBtn = document.querySelector(".button");
    if (proceedBtn) {
        proceedBtn.addEventListener("click", function(e) {
            e.preventDefault();

            var selectedCars = document.querySelectorAll("input[name='car']:checked");
            if (selectedCars.length === 0) {
                alert("يرجى اختيار سيارة واحدة على الأقل للمتابعة.");
                return;
            }

            var bookingSec = document.querySelector(".booking-section");
            if (bookingSec) {
                bookingSec.style.display = "block";
                bookingSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    var bookingForm = document.querySelector(".booking-form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function(e) {
            e.preventDefault(); 

            var fullNameInput = document.querySelector(".fullname-input");
            var nationalIdInput = document.querySelector(".national-id-input");
            var startDateInput = document.querySelector(".start-date-input");
            var endDateInput = document.querySelector(".end-date-input");
            var mobileInput = document.querySelector(".mobile-input");
            var emailInput = document.querySelector(".email-input");

            var fullName = fullNameInput ? fullNameInput.value.trim() : "";
            var nationalId = nationalIdInput ? nationalIdInput.value.trim() : "";
            var startDateStr = startDateInput ? startDateInput.value : "";
            var endDateStr = endDateInput ? endDateInput.value : "";
            var mobile = mobileInput ? mobileInput.value.trim() : "";
            var email = emailInput ? emailInput.value.trim() : "";

            if (fullName !== "") {
                var arabicRegex = /^[\u0600-\u06FF\s]+$/;
                if (!arabicRegex.test(fullName)) {
                    alert("خطأ: يجب أن يتضمن الاسم الكامل أحرفاً هجائية عربية فقط.");
                    return;
                }
            }

            if (nationalId === "") {
                alert("خطأ: الرقم الوطني حقل إلزامي.");
                return;
            }
            var nationalIdRegex = /^(0[1-9]|1[0-4])\d{9}$/;
            if (!nationalIdRegex.test(nationalId)) {
                alert("خطأ: الرقم الوطني يجب أن يتكون من 11 خانة رقمية، وتكون أول خانتين بين 01 و 14.");
                return;
            }

            if (startDateStr === "" || endDateStr === "") {
                alert("خطأ: تاريخا بداية ونهاية التأجير حقول إلزامية.");
                return;
            }

            var startDate = new Date(startDateStr);
            var endDate = new Date(endDateStr);

            if (endDate <= startDate) {
                alert("خطأ: يجب أن يكون تاريخ نهاية التأجير لاحقاً لتاريخ البداية.");
                return;
            }

            var diffTime = Math.abs(endDate - startDate);
            var rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (mobile !== "") {
                var mobileRegex = /^(09(3[0-9]|4[0-9]|5[0-9]|6[0-9]|8[0-9]|9[0-9])\d{6}|\+?9639(3[0-9]|4[0-9]|5[0-9]|6[0-9]|8[0-9]|9[0-9])\d{6})$/;
                if (!mobileRegex.test(mobile)) {
                    alert("خطأ: رقم الموبايل غير صحيح، يجب أن يطابق شبكتي Syriatel أو MTN.");
                    return;
                }
            }

            if (email !== "") {
                var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(email)) {
                    alert("خطأ: يرجى إدخال بريد إلكتروني صحيح.");
                    return;
                }
            }

            var selectedCarsInfo = [];
            var totalDailyRate = 0;

            var checkedCars = document.querySelectorAll("input[name='car']:checked");
            checkedCars.forEach(function(carCheckbox) {
                var carCode = carCheckbox.value;
                var carPrice = parseFloat(carCheckbox.getAttribute("data-price"));
                var trElement = carCheckbox.closest("tr");
                var carModel = trElement ? trElement.querySelector("td:nth-child(5)").textContent.trim() : "";
                
                selectedCarsInfo.push("- " + carModel + " (" + carCode + ")");
                totalDailyRate += carPrice;
            });

            var rawTotal = totalDailyRate * rentalDays;
            var discount = 0;
            var discountText = "لا يوجد (المدة أقل من أو تساوي 10 أيام)";

            if (rentalDays > 10) {
                discount = rawTotal * 0.05;
                discountText = "5% (تم تطبيق خصم لتجاوز 10 أيام)";
            }

            var finalTotal = rawTotal - discount;

            var resultMessage = "تم تقديم طلب الحجز بنجاح!\n\n" +
                "السيارات المختارة:\n" + selectedCarsInfo.join("\n") + "\n\n" +
                "عدد أيام التأجير لكل سيارة: " + rentalDays + " يوم/أيام\n" +
                "المبلغ الإجمالي قبل الخصم: " + rawTotal.toLocaleString() + " ل.س\n" +
                "الخصم: " + discountText + " (" + discount.toLocaleString() + " ل.س)\n" +
                "المبلغ النهائي المطلوب: " + finalTotal.toLocaleString() + " ل.س";

            alert(resultMessage);
        });
    }
});