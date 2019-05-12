var audio = new Audio();
var isPlaying = false;
var currentSong = -1;
var nextFreeID = -1;
var albums = [];

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
	loadAllSongs();
	
	var fileName = document.getElementById("formFileName").value;
	var	path = document.getElementById("formPath").value;
	var name = document.getElementById("formName").value;
	var artist = document.getElementById("formAritst").value;
	
	var song = { path: path+fileName, name: name, artist: artist, id:nextFreeID };
	song = JSON.stringify(song);
	
    var currentRow = songsTable.insertRow(-1);
	//currentRow.setAttribute("id",nextFreeID);

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
	
	
	
	var deleteButton = document.createElement("button");
	deleteButton.setAttribute("id","deleteButton");
	deleteButton.setAttribute("type","button");
	deleteButton.setAttribute("onclick","removeSong('"+ nextFreeID +"')");
	deleteButton.innerHTML = "X";

    var currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(playButton);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(songName);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(songArtist);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(deleteButton);
	
	var s = nextFreeID.toString();
	var s = "Song" + s;
	localStorage.setItem(s,song); 
	nextFreeID++;
	localStorage.setItem("nextFreeID",nextFreeID);
	
	loadLists();
}

function loadSong(path,name,artist,songID)
{
    var currentRow = songsTable.insertRow(-1);

	var playButton = document.createElement("button");
    playButton.setAttribute("type", "button");
	playButton.setAttribute("onclick", "play(" + songID + ")");
	playButton.setAttribute("id","songButton");
	playButton.innerHTML = ">";

	var songName = document.createElement("p");
	songName.setAttribute("id","songName");
	songName.innerHTML = name;

	var songArtist = document.createElement("p");
	songArtist.setAttribute("id","songArtist");
	songArtist.innerHTML = artist;
	
	var deleteButton = document.createElement("button");
	deleteButton.setAttribute("id","deleteButton");
	deleteButton.setAttribute("type","button");
	deleteButton.setAttribute("onclick","removeSong('"+ songID +"')");
	deleteButton.innerHTML = "X";
	

    var currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(playButton);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(songName);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(songArtist);
	currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(deleteButton);
	
}

function addSongToAlbum()
{
	var song = document.getElementById("songToAddList").options[document.getElementById("songToAddList").selectedIndex].value;
	var album = document.getElementById("albumToAddList").value;
		
	//localStorage.removeItem(album);
	var fromJSON = localStorage.getItem(album);
	var songs = [];
	songs =	JSON.parse(fromJSON);
	if(songs == null)
	{
		songs = [];
	}
	
	songs.push(song);
	var toJSON = JSON.stringify(songs);
	
	localStorage.setItem(album,toJSON);
	start();
}

function start() 
{
	//localStorage.clear();
	loadInfo();
	loadAllSongs();
	loadAlbums();
	loadLists();
}

function clearSongs()
{
	var table = document. getElementById("songsTable");
	for(var i = table. rows. length - 1; i >= 0; i--)
	{
		table. deleteRow(i);
	}
}

function loadSongsFromAlbum(album)
{
	clearSongs();
	var fromJSON = localStorage.getItem(album);
	var songs = JSON.parse(fromJSON);
	if(songs == null)
	{
		return;
	}
	for(var i = 0; i < songs.length; i++)
	{
		for(var j = 0; j < nextFreeID; j++)
		{
			if(parseInt(songs[i])==j)
			{
				fromJSON = localStorage.getItem("Song"+j);
				var song = JSON.parse(fromJSON);
				if(song == null)
				{
					continue;
				}
				loadSong(song.path,song.name,song.artist,j);
			}
		}
	}
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
		nextFreeID = v;
	}
	catch(error)
	{
		alert(error);
		localStorage.setItem("nextFreeID",0);
		v=0;
	}
}

function loadAllSongs()
{
	clearSongs();
	for(var i = 0; i < nextFreeID; i++)
	{
		var fromStorage = localStorage.getItem("Song" + i.toString());
		var song = JSON.parse(fromStorage);
		if(song == null)
		{
			continue;
		}
		loadSong(song.path,song.name,song.artist,i);
	}
}

