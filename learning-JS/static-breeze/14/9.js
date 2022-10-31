(function(){
    var isTestingAB = (typeof _GLOBAL.CUSTOMER.USE_PERSONALIZE !== 'undefined') ? _GLOBAL.CUSTOMER.USE_PERSONALIZE : false;

    function initABTestingUserGroup() {

        this.setCookie = function (name, value, day) {
            var date = new Date();
            var intDay = parseInt(day, 10);
            date.setTime(date.getTime() + intDay * 60 * 60 * 24 * 1000);
            document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/;';
            console.log('cookie object :', value);
        };

        this.getCookie = function (name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        };

        this.deleteCookie = function (name) {
            var date = new Date();
            document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
        }

        function getUserGroupByRandomize(ratio) {
            var setRatio = 0.5; // 0 ~ 1 사이에 비율 지정. 기본 값은 5:5 Group A 기준 비율
            setRatio = (ratio !== null) ? ratio : setRatio;

            var result = Math.floor(Math.random() * (100 - 1)) + 1;
            if (result <= (setRatio * 100)) {
                return 'A';
            } else {
                return 'B';
            }
        }

        try {
            var cookieValue = '';

            if (isTestingAB) {
                var nameOfGroupA = (typeof _GLOBAL.CUSTOMER.PERSONALIZE_TNAME_TEST !== 'undefined') ? _GLOBAL.CUSTOMER.PERSONALIZE_TNAME_TEST : '';
                var nameOfGroupB = (typeof _GLOBAL.CUSTOMER.PERSONALIZE_TNAME_CONTROL !== 'undefined') ? _GLOBAL.CUSTOMER.PERSONALIZE_TNAME_CONTROL : '';
                if (nameOfGroupA == '' || nameOfGroupB == '') {
                    throw new Error("할당되지 않은 그룹이름이 존재합니다. 관리자에서 그룹이름을 지정해주세요.");
                }

                cookieValue = this.getCookie('abTestingUserGroup');
                var isSetUserGroup = ((cookieValue == nameOfGroupA) || (cookieValue == nameOfGroupB));
                if (isSetUserGroup) { //기존에 저장된 쿠키 값이 존재할 시에는 쿠키 값 반환
                    if (_dl.customer_tester !== 'undefined') {
                        _dl.customer_tester = cookieValue;
                    }
                    return cookieValue;
                } else { //쿠키가 없을 시에는 생성 후 쿠키 값 반환
                    //getUserGroupByRandomize에서 'A' 또는 'B' 반환
                    switch (getUserGroupByRandomize(0.5)) {
                        case 'A':
                            cookieValue = nameOfGroupA;
                            break;
                        case 'B':
                            cookieValue = nameOfGroupB;
                            break;
                        default:
                            throw new Error("그룹 할당에 실패하였습니다.");
                    }

                    this.setCookie('abTestingUserGroup', cookieValue, 365);
                    //var cookieResult = this.getCookie('abTestingUserGroup');
                    //console.log("init A/B Testing Cookie : " + cookieResult);

                    if (_dl.customer_tester !== 'undefined') {
                        _dl.customer_tester = cookieValue;
                    }
                    return cookieValue;
                }

            } else {

                this.deleteCookie('abTestingUserGroup');
                return false;
            }

        } catch (err) {
            console.log('AB Testing Script Error : ' + err)
            return false;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        if(isTestingAB){
            initABTestingUserGroup();
        }
    });
})();