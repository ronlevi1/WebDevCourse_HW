const skins = ["./SKINS/basic.css", "./SKINS/dark.css", "./SKINS/modern.css", "audioList.css"];

let currentSkin = 0;
function changeTheme(){
    currentSkin = (currentSkin + 1) % skins.length;
    document.querySelector("link[rel='stylesheet']").href = skins[currentSkin]
}