function createAlbum()
{
	var album = document.getElementById("newAlbum").value;
	var albumButton = document.createElement("button");
	
    albumButton.setAttribute("type", "button");
	albumButton.setAttribute("id","albumButton");
	albumButton.setAttribute("onclick","loadSongsFromAlbum('"+albums+"')");
	albumButton.innerHTML = album;
	
	var deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
	deleteButton.setAttribute("id","deleteAlbumButton");
	deleteButton.setAttribute("onclick","removeAlbum('"+album+"')");
	deleteButton.innerHTML = "X";
	
	
    var currentRow = albumsTable.insertRow(-1);
    var currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(albumButton);
    var currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(deleteButton);
	
	if(albums == null)
	{
		albums = [];
	}
	albums.push(album);
	var toJSON = JSON.stringify(albums);
	localStorage.setItem("albums",toJSON);
	
	
	start();
}

function clearAlbums()
{
	var table = document. getElementById("albumsTable");
	for(var i = table. rows. length - 1; i >= 0; i--)
	{
		table. deleteRow(i);
	}
}

function loadAlbums()
{
	clearAlbums();
	var allAlbumButton = document.createElement("button");
	allAlbumButton.setAttribute("type", "button");
	allAlbumButton.setAttribute("onclick","loadAllSongs()");
	allAlbumButton.innerHTML = "All";
	
	var currentRow = albumsTable.insertRow(-1);
	var currentCell = currentRow.insertCell(-1);
	currentCell.appendChild(allAlbumButton);
	
	var alb = localStorage.getItem("albums");
	var fromJSON = JSON.parse(alb);
	albums = fromJSON;
	if(albums == null)
	{
		return;
	}
	for(var i = 0; i < albums.length; i++)
	{
		var albumButton = document.createElement("button");
		albumButton.setAttribute("type", "button");
		albumButton.setAttribute("id","albumButton");
		albumButton.setAttribute("onclick","loadSongsFromAlbum('"+albums[i]+"')");
		albumButton.innerHTML = albums[i];
	
		var deleteButton = document.createElement("button");
		deleteButton.setAttribute("type", "button");
		deleteButton.setAttribute("id","deleteAlbumButton");
		deleteButton.setAttribute("onclick","removeAlbum('"+albums[i]+"')");
		deleteButton.innerHTML = "X";
	
		
		var currentRow = albumsTable.insertRow(-1);
		var currentCell = currentRow.insertCell(-1);
		currentCell.appendChild(albumButton);
		var currentCell = currentRow.insertCell(-1);
		currentCell.appendChild(deleteButton);
	}
	
}

function loadLists()
{
	var songDatalist = document.getElementById("songToAddList");
	var addSong = "";
	for(var i = 0; i < nextFreeID; i++)
	{
		var fromStorage = localStorage.getItem("Song" + i.toString());
		var song = JSON.parse(fromStorage);
		if(song == null)
		{
			continue;
		}
		var option = "<option value='" + i +"'>" + song.name + "</option>"
		addSong += option;
	}
	songDatalist.innerHTML = addSong;
	
	
	
	var albumDatalist = document.getElementById("albumToAddList");
	var addAlbum = "";
	if(albums == null)
	{
		return;
	}
	for(var i = 0; i < albums.length; i++)
	{
		var option = "<option value='" + albums[i].toString() +"'>" + albums[i] + "</option>"
		addAlbum += option;
	}
	albumDatalist.innerHTML = addAlbum;
}

function removeSong(songID)
{
	localStorage.removeItem("Song"+songID);
	start();
}

function removeAlbum(album)
{
	var alb = localStorage.getItem("albums");
	var fromJSON = JSON.parse(alb);
	albums = fromJSON;
	
	for(var i = albums.length; i >= 0; i--)
	{
		if(albums[i] == album)
		{
			albums.splice(i,1);
		}
	}
	var toJSON = JSON.stringify(albums);
	localStorage.setItem("albums",toJSON);
	localStorage.removeItem(album);
	loadLists();
	loadAlbums();
	loadAllSongs();
}
