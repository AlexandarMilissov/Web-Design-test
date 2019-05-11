var audio = new Audio();
var isPlaying = false;
var currentSong = -1;
var nextFreeID = -1;

function play(songID)
{
	if(currentSong == songID)
	{
		if(!isPlaying)
		{
			audio.play();
		}
		else
		{
			audio.pause();
		}
		isPlaying = !isPlaying;
	}
	else
	{
		audio.pause();
		currentSong = songID;
		var fromStorage = localStorage.getItem("Song" + songID.toString());
		var song = JSON.parse(fromStorage);
		audio = new Audio("file:///" + song.path);
		audio.play();
		isPlaying = true;
	}
}


function expandSongs()
{
	var fileName = document.getElementById("formFileName").value;
	var	path = document.getElementById("formPath").value;
	var name = document.getElementById("formName").value;
	var artist = document.getElementById("formAritst").value;
	
	var song = { path: path+fileName, name: name, artist: artist };
	song = JSON.stringify(song);
	
	var currentIndex = songsTable.rows.length;
    var currentRow = songsTable.insertRow(-1);

	var playButton = document.createElement("button");
    playButton.setAttribute("type", "button");
	playButton.setAttribute("onclick", "play(" + nextFreeID + ")");
	playButton.setAttribute("id","songButton");
	playButton.innerHTML = ">";

	var songName = document.createElement("p");
	songName.setAttribute("id","songName");
	songName.innerHTML = name;

	var songArtist = document.createElement("p");
	songArtist.setAttribute("id","songArtist");
	songArtist.innerHTML = artist;

    var currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(playButton);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(songName);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(songArtist);
	
	var s = nextFreeID.toString();
	var s = "Song" + s;
	localStorage.setItem(s,song); 
	nextFreeID++;
	localStorage.setItem("nextFreeID",nextFreeID);
}
function loadSong(path,name,artist)
{
	var currentIndex = songsTable.rows.length;
    var currentRow = songsTable.insertRow(-1);

	var playButton = document.createElement("button");
    playButton.setAttribute("type", "button");
	playButton.setAttribute("onclick", "play(" + nextFreeID + ")");
	playButton.setAttribute("id","songButton");
	playButton.innerHTML = ">";

	var songName = document.createElement("p");
	songName.setAttribute("id","songName");
	songName.innerHTML = name;

	var songArtist = document.createElement("p");
	songArtist.setAttribute("id","songArtist");
	songArtist.innerHTML = artist;

    var currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(playButton);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(songName);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(songArtist);
}
function start() 
{
	loadInfo();
	loadSongs();
}

function loadInfo()
{
	try
	{
		var num = localStorage.getItem("nextFreeID");
		if(num == null)
		{
			localStorage.setItem("nextFreeID",0);
			v = 0;
		}
		else
		{
			var v = parseInt(num,10);
		}
		//localStorage.setItem("nextFreeID",v+1);
		nextFreeID = v;
	}
	catch(error)
	{
		alert(error);
		localStorage.setItem("nextFreeID",0);
		v=0;
	}
	//localStorage.clear();
}
function loadSongs()
{
	for(var i = 0; i < nextFreeID; i++)
	{
		var fromStorage = localStorage.getItem("Song" + i.toString());
		var song = JSON.parse(fromStorage);
		loadSong(song.path,song.name,song.artist);
	}
}

