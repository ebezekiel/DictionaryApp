const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
let url2 = '';


// -------------------------------------------------------------------


let soundIcon = document.getElementById('sound-icon');
let sound = document.getElementById("sound");

// -------------------------------------------------------------------


function fetchWord(){
    let word = document.getElementById('text-input').value;
    if (word != ''){
        return fetch(`${url}${word}`);
    }
}

function getMeanings(d){

    // Set audio to meaning
    url2 = d[0].phonetics[0].audio;

    for (let i = 0; i < d[0].phonetics.length && url2 == ''; i++ ){
        url2 = d[0].phonetics[i].audio;
    }


    //Set 'key' as heading & add phonetics
    let phonetic = '';
    if (d[0].phonetic != undefined){
        phonetic = d[0].phonetic;
    }
    
    document.getElementById('word').innerText = 
    `${document.getElementById('text-input').value.toUpperCase()} \n ${phonetic}`;
    document.getElementById('text-input').value = '';

    let elem = ``;


    let allMeaning = d[0].meanings;
    
    for (let i = 0; i<allMeaning.length; i++){ //looping over 'meanings" array
        let iMeaning = allMeaning[i];   //picking one 'set' (partOfSpeech) at a time
        elem+= `<div> 
                    <p>
                        ${allMeaning[i].partOfSpeech}
                    </p>
                    <ol class="definitions">`
        
        for (let j=0; j < iMeaning.definitions.length; j++){
            // Sequentially add meanings to "elem"
            let jMeaning = iMeaning.definitions[j].definition;
            let usage='';
            let divClass='';

            if (iMeaning.definitions[j].example){
                usage= 'Usage: ' + iMeaning.definitions[j].example;
                divClass= 'usage'
            }
            elem += `<li class='items'>${jMeaning} <br><div class=${divClass}>${usage} </div> </li>`
        }

        // Close off the added element
        elem+= `</ol>
                    </div>`

                }

                return [elem, url2];
}

function setMeaning(d){
    document.getElementById('article').innerHTML = d[0];
    return d[1];
}

function setAudio(d){
    console.log(`This is setAudio func ${d}`);

    if (d == ''){
        sound.src= '';
        soundIcon.innerHTML = `<box-icon name='volume-mute'></box-icon>`;
    }
    else{
        console.log("In setAudio");
        soundIcon.innerHTML = `<box-icon name='volume-full'></box-icon>`;
        sound.src= d;
    }
    console.log(d == '');
}

function errorFunction(){
    document.getElementById('word').innerText = document.getElementById('text-input').value;
    document.getElementById('text-input').value = '';
    sound.src= '';
    soundIcon.innerHTML = `<box-icon name='volume-mute'></box-icon>`;
}

function run(){
    fetchWord()
    .then((response) => response.json())
    .then((data) => getMeanings(data))
    .then((meaning)=> setMeaning(meaning))
    .then((audio)=> setAudio(audio) )
    .catch(() => {
        document.getElementById('article').innerHTML = `<h1><u>NEOLOGISM</u> suspected</h1>`;
       errorFunction();
    }) 
}


let btn = document.getElementById('search-icon');
btn.addEventListener('click', run );

soundIcon.addEventListener("click", function(){
    sound.play()
    .catch(() => {});
} )