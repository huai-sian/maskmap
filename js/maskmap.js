var weekday=document.querySelector(".week");
var date_js=document.querySelector(".date");
var maskrule_js=document.querySelector(".mask-rule");
var list_js=document.querySelector(".list");
var result_li_js=document.querySelector(".result_li");
var adult_sq_js=document.querySelector(".adult_sq");
var child_sq_js=document.querySelector(".child_sq");
var map_js=document.querySelector(".p-map");
var bar_js=document.querySelector(".bar");
var toggles_js=document.querySelector('.toggles');
var load=document.querySelector(".loading");
var localiz_icon=document.querySelector(".geo_icon");
var district_li=document.querySelector('.list_district');
var search_input=document.querySelector('.search_input');
var search_icon=document.querySelector('.search_icon');
var center_block = document.querySelector('.center-block');

function randomstring(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const params = new URLSearchParams();
params.append('grant_type', 'authorization_code');
params.append('code', 'MVRZD756LEm6YmXSlv0R');
params.append('redirect_uri', 'https://huai-sian.github.io/maskmap/');
params.append('client_id', '1656094239');
params.append('client_secret', 'b985b3a95e36c586bd61e4122ad5930d');

center_block.addEventListener('click', function(){
    document.location.href=`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1656094239&redirect_uri=https://huai-sian.github.io/maskmap/&state=${randomstring(8)}&scope=profile%20openid%20email&nonce=09876xyz`;
    console.log('test');
    axios.post('https://api.line.me/oauth2/v2.1/token', {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}, params).then((res) => {
        console.log(res);
    })
   /*  axios.get('https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js').then((res) => {
        console.log('test');
        console.log(res);
    }) */
})

//收縮選單
if(window.innerWidth<768){
    toggle_sidebar();
}
toggles_js.addEventListener("click",toggle_sidebar,false);

function toggle_sidebar(){
    map_js.classList.toggle('active_map');
    bar_js.classList.toggle('active_bar');
    toggles_js.classList.toggle("active_show");
}
//產生日期
function renderdate(){
    var d=new Date();
    var _year= d.getFullYear();
    var _day=d.getDate().toString();
    var _month=(d.getMonth()+1).toString();
    _day=_day.length<2? "0"+_day:_day;
    _month=_month.length<2? "0"+_month:_month;
    var weeknum= d.getDay();
    var today=_year+"-"+_month+"-"+_day;
    weekday.textContent=chineseday(weeknum);
    date_js.textContent=today;
    if(weeknum==1||weeknum==3||weeknum==5){
        document.querySelector(".odd").style.display="block";
    }else if(weeknum==2||weeknum==4||weeknum==6){
        document.querySelector(".even").style.display="block";
    }else{
        document.querySelector(".all").style.display="block";
    }
}

function chineseday(day){
    switch(day){
        case 0:
           return "星期日";
            break;
        case 1:
            return "星期一";
            break;
        case 2:
            return  "星期二";
            break;
        case 3:
            return  "星期三";
            break;
        case 4:
            return "星期四";
            break;
        case 5:
            return "星期五";
            break;
        case 6:
            return "星期六";
            break;
    }
}

renderdate();

//載入地圖
var map=L.map('map',{
    center:[25.1336064,121.7406334],
    zoom:16
})
//加入底圖（一塊一塊圖專組成）
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
//先統一icon的大小及樣式，再各自宣告不同顏色的icon
var LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }
});
var greenIcon = new LeafIcon({iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'});
var redIcon= new LeafIcon({iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'});
var greyIcon= new LeafIcon({iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png'});
//加入markers群組圖層（一個一個區塊）
var markers=new L.MarkerClusterGroup().addTo(map);
//一開始於0,0的位置，加入標記
var marker=L.marker([0,0],{icon:redIcon}).addTo(map);

//定位使用者位置，並顯示出來
if('geolocation' in navigator){
    console.log("Location available!");
    navigator.geolocation.getCurrentPosition(position => {
        nowlatitude  = position.coords.latitude;
        nowlongitude = position.coords.longitude;
        //取得使用者位置之後，將地圖顯示zoom層級：15
        map.setView([nowlatitude,nowlongitude],15);
        //原本的icon標記在使用者定位之後，調整經緯度，打開popup
        marker.setLatLng([nowlatitude,nowlongitude],{icon:redIcon}).bindPopup('<h1>目前位置</h1>').openPopup();
    });
}else{
    console.log("Location not available!")
}
//點擊定位icon再次顯示使用者所在位置
localiz_icon.addEventListener('click',function(){
    map.setView([nowlatitude,nowlongitude],16);
    marker.setLatLng([nowlatitude,nowlongitude],{icon:redIcon}).bindPopup('<h1>目前位置</h1>').openPopup();
},false)

let data;
function getData(){
    toggles_js.style.display="none";
    localiz_icon.style.display="none";
    const xhr=new XMLHttpRequest();
    xhr.open('get','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',true);
    xhr.send(); 
    xhr.onload=function(){
        load.style.display="none";
        toggles_js.style.display="block";
        localiz_icon.style.display="block";
        data=JSON.parse(xhr.responseText).features;
        addMarkers();
        addCountylist();
        renderlist('臺北市','中正區');
    }
}
getData();
 //加入全部藥局資料的markers
function addMarkers(){
    let nowlatitude;
    let nowlongitude;
    navigator.geolocation.getCurrentPosition(position => {
        nowlatitude  = position.coords.latitude;
        nowlongitude = position.coords.longitude;
        
    });
    for(let i=0;i<data.length;i++){
        var mask_color;
        if(data[i].properties.mask_adult==0){
            mask_color=greyIcon;
        }else if(data[i].properties.mask_adult<=10){
            mask_color=redIcon;
        }else{
            mask_color=greenIcon;
        } 
        function check_adult(num){
            if(num >10){
                return 'h-bg-primary';
            }else if(num<10&&num!==0){
                return 'h-bg-middle'
            }else{
                return 'h-bg-info';
            }
        }
        function check_child(num){
            if(num >10){
                return 'h-bg-primary';
            }else if(num<10&&num!==0){
                return 'h-bg-middle'
            }else{
                return 'h-bg-info';
            }
        }
        var a_num_back=check_adult(data[i].properties.mask_adult);
        var c_num_back=check_child(data[i].properties.mask_child);
        var pack='<h1 class="pop_h1">'+data[i].properties.name+'</h1><p>'+data[i].properties.address+'</p><p>'+
        data[i].properties.phone+'</p><p>'+data[i].properties.note+'<div class="adult_sq '+a_num_back+'"><span>成人口罩</span><span>'+
        data[i].properties.mask_adult+'</span></div><div class="child_sq '+c_num_back+'"><span>兒童口罩</span><span>'+
        data[i].properties.mask_child+'</span></div><div><a class="togoogle" href="https://www.google.com.tw/maps/place/'+data[i].properties.address+'">Google 導航</a></div>';
        //在群組圖層中加入地圖資料點
        markers.addLayer(L.marker([data[i].geometry.coordinates[1],data[i].geometry.coordinates[0]],
            {icon:mask_color}).bindPopup(pack));
    }
     //再於整個map中加入群組圖層
    map.addLayer(markers);
}     
//製作縣市選單，先宣告一空陣列，作為存放縣市列表的陣列，用for迴圈挑出縣市並選出唯一值放入陣列中    
function addCountylist(){
    let option="";
    let allCounty=[];
    for(let i=0;i<data.length;i++){
        let countyName=data[i].properties.county;
        if(countyName!==''&&allCounty.indexOf(countyName)===-1){
            allCounty.push(countyName);
        }
    }
    for(let i=0;i<allCounty.length;i++){
    option+='<option value="'+allCounty[i]+'">'+allCounty[i]+'</option>';
    }
    list_js.innerHTML+=option;
}
    list_js.addEventListener("change",addTownlist,false);
//製作地區選單，先宣告一空陣列，作為存放地區列表的陣列，用for迴圈判斷所選擇縣市與資料中縣市，相同則將其地區放入陣列中，
//再用set去除陣列中重複的地區，
function addTownlist(e){
    let selectedCounty=e.target.value;
    let option_town='';
    let allTown=[];
    let newAlltown=''
    for(let i=0;i<data.length;i++){
        if(data[i].properties.county===selectedCounty){
            allTown.push(data[i].properties.town);
        }
    }
    newAlltown=new Set(allTown);//set後的結果是類陣列
    newAlltown=Array.from(newAlltown);//要轉回陣列
    newAlltown.unshift("請選擇地區");
    for(let i=0;i<newAlltown.length;i++){
        option_town+='<option value="'+newAlltown[i]+'">'+newAlltown[i]+'</option>';
    }
    district_li.innerHTML=option_town;
    district_li.addEventListener('change',geoTown,false);//使用者選完地區之後，先呈現該地區的地圖

}
//會定位出為該地區的最後一筆藥局位置，再產生出藥局結果列表，
function geoTown(e){
    let town=e.target.value;
    let townLaLo=[];
    let county='';
    for(let i=0;i<data.length;i++){
        let townTa=data[i].properties.town;
        let countyTa=data[i].properties.county;
        let latTa=data[i].geometry.coordinates[0];
        let lngTa=data[i].geometry.coordinates[1];
        if(town===townTa&&countyTa===list_js.value){
            townLaLo=[lngTa,latTa];
            county=data[i].properties.county;
        }
    }
    map.setView(townLaLo,17);
    renderlist(county,town);//傳入選擇的地區及縣市
}
/* search_icon.addEventListener('click',searchArea,false);
function searchArea(e){
    e.preventDefault();
    if(e.target.nodeName!=='A'){
        return;
    } 
    let input_txt=search_input.value;
    const pharmacyData = data.filter((element) =>
		element.properties.address.match(input_txt)
    );
    rendersearchlist(pharmacyData);
}   
 
function rendersearchlist(datas){
    var li="";
    for(let i=0;i<datas.length;i++){
        function check_adult(num){
            if(num >10){
                return 'h-bg-primary';
            }else if(num<10&&num!==0){
                return 'h-bg-middle'
            }else{
                return 'h-bg-info';
            }
        }
        function check_child(num){
            if(num >10){
                return 'h-bg-primary';
            }else if(num<10&&num!==0){
                return 'h-bg-middle'
            }else{
                return 'h-bg-info';
            }
        }
        var a_num_back=check_adult(datas[i].properties.mask_adult);
        var c_num_back=check_child(datas[i].properties.mask_child);
        li+='<li>'+'<h1>'+datas[i].properties.name+'</h1><a  href="#" class="locating fas fa-location-arrow" data-lat="'+data[i].geometry.coordinates[1]+'" data-long="'+data[i].geometry.coordinates[0]+'"></a><p>'+data[i].properties.address+'</p><p>'+
            datas[i].properties.phone+'</p><p>'+datas[i].properties.note+'<div class="adult_sq '+a_num_back+'"><span>成人口罩</span><span class="adult_num">'+
            datas[i].properties.mask_adult+'</span></div><div class="child_sq '+c_num_back+'"><span>兒童口罩</span><span class="child_num">'+
            datas[i].properties.mask_child+'</span></div>'+'</li>';
            
    
        result_li_js.innerHTML=li;
    }
    var locate_a=document.querySelectorAll(".locating");
    for(let i=0;i<locate_a.length;i++){
        locate_a[i].addEventListener("click",locateTo,false); 
    }
}*/
function renderlist(county,town){
    var li="";
    for(let i=0;i<data.length;i++){
        function check_adult(num){
            if(num >10){
                return 'h-bg-primary';
            }else if(num<10&&num!==0){
                return 'h-bg-middle'
            }else{
                return 'h-bg-info';
            }
        }
        function check_child(num){
            if(num >10){
                return 'h-bg-primary';
            }else if(num<10&&num!==0){
                return 'h-bg-middle'
            }else{
                return 'h-bg-info';
            }
        }
        var a_num_back=check_adult(data[i].properties.mask_adult);
        var c_num_back=check_child(data[i].properties.mask_child);
        if(data[i].properties.county===county&&data[i].properties.town===town){
            li+='<li>'+'<h1>'+data[i].properties.name+'</h1><a  href="#" class="locating fas fa-location-arrow" data-lat="'+data[i].geometry.coordinates[1]+'" data-long="'+data[i].geometry.coordinates[0]+'"></a><p>'+data[i].properties.address+'</p><p>'+
            data[i].properties.phone+'</p><p>'+data[i].properties.note+'<div class="adult_sq '+a_num_back+'"><span>成人口罩</span><span class="adult_num">'+
            data[i].properties.mask_adult+'</span></div><div class="child_sq '+c_num_back+'"><span>兒童口罩</span><span class="child_num">'+
            data[i].properties.mask_child+'</span></div>'+'</li>';
            }
    
        result_li_js.innerHTML=li;
    }
    var locate_a=document.querySelectorAll(".locating");
    for(let i=0;i<locate_a.length;i++){
        locate_a[i].addEventListener("click",locateTo,false); 
    }
    
}
function search(){
    var li='';
    let searches=data.filter((item)=> item.properties.address.includes(search_input.value)||item.properties.name.includes(search_input.value));
    for(let i=0;i<searches.length;i++){
        function check_adult(num){
            if(num >10){
                return 'h-bg-primary';
            }else if(num<10&&num!==0){
                return 'h-bg-middle'
            }else{
                return 'h-bg-info';
            }
        }
        function check_child(num){
            if(num >10){
                return 'h-bg-primary';
            }else if(num<10&&num!==0){
                return 'h-bg-middle'
            }else{
                return 'h-bg-info';
            }
        }
        var a_num_back=check_adult(searches[i].properties.mask_adult);
        var c_num_back=check_child(searches[i].properties.mask_child);
        li+='<li>'+'<h1>'+searches[i].properties.name+'</h1><a  href="#" class="locating fas fa-location-arrow" data-lat="'+searches[i].geometry.coordinates[1]+'" data-long="'+searches[i].geometry.coordinates[0]+'"></a><p>'+searches[i].properties.address+'</p><p>'+
            searches[i].properties.phone+'</p><p>'+searches[i].properties.note+'<div class="adult_sq '+a_num_back+'"><span>成人口罩</span><span class="adult_num">'+
            searches[i].properties.mask_adult+'</span></div><div class="child_sq '+c_num_back+'"><span>兒童口罩</span><span class="child_num">'+
            searches[i].properties.mask_child+'</span></div>'+'</li>';
            result_li_js.innerHTML=li;
        }

        var locate_a=document.querySelectorAll(".locating");
    for(let i=0;i<locate_a.length;i++){
        locate_a[i].addEventListener("click", locateTo, false); 
    }
}
search_icon.addEventListener("click", search, false);

function locateTo(e){
    e.preventDefault();
    if(e.target.nodeName!=='A'){
        return;
    }
    const lng=Number(e.target.dataset.long);
    const lat=Number(e.target.dataset.lat);
    openMarker(lat,lng);
}
function openMarker(lat,lng){
    markers.eachLayer(function(layer){
        const everylat=layer._latlng.lat;
        const everylng=layer._latlng.lng;
        if(everylat==lat&&everylng==lng){
            markers.zoomToShowLayer(layer, function(){
                layer.openPopup();
            })
        }
    });
    
}


// https://huai-sian.github.io/maskmap/?code=MVRZD756LEm6YmXSlv0R&state=yu6PxB9Y
