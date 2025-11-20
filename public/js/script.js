const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(   
      (position) => {
       const {latitude , longitude} = position.coords;
       socket.emit("send-Location" , {latitude , longitude});
    },(error)=> {
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }
 );
}

const map = L.map("map").setView([0 , 0] , 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "OpenMap"
}).addTo(map);

const markers = {};

socket.on("receive-Location" , (data)=>{
    const {id , latitude , longitude} = data;
    map.setView([latitude , longitude] );
    if(markers[id]){
        markers[id].setLatLng([latitude , longitude]);
    }
    else{
        markers[id] = L.marker([latitude , longitude]).addTo(map);
    }
});

socket.on("user-disconnected" , (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

/* if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            console.log("✅ Position:", position.coords);
        },
        (error) => {
            console.error("❌ Geolocation error:", error);
            switch (error.code) {
                case 1:
                    alert("Permission denied. Please allow location access.");
                    break;
                case 2:
                    alert("Position unavailable. Turn on Wi-Fi or GPS.");
                    break;
                case 3:
                    alert("Location request timed out. Try again.");
                    break;
                default:
                    alert("An unknown error occurred.");
            }
        },
        {
            enableHighAccuracy: true,  // ✅ try to get GPS
            timeout: 5000,            // ✅ 10 seconds timeout
            maximumAge: 0
        }
    );
} else {
    alert("Geolocation is not supported by this browser.");
} */